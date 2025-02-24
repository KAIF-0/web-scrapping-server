import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBFl9emYySacGBUfKKwQmxKiL8Sk9ujYb4");

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 