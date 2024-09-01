const Bailout = require('../models/bailout');
const { admin, bucket } = require("../config/firebaseAdmin");
const fs = require("fs");
const path = require("path");
const axios = require('axios')
const formData=require('form-data')
const pdfParse=require('pdf-parse');
const mailSender = require('../utils/mailSender');
const statusUpdate = require('../mails/statusUpdate');
const user = require('../models/user');

async function sendmail(email, status, applicationNo, judgeLicense) {
    try{
        const mailResponse=await mailSender(email,"Status Update",statusUpdate(status, applicationNo, judgeLicense));
        console.log("Email sent successfully:",mailResponse);
    }
    catch(error){
        console.log("Error occured while sending mails:",error);
        throw error;
    }
}

const uploadToFirebase = (file, prefix) => {
    return new Promise((resolve, reject) => {
        const fileName = `${prefix}/${Date.now()}-${file.name}`;
        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject(error);
        });

        blobStream.on('finish', async () => {
            try {
                await fileUpload.makePublic();
                const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                resolve(url);
            } catch (error) {
                reject(error);
            }
        });

        // Read the file from the temporary directory and upload
        fs.createReadStream(file.tempFilePath).pipe(blobStream);
    });
};

exports.createApplication = async (req, res) => {
    try {
        const { jurisdiction, license, judgeLicense } = req.body;
        let caseDetails = req.body.caseDetails;
        const { application } = req.files;
    
        if (!jurisdiction || !application || !license || !judgeLicense) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, please try again"
            });
        }
    
        const apptempPath = application.tempFilePath;
        const applicationTextBuffer = fs.readFileSync(apptempPath);
        const applicationTextData = await pdfParse(applicationTextBuffer);
        const applicationText = applicationTextData.text;
    
        if (!caseDetails) {
            // caseDetails is a pdf --> send to python --> get the text --> store in db
            const caseDetailsFile = req.files.caseDetails;
            if (!caseDetailsFile) {
                return res.status(400).json({
                    success: false,
                    message: "Case details file is required"
                });
            }
    
            const cdtempPath = caseDetailsFile.tempFilePath;
            const pdfBuffer = fs.readFileSync(cdtempPath);
            const pdfData = await pdfParse(pdfBuffer);
            const textResponse = pdfData.text;
    
            console.log("Text Response:", textResponse);
    
            const applicationPdfUrl = await uploadToFirebase(application, 'applications');
            const applicationNo = Date.now();
    
            const bailApply = await Bailout.create({
                applicationNo,
                jurisdiction,
                caseDetails: textResponse,
                application: applicationPdfUrl,
                lawyer: license,
                judgeLicense,
                applicationText
            });
    
            return res.status(200).json({
                success: true,
                message: "Bail Applied successfully"
            });
    
        } else {
            // caseDetails is text --> store in db
            const applicationPdfUrl = await uploadToFirebase(application, 'applications');
            const applicationNo = Date.now();
    
            const bailApply = await Bailout.create({
                applicationNo,
                jurisdiction,
                caseDetails,
                application: applicationPdfUrl,
                lawyer: license,
                judgeLicense,
                applicationText
            });
    
            return res.status(200).json({
                success: true,
                message: "Bail Applied successfully"
            });
        }
    
    } catch (err) {
        console.error("Error while creating application", err);
        return res.status(500).json({
            success: false,
            message: "Couldn't create application"
        });
    }
    
}

exports.getLawyerBail=async(req,res)=>{
    try{
        const {license}=req.body;

        if(!license){
            return res.status(404).json({
                success:false,
                message:"license not found"
            })
        }

        let bailData=await Bailout.find({lawyer:license});
        
        if(!bailData){
            bailData=[]
        }

        return res.status(200).json({
            success:true,
            message:"successfully fetched all the applications",
            bailData
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"couldnt get lawyer bail applicatiosn"
        })
    }
}

