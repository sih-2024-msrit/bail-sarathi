const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
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
        enum:['Male','Female','Other'],
    },
    email:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:['Admin','User', 'Lawyer'],
        default:'User'
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