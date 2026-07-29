# 🏛️ Venue Booking Platform

A **multi-vendor venue booking marketplace** — users discover venues, book time slots, and pay via Razorpay. Built with async job queues (BullMQ), Redis caching, RBAC, and email notifications.

---

## 🛠️ Tech Stack

| Backend | Frontend | Infrastructure |
|---------|----------|---------------|
| Node.js + Express | Next.js (App Router) | PostgreSQL |
| Prisma ORM | Tailwind CSS | Redis (cache + BullMQ) |
| BullMQ (job queues) | Axios | - |
| Razorpay (payments) | - | - |
| Twilio (SMS OTP) | - | - |
| Resend (email) | - | - |

---

## 🏗️ Architecture

```text
┌──────────────┐
│Next.js(:3000)│
└──────┬───────┘
       │ Axios
       ▼
┌──────────────┐          ┌──────────────────┐
│Express(:8000)│◄───────  │    Redis         │
└──────┬───────┘          │  ┌────────────┐  │
       │                  │  │ Venue Cache│  │
       ▼                  │  │ (TTL 120s) │  │
┌──────────────┐          │  ├────────────┤  │
│  PostgreSQL  │          │  │ BullMQ     │  │
│ (via Prisma) │          │  │ Backend    │  │
└──────────────┘          │  └────────────┘  │
                          └──────────────────┘
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                   ┌────────────┐  ┌──────────────┐
                   │  Payment   │  │ Notification │
                   │  Worker    │  │   Worker     │
                   └────────────┘  └──────┬───────┘
                                          ▼
                                   ┌──────────────┐
                                   │Resend (email)│
                                   │(mockfallback)│
                                   └──────────────┘
```

---

## ⚙️ How It Works

### Booking Lifecycle

```
CART → PENDING_PAYMENT (slot locked, 15min expiry)
         ├── Payment success → CONFIRMED
         ├── Timeout → CART (slot freed)
         └── User cancels → CART
CONFIRMED → User cancels → CANCELLED
CONFIRMED → Event passes → COMPLETED
```

### Payment Webhook Flow (Async via BullMQ)

```
Razorpay webhook → API verifies HMAC → enqueues job → returns 200 OK (instant)
                         ↓
                Payment Worker (idempotent)
                         ↓
                Updates DB (transaction) + enqueues notification
                         ↓
                Notification Worker → Resend email (or console mock)
```

### Venue Cache Flow

```
API call → Redis check?
  ├── Hit → return cached JSON (TTL 120s)
  └── Miss → Prisma → PostgreSQL → populate cache → return JSON
```

---

## ✨ Features

### 👤 Users
- OTP login via Twilio SMS
- Browse venues (Redis-cached) with photo galleries
- Book venues with real-time availability calendar
- Pay via Razorpay (cards, UPI, netbanking)
- Wishlist management
- Booking history & cancellation
- Email notifications on confirm/cancel

### 🏢 Providers (Hosts)
- KYC onboarding with approval workflow
- Venue CRUD (photos, types, features, pricing)
- Service listing management (comming soon...)
- Booking dashboard & revenue insights

### 🛡️ Admin
- Provider/venue/service approval
- RBAC with granular table+operation permissions
- User-role assignment & action logs

### ⚡ Background Jobs (New)
- **BullMQ**: Payment processing + email notifications run asynchronously
- **Redis caching**: Venue listing/detail endpoints cached with 120s TTL
- **Idempotent webhooks**: Duplicate Razorpay webhooks safely skipped
- **Graceful degradation**: Redis down → DB fallback; no Resend key → console mock

---

## 📁 Folder Structure

```
backend/
├── index.js
├── prisma/                    # Schema, client, migrations
├── redis/client.js             # ioredis singleton
├── queues/                     # BullMQ queues
│   ├── payment.queue.js
│   └── notification.queue.js
├── workers/                    # BullMQ workers
│   ├── index.js
│   ├── payment.worker.js
│   └── notification.worker.js
├── emails/                     # Resend client + HTML templates
│   ├── resend.client.js
│   └── templates.js
├── middlewares/                # Auth, RBAC, validation, logging
└── modules/
    ├── auth/                   # OTP login (Twilio)
    ├── booking/                # Booking engine + availability
    ├── offerings/              # Provider services
    ├── payment/                # Razorpay integration
    ├── provider/               # Provider profiles
    ├── rbac/                   # Roles, permissions, users
    ├── reference-data/         # Addresses, resources
    └── venue/                  # Admin / provider / public endpoints

frontend/
└── src/
    ├── app/                    # Next.js App Router pages
    │   ├── page.js             # Home
    │   ├── properties/         # Venue details
    │   ├── bookings/           # User booking history
    │   ├── my-wishlists/       # Wishlist
    │   ├── host/               # Provider portal
    │   └── admin/              # Admin panel
    ├── api/                    # Axios service layer
    ├── components/             # Reusable UI
    └── context/AuthContext.jsx # Auth state
```

---

## 📖 API Overview

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Create account |
| POST | `/api/v1/auth/otp` | Send OTP |
| POST | `/api/v1/auth/otp/verify` | Verify OTP & login |
| GET | `/api/v1/auth/me` | Current user |

### Venues (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/venues` | List venues (cached) |
| GET | `/api/v1/venues/:venueId` | Venue details (cached) |
| GET | `/api/v1/venues/:venueId/availability` | Slot availability |

### Booking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/book/venues/:venueId` | Create booking |
| GET | `/api/v1/book/booking/:bookingId` | Booking details |
| DELETE | `/api/v1/book/booking/:bookingId` | Cancel booking |
| GET | `/api/v1/book/my-bookings` | User bookings |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payment/create-order` | Create Razorpay order |
| POST | `/api/v1/payment/verify-payment` | Verify payment |
| POST | `/api/v1/payment/webhook` | Razorpay webhook → enqueues job |

### Provider
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT | `/api/v1/providers/venues` | Venue management |
| GET | `/api/v1/providers/bookings` | Booking dashboard |
| GET | `/api/v1/providers/bookings/insights` | Revenue insights |
| POST | `/api/v1/providers-profile` | Submit provider application |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH/DELETE | `/api/v1/admin/providers/:id/approval` | Provider approval |
| PATCH/DELETE | `/api/v1/admin/venues/:id/approval` | Venue approval |
| POST/GET | `/api/v1/admin/roles` | Role management |
| POST/DELETE | `/api/v1/admin/users/:userId/roles/:roleId` | User-role assignment |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/wishlist/my-wishlist` | View wishlist |
| POST | `/api/v1/wishlist/venues/:venueId/toggle` | Toggle wishlist |

---

## 🔐 Environment Variables

```env
# Server
PORT=8000
DEVELOPMENT_FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/venue_finder

# Auth
JWT_SECRET=your-secret-key

# Twilio (SMS OTP)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SERVICE_SID=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Booking
PENDING_PAYMENT_EXPIRY_MINUTES=15

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Resend (email - optional, logs to console when absent)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@venuefinder.app
```

---

## 🚀 Getting Started

```bash
# Prerequisites: Node.js 20+, PostgreSQL, Redis, docker

#Terminal 1- docker
docker compose up -d

# Backend API
cd backend
npm install
npx prisma generate && npx prisma migrate dev
npm run dev                    # localhost:8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev                    # localhost:3000

# Terminal 3 — Background Workers
cd backend
npm run workers                # BullMQ payment + notification workers
```
