import { dbStore, saveDb } from "./dbStore.js";
import { AppointmentStatus, UserRole } from "../types.js";

export interface ServiceLogEntry {
  timestamp: string;
  action: string;
  details: string;
}

class AppointmentNotificationService {
  private intervalId: NodeJS.Timeout | null = null;
  private logs: ServiceLogEntry[] = [];
  private isRunning: boolean = false;
  private checkIntervalMs: number = 60000; // default 1 minute

  constructor() {
    this.addLog("Service initialized", "Ready to start automated checks");
  }

  private addLog(action: string, details: string) {
    this.logs.unshift({
      timestamp: new Date().toISOString(),
      action,
      details,
    });
    // Cap log size
    if (this.logs.length > 50) {
      this.logs.pop();
    }
    console.log(`[AppointmentNotificationService] ${action}: ${details}`);
  }

  public getStatus() {
    const notifications = dbStore.getNotifications();
    const scheduledNotifications = notifications
      .filter(n => n.type === "REMINDER" && n.scheduledAt)
      .map(n => {
        const user = dbStore.getUsers().find(u => u.id === n.userId);
        return {
          id: n.id,
          patientName: user ? `${user.firstName} ${user.lastName}` : `Patient ID: ${n.userId}`,
          message: n.message,
          scheduledAt: n.scheduledAt!,
          isSent: n.isSent || false,
          appointmentId: n.appointmentId
        };
      })
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    return {
      isRunning: this.isRunning,
      checkIntervalMs: this.checkIntervalMs,
      logs: this.logs,
      lastCheck: this.logs.find(l => l.action === "Check Executed")?.timestamp || null,
      queue: scheduledNotifications,
    };
  }

  /**
   * Starts the automated background timer to check for reminders
   */
  public start(intervalMs: number = 60000) {
    if (this.isRunning) {
      this.addLog("Service Start", "Service is already running");
      return;
    }

    this.checkIntervalMs = intervalMs;
    this.isRunning = true;
    this.addLog("Service Started", `Background checker running every ${this.checkIntervalMs / 1000}s`);

    // Run first check immediately
    this.checkAndSendReminders();

    this.intervalId = setInterval(() => {
      this.checkAndSendReminders();
    }, this.checkIntervalMs);
  }

