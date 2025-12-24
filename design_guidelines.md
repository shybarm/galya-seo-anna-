# Design Guidelines: Dr. Anna Brameli Medical Website

## Design Approach

**Selected Approach**: Medical-Focused Design System  
**Justification**: Healthcare websites require trust, accessibility, and clarity. The design balances professional medical credibility with warmth and approachability for worried parents.

**Key Design Principles**:
- **Trust through simplicity**: Clean, uncluttered layouts convey medical professionalism
- **Empathetic communication**: Gentle visuals that reduce parental anxiety
- **RTL-first thinking**: Hebrew language with proper right-to-left flow throughout

---

## Core Design Elements

### A. Typography

**Font Families**: Assistant (primary) or Heebo via Google Fonts CDN

**Hierarchy**:
- **H1**: 36-42px, Bold weight - Main page titles (ד"ר אנה ברמלי)
- **H2**: 28-32px, Bold weight - Section headings
- **H3**: 22-26px, Medium weight - Subsection titles
- **Body**: 18-20px, Regular weight - Main content
- **Captions**: 14-16px, Regular weight - Supporting text, disclaimers
- **Buttons**: Heebo Medium for CTAs

**Line Height**: 1.6 for body text (optimal readability for medical content), 1.2 for headings

---

### B. Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16, 20, 24, 32**
- Small gaps: `gap-4`, `p-6`
- Section padding: `py-12` (mobile), `py-20` (desktop)
- Component margins: `mb-8`, `mt-12`
- Container max-width: `max-w-7xl` for sections, `max-w-prose` for text content

**Grid System**: 12-column responsive grid
- Mobile: Single column stack
- Tablet (md:): 2 columns for cards
- Desktop (lg:): 3-4 columns for service/condition grids

**Vertical Rhythm**: Consistent section padding with generous whitespace to create calm, medical atmosphere

---

### C. Component Library

#### Navigation
- **Sticky header**: Transparent background with backdrop blur
- **Links**: אודות, שירותים, עדכונים אחרונים, שאלות ותשובות, יצירת קשר
- **Mobile**: Hamburger menu with slide-in drawer (RTL aware)

#### Hero Section
- **Doctor portrait**: Rounded image card with subtle shadow
- **Headline hierarchy**: Doctor name (H1) → Specialty (H2) → Value proposition
- **Dual CTAs**: Primary "קביעת תור" + Secondary "שאל את העוזר הדיגיטלי"
- **Layout**: Split layout on desktop (image left/RTL, content right), stacked on mobile

#### Service/Condition Cards
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Card structure**: Icon (lucide-react) → Title → Short description → Link/button
- **Spacing**: `gap-6 lg:gap-8`
- **Hover state**: Subtle lift effect with shadow increase

#### FAQ Accordions
- **Grouped by condition**: One accordion section per allergy type
- **Interaction**: `<details>` element with custom styled `<summary>`
- **Typography**: Bold question, regular answer with adequate spacing

#### Forms (Contact/Booking)
- **Fields**: Full name, phone, email, inquiry description
- **Input design**: Rounded corners (6-8px), large tap areas (min-h-12)
- **Validation**: Clear error states with Hebrew messages
- **Layout**: Stacked on mobile, 2-column on desktop for shorter fields

#### AI Chat Widget
- **FAB**: Fixed bottom-left (RTL consideration), message-circle icon
- **Panel**: Fixed position card at bottom, 400px wide on desktop
- **Chat bubbles**: Differentiated user (left/RTL) vs bot (right/RTL) styling
- **Disclaimer**: Visible at top: "העוזר הדיגיטלי אינו תחליף לייעוץ רפואי"
- **Input**: Send button with lucide-react send icon

#### Latest Updates Cards
- **Layout**: Stacked cards with date, title, source, summary
- **Typography**: Date in caption size, title bold
- **Spacing**: `space-y-6` between cards

#### Footer
- **Sections**: Clinic info, quick links, legal disclaimer
- **Layout**: Multi-column on desktop, stacked on mobile
- **Disclaimer text**: Caption size with muted styling

---

### D. Animations

**Framer Motion - Minimal Professional Use**:
- **Hero entrance**: Subtle fade-in with slight slide-up (`y: 20`)
- **Card hover**: Scale 1.02 with shadow transition
- **Page transitions**: Gentle cross-fade between routes
- **Chat panel**: Slide-in animation from bottom
- **Scroll reveals**: Fade-in for section content (delay stagger for cards)

**Duration**: 0.3-0.5s for most transitions  
**Easing**: Ease-out for natural feel

---

## Images

### Hero Section
**Primary image**: Professional portrait of Dr. Anna Brameli
- **Placement**: Hero section, desktop left side (RTL), mobile full-width above text
- **Style**: Rounded corners, professional medical setting background
- **Format**: High-quality portrait with warm, approachable expression
- **Overlay**: None - keep image clean and professional

### Service Cards
**Icons only**: Use lucide-react line icons (stethoscope, shield, pill, activity, droplet icons)
- No photographic images in service cards - maintains clean, scannable layout

### Medical Conditions Sections
**Illustrative diagrams** (optional placeholders):
- Simple medical illustrations for complex conditions
- Placement: Inline with condition descriptions
- Style: Clean, minimal line art matching overall aesthetic

---

## Color Application Notes

**Primary actions**: Main CTAs stand out against neutral backgrounds  
**Medical trust indicators**: Subtle background treatments for credentials/trust sections  
**Alert states**: Form validation, urgent medical disclaimers  
**Neutral dominance**: 70% neutral whites/grays, 20% soft accent tones, 10% primary actions

---

## Accessibility & RTL Considerations

- **WCAG AA compliance**: All text meets 4.5:1 contrast minimum
- **RTL layout**: All Tailwind utilities properly mirrored (mr/ml swaps, text-right defaults)
- **Hebrew text rendering**: Proper Unicode support, no text truncation issues
- **Keyboard navigation**: All interactive elements accessible via Tab
- **Screen readers**: Semantic HTML with proper ARIA labels in Hebrew
- **Touch targets**: Minimum 44×44px for mobile interactions

---

## Page-Specific Guidance

### Homepage
- **Above fold**: Doctor portrait + value proposition + dual CTAs
- **Section count**: 5-6 sections (Hero, Services, Why Choose, Latest Updates, CTA)
- **Vertical rhythm**: Generous spacing between sections (py-20)

### Conditions Pages
- **Information density**: Single column text with max-width for readability
- **FAQ placement**: Below main condition description
- **Related conditions**: Cross-link cards at bottom

### Contact Page
- **Form prominence**: Left side (RTL), clinic info right
- **Map integration**: Embedded placeholder below form
- **Trust signals**: Office hours, phone, WhatsApp clearly visible

---

This design creates a trustworthy, accessible medical website that reduces parental anxiety while maintaining professional credibility.