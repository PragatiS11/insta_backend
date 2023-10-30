const express = require("express");
const cors = require("cors")
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes");

require('dotenv').config()

const app = express();
app.use(cors())
app.use(express.json())
app.use("/users" , userRouter)
app.use("/posts" , postRouter)
app.listen(process.env.port , async () => {
    try {
        await connection;
        console.log("Connected to the DB")
        console.log(`server is running at port ${process.env.port}`)  
    } catch (error) {
        console.log(error)
    }
   
})