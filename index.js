const express = require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const {MONGOURI}=require("./keys");
const {JWT_SECRET}=require("./keys");
const PORT=5001;
app.use(express.json());
app.use(cors());


const io=require('socket.io')(8000);
console.log(`socket server started on ${8000}`);
const users={};
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        console.log(msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


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



app.get("/",(req,res)=>{
    res.send("fgg");
})

app.listen(PORT,()=>{
    console.log("Server is running on",PORT);
})