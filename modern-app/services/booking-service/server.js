const express = require("express");
const mongoose = require("mongoose");
const Booking = require("./booking.model");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/modern_hotel");

app.post("/bookings", async (req, res) => {
  const { customer_name, rooms, check_in, check_out } = req.body;

  // ✅ Calculate total revenue
  const totalPrice = rooms.reduce((sum, r) => sum + (r.price || 0), 0);

  const booking = new Booking({
    customer_name,
    rooms,
    check_in,
    check_out,
    totalPrice
  });

  await booking.save();
  res.json(booking);
});

app.get("/bookings", async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

app.listen(6001, () => console.log("Modern Booking Service running"));