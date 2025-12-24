import { motion } from "framer-motion";
import { GraduationCap, Award, Heart, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { doctorInfo } from "@/lib/data";

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-16 lg:py-24 bg-background"
      data-testid="section-about"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-heebo font-bold text-foreground mb-4">
            אודות {doctorInfo.nameHebrew}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {doctorInfo.title}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 lg:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-heebo font-semibold text-foreground">
                  השכלה והתמחות
                </h3>
              </div>
              <ul className="space-y-4">
                {doctorInfo.education.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 lg:p-8 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-heebo font-semibold text-foreground">
                  הגישה הטיפולית
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {doctorInfo.philosophy}
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 lg:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-heebo font-semibold text-foreground">
                  ניסיון מקצועי
                </h3>
              </div>
              <ul className="space-y-4">
                {doctorInfo.experience.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 lg:p-12 text-center">
            <Stethoscope className="w-12 h-12 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-heebo font-semibold text-foreground mb-4">
              מדוע לבחור בד״ר אדלר-אור גליה?
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[
                { title: "אבחון מדויק ורגיש לילדים", icon: "heart" },
                { title: "טיפול מותאם אישית", icon: "user" },
                { title: "ניסיון במגוון רחב של סוגי אלרגיות", icon: "award" },
                { title: "תורים מהירים וקשר ישיר", icon: "phone" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 p-4 bg-card rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full" />
                  </div>
                  <p className="text-sm font-heebo text-foreground text-center">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
