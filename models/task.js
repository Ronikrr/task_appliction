const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },
    projectName: {
        type: String,
        required: [true, "Project name is required"],
    },
    description: {
        type: String,
        required: [true, "Task description is required"],
        trim: true
    },
    important: {
        type: Boolean,
        default:false
    },
    complete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
