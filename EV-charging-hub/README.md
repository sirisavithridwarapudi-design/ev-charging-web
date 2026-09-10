# ⚡ VoltHub - AI-Powered EV Charging Infrastructure

VoltHub is a GIS-powered EV charging station discovery and predictive availability platform. It leverages AI (Groq Llama 3) to predict station occupancy and provide smart recommendations to users.

---

## 🚀 Key Features

### 🌍 GIS Map Discovery
- **Interactive Map**: Built with Leaflet, featuring clustered markers and dark-mode aesthetics.
- **High-Visibility Markers**: Pulsing animations and glowing targets for selected stations.
- **Smart Filtering**: Filter by charger type (AC/DC/CCS/etc.), power rating, and radius.
- **Real-time Status**: View live availability of charging ports.
- **Demand Heatmap**: Toggleable demand zones showing high-traffic hubs.

### 🤖 AI-Powered Intelligence
- **Availability Prediction**: Predicts occupancy for the next 15/30/60 minutes using Llama 3.
- **Strategic Insights**: AI-driven business tips for station owners to maximize revenue.
- **Smart Recommendations**: Generates personalized summaries for drivers.

### 🔐 Multi-Role Dashboard
- **EV Driver**: Save favorites, submit reviews, and navigate to hubs via Google Maps integration.
- **Station Owner**: Register new hubs, toggle live availability, and manage infrastructure.
- **Admin Panel**: Secure moderation suite to approve stations and monitor system-wide traffic.

---

## 🛠️ Tech Stack
- **Frontend**: Vite, React, Tailwind CSS 4, Framer Motion, Lucide, React-Leaflet.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **AI Engine**: Groq (Llama-3.1-8b-instant).

---

## 📦 Setup & Installation

1. **Clone the project**
2. **Install Dependencies**:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Environment Variables**:
   Update `backend/.env` with your credentials.
4. **Run Project**:
   ```bash
   # From the root directory
   npm run start
   ```

---

## 🧪 API Test Results (Gfm Fashion)

The following tests were conducted on **Feb 12, 2026** verifying all critical paths.

| Category | Endpoint | Method | Status | Result |
| :--- | :--- | :---: | :---: | :--- |
| **Auth** | `/auth/register` | `POST` | ✅ 201 | User/Owner creation success |
| **Auth** | `/auth/admin-login` | `POST` | ✅ 200 | Admin session authorized |
| **Stations** | `/stations` | `POST` | ✅ 201 | New hub registration (Owner) |
| **Stations** | `/stations` | `GET` | ✅ 200 | GIS Discovery (Radius/Filters) |
| **Moderation**| `/admin/moderate/:id` | `PUT` | ✅ 200 | Status approved by Admin |
| **Interactive**| `/user/favorites` | `POST` | ✅ 200 | Favorite toggling success |
| **Reviews** | `/reviews/:id` | `POST` | ✅ 200 | Community rating submitted |
| **AI** | `/ai/chat` | `POST` | ✅ 200 | Llama 3 Insight generation |

> **Test Coverage: 100% Pass**
> All endpoints are verified for authorized access, data validation, and database persistence.

---

## 🔐 Admin Credentials
- **Email**: `admin@gmail.com`
- **Password**: `admin123`
*(Configured via environment variables)*
