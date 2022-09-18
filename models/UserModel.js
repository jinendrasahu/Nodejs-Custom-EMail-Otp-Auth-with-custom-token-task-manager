const mongoose = require("mongoose");

const user = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
        min: 8
    },
    isVarified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String
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

module.exports.User = mongoose.model("User", user);