# 🚀 ServiceHub

ServiceHub is a full-stack Home Services Marketplace built with **Node.js, Express.js, MongoDB, React (Vite), React Bootstrap, and Google Gemini AI**.

The platform allows users to register as **Clients** or **Service Providers**, post jobs, apply for jobs, chat with each other, make payments, purchase subscriptions, and use AI-powered features like **Database Search** and **PDF Chat**.

---

# ✨ Features

## 👤 Authentication

- User Registration
- Login
- JWT Authentication
- Role Based Access (Client / Provider / Admin)
- Profile Management

---

## 🛠 Service Marketplace

- Create Jobs
- Update Jobs
- Delete Jobs
- Browse Jobs
- Apply for Jobs
- Hire Provider
- Categories
- Search Jobs
- Job Status Management

---

## 💬 Chat System

- Client ↔ Provider Chat
- Conversation History
- Message Storage
- Real-time Ready Architecture

---

## 💳 Payment System

- Razorpay Integration
- Payment Verification
- Subscription Purchase
- Payment History

---

## ⭐ Subscription

- Monthly Plan
- Yearly Plan
- Premium Provider
- Subscription Expiry

---

# 🤖 AI Features

ServiceHub includes multiple AI-powered modules using **Google Gemini AI**.

## 1️⃣ AI Chat

Ask anything in natural language.

Example:

- Explain my profile
- How many jobs are active?
- Show today's activity

---

## 2️⃣ AI Database Search

Search directly from MongoDB using natural language.

Examples

```
Find Manish

Show premium providers

Show completed jobs

Find electricians in Lucknow

Show active subscriptions

Who paid today?

Show all plumbing jobs
```

Flow

```
User
      │
      ▼
Gemini AI
      │
      ▼
Collection Detection
      │
      ▼
MongoDB Search
      │
      ▼
Relevant Documents
      │
      ▼
Gemini AI
      │
      ▼
Human Readable Answer
```

Supports

- Users
- Jobs
- Categories
- Payments
- Messages
- Conversations
- Subscriptions

---

## 3️⃣ PDF Chat

Upload PDF files and ask questions.

Examples

```
Summarize this PDF

Explain Chapter 5

Find payment policy

What is mentioned about subscriptions?

Show important points
```

Flow

```
PDF Upload
      │
      ▼
Text Extraction
      │
      ▼
Chunking
      │
      ▼
Embeddings
      │
      ▼
Vector Database
      │
      ▼
Gemini AI
      │
      ▼
Answer
```

---

## 4️⃣ AI Router

The application automatically decides where the answer should come from.

```
User Question
        │
        ▼
      AI Router
        │
 ┌──────┴────────┐
 │               │
 ▼               ▼
MongoDB      PDF Vector DB
 │               │
 └──────┬────────┘
        ▼
    Gemini AI
        ▼
     Final Answer
```

Examples

```
Show all premium providers
```

➡ MongoDB

```
Summarize uploaded PDF
```

➡ PDF AI

```
Explain subscription policy from PDF
```

➡ PDF AI

```
Find Manish's phone number
```

➡ MongoDB

---

# 🗄 Database Collections

- Users
- Jobs
- Categories
- Payments
- Messages
- Conversations
- Subscriptions

---

# 📡 APIs

- Authentication API
- User API
- Category API
- Job API
- Payment API
- Subscription API
- Chat API
- AI Chat API
- AI Database Search API
- PDF Chat API

---

# 🧰 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Google Gemini AI
- Razorpay

## Frontend

- React (Vite)
- React Bootstrap
- Axios
- React Router

---

# 📁 Folder Structure

```
Backend
│
├── controllers
├── middleware
├── models
├── routes
├── services
├── utils
└── server.js

Frontend
│
├── src
├── assets
├── components
├── pages
└── App.jsx
```

---

# ⚙️ Installation

Clone Repository

```bash
git clone <repository-url>
```

Install Dependencies

```bash
npm run install:all
```

---

# ▶ Run Project

Backend + Frontend

```bash
npm run dev:all
```

Backend

```bash
npm run dev:server
```

Frontend

```bash
npm run dev:client
```

---

# 🔑 Environment Variables

Create `Backend/.env`

```env
PORT=8080

MONGODB_URI=

JWT_SECRET=

GEMINI_API_KEY=

RAZORPAY_KEY_ID=

RAZORPAY_SECRET=
```

---

# 🚀 Future Enhancements

- Voice AI
- Image Search
- OCR Support
- Multi-PDF Chat
- AI Recommendation Engine
- Semantic Search
- Vector Search
- AI Agent Support

---

# 👨‍💻 Author

**Manish Kumar**

Full Stack MERN Developer

- Node.js
- Express.js
- MongoDB
- React.js
- React Native
- Google Gemini AI
- AI Search
- PDF Chat
