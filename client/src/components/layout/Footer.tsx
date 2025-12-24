import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { clinicInfo, navigationItems } from "@/lib/data";

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t border-border" data-testid="footer-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heebo font-bold text-xl">
                  א
                </span>
              </div>
              <div>
                <h3 className="font-heebo font-semibold text-lg text-foreground">
                  ד״ר אדלר-אור גליה
                </h3>
                <p className="text-sm text-muted-foreground">
                  מומחית לעיניים וגלאוקומה
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              אבחון וטיפול באלרגיות אצל ילדים, מהשלב הראשוני ועד לבניית תכנית טיפול מתאימה.
            </p>
          </div>

          <div>
            <h4 className="font-heebo font-semibold text-foreground mb-4">
              ניווט מהיר
            </h4>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${item.href.replace("#", "")}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heebo font-semibold text-foreground mb-4">
              פרטי התקשרות
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <a
                    href={`tel:${clinicInfo.phone}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-phone"
                  >
                    {clinicInfo.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <a
                    href={`https://wa.me/${clinicInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-whatsapp"
                  >
                    WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <a
                    href={`mailto:${clinicInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-footer-email"
                  >
                    {clinicInfo.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {clinicInfo.address}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heebo font-semibold text-foreground mb-4">
              שעות פעילות
            </h4>
            <ul className="space-y-2">
              {clinicInfo.hours.map((schedule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="text-foreground">{schedule.day}: </span>
                    <span className="text-muted-foreground">{schedule.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} ד״ר אדלר-אור גליה. כל הזכויות שמורות.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-left max-w-2xl">
              המידע באתר זה נועד למטרות מידע כללי בלבד ואינו מהווה ייעוץ רפואי, אבחון או טיפול.
              יש להתייעץ עם רופא מוסמך לקבלת ייעוץ רפואי מקצועי.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
