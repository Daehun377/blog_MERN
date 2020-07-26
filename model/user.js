const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            requried : true
        },

        email : {
            type : String,
            requried : true
        },

        password : {
            type : String,
            requried : true
        },

        avatar : {
            type : String
        },

        role : {
            type : String,
            default : "user",
        }
    },
    {
        timestamps : true
    }
);




module.exports = mongoose.model("user", userSchema);