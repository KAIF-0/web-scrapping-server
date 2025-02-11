import { config } from "dotenv";
import Razorpay from "razorpay";
config();

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});
