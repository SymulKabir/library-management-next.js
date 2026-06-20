"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMemo, useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { successToast } from "@/src/utils/toast";
import { studentHeader } from "@/src/utils/header";

interface ComponentProps {
  modalData: any;
  closeModal: () => void;
}

const Index = ({ modalData, closeModal }: ComponentProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/issue-history`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      const transactionId = paymentIntent.id;
      const res = await fetch("/api/make-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...studentHeader() },
        body: JSON.stringify({ ...modalData, transactionId }),
      });
      const { success, message } = await res.json();
      setIsProcessing(false);
      closeModal({ reloadData: true });

      successToast("Your payment has been completed successfully.");
    }
    setIsProcessing(false);
  };
  const paymentElementOptions = useMemo(
    () => ({
      fields: {
        billingDetails: {
          name: "never" as const, // 🚫 Hides the Name Field
          email: "never" as const, // 🚫 Hides the Email Field
          phone: "never" as const, // 🚫 Hides the Phone Number Field
        },
      },
    }),
    [],
  );
  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="elements-wrapper">
        <PaymentElement options={paymentElementOptions} />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

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
            <span>Pay Now</span>
          </>
        )}
      </button>
    </form>
  );
};

export default Index;
