const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const dashboardRoutes = require("./routes/dashboard");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/order");

const app = express();

app.use(cors());
app.use(express.json());

// =============================
// Folder Uploads
// =============================
app.use(
    "/uploads", express.static
    (path.join(__dirname, "uploads")));

// API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// Frontend
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;

console.log("__dirname =", __dirname);
console.log("frontend =", path.join(__dirname, "frontend"));
console.log("index =", path.join(__dirname, "frontend", "index.html"));

const fs = require("fs");

console.log(
    fs.existsSync(path.join(__dirname, "frontend", "profile.html"))
);

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});