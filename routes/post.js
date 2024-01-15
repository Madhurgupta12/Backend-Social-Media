const express = require('express');
const router=express.Router();
const mongoose=require("mongoose");
const requiredLogin=require("../middleware/requireLogin");
const Post=mongoose.model('Post');


router.get("/allpost",requiredLogin,(req,res)=>{

    Post.find().populate("postedBy","_id name ")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        //posts.postedBy.password=undefined;
   res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
})
router.post("/createpost",requiredLogin,(req,res)=>{
    const{title,body,pic}=req.body;
    console.log("Creating post")
    if(!title||!body||!pic)
    {
        return res.status(422).json({error:"Please add all the fields"});
    }
    req.user.password=undefined;
    //console.log(req.user);
   
    const post=new Post({
        title:title,
        body:body,
        photo:pic,
        postedBy:req.user

    })
    post.save().then(result=>{
        if(result)
        {
            return res.json({post:result,user:req.user});
        }
        else
        {
            return res.status(422).json({error:"not posted"});
        }
    })
    .catch(err=>{
        console.log(err);
    })
})


router.get('/mypost',requiredLogin,(req,res)=>{
Post.find({postedBy:req.user._id})
.populate("postedBy","_id name")
.then(myposts=>{
    return res.json({post:myposts});
})
.catch(err=>{
    console.log(err);
})
})

router.put("/like",requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
},{
  new:true  
}).then((result)=>{
    if(result)
    {
       return res.json(result);
        
    }
    else
    {
        return res.status(422).json({error:err});
    }
})
})
router.put("/dislike",requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
},{
  new:true  
}).then((result)=>{
    if(result)
    {
        res.json(result);
    }
    else
    {
        return res.status(422).json({error:err});
       
    }
})
})

router.put("/comment",requiredLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id,
    }
    Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
},{
  new:true  
})
.populate("comments.postedBy","_id name")

.then((result)=>{
    if(result)
    {
       return res.json(result);
        
    }
    else
    {
        return res.status(422).json({error:err});
    }
})
})
router.delete("/deletepost/:postId",requiredLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
   
    // .then((err,post)=>{
    //     if(err || !post){
    //         return res.status(422).json({error11:err})
    //     }
    //     if(post.postedBy._id.toString() === req.user._id.toString()){
    //           post.remove()
    //           .then(result=>{
    //               res.json(result)
    //           }).catch(err=>{
    //               console.log(err)
    //           })
    //     }
    // })
    // .catch(err=>{
    //     res.status(422);
    // })

    .then((post) => {
        if (!post) {
          return res.status(422).json({ error: "Post not found" });
        }
    
        if (post.postedBy._id.toString() === req.user._id.toString()) {
          return post.deleteOne();
        } else {
          return res.status(403).json({ error: "Unauthorized access" });
        }
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      });

    })


module.exports=router;
