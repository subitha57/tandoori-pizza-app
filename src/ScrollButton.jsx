import React from 'react';
import './ScrollButton.css';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';



const ScrollToTopButton = () => { 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Smooth scrolling animation
    });
  };

  return (
    <div className='scrollbutton'>
    <button onClick={scrollToTop} className="scroll-to-top-button">
             <ArrowCircleUpIcon/>
    </button>
    </div>
  );
};

export default ScrollToTopButton;
