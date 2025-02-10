import { Hono } from "hono";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.RAZORPAY_ID_KEY, process.env.RAZORPAY_SECRET_KEY);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const paymentInstance = new Hono();

paymentInstance.post("/createOrder", async (c) => {
  //   const data = await c.req.json();
  //   console.log(data);
  //   return c.json(data);
  try {
    const data = await getOrderDetails();
    console.log(data);
    return c.json(data);
  } catch (error) {
    console.log(error.message);
    return c.json({ success: false, msg: "Something went wrong!" });
  }
});

export default paymentInstance;

const getOrderDetails = async () => {
  return await new Promise((resolve, reject) => {
    const amount = 100;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: "razorUser@gmail.com",
    };
    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        resolve({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: amount,
          key_id: process.env.RAZORPAY_ID_KEY,
          product_name: "DocsAI",
          description: "description",
          contact: "8700979251",
          name: "Kaif Khan",
          email: "kaif8700979251@gmail.com",
        });
      } else {
        console.log(err);
        reject({ success: false, msg: "Something went wrong!" });
      }
    });
  });
};
