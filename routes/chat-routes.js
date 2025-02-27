import { Hono } from "hono";
import { prisma } from "../configs/prisma.js";
import { scrapeDocumentation } from "../controllers/scrapeDocumentation.js";
import { chatRedisClient } from "../configs/redis/chatInstance.js";
import { getOrSetUserChats } from "../controllers/userChats.js";
import { updateChatCache } from "../helper/updateCache.js";
import { model } from "../configs/genAI.js";
import { docsData } from "../controllers/getDocsData.js";

const chatInstance = new Hono();

chatInstance.post("/feed-docs", async (c) => {
  try {
    const { userId, url } = await c.req.json();

    // extracting a common key for all same urls with different endpoints
    const urlObj = new URL(url);
    const key =
      urlObj.hostname.split(".")[0] === "www" ||
      urlObj.hostname.split(".")[0] === "docs"
        ? urlObj.hostname.split(".")[1]
        : urlObj.hostname.split(".")[0];

    console.log(key);
 
    // checking if docs already exist in redis
    const existingDocs = await chatRedisClient.get(key);
    if (!existingDocs) {
      // scraping the documentation if not found in redis
      await scrapeDocumentation(key, url);
    }
    // console.log(JSON.parse(existingDocs).length);


    const chat = await prisma.chat.create({
      data: {
        userId,
        url,
        key,
      },
    });

    // update cache
    await updateChatCache(userId);
    return c.json({
      success: true,
      message: "Docs saved successfully!",
      chat,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

chatInstance.get("/getUserChats/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    if (userId === "null") {
      throw new Error("Invalid userId!");
    }
    const chats = await getOrSetUserChats(userId);
    // console.log(chats);
    if (!chats) {
      c.set("message", "No chats found!");
      return c.notFound();
    }

    return c.json({
      success: true,
      message: "All chats retrieved successfully!",
      chats,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

chatInstance.post("/addDummyMessages/:chatId", async (c) => {
  try {
    const chatId = c.req.param("chatId");
    const userId = "67a8a557001f9c89d367"; // Replace with actual userId if needed
    const messages = [
      { question: "Hello!", response: "How are you?" },
      {
        question: "Meeting Reminder",
        response: "Don't forget our meeting tomorrow.",
      },
      {
        question: "Project Update",
        response: "The project is on track for completion.",
      },
      {
        question: "Feedback Request",
        response: "Could you provide feedback on the last document?",
      },
      {
        question: "Quick Question",
        response: "Can you clarify the requirements?",
      },
    ];

    for (const message of messages) {
    }

    await updateChatCache(userId);

    return c.json({
      success: true,
      message: "Dummy messages added successfully!",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

chatInstance.post("/getResponse/:chatId", async (c) => {
  try {
    const { question, userId, key, url } = await c.req.json();
    const chatId = c.req.param("chatId");

    if (!chatId) {
      throw new Error("Invalid chatId!");
    }

    // const data = await docsData(key, url);
    // const optimizedResponse = data
    //   ? data.map((doc) => doc.content).join(" ")
    //   : "No data available.";
    // const isRelated =
    //   optimizedResponse.toLowerCase().includes(key.toLowerCase()) ||
    //   optimizedResponse.toLowerCase().includes(url.toLowerCase());
    // const prompt = isRelated
    //   ? `Based on the documentation data: ${optimizedResponse}, please answer the question: "${question}". If you find the answer in the data, provide the best and most concise response you can otherwise provide a response that is relevant to the question.`
    //   : `Send response: I cannot answer this as it is not related to the documentation data.`;

    // const prompt = `Based on the documentation data: ${data} , please answer the question: "${question}". If you find the answer in the data, provide the best and most concise response you can otherwise answer it yourself with the best response."`;
    const response = await model.generateContent([question]);
    console.log(response.response.text());

    // await prisma.message.deleteMany({ where: { chatId } });

    const chatMessage = await prisma.message.create({
      data: {
        chat: {
          connect: { id: chatId },
        },
        userId,
        question: question,
        response: response.response.text(),
      },
    });

    // updating cached messages
    await updateChatCache(userId);
    return c.json({
      success: true,
      message: "AI response created successfully!",
      chatMessage,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
export default chatInstance;
