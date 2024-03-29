const mongoose=require('mongoose');
const express=require('express');
const {ObjectId}=mongoose.Schema.Types
const chatSchema= new mongoose.Schema({


    sender: {type:ObjectId,ref: 'User',required: true },
    recipient:{type:ObjectId,ref:'User',required: true },
    text: {type: String, required: true },
    timestamp: {type: Date, default: Date.now }

})

const Chat=mongoose.model("chats",chatSchema);

module.exports=Chat

