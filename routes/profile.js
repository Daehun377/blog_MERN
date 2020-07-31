const express = require("express");
const router = express.Router();
const passport = require("passport");

const checkAuth = passport.authenticate("jwt", {session : false});

const profileModel = require("../model/profile");


//프로필 등록
//@route POST http://localhost:5000/profile/
//@desc register/edit Profile from user
//@access PRIVATE

router.post("/", checkAuth, (req, res) => {

    const profileFields = {};

    profileFields.user = req.user.id

    if(req.body.introduce) profileFields.introduce = req.body.introduce;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.gender) profileFields.gender = req.body.gender;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;


    if(typeof req.body.skills !== "undefined" || req.body.skills.length !== 0){
        profileFields.skills = req.body.skills.split(",");
    }



    profileModel
        .findOne({user : req.user.id})
        .then(profile => {
            if(profile){

                profileModel
                    .findOneAndUpdate(
                        {user : req.user.id},
                        {$set : profileFields},
                        {new : true}
                    )
                    .then(profile => {
                        res.status(200).json(profile)
                    })
                    .catch(err => {
                        res.status(404).json({
                            message : err.message
                        })
                    })
                // return res.status(200).json({
                //     message : "profile already exists, please update profile"
                // })
            }
            else{
                new profileModel(profileFields)
                    .save()
                    .then(profile => res.status(200).json(profile))
                    .catch(err => {
                        res.status(400).json({
                            message : err.message
                        })
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })
});

//프로필 불러오기
//@route GET http://localhost:5000/profile/
//@desc Get Profile from user
//@access PRIVATE

router.get("/", checkAuth, (req, res) => {

    profileModel
        .findOne({user : req.user.id})
        .then(profile => {
            if(!profile){
                return res.status(200).json({
                    message : "no profile"
                })
            }
            else {
                res.status(200).json(profile)
            }
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })
});

//프로필 불러오기
//@route GET http://localhost:5000/profile/total
//@desc Get total Profile
//@access public

router.get("/total", (req, res) => {

    profileModel
        .find() //find는 배열로 나온다 findByOne, findById 는 객체로 나온다
        .populate("user", ["name", "email", "avatar"])
        .then(docs => {
            if(docs.length === 0) {
                return res.staus(200).json({
                    message : "profile not exists"
                })
            }
            else{
                res.status(200).json({
                    count : docs.length,
                    profiles : docs
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error : err.message
            })
        })
})









module.exports = router
