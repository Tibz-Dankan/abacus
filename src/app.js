const express = require("express");
const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views"));

// // user routes
// app.use("/", userRoutes);

const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, () =>
  console.log(`server started and running on port ${PORT}...`)
);

module.exports = app;
