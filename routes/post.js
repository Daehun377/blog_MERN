const express = require("express");
const router = express.Router();
const passport = require("passport");

const checkAuth = passport.authenticate("jwt", {session : false});

const postModel = require("../model/post");

//@route  POST http://localhost:2000/post/register
//@desc   Register post
//@access Private

router.post("/register", checkAuth, (req, res) => {

    const newPost = new postModel({
        text : req.body.text,
        user : req.user.id,
        name : req.user.name,
        avatar : req.user.avatar
    });

    newPost
        .save()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })
});











module.exports = router;