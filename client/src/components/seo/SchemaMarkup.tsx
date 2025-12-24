import { doctorInfo, clinicInfo } from "@/lib/data";

interface SchemaMarkupProps {
  pageType?: "home" | "about" | "services" | "contact" | "faq";
}

export function SchemaMarkup({ pageType = "home" }: SchemaMarkupProps) {
  const physicianSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    identifier: {
      "@type": "PropertyValue",
      name: "מס׳ רישיון",
      value: "1-129202",
    },
    name: doctorInfo.nameHebrew,
    alternateName: doctorInfo.name,
    description: `${doctorInfo.title} - ${doctorInfo.specialization}`,
    medicalSpecialty: "Ophthalmology",
    telephone: clinicInfo.phone,
    email: clinicInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicInfo.address,
      addressLocality: "תל אביב",
      addressCountry: "IL",
    },
    openingHoursSpecification: clinicInfo.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.time.split(" - ")[0] || "",
      closes: h.time.split(" - ")[1] || "",
    })),
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: "ייעוץ גלאוקומה",
        description: "הערכה קלינית, קביעת תכנית מעקב וטיפול מותאמת אישית בגלאוקומה",
      },
      {
        "@type": "MedicalTest",
        name: "בדיקת OCT",
        description: "הדמיה מתקדמת להערכת עצב הראייה והרשתית",
      },
      {
        "@type": "MedicalTest",
        name: "בדיקת שדה ראייה",
        description: "בדיקה תפקודית לניטור שדה הראייה והתקדמות המחלה",
      },
      {
        "@type": "MedicalProcedure",
        name: "הערכת לחץ תוך-עיני ועצב הראייה",
        description: "ניטור מדדים קליניים לצורך התאמת טיפול",
      },
    ],

  };

  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${doctorInfo.nameHebrew} - ${doctorInfo.title}`,
    description:
      "מומחית לאלרגיה ואימונולוגיה עם ניסיון רב באבחון וטיפול באלרגיות בילדים",
    url: typeof window !== "undefined" ? window.location.href : "",
    mainEntity: physicianSchema,
    specialty: {
      "@type": "MedicalSpecialty",
      name: "אלרגיה ואימונולוגיה",
    },
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 0,
      healthCondition: {
        "@type": "MedicalCondition",
        name: "אלרגיות",
      },
    },
    lastReviewed: new Date().toISOString().split("T")[0],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: clinicInfo.name,
    description: `מרפאה של ${doctorInfo.nameHebrew} - ${doctorInfo.title}`,
    telephone: clinicInfo.phone,
    email: clinicInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicInfo.address,
      addressLocality: "תל אביב",
      addressCountry: "IL",
    },
    medicalSpecialty: "Ophthalmology",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "דף הבית",
        item: typeof window !== "undefined" ? window.location.origin : "",
      },
      ...(pageType !== "home"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name:
                pageType === "about"
                  ? "אודות"
                  : pageType === "services"
                  ? "שירותים"
                  : pageType === "contact"
                  ? "יצירת קשר"
                  : pageType === "faq"
                  ? "שאלות ותשובות"
                  : "",
              item:
                typeof window !== "undefined"
                  ? `${window.location.origin}#${pageType}`
                  : "",
            },
          ]
        : []),
    ],
  };

  const faqSchema =
    pageType === "faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "האם אלרגיה למזון יכולה להופיע בפתאומיות?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "כן. גם אם הילד אכל מזון מסוים בעבר ללא תגובה, אלרגיה יכולה להתפתח בהמשך החיים.",
              },
            },
            {
              "@type": "Question",
              name: "איך מבדילים בין אלרגיה לחלב לבין אי־סבילות ללקטוז?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "אלרגיה מערבת מערכת חיסון — עם פריחה, נפיחות או קשיי נשימה. אי־סבילות ללקטוז גורמת בעיקר לגזים ושלשולים.",
              },
            },
            {
              "@type": "Question",
              name: "האם בדיקות אלרגיה לילדים כואבות?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "בדיקות עור מציקות מעט אך אינן כואבות. ילדים מתמודדים איתן היטב.",
              },
            },
          ],
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(physicianSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalWebPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}
