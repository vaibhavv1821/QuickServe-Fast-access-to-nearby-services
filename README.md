<h1 align="center">⚡ QuickServe</h1>
<h3 align="center">A Full-Stack Local Service Finder Platform</h3>

<p align="center">
  Connect users with trusted local service providers — electricians, plumbers, tutors, and more.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
</p>

---

## 📖 About the Project

QuickServe is a production-inspired **MERN stack service marketplace** that solves the real-world problem of finding reliable local professionals. Built feature by feature to reflect actual industry development practices — not a simple CRUD demo.

The platform handles the full lifecycle of a service booking: **Discovery → Booking → Chat → Review**, with separate portals for customers, service providers, and admins.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with role-based access control (`user`, `provider`, `admin`)
- Secure password hashing with **bcrypt**
- Forgot password / Reset password via email token (10-minute expiry)
- HTTP security headers with **Helmet**
- Protected API routes via custom `authMiddleware`

### 👤 Users
- Register & login with email, phone, location
- Upload & update profile photo (Cloudinary)
- Change password
- View personal booking history

### 🔧 Service Providers
- Create & manage provider profiles (service type, price/hr, experience, bio)
- Admin approval workflow — providers go live only after admin review
- Accept / Reject / Complete bookings
- View all received bookings with status management
- Receive booking email confirmations

### 📅 Booking System
- Book a provider with date, time, service type, and address
- Booking lifecycle: `pending → confirmed → completed / cancelled`
- Users can cancel their own bookings
- Leave a star review after a completed booking

### 🔍 Search & Discovery
- Search providers by service type, city, state, price range, minimum rating
- Browse top-rated providers on the homepage
- Public provider detail pages with reviews

### 💬 Real-Time Chat
- Socket.io powered real-time messaging between users and providers
- Typing indicators, read receipts, online user tracking
- Chat list with last message preview

### 🔔 Notifications
- In-app notification bell with unread count badge
- Real-time notification delivery via Socket.io
- Mark individual or all notifications as read
- Triggered by: booking events, provider approval, reviews

### 🛡️ Admin Panel
- Dashboard with platform statistics (users, providers, bookings)
- Approve or reject pending provider applications (with reason)
- User management: search, filter, activate/deactivate, delete
- Paginated bookings overview with status filter

### 📧 Email Notifications (Nodemailer)
- Welcome email on registration
- Booking confirmation / cancellation / completion
- Provider approval / rejection emails
- Password reset link

---

## 🛠 Tech Stack

| Layer         | Technology                                       |
|---------------|--------------------------------------------------|
| **Frontend**  | React 18, React Router DOM, Axios                |
| **Backend**   | Node.js, Express.js                              |
| **Database**  | MongoDB Atlas, Mongoose ODM                      |
| **Auth**      | JSON Web Tokens (JWT), bcryptjs                  |
| **Real-time** | Socket.io                                        |
| **Storage**   | Cloudinary + Multer                              |
| **Email**     | Nodemailer (Gmail SMTP)                          |
| **Security**  | Helmet, CORS                                     |
| **Dev Tools** | Nodemon, dotenv, Jest, Supertest                 |

---

## 📁 Project Structure

