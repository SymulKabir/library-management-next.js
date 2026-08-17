"use client";
import { useState } from "react";
import FaceAuthenticateModal from "@/src/components/FaceAuthenticateModal";

const useFaceAuth = (studentID=null) => {
  const [state, setState] = useState(false);
  const closeModal = () => {
    setState(false);
  };
  const openModal = () => {
    setState(true);
  };

  const modal = () => {
    return <FaceAuthenticateModal showModal={state} closeModal={closeModal} studentID={studentID} />;
  };

  return {
    state,
    setState,
    closeModal,
    openModal,
    modal,
  };
};

export default useFaceAuth;
