# Tech Thela AI: Technical Architecture & Features Overview

This document provides a comprehensive breakdown of the Tech Thela AI platform—a next-gen aggregator for street vendors designed for the Smart India Hackathon.

## 🏗 Core Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion (Animations), Swiper (Carousels).
- **Backend**: Next.js API Routes, Node.js.
- **Real-time**: Socket.io (for Mesh Network & Ping Simulation).
- **Database**: MongoDB Atlas (Mongoose ODM).
- **Auth**: NextAuth.js (Vendor & Customer flows).
- **Notifications**: React Hot Toast (Professional feedback).

---

## 🛍 Customer Features

### 1. Dynamic Vendor Radar
- **Tech**: `framer-motion` SVG-based radar.
- **Functionality**: Visualizes moving vendors in real-time within a 1.5km radius.
- **Innovation**: Replaces static maps with an "active search" experience.

### 2. Geolocation-Based Discovery (`NearbyVendors`)
- **Tech**: `navigator.geolocation` + MongoDB `2dsphere` index.
- **Functionality**: Finds vendors sorted by proximity.
- **Fallback**: Includes "Demo Mode" fallback data for offline presentations.

### 3. AI Vendor Recommendations
- **Tech**: Preference-matching algorithm in `pages/Customer.tsx`.
- **Functionality**: Suggests vendors based on user history and "Match Scores".

### 4. 5G Mesh Demand Ping (`ConsumerPing`)
- **Tech**: Socket.io broadcasting.
- **Functionality**: Broadcasts a "Broad-Demand" signal to all nearby vendors when a customer needs a product not currently listed.

### 5. Seamless QR Payment Simulation
- **Tech**: `PaymentScanner.tsx`.
- **Functionality**: Simulated QR scan with 3-stage verification (Scanning -> Verifying -> Success).

---

## 🧑‍🌾 Vendor Features

### 1. Zero-Touch AI Inventory (`UpdateCart`)
- **Tech**: 2.5s simulated neural latency with React state management.
- **Functionality**: "Simulate Demo" button allows vendors to "scan" their carts; AI detects items (Onion, Tomato, etc.) and populates quantities automatically.

### 2. AI Market Insights (`VendorInsights`)
- **Tech**: Predictive weighting engine.
- **Functionality**: 
  - **Probability Cards**: Shows likelihood of high sales for specific products.
  - **Movement Suggestions**: Advises vendors to move to specific sectors for higher footfall.

### 3. Live Customer Tracking (`LocateCustomer`)
- **Tech**: Animated proximity pulses.
- **Functionality**: Shows callers/pingers on a live map within the vendor dashboard.

### 4. Vendor Leaderboard
- **Tech**: Rank-based sorting of vendor performance.
- **Functionality**: Encourages performance through gamification.

---

## ⚙️ Backend & Simulation Logic

### 1. 5G Mesh Simulation
- **Logic**: Uses Socket.io to simulate a localized mesh network where pings are multi-casted to all active vendor sockets in the same "sector".

### 2. Smart Seeding (`seedDemoData.js`)
- **Logic**: Generates 5 realistic Indian vendor profiles with GPS coordinates centered around Delhi (Ambika Vihar/Paschim Vihar).

### 3. API Reliability Layer
- **Logic**: Every critical endpoint (`nearby`, `predict`, `scan`) includes a `demoFallback` block to ensure 0% crash rate during live judging.

---

## 🛡 Security & Performance
- **Data Integrity**: Mongoose schemas for `Vendor`, `User`, `Ping`, and `Reviews`.
- **UX**: Optmized with skeleton loaders and micro-animations for a "Premium" feel.
- **SEO**: Ready with meta tags and semantic HTML for vendor discoverability.
