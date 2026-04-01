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
  - **Monthly Tracking**: Filter your whole application view by a specific month and year natively.
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
* **Hosting**: Ready for Vercel

### Backend (Server)
* **Runtime**: Node.js + Express
* **Database**: Neon DB (Serverless PostgreSQL)
* **ORM**: Drizzle ORM
* **Authentication**: JWT & bcryptjs
* **AI Integration**: OpenRouter API
* **Hosting**: Ready for Render / Heroku

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

This project is perfectly split for a smooth deployment experience: Backend on **Render** and Frontend on **Vercel**.

### Part 1: Deploying the Backend on Render
1. Ensure your latest code is pushed to your GitHub repository.
2. Log into [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository (`finance-ai`).
4. Apply the following settings:
    - **Language/Environment**: Node
    - **Root Directory**: `server`
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
5. Scroll down to **Environment Variables** and add all your keys from `server/.env`:
    - `DATABASE_URL` (Your Neon Postgres Production URL)
    - `JWT_SECRET` (A strong random string)
    - `OPEN_ROUTER_API_KEY` (Your OpenRouter Key)
    - `NODE_ENV` = `production`
6. Click **Create Web Service**. Wait for the build to finish.
7. **Important**: Once deployed, copy your Render API URL (e.g., `https://finance-ai-api.onrender.com`). You will need this for the frontend!

### Part 2: Deploying the Frontend on Vercel
1. Log into [Vercel](https://vercel.com) and click **Add New** → **Project**.
2. Import your GitHub repository (`finance-ai`).
3. In the project setup, modify the following:
    - **Framework Preset**: Vite (should be auto-detected)
    - **Root Directory**: Click Edit and select `client`
4. Expander **Environment Variables** and add:
    - Name: `VITE_API_URL`
    - Value: `https://finance-ai-api.onrender.com/api` *(Paste the URL from Render, make sure to add `/api` at the end)*
5. Click **Deploy**.
6. Vercel will build your React application using the `vercel.json` already included to resolve Single Page App routing automatically.
7. Once finished, visit your live Vercel domain!

> **Note on CORS:** No changes are required as the backend allows all origins by default in its configuration. Vercel and Render will talk to each other flawlessly!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/itzmahtab/finance-ai/issues).

## 📝 License
This project is licensed under the MIT License.
