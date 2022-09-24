const { default: mongoose } = require("mongoose");
const { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

module.exports.varifyToken = async (req, res, next) => {
    if (!req.headers.token) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Invalid Token."
        });
    } else {
        let tokenElement = req.headers.token.trim();
        let tokenData = tokenElement.split(" ");
        if (tokenData.length !== 2 || tokenData[0]!=="Bearer") {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Invalid Token Format."
            });
        }
        jwt.verify(tokenData[1], process.env.SECRET_KEY, (err, data) => {

            if (err) {
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

            User.findOne(condition).exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        timestamp: Math.floor(Date.now() / 1000),
                        success: false,
                        message: "Invalid token."
                    });
                }
                if (!result.token) {
                    return res.status(400).json({
                        timestamp: Math.floor(Date.now() / 1000),
                        success: false,
                        message: "Please loggin again."
                    });
                }
                if(result.token!==tokenData[1]){
                    return res.status(400).json({
                        timestamp: Math.floor(Date.now() / 1000),
                        success: false,
                        message: "Invalid Token."
                    });
                }
                req.user = JSON.parse(JSON.stringify(result));
                next();
            });
        })
    }
}