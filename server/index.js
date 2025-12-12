import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";

// Các route chính
import routes from "./src/routes/index.js";

// Route thanh toán
import paymentRoutes from "./src/routes/paymentRoutes.js";

// 🚀 Route lưu lịch sử xem
import watchRoute from "./src/routes/watch.route.js";

const app = express();

// =========================================================
// CORS
// =========================================================
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// =========================================================
// ROUTES
// =========================================================

// History Watch API
app.use("/api/v1/watch", watchRoute);

// Payment API
app.use("/api/payment", paymentRoutes);

// API chính
app.use("/api/v1", routes);

// Root test
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});


const port = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected");
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });
