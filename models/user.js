const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        lowercase: true
    },
    tasks: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Task",
        }
    ]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User
