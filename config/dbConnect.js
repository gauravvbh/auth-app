const mongoose = require('mongoose');
require("dotenv").config();

// Connect to MongoDB database using mongoose
const connect = async () => {
    mongoose.connect(process.env.DATABASE_URI)
        .then(() => {
            console.log("Database Connection established")
        })
        .catch((err) => {
            // console.error(err)
            console.log("Connection Issues with Database");
            process.exit(1);
        })
}

module.exports = connect;