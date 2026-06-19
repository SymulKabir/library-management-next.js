// app/api/create-payment-intent/route.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const POST = async (request: Request) => {
  try {
    const {amount, currency } :any = await request.json()
 
    console.log("Response -->>");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,  
      currency: currency
    });
    console.log("paymentIntent -->>", paymentIntent);

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("error --->>>>", error)
    return Response.json({
      message: "Internal server error"
    });
  }
};
