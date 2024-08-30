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
        default:"Pending"
    }
    },
    {
        timestamps: true
    }
);


module.exports=mongoose.model("bailout",BailoutSchema);