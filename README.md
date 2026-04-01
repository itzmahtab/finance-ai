# Finance AI 🚀

A modern, full-stack personal finance application powered by the PERN stack (PostgreSQL, Express, React, Node.js) and enhanced with AI capabilities to help users manage their money, optimize spending, and track financial goals.

![Finance AI Dashboard Preview](https://via.placeholder.com/800x400.png?text=Finance+AI+Dashboard+Preview) *(Replace with actual screenshot)*

## 🌟 Key Features

* **Intelligent Dashboard**: View comprehensive summaries of your income, expenses, and savings at a glance.
* **AI Financial Advisor**: Get tailored, automated insights into your spending patterns using OpenRouter (Llama-3/Mistral).
* **Smart Budgeting**: Use the built-in 50/30/20 budget generator to manage your needs, wants, and savings automatically.
* **Transaction Management**: 
  - Add single transactions easily.
  - Perform bulk CSV imports for bulk data entry.
  - Categorize, edit, and delete spending.
* **Financial Goals**: Set target dates, track your monthly contributions, and visually monitor your milestones with animated progress rings.
* **Portfolio & Investments**: Log investments (stocks, crypto, real estate) and track asset growth.
* **Profile Customization**: Maintain your financial profile including risk tolerance, currency, and profession to improve AI advice.
* **Real-time Notifications**: Trigger logic to alert you when nearing budget limits.

---

## 💻 Tech Stack

### Frontend (Client)
* **Framework**: React 19 (via Vite)
* **Styling**: Tailwind CSS v4 + Framer Motion for micro-animations
* **State Management**: Zustand (Auth & Notifications), TanStack React Query v5 (Data fetching & caching)
* **Routing**: React Router DOM v7
* **Icons & Charts**: Lucide React, Recharts

### Backend (Server)
* **Runtime**: Node.js + Express
* **Database**: Neon DB (Serverless PostgreSQL)
* **ORM**: Drizzle ORM
* **Authentication**: JWT & bcryptjs
* **AI Integration**: OpenRouter API

---

## 🛠️ Local Development Setup

### Prerequisites
Make sure you have installed:
* Node.js (v18+ recommended)
* A PostgreSQL database or a [Neon Serverless Postgres](https://neon.tech/) account.

### 1. Clone & Setup
Clone the repository and install dependencies for both sides of the app.

```bash
# Clone the repo (replace with your repo URL)
git clone https://github.com/itzmahtab/finance-ai.git
cd finance-ai

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file inside the `server` directory and add the following keys.

```env
# server/.env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
NODE_ENV=development
OPEN_ROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Database Setup
Set up the Drizzle schema in your database and push the structural changes.

```bash
# Inside the 'server' folder
npm run db:push

# Optional: Seed the database with initial categories (Recommended)
npm run db:seed
```

### 4. Run the Application
Open two separate terminal windows/tabs to start the backend and frontend simultaneously.

```bash
# Terminal 1: Start the Express Backend
cd server
npm run dev
# Server runs on http://127.0.0.1:5001

# Terminal 2: Start the React Frontend
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🚀 Deployment Guide

This repository is structured perfectly for deployment on platforms like Render (Backend) and Vercel/Netlify (Frontend).

### Deploying the Backend (e.g., Render)
1. Push your code to GitHub.
2. Log into Render and create a new **Web Service**.
3. Point it to your repository.
4. **Build Command**: `cd server && npm install && npm run build`
5. **Start Command**: `cd server && npm start`
6. Add your Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `OPEN_ROUTER_API_KEY`).
7. Deploy!

> **Note:** Take note of your backend production URL (e.g., `https://finance-ai-api.onrender.com`).

### Deploying the Frontend (e.g., Vercel)
1. Log into Vercel and create a new project.
2. Select your repository.
3. In the framework preset, it should automatically detect **Vite**.
4. **Root Directory**: Select `client` (very important!).
5. **Environment Variables**: Add an environment variable to point to your new backend URL.
    - `VITE_API_URL=https://finance-ai-api.onrender.com/api`
6. Click Deploy!
> *Make sure to update your `api.ts` base URL to use `import.meta.env.VITE_API_URL` instead of the local hardcoded proxy endpoint if applicable.*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/itzmahtab/finance-ai/issues).

## 📝 License
This project is licensed under the MIT License.