  /**
   * Stops the background timer
   */
  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.addLog("Service Stopped", "Background checker deactivated");
  }

  /**
   * Scans all active appointments and ensures a corresponding scheduled notification
   * database table record exists.
   */
  public ensureNotificationRecordsScheduled() {
    const appointments = dbStore.getAppointments();
    const users = dbStore.getUsers();
    const doctors = dbStore.getDoctors();
    const notifications = dbStore.getNotifications();

    for (const app of appointments) {
      // Only schedule reminders for active (PENDING or CONFIRMED) appointments
      if (app.status !== AppointmentStatus.PENDING && app.status !== AppointmentStatus.CONFIRMED) {
        continue;
      }

      // Check if we already have a scheduled reminder notification in the database for this appointment
      const existingRem = notifications.find(n => n.appointmentId === app.id && n.type === "REMINDER");
      if (existingRem) {
        continue;
      }

      try {
        const appDateTimeStr = `${app.appointmentDate}T${app.slotTime}:00`;
        const appDate = new Date(appDateTimeStr);
        if (isNaN(appDate.getTime())) {
          continue;
        }

        // Calculate scheduled trigger time (e.g., 24 hours before the appointment)
        const triggerTime = new Date(appDate.getTime() - 24 * 60 * 60 * 1000);

        const doc = doctors.find(d => d.id === app.doctorId);
        const docUser = doc ? users.find(u => u.id === doc.userId) : null;
        const docName = docUser ? `Dr. ${docUser.firstName} ${docUser.lastName}` : "your specialist";

        // Create the notification record in a SCHEDULED state (isSent = false)
        const message = `Automated Reminder: Your scheduled appointment with ${docName} is coming up on ${app.appointmentDate} at ${app.slotTime}. Please arrive 10 minutes early.`;

        dbStore.addNotification({
          id: `noti_rem_sched_${app.id}`,
          userId: app.patientId,
          message,
          type: "REMINDER",
          isRead: false,
          createdAt: new Date().toISOString(),
          scheduledAt: triggerTime.toISOString(),
          isSent: false,
          appointmentId: app.id
        });

        this.addLog(
          "Notification Scheduled",
          `Scheduled reminder in notifications table for patient ID ${app.patientId} (appointment ${app.id}) on ${app.appointmentDate} at ${app.slotTime}`
        );
      } catch (err) {
        console.error(`Error scheduling notification for appointment ${app.id}:`, err);
      }
    }
  }

  /**
   * Syncs existing scheduled notification records if an appointment's date/time changes or if it gets cancelled.
   */
  public syncNotificationRecords() {
    const appointments = dbStore.getAppointments();
    const notifications = dbStore.getNotifications();
    const doctors = dbStore.getDoctors();
    const users = dbStore.getUsers();

    // 1. Ensure records are scheduled
    this.ensureNotificationRecordsScheduled();

    // 2. Sync / Update or Cancel notifications for appointments that changed
    const unsentReminders = notifications.filter(n => n.type === "REMINDER" && n.appointmentId && n.isSent === false);

    for (const rem of unsentReminders) {
      const app = appointments.find(a => a.id === rem.appointmentId);
      
      // If the appointment no longer exists or is cancelled / completed, cancel/mark-sent or remove the notification
      if (!app || (app.status !== AppointmentStatus.PENDING && app.status !== AppointmentStatus.CONFIRMED)) {
        rem.isSent = true;
        rem.message = `Cancelled: ${rem.message}`;
        this.addLog("Notification Cancelled", `Cancelled scheduled reminder for appointment ${rem.appointmentId}`);
        saveDb();
        continue;
      }

      // Check if date or slotTime changed
      const appDateTimeStr = `${app.appointmentDate}T${app.slotTime}:00`;
      const appDate = new Date(appDateTimeStr);
      if (isNaN(appDate.getTime())) continue;

      const triggerTime = new Date(appDate.getTime() - 24 * 60 * 60 * 1000);
      const expectedScheduledStr = triggerTime.toISOString();

      if (rem.scheduledAt !== expectedScheduledStr) {
        const oldScheduled = rem.scheduledAt;
        rem.scheduledAt = expectedScheduledStr;
        
        const doc = doctors.find(d => d.id === app.doctorId);
        const docUser = doc ? users.find(u => u.id === doc.userId) : null;
        const docName = docUser ? `Dr. ${docUser.firstName} ${docUser.lastName}` : "your specialist";
        
        rem.message = `Automated Reminder: Your scheduled appointment with ${docName} is coming up on ${app.appointmentDate} at ${app.slotTime}. Please arrive 10 minutes early.`;
        
        this.addLog(
          "Notification Rescheduled",
          `Updated reminder for app ${app.id} from ${oldScheduled} to ${expectedScheduledStr}`
        );
        saveDb();
      }
    }
  }

  /**
   * Core logic: Checks all active scheduled notification database table records,
   * dispatches automated reminder notifications if they are due, and updates status.
   */
  public checkAndSendReminders(): { sentCount: number; processedApps: string[] } {
    // Force sync of notification records first
    this.syncNotificationRecords();

    const notifications = dbStore.getNotifications();
    const appointments = dbStore.getAppointments();
    const users = dbStore.getUsers();

    let sentCount = 0;
    const processedApps: string[] = [];
    const now = new Date();

    // Loop through notification records
    for (const rem of notifications) {
      // Trigger if type is REMINDER, has scheduledAt, and not sent
      if (rem.type !== "REMINDER" || !rem.scheduledAt || rem.isSent === true) {
        continue;
      }

      try {
        const triggerDate = new Date(rem.scheduledAt);
        if (isNaN(triggerDate.getTime())) {
          continue;
        }

        // Is it time to trigger? (i.e. scheduledAt <= now)
        if (now.getTime() >= triggerDate.getTime()) {
          // Double-check if appointment is active/valid
          if (rem.appointmentId) {
            const app = appointments.find(a => a.id === rem.appointmentId);
            if (!app || (app.status !== AppointmentStatus.PENDING && app.status !== AppointmentStatus.CONFIRMED)) {
              rem.isSent = true;
              saveDb();
              continue;
            }
          }

          // Trigger the notification!
          rem.isSent = true;
          rem.createdAt = new Date().toISOString(); // refresh creation time for visibility in patient's dashboard
          
          saveDb();

          if (rem.appointmentId) {
            dbStore.updateAppointment({
              id: rem.appointmentId,
              reminderSent: true
            });
            processedApps.push(rem.appointmentId);
          }

          sentCount++;

          const patientUser = users.find(u => u.id === rem.userId);
          const patientName = patientUser ? `${patientUser.firstName} ${patientUser.lastName}` : `ID: ${rem.userId}`;

          this.addLog(
            "Reminder Sent",
            `Dispatched automated reminder notification ${rem.id} to patient ${patientName}`
          );
        }
      } catch (err: any) {
        console.error(`Error processing scheduled notification ID ${rem.id}:`, err);
      }
    }

    this.addLog(
      "Check Executed",
      `Completed check on notification table records. Reminders dispatched: ${sentCount}`
    );

    return { sentCount, processedApps };
  }
}

export const notificationService = new AppointmentNotificationService();
