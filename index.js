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

//D0D826CD65D1103FDF11AF472A93A6AC6E281722CBFBDE23DE55A51F5B5A04AD0E5FC72EA3F6238FC84218A26AADA7E8



app.use(require("./routes/auth"));
app.use(require("./routes/post"));



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
