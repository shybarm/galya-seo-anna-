// Medical Triage Decision Tree for Allergy Symptoms
// This provides symptom-based guidance with appropriate urgency levels

export type UrgencyLevel = "emergency" | "urgent" | "moderate" | "routine" | "info";

export interface TriageResult {
  urgencyLevel: UrgencyLevel;
  category: string;
  response: string;
  followUp: string[];
  showContactButton: boolean;
  showEmergencyWarning: boolean;
}

interface SymptomPattern {
  keywords: string[];
  urgencyLevel: UrgencyLevel;
  category: string;
  response: string;
  followUp: string[];
}

// Medical decision tree patterns ordered by urgency
const symptomPatterns: SymptomPattern[] = [
  // EMERGENCY - Requires immediate medical attention
  {
    keywords: ["קוצר נשימה", "קושי לנשום", "נחנק", "לא מצליח לנשום", "התנפחות גרון"],
    urgencyLevel: "emergency",
    category: "חירום נשימתי",
    response: "סימנים אלו עלולים להצביע על תגובה אלרגית חמורה. במקרה חירום יש לפנות לרופא המטפל או לחייג 101 לקבלת סיוע.",
    followUp: [
      "חייגו 101 לקבלת סיוע",
      "פנו לרופא המטפל"
    ]
  },
  {
    keywords: ["נפיחות בלשון", "לשון נפוחה", "שפתיים נפוחות", "נפיחות בפנים", "נפיחות בגרון"],
    urgencyLevel: "emergency",
    category: "אנגיואדמה",
    response: "נפיחות באזור הפנים, שפתיים, לשון או גרון היא סימן לתגובה אלרגית חמורה. במקרה חירום יש לפנות לרופא המטפל או לחייג 101 לקבלת סיוע.",
    followUp: [
      "חייגו 101 לקבלת סיוע",
      "פנו לרופא המטפל"
    ]
  },
  {
    keywords: ["עילפון", "התעלפתי", "איבוד הכרה", "סחרחורת חזקה", "חיוורון חמור"],
    urgencyLevel: "emergency",
    category: "אנפילקסיס",
    response: "עילפון או סחרחורת חזקה עלולים להעיד על תגובה אנפילקטית. במקרה חירום יש לפנות לרופא המטפל או לחייג 101 לקבלת סיוע.",
    followUp: [
      "חייגו 101 לקבלת סיוע",
      "פנו לרופא המטפל"
    ]
  },
  {
    keywords: ["אנפילקסיס", "הלם אלרגי", "תגובה אנפילקטית"],
    urgencyLevel: "emergency",
    category: "אנפילקסיס",
    response: "אנפילקסיס הוא מצב חירום מסכן חיים. במקרה חירום יש לפנות לרופא המטפל או לחייג 101 לקבלת סיוע.",
    followUp: [
      "חייגו 101 לקבלת סיוע",
      "פנו לרופא המטפל"
    ]
  },
  
  // URGENT - Needs medical attention within hours
  {
    keywords: ["פריחה מפושטת", "פריחה בכל הגוף", "אורטיקריה חמורה", "סרפדת קשה"],
    urgencyLevel: "urgent",
    category: "תגובה עורית חמורה",
    response: "פריחה מפושטת עלולה להעיד על תגובה אלרגית משמעותית. מומלץ לפנות לרופא בהקדם לאבחון וטיפול.",
    followUp: [
      "הימנעו מהחשוד כגורם לתגובה",
      "קחו אנטיהיסטמין אם אפשרי",
      "פנו לרופא היום"
    ]
  },
  {
    keywords: ["הקאות", "הקאה", "בחילות חזקות", "כאבי בטן חזקים"],
    urgencyLevel: "urgent",
    category: "תגובה במערכת העיכול",
    response: "הקאות או כאבי בטן חזקים לאחר אכילה עלולים להעיד על אלרגיה למזון. יש לפנות לרופא לאבחון.",
    followUp: [
      "הפסיקו לאכול את המזון החשוד",
      "שתו נוזלים לאט",
      "פנו לרופא אם לא משתפר"
    ]
  },
  {
    keywords: ["נפיחות", "התנפחות", "בצקת"],
    urgencyLevel: "urgent",
    category: "בצקת אלרגית",
    response: "נפיחות מקומית עלולה להעיד על תגובה אלרגית. חשוב לעקוב אחר התפתחות הנפיחות ולפנות לרופא.",
    followUp: [
      "עקבו אחר התפשטות הנפיחות",
      "צרו קשר עם רופא",
      "אם מתפשט לפנים/גרון - פנו למיון"
    ]
  },
  {
    keywords: ["עקיצת דבורה", "עקיצת צרעה", "עקיצה", "דבורה", "צרעה"],
    urgencyLevel: "urgent",
    category: "אלרגיה לעקיצות",
    response: "תגובה לעקיצת דבורה או צרעה דורשת מעקב. אם יש תגובה מעבר למקום העקיצה, יש לפנות לרופא.",
    followUp: [
      "הסירו את העוקץ אם נשאר",
      "קררו את האזור",
      "עקבו אחר תגובות נוספות"
    ]
  },
  
  // MODERATE - Should see doctor soon
  {
    keywords: ["גרד", "מגרד", "גירוד", "עור מגרד"],
    urgencyLevel: "moderate",
    category: "גרד אלרגי",
    response: "גרד עלול להיות סימן לאלרגיה או רגישות עורית. מומלץ להתייעץ עם מומחה לאלרגיה לאבחון הסיבה.",
    followUp: [
      "הימנעו מגירוד",
      "מרחו קרם מרגיע",
      "קבעו תור לאבחון"
    ]
  },
  {
    keywords: ["פריחה", "אדמומיות", "אגזמה", "עור יבש"],
    urgencyLevel: "moderate",
    category: "תגובה עורית",
    response: "פריחה או אדמומיות עלולות להעיד על אלרגיה עורית. אבחון מקצועי יעזור לזהות את הגורם ולקבל טיפול מתאים.",
    followUp: [
      "תעדו מתי הופיעה הפריחה",
      "חשבו מה נגעתם/אכלתם",
      "קבעו תור לבדיקה"
    ]
  },
  {
    keywords: ["אסטמה", "התקף אסטמה", "צפצופים", "שיעול כרוני"],
    urgencyLevel: "moderate",
    category: "אסטמה אלרגית",
    response: "אסטמה אלרגית מצריכה מעקב וטיפול קבוע. מומלץ לקבוע תור לבדיקה ובניית תוכנית טיפול.",
    followUp: [
      "השתמשו במשאף אם יש",
      "הימנעו מטריגרים ידועים",
      "קבעו תור לייעוץ"
    ]
  },
  {
    keywords: ["נזלת", "עיניים דומעות", "גודש באף", "קדחת השחת", "אביב"],
    urgencyLevel: "moderate",
    category: "אלרגיה עונתית",
    response: "תסמיני אלרגיה עונתית (נזלת, עיניים דומעות) ניתנים לטיפול יעיל. מומלץ להתייעץ לגבי טיפול מונע.",
    followUp: [
      "נסו אנטיהיסטמין ללא מרשם",
      "הימנעו מיציאה בשעות אבקה גבוהה",
      "שקלו בדיקת אלרגיה"
    ]
  },
  
  // ROUTINE - Can schedule regular appointment
  {
    keywords: ["בדיקת אלרגיה", "בדיקה", "אבחון", "לבדוק אם יש לי"],
    urgencyLevel: "routine",
    category: "בדיקות אלרגיה",
    response: "בדיקות אלרגיה כוללות מבחני עור ובדיקות דם שיכולים לזהות רגישות לאלרגנים שונים. ד״ר ברמלי מבצעת מגוון בדיקות אלרגיה לילדים.",
    followUp: [
      "קבעו תור לייעוץ ראשוני",
      "הביאו רשימת תסמינים",
      "ציינו מזונות/חומרים חשודים"
    ]
  },
  {
    keywords: ["אלרגיה למזון", "אלרגיה לחלב", "אלרגיה לביצים", "אלרגיה לבוטנים", "אלרגיה לאגוזים", "אלרגיה לחיטה", "אלרגיה לדגים"],
    urgencyLevel: "routine",
    category: "אלרגיה למזון",
    response: "אלרגיות מזון נפוצות בילדים וניתנות לאבחון באמצעות בדיקות ייעודיות. אבחון מדויק מאפשר ניהול בטוח של התזונה.",
    followUp: [
      "רשמו תגובות לאחר אכילה",
      "הימנעו מהמזון החשוד עד לאבחון",
      "קבעו תור לבדיקת אלרגיה"
    ]
  },
  {
    keywords: ["אלרגיה לתרופות", "תגובה לתרופה", "אלרגיה לאנטיביוטיקה", "אלרגיה לפניצילין"],
    urgencyLevel: "routine",
    category: "אלרגיה לתרופות",
    response: "אלרגיה לתרופות דורשת אבחון מקצועי. חשוב לתעד את התרופה והתגובה. ד״ר ברמלי מתמחה באבחון אלרגיות לתרופות.",
    followUp: [
      "שמרו על שם התרופה המדויק",
      "תעדו את סוג התגובה",
      "קבעו תור לייעוץ"
    ]
  },
  {
    keywords: ["ילד", "ילדים", "תינוק", "פעוט"],
    urgencyLevel: "routine",
    category: "אלרגיות בילדים",
    response: "אלרגיות בילדים דורשות טיפול מותאם גיל. ד״ר ברמלי מתמחה בטיפול באלרגיות בילדים ומעניקה יחס חם ומקצועי.",
    followUp: [
      "קבעו תור לייעוץ",
      "הביאו מידע על התסמינים",
      "ציינו היסטוריה משפחתית"
    ]
  },
  
  // INFO - General information
  {
    keywords: ["תור", "לקבוע תור", "פגישה", "ביקור"],
    urgencyLevel: "info",
    category: "קביעת תור",
    response: "ניתן לקבוע תור עם ד״ר אנה ברמלי בטלפון 03-1234567 או באמצעות טופס הפנייה באתר. המרפאה פועלת בימים א׳-ה׳.",
    followUp: [
      "מלאו את טופס הפנייה",
      "או התקשרו ל-03-1234567"
    ]
  },
  {
    keywords: ["מחיר", "עלות", "כמה עולה", "תשלום"],
    urgencyLevel: "info",
    category: "מידע מנהלתי",
    response: "לפרטים על עלויות ומחירים, אנא צרו קשר ישירות עם המרפאה בטלפון 03-1234567.",
    followUp: [
      "התקשרו למרפאה לפרטים",
      "שאלו על הסכמי קופות חולים"
    ]
  },
  {
    keywords: ["כתובת", "איפה", "מיקום", "מרפאה"],
    urgencyLevel: "info",
    category: "מידע על המרפאה",
    response: "המרפאה ממוקמת ברחוב הרצל 45, תל אביב. ניתן להגיע בתחבורה ציבורית או ברכב פרטי (חניון בסמוך).",
    followUp: [
      "ראו מפה באתר",
      "יש חניה בסמוך"
    ]
  },
  {
    keywords: ["שעות", "פתוח", "שעות קבלה"],
    urgencyLevel: "info",
    category: "שעות פעילות",
    response: "שעות הפעילות של המרפאה: ימים א׳-ה׳ 08:00-18:00. מומלץ לתאם תור מראש.",
    followUp: [
      "קבעו תור מראש",
      "התקשרו בשעות הפעילות"
    ]
  }
];

