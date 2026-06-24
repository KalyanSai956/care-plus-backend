const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const medicineRoutes = require("./routes/medicineRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const aiRoutes = require(
  "./routes/aiRoutes"
);
const chatRoutes = require("./routes/chatRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use(
  "/api/ai",
  aiRoutes
);
app.use("/api/chat", chatRoutes);


app.get("/", (req, res) => {
  res.send("Care Plus API Running...");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});