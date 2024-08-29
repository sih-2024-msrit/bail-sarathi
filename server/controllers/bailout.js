const Bailout = require('../models/bailout');


// write req body later
exports.Makebailout = async (req, res) => {
    try {
        const { } = req.body;

        const bailout = await Bailout.create({
            
        });

        res.status(201).json({
            success: true,
            message: "bailout created successfully",
            data: bailout
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.bailoutStatus = async (req, res) => {
    try {
        const { } = req.body;
        const user = req.user._id;

        const bailouts = await Bailout.find({user});

        res.status(200).json({
            success: true,
            message: "bailout fetched successfully",
            data: bailouts
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}