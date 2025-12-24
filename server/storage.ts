import { 
  users,
  contactSubmissions,
  medicalUpdates,
  appointments,
  analyticsEvents,
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContact,
  type MedicalUpdate,
  type InsertMedicalUpdate,
  type Appointment,
  type InsertAppointment,
  type AnalyticsEvent,
  type InsertAnalyticsEvent
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<ContactSubmission>;
  getContacts(): Promise<ContactSubmission[]>;
  getMedicalUpdates(): Promise<MedicalUpdate[]>;
  createMedicalUpdate(update: InsertMedicalUpdate): Promise<MedicalUpdate>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAvailableSlots(date: Date): Promise<string[]>;
  trackEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(): Promise<AnalyticsEvent[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<ContactSubmission> {
    const [contact] = await db
      .insert(contactSubmissions)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }

  async getMedicalUpdates(): Promise<MedicalUpdate[]> {
    return await db
      .select()
      .from(medicalUpdates)
      .orderBy(desc(medicalUpdates.publishedAt));
  }

  async createMedicalUpdate(insertUpdate: InsertMedicalUpdate): Promise<MedicalUpdate> {
    const [update] = await db
      .insert(medicalUpdates)
      .values(insertUpdate)
      .returning();
    return update;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay)
        )
      )
      .orderBy(appointments.appointmentDate);
  }

  async getAvailableSlots(date: Date): Promise<string[]> {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return [];
    }
    
    const allSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];
    
    const bookedAppointments = await this.getAppointmentsByDate(date);
    const bookedTimes = bookedAppointments
      .filter(apt => apt.status !== "cancelled")
      .map(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return `${aptDate.getHours().toString().padStart(2, '0')}:${aptDate.getMinutes().toString().padStart(2, '0')}`;
      });
    
    return allSlots.filter(slot => !bookedTimes.includes(slot));
  }

  async trackEvent(insertEvent: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [event] = await db
      .insert(analyticsEvents)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
    return await db
      .select()
      .from(analyticsEvents)
      .orderBy(desc(analyticsEvents.createdAt));
  }
}

export const storage = new DatabaseStorage();
