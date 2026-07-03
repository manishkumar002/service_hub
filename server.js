require("dotenv").config({ path: "./Backend/.env" });
const http = require("http");
const app = require("./Backend/app");
const connectDB = require("./Backend/config/db");
const PORT = process.env.PORT || 8000;

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Hi Manish, your server is running at http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});
