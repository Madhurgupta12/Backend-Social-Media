const express = require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const {MONGOURI}=require("./keys");
const {JWT_SECRET}=require("./keys");
const PORT=5001;
app.use(express.json());
app.use(cors());


require("./models/post");
require("./models/user");





app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/chat"));
app.use(require("./routes/reel"));



mongoose.connect(MONGOURI,{
    
});
mongoose.connection.on('connected',()=>{
console.log('Connected Established to Database');
});

mongoose.connection.on('error',(err)=>{
console.log('error connection',err);
})
const customMiddleware =(req,res,next)=>{
    console.log("middleware executed");
    next();
   
}
//app.use(customMiddleware);//applied to all route 





app.listen(PORT,()=>{
    console.log("Server is running on",PORT);
})