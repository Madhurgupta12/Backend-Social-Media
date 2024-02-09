const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {JWT_SECRET}=require("../keys");
const requireLogin=require("../middleware/requireLogin");

const nodemailer=require("nodemailer");
const transporter=nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:587,
  secure:false,
  requireTLS:true,
  auth:{
    user:"om96002@gmail.com",
    pass:"ukpxerivmiqgvqje"
  }
})

const mailOptions={
  from:"om96002@gmail.com",
  to:"om96002@gmail.com",
  subject:"welcome to Instagram",
  text:"welcome to Instagram"

}





router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/protected",requireLogin,(req,res)=>{
    res.send("hello user verified");
})
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the field" });
  }
  User.findOne({ email: email })
  .then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "User Already Present" });
    } 
  
  bcrypt.hash(password, 12)
    .then(hashedpassword=>{
      
          const user = new User({ email, password:hashedpassword, name });
          
            user.save()
            .then((user) => {

transporter.sendMail(mailOptions,function(err,info){
  if(err)
  {
    console.error(err);
  }
  else
  {
    console.log("mail send successfully");
  }
})
             
         return res.json({ message: "saved successfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        
      });
    })

    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin",(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password)
    {
        return res.status(422).json({error:"please add email ans password"});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser)
        {
   return res.status(422).json({error:"Invalid Email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
if(doMatch)
{
    const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
    const {_id,name,email}=savedUser;
    res.json({token,user:{_id,name,email}});

    //res.json({message:"Successfully signIn"})
}
else
{
    return res.status(422).json({error:"Invalid  Email or Password"});
}
        })
        .catch((err)=>{
            console.log(err);
        });
        

    })
    .catch((err)=>{
        console.log(err);
    })


})

module.exports = router;
