# 📄 Product Requirements Document: VAYU

**Version:** 1.0.0  
**Status:** Approved / In Implementation  
**Owner:** Product Strategy Team  
**Tech Lead:** Senior Architect  

---

## 1. Problem Statement

Air pollution is a global health crisis, responsible for millions of premature deaths annually. In India, 39 of the 50 most polluted cities in the world face seasonal "airpocalypse" events where PM2.5 levels exceed WHO guidelines by 20–50x.

### Why Existing Apps Fail:
1.  **Reactive, Not Proactive**: Apps like IQAir show what *happened* or what *is* happening, but not what *will* happen.
2.  **Sensor Scarcity**: Ground-level sensors are sparse; many neighborhoods are "blind spots."
3.  **Low Actionability**: Knowing the AQI is 300 is frightening, but users don't know the best time to run, which route to take to work, or if their child's weekend football game is safe.
4.  **Generic Data**: Alerts aren't tailored to individual health conditions like asthma or COPD.

**VAYU** solves this by shifting from "Monitoring" to "Intelligence"—using AI to bridge sensor gaps and provide predictive, personalized decision tools.

---

## 2. Target Users (Personas)

### 🙍‍♀️ Priya (34, Mumbai) — The Protective Parent
*   **Context**: Professional and mother of a 4-year-old with exercise-induced asthma.
*   **Pain Point**: Needs to know when to keep the air purifier on and if the park is safe for evening play.
*   **Goal**: Zero asthma attacks this winter.

### 👴 Rajan (58, Delhi) — The Vulnerable Senior
*   **Context**: Retired civil servant living with Chronic Obstructive Pulmonary Disease (COPD).
*   **Pain Point**: Heavily impacted by PM2.5 spikes; needs to coordinate errands and doctor visits for low-pollution windows.
*   **Goal**: Minimize respiratory distress and hospital visits.

### 🏃‍♂️ Ayaan (26, Pune) — The Performance Athlete
*   **Context**: Marathon runner training for the Tata Mumbai Marathon. 
*   **Pain Point**: Training in high pollution damages lungs more than cardio benefits them; wants to find the cleanest 10km loop available.
*   **Goal**: Optimize performance without long-term health tradeoffs.

---

## 3. Goals and Non-Goals

### 🎯 Goals
-   Provide **PM2.5 predictions** for any coordinate with <15% Mean Absolute Error (MAE).
-   Offer **Clean Air Routing** that reduces inhaled pollution by at least 20% compared to Google Maps' default.
-   Enable **Future-Date Modeling** for events up to 7 days in advance using weather ensemble models.
-   Directly export **biometric exposure reports** for clinical use.

### 🚫 Non-Goals
-   Building our own hardware sensors (we aggregate 3rd party and satellite data).
-   Indoor air quality monitoring (we focus on ambient atmospheric conditions).
-   Real-time CO2 or Ozone primary focus (PM2.5 is the priority pollutant for V1).

---

## 4. Feature Priority Table

| Feature | Priority | Description | Success Metric |
| :--- | :--- | :--- | :--- |
| **Real-time Map** | P0 | Interactive heatmap with station overlays | 99.9% uptime; <2s render time |
| **AI Forecast** | P0 | 72-hour temporal pollution prediction | <15% error vs. actuals |
| **Health Profile** | P0 | User-defined sensitivity toggles (Asthma, etc.) | 80% profile completion rate |
| **Route Planner** | P1 | Exposure-weighted navigation | 25% average PM2.5 reduction |
| **Event Planner** | P1 | Risk modeling for future dates | <10% deviation in 48h windows |
| **PDF Reporting** | P2 | Downloadable historical exposure summaries | 15% share/export rate |

---

## 5. User Flows

### Flow A: Determining "When" to Out
1.  User opens VAYU.
2.  Splash screen confirms location synchronization.
3.  User navigates to **Forecast**.
4.  System identifies the "Optimal Window" (e.g., "Best time: 4 PM to 6 PM").
5.  User sets a "Window Reminder."

### Flow B: Planning a Clean Commute
1.  User goes to **Route**.
2.  Enters Destination.
3.  System calculates three paths: Fastest, Balanced, and **Clean Air**.
4.  User selects "Clean Air" and begins navigation, seeing estimated PM2.5 inhalation savings.

---

## 6. UI / UX Requirements

-   **Aesthetic**: "Environmental OS"—Glassmorphism, dark-mode default, minimal high-fidelity typography.
-   **Mobile-First**: Touch-optimized floating cards and bottom navigation.
-   **Performance**: Initial map load in <1.5 seconds.
-   **Feedback Loop**: Haptic feedback on interactions; smooth Framer Motion transitions between screens.
-   **Offline State**: Cache the last 12 hours of local data using Service Workers.

---

## 7. Data Sources & Fallback Logic

| Source | Data Points | Frequency | Fallback |
| :--- | :--- | :--- | :--- |
| **WAQI / OpenAQ** | Station PM2.5, PM10 | 15–30 min | Use nearest 3 station avg |
| **NASA MODIS** | Satellite AOD | Daily | Linear interpolation of ground data |
| **Open-Meteo** | Wind, Humidity, Temp | Hourly | Proprietary weather cache |
| **OSM** | Traffic & Building Density | Quarterly | Static density map |

---

## 8. ML Model Requirements

-   **Core Engine**: XGBoost Regressor.
-   **Input Vector**: `[lat, lng, hour, day_of_week, humidity, wind_speed, wind_direction, traffic_idx, prev_24h_avg]`.
-   **Target**: Current and future PM2.5.
-   **Validation**: 5-fold cross-validation on historical station data.
-   **Retraining**: Automated daily pipeline on Railway.app.

---

## 9. API Design (Examples)

### `GET /forecast?lat=19.07&lng=72.87`
```json
{
  "location": "Mumbai",
  "prediction_start": "2024-03-15T10:00:00Z",
  "data": [
    { "time": "2024-03-15T11:00:00Z", "pm25": 42.1, "confidence": 0.94 },
    { "time": "2024-03-15T12:00:00Z", "pm25": 45.3, "confidence": 0.92 }
  ],
  "optimal_window": { "start": "16:00", "end": "18:00", "pm25_avg": 24.5 }
}
```

---

## 10. Success Metrics (KPIs)

-   **Retention**: 40% W1 retention during high-pollution seasons.
-   **Actionability**: 30% of users interacting with the "Optimal Window" or "Clean Route" features.
-   **Accuracy**: <12 µg/m³ MAE on 24-hour forecasts.
-   **Engagement**: Average of 2.5 sessions per day per active user during "Poor" AQI events.

---

## 11. Risks and Mitigation

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Data Outages** | High | Multi-source aggregation (OpenAQ + WAQI) |
| **Model Inaccuracy** | High | Ensemble methods; AOD satellite gap-filling |
| **GPS Permissions** | Medium | Fallback to manual city selection and IP-base |
| **Vercel Limits** | Low | Aggressive edge caching for API responses |

---

## 12. Development Timeline

-   **Phase 1 (Month 1)**: Core Map UI, Basic ML Integration, Real-time Station Data.
-   **Phase 2 (Month 2)**: 72h Forecast UI, Health Profiling, Alert Notification Engine.
-   **Phase 3 (Month 3)**: Route Pathfinding, Event Risk Modeling, PDF Report Engine.
-   **Phase 4 (Launch)**: Beta release in Delhi/Mumbai; global scalability testing.

---
