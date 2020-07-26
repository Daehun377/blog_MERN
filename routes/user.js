const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const userModel = require("../model/user");

function tokenGenerator (payload) {
    return jwt.sign(
        payload,
        process.env.SECRETKEY,
        {expiresIn: "1d"}
    );
};

//회원가입기능

//@route POST http://localhost:5000/user/register
//@desc Register user
//@access PUBLIC
router.post("/register", (req, res) => {

    // 이메일 유무체크 -> 패스워드 암호화 -> 데이터베이스 저장

    const {name, email, password } = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if(user){
                return res.json({
                    message : "email already exists"
                });
            }
            else{


                const newUser = new userModel({
                    name, email, password
                });

                newUser
                    .save()
                    .then(user => {
                        console.log(user);

                        res.json({
                            id : user._id,
                            name : user.name,
                            email : user.email,
                            password : user.password,
                            avatar : user.avatar,
                            date : {
                                createdDate : user.createdAt,
                                updatedDate : user.updatedAt
                            }
                        })
                    })
                    .catch(err => {
                        res.json({
                            error : err.message
                        })
                    })
            }
        })
        .catch(err => {
            res.json({
                message : err.message
            })
        })
})







//로그인

//@route POST http://localhost:5000/user/login
//@desc Login user
//@access PUBLIC

router.post("/login", (req, res) => {

    // 이메일 유무체크 -> 패스워드 비교 -> 로그인 -> 성공메세지(토큰발행)

    const {email, password} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            console.log(user);
            if(!user){
                return res.json({
                    message : "email not exists"
                })
            }
            else{
                user.comparePassword(password, (err, isMatch) => {
                    if(err || isMatch === false) {
                        return res.json({
                            message: "password Incorrect"
                        })
                    }
                    else{
                        const payload = { id : user._id, name : user.name, email : user.email, avatar : user.avatar}

                        res.json({
                            success : isMatch,
                            tokenInfo : tokenGenerator(payload)
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.json({
                error : err.message
            })
        })



    //jwt 토큰 생성




})






//현재 유저 정보

//@route GET http://localhost:5000/user/current
//@desc Cureent userinfo
//@access PRIVATE

router.get("/current", (req, res) => {



});

module.exports = router;