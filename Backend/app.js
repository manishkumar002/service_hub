const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require("../Backend/middleware/error");
const authRoutes = require("./routes/webapi");

const app = express();

/* Middlewares */
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

/* Routes */
app.use("/api", authRoutes);
app.use(errorMiddleware);

/* Test Route */
app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;
