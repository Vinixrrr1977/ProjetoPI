import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyFAKEKEY12345678901234567890123456");

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("hello");
        const response = await result.response;
        fs.writeFileSync('error_out.txt', 'SUCCESS: ' + response.text(), 'utf8');
        console.log(response.text());
    } catch (error) {
        fs.writeFileSync('error_out.txt', error.toString() + "\n" + error.message, 'utf8');
    }
}
run();
