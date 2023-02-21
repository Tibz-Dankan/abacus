const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const generalRoutes = require("./routes/generalRoutes");
const loanRoutes = require("./routes/loanRoutes");
const saccoRoutes = require("./routes/saccoRoutes");
const fileRoutes = require("./routes/fileRoutes");
const contactRoutes = require("./routes/contactRoutes");
const path = require("path");
const cookieParser = require("cookie-parser");
// const ejsLint = require("ejs-lint");

// ejsLint(text, options);

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "views/css")));

app.use(cookieParser());

app.use("/", loanRoutes);

app.use("/", userRoutes);

app.use("/", saccoRoutes);

app.use("/", fileRoutes);

app.use("/", contactRoutes);

app.use("/", generalRoutes);

const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`server started and running on port ${PORT}...`)
);

module.exports = app;
