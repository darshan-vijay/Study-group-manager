const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
