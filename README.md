# 🌬️ VAYU — AI Environmental Intelligence Platform

> **Predictive air quality intelligence for a healthier tomorrow.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0--stable-blue.svg)]()
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)

Vayu is a sophisticated environmental decision-support system designed to mitigate the health impacts of air pollution. Unlike traditional monitoring apps that show historical data or simple real-time readings, Vayu leverages **XGBoost machine learning models** and **Aerosol Optical Depth (AOD) satellite imagery** to provide proactive 72-hour forecasts, personal exposure tracking, and clean-air navigation that actively reduces inhaled toxins.

---

## ✨ Key Features

Vayu offers a suite of advanced tools designed to help users navigate a world with increasing air quality challenges.

-   🌍 **Real-time PM2.5 Heatmapping**: Hyper-local visualization using MapLibre GL and Stadia Maps for neighborhood-level accuracy.
-   🤖 **AI Temporal Forecasting**: 72-hour pollution trajectory predictions with 90%+ confidence intervals, helping you plan your day around clean air.
-   🛣️ **Clean-Air Route Planner (New)**: Calculates the lowest pollution route between two locations by sampling PM2.5 predictions along the path using OSRM, prioritizing paths through parks and low-traffic zones.
-   🧮 **Personal Exposure Tracker (New)**: Logs the user's location history every 15 minutes to calculate cumulative weekly and monthly pollution exposure scores.
-   🗓️ **Event Air Quality Planner (New)**: Predicts PM2.5 levels for future dates using complex weather features and historical climate data to identify safe windows for outdoor activities.
-   🚨 **Push Pollution Alerts (New)**: Intelligent notifications dispatched via Firebase when PM2.5 levels exceed a user's specific health-calibrated threshold.
-   🏠 **Indoor vs Outdoor Sensor Bridge (New)**: Integration with PurpleAir and ESP32 sensors to allow users to compare their indoor air quality with external ambient conditions.

---

## 📱 Platform Screens

The Vayu ecosystem is optimized for low-latency data rendering and high-precision modeling across multiple interfaces.

1.  **Live Air Map**: High-fidelity full-screen engine for PM2.5 / AOD layer toggling and real-time station data monitoring.
2.  **Forecast**: Visualizes upcoming shifts in air quality using high-granularity temporal charts and "Optimal Window" indicators.
3.  **My Exposure Dashboard**: Aggregated biometric and location data showing cumulative inhalation metrics and personal health risk scores.
4.  **Clean Air Route Planner**: A navigation dashboard allowing users to compare distance, time, and total PM2.5 exposure for various transit routes.
5.  **Alerts & Health Profile**: Granular settings to customize sensing thresholds based on respiratory sensitivity (e.g., Asthma) and activity levels.
6.  **Event Planner**: A predictive tool for executing future-date modeling to ensure environmental safety for weddings, games, or travel.

---

## 🛠️ Tech Stack

### Frontend & UI/UX
| Tool | Purpose |
| :--- | :--- |
| **Next.js 14** | App Router, SSR, and API Proxying for secure data flow |
| **MapLibre GL** | High-performance vector map rendering with GPU acceleration |
| **Tailwind CSS** | Premium glassmorphism design system & responsive layout |
| **Zustand** | Lightweight global state management for location and health profiles |
| **Firebase (FCM)** | **Push Notifications** used for real-time pollution alerts |

### Backend & ML Infrastructure
| Tool | Purpose |
| :--- | :--- |
| **FastAPI** | High-concurrency Python API layer for low-latency processing |
| **XGBoost** | Gradient boosted trees for multi-dimensional PM2.5 regression |
| **OSRM** | **Routing Engine** for calculating pollution-optimized paths |
| **Open-Meteo** | **Historical & Forecast Weather API** for feature engineering |
| **Satellite AOD** | Spatial data gap-filling using NASA MODIS high-resolution imaging |

