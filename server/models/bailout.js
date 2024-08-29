const mongoose=require("mongoose");

const BailoutSchema=new mongoose.Schema({
    caseNo:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    status:{
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