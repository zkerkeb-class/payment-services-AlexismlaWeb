require("dotenv").config();
const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");
const cors = require("cors");

const app = express();

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cors());

// Routes

app.get("/api/payment/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "payment",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Payment service running on port ${PORT}`);
});
