const User=require("../models/user");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const License=require('../models/License');
require("dotenv").config();

//login
exports.login=async(req,res)=>{
    try{
      //get data
      const {license,password}=req.body;
      //validate data
      if(!license || !password){
        return res.status(403).json({
          success:false,
          message:"All fields are required,please try again"
        })
      }
  
      //check if user exists or not
      const user=await User.findOne({license});
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


  exports.signup=async(req,res)=>{
    try{
      const {
        name,
        password,
        location,
        gender,
        email,
        accountType,
      }=req.body;

      console.log(req.body);

      if( !name  || !password || !location || !gender || !email || !accountType){
        return res.status(404).json({
          success:false,
          message:"All fields are required"
        })
      }
  
      //check by email
      const checKUserEmail=await User.findOne({
        email:email
      });
      if(checKUserEmail){
        return res.status(400).json({
          success:false,
          message:"provided email already exists"
        })
      }

      //hash the password and store in db 
      //first , generate the salt
      const saltRounds=10;
      const salt=await bcrypt.genSalt(10);
      if(!salt){
        return res.status(400).json({
          success:false,
          message:"salt generation error"
        })
      }
      //now hash it 
      const hashedPassword=await bcrypt.hash(password,salt);

      if(!hashedPassword){
        return res.status(400).json({
          success:false,
          message:"Password could not be hashed"
        })
      }

      //create unique license 
      let licenseCheck=false;
      let formattedLicense='';

      while(!licenseCheck){
      // Generate a random bytes buffer
      const buffer = crypto.randomBytes(8);
  
      // Convert the buffer to a hexadecimal string
      const licenseNumber = buffer.toString('hex').toUpperCase();
  
      // Format the license number (e.g., XXXX-XXXX-XXXX-XXXX)
      formattedLicense = licenseNumber.match(/.{1,4}/g).join('-');
  
        const checkUnique=await License.findOne({licenseNo:formattedLicense});

        if(!checkUnique){
          licenseCheck=true;
        }


      }
     
      await License.create({
        licenseNo:formattedLicense
      })
      //now finally create the user->sign him up 
      const createdUser=await User.create({
        name,
        license:formattedLicense,
        password:hashedPassword,
        location,
        gender,
        email,
        accountType,
      })

      if(!createdUser){
        return res.status(400).json({
          success:false,
          message:"Sign up error"
        })
      }

      return res.status(200).json({
        success:true,
        message:"User successfully signed up",
        createdUser
      })
    }
    catch(err){
      console.log(err);
      return res.status(500).json({
        success:false,
        message:"SignUp Failed, Please Try Again"
      })
    }
  }