const express = require('express');
const app = express();
const dbConnect = require('./config/dbConnect')
require("dotenv").config();
const user = require("./routes/user.route");
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;
dbConnect();
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1", user);


app.listen(PORT, () => {
    console.log("Server Running at PORT:", PORT);
})

app.get("/", (req, res) => {
    res.send("<h1>Auth App</h1>")
})