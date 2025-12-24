import { motion } from "framer-motion";
import { Calendar, MessageCircle, Stethoscope, Award, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doctorInfo } from "@/lib/data";
import doctorImage from "@assets/אנה_ברמלי_מומחית_לעיניים_1765285554802.jpeg";

interface HeroSectionProps {
  onOpenChat: () => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden bg-gradient-to-b from-background to-muted/30"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-right order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span className="text-sm font-heebo text-primary font-medium">
                רופאת עיניים
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heebo font-bold text-foreground leading-tight mb-6">
              {doctorInfo.nameHebrew}
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground font-heebo mb-4">
              {doctorInfo.specialization}
            </p>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              אבחון וטיפול באלרגיות אצל ילדים, מהשלב הראשוני ועד לבניית תכנית טיפול מתאימה.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="font-heebo text-base px-8"
                data-testid="button-book-appointment-hero"
              >
                <Calendar className="w-5 h-5 ml-2" />
                קביעת תור
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onOpenChat}
                className="font-heebo text-base px-8"
                data-testid="button-open-chat-hero"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                שאל את העוזר הדיגיטלי
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
              {[
                { icon: CheckCircle, label: "אבחון ובניית תוכנית טיפולים" },
                { icon: Users, label: "טיפול מותאם אישית" },
                { icon: Award, label: "ניסיון רב" },
                { icon: Calendar, label: "תורים מהירים" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card/50"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-heebo text-muted-foreground text-center">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border-4 border-card overflow-hidden shadow-xl">
                <img
                  src={doctorImage}
                  alt={`${doctorInfo.nameHebrew} - ${doctorInfo.specialization}`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  data-testid="img-doctor-hero"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-8 bg-card rounded-lg p-2 sm:p-4 shadow-lg border border-border"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-heebo font-medium text-foreground">
                      +15 שנות ניסיון
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      ברפואת ילדים ועיניים
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="absolute -top-2 -left-2 sm:-top-4 sm:-left-8 bg-card rounded-lg p-2 sm:p-4 shadow-lg border border-border"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-heebo font-medium text-foreground">
                      טיפול
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      בכל סוגי העיניים
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
