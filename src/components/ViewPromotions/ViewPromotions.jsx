
import React, { useState, useEffect } from 'react';
import './ViewPromotions.css';
import { useTheme } from '../Theme/ThemeContext'; // Import the ThemeContext
import FoodDisplay from '../foodDisplay/FoodDisplay'; // Import the FoodDisplay component
import CloseIcon from '@mui/icons-material/Close';

const offers = [
  { type: 'small', discount: '1% off any small pizzas', category: 'Pizza' },
  { type: 'medium', discount: 'Rs.2 off any medium pizzas', category: 'Pizza' },
  { type: 'large', discount: 'Rs.3 off any large pizzas', category: 'Pizza' },
  { type: 'Rolls', discount: 'Rs.4 off any Rolls', category: 'Rolls' },
  { type: 'Cake', discount: 'Rs.2.5 off any Cake', category: 'Cake' },
  { type: 'Pasta', discount: 'Rs.2% off any Pasta', category: 'Pasta' },
  { type: 'Noodles', discount: 'Rs.3% off any Noodles', category: 'Noodles' }
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ViewPromotions = ({ onClose, onApplyCoupon }) => {
  const { darkTheme } = useTheme(); // Get the current theme from the context
  const [todayOffers, setTodayOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setTodayOfferBasedOnDay();
  }, []);

  const setTodayOfferBasedOnDay = () => {
    const today = new Date().getDay();
    const shuffledOffers = [...offers];

    // Shuffle the offers array
    for (let i = shuffledOffers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOffers[i], shuffledOffers[j]] = [shuffledOffers[j], shuffledOffers[i]];
    }

    // Ensure there are offers for all days of the week by repeating shuffled offers if necessary
    const dailyOffers = [...shuffledOffers, ...shuffledOffers].slice(0, 14);

    // Set the offers for today
    setTodayOffers(dailyOffers.slice(today * 2, today * 2 + 2));
  };

  const handleApply = (offer) => {
    setSelectedCategory(offer.category);
    onApplyCoupon(offer);
  };

  return (
    <div className="coupon-container">
      <h1 className="coupon-title">
        Today's Coupon Promotions
        <button className="close-button" onClick={onClose}>
          <CloseIcon />
        </button>
      </h1>
      
      {selectedCategory ? (
        <FoodDisplay category={selectedCategory} onClose={onClose} />
      ) : (
        todayOffers.map((offer, index) => (
          <div key={index} className="coupon-offer-container">
            <p className="coupon-offer">{offer.discount}</p>
            <button className="apply-button" onClick={() => handleApply(offer)}>
              Apply
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewPromotions;