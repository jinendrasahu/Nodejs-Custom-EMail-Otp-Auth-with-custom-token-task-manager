const mongoose = require("mongoose");

const task = new mongoose.Schema({
    task: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Completed", "Incompleted"],
        default: "Incompleted"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    completed_on: {
        type: Date,
        required: false,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

module.exports.Task = mongoose.model("Task", task);