const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types
const VideoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    url:{type:String,required:true},
    postedBy:{type:ObjectId,ref:"User"}
})

const Reel=mongoose.model("reels",VideoSchema)
module.exports = Reel;