const express = require('express');
const router=express.Router();
const requiredLogin = require('../middleware/requireLogin');
const Reel=require("../models/reel")
router.post("/reel",requiredLogin,(req,res)=>{
    const title=req.body.title;
    const url=req.body.url;
if(!title||!url)
return res.status(404).json({message:"Enter all fields"})

const result=new Reel({title:title,url:url,postedBy:req.user})
result.save()
.then((saved)=>{
    if(saved)
    {
return res.status(200).json({success:true});
    }
    else
    return res.status(404).json({message:"error",success:false});

})
.catch((err)=>{
    return res.status(500).json({message:err.message,success:false});
})

})

router.get("/ShowReel",requiredLogin,(req,res)=>{

    const result=Reel.find({})
    .then((data)=>{
        if(data)
        {
            return res.status(200).json({reel:data});
        }
        else
        return res.status(404).json({message:"error"});

    })
    .catch((err)=>{
        return res.status(500).json({message:err.message});
    })


})

module.exports=router;