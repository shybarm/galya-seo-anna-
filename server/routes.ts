import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertAppointmentSchema, insertAnalyticsEventSchema } from "@shared/schema";
import { emailService } from "./email";
import { analyzeSymptoms, getUrgencyLabel } from "./triage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1, "הודעה לא יכולה להיות ריקה"),
  context: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional()
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // POST /api/contact - Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      // Send email notification (async, don't block response)
      emailService.sendContactNotification(contact).catch((err) => {
        console.error("Failed to send email notification:", err);
      });
      
      res.status(201).json({ 
        success: true, 
        message: "פנייתך התקבלה בהצלחה. ניצור איתך קשר בהקדם.",
        id: contact.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "נא למלא את כל השדות הנדרשים",
          errors: error.errors 
        });
      } else {
        console.error("Contact submission error:", error);
        res.status(500).json({ 
          success: false, 
          message: "אירעה שגיאה. נא לנסות שנית." 
        });
      }
    }
  });

  // GET /api/updates - Get medical updates
  app.get("/api/updates", async (_req, res) => {
    try {
      const updates = await storage.getMedicalUpdates();
      const serialized = updates.map(u => ({
        ...u,
        publishedAt: u.publishedAt.toISOString()
      }));
      res.json(serialized);
    } catch (error) {
      console.error("Medical updates fetch error:", error);
      res.status(500).json({ 
        success: false, 
        message: "אירעה שגיאה בטעינת העדכונים" 
      });
    }
  });

  // POST /api/chat - AI Triage chat with medical decision trees
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      const { message } = validatedData;

      // Use medical triage decision tree
      const triageResult = analyzeSymptoms(message);

      res.json({
        success: true,
        response: triageResult.response,
        type: triageResult.urgencyLevel,
        category: triageResult.category,
        urgencyLabel: getUrgencyLabel(triageResult.urgencyLevel),
        followUp: triageResult.followUp,
        showContactButton: triageResult.showContactButton,
        showEmergencyWarning: triageResult.showEmergencyWarning
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "הודעה לא תקינה",
          errors: error.errors 
        });
      } else {
        console.error("Chat error:", error);
        res.status(500).json({ 
          success: false, 
          message: "אירעה שגיאה. נא לנסות שנית." 
        });
      }
    }
  });

  // GET /api/appointments/slots - Get available time slots for a date
  app.get("/api/appointments/slots", async (req, res) => {
    try {
      const dateStr = req.query.date as string;
      if (!dateStr) {
        return res.status(400).json({ 
          success: false, 
          message: "נא לספק תאריך" 
        });
      }
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ 
          success: false, 
          message: "תאריך לא תקין" 
        });
      }
      
      const slots = await storage.getAvailableSlots(date);
      res.json({ success: true, slots });
    } catch (error) {
      console.error("Slots fetch error:", error);
      res.status(500).json({ 
        success: false, 
        message: "אירעה שגיאה בטעינת השעות הפנויות" 
      });
    }
  });

  // POST /api/appointments - Create a new appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "התור נקבע בהצלחה! נשלח אליך אישור בקרוב.",
        appointment 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "נא למלא את כל השדות הנדרשים",
          errors: error.errors 
        });
      } else {
        console.error("Appointment creation error:", error);
        res.status(500).json({ 
          success: false, 
          message: "אירעה שגיאה בקביעת התור. נא לנסות שנית." 
        });
      }
    }
  });

  // POST /api/analytics/track - Track analytics event
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const eventData = {
        ...req.body,
        userAgent: req.headers["user-agent"] || null,
        referrer: req.headers["referer"] || null,
      };
      const validatedData = insertAnalyticsEventSchema.parse(eventData);
      const event = await storage.trackEvent(validatedData);
      
      res.status(201).json({ 
        success: true, 
        id: event.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid event data",
          errors: error.errors 
        });
      } else {
        console.error("Analytics tracking error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to track event" 
        });
      }
    }
  });

  // GET /api/analytics - Get analytics events (for admin/reporting)
  app.get("/api/analytics", async (_req, res) => {
    try {
      const events = await storage.getAnalyticsEvents();
      res.json({ success: true, events });
    } catch (error) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch analytics" 
      });
    }
  });

  // POST /api/objects/upload - Get presigned URL for file upload
  app.post("/api/objects/upload", async (_req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Upload URL generation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate upload URL" 
      });
    }
  });

  // GET /objects/:objectPath(*) - Serve uploaded files (public access for medical files)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // PUT /api/medical-files - Normalize uploaded file path for storage
  app.put("/api/medical-files", async (req, res) => {
    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.fileURL);
      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error normalizing file path:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
