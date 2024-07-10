const {GoogleGenerativeAI} = require('@google/generative-ai');

exports.geminiRequest = async(req, res, next) => {
    const city = req.params.city;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
    const response = await model.generateContent(`Give me a JavaScript object, 15 items in length, of things to do in ${city}. For each item in the array, have a key called 'title' with a value that contains the title of the place in the thing to do. Have a key called 'description' with a value that contains a brief description of the thing to do.`);
    return res.status(200).json({response: response.response.text()});
};
