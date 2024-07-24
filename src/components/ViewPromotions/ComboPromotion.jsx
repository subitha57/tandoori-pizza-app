// src/CouponPromotions.js
import React, { useState, useEffect } from 'react';

const offers = [
  { type: 'small', discount: '1% off any small pizzas' },
  { type: 'medium', discount: 'Rs.2 off any medium pizzas' },
  { type: 'large', discount: 'Rs.3 off any large pizzas' },
  { type: 'x-large', discount: 'Rs.4 off any x-large pizzas' },
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CouponPromotions = () => {
  const [dailyOffers, setDailyOffers] = useState([]);

  useEffect(() => {
    shuffleAndSetOffers();
  }, []);

  const shuffleAndSetOffers = () => {
    const shuffledOffers = [...offers];
    for (let i = shuffledOffers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOffers[i], shuffledOffers[j]] = [shuffledOffers[j], shuffledOffers[i]];
    }

    // Ensure we have offers for 7 days by repeating the shuffled array if needed
    setDailyOffers([...shuffledOffers, ...shuffledOffers].slice(0, 7));
  };

  return (
    <div>
      <h1>Weekly Coupon Promotions</h1>
      <ul>
        {dailyOffers.map((offer, index) => (
          <li key={index}>
            <strong>{daysOfWeek[index]}:</strong> {offer.discount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CouponPromotions;
