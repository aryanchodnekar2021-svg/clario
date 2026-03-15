# Clario | Environmental Intelligence Platform

Clario is a production-grade frontend architecture designed to provide users with hyper-local, AI-driven air quality insights. The system is built for performance, aesthetics, and high-fidelity data visualization.

## 🏗 System Architecture

### 1. Folder Structure
```text
/app
  /api/[...proxy]    # Generic proxy to FastAPI backend
  /map               # Primary Live Air Map interface
  /forecast          # AI predictive temporal modeling
  /exposure          # Personal biometrics & inhalation tracking
  /route             # Clean-air pathfinding & navigation
  /event             # Future date risk prediction
  /profile           # Health calibration & alerts
/components          # Reusable glass UI components (Banner, BottomNav)
/hooks               # Custom hooks for geolocation & state
/lib                 # Utilities (AQI formatting, tailwind merging)
/store               # Zustand global store
/styles              # PostCSS & Global Glassmorphism tokens
```

### 2. State Management (Zustand)
The global state resides in `store/useStore.ts`, managing:
- `userLocation`: Synchronized via Browser Geolocation API.
- `healthProfile`: Sensitive health markers (asthma, activity level).
- `alertThreshold`: PM2.5 trigger limits.
- `layer`: Toggle between PM2.5 Heatmap and Aerosol Optical Depth (AOD).

### 3. Data Ingestion (React Query + Axios)
Frontend security and CORS are handled by the Next.js API Proxy (`app/api/[...proxy]/route.ts`).
- **AQI Refresh**: 30 min (staleTime: 1800000).
- **Forecast Refresh**: 6 hours (staleTime: 21600000).

---

## 🚀 Screen Architecture Review

### Screen 1: Live Air Map
- **Engine**: MapLibre GL JS.
- **Tiles**: Stadia Maps (Alidade Smooth Dark).
- **UI**: Floating AQI card with WHO color-coded health messages and PM2.5 metrics.
- **Interactive**: Layer toggle for PM2.5/AOD and smart geolocation.

### Screen 2: 72-Hour Forecast
- **Visuals**: Recharts Area Charts with gradient fills and confidence bands.
- **Insights**: "Optimal Window" indicator identifying the best time for outdoor activity based on predicted PM2.5 troughs.

### Screen 3: Exposure Dashboard
- **Analytics**: Weekly bar charts showing cumulative inhalations.
- **Scoring**: Personal Health Score (0-100) based on location history and activity logs.
- **Impact**: Detailed logs of "Impact Events" (High exposure vs. saved exposure).

### Screen 4: Clean Air Route Planner
- **Logic**: Triple-path analysis (Fastest, Cleanest, Balanced).
- **Metrics**: Displays estimated inhaled PM2.5 per route variant.
- **Context**: Visual route color-coding directly on the map context.

### Screen 5: Event Planner
- **AI Prediction**: Probabilistic modeling for future dates.
- **Status Tags**: Clear GO / CAUTION / AVOID status based on predictive stability indices.

---

## 🛠 Deployment & Setup

### Environment Variables
Create a `.env.local` file:
```env
BACKEND_URL=https://api.your-backend.com
NEXT_PUBLIC_STADIA_API_KEY=your_key_here
```

### Installation
```bash
npm install
npm run dev
```

### Vercel Deployment
1. Connect GitHub repository to Vercel.
2. Vercel automatically detects Next.js settings.
3. Add environment variables in the Vercel Dashboard.
4. **Deploy.**
