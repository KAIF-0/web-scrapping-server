import { Hono } from "hono";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { createOrder } from "../controllers/payment.js";

dotenv.config();

const paymentInstance = new Hono();

paymentInstance.post("/createOrder", async (c) => {
  try {
    const { amount, name, email, phone, subscriptionType, userId } = await c.req.json();
    const options = { amount, name, email, phone, subscriptionType, userId };
    const data = await createOrder(options);
    return c.json(data);
  } catch (error) {
    console.log(error.message);
    return c.json({ success: false, msg: "Failed to Create Order!" });
  }
});

paymentInstance.post("/saveDetails", async (c) => {
  try {
    const data = await c.req.json();
    console.log(data);
    return c.json({
      success: true,
      msg: "Payment Details Saved Successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return c.json({ success: false, msg: "Failed to Save Details!" });
  }
});

export default paymentInstance;
