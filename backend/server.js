const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
  res.send("Kupora Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Kupora Backend Connected 🚀"
  });
});
app.post("/api/create-order", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const { amount } = req.body;

const numericAmount = Number(
  String(amount).replace(/[^\d.]/g, "")
);

const options = {
  amount: Math.round(numericAmount * 100),
  currency: "INR",
  receipt: `kupora_${Date.now()}`
};
console.log("OPTIONS:", options);
const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});