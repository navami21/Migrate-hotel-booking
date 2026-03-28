
// const mongoose = require("mongoose");
// const mysql = require("mysql2/promise");

// // 🔹 Pricing logic
// function getRoomPrice(roomType, checkIn) {
// const basePrices = {
// Single: 100,
// Double: 200,
// Suite: 400
// };

// let price = basePrices[roomType] || 150;

// const month = new Date(checkIn).getMonth();
// if (month === 11 || month === 0) {
// price *= 1.2;
// }

// return price;
// }

// // 🔹 Nights calculation
// function calculateNights(checkIn, checkOut) {
// const diff = new Date(checkOut) - new Date(checkIn);
// return Math.ceil(diff / (1000 * 60 * 60 * 24));
// }

// async function migrateDB() {
// await mongoose.connect("mongodb://127.0.0.1:27017/modern_hotel");

// const Booking = mongoose.model("Booking", {
// customer_name: String,
// rooms: Array,
// check_in: Date,
// check_out: Date,
// totalPrice: Number
// });

// const db = await mysql.createConnection({
// host: "localhost",
// user: "root",
// password: "",
// database: "legacy_hotel_new"
// });

// const [rows] = await db.execute("SELECT * FROM bookings");

// const grouped = {};

// // 🔹 Group bookings
// rows.forEach(r => {
// const key = `${r.customer_name}_${r.check_in}_${r.check_out}`;

// ```
// if (!grouped[key]) {
//   grouped[key] = [];
// }

// grouped[key].push(r);
// ```

// });

// for (let key in grouped) {
// const bookings = grouped[key];

// ```
// const customer = bookings[0].customer_name;
// const checkIn = bookings[0].check_in;
// const checkOut = bookings[0].check_out;

// const nights = calculateNights(checkIn, checkOut);

// const rooms = bookings.map(b => {
//   const price = getRoomPrice(b.room_type, checkIn);
//   return {
//     room_type: b.room_type,
//     price: price
//   };
// });

// const totalPrice = rooms.reduce((sum, r) => {
//   return sum + (r.price * nights);
// }, 0);

// await Booking.create({
//   customer_name: customer,
//   rooms: rooms,
//   check_in: checkIn,
//   check_out: checkOut,
//   totalPrice: totalPrice
// });
// ```

// }

// console.log(" DB Migration Done");
// }

// migrateDB();


const mongoose = require("mongoose");
const mysql = require("mysql2/promise");

// 🔹 Pricing logic
function getRoomPrice(roomType, checkIn) {
  const basePrices = {
    Single: 100,
    Double: 200,
    Suite: 400
  };

  let price = basePrices[roomType] || 150;

  const month = new Date(checkIn).getMonth();

  // Peak season pricing (Dec, Jan)
  if (month === 11 || month === 0) {
    price *= 1.2;
  }

  return price;
}

// 🔹 Nights calculation
function calculateNights(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// 🔹 Normalize date (FIXES TIMEZONE BUG)
function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

async function migrateDB() {
  try {
    // ✅ Connect MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/modern_hotel");
    console.log("MongoDB connected");

    // ✅ Booking Model
    const Booking = mongoose.model("Booking", {
      customer_name: String,
      rooms: Array,
      check_in: Date,
      check_out: Date,
      totalPrice: Number
    });

    // ✅ Connect MySQL
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "legacy_hotel_new"
    });

    console.log("MySQL connected");

    // ✅ Fetch legacy bookings
    const [rows] = await db.execute("SELECT * FROM bookings");

    console.log(`Fetched ${rows.length} legacy bookings`);

    // 🚨 Prevent duplicate migration
    await Booking.deleteMany({});
    console.log("Cleared existing modern bookings");

    const grouped = {};

    // 🔹 Group bookings (CRITICAL LOGIC)
    rows.forEach(r => {
      const key = `${r.customer_name}_${formatDate(r.check_in)}_${formatDate(r.check_out)}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(r);
    });

    console.log(`Grouped into ${Object.keys(grouped).length} bookings`);

    // 🔹 Transform & Insert
    for (let key in grouped) {
      const bookings = grouped[key];

      const customer = bookings[0].customer_name;
      const checkIn = bookings[0].check_in;
      const checkOut = bookings[0].check_out;

      const nights = calculateNights(checkIn, checkOut);

      const rooms = bookings.map(b => {
        const price = getRoomPrice(b.room_type, checkIn);

        return {
          room_type: b.room_type,
          price: price,
          guests: 1 //  added
        };
      });

      // ✅ Total revenue calculation
      const totalPrice = rooms.reduce((sum, r) => {
        return sum + (r.price * nights);
      }, 0);

      try {
        await Booking.create({
          customer_name: customer,
          rooms: rooms,
          check_in: checkIn,
          check_out: checkOut,
          totalPrice: totalPrice
        });
      } catch (err) {
        console.error("Error inserting booking:", err);
      }
    }

    console.log("🎉 DB Migration Completed Successfully!");

    // ✅ Close connections
    await db.end();
    await mongoose.disconnect();

    console.log("Connections closed");

  } catch (err) {
    console.error("Migration failed:", err);
  }
}

// 🚀 Run migration
migrateDB();