// Default response when no pattern matches
const defaultResponse: TriageResult = {
  urgencyLevel: "info",
  category: "שאלה כללית",
  response: "תודה על פנייתך. על מנת לקבל מענה מדויק לשאלתך, מומלץ לקבוע תור לייעוץ אישי עם ד״ר אנה ברמלי. היא תוכל לבחון את המקרה הספציפי שלך ולתת הנחיות מותאמות.",
  followUp: [
    "קבעו תור לייעוץ אישי",
    "התקשרו ל-03-1234567",
    "או מלאו את טופס הפנייה"
  ],
  showContactButton: true,
  showEmergencyWarning: false
};

// Greeting responses
const greetingPatterns = ["שלום", "היי", "הי", "בוקר טוב", "ערב טוב", "מה שלומך"];
const greetingResponse: TriageResult = {
  urgencyLevel: "info",
  category: "ברכה",
  response: "שלום וברוכים הבאים! אני העוזר הדיגיטלי של ד״ר אנה ברמלי, מומחית לאלרגיה ואימונולוגיה. כיצד אוכל לעזור לך היום? ספרו לי על התסמינים או השאלות שלכם.",
  followUp: [
    "ספרו על התסמינים",
    "שאלו שאלות על אלרגיות",
    "קבעו תור"
  ],
  showContactButton: false,
  showEmergencyWarning: false
};

export function analyzeSymptoms(message: string): TriageResult {
  const normalizedMessage = message.toLowerCase();
  
  // Check for greetings
  if (greetingPatterns.some(pattern => normalizedMessage.includes(pattern))) {
    return greetingResponse;
  }
  
  // Find matching pattern (patterns are ordered by urgency)
  for (const pattern of symptomPatterns) {
    if (pattern.keywords.some(keyword => normalizedMessage.includes(keyword))) {
      return {
        urgencyLevel: pattern.urgencyLevel,
        category: pattern.category,
        response: pattern.response,
        followUp: pattern.followUp,
        showContactButton: pattern.urgencyLevel !== "emergency",
        showEmergencyWarning: pattern.urgencyLevel === "emergency"
      };
    }
  }
  
  return defaultResponse;
}

export function getUrgencyLabel(level: UrgencyLevel): string {
  const labels: Record<UrgencyLevel, string> = {
    emergency: "חירום - פנו מיד לטיפול רפואי",
    urgent: "דחוף - מומלץ לפנות לרופא היום",
    moderate: "מתון - מומלץ לקבוע תור בקרוב",
    routine: "שגרתי - ניתן לקבוע תור",
    info: "מידע"
  };
  return labels[level];
}
