const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotEnv = require("dotenv");
dotEnv.config();

const app = express();

//라우팅
const userRouter = require("./routes/user");


//데이터베이스 연결
require("./config/database");


//미들웨어 설정
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//라우팅
app.use("/user", userRouter);


const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`server started at ${PORT}`));