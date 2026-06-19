"use client";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="elements-wrapper">
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <button
        disabled={isProcessing || !stripe || !elements}
        className="submit-payment-btn"
      >
        {isProcessing ? (
          <>
            <AiOutlineLoading3Quarters className="spinner-icon" size={18} />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <BiLockAlt size={18} />
            <span>Pay Securely Now</span>
          </>
        )}
      </button>
    </form>
  );
}