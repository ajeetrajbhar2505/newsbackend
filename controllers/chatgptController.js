const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");


// const filePath = path.join(__dirname, "../public/images/cookie.png");
const filePath = path.join(__dirname, "../public/images/html.png");
const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);


// Image to text generation 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const image = {
    inlineData: {
        data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
        mimeType: "image/png",
    },
};


const News = require('../models/newsModel');

exports.askQuestion = async (req, res) => {
    try {
        const { prompt, category } = req.body;
        // Image to text generation 
        // const result = await model.generateContent(['Generate HTML/CSS code for a webpage based on the attached image. The image features a minimalist design with a gradient background (blue to white), a centered logo at the top, and a navigation bar with rounded buttons (black background, white text). Below the navigation, there are three sections with different background colors (light grey, white, and beige). Each section contains centered text with a 20px padding around it. Ensure the webpage is responsive for mobile devices and uses Bootstrap 4 for layout.', image]);
        // const formatImageToTextResponse = extractTextFromBackticks(result.response.text())

        

        // prompt to text generation
        const response = await run(prompt);
        // Process the response to replace ** with <b> and end ** with </b> and \n with <br>
        const formattedResponse = extractNews(formatResponse(response));

        res.send({ status: 200, response: formattedResponse });
        if (formattedResponse.length > 0) {
            formattedResponse.forEach(data => {
                const newNews = new News({
                    title: data.title,
                    author: "Unknown Author",
                    content: data.description || data.title,
                    summary: (data.description || data.title).split('.')[0] + '.',
                    category: category,
                    tags: [category, "India"],
                    imageUrl: "",
                    sourceUrl: "",
                    views: 0,
                    comments: []
                });

                newNews.save()
            })
        }

    } catch (error) {
        console.log(error);
        res.send({ status: 200, response: 'Cannot provide an answer for this question' });
    }
};

async function run(prompt) {
    try {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        // Add a check for safety-related error and throw it
        if (isSafetyError(error)) {
            throw new Error("SafetyError");
        } else {
            throw error;
        }
    }
}

// Example function to check if the error is related to safety concerns
function isSafetyError(error) {
    // Implement your logic to check if the error is related to safety concerns
    // For example, you might check the error message or error code here
    return error.message.includes("safety") || error.code === "SAFETY_CONCERN";
}

function formatResponse(response) {
    // Replace **text** with <b>text</b>
    let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Replace \n with <br>
    formattedResponse = formattedResponse.replace(/\n/g, '<br>');
    formattedResponse = formattedResponse.replace(/\*/g, '');

    return formattedResponse;
}


function extractNews(response) {
    const newsPattern = /<b>Title:<\/b>\s*(.*?)<br><br><b>Description:<\/b>\s*(.*?)<br><br>/g;
    let matches;
    const newsArray = [];

    while ((matches = newsPattern.exec(response)) !== null) {
        const title = matches[1].trim();
        const description = matches[2].trim();
        newsArray.push({ title, description });
    }

    return newsArray;
}

function extractTextFromBackticks(inputText) {
    const backtickPattern = /```([\s\S]*?)```/g; // Matches text inside ```...```
    let matches;
    let code = '';
    let description = '';

    // Extract text inside ```
    while ((matches = backtickPattern.exec(inputText)) !== null) {
        code = matches[1].trim().replace(/\n/g, ''); // Remove newline characters from code
    }

    // Extract description (text outside ```
    description = inputText.replace(backtickPattern, '').trim().replace(/\n/g, ''); // Remove newline characters from description

    return { code, description };
}
