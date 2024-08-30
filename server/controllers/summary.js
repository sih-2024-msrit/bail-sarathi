const Summary = require('../models/summary');
const axios=require('axios')
exports.getSummary = async (req, res) => {
    try {
        const location = req.body.location;

        const summaries = await Summary.find({location: location});

        res.status(200).json({
            success: true,
            message: "summary fetched successfully",
            data: summaries
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.createSummary = async (req, res) => {
    try {
        // will be taking from model
        const {} = req;
        const newSummary = await Summary.create({
            summary
        });

        res.status(201).json({
            success: true,
            message: "summary created successfully",
            data: newSummary
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
