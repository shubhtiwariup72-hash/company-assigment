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
// This works for localhost dev, any Netlify preview URL, and any future domain
// without needing to maintain an allowlist.
// NOTE: origin:true + credentials:true is safe here because auth is JWT-based
// (not cookies that a third-party site could silently attach).
app.use(
  cors({
    origin: true,        // echo back whatever Origin header the browser sends
    credentials: true,  // allow Authorization header + cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Explicitly handle pre-flight OPTIONS for all routes
app.options("*", cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Connect to MongoDB first, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
