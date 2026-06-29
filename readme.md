
# 🏛️ Venue Booking Platform

> **A production-oriented multi-vendor venue booking platform built with Node.js, Express, Prisma, PostgreSQL, Next.js and Razorpay.**

---

# Overview

This project is a **full-stack marketplace for booking event venues** where users can discover venues, reserve time slots, purchase additional services, and securely complete payments.

The system supports three major actors:

- 👤 Users
- 🏢 Providers (Hosts)
- 🛡️ Administrators

The platform focuses heavily on **booking correctness**, **role-based access control**, and **concurrency-safe reservation management**.

---

# Features

## Authentication

- JWT Authentication
- Secure Cookies
- Protected Routes
- Role-based Authorization
- Provider Verification

---

## Provider Portal

- Provider onboarding
- KYC/Profile
- Venue Management
- Service Listing
- Booking Dashboard

---

## Admin Portal

- Provider approval
- Venue approval
- Service approval
- RBAC Management
- Permission Management
- Action Logs

---

## User Features

- Browse Venues
- Venue Details
- Availability Calendar
- Wishlist
- Book Venue
- Razorpay Payments
- Booking History
- Booking Cancellation

---

# Tech Stack

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Razorpay
- JWT
- Cookie Parser

## Frontend

- Next.js
- React
- Tailwind CSS

---

# Project Architecture

```
Client (Next.js)
       │
       ▼
Express API
       │
Controllers
       │
Services
       │
Prisma ORM
       │
PostgreSQL
```

---

# Folder Structure

```text
modules
│
├── auth
├── booking
│   ├── availability
│   ├── host
│   └── booking
│
├── offerings
│   ├── admin
│   └── provider
│
├── payment
│
├── provider
│
├── rbac
│
├── reference-data
│
└── venue
    ├── admin
    ├── provider
    └── public
```

---

# API Overview

## Authentication

```
/api/v1/auth/*
```

## Venues

```
GET    /api/v1/venues
GET    /api/v1/venues/:venueId
GET    /api/v1/venues/:venueId/availability
```

## Booking

```
POST   /api/v1/book/venues/:venueId
GET    /api/v1/book/booking/:bookingId
PATCH  /api/v1/book/booking/:bookingId
DELETE /api/v1/book/booking/:bookingId
GET    /api/v1/book/my-bookings
```

## Payment

```
POST /api/v1/payment/create-order
POST /api/v1/payment/verify-payment
POST /api/v1/payment/webhook
```

---

# Booking Lifecycle

```text
CART
   │
   ▼
PENDING_PAYMENT
   │
   ├──────────────┐
   │              │
Payment       Timeout
Success       /Cancel
   │              │
   ▼              ▼
CONFIRMED     CART

CONFIRMED
      │
      ├──── Cancel
      ▼
 CANCELLED

After Event

CONFIRMED
      │
      ▼
 COMPLETED
```

---

# Payment Flow

```text
Select Slot
      │
Create Booking
      │
PENDING_PAYMENT
      │
Create Razorpay Order
      │
User Pays
      │
Verify Signature
      │
CONFIRMED
```

---

# Concurrency Handling

One of the most important goals of the platform is preventing double-booking.

The system uses:

- Database transactions
- Availability validation before payment
- Pending-payment slot locking
- Booking expiration (`expiresAt`)
- Atomic booking creation
- Overlapping time-slot checks
- Payment verification before confirmation

### Example

Two users click **Pay** simultaneously.

1. Both attempt booking.
2. Transaction checks overlapping reservations.
3. First transaction succeeds.
4. Second transaction fails because the slot becomes unavailable before commit.

This guarantees that only one booking can occupy a time slot.

---

# Booking States

| State | Meaning |
|--------|----------|
| CART | User created booking but not proceeding |
| PENDING_PAYMENT | Slot locked for payment |
| CONFIRMED | Payment verified |
| CANCELLED | User cancelled |
| COMPLETED | Event finished |
| REFUNDED | Payment refunded |

---

# Provider Workflow

```text
Create Profile
      │
Submit
      │
PENDING
      │
Admin Review
      │
APPROVED
      │
List Venues
```

---

# Venue Workflow

```text
Provider Creates Venue
          │
Admin Review
          │
APPROVED
          │
Visible to Users
```

---

# Security

- JWT Authentication
- RBAC
- Validation Middleware
- Protected Routes
- Prisma ORM
- Parameterized Queries
- Secure Payment Verification

---

# Installation

```bash
git clone https://github.com/jenil-p/venues

cd backend & cd frontend (in new terminal)

npm install
```

---

# Environment Variables

```
.env.example files at

- https://github.com/jenil-p/venues/backend/.env.example
- https://github.com/jenil-p/venues/frontend/.env.example
```

---

# Run

```bash
npm run dev (for both backend and frontend)
```

---

# Database

```bash
npx prisma generate

npx prisma migrate dev

npx prisma studio
```

---

# Current Progress

- Authentication
- RBAC
- Provider Onboarding
- Venue Listing
- Venue Approval
- Availability API
- Booking Engine
- Razorpay Integration
- Booking Cancellation
- Wishlist
- User Dashboard
- Provider Dashboard


---

# Future Scope

- Dynamic Pricing
- Multi-currency
- Google Maps
- Recommendation Engine
- AI Search

---

