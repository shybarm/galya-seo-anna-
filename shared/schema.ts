import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Medical updates/articles
export const medicalUpdates = pgTable("medical_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
});

export const insertMedicalUpdateSchema = createInsertSchema(medicalUpdates).omit({
  id: true,
});

export type InsertMedicalUpdate = z.infer<typeof insertMedicalUpdateSchema>;
export type MedicalUpdate = typeof medicalUpdates.$inferSelect;

// Chat messages for AI assistant (stored temporarily)
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Appointments for scheduling
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  patientEmail: text("patient_email").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentType: text("appointment_type").notNull(),
  notes: text("notes"),
  medicalFiles: text("medical_files").array(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointments, {
  appointmentDate: z.string().transform((val) => new Date(val)),
  medicalFiles: z.array(z.string()).optional(),
}).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Analytics events for conversion tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), // 'contact_form', 'appointment_booking', 'chat_open', 'phone_click', 'email_click'
  eventCategory: text("event_category").notNull(), // 'conversion', 'engagement', 'interaction'
  eventData: text("event_data"), // JSON string for additional data
  sessionId: varchar("session_id"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// TypeScript interfaces for frontend use
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export interface Condition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  icon: string;
  faqs: FAQ[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface DoctorInfo {
  name: string;
  nameHebrew: string;
  title: string;
  specialization: string;
  education: string[];
  experience: string[];
  philosophy: string;
  imageUrl: string;
}

export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: { day: string; time: string }[];
  mapUrl: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}
