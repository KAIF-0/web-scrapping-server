import { razorpayInstance } from "../configs/razorpay.js";

export const createOrder = async ({
  amount,
  phone,
  name,
  email,
  subscriptionType,
  userId,
}) => {
  return await new Promise((resolve, reject) => {
    const options = {
      amount: parseInt(amount) * 100,
      currency: "USD",
      receipt: "kaif8700979251@gmail.com",
    };
    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        resolve({
          success: true,
          msg: "Order Created",
          orderId: order.id,
          amount: amount,
          product_name: "DocsAI Pro Subscription",
          description:
            "DocsAI Pro Subscription with unlimited chats and sites integrations.",
          userId: userId,
          phone: phone,
          username: name,
          email: email,
          subscriptionType: subscriptionType,
        });
      } else {
        console.log(err);
        reject({ success: false, msg: "Failed to Create Order!" });
      }
    });
  });
};
