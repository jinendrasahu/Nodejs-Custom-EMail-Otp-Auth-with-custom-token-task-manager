const { default: mongoose } = require("mongoose");
const { User } = require("../models/UserModel");

module.exports.logout = async (req, res) => {
    let condition = {
        _id: mongoose.Types.ObjectId(req.user._id)
    }

    let updateData = { $set: { token: "", updated: Date.now() } }
    let user = await User.findOneAndUpdate(condition, updateData, { new: true, upsert: false });
    if (user && user._id) {

        return res.status(200).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: true,
            message: "User logged out successfully."
        });
    } else {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Failed to logged out."
        });
    }

}