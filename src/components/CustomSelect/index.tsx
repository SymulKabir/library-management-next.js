"use client";
import React, { ReactNode } from "react";
import "./styles.scss";
import { IoIosArrowDown } from "react-icons/io";

interface CustomSelectProps {
  children: ReactNode;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
}

const Index: React.FC<CustomSelectProps> = ({
  children,
  placeholder,
  name,
  value,
  onChange,
}) => {
const handleChange = (e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.target as HTMLOptionElement;

  target.setAttribute("name", name);

  if (target.tagName !== "OPTION") return;

  onChange(e as any);
};

  return (
    <div className="custom-select-component">
      <button type="button" className="selected-value">
        <p>{value || placeholder || "None"}</p>
        <IoIosArrowDown />
      </button>
      <div className="option-container" onClick={handleChange}>
        {children}
      </div>
    </div>
  );
};

export default Index;
