const { Task } = require("../models/TaskModel");
const moment = require("moment-timezone");

module.exports.createTask = async (req, res) => {
    if (!req.body.task || !req.body.task.toString().trim()) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Please enter task."
        });
    }
    if (!req.body.status || !req.body.status.toString().trim()) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Please enter Status."
        });
    }
    if (req.body.status.trim()!=="Completed" && req.body.status.trim()!=="Incompleted") {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Invalid Status."
        });
    }
    if (!req.body.date || !req.body.date.toString().trim()) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Please enter Date."
        });
    }
    if (!moment(req.body.date.toString().trim(),"DD-MM-YYYY",true).isValid()) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Please enter Date in DD-MM-YYYY format."
        });
    }
    

    if(Object.keys(req.body).length>3){
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Extra parameter passed."
        });
    }

    let data = {
        user: req.user._id,
        status:req.body.status.trim(),
        completed_on:new Date(req.body.date.trim()),
        task: req.body.task.toString().trim()
    }
    let task = await Task.create(data);
    if (task) {
        return res.status(200).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: true,
            message: "Task added successfully.",
            data: task
        });
    } else {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Failed to add task."
        });
    }
}