const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET_KEY);
const { User } = require("../models/UserModel");

module.exports.varifyToken = async (req, res, next) => {
    if (!req.query.token && !req.body.token) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Invalid Token."
        });
    } else {
        let data = JSON.parse(cryptr.decrypt(req.body.token));

        if (!data || !data.uid || !data.token) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Invalid token."
            });
        }
        let condition = {
            _id: mongoose.Types.ObjectId(data.uid),
            isActive: true
        }

        let isUserDataExist = await User.findOne(condition);

        if (isUserDataExist && isUserDataExist._id) {
            if (isUserDataExist.isVarified) {
                let currentTimestamp = new Date();
                let otpTimestamp = new Date(isUserDataExist.updated);
                let dateDiff = currentTimestamp - otpTimestamp;
                if (isUserDataExist.token !== req.body.token || (dateDiff > 1e3 && ((dateDiff / 1e3) >= 86400))) {
                    return res.status(400).json({
                        timestamp: Math.floor(Date.now() / 1000),
                        success: false,
                        message: "Token expired please loggin again."
                    });
                } else {
                    req.user = JSON.parse(JSON.stringify(isUserDataExist));
                    next();
                }
            } else {
                return res.status(400).json({
                    timestamp: Math.floor(Date.now() / 1000),
                    success: false,
                    message: "Invalid Token"
                });
            }
        } else {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Invalid token."
            });
        }
    }
}