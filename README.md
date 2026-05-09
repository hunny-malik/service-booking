# ServiceHub - Premium Home Services Booking Platform

A full-stack, production-ready service booking platform built with Next.js 15, Tailwind CSS, and NextAuth. Designed with a premium, mobile-first aesthetic for internship presentations and real-world scalability.

## 🌟 Key Features

### 1. Advanced Authentication
- **Google Sign-In**: One-click seamless login using Google OAuth (`NextAuth.js`).
- **Real Email OTP**: Secure, stateless 4-digit verification codes sent directly to user emails via `nodemailer` (Gmail SMTP).
- **JWT Sessions**: Secure session management via HttpOnly cookies without needing a dedicated database.

### 2. Premium UI/UX Design
- **Modern Split-Screen Login**: Professional, SaaS-standard login page layout.
- **Glassmorphism & Soft Shadows**: "Apple-style" diffused shadows and frosted glass navigation bars.
- **Framer Motion Animations**: Smooth page transitions, staggered list reveals, and interactive hover effects.
- **Dynamic Search Hero**: A real-world directory-style hero section for immediate user engagement.

### 3. Smart Booking Features
- **GPS Auto-Detect**: Automatically fetches user coordinates and reverse-geocodes them into a readable physical address using OpenStreetMap Nominatim.
- **Form Validation**: Strict client-side validation using React Hook Form and Zod.
- **Status Lifecycle**: Complete booking workflow (`Pending` → `Accepted` → `In Progress` → `Delivered`).

### 4. Role-Based Dashboards
- **Customer Portal**: Track active bookings, history, and profile details.
- **Vendor Portal**: Dedicated interface to accept new requests, update task statuses, and track total INR (₹) earnings.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Serverless API Routes)
- **Styling**: Tailwind CSS, CSS Variables (Premium Indigo/Slate Theme)
- **State Management**: Zustand (with Local Storage Persistence for instant demos)
- **Authentication**: NextAuth.js (Auth.js), JsonWebToken, crypto
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

---

## 💻 Running Locally

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd service-booking
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_jwt_string

# Google OAuth (From Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gmail SMTP for OTP
SMTP_EMAIL=your_gmail_address@gmail.com
SMTP_PASSWORD=your_16_character_app_password
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🌐 Deployment (Vercel)

The app is fully optimized for zero-config deployment on Vercel.

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. **Important**: Add all your Environment Variables (`NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, etc.) in the Vercel deployment settings.
   - *Note: Change `NEXTAUTH_URL` to your production domain once deployed.*
5. Click **Deploy**.

## 📝 Demo Credentials (If bypassing Auth)
- **Customer**: Authenticate via Google or real Email OTP.
- **Vendor**: `vendor@demo.com` / `vendor123`
