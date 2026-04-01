<div align="center">

# 🏨 PRISMA_CONNECTION_STEPS

**A production-grade backend starter app built with Node.js · TypeScript · Prisma · MySQL**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

---

*A step-by-step reference for integrating Prisma ORM into a TypeScript backend — built for learning, built for production.*

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Guide](#-setup-guide)
  - [Step 0 — Clone the Starter](#step-0--clone-the-typescript-starter)
  - [Step 1 — Install Prisma CLI](#step-1--install-the-prisma-cli)
  - [Step 2 — Install Prisma Client](#step-2--install-the-prisma-client)
  - [Step 3 — Initialise Prisma](#step-3--initialise-prisma-inside-src)
  - [Step 4 — Write the Schema & Model](#step-4--write-the-schema--booking-model)
  - [Step 5 — Generate the Client](#step-5--generate-the-prisma-client)
  - [Step 6 — Fix the .env Issue](#step-6--fix-the-env-file-location)
  - [Step 7 — Repository Layer](#step-7--verify-with-the-repository-layer)
- [Router Architecture](#-router-architecture-coming-soon)
- [Scripts](#-scripts)
- [Common Gotchas](#-common-gotchas)

---

## 🌐 Overview

This service handles hotel booking operations as part of a larger Airbnb-style microservices system. It demonstrates a clean, layered backend architecture where each concern is strictly separated — from routing down to raw database queries via Prisma.

> 💡 **Purpose of this repo:** Serve as a teaching resource and a living reference for integrating Prisma ORM in a TypeScript + Express project from scratch.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Language** | TypeScript 5.x | Type safety across the entire codebase |
| **Framework** | Express v5 | HTTP server & routing |
| **ORM** | Prisma | Type-safe database queries & migrations |
| **Database** | MySQL | Relational data store |
| **Validation** | Zod | Runtime schema validation |
| **Logging** | Winston | Structured, rotated logs |
| **Dev Server** | Nodemon | Auto-restart on file changes |

---

## 📁 Project Structure

```
airbnb_dev/
│
├── 📄 .env                        # Environment variables (DB url, port)
├── 📄 sample.env                  # Template — copy this to .env
├── 📄 package.json
├── 📄 tsconfig.json
│
└── src/
    ├── 📄 server.ts               # App entry point
    │
    ├── prisma/
    │   ├── 📄 schema.prisma       # ← DB models live here
    │   └── 📄 client.ts           # ← Singleton Prisma client
    │
    ├── repositories/              # Raw Prisma queries (DB layer)
    ├── service/                   # Business logic
    ├── controllers/               # Request / response handling
    ├── routes/                    # Express route definitions
    ├── middlewares/               # Auth, error handling
    ├── validators/                # Zod validation schemas
    └── config/                    # App-level config
```

---

## 🚀 Setup Guide

### Step 0 — Clone the TypeScript Starter

```bash
git clone <repo-url>
cd airbnb_dev
npm install
```

> The starter already includes Express, TypeScript, Nodemon, Winston, and Zod — ready to go so you can focus entirely on Prisma.

---

### Step 1 — Install the Prisma CLI

```bash
npm install -D prisma
```

> **Why `-D`?** The `prisma` package is a **dev dependency** — it's only used during development for running migrations and generating client code. It's never needed at runtime.

---

### Step 2 — Install the Prisma Client

```bash
npm install @prisma/client
```

> **Two packages, two roles:**
> | Package | Role |
> |---|---|
> | `prisma` | CLI — migrations, generate, studio |
> | `@prisma/client` | Runtime query engine — imported in your code |

---

### Step 3 — Initialise Prisma inside `src/`

```bash
npx prisma init --schema=src/prisma/schema.prisma
```

This scaffolds two things:
- **`src/prisma/schema.prisma`** — your schema definition file
- **`.env`** — with a `DATABASE_URL` placeholder

> **Why inside `src/`?** All source code is co-located. This keeps the schema close to the client and repository files that depend on it.

---

### Step 4 — Write the Schema & Booking Model

Edit `src/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Booking {
  id            Int           @id @default(autoincrement())
  hotelId       Int
  userId        Int
  bookingAmount Int
  bookingStatus BookingStatus
  totalGuests   Int
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}
```

**What each attribute does:**

| Attribute | Meaning |
|---|---|
| `@id` | Marks this field as the primary key |
| `@default(autoincrement())` | DB auto-assigns an incrementing integer |
| `@default(now())` | Prisma sets `createdAt` to the current timestamp on insert |
| `@updatedAt` | Prisma automatically updates this on every record change |
| `enum BookingStatus` | Generates a **TypeScript enum type automatically** — no manual typing needed |

> ✨ **Auto-generated types** — as soon as you define the model, Prisma generates `Prisma.BookingCreateInput`, `Prisma.BookingUpdateInput`, and more. You never have to write these interfaces by hand.

---

### Step 5 — Generate the Prisma Client

```bash
npx prisma generate
```

This reads `schema.prisma` and writes fully typed query helpers into `node_modules/@prisma/client`. You'll get autocomplete and compile-time errors for every query.

> ⚠️ **Run this every time you change the schema.** Otherwise your types will be out of sync with your database.

**Then create the singleton client at `src/prisma/client.ts`:**

```typescript
import { PrismaClient } from "@prisma/client";

export default new PrismaClient();
```

> **Why a singleton?**  
> Each `new PrismaClient()` opens a connection pool to the database. Creating one per request would exhaust connections fast. Exporting a single instance means the whole app shares one pool safely.

---

### Step 6 — Fix the `.env` File Location

By default, Prisma looks for `.env` in the **project root** (next to `package.json`). If it's placed anywhere else, Prisma won't find `DATABASE_URL` and you'll get a cryptic connection error.

**Correct structure:**
```
airbnb_dev/
├── .env              ✅  ← Must be here
├── package.json
└── src/
    └── prisma/
        └── schema.prisma
```

Fill in your credentials:

```env
PORT=4444
DATABASE_URL=mysql://root:<your-password>@localhost:3306/airbnb_booking
```

Bootstrap from the template:
```bash
cp sample.env .env
# then open .env and fill in your values
```

Once configured, run your first migration to create the tables:

```bash
npm run migrate -- init
# runs: npx prisma migrate dev --name init
```

---

### Step 7 — Verify with the Repository Layer

With Prisma connected, test it by writing a real query in `src/repositories/booking.repository.ts`:

```typescript
import { Prisma } from "@prisma/client";
import prisma from "../prisma/client.ts";

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
  const booking = await prisma.booking.create({
    data: bookingInput,
  });
  return booking;
}
```

**What makes this powerful:**
- **`Prisma.BookingCreateInput`** — generated from your schema. If you add/remove a required field in the schema and re-generate, TypeScript will immediately flag mismatches in this function.
- **`prisma.booking.create()`** — fully type-safe. Wrong field names are caught at compile time, not at runtime.

---

## 🗂 Router Architecture *(Coming Soon)*

The project follows a strict layered architecture principle:

```
 HTTP Request
      │
      ▼
 ┌─────────┐
 │  Router │   →  Defines endpoints, maps to controllers
 └────┬────┘
      │
      ▼
 ┌────────────┐
 │ Controller │  →  Parses req/res, calls service
 └─────┬──────┘
       │
       ▼
 ┌─────────┐
 │ Service │   →  Business logic, orchestration
 └────┬────┘
      │
      ▼
 ┌────────────┐
 │ Repository │  →  Raw Prisma queries — only layer that talks to DB
 └─────┬──────┘
       │
       ▼
    MySQL DB
```

```typescript
// src/routes/booking.routes.ts  (planned)
import { Router } from "express";
import { createBookingController } from "../controllers/booking.controller";

const router = Router();

router.post("/bookings", createBookingController);

export default router;
```

---

## 📜 Scripts

```bash
# Start the dev server with auto-reload
npm run dev

# Create and apply a new DB migration
npm run migrate -- <migration-name>

# Re-generate Prisma client after schema changes
npx prisma generate

# Open the visual database browser
npx prisma studio
```

---

## ⚠️ Common Gotchas

| ❌ Problem | ✅ Fix |
|---|---|
| `PrismaClient` not exported from `@prisma/client` | Set `provider = "prisma-client-js"` in schema (not `"prisma-client"`) |
| Prisma can't find `DATABASE_URL` | Ensure `.env` is in the **project root**, not inside `src/` |
| Types out of date after schema change | Run `npx prisma generate` again |
| Too many DB connections | Export a single `PrismaClient` instance as a singleton |
| Migration fails | Make sure your MySQL server is running and the DB exists |

---

<div align="center">

Made with ☕ and TypeScript · Prisma Docs at [pris.ly](https://pris.ly/d/prisma-schema)

</div>
