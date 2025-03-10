const mongoose=require("mongoose");

const BailoutSchema=new mongoose.Schema({
    applicationNo:{
        type:String,
        required:true,
    },
    jurisdiction:{
        type:String,
        required:true,
    },
    caseDetails:{
        type:String,
        required:true,
    },
    application:{
        type:String,
        required:true,
    },
    applicationText:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },
    lawyer:{
        type:String,
        required:true,
    },
    judgeLicense: {
        type:String,
        required:true,
    },
    bailSummary: {
        type:String,
        required:true,
    },
    previousCase: {
        type:String,
        required:true,
    },
    ipcSection: {
        type:String,
        required:true,
    },
    criminalCase: {
        type:String,
        required:true,
    }
    },
    {
        timestamps: true
    }
);

module.exports=mongoose.model("bailout",BailoutSchema);