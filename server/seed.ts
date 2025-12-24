import { db } from "./db";
import { medicalUpdates } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");
  
  // Check if updates already exist
  const existingUpdates = await db.select().from(medicalUpdates);
  if (existingUpdates.length > 0) {
    console.log("Medical updates already exist, skipping seed.");
    return;
  }

  // Seed medical updates
  const updates = [
    {
      title: "מחקר חדש: טיפול חשיפה מוקדם לבוטנים מפחית סיכון לאלרגיה",
      summary: "מחקר שפורסם לאחרונה מראה כי חשיפה מוקדמת לבוטנים בגיל הינקות עשויה להפחית משמעותית את הסיכון לפתח אלרגיה לבוטנים בהמשך החיים.",
      source: "Journal of Allergy and Clinical Immunology",
      sourceUrl: "https://example.com/study1",
      publishedAt: new Date("2024-11-15"),
      category: "מחקר",
      imageUrl: null,
    },
    {
      title: "הנחיות חדשות לטיפול באנפילקסיס בילדים",
      summary: "האקדמיה האמריקאית לאלרגיה פרסמה הנחיות מעודכנות לטיפול בתגובות אנפילקטיות בילדים, כולל המלצות למינון אדרנלין מעודכן.",
      source: "American Academy of Allergy",
      sourceUrl: "https://example.com/guidelines",
      publishedAt: new Date("2024-11-10"),
      category: "הנחיות",
      imageUrl: null,
    },
    {
      title: "טכנולוגיה חדשה לאבחון מהיר של אלרגיות למזון",
      summary: "חברת ביוטק ישראלית פיתחה שיטה חדשנית לאבחון אלרגיות למזון תוך דקות, ללא צורך בבדיקות דם מורכבות.",
      source: "Israel Medical News",
      sourceUrl: "https://example.com/tech",
      publishedAt: new Date("2024-11-05"),
      category: "חדשנות",
      imageUrl: null,
    },
    {
      title: "עלייה במקרי אסתמה אלרגית בקרב ילדים בישראל",
      summary: "סקר ארצי חדש מצביע על עלייה של 15% במקרי אסתמה אלרגית בקרב ילדים בעשור האחרון, עם דגש על אזורים עירוניים.",
      source: "משרד הבריאות",
      sourceUrl: "https://example.com/survey",
      publishedAt: new Date("2024-10-28"),
      category: "סקר",
      imageUrl: null,
    }
  ];

  await db.insert(medicalUpdates).values(updates);
  console.log(`Seeded ${updates.length} medical updates.`);
}

seed()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
