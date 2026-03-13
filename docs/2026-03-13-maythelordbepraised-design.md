# MayTheLordBePraised.com — Design Spec

## Overview

A multi-pastor ministry services platform with two distinct portals sharing a single API and database. Pastors manage and deliver services through the main domain; followers discover, book, and engage through a subdomain.

**Domain:** maythelordbepraised.com
**Tagline:** "A place of comfort, counsel, and community."

---

## Portal Architecture

| Portal | URL | Audience | Purpose |
|--------|-----|----------|---------|
| Pastor Portal | `maythelordbepraised.com` | Pastors & Ministry Leaders | Sign up, manage services, dashboard, analytics |
| Follower Portal | `connect.maythelordbepraised.com` | Congregants & Visitors | Discover pastors, book services, pray, watch, give |
| API | `api.maythelordbepraised.com` | Both portals | Shared FastAPI backend |

Both portals share the **Warm & Welcoming** visual identity: cream (#fdf8f0), warm browns (#5c3d2e, #3d2518), earth tones (#d4a574, #8b6f4e), Playfair Display + Inter typography. Mobile-first responsive design throughout.

---

## Tech Stack

Per `technical.md` mandatory standards:

| Layer | Technology |
|-------|-----------|
| Frontend (x2) | React 19, Vite, TypeScript (strict), Tailwind CSS, Zustand, Axios |
| Backend | Python 3.12+, FastAPI, Pydantic v2 |
| Database | MongoDB via Motor async driver |
| Auth | Keycloak (pastor accounts + follower accounts) |
| Payments | Stripe (tithes, offerings, ceremony fees) |
| File Storage | MinIO (S3-compatible, self-hosted) — sermon uploads, resources |
| AI | Adapter Pattern — CLI-based dev, Open Router prod |
| RAG | Citex — semantic search across sermons, resources, prayers |
| Infrastructure | Docker Compose, custom ports |

### Port Allocation

| Service | Port |
|---------|------|
| Pastor Portal (React) | 23050 |
| Follower Portal (React) | 23051 |
| FastAPI Backend | 23052 |
| MongoDB | 23053 |
| Redis | 23054 |
| Keycloak | 23055 |
| Keycloak Postgres | 23056 |
| MinIO API | 23057 |
| MinIO Console | 23058 |

---

## Landing Pages

### 1. Pastor Portal Landing (`maythelordbepraised.com`)

**Layout:** Split hero with dashboard preview mockup.

**Sections (scroll order):**
1. **Hero** — "Digitize Your Ministry. Multiply Your Impact." + live dashboard preview showing appointments, prayer counts, giving stats
2. **Feature Grid** (9 cards) — Smart Booking, Prayer Manager, Sermon Library, Ceremony Management, Tithes & Offerings, Ministry Analytics, Community Groups, Event Management, Resource Library
3. **How It Works** (4 steps) — Create Profile → Set Services → Share Link → Grow Ministry
4. **Pricing** (3 tiers) — Shepherd (Free), Minister ($29/mo), Ministry ($79/mo, multi-pastor)
5. **CTA** — "Your Ministry Deserves More Than a Facebook Page"
6. **Footer** — "Powered by yensi.solutions"

### 2. Follower Portal Landing (`connect.maythelordbepraised.com`)

**Layout:** Full-width immersive hero with warm overlay.

**Sections (scroll order):**
1. **Immersive Hero** — cross icon, "May The Lord Be Praised", dual CTAs (Explore Services / Watch Sermons), Psalm 23:1 scripture
2. **Service Icon Grid** — 5 tiles (Counseling, Ceremonies, Prayer Wall, Sermons, Giving)
3. **Stats Bar** — 12+ Pastors, 5,000+ Prayers Answered, 800+ Ceremonies, 24/7 Prayer Support
4. **How It Works** — 3 steps (Choose Service → Select Pastor → Book & Connect)
5. **Meet Our Pastors** — Pastor cards with photo, name, role, specialties, "Book a Session" CTA
6. **Prayer Wall Preview** — 3 live prayer requests with "Pray" interaction buttons
7. **Latest Sermons** — Featured sermon player + 4 recent sermon list items
8. **Upcoming Events** — Event cards with date, description, RSVP
9. **Testimonials** (dark section) — 3 member testimonies with stars
10. **Giving Section** — Preset amounts ($25–$500 + custom) with impact messaging
11. **Footer** — navigation columns + "Powered by yensi.solutions"

---

## Features

### F1. Pastor Profiles & Dashboard

**Pastor-side:**
- Profile builder: bio, photo, specialties, availability calendar, ministry background
- Dashboard home: today's appointments, new prayer requests, giving summary, recent activity
- Availability manager: set recurring hours, block dates, vacation mode
- Profile visibility toggle (public/private)

**Follower-side:**
- Pastor directory with search/filter by specialty, availability
- Individual pastor profile pages with bio, sermons, reviews, booking CTA
- Specialty tags: Marriage, Youth, Grief, Addiction, Family, Leadership, Women's Ministry, etc.

### F2. Service Booking Engine

**Service types:**
- Counseling/mentoring (1-on-1, single or multi-session packages)
- Ceremonies (weddings, funerals, baptisms, baby dedications, house blessings, anointing)
- Home/hospital visits
- Pre-marital counseling packages (multi-session)

**Pastor-side:**
- Define services with: name, description, duration, price (or free), virtual/in-person/both
- Set per-service availability rules
- View/manage bookings calendar
- Confirm, reschedule, cancel bookings with automated notifications
- Session notes (private, per booking)

**Follower-side:**
- Browse services by category or pastor
- Select pastor → select service → pick date/time → confirm
- Virtual meeting link auto-generated for virtual sessions
- Booking confirmation + calendar invite (ICS)
- Reschedule/cancel with policy rules

### F3. Prayer Wall

**Follower-side:**
- Submit prayer requests (public or anonymous)
- Browse prayer wall feed (newest first, filterable: all / answered / active)
- "Pray With" button — increment prayer count, optional prayer message
- Mark own prayer as "Answered" with testimony

**Pastor-side:**
- Prayer request inbox with filters (new, responded, follow-up needed)
- Respond with written prayers (visible to requester or public)
- Flag for follow-up, assign to specific pastor
- Prayer analytics: response times, volume trends

### F4. Sermon & Devotional Library

**Pastor-side:**
- Upload sermons: video (embed YouTube/Vimeo or direct upload), audio (MP3/WAV), written text
- Organize by: series, topic, scripture reference, date
- Schedule future publishing
- Daily devotional authoring with publish schedule

**Follower-side:**
- Browse/search sermon library by pastor, topic, series, scripture
- Audio/video player with progress tracking
- Bookmarks and watch history
- Daily devotional feed

### F5. Event Management

**Pastor-side:**
- Create events: title, description, date/time, location, capacity, category
- Categories: Bible study, revival, conference, workshop, retreat, fellowship
- RSVP tracking with waitlist support
- Event reminders (email)
- Recurring event support (weekly Bible study)

**Follower-side:**
- Browse upcoming events with calendar view
- RSVP with spot reservation
- Add to personal calendar (ICS export)
- Event history

### F6. Giving & Donations

**Pastor-side:**
- View giving dashboard: total received, trends, top campaigns
- Create fundraising campaigns (building fund, missions, benevolence)
- Generate giving reports (tax receipts, donor summaries)
- Per-pastor giving tracking (love offerings)

**Follower-side:**
- Give: tithes, offerings, love offerings (directed to specific pastor)
- Preset amounts ($25, $50, $100, $250, $500) + custom
- One-time or recurring giving
- Campaign-specific donations
- Giving history and tax-receipt downloads

**Payment processing:** Stripe.
- **Phases 1-3:** All donations go to the platform's Stripe account. Love offerings tagged with `pastor_id` are tracked internally for manual distribution by admin.
- **Phase 4:** Stripe Connect onboards each pastor as a connected account, enabling automatic per-pastor payouts with platform fee deduction.

### F7. Community Groups

**Pastor-side:**
- Create groups: name, description, type (small group, Bible study, prayer chain), pastor leader
- Manage membership (approve/remove)
- Post announcements

**Follower-side:**
- Browse and join groups
- Group discussion feed (text posts)
- Group meeting schedule
- Member directory within group

### F8. Testimonies Board

**Follower-side:**
- Submit testimonies (text, optionally anonymous)
- Browse published testimonies

**Pastor-side:**
- Moderation queue: approve/reject/edit submitted testimonies
- Feature testimonies on landing page

### F9. Resource Library

**Pastor-side:**
- Upload resources: Bible study guides, worksheets, devotionals, e-books (PDF, DOCX)
- Categorize by topic, target audience, associated sermon/series
- Set access level: free or members-only

**Follower-side:**
- Browse and download resources
- Filter by category, pastor, topic

### F10. Admin Console

For church admins (super-admin role):
- Manage all pastor accounts (invite, deactivate, edit roles)
- Organization-wide analytics: total engagement, giving, attendance, prayer volume
- Financial reports across all pastors
- Platform settings: branding, subdomain config, notification templates
- Manage pricing tier and billing

---

## Data Model (MongoDB Collections)

### Core Collections

```
users
├── _id: ObjectId
├── email: string (unique)
├── role: enum ["pastor", "follower", "admin"]
├── keycloak_id: string
├── pastor_id: ObjectId | null (for pastor-specific data isolation)
├── profile: {
│     first_name, last_name, phone, photo_url,
│     bio (pastor only), specialties[] (pastor only),
│     ministry_background (pastor only)
│   }
├── subscription: {
│     tier: enum ["shepherd", "minister", "ministry"],
│     stripe_subscription_id: string | null,
│     status: enum ["active", "trialing", "past_due", "cancelled"],
│     current_period_end: datetime | null
│   }
├── notification_prefs: {
│     email_bookings: bool (default true),
│     email_prayers: bool (default true),
│     email_events: bool (default true),
│     email_giving: bool (default true)
│   }
├── created_at, updated_at: datetime
```

```
services
├── _id: ObjectId
├── pastor_id: ObjectId (data isolation key)
├── name: string
├── description: string
├── category: enum ["counseling", "ceremony", "visit", "pre_marital", "other"]
├── duration_minutes: int
├── price_cents: int (0 for free)
├── mode: enum ["in_person", "virtual", "both"]
├── is_active: bool
├── created_at, updated_at: datetime
```

```
availability
├── _id: ObjectId
├── pastor_id: ObjectId
├── day_of_week: int (0-6)
├── start_time, end_time: string (HH:MM)
├── is_recurring: bool
├── specific_date: date | null (for overrides/blocks)
├── status: enum ["available", "blocked"]
```

```
bookings
├── _id: ObjectId
├── pastor_id: ObjectId
├── follower_id: ObjectId
├── service_id: ObjectId
├── date: date
├── start_time, end_time: string
├── mode: enum ["in_person", "virtual"]
├── status: enum ["pending", "confirmed", "completed", "cancelled", "no_show"]
├── meeting_link: string | null
├── notes: string (pastor-private)
├── package_id: ObjectId | null (links multi-session bookings)
├── created_at, updated_at: datetime
```

```
booking_packages
├── _id: ObjectId
├── pastor_id: ObjectId
├── follower_id: ObjectId
├── service_id: ObjectId
├── total_sessions: int
├── completed_sessions: int
├── status: enum ["active", "completed", "cancelled"]
├── created_at, updated_at: datetime
```

```
prayers
├── _id: ObjectId
├── author_id: ObjectId
├── is_anonymous: bool
├── text: string
├── status: enum ["active", "answered"]
├── pray_count: int
├── testimony: string | null
├── pastor_responses: [{
│     pastor_id, text, created_at
│   }]
├── assigned_pastor_id: ObjectId | null
├── follow_up_needed: bool
├── created_at, updated_at: datetime
```

```
sermons
├── _id: ObjectId
├── pastor_id: ObjectId
├── title: string
├── description: string
├── type: enum ["video", "audio", "text"]
├── media_url: string | null
├── embed_url: string | null (YouTube/Vimeo)
├── content_text: string | null
├── series: string | null
├── topic: string
├── scripture_ref: string | null
├── published_at: datetime | null
├── is_draft: bool
├── created_at, updated_at: datetime
```

```
events
├── _id: ObjectId
├── pastor_id: ObjectId
├── title: string
├── description: string
├── category: enum ["bible_study", "revival", "conference", "workshop", "retreat", "fellowship"]
├── date: date
├── start_time, end_time: string
├── location: string
├── capacity: int | null
├── rsvp_count: int
├── is_recurring: bool
├── recurrence_rule: string | null (iCal RRULE format, e.g. "FREQ=WEEKLY;BYDAY=WE")
├── created_at, updated_at: datetime
```

```
rsvps
├── _id: ObjectId
├── event_id: ObjectId
├── follower_id: ObjectId
├── status: enum ["confirmed", "waitlisted", "cancelled"]
├── created_at: datetime
```

```
donations
├── _id: ObjectId
├── donor_id: ObjectId (follower)
├── pastor_id: ObjectId | null (for love offerings)
├── campaign_id: ObjectId | null
├── amount_cents: int
├── type: enum ["tithe", "offering", "love_offering", "campaign"]
├── is_recurring: bool
├── stripe_payment_id: string
├── recurring_donation_id: ObjectId | null
├── created_at: datetime
```

```
recurring_donations
├── _id: ObjectId
├── donor_id: ObjectId
├── pastor_id: ObjectId | null
├── campaign_id: ObjectId | null
├── amount_cents: int
├── type: enum ["tithe", "offering", "love_offering"]
├── interval: enum ["weekly", "biweekly", "monthly"]
├── stripe_subscription_id: string
├── status: enum ["active", "paused", "cancelled"]
├── next_billing_date: date
├── created_at, updated_at: datetime
```

```
campaigns
├── _id: ObjectId
├── pastor_id: ObjectId | null (org-wide if null)
├── title: string
├── description: string
├── goal_cents: int
├── raised_cents: int
├── is_active: bool
├── created_at, updated_at: datetime
```

```
groups
├── _id: ObjectId
├── pastor_id: ObjectId (leader)
├── name: string
├── description: string
├── type: enum ["small_group", "bible_study", "prayer_chain"]
├── is_open: bool (open to join vs invite-only)
├── created_at, updated_at: datetime
```

```

```
group_memberships
├── _id: ObjectId
├── group_id: ObjectId
├── user_id: ObjectId
├── role: enum ["member", "leader"]
├── joined_at: datetime
```

```
group_posts
├── _id: ObjectId
├── group_id: ObjectId
├── author_id: ObjectId
├── text: string
├── is_announcement: bool
├── created_at: datetime
```

```
testimonies
├── _id: ObjectId
├── author_id: ObjectId
├── text: string
├── is_anonymous: bool
├── status: enum ["pending", "approved", "rejected"]
├── is_featured: bool
├── moderated_by: ObjectId | null
├── created_at, updated_at: datetime
```

```
resources
├── _id: ObjectId
├── pastor_id: ObjectId
├── title: string
├── description: string
├── file_url: string
├── file_type: enum ["pdf", "docx", "epub"]
├── category: string
├── topic: string
├── access_level: enum ["free", "members_only"]
├── download_count: int
├── created_at, updated_at: datetime
```

```
devotionals
├── _id: ObjectId
├── pastor_id: ObjectId
├── title: string
├── content: string
├── scripture_ref: string
├── publish_date: date
├── is_published: bool
├── created_at, updated_at: datetime
```

```
sermon_interactions
├── _id: ObjectId
├── user_id: ObjectId
├── sermon_id: ObjectId
├── type: enum ["progress", "bookmark"]
├── progress_seconds: int | null (for progress tracking)
├── created_at, updated_at: datetime
```

```
notifications
├── _id: ObjectId
├── user_id: ObjectId
├── type: enum ["booking_confirmed", "booking_cancelled", "booking_reminder",
│                "prayer_response", "event_reminder", "donation_receipt",
│                "group_post", "testimony_approved"]
├── title: string
├── body: string
├── reference_id: ObjectId (the related booking/prayer/event)
├── reference_type: string (collection name)
├── is_read: bool
├── email_sent: bool
├── created_at: datetime
```

### Data Isolation

All pastor-specific data is isolated via `pastor_id` field on every collection. API queries always scope by the authenticated pastor's ID. Followers see aggregated views across all pastors (filtered by public visibility). Admin role has cross-pastor read access for org-wide reporting.

---

## API Design (FastAPI Modular Monolith)

### Module Structure

```
backend/
├── app/
│   ├── main.py                   # FastAPI app, CORS, router mounts
│   ├── config.py                 # Settings (ports, DB, Stripe, etc.)
│   ├── auth/                     # Keycloak integration, JWT validation
│   │   ├── dependencies.py       # get_current_user, require_role
│   │   └── models.py
│   ├── modules/
│   │   ├── profiles/             # Pastor & follower profile CRUD
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── booking/              # Services, availability, bookings
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── prayer/               # Prayer wall, responses, tracking
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── sermons/              # Sermon CRUD, media, series
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── events/               # Events, RSVPs, recurrence
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── giving/               # Donations, campaigns, Stripe
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── groups/               # Community groups, posts
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── testimonies/          # Testimony submission, moderation
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── resources/            # Resource library, downloads
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── devotionals/          # Daily devotionals
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── notifications/        # Notification dispatch, preferences
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── subscriptions/        # Tier management, Stripe billing
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   ├── uploads/              # Presigned URLs, file management
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── models.py
│   │   └── admin/                # Org-wide admin, analytics
│   │       ├── router.py
│   │       ├── service.py
│   │       └── models.py
│   ├── ai/                       # AI adapter (mandatory pattern)
│   │   ├── adapter.py            # Abstract interface
│   │   ├── cli_adapter.py        # Dev: CLI subprocess
│   │   └── openrouter_adapter.py # Prod: Open Router
│   └── db/
│       ├── mongo.py              # Motor client, connection
│       └── indexes.py            # Collection indexes
```

### Key API Routes

```
# Auth
POST   /auth/register            # Pastor or follower registration
POST   /auth/login                # Keycloak token exchange

# Pastor Profiles
GET    /pastors                   # List all public pastors (follower portal)
GET    /pastors/{id}              # Single pastor profile
PUT    /pastors/me                # Update own profile (pastor)

# Services & Booking
GET    /pastors/{id}/services     # List pastor's services
POST   /services                  # Create service (pastor)
GET    /pastors/{id}/availability # Get availability slots
POST   /bookings                  # Book a session (follower)
GET    /bookings/me               # My bookings (pastor or follower)
PATCH  /bookings/{id}             # Update status (confirm/cancel)

# Prayer
GET    /prayers                   # Prayer wall feed (public)
POST   /prayers                   # Submit prayer request
POST   /prayers/{id}/pray         # "Pray With" interaction
POST   /prayers/{id}/respond      # Pastor response
PATCH  /prayers/{id}              # Mark answered, assign pastor

# Sermons
GET    /sermons                   # Browse sermons (filterable)
POST   /sermons                   # Upload sermon (pastor)
GET    /sermons/{id}              # Single sermon

# Events
GET    /events                    # Upcoming events
POST   /events                    # Create event (pastor)
POST   /events/{id}/rsvp          # RSVP to event (follower)

# Giving
POST   /donations                 # Make a donation (follower)
GET    /donations/me              # My giving history
GET    /donations/received        # Received donations (pastor)
POST   /campaigns                 # Create campaign (pastor)
GET    /campaigns                 # Browse active campaigns

# Groups
GET    /groups                    # Browse groups
POST   /groups                    # Create group (pastor)
POST   /groups/{id}/join          # Join group (follower)
GET    /groups/{id}/posts         # Group feed
POST   /groups/{id}/posts         # Post to group

# Testimonies
GET    /testimonies               # Approved testimonies
POST   /testimonies               # Submit testimony (follower)
PATCH  /testimonies/{id}          # Moderate (pastor)

# Resources
GET    /resources                 # Browse resources
POST   /resources                 # Upload resource (pastor)

# Devotionals
GET    /devotionals               # Browse all devotionals (paginated)
GET    /devotionals/today         # Today's devotional
GET    /devotionals/{id}          # Single devotional
POST   /devotionals               # Create devotional (pastor)

# Subscriptions & Tiers
GET    /subscription/me            # Current tier, usage, limits
POST   /subscription/checkout      # Create Stripe checkout for upgrade
POST   /subscription/cancel        # Cancel subscription
POST   /subscription/webhook       # Stripe webhook handler

# Notifications
GET    /notifications              # User's notifications (paginated)
PATCH  /notifications/{id}/read    # Mark notification as read
PUT    /notifications/preferences  # Update notification preferences

# Sermon Interactions
POST   /sermons/{id}/progress      # Save playback progress
POST   /sermons/{id}/bookmark      # Toggle bookmark
GET    /sermons/bookmarks          # My bookmarked sermons
GET    /sermons/history            # My watch history

# File Uploads
POST   /uploads/presign            # Get presigned S3 upload URL
POST   /uploads/confirm            # Confirm upload, get final URL

# Admin
GET    /admin/analytics           # Org-wide dashboard data
GET    /admin/pastors              # Manage pastor accounts
GET    /admin/reports/giving       # Financial reports
```

---

## Frontend Architecture

### Shared (npm workspace package: `@mtlbp/shared`)

Both portals share a local npm workspace package containing:
- Tailwind CSS config with the Warm & Welcoming theme tokens
- Axios instance pointing to `api.maythelordbepraised.com`
- Zustand auth store (Keycloak token management)
- Shared component library: buttons, cards, inputs, modals, navigation (themed)
- TypeScript types shared between portals

**Monorepo structure:**
```
frontend/
├── packages/
│   └── shared/            # @mtlbp/shared — components, config, stores, types
├── apps/
│   ├── pastor-portal/     # maythelordbepraised.com
│   └── follower-portal/   # connect.maythelordbepraised.com
├── package.json           # npm workspaces root
└── tsconfig.base.json
```

### Pastor Portal (`maythelordbepraised.com`)

```
src/
├── pages/
│   ├── Landing.tsx               # Pastor marketing landing page
│   ├── Login.tsx / Register.tsx
│   ├── Dashboard.tsx             # Home: stats, today's schedule, alerts
│   ├── Bookings.tsx              # Calendar view of all bookings
│   ├── Services.tsx              # Manage offered services
│   ├── Prayers.tsx               # Prayer request inbox
│   ├── Sermons.tsx               # Sermon library management
│   ├── Events.tsx                # Event management
│   ├── Giving.tsx                # Giving dashboard & reports
│   ├── Groups.tsx                # Manage community groups
│   ├── Testimonies.tsx           # Moderation queue
│   ├── Resources.tsx             # Upload & manage resources
│   ├── Devotionals.tsx           # Write & schedule devotionals
│   ├── Profile.tsx               # Edit own profile & availability
│   └── Settings.tsx              # Account settings
├── components/
│   ├── layout/ (Sidebar, TopBar, MobileNav)
│   ├── dashboard/ (StatCard, AppointmentList, PrayerAlert)
│   ├── booking/ (Calendar, BookingDetail, ServiceForm)
│   ├── prayer/ (PrayerInbox, PrayerResponse)
│   ├── sermon/ (SermonUploader, SermonCard)
│   ├── giving/ (GivingChart, DonationTable, CampaignForm)
│   └── shared/ (Button, Card, Modal, Input, Avatar, Tag)
├── stores/ (authStore, bookingStore, prayerStore, etc.)
├── api/ (axios instances per module)
└── hooks/ (useAuth, useBookings, usePrayers, etc.)
```

**Layout:** Sidebar navigation (independently scrollable per UX preferences) + main content area. Mobile: bottom tab navigation.

### Follower Portal (`connect.maythelordbepraised.com`)

```
src/
├── pages/
│   ├── Landing.tsx               # Immersive congregant landing page
│   ├── Login.tsx / Register.tsx
│   ├── Pastors.tsx               # Browse & search pastors
│   ├── PastorProfile.tsx         # Individual pastor page
│   ├── BookService.tsx           # Service selection & booking flow
│   ├── PrayerWall.tsx            # Prayer request feed
│   ├── Sermons.tsx               # Browse & watch sermons
│   ├── Events.tsx                # Upcoming events & RSVP
│   ├── Give.tsx                  # Giving page
│   ├── Groups.tsx                # Browse & join groups
│   ├── GroupDetail.tsx           # Group feed & members
│   ├── Testimonies.tsx           # Read testimonies
│   ├── Resources.tsx             # Browse & download
│   ├── MyBookings.tsx            # Booking history
│   ├── MyGiving.tsx              # Giving history & receipts
│   └── Profile.tsx               # Edit own profile
├── components/
│   ├── layout/ (Navbar, Footer, MobileNav)
│   ├── pastor/ (PastorCard, PastorFilter)
│   ├── booking/ (ServiceSelector, DatePicker, ConfirmationModal)
│   ├── prayer/ (PrayerCard, PrayerForm, PrayWithButton)
│   ├── sermon/ (SermonPlayer, SermonCard)
│   ├── event/ (EventCard, RSVPButton, CalendarExport)
│   ├── giving/ (AmountSelector, GivingForm, ReceiptCard)
│   └── shared/ (same shared components)
├── stores/
├── api/
└── hooks/
```

**Layout:** Top navigation bar + full-width content. Mobile: hamburger menu + bottom action bar.

---

## File Storage

**Provider:** MinIO (S3-compatible, self-hosted via Docker)

**Upload pipeline:**
1. Frontend requests a presigned upload URL from `POST /uploads/presign` (providing filename, MIME type, target: "sermon" | "resource" | "profile_photo")
2. Frontend uploads directly to MinIO using the presigned URL
3. Frontend confirms upload via `POST /uploads/confirm`, which validates the file exists and returns the permanent URL
4. Permanent URL is stored on the relevant document (sermon, resource, user profile)

**Constraints:**
- Sermon video: max 2GB, accepted MIME types: video/mp4, video/webm
- Sermon audio: max 200MB, accepted MIME types: audio/mpeg, audio/wav, audio/ogg
- Resources: max 50MB, accepted MIME types: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/epub+zip
- Profile photos: max 5MB, accepted MIME types: image/jpeg, image/png, image/webp

**Buckets:** `sermons`, `resources`, `profiles` — each with appropriate lifecycle policies.

---

## AI Integration

Using the mandatory Adapter Pattern:

**Use cases:**
- Prayer response suggestions — AI drafts a pastoral prayer response based on the prayer request
- Sermon transcription — auto-transcribe audio/video sermons to text
- Devotional drafts — AI assists pastors in drafting daily devotionals from scripture references
- Smart search — semantic search across sermons, resources, prayers via **Citex** (mandated RAG system)

**Citex integration:** Sermons (transcribed text), resources (extracted text), and prayer requests are indexed into Citex for semantic search. Followers can search across all public content using natural language queries. Citex handles embedding, indexing, and retrieval.

All AI features are pastor-side tools, never directly facing followers (except semantic search results). Pastors review and edit all AI-generated content before publishing.

---

## Pricing Tiers

| Tier | Price | Pastors | Bookings | Sermons | Giving | Groups | Events |
|------|-------|---------|----------|---------|--------|--------|--------|
| Shepherd | Free | 1 | 20/mo | 5 | No | No | 2/mo |
| Minister | $29/mo | 1 | Unlimited | Unlimited | Yes | Yes | Unlimited |
| Ministry | $79/mo | Up to 10 | Unlimited | Unlimited | Yes | Yes | Unlimited |

Ministry tier includes: admin console, org-wide analytics, custom branding, resource library, priority support.

---

## Mobile-First Design Principles

1. **Breakpoints:** 480px (mobile), 768px (tablet), 1024px+ (desktop)
2. **Touch targets:** minimum 44x44px for all interactive elements
3. **Navigation:** bottom tab bar on mobile (both portals), sidebar collapses to hamburger
4. **Content priority:** stack columns vertically on mobile, most important content first
5. **Forms:** full-width inputs on mobile, stepped wizards for complex flows (booking)
6. **Images:** lazy loading, responsive srcset
7. **Performance:** code-split by route, skeleton loaders

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- Auth (Keycloak) with pastor/follower/admin roles
- Pastor profiles + follower registration
- Service definitions + booking engine
- Both landing pages
- Prayer wall (submit + browse + pray-with)
- Basic giving (one-time Stripe payments)
- Docker Compose setup

### Phase 2: Content & Community
- Sermon library (upload, browse, player)
- Event management + RSVP
- Community groups
- Devotional system
- Recurring giving

### Phase 3: Engagement & Growth
- Testimonies board with moderation
- Resource library
- Admin console + org-wide analytics
- AI features (prayer response suggestions, transcription)
- Campaign fundraising
- Email notifications (booking confirmations, prayer responses, event reminders)

### Phase 4: Scale & Polish
- Advanced analytics dashboards
- Custom branding per ministry
- Mobile app considerations (PWA)
- Search optimization (sermons, pastors, resources)
- Tax receipt generation
- Stripe Connect for per-pastor payouts

---

## Footer

All pages across both portals include:

```
© 2026 MayTheLordBePraised. All rights reserved.
Powered by yensi.solutions
```
