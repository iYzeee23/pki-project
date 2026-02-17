## Setup Guide

### 1. Install Node.js

Download and install from: https://nodejs.org/en/download

---

### 2. Install MongoDB & Start the Service

Download and install from: https://www.mongodb.com/try/download/community

After installation, start the MongoDB service:

> **Services** → **MongoDB Server** → **Start the service**

---

### 3. Install Expo Go on iPhone

> **App Store** → Search for **Expo Go** → **Install**

---

### 4. Create Environment Files

Reporoot has a `.env.example` file. Copy it to `.env` and fill in the values.

To find your local IP address (needed for mobile ↔ server communication):

```bash
ipconfig
```

Use the **IPv4 Address** from the output (e.g. `192.168.1.x`) in your `.env` files.

---

### 5. Run Full Setup

```bash
npm run full:setup
```

Expected output: **Setup successfully finished!**

---

### 6. Initialize the Database

```bash
npm run db:init
```

Expected output: **DB init done**

---

### 7. Start All Dev Servers

```bash
npm run dev:all
```

This opens three terminal windows — one each for the server, web app, and mobile app.

> **Important:** Your phone and the server must be on the **same network** for the mobile app to connect.

---

## Known Limitations

- **Dark theme** is not supported
- **Screen rotation** is not supported
