

const axios = require("axios");
const mysql = require("mysql2/promise");

// Pricing logic
function getRoomPrice(roomType, checkIn) {
const basePrices = {
Single: 100,
Double: 200,
Suite: 400
};

let price = basePrices[roomType] || 150;

const month = new Date(checkIn).getMonth();
if (month === 11 || month === 0) {
price = price * 1.2;
}

return price;
}

// Nights calculation
function calculateNights(checkIn, checkOut) {
const diff = new Date(checkOut) - new Date(checkIn);
return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

async function migrate() {
try {
const db = await mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "legacy_hotel_new"
});

const result = await db.execute("SELECT * FROM bookings");
const rows = result[0];

const grouped = {};

rows.forEach(function(r) {
  const key = r.customer_name + "_" + r.check_in + "_" + r.check_out;

  if (!grouped[key]) {
    grouped[key] = [];
  }

  grouped[key].push(r);
});

for (let key in grouped) {
  const bookings = grouped[key];

  const customer = bookings[0].customer_name;
  const checkIn = bookings[0].check_in;
  const checkOut = bookings[0].check_out;

  const nights = calculateNights(checkIn, checkOut);

  const rooms = bookings.map(function(b) {
    const price = getRoomPrice(b.room_type, checkIn);
    return {
      room_type: b.room_type,
      price: price
    };
  });

  let totalPrice = 0;
  rooms.forEach(function(r) {
    totalPrice += r.price * nights;
  });

  const payload = {
    customer_name: customer,
    rooms: rooms,
    check_in: checkIn,
    check_out: checkOut,
    totalPrice: totalPrice
  };

  await axios.post("http://localhost:6001/bookings", payload);
}

console.log("✅ API Migration Done");


} catch (err) {
console.error("❌ Migration Error:", err.message);
}
}

migrate();
