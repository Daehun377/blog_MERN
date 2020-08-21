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


//retrieve all post
//@route  GET http://localhost:2000/post/
//@desc   Retrieve all post
//@access Public
router.get("/", (req, res) => {

    postModel
        .find()
        .sort({date : -1})
        .then(posts => {
            if(posts.length === 0){
              return res.status(200).json({
                  message : "게시물이 없습니다"
              })
            }
            res.status(200).json({
                count : posts.length,
                postInfo : posts
            })

        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })

});


//get detail post
//@route  GET http://localhost:2000/post/:post_id
//@desc   Retrieve detail post
//@access Private
router.get("/:post_id", checkAuth,(req, res) => {

    const id = req.params.post_id;

    postModel
        .findById(id)
        .then(post => {
            return res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })
});


//update post
//@route  Patch http://localhost:2000/post/:post_id
//@desc   Update detail post
//@access Private
router.patch("/:post_id", checkAuth, (req, res) => {
//숙제
});


//delete post
//@route  Delete http://localhost:2000/post/:post_id
//@desc   Delete detail post
//@access Private
router.delete("/:post_id", checkAuth, (req, res) => {

    const id = req.params.post_id;

    postModel
        .findById(id)
        .then(post => {
            // 사용자 식별
            if(post.user.toString() !== req.user.id){
                return res.status(400).json({
                    message : "user not authorized this post"
                })
            }
            post
                .remove()
                .then(() => {
                    res.status(200).json({success : true})
                })
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })

});


//@route  POST http://localhost:2000/post/like/:post_id
//@desc   Like post
//@access Private
router.post("/like/:post_id", checkAuth, (req, res) => {

    const id = req.params.post_id;

    postModel
        .findById(id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                return res.status(400).json({
                    message : "user already liked this post"
                })
            }
            else {
                post.likes.unshift({user : req.user.id})
                post
                    .save()
                    .then(post => res.status(200).json(post))
            }
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })
});

//@route  DELETE http://localhost:2000/post/unlike/:post_id
//@desc   Unlike post
//@access Private

router.delete("/unlike/:post_id", checkAuth, (req, res) => {

    const id = req.params.post_id;

    postModel
        .findById(id)
        .then(post => {
            console.log(req.user)
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                return res.status(400).json({
                    message : "you have not liked this post"
                })
            }
            //get Remove index
            const removeIndex = post.likes
                .map(item => item.user.toString())
                .indexOf(req.user.id)

            post.likes.splice(removeIndex, 1)

            post
                .save()
                .then(post => res.status(200).json(post))
        })
        .catch(err => {
            res.status(500).json({
                message : err.message
            })
        })

});



module.exports = router;