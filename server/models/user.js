const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    license:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required: true
    },

    gender:{
        type:String,
        required:true,
        enum:['male','female','other'],
    },
    email:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:['Judge','Lawyer'],
        default:'Lawyer'
    },
    token:{
        type:String
    },
    },
    {
        timestamps: true
    }
);


module.exports=mongoose.model("user",UserSchema);