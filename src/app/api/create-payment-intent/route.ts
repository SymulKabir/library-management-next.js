// app/api/create-payment-intent/route.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const POST = async (request: Request) => {
  try {
    const {amount, currency } :any = await request.json()
    console.log("amount -->>", amount)
    console.log("currency -->>", currency)
    const amountInCents = Math.round(amount * 100);
 
    console.log("Response -->>");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,  
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
