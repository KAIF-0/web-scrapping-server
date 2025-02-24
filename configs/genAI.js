import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
