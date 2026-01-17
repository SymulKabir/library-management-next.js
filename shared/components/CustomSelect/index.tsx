'use client';
import React, { ReactNode } from 'react';
import './styles.scss';
import { IoIosArrowDown } from 'react-icons/io';

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
  onChange 
}) => {
    
  const handleChange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.target.name = name
    const elementTagName = e.target.tagName;
    if (elementTagName !== 'OPTION') {
      return;
    }

    onChange(e)
  };

  return (
    <div className='custom-select-component'>
      <button type="button" className='selected-value'>
        <p>{value || placeholder || "None"}</p>
        <IoIosArrowDown />
      </button>
      <div className='option-container' onClick={handleChange}>
        {children}
      </div>
    </div>
  );
};

export default Index;