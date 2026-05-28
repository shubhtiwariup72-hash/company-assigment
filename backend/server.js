require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const statsRoutes = require("./routes/stats");

const app = express();
const PORT = process.env.PORT || 5000;

// Reflect the request Origin back as the allowed origin.
// Works for localhost, any Netlify preview, and future custom domains.
// origin:true echoes the Origin header back — the cors package handles
// OPTIONS preflight automatically, so no separate app.options() needed.
app.use(
  cors({
    origin: true,        // echo back whatever Origin the browser sends
    credentials: true,  // allow Authorization header
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ success: true, message: "API is healthy" }),
);
app.use(
  "/api/auth",
  (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  },
  authRoutes,
);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "Route not found" });
  next();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Connect to MongoDB first, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to MongoDB");
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
