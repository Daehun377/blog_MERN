const express = require("express");
const router = express.Router();
const passport = require("passport");



const {
    register_user,
    login_user
} = require("../controller/user");

const checkAuth = passport.authenticate("jwt", {session : false});


//회원가입기능

//@route POST http://localhost:5000/user/register
//@desc Register user
//@access PUBLIC
router.post("/register", register_user);



//로그인

//@route POST http://localhost:5000/user/login
//@desc Login user
//@access PUBLIC

router.post("/login", login_user);



//현재 유저 정보

//@route GET http://localhost:5000/user/current
//@desc Cureent userinfo
//@access PRIVATE

router.get("/current", checkAuth, (req, res) => {

    res.json({
        id : req.user.id,
        email : req.user.email,
        name : req.user.name,
        avatar : req.user.avatar
    })

});

module.exports = router;