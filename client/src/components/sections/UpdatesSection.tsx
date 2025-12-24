import { motion } from "framer-motion";
import { Calendar, ExternalLink, Newspaper, ArrowLeft, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface MedicalUpdateAPI {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string | null;
  publishedAt: string;
  category: string | null;
  imageUrl: string | null;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

interface UpdateCardProps {
  update: MedicalUpdateAPI;
  index: number;
}

function UpdateCard({ update, index }: UpdateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card 
        className="p-6 h-full hover-elevate cursor-pointer group"
        data-testid={`card-update-${update.id}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(update.publishedAt)}</span>
            </div>
            {update.category && (
              <Badge variant="secondary" className="text-xs">
                {update.category}
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-heebo font-semibold text-foreground mb-3 leading-snug">
            {update.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4">
            {update.summary}
          </p>

          <div className="flex items-center justify-between gap-2 pt-4 border-t border-border flex-wrap">
            <span className="text-xs text-muted-foreground">
              מקור: {update.source}
            </span>
            {update.sourceUrl && (
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary text-sm hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
                <span>קרא עוד</span>
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function UpdateCardSkeleton() {
  return (
    <Card className="p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="pt-4 border-t border-border">
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </Card>
  );
}

export function UpdatesSection() {
  const { data: updates, isLoading, error } = useQuery<MedicalUpdateAPI[]>({
    queryKey: ['/api/updates'],
  });

  return (
    <section
      id="updates"
      className="py-16 lg:py-24 bg-background"
      data-testid="section-updates"
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
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-heebo text-primary font-medium">
              חדשות רפואיות
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heebo font-bold text-foreground mb-4">
            תוכן ועדכונים באלרגיה
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ריכוז מאמרים חדשים בעולם האלרגיה, מסוכמים בשפה ברורה להורים
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <UpdateCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-destructive mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="font-heebo">אירעה שגיאה בטעינת העדכונים</span>
            </div>
            <p className="text-muted-foreground text-sm">נא לרענן את הדף ולנסות שנית</p>
          </div>
        )}

        {updates && updates.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {updates.slice(0, 4).map((update, index) => (
              <UpdateCard key={update.id} update={update} index={index} />
            ))}
          </div>
        )}

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
            className="font-heebo"
            data-testid="button-view-all-updates"
          >
            לכל העדכונים
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
