const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL
const connection = async () => {
    try {
        const res = await mongoose.connect(MONGO_URL)
        if (res) {
            console.log("MongoDB connected")
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = connection