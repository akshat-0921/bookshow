
---

## 🎬 **Bookshow – Movie Booking Web App**  

```markdown
# Bookshow – Movie Booking Web App 🎟️  

## Overview  
Bookshow is a **MERN stack web app** that replicates a movie booking system.  
It allows users to browse movies, select showtimes, book seats in real-time, and make secure payments. Admins can manage movies, theaters, and bookings.  

---

## ✨ Features  

### 👤 User Side  
- **Authentication**: Role-based login/signup using Clerk.  
- **Movie Browsing**: Search, explore, and view movie details.  
- **Seat Selection**: Real-time seat availability with locking for active bookings.  
- **Booking Flow**: Secure movie & seat booking with confirmation system.  
- **Profile**: Track booking history and manage account info.  

### 🛠️ Admin Side  
- **Dashboard**: Manage movies, theaters, showtimes.  
- **Bookings**: Monitor all reservations and availability.  
- **Real-Time Updates**: Handle conflicts via backend validations.  

---

## 🏗️ Architecture  
Frontend → API Calls (Axios) → Backend (Express.js) → Database (MongoDB)  
Authentication handled via **Clerk**.  

---

## 📊 Tech Stack  
- **Frontend**: React, Axios, React Router  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ORM)  
- **Authentication**: Clerk  

---

## 📌 Installation & Setup  
```bash
# Clone the repo
git clone https://github.com/akshat-0921/BookMyShow

# Install dependencies
cd bookshow-backend
npm install

cd bookshow-frontend
npm install

# Run backend
npm run dev

# Run frontend
npm start
