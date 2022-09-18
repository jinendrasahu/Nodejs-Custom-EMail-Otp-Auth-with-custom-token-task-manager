const { default: mongoose } = require("mongoose");
const { Task } = require("../models/TaskModel");

module.exports.updateTask = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Invalid Task Id."
        });
    }

    let data = {
        user: req.user._id,
        _id: mongoose.Types.ObjectId(req.params.id),
        isActive: true
    }
    let update = {
        $set: {
            updated: new Date()
        }
    };
    if (req.body.task && req.body.task.toString().trim()) {
        update["$set"]["task"] = req.body.task.toString().trim();
    }
    if (req.body.status && req.body.status.toString().trim()) {
        if (req.body.status.toString().trim() === "Completed") {
            update["$set"]["status"] = "Completed";
            update["$set"]["completed_on"] = new Date();
        } else if (req.body.status.toString().trim() === "Incompleted") {
            update["$set"]["status"] = "Incompleted";
        } else {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Invalid Task Status."
            });
        }
    }
    let task = await Task.findOneAndUpdate(data, update, { upsert: false, new: true });
    if (task) {
        return res.status(200).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: true,
            message: "Task updated successfully.",
            data: task
        });
    } else {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Failed to update task."
        });
    }
}