```
quickserve/
├── backend/
│   ├── server.js               # Entry point — HTTP + Socket.io server
│   └── src/
│       ├── config/
│       │   ├── db.js           # MongoDB connection
│       │   ├── cloudinary.js   # Cloudinary config
│       │   └── constant.js
│       ├── controllers/        # Business logic
│       │   ├── authController.js
│       │   ├── userController.js
│       │   ├── providerController.js
│       │   ├── bookingController.js
│       │   ├── reviewController.js
│       │   ├── chatController.js
│       │   ├── notificationController.js
│       │   ├── searchController.js
│       │   ├── serviceController.js
│       │   └── adminController.js
│       ├── models/             # Mongoose schemas
│       │   ├── User.js
│       │   ├── Provider.js
│       │   ├── Booking.js
│       │   ├── Review.js
│       │   ├── Chat.js
│       │   ├── Service.js
│       │   └── Notification.js
│       ├── routes/             # Express routers
│       ├── middlewares/
│       │   ├── authMiddleware.js
│       │   ├── uploadMiddleware.js
│       │   └── validationMiddleware.js
│       └── utils/
│           ├── sendEmail.js    # Nodemailer + HTML templates
│           └── socket.js       # Socket.io event handlers
│
└── frontend/
    └── src/
        ├── context/            # React Context (Auth, Socket, Notification)
        ├── services/           # Axios API layer
        ├── pages/              # All application pages
        │   ├── auth/           # Login, Signup, Forgot/Reset Password
        │   ├── public/         # Home, Search, Provider Details
        │   ├── user/           # Dashboard, Bookings, Profile
        │   ├── provider/       # Dashboard, Bookings, Profile
        │   ├── admin/          # Dashboard, Users, Providers, Bookings
        │   ├── booking/        # Create Booking, Booking Details
        │   └── chat/           # Real-time Chat
        └── components/
            ├── layout/         # Navbar
            └── common/         # Pagination, StarRating, Modals, Skeletons
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 14
- MongoDB Atlas account
- Cloudinary account (optional — falls back to memory storage)
- Gmail account with App Password (optional — for email notifications)

### 1. Clone the repository
```bash
git clone https://github.com/vaibhavv1821/QuickServe-Fast-access-to-nearby-services.git
cd QuickServe-Fast-access-to-nearby-services
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Gmail (for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
npm run dev   # starts on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm start     # starts on http://localhost:3000
```

---

## 🔌 API Endpoints

| Module        | Base Route           | Key Endpoints                                     |
|---------------|----------------------|---------------------------------------------------|
| Auth          | `/api/auth`          | `POST /register`, `/login`, `/forgot-password`   |
| User          | `/api/user`          | `GET /profile`, `PUT /profile`, `/upload-image`  |
| Provider      | `/api/provider`      | `GET /all`, `/details/:id`, `POST /create`       |
| Booking       | `/api/booking`       | `POST /create`, `GET /my-bookings`, `PUT /cancel/:id` |
| Review        | `/api/review`        | `POST /add`, `GET /provider/:id`                 |
| Search        | `/api/search`        | `GET /providers`, `/top-rated`                   |
| Chat          | `/api/chat`          | `POST /create`, `GET /my-chats`, `POST /send/:id`|
| Notification  | `/api/notification`  | `GET /my-notifications`, `PUT /mark-all-read`    |
| Admin         | `/api/admin`         | `GET /stats`, `/users`, `/providers`, `/bookings`|

---

## 🔄 Real-Time Socket Events

| Event           | Direction        | Description                         |
|-----------------|------------------|-------------------------------------|
| `join`          | Client → Server  | Register user presence              |
| `joinChat`      | Client → Server  | Subscribe to a chat room            |
| `typing`        | Client → Server  | Broadcast typing indicator          |
| `newMessage`    | Server → Client  | Deliver incoming chat message       |
| `notification`  | Server → Client  | Push new notification               |
| `onlineUsers`   | Server → Client  | Broadcast active user list          |

---

## 👥 User Roles

| Role       | Access                                                              |
|------------|---------------------------------------------------------------------|
| `user`     | Browse services, book providers, chat, review, manage bookings      |
| `provider` | Manage profile, accept/reject/complete bookings, chat with users    |
| `admin`    | Full platform control — users, providers, bookings, approvals       |

---

## 🧪 Testing

```bash
cd backend
npm test
```

Uses **Jest** + **Supertest** for API route testing.

---

## 📌 Development Approach

This project is built the way real backend systems are developed in startups:

- ✅ **Feature-based development** — each module is isolated
- ✅ **No mock data** — all features are wired to real APIs
- ✅ **Role-based access** — strict middleware enforcement
- ✅ **Error handling** — global error handler + per-route validation
- ✅ **Scalable structure** — controllers, models, routes, utils all separated
- ✅ **Security-first** — Helmet headers, CORS, JWT, bcrypt

---

## 👨‍💻 Author

**Vaibhav Gatlewar**
Software Engineering Student | MERN Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-vaibhavv1821-181717?style=flat-square&logo=github)](https://github.com/vaibhavv1821)

---

## ⭐ Final Note

QuickServe is not a tutorial project. It's a continuously evolving platform that demonstrates:

- Real business logic and workflow implementation
- Production-level coding practices
- A complete service marketplace from authentication to real-time communication

If this project helped you or gave you ideas, consider giving it a ⭐ on GitHub!

---

<p align="center">Built with ❤️ by Vaibhav Gatlewar</p>
