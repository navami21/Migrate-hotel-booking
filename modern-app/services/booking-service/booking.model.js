const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer_name: String,

  rooms: [
    {
      room_type: String,
      price: Number   // ✅ added
    }
  ],

  check_in: Date,
  check_out: Date,

  totalPrice: Number   // ✅ added
});

module.exports = mongoose.model("Booking", bookingSchema);