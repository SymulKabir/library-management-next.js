"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "@/src/constants";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit">Pay</button>
    </form>
  );
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const openModal = async () => {
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
    });

    const data = await res.json();
    console.log("data --->>>", data)
    setClientSecret(data.clientSecret);
    setOpen(true);
  };

  return (
    <div>
      <button onClick={openModal}>Buy Now</button>

      {open && clientSecret && (
        <div className="modal">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  );
}