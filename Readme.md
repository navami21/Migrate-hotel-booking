# 🏨 Hotel & Travel Booking Migration System

## 📌 Overview

This project demonstrates the migration of booking data from a **legacy monolithic hotel system** to a **modern microservices-based travel platform**.

The system includes:

* A **Legacy Application** (MySQL, single-room booking)
* A **Modern Application** (MongoDB, multi-room booking, analytics)
* A **Migration Engine** (API mode + DB-to-DB mode)

---

## 🏗️ Architecture

### 🔴 Legacy System

* Node.js + Express
* MySQL (WAMP)
* React + Bootstrap
* ❌ One booking = One room

### 🟢 Modern System

* Node.js Microservices
* MongoDB (NoSQL)
* React + Tailwind CSS
* ✅ One booking = Multiple rooms
* ✅ Revenue & Analytics Dashboard

---

## 📁 Project Structure

```
hotel-migrate-new/
│
├── legacy-app/
│   ├── backend/
│   └── frontend/
│
├── modern-app/
│   ├── services/
│   │   ├── booking-service/
│   │   └── hotel-service/
│   └── modern-frontend/
│
├── migration/
│   ├── api-mode.js
│   ├── db-mode.js
│   └── clear-db.js
│
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have installed:

* Node.js (v18+)
* MySQL (WAMP/XAMPP)
* MongoDB (running locally)
* npm

---

## 🧪 STEP 1: SETUP LEGACY DATABASE

Open MySQL and run:

```sql
CREATE DATABASE legacy_hotel_new;

USE legacy_hotel_new;

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255),
  room_type VARCHAR(100),
  check_in DATE,
  check_out DATE
);
```

---

## 🌱 STEP 2: GENERATE SAMPLE DATA

Go to legacy backend:

```bash
cd legacy-app/backend
npm install
node seed.js
```

This creates **1000 bookings for next 3 years**

---

## 🚀 STEP 3: RUN LEGACY BACKEND

```bash
cd legacy-app/backend
node server.js
```

Check:

```
http://localhost:5000/bookings
```

---

## 🟢 STEP 4: RUN MODERN SERVICES

### Booking Service

```bash
cd modern-app/services/booking-service
npm install
node server.js
```

Runs on:

```
http://localhost:6001/bookings
```

---

### Hotel Service

```bash
cd modern-app/services/hotel-service
npm install
node server.js
```

Runs on:

```
http://localhost:7000/hotels
```

---

## 🎨 STEP 5: RUN MODERN FRONTEND

```bash
cd modern-app/modern-frontend
npm install
npm start
```

Open:

```
http://localhost:3000
```

---

## 🔄 STEP 6: RUN MIGRATION

### 🔹 API Mode

```bash
cd migration
npm install
node api-mode.js
```

---

### 🔹 DB-to-DB Mode

```bash
node db-mode.js
```

---

## 🧹 STEP 7: RESET DATABASE (FOR DEMO)

```bash
node clear-db.js
```

Then re-run migration.

---

## 💰 DATA ENRICHMENT (IMPORTANT)

Legacy system does not contain pricing.

During migration:

* Price is assigned based on room type
* Total booking value is calculated

Example:

```js
Single → 100
Double → 200
Suite → 400
```

---

## 📊 FEATURES

### ✅ Modern Application

* Dashboard with analytics
* Revenue tracking
* Multi-room booking
* Pagination & search
* Sidebar navigation (Bookings, Hotels, Flights)

---

### 🔍 Semantic Search

* Search by customer name
* Search by room type

---

### 📈 Predictive Insights

* Pricing recommendations
* Trend-based analytics

---

## 🔁 MIGRATION LOGIC

### API Mode:

```
MySQL → Transform → REST API → MongoDB
```

### DB Mode:

```
MySQL → Transform → MongoDB
```

### Transformation:

* Group bookings by customer
* Merge into single booking
* Convert rooms into array

---

## 🎯 DEMO FLOW

1. Show legacy system (single room)
2. Show MySQL data
3. Clear MongoDB
4. Run migration
5. Show modern app:

   * Multiple rooms
   * Revenue dashboard
   * Search

---

## 🧠 KEY CONCEPTS

* Data Migration
* Data Transformation
* Data Enrichment
* Microservices Architecture
* SQL → NoSQL Conversion

---

## 🚀 FUTURE ENHANCEMENTS

* Charts (Revenue trends)
* AI-based pricing prediction
* Authentication system
* API Gateway
* Docker deployment

---

## 👨‍💻 Author

Developed as part of a system design and data migration project.

---

## 📌 Conclusion

This project demonstrates how legacy systems can be transformed into scalable, modern architectures with enhanced analytics and business capabilities.
