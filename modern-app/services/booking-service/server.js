const express = require("express");
const mongoose = require("mongoose");
const Booking = require("./booking.model");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/modern_hotel");

app.post("/bookings", async (req, res) => {
  try {
    const { customer_name, rooms, check_in, check_out, type } = req.body;

    // ✅ Validation
    if (!customer_name || !rooms || rooms.length === 0) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // ✅ Calculate total price safely
    const totalPrice = rooms.reduce((sum, r) => {
      if (!r.price) throw new Error("Room price missing");
      return sum + r.price;
    }, 0);

    const booking = new Booking({
      customer_name,
      type: type || "hotel",
      rooms,
      check_in,
      check_out,
      totalPrice
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ALL BOOKINGS
========================= */
app.get("/bookings", async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE BOOKING
========================= */
app.put("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, rooms, check_in, check_out } = req.body;

    // ✅ Recalculate price
    const totalPrice = rooms.reduce((sum, r) => sum + (r.price || 0), 0);

    const updated = await Booking.findByIdAndUpdate(
      id,
      {
        customer_name,
        rooms,
        check_in,
        check_out,
        totalPrice
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE BOOKING
========================= */
app.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(6001, () => console.log("Modern Booking Service running"));