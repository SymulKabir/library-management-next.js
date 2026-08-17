import React from 'react';
import './styles.scss';

export const Index: React.FC = () => {
  return (
    <div className="skeleton-app">
      {/* Navbar Skeleton */}
      <header className="skeleton-navbar">
        <div className="skeleton-logo"></div>
        <div className="skeleton-search"></div>
        <div className="skeleton-nav-right">
          <div className="skeleton-nav-link"></div>
          <div className="skeleton-nav-link"></div>
          <div className="skeleton-avatar"></div>
        </div>
      </header>

    
    </div>
  );
};

export default Index;