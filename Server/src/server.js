const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

dotenv.config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "change_me";
const MONGO_URI = process.env.MONGO_URI || "";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN }));

// --- Mongo (minimalno)
let mongoReady = false;

const NoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);

(async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is empty");
    await mongoose.connect(MONGO_URI);
    mongoReady = true;
    console.log("[mongo] connected");
  } catch (e) {
    console.log("[mongo] NOT connected:", e.message);
  }
})();

// --- JWT middleware (minimalno)
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// --- REST: health
app.get("/health", (req, res) => res.json({ ok: true }));

// --- REST: login -> JWT (hardcoded)
// test user: admin/admin
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username !== "admin" || password !== "admin") {
    return res.status(401).json({ message: "Bad credentials" });
  }

  const token = jwt.sign({ sub: "admin", role: "ADMIN" }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token });
});

// --- REST: protected endpoint (test JWT)
app.get("/secret", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// --- REST + Mongo + Socket: upis note -> emit event
app.post("/notes", requireAuth, async (req, res) => {
  if (!mongoReady) return res.status(500).json({ message: "Mongo not connected" });

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ message: "Missing text" });

  const note = await Note.create({ text });

  // real-time notify
  io.emit("note_created", {
    id: note._id.toString(),
    text: note.text,
    createdAt: note.createdAt,
  });

  res.status(201).json({ note });
});

// --- REST: read notes (test Mongo read)
app.get("/notes", requireAuth, async (req, res) => {
  if (!mongoReady) return res.status(500).json({ message: "Mongo not connected" });

  const notes = await Note.find().sort({ createdAt: -1 }).limit(20).lean();
  res.json({
    notes: notes.map((n) => ({
      id: n._id.toString(),
      text: n.text,
      createdAt: n.createdAt,
    })),
  });
});

// --- Socket.IO (isti server/port)
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN } });

io.on("connection", (socket) => {
  console.log("[socket] connected:", socket.id);
  socket.on("ping", () => socket.emit("pong", { ts: Date.now() }));
});

httpServer.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`));
