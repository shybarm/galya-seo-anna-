import { motion } from "framer-motion";
import { 
  Utensils, 
  Wind, 
  Sparkles, 
  Pill, 
  Bug, 
  Flower2,
  ArrowLeft,
  Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils,
  Wind,
  Sparkles,
  Pill,
  Bug,
  Flower2,
};

export function ServicesSection() {
  const scrollToFaq = () => {
    const element = document.querySelector("#faq");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="services"
      className="py-16 lg:py-24 bg-muted/30"
      data-testid="section-services"
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
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-heebo text-primary font-medium">
              שירותים ואבחונים
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heebo font-bold text-foreground mb-4">
            תחומי התמחות
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            אבחון, ייעוץ ומעקב מקצועי בגלאוקומה ובבריאות העין
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Shield;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 h-full hover-elevate cursor-pointer group"
                  onClick={scrollToFaq}
                  data-testid={`card-service-${service.slug}`}
                >
                  <div className="flex flex-col h-full">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-heebo font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-heebo text-sm">
                      <span>קרא עוד</span>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToFaq}
            className="font-heebo"
            data-testid="button-view-all-conditions"
          >
            לכל המצבים והטיפולים
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
