const { default: mongoose } = require("mongoose");
const { Task } = require("../models/TaskModel");

module.exports.deleteTask = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Invalid Task Id."
        });
    }

    let data = {
        _id: mongoose.Types.ObjectId(req.params.id),
        user: req.user._id,
        isActive: true
    }
    let update = {
        $set: {
            isActive: false,
            updated: new Date()
        }
    };
    let task = await Task.findOneAndUpdate(data, update, { upsert: false });
    if (task) {
        return res.status(200).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: true,
            message: "Task deleted successfully.",
            data: task
        });
    } else {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Failed to delete task."
        });
    }
}