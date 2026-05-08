# 🎪 Spott – Full Stack Event Management Platform

Spott is a full-stack event management platform with AI-powered event generation, QR code ticketing with real-time check-in scanning, an organizer dashboard with live analytics, and location-based event filtering across India.

---

## ✨ Features

- 🤖 **AI Event Generation** – Generate event details instantly using the Claude API
- 🎟️ **QR Code Ticketing** – Attendees receive QR code tickets for seamless check-in
- 📷 **Real-Time QR Scanner** – Organizers scan QR codes for live attendee check-in
- 📊 **Organizer Dashboard** – Live analytics with capacity, check-in rate, and revenue tracking
- 🔄 **Real-Time Data Sync** – Powered by Convex serverless functions for instant updates
- 🖼️ **Unsplash Image Picker** – Beautiful event cover images via Unsplash API
- 📥 **CSV Export** – Export attendee data directly from the dashboard
- 📍 **Location-Based Filtering** – Filter events by state and city across India
- 🔒 **Authentication** – Secure login and session management via Clerk
- 📱 **Responsive Design** – Fully responsive across mobile and desktop

---

## 🛠 Tech Stack

### Frontend

| Tool | Purpose |
|------|---------|
| Next.js 14 | Full-stack React framework (App Router + Server Actions) |
| React | UI components and client-side interactivity |
| Tailwind CSS | Utility-first styling |
| Shadcn/UI | Accessible component library |
| React Hook Form | Form state management |
| Zod | Schema validation |

### Backend & Database

| Tool | Purpose |
|------|---------|
| Convex | Serverless backend with real-time data sync |
| Clerk | Authentication and user session management |

### Integrations

| Service | Purpose |
|---------|---------|
| Claude API | AI-powered event content generation |
| Unsplash API | Event cover image search and selection |
| Vercel | Deployment and hosting |

---

## 🚀 Run Locally

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts on: Clerk, Convex, Anthropic (Claude), Unsplash

### 1. Clone the Repository

```bash
git clone https://github.com/rajdeepietlko27/spott.git
cd spott
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Claude AI
CLAUDE_API_KEY=your_claude_api_key

# Unsplash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

### 4. Start the Convex Dev Server

```bash
npx convex dev
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 How It Works

```
User signs up via Clerk
        ↓
Creates an event (manual or AI-generated via Claude API)
        ↓
Picks event cover image via Unsplash picker
        ↓
Event saved to Convex with real-time sync

── Attendee Flow ──────────────────────────
Browses events filtered by state & city
        ↓
Registers for event → QR code ticket generated
        ↓
Receives ticket with unique QR code

── Organizer Flow ──────────────────────────
Opens organizer dashboard
        ↓
Views live analytics (capacity / check-in rate / revenue)
        ↓
Scans attendee QR codes for real-time check-in
        ↓
Exports attendee data as CSV
```

---

## 📁 Project Structure

```
spott/
├── app/
│   ├── (auth)/        # Auth pages
│   ├── (root)/        # Main app pages
│   │   └── api/       # API routes
├── components/        # Reusable UI components
├── convex/            # Convex serverless functions & schema
├── lib/               # Utility functions
└── hooks/             # Custom React hooks
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key from [Clerk Dashboard](https://clerk.com) |
| `CLERK_SECRET_KEY` | Secret key from Clerk Dashboard |
| `NEXT_PUBLIC_CONVEX_URL` | Deployment URL from [Convex Dashboard](https://convex.dev) |
| `CLAUDE_API_KEY` | API key from [Anthropic Console](https://console.anthropic.com) |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Access key from [Unsplash Developers](https://unsplash.com/developers) |

---

## 🌐 Deployment

Deployed on **Vercel**. Connect your GitHub repo and add the environment variables in the Vercel dashboard.

---

## 👨‍💻 Author

**Rajdeep Singh**

- GitHub: [@rajdeepietlko27](https://github.com/rajdeepietlko27)