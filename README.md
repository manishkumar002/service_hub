# 🚀 ServiceHub

A full-stack **Home Services Marketplace** built with **Node.js, Express.js, MongoDB, React (Vite), and React Bootstrap**.

The platform allows clients to post service requests and providers to browse, apply, chat, manage subscriptions, and receive payments. It also includes **AI-powered database search** using **Google Gemini**.

---

# 📌 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Google Gemini AI
- Razorpay

### Frontend

- React (Vite)
- React Bootstrap
- Axios
- React Router

---

# 📁 Project Structure

```
ServiceHub
│
├── Backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── utils
│   └── server.js
│
├── Frontend
│   ├── src
│   ├── public
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <repository-url>
cd ServiceHub
```

---

## Install Dependencies

```bash
npm run install:all
```

or

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

---

# ▶️ Run Project

Run Backend + Frontend together

```bash
npm run dev:all
```

Backend only

```bash
npm run dev:server
```

Frontend only

```bash
npm run dev:client
```

---

# 🌐 Default URLs

Backend

```
http://localhost:8080
```

Frontend

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
PORT=8080

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key

RAZORPAY_KEY_ID=your_key

RAZORPAY_SECRET=your_secret
```

---

# ✨ Features

## Authentication

- User Registration
- Login
- JWT Authentication
- Profile Management

---

## Client Features

- Create Job
- Edit Job
- Delete Job
- View Posted Jobs
- Hire Provider

---

## Provider Features

- Browse Jobs
- Apply for Jobs
- Subscription Plans
- Premium Provider
- Profile Management

---

## Categories

- Create Category
- Update Category
- Delete Category
- Browse Categories

---

## Chat System

- Client ↔ Provider Conversation
- Real-time Message Storage

---

## Payment

- Razorpay Integration
- Payment History
- Subscription Payments

---

# 🤖 AI Search (Google Gemini)

The project includes an **AI-powered search system** using **Google Gemini**.

Users can search using natural language instead of fixed filters.

### Examples

```
Show electricians in Lucknow

Find premium providers

Show completed jobs

Find Manish's profile

Show monthly subscriptions
```

### AI Workflow

```
User Question
      │
      ▼
Google Gemini
      │
      ▼
Detect Collection + Search Keyword
      │
      ▼
MongoDB Text Search
      │
      ▼
Relevant Records
      │
      ▼
Google Gemini
      │
      ▼
Human-readable Response
```

### Supported Collections

- Users
- Jobs
- Categories
- Payments
- Messages
- Conversations
- Subscriptions

---

# 🗄️ Database

MongoDB Collections

- Users
- Jobs
- Categories
- Payments
- Messages
- Conversations
- Subscriptions

---

# 📦 API Modules

- Authentication API
- User API
- Category API
- Job API
- Chat API
- Payment API
- Subscription API
- AI Search API

---

# 🚀 AI Search API

```
POST /api/ai/search
```

### Request

```json
{
  "question": "Find electricians in Lucknow"
}
```

### Response

```json
{
  "success": true,
  "answer": "3 electricians found in Lucknow.",
  "data": []
}
```

---

# 📜 Available Scripts

| Command | Description |
|----------|-------------|
| npm run install:all | Install all dependencies |
| npm run dev:all | Run frontend and backend |
| npm run dev:server | Run backend only |
| npm run dev:client | Run frontend only |

---

# 👨‍💻 Author

**Manish Kumar**

Full Stack (MERN) Developer

- Node.js
- Express.js
- MongoDB
- React.js
- React Native
- Google Gemini AI
