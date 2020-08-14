const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },

        email : {
            type : String,
            required : true
        },

        password : {
            type : String,
            required : true
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


userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err || isMatch === false){
            return cb(err)
        }
        cb(null, isMatch)
    })
}



module.exports = mongoose.model("user", userSchema);