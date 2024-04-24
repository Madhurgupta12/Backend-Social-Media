const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const requiredLogin=require("../middleware/requireLogin");
const User=mongoose.model("User");
const Chat =require("../models/ChatData")
const { ObjectId } = require('mongodb');

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
//
      const users = await User.find(keyword
       
      );
     return res.json(users); // Return search results to the client
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.post('/api/message/send',requiredLogin,async(req, res) => {

    const {text,rr} = req.body;
 
    try {
      // Create a new chat message
      const newMessage = new Chat({
        sender:req.user._id,
        recipient:rr,
        text:text,
      });
  
      // Save the message to the database
      await newMessage.save();
  
      res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, error: 'Error sending message' });
    }
  });

  router.get('/api/messages/:receipt', requiredLogin,async (req, res) => {


    try {
      // Find chat messages exchanged between the two users
      const aa=req.params.receipt
      const check=await User.findById(aa);
      const messages = await Chat.find({
        $or: [
          {sender:req.user._id,recipient:aa},
         
        ],
      }).sort({ timestamp: 1 }); 
      // Sorting by timestamp ascending

      const dd = await Chat.find({
        $or: [
          {sender:aa,recipient:req.user._id},
         
        ],
      }).sort({ timestamp: 1 }); 
  
     return res.status(200).json({ success: true,data:messages,data2:dd,nn:check.name});
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ success: false, error: 'Error retrieving messages' });
    }
  });

  router.post("/accesschat",(req,res)=>{

    return res.json({success:"hello"});
  })
  

module.exports = router;
