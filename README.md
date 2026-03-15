# 🌬️ VAYU — AI Environmental Intelligence Platform

> **Predictive air quality intelligence for a healthier tomorrow.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue.svg)]()
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js- black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Back-FastAPI-009688)](https://fastapi.tiangolo.com/)

Vayu is a sophisticated environmental decision-support system designed to mitigate the health impacts of air pollution. Unlike traditional monitoring apps that show historical data, Vayu leverages **XGBoost machine learning models** and **Aerosol Optical Depth (AOD) satellite imagery** to provide proactive 72-hour forecasts, personal exposure tracking, and clean-air navigation.

---

## ✨ Key Features

-   🌍 **Real-time PM2.5 Heatmapping**: Hyper-local visualization using MapLibre GL and Stadia Maps.
-   🤖 **AI Temporal Forecasting**: 72-hour pollution trajectory predictions with 90%+ confidence intervals.
-   🚶 **Clean-Air Routing**: Navigation engine that prioritizes routes through parks and low-traffic zones.
-   📊 **Health Dashboard**: Personal exposure score tracking with "Doctor-Ready" PDF export functionality.
-   🗓️ **Event Intelligence**: Environmental risk modeling for future outdoor events (weddings, games, protests).
-   🔔 **Bio-Calibrated Alerts**: Smart notifications based on individual health profiles (e.g., Asthma or COPD).

---

## 📱 Platform Architecture

The Vayu ecosystem is built for low-latency data rendering and high-precision modeling.

### Core Screens

1.  **Live Map**: Full-screen engine for PM2.5 / AOD layer toggling and real-time station data.
2.  **Forecast**: Visualizes upcoming shifts in air quality using high-granularity temporal charts.
3.  **Exposure Dashboard**: Aggregated biometric data showing cumulative inhalation and bio-risk scores.
4.  **Route Planner**: Compare "Fastest" vs. "Cleanest" routes with estimated PM2.5 inhalation metrics.
5.  **Alerts & Profile**: Customize sensing thresholds based on respiratory sensitivity and activity levels.
6.  **Event Planner**: Execute future-date predictions to identify environmental windows.

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
| :--- | :--- |
| **Next.js 14** | App Router, SSR, and API Proxying |
| **MapLibre GL** | High-performance vector map rendering |
| **Tailwind CSS** | Premium glassmorphism UI & responsive design |
| **TanStack Query** | State-aware server data fetching & caching |
| **Zustand** | Lightweight global client state management |
| **Recharts** | Dynamic temporal and biometric visualizations |

### Backend & ML
| Tool | Purpose |
| :--- | :--- |
| **FastAPI** | High-concurrency Python API layer |
| **XGBoost** | Gradient boosted trees for PM2.5 regression |
| **Satellite AOD** | Spatial data gap-filling for areas without sensors |
| **Supabase** | PostgreSQL storage and real-time event logs |

---

## 🏗️ System Architecture

```text
       [ User Browser ]
              ↓ (HTTPS / Auth)
       [ Next.js Frontend ] <————— [ Zustand Store ]
              ↓ (Internal Proxy)
       [ Next.js API Routes ]
              ↓ (CORS Secured)
       [ FastAPI Backend ] <—————— [ ML Model / XGBoost ]
              ↓                        ↑ (Daily Training)
[ WAQI / OpenAQ / Open-Meteo ] —————— [ Satellite AOD Data ]
```

---

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   Python 3.10+
-   Stadia Maps API Key

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/vayu-env/platform.git
cd platform/frontend

# Install dependencies
npm install

# Setup Environment Variables (see .env.example)
cp .env.example .env.local

# Run development server
npm run dev
```

### Backend Setup
```bash
cd platform/backend
pip install -r requirements.txt

# Start the API
uvicorn main:app --reload
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/predict` | Current hyper-local PM2.5 estimation |
| `GET` | `/forecast` | 72-hour temporal prediction array |
| `GET` | `/route` | Calculated exposure for specific coordinate paths |
| `GET` | `/event` | Probabilistic modeling for future UNIX timestamps |

---

## 🧠 ML Model Overview

Vayu's prediction engine uses a multi-modal approach:
-   **Inputs**: Humidity, Wind Vector, Traffic Density, NASA MODIS AOD, and historical PM2.5.
-   **Outputs**: Continuous PM2.5 value (µg/m³).
-   **Training**: The model is retrained every 24 hours on the latest 30 days of sensor data to adapt to seasonal shifts.

---

## 🤝 Contributing

We welcome contributions from environmental scientists, ML engineers, and developers.
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for a cleaner planet.**
