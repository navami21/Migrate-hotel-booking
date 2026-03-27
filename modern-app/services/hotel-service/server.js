const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.get("/hotels", (req, res) => {
  res.json([
    { name: "Taj Hotel", city: "Mumbai" },
    { name: "Leela Palace", city: "Delhi" }
  ]);
});

app.listen(7000, () => console.log("Hotel Service running"));