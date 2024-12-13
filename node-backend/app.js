const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Import route files
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enhanced CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // If frontend sends cookies or credentials
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/api", profileRoutes); // Add profile routes here

// Start Server
const PORT = process.env.PORT || 3010;
global.RABBIT_MQ = process.env.RABBIT_MQ || "amqp://localhost:5672";

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
