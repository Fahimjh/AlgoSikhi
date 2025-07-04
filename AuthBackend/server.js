const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Route registration
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser and useUnifiedTopology are deprecated
})
.then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => {
        console.log("🚀 Server running on http://localhost:5000");
    });
})
.catch(err => {
    console.error("❌ MongoDB connection error:", err);
});
