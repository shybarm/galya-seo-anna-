import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
      data-testid="header-main"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">

            <a href="/admin" className="hidden sm:flex">
              <Button variant="outline" className="font-heebo" data-testid="button-admin-login">
                Admin Login
              </Button>
            </a>

            <a
              href="#"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-testid="link-home"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heebo font-bold text-lg">
                  ג
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="font-heebo font-semibold text-foreground text-base">
                  ד״ר אדלר-אור גליה
                </p>
                <p className="text-xs text-muted-foreground">
                  רופאת עיניים • מומחית לגלאוקומה
                </p>
              </div>
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 text-sm font-heebo text-foreground/80 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                data-testid={`link-nav-${item.href.replace("#", "")}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="hidden sm:flex items-center gap-2 font-heebo"
              data-testid="button-book-appointment-header"
            >
              <Phone className="w-4 h-4" />
              קביעת תור
            </Button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
              aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
            data-testid="nav-mobile"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-right px-4 py-3 text-foreground hover:bg-muted rounded-md transition-colors font-heebo"
                  data-testid={`link-nav-mobile-${item.href.replace("#", "")}`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection("#contact")}
                className="w-full mt-4 font-heebo"
                data-testid="button-book-appointment-mobile"
              >
                <Phone className="w-4 h-4 ml-2" />
                קביעת תור
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
