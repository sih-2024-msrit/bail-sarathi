const mongoose=require("mongoose");

const SummarySchema=new mongoose.Schema({
    bailNo:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"bailout"
    },
    summary:{
        type:String,
        required:true,
    },
    ipcSections:[{
        type:String,
        required:true,
    }],
    criminalHistory:[{
        type:String,
        required:true,
    }]
    },
    {
        timestamps: true
    }
);


module.exports=mongoose.model("summary",SummarySchema);