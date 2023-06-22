const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");

const connectDB = require("./server/database/connection");

const app = express();

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 5000;

// Log requests
app.use(morgan("tiny"));

// MongoDB connection
connectDB();

// Parse requests with body-parser
app.use(bodyparser.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");

// Load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));


// Load routers
app.use("/", require("./server/routes/router"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
