const express = require("express");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const path = require("path");
const crypto = require("crypto");
const env = require("dotenv").config();
const app = express();
const id = process.env.Key_id;

const secrete = process.env.Key_secrete;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const razorpay = new Razorpay({
  key_id: id,
  key_secret: secrete,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/create_order", async (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/verify_payment", async (req, res) => {
  const { paymentId, orderId, signature } = req.body;
  const hmac = crypto.createHmac("sha256", secrete);
  hmac.update(orderId + "|" + paymentId);
  const digest = hmac.digest("hex");

  if (digest === signature) {
    // Payment successful, you can update your database here.
    res.json({ status: "success" });
  } else {
    res.status(400).json({ error: "Payment verification failed" });
  }
});

app.get("/success", (req, res) => {
  const { amount } = req.query;
  res.render("success", { amount });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
