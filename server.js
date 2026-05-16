
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import ConnectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Load environment variables
dotenv.config();

// Variables from .env
const PORT = process.env.PORT || 8080;
const DEV_MODE = process.env.DEV_MODE || "development";

// Connect to MongoDB
ConnectDB();

// Initialize express
const app = express();

const allowedOrigins = [
  "https://taskeena.com",
  "https://www.taskeena.com",
  "https://taskeena.vercel.app/", // <-- ADDED THE MISSING PROTOCOL   
  "http://localhost:5173", // <-- ADDED THE MISSING PORT 5174
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "Taskeena Backend",
    time: new Date().toISOString(),
  });
});


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/review", reviewRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${DEV_MODE} mode`);
});
