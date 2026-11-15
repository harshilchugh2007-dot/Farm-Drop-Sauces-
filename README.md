# 🌿 FarmDrop Sauces — Backend API

Production-ready, robust RESTful API backend for the **FarmDrop Sauces** web application. Built with **Node.js** and **Express.js**, featuring complete endpoints for server health monitoring, product catalog retrieval, an intelligent conversational AI chatbot, contact message dispatch, customer order placement, and newsletter subscriptions.

Designed specifically to be deployed as a **Render Web Service** and communicate smoothly with a **Cloudflare Pages** or static-hosted frontend without CORS restrictions.

---

## 📋 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Project Architecture](#-project-architecture)
3. [Prerequisites](#-prerequisites)
4. [Local Setup & Running](#-local-setup--running)
5. [Environment Variables](#-environment-variables)
6. [Automated Test Suite](#-automated-test-suite)
7. [API Documentation](#-api-documentation)
   - [Server Status](#1-get-apistatus)
   - [Products Catalog](#2-get-apiproducts)
   - [Single Product](#3-get-apiproductsid)
   - [Chatbot Assistant](#4-post-apichat)
   - [Contact Inquiries](#5-post-apicontact)
   - [Customer Orders](#6-post-apiorders)
   - [Newsletter Subscription](#7-post-apinewsletter)
8. [Deploying to Render](#-deploying-to-render)
9. [Connecting to Cloudflare Frontend](#-connecting-to-cloudflare-frontend)

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- **Framework**: [Express.js](https://expressjs.com/) (v4.x)
- **CORS Handling**: `cors` middleware with custom dynamic origin validator
- **Environment Management**: `dotenv`
- **Architecture**: Modular MVC-style routing with centralized error handlers and JSON data persistence

---

## 📁 Project Architecture

```text
backend/
├── data/
│   ├── chatbotKnowledge.js   # FarmDrop conversational knowledge base & NLP matcher
│   ├── contacts.json         # Storage for incoming customer contact inquiries
│   ├── orders.json           # Storage for incoming customer orders
│   ├── products.json         # Master product catalog with ingredients & pricing
│   └── subscribers.json      # Newsletter subscribers database
├── middleware/
│   └── errorHandler.js       # Centralized 404 and 500 error handling middleware
├── routes/
│   ├── chat.js               # Chatbot message processing endpoint
│   ├── contact.js            # Contact form inquiry endpoints
│   ├── newsletter.js         # Newsletter subscription endpoints
│   ├── orders.js             # Order placement and retrieval endpoints
│   ├── products.js           # Product listing and filtering endpoints
│   └── status.js             # Health check & uptime monitor endpoint
├── .env.example              # Template for environment configuration
├── package.json              # Project metadata, dependencies, and run scripts
├── server.js                 # Main server entrypoint and CORS configuration
├── test-backend.js           # Automated integration test suite
└── README.md                 # Complete backend documentation (this file)
```

---

## ⚙️ Prerequisites

- **Node.js** v18.0.0 or higher installed on your computer.
- **npm** (comes bundled with Node.js).

Check your installed versions:
```bash
node -v
npm -v
```

---

## 🚀 Local Setup & Running

### Step 1: Navigate to the backend directory
```bash
cd backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell, use `Copy-Item .env.example .env`)*

### Step 4: Start the server
To start in standard production mode:
```bash
npm start
```

Or start in auto-reloading development mode:
```bash
npm run dev
```

The server will spin up on:
```text
=================================================
🌿 FarmDrop Sauces Backend API Server is Running!
=================================================
📡 Local URL:        http://localhost:5000
📊 Health Check:    http://localhost:5000/api/status
🍅 Products API:    http://localhost:5000/api/products
💬 Chatbot API:     http://localhost:5000/api/chat
📬 Contact API:     http://localhost:5000/api/contact
🛒 Orders API:      http://localhost:5000/api/orders
🌍 Environment:     development
=================================================
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

| Variable | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | The port the HTTP server listens on | `5000` | `5000` *(Render sets this automatically)* |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` | `production` |
| `FRONTEND_URL` | Cloudflare Pages or frontend origin allowed by CORS | `*` | `https://farm-drop-sauces.pages.dev` |

---

## 🧪 Automated Test Suite

An end-to-end integration test suite is included in `test-backend.js` to verify every endpoint, validation rule, error handler, and CORS header:

```bash
node test-backend.js
```

All 31 assertions test real HTTP requests and responses:
- Server uptime & metadata verification
- Product retrieval, query filtering & 404 validation
- Chatbot intent resolution & empty message validation
- Contact form submission, input validation & email format checks
- Order total computation, quantity checks & shipping calculation
- Newsletter subscription
- CORS preflight and access headers

---

## 📖 API Documentation

### 1. `GET /api/status`
Returns server operational health, uptime, version, and endpoints overview.

**Sample Request:**
```bash
curl http://localhost:5000/api/status
```

**Sample Response (`200 OK`):**
```json
{
  "status": "online",
  "success": true,
  "service": "FarmDrop Sauces Backend API",
  "version": "1.0.0",
  "environment": "development",
  "uptime": "42s (42s)",
  "timestamp": "2026-11-14T18:15:00.000Z",
  "endpoints": {
    "status": "GET /api/status",
    "products": "GET /api/products",
    "productById": "GET /api/products/:id",
    "chat": "POST /api/chat",
    "contact": "POST /api/contact",
    "orders": "POST /api/orders",
    "newsletter": "POST /api/newsletter"
  }
}
```

---

### 2. `GET /api/products`
Retrieves all sauce varieties from the product catalog.

**Query Parameters:**
- `category` *(optional)*: Filter by category (e.g., `Hot Sauces`, `Ketchup`, `Dips`).
- `spicy` *(optional)*: `true` or `false` to filter heat levels.
- `search` *(optional)*: Search keyword matching product names, ingredients, or descriptions.

**Sample Request:**
```bash
curl http://localhost:5000/api/products
```

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "classic-tomato-ketchup",
      "name": "Classic Tomato Ketchup",
      "tag": "⭐ Best Seller",
      "category": "Ketchup & Table Sauces",
      "price": 149,
      "currency": "INR",
      "size": "350g",
      "spiceLevel": "Mild (1/5)",
      "description": "Rich, tangy, and perfectly balanced — our signature ketchup made with vine-ripened tomatoes and a hint of natural sweetness.",
      "ingredients": ["Tomatoes", "Basil", "Garlic", "Cane Sugar", "Natural Vinegar", "Sea Salt"],
      "image": "images/tomato-ketchup.png",
      "inStock": true,
      "dietary": ["Vegan", "Gluten-Free", "Preservative-Free", "100% Natural"]
    }
  ]
}
```

---

### 3. `GET /api/products/:id`
Retrieves full details for a specific product by its ID slug.

**Sample Request:**
```bash
curl http://localhost:5000/api/products/spicy-chilli-sauce
```

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "spicy-chilli-sauce",
    "name": "Spicy Chilli Sauce",
    "tag": "🔥 Spicy",
    "price": 179,
    "size": "300g",
    "spiceLevel": "Extra Hot (5/5)",
    "description": "A fiery blend of hand-picked red chillies with a smoky kick."
  }
}
```

---

### 4. `POST /api/chat`
Handles conversational AI queries about FarmDrop Sauces, ingredients, flavours, spice rankings, sourcing heritage, dietary requirements, and ordering assistance.

**Request Body:**
```json
{
  "message": "Which sauce is the spiciest?"
}
```

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "botName": "FarmDrop Assistant 🌿",
  "userMessage": "Which sauce is the spiciest?",
  "reply": "Looking for heat? 🔥\n- **Spicy Chilli Sauce** is our hottest offering (rated 5/5 heat), made with fiery handpicked red chillies and a smoky kick!\n- **Creamy Peri Peri Sauce** (rated 4/5 heat) packs authentic African bird's eye chillies blended with creamy goodness and fresh lemon.",
  "suggestions": [
    "Spicy Chilli Sauce details",
    "Creamy Peri Peri details",
    "Do you have mild sauces?"
  ],
  "timestamp": "2026-11-14T18:15:30.000Z"
}
```

---

### 5. `POST /api/contact`
Receives contact form submissions and wholesale inquiries, validates fields, and records them.

**Request Body:**
```json
{
  "name": "Rohan Verma",
  "email": "rohan@example.com",
  "subject": "Store Partnership",
  "message": "We would love to stock FarmDrop sauces in our retail stores!"
}
```

**Sample Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Thank you, Rohan Verma! We have received your message and will respond within 24 hours.",
  "inquiry": {
    "id": "INQ-1731608100-a1b2",
    "name": "Rohan Verma",
    "email": "rohan@example.com",
    "subject": "Store Partnership",
    "createdAt": "2026-11-14T18:16:00.000Z"
  }
}
```

---

### 6. `POST /api/orders`
Places an order request, calculates line items, verifies stock, and applies dynamic shipping rates (free shipping above ₹499).

**Request Body:**
```json
{
  "customerName": "Ananya Sharma",
  "email": "ananya@example.com",
  "phone": "+91 98765 00000",
  "shippingAddress": "Flat 402, Green Acres, Pune 411001",
  "items": [
    { "productId": "classic-tomato-ketchup", "quantity": 2 },
    { "productId": "spicy-chilli-sauce", "quantity": 1 }
  ],
  "notes": "Please pack carefully"
}
```

**Sample Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Thank you for ordering, Ananya Sharma! Your order has been placed.",
  "order": {
    "orderId": "FD-ORD-1731608150-742",
    "customer": {
      "name": "Ananya Sharma",
      "email": "ananya@example.com",
      "shippingAddress": "Flat 402, Green Acres, Pune 411001"
    },
    "items": [
      {
        "productId": "classic-tomato-ketchup",
        "productName": "Classic Tomato Ketchup",
        "unitPrice": 149,
        "quantity": 2,
        "total": 298
      },
      {
        "productId": "spicy-chilli-sauce",
        "productName": "Spicy Chilli Sauce",
        "unitPrice": 179,
        "quantity": 1,
        "total": 179
      }
    ],
    "subtotal": 477,
    "shippingFee": 50,
    "totalAmount": 527,
    "currency": "INR",
    "status": "confirmed",
    "createdAt": "2026-11-14T18:16:30.000Z"
  }
}
```

---

### 7. `POST /api/newsletter`
Subscribes an email to the farm newsletter.

**Request Body:**
```json
{
  "email": "priya@example.com"
}
```

**Sample Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Welcome to the FarmDrop family! You are now subscribed to farm updates and exclusive offers.",
  "email": "priya@example.com"
}
```

---

## 🌐 Deploying to Render

This backend is 100% configured for one-click deployment on [Render](https://render.com/).

### Deployment Steps:
1. Push your project with the `backend/` folder to your public GitHub repository.
2. Sign in to your **Render Dashboard** and click **New +** -> **Web Service**.
3. Select your **Farm-Drop-Sauces** repository.
4. Configure the service settings:
   - **Name**: `farm-drop-sauces-backend`
   - **Region**: Choose the closest region (e.g., Singapore or Frankfurt).
   - **Branch**: `main`
   - **Root Directory**: `backend` *(Important! Set this so Render builds inside the backend folder)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Cloudflare Pages URL (e.g., `https://farm-drop-sauces.pages.dev`)
   *(Note: `PORT` is automatically assigned by Render, no need to define it manually)*
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public URL (e.g. `https://farm-drop-sauces-backend.onrender.com`).
8. Test your live deployment by opening `https://<your-render-url>/api/status` in your browser!

> 💡 **Render Free Tier Tip**: Free tier instances spin down after 15 minutes of inactivity. When a new request arrives, Render automatically spins the service back up within 30–50 seconds. The FarmDrop frontend script includes graceful reconnection messaging during wakeups.

---

## ☁️ Connecting to Cloudflare Frontend

To connect your Cloudflare-hosted frontend with your Render backend:

1. Open `script.js` in the frontend.
2. At the top of `script.js`, verify `API_BASE_URL`:
   ```javascript
   const API_BASE_URL = (function () {
     if (typeof window !== 'undefined' && window.FARMDROP_API_URL) {
       return window.FARMDROP_API_URL.replace(/\/$/, '');
     }
     const host = window.location.hostname;
     if (host === 'localhost' || host === '127.0.0.1' || host === '') {
       return 'http://localhost:5000';
     }
     return 'https://YOUR-RENDER-SERVICE-NAME.onrender.com';
   })();
   ```
3. Update `https://YOUR-RENDER-SERVICE-NAME.onrender.com` with your exact Render backend URL, or simply set it in `index.html` via:
   ```html
   <script>
     window.FARMDROP_API_URL = "https://your-backend.onrender.com";
   </script>
   ```
4. Deploy your frontend to Cloudflare Pages. CORS is already pre-configured to allow all `*.pages.dev` and `*.workers.dev` origins!

--
**Created by Harshil Chugh**
