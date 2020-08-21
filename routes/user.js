const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const userModel = require("../model/user");

const {
    register_user,
    login_user,
    current_user,
    all_user
} = require("../controller/user");

const checkAuth = passport.authenticate("jwt", {session : false});


//회원가입기능

//@route POST http://localhost:5000/user/register
//@desc Register user / send Email
//@access PUBLIC
router.post("/register", register_user);

//Activation Account

//@route POST http://localhost:2000/user/activation
//@desc Activation account from confirm email
//@access Private

router.post("/activation", (req, res) => {

    const { token } = req.body;

    if(token){
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {

            if(err){
                return res.status(401).json({
                    error : "Expired link. Signup again"
                })
            }
            else{

                const { name, email, password } = jwt.decode(token);

                console.log(jwt.decode(token));

                const newUser = new userModel({
                    name, email, password
                });

                console.log("userInfo ", newUser);

                newUser
                    .save()
                    .then(user => {
                        return res.status(200).json({
                            message : "successful signup",
                            userInfo : user
                        })
                    })
                    .catch(err => {
                        res.status(401).json({
                            message : err.message
                        })
                    })
            }
        })
    }

});


//로그인

//@route POST http://localhost:5000/user/login
//@desc Login user
//@access PUBLIC

router.post("/login", login_user);



//현재 유저 정보

//@route GET http://localhost:5000/user/current
//@desc Cureent userinfo
//@access PRIVATE

router.get("/current", checkAuth, current_user);

//모든 유저 정보

//@route GET http://localhost:5000/user/all
//@desc Get all users
//@access PRIVATE(Only admin)

router.get("/all", checkAuth, all_user);






module.exports = router;