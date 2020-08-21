const express = require("express");
const router = express.Router();
const passport = require("passport");

const checkAuth = passport.authenticate("jwt", {session : false});

const profileModel = require("../model/profile");


//프로필 등록
//@route POST http://localhost:5000/profile/register
//@desc register/edit Profile from user
//@access PRIVATE

router.post("/register", checkAuth, (req, res) => {

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

//프로필 없애기
//@route delete http://localhost:2000/profile/
//@desc Delete Profiles from of a user
//@access Private

router.delete("/", checkAuth, (req, res) => {

    profileModel
        .findOneAndDelete({user : req.user.id})
        .then(() => {
            return res.status(200).json({
                message : "successfully deleted profile"
            })
        })
        .catch(err => {
            return res.status(500).json({
                message : err.message
            })
        })
});


//Add experience
//@route POST http://localhost:2000/profile/experience
//@desc Add experience to profile
//@access Private

router.post("/experience", checkAuth, (req, res) => {

    profileModel
        .findOne({user : req.user.id})
        .then(profile => {

            const newExperience = {
                title : req.body.title,
                company : req.body.company,
                location : req.body.location,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            };

            profile.experience.unshift(newExperience)

            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        error : err.message
                    })
                })


        })
        .catch(err => {
            res.status(404).json({
                error : err.message
            })
        })

});

//Add Education
//@route POST http://localhost:2000/profile/education
//@desc Add education to profile
//@access Private

router.post("/education", checkAuth, (req, res) => {

   profileModel
       .findOne({user : req.user.id})
       .then(profile => {

           const newEducation = {

               school : req.body.school,
               degree : req.body.degree,
               fieldOfStudy : req.body.fieldOfStudy,
               from : req.body.from,
               to : req.body.to,
               current : req.body.current,
               description : req.body.description

           }

           profile.education.unshift(newEducation);

           profile
               .save()
               .then(profile => {
                   res.status(200).json(profile)
               })
               .catch(err => {
                   res.status(404).json({
                       message : err.message
                   })
               })

       })
       .catch(err => {
           res.status(404).json({
               error : err.message
           })
       })
});


//Delete Experience
//@route POST http://localhost:2000/profile/experience/:exp_id
//@desc Delete Experience from profile
//@access Private

router.delete("/experience/:exp_id", checkAuth, (req, res) => {

    profileModel
        .findOne({user : req.user.id})
        .then(profile => {

          const removeIndex = profile.experience
                .map(item => item.id) //id를 찾을때 map으로 .id해서 찾을 수 있다!
                .indexOf(req.params.exp_id)

            profile.experience.splice(removeIndex, 1)

            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message : err.message
                    })
                })

        })
        .catch(err => {
            res.status(404).json({
                message : err.message
            })
        })
});

//Delete Education
//@route POST http://localhost:2000/profile/education/:exp_id
//@desc Delete Education from profile
//@access Private

router.delete("/education/:edu_id", checkAuth, (req, res) => {

    profileModel
        .findOne({user : req.user.id})
        .then(profile => {

            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id)

            profile.education.splice(removeIndex, 1)

            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile)
                })
                .catch(err => {
                    res.status(404).json({
                        message : err.message
                    })
                })

        })
        .catch(err => {
            res.status(404).json({
                message : err.message
            })
        })
}); 


module.exports = router
