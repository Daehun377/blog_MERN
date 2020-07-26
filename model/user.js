const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");


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


userSchema.pre("save", async function(next) {

    try {
        console.log("entered")
        const avatar = gravatar.url(this.email, {
            s : "200",
            r : "pg",
            d : "mm"
        });

        this.avatar = avatar;


        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(this.password, salt);

        this.password = passwordHash;

        console.log("exited");

        next();
    }
    catch(err){
        next(err)
    }


});



module.exports = mongoose.model("user", userSchema);