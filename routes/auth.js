const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {JWT_SECRET}=require("../keys");
const requireLogin=require("../middleware/requireLogin");

const nodemailer=require("nodemailer");
const sendgridTransport=require("nodemailer-sendgrid-transport");

const transporter=nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"297BD4AB9446B66EDACF84D08218B75E588EEEE6CD56CE8CBBDFD2A16348F8899B1631C8089AD60F9CA73C196EA23F7F"

  }
}))

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
              const mailOptions = {
                from: 'your_email@example.com',
                to: user.email,
                subject: 'Sending email using SendGrid and Node.js',
                text: 'This is a test email sent using SendGrid and Node.js!'
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Error occurred: ', error);
                } else {
                  console.log('Email sent: ', info.response);
                }
              });
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
