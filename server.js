// server.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import ConnectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"; // ✅ FIXED

// .env config
dotenv.config();

// rest object
const app = express();
const allowedOrigins = [
  "https://makhsoos.vercel.app",  // apna frontend vercel link
  "http://localhost:5173"         // optional: for local testing
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// DB connect
ConnectDB();

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/review", reviewRoutes); // ✅ FIXED (singular)

// rest api
app.get("/", (req, res) => {
  res.send({ message: "hi mani" });
});

// port
const PORT = process.env.PORT || 8080;

// run app
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${process.env.DEV_MODE || "development"} mode`
  );
});
