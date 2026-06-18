// app/api/create-payment-intent/route.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});


export const POST = async (request: Request) => { 
    console.log("Response -->>")
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000, // $20.00
    currency: "usd",
  });
  console.log("paymentIntent -->>", paymentIntent)

  return Response.json({
    clientSecret: paymentIntent.client_secret,
  });
}