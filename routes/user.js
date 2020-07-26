const express = require("express");
const router = express.Router();


//회원가입기능

//@route POST http://localhost:5000/user/register
//@desc Register user
//@access PUBLIC
router.post("/register", (req, res) => {



})







//로그인

//@route POST http://localhost:5000/user/login
//@desc Login user
//@access PUBLIC

router.post("/login", (req, res) => {


})






//현재 유저 정보

//@route GET http://localhost:5000/user/current
//@desc Cureent userinfo
//@access PRIVATE

router.get("/current", (req, res) => {



});

module.exports = router;