const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;
  let user = await UserModel.findOne({ email });
  if (user) {
    return res.send({ msg: "User already exist , please login" });
  }
  try {
    bcrypt.hash(password, 5, async(err, hash) => {
      if (err) {
        res.status(200).send({ msg: "not able to generate hash" });
      } else {
        const user = new UserModel({
          name,
          email,
          gender,
          password: hash,
          age,
          city,
          is_married,
        })
        await user.save();
        res.status(200).send({"msg": "The new user has been added"})
      }
    });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

 userRouter.post("/login", async(req, res) => {
    const {email , password} = req.body;
    try {
      const user = await UserModel.findOne({email});
      if(user){
        bcrypt.compare(password, user.password, (err, result) =>{
            if(result){
                var token = jwt.sign({username:user.name , userID: user._id }, "masai", { expiresIn: '7 days' });  
                res.status(200).send({"msg" : "Login Successfull!!"})
            }
            else{
             res.status(200).send({"msg": "user does not exist"}) 
            }
        });
      }
    } catch (error) {
        res.status(400).send({ error: error });
    }
 });

module.exports = { userRouter };
