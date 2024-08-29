const express=require("express");
const app=express();
require('events').EventEmitter.defaultMaxListeners = 0


//importing routes here
const userRoutes=require("./routes/User");
const bailoutRoutes=require("./routes/Bailout");
const summaryRoutes=require("./routes/Summary");

//connection for databse
const database=require("./configs/database");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const dotenv=require("dotenv");

dotenv.config();


//port no
const PORT=process.env.PORT || 4000;

//connect
database.connect();


//to parse json
app.use(express.json());

//to parse cookie
app.use(cookieParser());

//establishing connection between frontend and backend through cors
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
);


//for file uploads
app.use(
    fileUpload({
      useTempFiles:true,
      tempFileDir:"/tmp",
    })
  );


//mount routes here
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/bailout',bailoutRoutes);
app.use('/api/v1/summary',summaryRoutes);

//default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running"
    })
});

//Activate server

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})