exports.getJudgeBail=async(req,res)=>{
    try{
        const {judgeLicense}=req.body;
        console.log("JUDGE LICENSE:",judgeLicense)
        if(!judgeLicense){
            return res.status(404).json({
                success:false,
                message:"license not found"
            })
        }

        let bailData=await Bailout.find({judgeLicense});
        
        if(!bailData){
            bailData=[]
        }

        return res.status(200).json({
            success:true,
            message:"successfully fetched all the applications",
            bailData
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"couldnt get judge bail applicatiosn"
        })
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const { applicationNo, status } = req.body;
        console.log("REQUEST BODY:", req.body)
        if (!applicationNo || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        console.log("STATUS CHANGE ENTRY")
        
        const bailDetails = await Bailout.findOne({ applicationNo });
        if (!bailDetails) {
            return res.status(404).json({
                success: false,
                message: "The bail application couldnt be found"
            });
        }

        console.log("STATUS CHANGE SEARCH")

        bailDetails.status = status.toLowerCase();
        await bailDetails.save();
        const userdetail = await user.findOne({license: bailDetails.lawyer});
        console.log("user"   , userdetail)
        // email, status, applicationNo, judgeLicense
        sendmail(userdetail.email, status, bailDetails.applicationNo, bailDetails.judgeLicense);        

        return res.status(200).json({
            success: true,
            message: "Status updated successfully"
        });
    } catch (err) {
        console.error("Error while updating status", err);
        return res.status(500).json({
            success: false,
            message: "Couldn't update status"
        });
    }
}


exports.bailSummary = async (req, res) => {
    try {
        const { applicationNo, flag } = req.body;
        //flag-> bs,pc,
        console.log("REQUEST BODY:", req.body)
        if (!applicationNo || !flag) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        console.log("BAIL SUMMARY ENTRY")
        const bailDetails = await Bailout.findOne({
            applicationNo: applicationNo
        });

        console.log("BAIL SUMMARY SEARCH")
        if (!bailDetails) {
            return res.status(404).json({
                success: false,
                message: "The bail application couldnt be found"
            })
        }
        console.log("BAIL SUMMARY SEARCH SUCCESSFUL", bailDetails.caseDetails)
        let response = '';

        if (flag === 'bs') {
            response = await axios.post("http://localhost:5000/bail-summary", { applicationNo: bailDetails.applicationNo, application: bailDetails.applicationText });
            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "python flask error for backend"
                })
            }
            console.log("RESPONSE HERE:", response)
            console.log("BAIL SUMMARY EXTRACTED")
        }
        else if (flag === 'pc') {
            response = await axios.post("http://localhost:5000/previous-cases", { application: bailDetails.caseDetails });
            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "python flask error for backend"
                })
            }
            console.log("PREVIOUS CASES DONE")
        }
        else if (flag === 'is') {
            response = await axios.post("http://localhost:5000/ipc-sections", { application: bailDetails.caseDetails });
            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "python flask error for backend"
                })
            }
            console.log("IPC SECTIONS DONE")
        }
        else if (flag === 'cr') {
            response = await axios.post("http://localhost:5000/criminal-records", { application: bailDetails.caseDetails });
            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "python flask error for backend"
                })
            }
            console.log("CRIMINAL CASES DONE")
        }

        console.log("EVERYTHING DONE")
        return res.status(200).json({
            success: true,
            message: "generated successfully",
            summary: response?.data
        })
    }
    catch (err) {
        console.log("Error while fetching summary", err)
        return res.status(500).json({
            success: false,
            message: "Error while creating summary "
        })
    }
}


exports.testFlask = async (req, res) => {
    try {
        console.log("flask test entry")
        const response = await axios.post("http://localhost:5000/test-llm", { input: req.body.input })
        console.log("flask test api ok")
        if (!response) {
            return res.status(400).json({
                success: false,
                message: "came in express but flask dropped"
            })
        }
        console.log("flask test api response ok", response?.data?.output)
        return res.status(200).json({
            success: true,
            message: "done it",
        })
    }
    catch (err) {
        console.log("error while testing flask", err);
        return res.status(500).json({
            success: false,
            message: "flask error api "
        })
    }
}


//-->cd pdf --> req,body-->cd agar wha se aagay -> application ki pdf upload -->url -->url ko db
//-->cd -->req.files-->dono ko upload pdf-->dono ko url-->dono ko url 

exports.testChatBot=async(req,res)=>{
    try{
        const {
            question
        }=req.body;

        console.log("request body:",req.body);
        if(!question){
            return res.status(404).json({
                success:false,
                message:"question not given"
            })
        }

        const response=await axios.post('http://localhost:5000/chatbot',{question:question},{
            headers:'multipart/form-data'
        });

        if(!response){
            return res.status(404).json({
                success:false,
                message:"Bot didnt give the response,he is annoyed :-("
            })
        }
        console.log("Response from the chatbot",response);
        return res.status(200).json({
            success:true,
            message:"chatbot replied happily",
            response:response.data
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"some thing went wrong"
        })
    }
}