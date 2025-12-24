import { motion } from "framer-motion";
import { Phone, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heebo font-bold text-foreground mb-4 leading-snug">
            מרגישים שהילד מגיב למזון, עקיצה או תרופה?
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            אל תחכו — קבעו תור לאבחון מקצועי. אבחון מדויק מונע הפתעות ומאפשר לילד חיים רגילים ובטוחים.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="font-heebo text-base px-8"
              data-testid="button-book-appointment-cta"
            >
              <Phone className="w-5 h-5 ml-2" />
              קביעת תור לאבחון
            </Button>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "אתם לא לבד",
                text: "כשילד מראה סימני אלרגיה — זה טבעי להרגיש לחץ. אנחנו כאן לעזור להבין מה באמת קורה.",
              },
              {
                title: "רוב התגובות לא מסוכנות",
                text: "רוב התגובות האלרגיות — גם כשהן מרשימות — אינן מסכנות חיים. התפקיד שלנו לזהות נכון.",
              },
              {
                title: "אבחון מונע הפתעות",
                text: "אלרגיה שאינה מאובחנת עלולה לגרום לבלבול. אבחון מדויק מאפשר לתת לילד חיים רגילים.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-card/80 rounded-lg p-6 text-right"
              >
                <h3 className="font-heebo font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
