const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotEnv = require("dotenv");
const passport = require("passport");
dotEnv.config();

const app = express();

//라우팅
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const postRouter = require("./routes/post");


//데이터베이스 연결
require("./config/database");


//미들웨어 설정
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(passport.initialize());

//함수 불러오기
require("./config/passport")(passport);


//라우팅
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/post", postRouter);


const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`server started at ${PORT}`));