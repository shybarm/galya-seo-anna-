import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, startOfDay, isBefore } from "date-fns";
import { he } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Paperclip,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackAppointmentBooking } from "@/lib/analytics";
import { ObjectUploader } from "@/components/ObjectUploader";

const appointmentTypes = [
  { value: "consultation", label: "ייעוץ ראשוני" },
  { value: "food-allergy", label: "בדיקת אלרגיה למזון" },
  { value: "skin-test", label: "בדיקת עור" },
  { value: "asthma", label: "בדיקת אסתמה" },
  { value: "drug-allergy", label: "בדיקת אלרגיה לתרופות" },
  { value: "followup", label: "ביקור מעקב" },
];

const appointmentFormSchema = z.object({
  patientName: z.string().min(2, "נא להזין שם מלא"),
  patientPhone: z.string().min(9, "נא להזין מספר טלפון תקין"),
  patientEmail: z.string().email("נא להזין כתובת אימייל תקינה"),
  appointmentType: z.string().min(1, "נא לבחור סוג תור"),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export function AppointmentSection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time" | "form" | "success">("date");
  const [weekOffset, setWeekOffset] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      appointmentType: "",
      notes: "",
    },
  });

  const { data: slotsData, isLoading: slotsLoading } = useQuery<{ success: boolean; slots: string[] }>({
    queryKey: ["/api/appointments/slots", selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return { success: true, slots: [] };
      const response = await fetch(`/api/appointments/slots?date=${selectedDate.toISOString()}`);
      return response.json();
    },
    enabled: !!selectedDate,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      if (!selectedDate || !selectedTime) {
        throw new Error("Missing date or time");
      }
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes, 0, 0);

      const response = await apiRequest("POST", "/api/appointments", {
        ...data,
        appointmentDate: appointmentDate.toISOString(),
        medicalFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });
      return response;
    },
    onSuccess: (_, variables) => {
      setStep("success");
      form.reset();
      trackAppointmentBooking(variables.appointmentType);
      toast({
        title: "התור נקבע בהצלחה",
        description: "נשלח אליך אישור בקרוב",
      });
    },
    onError: () => {
      toast({
        title: "שגיאה בקביעת התור",
        description: "נא לנסות שוב מאוחר יותר",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    submitMutation.mutate(data);
  };

  const getWeekDays = () => {
    const today = startOfDay(new Date());
    const startDate = addDays(today, weekOffset * 7);
    const days: Date[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      if (!isBefore(date, today)) {
        days.push(date);
      }
    }
    return days;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6;
  };

  const resetBooking = () => {
    setStep("date");
    setSelectedDate(null);
    setSelectedTime(null);
    setUploadedFiles([]);
    form.reset();
  };

  return (
    <section
      id="appointment"
      className="py-16 lg:py-24 bg-muted/30"
      data-testid="section-appointment"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-heebo text-primary font-medium">
              קביעת תור אונליין
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heebo font-bold text-foreground mb-4">
            קביעת תור
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            בחרו תאריך ושעה נוחים לכם ונשמח לארח אתכם במרפאה
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 lg:p-8">
            {step === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heebo font-semibold text-foreground mb-2">
                  התור נקבע בהצלחה!
                </h3>
                <p className="text-muted-foreground mb-2">
                  {selectedDate && format(selectedDate, "EEEE, d בMMMM yyyy", { locale: he })}
                </p>
                <p className="text-lg font-semibold text-primary mb-6">
                  בשעה {selectedTime}
                </p>
                <p className="text-muted-foreground mb-6">
                  נשלח אליכם אישור בקרוב. במידה ותצטרכו לשנות או לבטל את התור, צרו איתנו קשר.
                </p>
                <Button
                  variant="outline"
                  onClick={resetBooking}
                  className="font-heebo"
                  data-testid="button-book-another"
                >
                  קביעת תור נוסף
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex items-center gap-2 ${step === "date" ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "date" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      1
                    </div>
                    <span className="text-sm font-heebo hidden sm:inline">בחירת תאריך</span>
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <div className={`flex items-center gap-2 ${step === "time" ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "time" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      2
                    </div>
                    <span className="text-sm font-heebo hidden sm:inline">בחירת שעה</span>
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <div className={`flex items-center gap-2 ${step === "form" ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "form" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      3
                    </div>
                    <span className="text-sm font-heebo hidden sm:inline">פרטים אישיים</span>
                  </div>
                </div>

                {step === "date" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                        disabled={weekOffset === 0}
                        data-testid="button-prev-week"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <h3 className="text-lg font-heebo font-medium text-foreground">
                        {format(addDays(new Date(), weekOffset * 7), "MMMM yyyy", { locale: he })}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setWeekOffset(weekOffset + 1)}
                        disabled={weekOffset >= 4}
                        data-testid="button-next-week"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-6">
                      {getWeekDays().map((date) => {
                        const isDisabled = isWeekend(date);
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedDate(date);
                              }
                            }}
                            disabled={isDisabled}
                            className={`p-3 rounded-md text-center transition-colors ${
                              isDisabled
                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                : isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 hover:bg-muted text-foreground hover-elevate"
                            }`}
                            data-testid={`button-date-${format(date, "yyyy-MM-dd")}`}
                          >
                            <div className="text-xs font-heebo mb-1">
                              {format(date, "EEE", { locale: he })}
                            </div>
                            <div className="text-lg font-semibold">
                              {format(date, "d")}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {selectedDate && (
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                          תאריך נבחר: {format(selectedDate, "EEEE, d בMMMM", { locale: he })}
                        </p>
                        <Button
                          onClick={() => setStep("time")}
                          className="font-heebo"
                          data-testid="button-continue-to-time"
                        >
                          המשך לבחירת שעה
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {step === "time" && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep("date")}
                        className="font-heebo"
                        data-testid="button-back-to-date"
                      >
                        <ChevronRight className="w-4 h-4 ml-1" />
                        חזרה
                      </Button>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-foreground font-heebo">
                        {selectedDate && format(selectedDate, "EEEE, d בMMMM", { locale: he })}
                      </span>
                    </div>

                    {slotsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : slotsData?.slots && slotsData.slots.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
                          {slotsData.slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`p-3 rounded-md text-center transition-colors ${
                                selectedTime === slot
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted/50 hover:bg-muted text-foreground hover-elevate"
                              }`}
                              data-testid={`button-time-${slot.replace(":", "")}`}
                            >
                              <Clock className="w-4 h-4 mx-auto mb-1" />
                              <span className="font-heebo">{slot}</span>
                            </button>
                          ))}
                        </div>
                        {selectedTime && (
                          <div className="text-center">
                            <p className="text-muted-foreground mb-4">
                              שעה נבחרה: {selectedTime}
                            </p>
                            <Button
                              onClick={() => setStep("form")}
                              className="font-heebo"
                              data-testid="button-continue-to-form"
                            >
                              המשך למילוי פרטים
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                          אין תורים פנויים בתאריך זה. נא לבחור תאריך אחר.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setStep("date")}
                          className="font-heebo"
                        >
                          חזרה לבחירת תאריך
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {step === "form" && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep("time")}
                        className="font-heebo"
                        data-testid="button-back-to-time"
                      >
                        <ChevronRight className="w-4 h-4 ml-1" />
                        חזרה
                      </Button>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-foreground font-heebo">
                        {selectedDate && format(selectedDate, "EEEE, d בMMMM", { locale: he })} בשעה {selectedTime}
                      </span>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="patientName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-heebo flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  שם מלא
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="הזינו את שמכם"
                                    {...field}
                                    data-testid="input-patient-name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="patientPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-heebo flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  טלפון
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="050-1234567"
                                    {...field}
                                    data-testid="input-patient-phone"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="patientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heebo flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                אימייל
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                  data-testid="input-patient-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="appointmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heebo flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                סוג התור
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-appointment-type">
                                    <SelectValue placeholder="בחרו סוג תור" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {appointmentTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                      data-testid={`option-${type.value}`}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-heebo">הערות (אופציונלי)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="מידע נוסף שחשוב לנו לדעת..."
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                  data-testid="input-notes"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 font-heebo text-sm font-medium">
                            <Paperclip className="w-4 h-4" />
                            <span>חומר רפואי</span>
                            <span className="text-muted-foreground font-normal">(אופציונלי)</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            ניתן להעלות קבצים רפואיים כגון תוצאות בדיקות, צילומים או מסמכים (PDF, תמונות, וידאו)
                          </p>
                          <ObjectUploader
                            maxNumberOfFiles={5}
                            maxFileSize={52428800}
                            allowedFileTypes={["image/*", "video/*", "application/pdf"]}
                            onFilesChange={setUploadedFiles}
                          >
                            העלאת קבצים
                          </ObjectUploader>
                        </div>

                        <Button
                          type="submit"
                          className="w-full font-heebo"
                          disabled={submitMutation.isPending}
                          data-testid="button-submit-appointment"
                        >
                          {submitMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                              שולח...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 ml-2" />
                              אישור וקביעת תור
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
