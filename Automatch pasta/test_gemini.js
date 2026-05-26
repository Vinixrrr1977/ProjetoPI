import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDV8f0SyYh_9m83KpWYFmk1kMHCfRc9FwE");

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("hello");
        const response = await result.response;
        console.log(response.text());
    } catch (error) {
        console.error("ERRO DO GEMINI:", error);
    }
}
run();
