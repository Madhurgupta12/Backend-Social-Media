const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const requiredLogin=require("../middleware/requireLogin");
const User=mongoose.model("User");

// API endpoint for searching users by username
router.get('/api/chat', async (req, res) => {
    try {
      const  keyword  = req.query.search?
      {
        $or: [
            { name: { $regex: new RegExp(req.query.search, 'i') } },
            { email: { $regex: new RegExp(req.query.search, 'i') } }
          ]

      }:{}

  
      

      const users = await User.find(keyword
       
      );
     return res.json(users); // Return search results to the client
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.post("/accesschat",(req,res)=>{
    return res.json({success:"hello"});
  })
  

module.exports = router;
