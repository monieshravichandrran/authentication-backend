const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./model/User");
const dotenv = require("dotenv");

dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGOOSE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((data,err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("Connected to database");
});

app.get("/",(req,res)=>{
    res.send("API IS RUNNING");
})

app.post("/login",async(req,res)=>{
    console.log(req.body);
    const users = await User.find({email: req.body.email});
    if(users.length==0){
        res.send({exist: false, msg: "User doesn't exist"});
        return;
    }
    const passwordAtDatabase = users[0].password;
    if(passwordAtDatabase == req.body.password){
        res.send({exist: true, msg: "Valid Credentials"});
    }
    else{
        res.send({exist: false, msg: "Invalid Password"});
    }
})

app.post("/signup",(req,res)=>{
    console.log(req.body);
    User.collection.insertOne(req.body,(data,err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Done");
        }
    })
    res.send("done");
})

app.listen(process.env.PORT,(data,err)=>{
    if(err){
        console.log("Error in connecting");
        return;
    }
    console.log(`Listening on PORT ${process.env.PORT}`);
})
