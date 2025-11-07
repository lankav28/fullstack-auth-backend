// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// ✅ Updated CORS
const allowedOrigins = [
  "https://fullstack-auth-app.surge.sh",
  "http://fullstack-auth-app.surge.sh", // Surge sometimes uses http for preview
  "http://localhost:5173",
];

// ✅ Improved CORS setup for Render + Surge
app.use(
  cors({
    origin: [
      "https://fullstack-auth-app.surge.sh",
      "http://fullstack-auth-app.surge.sh",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200, // Fixes preflight on older browsers
  })
);


// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/tasks", require("./routes/tasks"));

app.get("/", (req, res) => {
  res.json({ message: "API Running ✅" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
