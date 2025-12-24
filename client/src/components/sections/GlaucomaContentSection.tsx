import { motion } from "framer-motion";
import { BookOpen, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { glaucomaContent } from "@/lib/data";

export function GlaucomaContentSection() {
  return (
    <section id="glaucoma" className="py-16 lg:py-24" data-testid="section-glaucoma">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-heebo text-primary font-medium">
              תוכן מקצועי למטופלים
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heebo font-bold text-foreground mb-4">
            גלאוקומה: מידע, בדיקות ומעקב
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            תוכן מעמיק על גלאוקומה, גורמי סיכון, אבחון ומעקב. המטרה: להבין את התהליך, לדעת למה לשים לב,
            ולבנות שגרת מעקב שמסייעת לשמור על הראייה לאורך זמן.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {glaucomaContent.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="p-6 lg:p-8 hover-elevate">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heebo font-semibold text-foreground mb-3">
                      {block.title}
                    </h3>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      {block.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            הערה: התוכן באתר נועד למידע כללי ואינו מחליף ייעוץ רפואי אישי. לצורך הערכה והתאמה אישית של
            תכנית בדיקות ומעקב — מומלץ לקבוע תור.
          </p>
        </div>
      </div>
    </section>
  );
}
