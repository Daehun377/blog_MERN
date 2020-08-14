const {Strategy, ExtractJwt} = require("passport-jwt");
const userModel = require("../model/user");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_TOKEN;

module.exports = passport => {
    passport.use(
        new Strategy(opts, (payload, done) => {
            userModel
                .findById(payload.id)
                .then(user => {
                    if(!user){
                        return done(null, false);
                    }
                    else{
                        done(null, user);
                    }
                })
                .catch(err => console.log(err))
        })
    )
}