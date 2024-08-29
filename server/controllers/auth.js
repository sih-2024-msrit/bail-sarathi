const User=require("../models/User");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require("dotenv").config();

//login
exports.login=async(req,res)=>{
    try{
      //get data
      const {email,password}=req.body;
      //validate data
      if(!email || !password){
        return res.status(403).json({
          success:false,
          message:"All fields are required,please try again"
        })
      }
  
      //check if user exists or not
      const user=await User.findOne({email}).populate("notifications");
      if(!user){
        return res.status(415).json({
          success:false,
          message:"User does not exist, Sign up first please"
        })
      }
  
      //password Check
      if(await bcrypt.compare(password,user.password)){
        const payload={
          email:user.email,
          id:user._id,
          accountType:user.accountType,
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
          expiresIn:"3h",
        })
        user.token=token;
        user.password=undefined;
  
         //create cookie and send response
        const options={
          expires:new Date(Date.now()+3*60*60*1000),
          httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
          success:true,
          token,
          user,
          message:"Logged in successfully"
        })
      }

      
  
      else{
        return res.status(415).json({
          success:false,
          message:"Password is incorrect"
        })
      }
  
  
     
    } 
    catch(err){
      console.log(err);
      return res.status(500).json({
        success:false,
        message:"Login Failure, please try again"
      })
    }
  }