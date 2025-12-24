# Dr. Anna Brameli Medical Website

## Overview

A production-ready marketing website for Dr. Anna Brameli, an Allergy and Immunology Specialist. The site is built entirely in Hebrew (RTL) and targets parents seeking pediatric and adult allergy care. Key features include medical service information, an AI triage chat widget, contact forms, FAQ sections for various allergy conditions, and SEO-optimized schema markup for healthcare providers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with CSS variables for theming, configured for RTL (right-to-left) Hebrew layout
- **UI Components**: shadcn/ui component library (Radix UI primitives with Tailwind styling)
- **Animations**: Framer Motion for subtle, professional animations
- **Typography**: Google Fonts (Heebo, Assistant) optimized for Hebrew text

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Database**: PostgreSQL with Drizzle ORM (DatabaseStorage in server/storage.ts)
- **Build System**: Custom build script using esbuild for server bundling and Vite for client

### Directory Structure
```
client/           # Frontend React application
  src/
    components/   # Reusable UI components (layout, sections, chat, seo)
    pages/        # Route-level page components
    hooks/        # Custom React hooks
    lib/          # Utilities, data, and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # DatabaseStorage implementation
  db.ts           # Drizzle database connection
  email.ts        # Email notification service
  triage.ts       # Medical decision tree AI triage
  seed.ts         # Database seeding script
shared/           # Shared types and schemas between client/server
  schema.ts       # Drizzle ORM schemas and Zod validation
```

### Design Patterns
- **Component Composition**: Section-based layout with reusable UI primitives
- **Data Layer Abstraction**: `IStorage` interface with DatabaseStorage implementation
- **Schema-First Validation**: Drizzle-Zod integration for type-safe API validation
- **SEO Schema Injection**: JSON-LD structured data for Physician and MedicalWebPage types
- **Medical Triage Decision Trees**: Pattern-based symptom analysis with urgency levels

### Key Features
- **AI Triage Bot Widget**: Floating chat with medical decision tree logic (emergency/urgent/moderate/routine/info levels)
- **Contact Form**: Form submission with Zod validation, stored in PostgreSQL, email notification ready
- **Medical Updates Section**: Fetches from `/api/updates` with PostgreSQL persistence
- **FAQ Accordion**: Condition-specific FAQs for various allergy types
- **Responsive Design**: Mobile-first approach with sticky header navigation
- **Doctor Image**: Real photo displayed in hero section

## External Dependencies

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Migrations**: Use `npm run db:push` to sync schema
- **Connection**: Uses `DATABASE_URL` environment variable
- **Seeding**: Run `npx tsx server/seed.ts` to seed initial data

### Third-Party Services
- **Google Fonts CDN**: Heebo and Assistant font families for Hebrew typography
- **Radix UI**: Accessible component primitives (accordion, dialog, popover, etc.)
- **Framer Motion**: Animation library for UI transitions

### Email Notifications (Optional)
- **Service**: Resend (not configured - user dismissed integration)
- **Fallback**: Contact submissions are logged to console when no email API key
- **To enable**: Set `RESEND_API_KEY` secret and update `server/email.ts` with verified domain

### API Endpoints
- `POST /api/contact` - Submit contact form inquiries (saved to DB, optional email notification)
- `GET /api/updates` - Retrieve medical news/research updates from database
- `POST /api/chat` - AI triage chat with medical decision trees
- `GET /api/appointments/slots` - Get available time slots for a date
- `POST /api/appointments` - Create a new appointment booking
- `POST /api/analytics/track` - Track analytics events (conversions, engagement, interactions)
- `GET /api/analytics` - Retrieve tracked analytics events (for reporting)

### Analytics Tracking
- **Event Types**: contact_form_submit, appointment_booking, chat_open, phone_click, email_click, whatsapp_click
- **Categories**: conversion, engagement, interaction
- **Implementation**: `client/src/lib/analytics.ts` provides tracking utilities
- **Storage**: Events stored in `analytics_events` PostgreSQL table with session ID, user agent, and referrer

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string for Drizzle ORM
- `RESEND_API_KEY` (optional) - For email notifications

## Completed Features
- Google Maps integration for clinic location (embedded in ContactSection)
- Appointment scheduling system with calendar (multi-step booking flow)
- Analytics/conversion tracking (phone clicks, chat opens, form submissions, appointments)
