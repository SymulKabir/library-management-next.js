"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";
import "./style.scss";

import { IoClose } from "react-icons/io5";
import { HiOutlineCreditCard, HiOutlineShieldCheck } from "react-icons/hi2";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const Index = ({ modalData, closeModal }: any) => {
  if (!modalData || Number(modalData.amount) <= 0) return null;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    openModal();
  }, [modalData]);

  const openModal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(modalData.amount),
          currency: "usd",
        }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Payment initiation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {modalData && Number(modalData.amount) > 0 && clientSecret && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <div className="checkout-modal__header">
              <div>
                <h3 className="header-title">
                  <HiOutlineCreditCard className="card-icon" /> Secure Checkout
                </h3>
                <p className="header-subtitle">BookHive Digital Library Hub</p>
              </div>
              <button onClick={closeModal} className="close-btn">
                <IoClose size={24} />
              </button>
            </div>

            <div className="checkout-modal__body">
              <div className="summary-card">
                <div>
                  <span className="summary-card__label">FINE OF</span>
                  <p className="summary-card__desc">{modalData.title}</p>
                </div>
                <div className="summary-card__price">{`$${modalData.amount}`}</div>
              </div>

              {loading ? (
                <div className="skeleton-loader">
                  <div className="skeleton-loader__bar"></div>
                  <div className="skeleton-loader__bar"></div>
                  <div className="skeleton-loader__btn"></div>
                </div>
              ) : (
                clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#f59e0b",
                          colorBackground: "#ffffff",
                          colorText: "#1e293b",
                          borderRadius: "8px",
                        },
                      }, 
                    }}
                  >
                    <CheckoutForm
                      modalData={modalData}
                      closeModal={closeModal}
                    />
                  </Elements>
                )
              )}
            </div>

            <div className="checkout-modal__footer">
              <HiOutlineShieldCheck size={20} className="shield-icon" />
              <span>Guaranteed safe & secure checkout by Stripe</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
