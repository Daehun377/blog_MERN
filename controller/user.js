const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator"); //결과값이 담긴다
sgMail.setApiKey(process.env.MAIL_KEY);

const userModel = require("../model/user");


function tokenGenerator (payload) {
    return jwt.sign(
        payload,
        process.env.SECRET_TOKEN,
        {expiresIn: "1d"}
    );
};


exports.register_user = (req, res) => {

    // 이메일 유무체크 -> 패스워드 암호화 -> 데이터베이스 저장

    const {name, email, password } = req.body;

    const errors = validationResult(req); //사용자 요청에 대해 결과값을 담겠다, 패스되면 errors는 쓸모 없음.

    if(!errors.isEmpty()){ //내용이 있다면
        return res.status(422).json(errors)
    }

    userModel
        .findOne({email})
        .then(user => {
            if(user){
                return res.json({
                    errors : "email already exists"
                });
            }
            else{

                const payload = { name, email, password };
                const token = jwt.sign(
                    payload,
                    process.env.JWT_ACCOUNT_ACTIVATION,
                    {expiresIn: "10m"}
                );

                const emailData = {
                    from : process.env.EMAIL_FROM,
                    to : email,
                    subject : "Account activation link",
                    html : `
                        <h1>Please use the following to activate your account</h1>
                        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                        <hr />
                        <p>This email may contain sensetive information</p>
                        <p>${process.env.CLIENT_URL}</p>
                    `
                };

                sgMail
                    .send(emailData)
                    .then(() => {
                        return res.status(200).json({
                            message : `Email has been sent to ${email}`
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            errors : err.message
                        })
                    })

                // const newUser = new userModel({
                //     name, email, password
                // });
                //
                // newUser
                //     .save()
                //     .then(user => {
                //         console.log(user);
                //
                //         res.json({
                //             id : user._id,
                //             name : user.name,
                //             email : user.email,
                //             password : user.password,
                //             avatar : user.avatar,
                //             date : {
                //                 createdDate : user.createdAt,
                //                 updatedDate : user.updatedAt
                //             }
                //         })
                //     })
                //     .catch(err => {
                //         res.json({
                //             error : err.message
                //         })
                //     })


            }
        })
        .catch(err => {
            res.json({
                errors : err.message
            })
        })
};

exports.login_user = (req, res) => {

    // 이메일 유무체크 -> 패스워드 비교 -> 로그인 -> 성공메세지(토큰발행)

    const {email, password} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json(errors)
    }
    else {
        userModel
            .findOne({email})
            .then(user => {
                // console.log(user);
                // if(!user){
                //     return res.status(401).json({
                //         errors : "email not exists"
                //     })
                // }
                // else{
                user.comparePassword(password, (err, isMatch) => {
                    if(err || isMatch === false) {
                        return res.status(400).json({
                            errors: "password Incorrect"
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
                // }
            })
            .catch(err => {
                res.json({
                    errors : err.message
                })
            })
    }
};

exports.current_user = (req, res) => {


    userModel
        .findById(req.user.id)
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.json({
                error : err.message
            })
        })
    // res.json({
    //     id : req.user.id,
    //     email : req.user.email,
    //     name : req.user.name,
    //     avatar : req.user.avatar
    // })

};

exports.all_user = (req, res) => {

    userModel
        .findById(req.user.id)
        .then(user => {
            if(user.role !== "admin"){
                return res.json({
                    message : "you are not admin"
                })
            }
            else{
                userModel
                    .find()
                    .then(user => res.json(user));
            }
        })
        .catch(err => {
            res.json({
                error : err.message
            })
        })
};