### Data & External Integrations
| Source | Purpose |
| :--- | :--- |
| **Supabase** | PostgreSQL storage for **User Exposure logs** and auth |
| **PurpleAir API** | **IoT Sensor integration** for localized indoor monitoring |
| **Sensor.community** | Global crowd-sourced sensor data for ground-truth calibration |
| **WAQI / OpenAQ** | Primary sources for real-time air quality index monitoring |

---

## 🏗️ System Architecture

Vayu follows a decoupled micro-architecture designed for scalability and data integrity.

```text
       [ User Browser ]
              ↓ (HTTPS / Auth)
       [ Next.js Frontend ] <————— [ Zustand Store ]
              ↓ (API Proxy)
       [ Next.js API Proxy ] 
              ↓ (Auth Headers)
       [ FastAPI Backend ] <—————— [ AI Prediction Engine ]
              ↓                           ↑ (ML Models / XGBoost)
       [ External APIs ] <—————————————————┘
              ↓
    ┌─────────┴──────────┐
[ OSRM / Open-Meteo ]  [ Supabase / Firebase ]
[ Sensor APIs / IoT ]  [ Satellite AOD Data ]
```

---

## 🗄️ Database Management

Vayu utilizes a high-performance relational database via Supabase to manage user-specific environmental data.

-   **`user_exposure`**: This table logs periodic location pings (every 15 min), associated PM2.5 concentration at that coordinate, and the user's current activity level. It is used to generate the personal impact analytics visible on the Exposure Dashboard.
-   **`sensor_readings`**: Serves as a buffer for high-frequency data from private IoT devices (PurpleAir/ESP32). It stores time-series data for PM2.5, humidity, and temperature, enabling the side-by-side "Indoor vs Outdoor" comparison feature.

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/route-clean-air` | Generates a route optimized for minimum pollution exposure using OSRM. |
| `GET` | `/exposure` | Retrieves aggregated weekly and monthly inhalation analytics for a specific user. |
| `POST` | `/event-prediction`| Predicts PM2.5 levels for a specific future date and coordinate set. |
| `POST` | `/sensor-reading` | Ingests localized data from integrated consumer IoT air quality sensors. |
| `POST` | `/push-alert-check`| Evaluates current AQI against user thresholds to trigger Firebase notifications. |
| `GET` | `/forecast` | Returns a 72-hour temporal prediction array for the requested coordinates. |

---

## 🌟 Why Vayu Is Different?

While popular platforms like **IQAir** or **AQI India** excel at showing "What is happening now," they often leave users without an actionable strategy. Vayu fills the "Action Gap" by transforming raw data into intelligence:

1.  **AI-Driven Forecasting**: Most apps rely on linear interpolation; Vayu uses XGBoost trained on satellite AOD and complex weather features to predict sharp shifts in air quality up to 3 days in advance.
2.  **Pollution Optimization**: Instead of just navigating by distance, Vayu represents the first consumer-grade platform to integrate **OSRM exposure-weighting**, allowing you to choose the "Cleanest" route, not just the fastest.
3.  **Personalized Analytics**: We move beyond generic AQI numbers. By tracking personal exposure history, Vayu provides a "Bio-Score" that helps users understand the long-term impact of their environment on their health.
4.  **Future-Proof Planning**: Our Event Planner allows you to schedule outdoor events with a level of environmental certainty that was previously unavailable to the public.

---

## 📂 Project Structure

```text
anewpoeoject/
├── front-end/        # Next.js 16 (JSX) Frontend
│   ├── app/          # App Router (Pages & API Proxy)
│   ├── components/   # Shared UI Components
│   └── store/        # Zustand State Management
├── back-end/         # FastAPI AI Prediction Backend
│   ├── main.py       # API Endpoints
│   ├── requirements.txt
└── PRD.md            # Product Requirements
```

## 🚀 Getting Started

### 1. Frontend Setup (JSX)
```bash
cd front-end
npm install
npm run dev
```

### 2. Backend Setup (Python)
```bash
cd back-end
pip install -r requirements.txt
python main.py
```

---

## 🤝 Contributing

We welcome contributions from environmental scientists, ML engineers, and developers.
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes.
4.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for a cleaner planet.**
