const express = require("express");
const mongoose = require("mongoose");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/user");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.DB_HOST;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use(express.json());

// Роздача статики
app.use(express.static(path.join(__dirname, "public")));

// Папка для завантаження аватарок
const upload = multer({ dest: path.join(__dirname, "tmp") });

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

module.exports = app;
