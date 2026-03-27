import React from "react";

function BookingCard({ booking }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">

      <h2 className="text-xl font-semibold mb-2">
        {booking.customer_name}
      </h2>

      <p className="text-gray-500 text-sm mb-3">
        {new Date(booking.check_in).toDateString()} →
        {new Date(booking.check_out).toDateString()}
      </p>

      <div>
        <h3 className="font-semibold mb-1">Rooms</h3>
        <div className="flex flex-wrap gap-2">
          {booking.rooms.map((r, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
            >
              {r.room_type}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

export default BookingCard;