import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { clinicInfo } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackContactFormSubmit, trackPhoneClick, trackEmailClick, trackWhatsAppClick } from "@/lib/analytics";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "נא להזין שם מלא"),
  phone: z.string().min(9, "נא להזין מספר טלפון תקין"),
  email: z.string().email("נא להזין כתובת אימייל תקינה"),
  subject: z.string().min(2, "נא לבחור נושא"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response;
    },
    onSuccess: (_, variables) => {
      setIsSubmitted(true);
      form.reset();
      trackContactFormSubmit(variables.subject);
      toast({
        title: "הבקשה נשלחה בהצלחה",
        description: "ניצור איתכם קשר בהקדם",
      });
    },
    onError: () => {
      toast({
        title: "שגיאה בשליחה",
        description: "נא לנסות שוב מאוחר יותר",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <section
      id="contact"
      className="py-16 lg:py-24 bg-background"
      data-testid="section-contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm font-heebo text-primary font-medium">
              קביעת תור
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heebo font-bold text-foreground mb-4">
            יצירת קשר
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            נשמח לסייע לכם באבחון וטיפול מקצועי
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 lg:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-heebo font-semibold text-foreground mb-2">
                    הבקשה נשלחה בהצלחה!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    ניצור איתכם קשר בהקדם האפשרי
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="font-heebo"
                  >
                    שליחת בקשה נוספת
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-heebo">שם מלא</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="הזינו את שמכם"
                                {...field}
                                data-testid="input-fullname"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-heebo">טלפון</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="050-1234567"
                                {...field}
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-heebo">אימייל</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-heebo">נושא הפנייה</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="למשל: קביעת תור לאבחון אלרגיה"
                              {...field}
                              data-testid="input-subject"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-heebo">תיאור קצר (אופציונלי)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="ספרו לנו קצת על הבעיה..."
                              className="resize-none"
                              rows={4}
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full font-heebo"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          שולח...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 ml-2" />
                          שליחת בקשה
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-heebo font-semibold text-foreground mb-4">
                פרטי המרפאה
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heebo font-medium text-foreground">טלפון</p>
                    <a
                      href={`tel:${clinicInfo.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      data-testid="link-contact-phone"
                      onClick={trackPhoneClick}
                    >
                      {clinicInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heebo font-medium text-foreground">WhatsApp</p>
                    <a
                      href={`https://wa.me/${clinicInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      data-testid="link-contact-whatsapp"
                      onClick={trackWhatsAppClick}
                    >
                      שלחו הודעה
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heebo font-medium text-foreground">אימייל</p>
                    <a
                      href={`mailto:${clinicInfo.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      data-testid="link-contact-email"
                      onClick={trackEmailClick}
                    >
                      {clinicInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heebo font-medium text-foreground">כתובת</p>
                    <p className="text-muted-foreground">{clinicInfo.address}</p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-heebo font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                שעות פעילות
              </h3>
              <ul className="space-y-3">
                {clinicInfo.hours.map((schedule, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <span className="font-heebo text-foreground">{schedule.day}</span>
                    <span className="text-muted-foreground">{schedule.time}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-muted/50">
              <div className="aspect-video rounded-md overflow-hidden" data-testid="map-clinic-location">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(clinicInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מיקום המרפאה"
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                  data-testid="link-open-google-maps"
                >
                  <MapPin className="w-4 h-4" />
                  פתח ב-Google Maps
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
