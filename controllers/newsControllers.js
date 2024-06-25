
const News = require('../models/newsModel');

exports.getNews = async (req, res) => {
    try {

        const messages = await News.find({  });

        // Respond with the fetched messages
        res.status(200).json({ status: 200, response: messages });
    } catch (err) {
        // Handle any errors
        res.status(500).json({ status: 500, response: 'Server error',errorType : err });
    }
};

exports.getNewsCategoryWise = async (req, res) => {
    try {

        const {category} = req.body
        const messages = await News.find({ category}).sort({ createdAt: -1 });

        // Respond with the fetched messages
        res.status(200).json({ status: 200, response: messages });
    } catch (err) {
        // Handle any errors
        res.status(500).json({ status: 500, response: 'Server error',errorType : err });
    }
};

exports.getNewsIdWise = async (req, res) => {
    try {

        const { _id } = req.body;
        const messages = await News.findById(_id);
        
        // Respond with the fetched messages
        res.status(200).json({ status: 200, response: messages });
    } catch (err) {
        // Handle any errors
        res.status(500).json({ status: 500, response: 'Server error',errorType : err });
    }
};


