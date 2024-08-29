const mongoose=require("mongoose");

const LicenseSchema=new mongoose.Schema({
   licenseNo:{
    type:String,
    required:true
   }}
);


module.exports=mongoose.model("license",LicenseSchema);