import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { conditions } from "@/lib/data";
import type { Condition, FAQ } from "@shared/schema";

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-4 text-right hover-elevate rounded-md px-2 -mx-2"
        data-testid={`button-faq-toggle`}
      >
        <span className="font-heebo font-medium text-foreground text-base leading-relaxed">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-muted-foreground leading-relaxed pr-2">
          {faq.answer}
        </p>
      </motion.div>
    </div>
  );
}

interface ConditionFAQProps {
  condition: Condition;
}

function ConditionFAQ({ condition }: ConditionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-card rounded-lg p-6" data-testid={`faq-group-${condition.slug}`}>
      <h3 className="text-xl font-heebo font-semibold text-foreground mb-4">
        {condition.title}
      </h3>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        {condition.shortDescription}
      </p>
      <div>
        {condition.faqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: null, label: "הכל" },
    { id: "food", label: "מזון" },
    { id: "respiratory", label: "נשימה" },
    { id: "skin", label: "עור" },
    { id: "other", label: "אחר" },
  ];

  const getCategoryConditions = () => {
    if (!activeCategory) return conditions;
    
    const categoryMap: Record<string, string[]> = {
      food: ["food-allergy", "milk-allergy", "peanut-allergy"],
      respiratory: ["pollen-allergy", "asthma"],
      skin: ["urticaria"],
      other: ["drug-allergy", "bee-allergy", "anaphylaxis", "child-tests"],
    };
    
    return conditions.filter((c) => categoryMap[activeCategory]?.includes(c.slug));
  };

  const filteredConditions = getCategoryConditions();

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 bg-muted/30"
      data-testid="section-faq"
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
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-heebo text-primary font-medium">
              שאלות נפוצות
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heebo font-bold text-foreground mb-4">
            שאלות ותשובות
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            תשובות לשאלות הנפוצות ביותר על אלרגיות ואימונולוגיה
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category.id ?? "all"}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-md font-heebo text-sm transition-colors ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
              data-testid={`button-faq-filter-${category.id ?? "all"}`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredConditions.map((condition, index) => (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ConditionFAQ condition={condition} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 lg:p-12 text-center"
        >
          <h3 className="text-2xl font-heebo font-semibold text-foreground mb-4">
            לא מצאתם תשובה לשאלה שלכם?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            אנו כאן לעזור. צרו קשר ונשמח לענות על כל שאלה.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-heebo hover-elevate"
            data-testid="link-faq-contact"
          >
            צרו קשר
          </a>
        </motion.div>
      </div>
    </section>
  );
}
