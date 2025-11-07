const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://fullstack-auth-app.surge.sh",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => res.json({ message: "API Running ✅" }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server on port ${PORT}`));
