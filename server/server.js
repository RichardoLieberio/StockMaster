require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const usersRouter = require("./routes/users");
const gudangRouter = require("./routes/gudang");
const barangRouter = require("./routes/barang");
const tokenRouter = require("./routes/token");

mongoose.set("runValidators", true);
mongoose.connect(process.env.MONGOOSE_URI)
    .then(function () {
        console.log("Connected to database");
    })
    .catch(function (err) {
        console.log("Failed to connect to database");
        console.log(err);
        process.exit(1);
    });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use("/api/users", usersRouter);
app.use("/api/gudang", gudangRouter);
app.use("/api/barang", barangRouter);
app.use("/api/token", tokenRouter);

app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`);
});