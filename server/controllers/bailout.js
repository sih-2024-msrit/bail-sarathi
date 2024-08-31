const Bailout = require('../models/bailout');
const {admin,bucket}=require("../config/firebaseAdmin");
const fs=require("fs");
const path=require("path");
const axios=require('axios')

exports.createApplication = async (req, res) => {
    try {
        const { applicationNo, jurisdiction,application,caseDetails } = req.body;
        // const { application, caseDetails } = req.files;

        if (!applicationNo || !jurisdiction || !application || !caseDetails) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, please try again"
            });
        }

        // Function to upload file to Firebase
        // const uploadToFirebase = (file, prefix) => {
        //     return new Promise((resolve, reject) => {
        //         const fileName = `${prefix}/${Date.now()}-${file.name}`;
        //         const fileUpload = bucket.file(fileName);
        //         const blobStream = fileUpload.createWriteStream({
        //             metadata: {
        //                 contentType: file.mimetype
        //             }
        //         });

        //         blobStream.on('error', (error) => {
        //             reject(error);
        //         });

        //         blobStream.on('finish', async () => {
        //             try {
        //                 await fileUpload.makePublic();
        //                 const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        //                 resolve(url);
        //             } catch (error) {
        //                 reject(error);
        //             }
        //         });

        //         // Read the file from the temporary directory and upload
        //         fs.createReadStream(file.tempFilePath).pipe(blobStream);
        //     });
        // };

        // // Upload both files
        // const [applicationPdfUrl, caseDetailsPdfUrl] = await Promise.all([
        //     uploadToFirebase(application, 'applications'),
        //     uploadToFirebase(caseDetails, 'caseDetails')
        // ]);

        // Create Bailout document
        const bailApply = await Bailout.create({
            applicationNo,
            jurisdiction,
            caseDetails,
            application ,
        });

        return res.status(200).json({
            success: true,
            message: 'Bail application formed successfully',
            bailApply
        });

    } catch (err) {
        console.error("Error while creating application", err);
        return res.status(500).json({
            success: false,
            message: "Couldn't create application"
        });
    }
}

exports.bailSummary=async(req,res)=>{
    try{
        const {applicationNo,flag}=req.body;
        //flag-> bs,pc,
        console.log("REQUEST BODY:",req.body)
        if(!applicationNo || !flag){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        console.log("BAIL SUMMARY ENTRY")
        const bailDetails=await Bailout.findOne({
            applicationNo:applicationNo
        });

        console.log("BAIL SUMMARY SEARCH")
        if(!bailDetails){
            return res.status(404).json({
                success:false,
                message:"The bail application couldnt be found"
            })
        }
        console.log("BAIL SUMMARY SEARCH SUCCESSFUL")
        let response='';

        if(flag==='bs'){
            response=await axios.post("http://localhost:5000/bail-summary",{applicationNo:bailDetails.applicationNo,application:bailDetails.application});
            if(!response){
                return res.status(404).json({
                    success:false,
                    message:"python flask error for backend"
                })
            }
            console.log("RESPONSE HERE:",response)
            console.log("BAIL SUMMARY EXTRACTED")
        }
        else if(flag==='pc'){
            response=await axios.post("http://localhost:5000/previous-cases",{application:bailDetails.caseDetails});
            if(!response){
                return res.status(404).json({
                    success:false,
                    message:"python flask error for backend"
                })
            }
            console.log("PREVIOUS CASES DONE")
        }
        else if(flag==='is'){
            response=await axios.post("http://localhost:5000/ipc-sections",{application:bailDetails.caseDetails});
            if(!response){
                return res.status(404).json({
                    success:false,
                    message:"python flask error for backend"
                })
            }
            console.log("IPC SECTIONS DONE")
        }
        else if(flag==='cr'){
            response=await axios.post("http://localhost:5000/criminal-records",{application:bailDetails.caseDetails});
            if(!response){
                return res.status(404).json({
                    success:false,
                    message:"python flask error for backend"
                })
            }
            console.log("CRIMINAL CASES DONE")
        }

        console.log("EVERYTHING DONE")
        return res.status(200).json({
            success:true,
            message:"generated successfully",
            summary:response?.data
        })
    }
    catch(err){
        console.log("Error while fetching summary",err)
        return res.status(500).json({
            success:false,
            message:"Error while creating summary "
        })
    }
} 


exports.testFlask=async(req,res)=>{
    try{
        console.log("flask test entry")
        const response=await axios.post("http://localhost:5000/test-llm",{input:req.body.input})
        console.log("flask test api ok")
        if(!response){
            return res.status(400).json({
                success:false,
                message:"came in express but flask dropped"
            })
        }   
        console.log("flask test api response ok",response?.data?.output)
        return res.status(200).json({
            success:true,
            message:"done it",
        })
    }
    catch(err){
        console.log("error while testing flask",err);
        return res.status(500).json({
            success:false,
            message:"flask error api "
        })
    }
}