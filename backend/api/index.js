const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { connectDB } = require("./config/database");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS config via env
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("Server is running"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
