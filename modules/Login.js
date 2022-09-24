const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const cryptr = new Cryptr(process.env.SECRET_KEY);
const { User } = require("../models/UserModel");

module.exports.Login = async (req, res) => {
    if (!req.body.email || !req.body.email.toString().trim()) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Please enter valid email address."
        });
    }
    if (!req.body.password || !req.body.password.toString().trim()) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Password is required."
        });
    }
    if(Object.keys(req.body).length!==2){
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Extra parameter passed."
        });
    }
    let condition = {
        email: req.body.email.toString().trim()
    }
    let isUserDataExist = await User.findOne(condition);
    if (isUserDataExist && isUserDataExist._id && isUserDataExist.isVarified) {
        if (cryptr.decrypt(isUserDataExist.password) !== req.body.password.toString().trim()) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Invalid email or password."
            });
        }
        let tokenObj = {
            uid: isUserDataExist._id.toString()
        }

        let token = jwt.sign(tokenObj,process.env.SECRET_KEY,{
            expiresIn : '3m'
        })

        let updateData = { $set: { token, updated: Date.now() } }
        let user = await User.findOneAndUpdate(condition, updateData, { new: true, upsert: false });
        if (user && user._id) {

            return res.status(200).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: true,
                token: token,
                expiryTime : new Date(new Date().getTime()+3*60000),
                email: user.email,
                message: "User logged in successfully."
            });
        } else {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Please try again."
            });
        }
    } else {

        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "User not registered."
        });
    }
}