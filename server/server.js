const express = require("express");
const cors = require("cors");
const connectDB = require("./config.js");
const routes = require("./routes.js");
require("dotenv").config();

const app = express();
connectDB();
const corsoption = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsoption));
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
