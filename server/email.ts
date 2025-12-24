import type { ContactSubmission } from "@shared/schema";

interface EmailService {
  sendContactNotification(contact: ContactSubmission): Promise<boolean>;
}

class EmailServiceImpl implements EmailService {
  private resendApiKey: string | undefined;
  private fromEmail: string;
  private toEmail: string;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY;
    this.fromEmail = "contact@resend.dev"; // Will be updated with verified domain
    this.toEmail = "clinic@example.com"; // Clinic email for notifications
  }

  async sendContactNotification(contact: ContactSubmission): Promise<boolean> {
    if (!this.resendApiKey) {
      console.log("[Email] Resend API key not configured. Email notification skipped.");
      console.log("[Email] Contact submission received:", {
        name: contact.fullName,
        subject: contact.subject,
        phone: contact.phone
      });
      return false;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: this.toEmail,
          subject: `פנייה חדשה מהאתר: ${contact.subject}`,
          html: this.buildEmailHtml(contact),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[Email] Failed to send notification:", error);
        return false;
      }

      console.log("[Email] Notification sent successfully for:", contact.fullName);
      return true;
    } catch (error) {
      console.error("[Email] Error sending notification:", error);
      return false;
    }
  }

  private buildEmailHtml(contact: ContactSubmission): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0d9488; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #1f2937; margin-top: 5px; }
          .footer { padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>פנייה חדשה מהאתר</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">שם מלא:</div>
              <div class="value">${contact.fullName}</div>
            </div>
            <div class="field">
              <div class="label">טלפון:</div>
              <div class="value">${contact.phone}</div>
            </div>
            <div class="field">
              <div class="label">אימייל:</div>
              <div class="value">${contact.email}</div>
            </div>
            <div class="field">
              <div class="label">נושא:</div>
              <div class="value">${contact.subject}</div>
            </div>
            ${contact.message ? `
            <div class="field">
              <div class="label">הודעה:</div>
              <div class="value">${contact.message}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">תאריך:</div>
              <div class="value">${contact.createdAt.toLocaleString('he-IL')}</div>
            </div>
          </div>
          <div class="footer">
            פנייה זו התקבלה דרך אתר ד״ר אנה ברמלי
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailServiceImpl();
