import React, { useState, useEffect } from 'react';
import './ProceedCheckOut.css';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

const ProceedCheckOut = ({ closeModal, darkTheme }) => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    
    console.log('Received closeModal prop:', closeModal); // Log the prop
  }, [closeModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv,
    });
    setCardNumber('');
    setCardHolderName('');
    setExpiryDate('');
    setCvv('');
    closeModal();
  };

  return (
    <div className={`proceed-checkout-container1 ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <h2>{t("Payment Details")}</h2><br />
      <button className="close-button" onClick={closeModal}>
        <CloseIcon className="close-button-icon" />
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("Card Number:")}</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter card number"
            required
          />
        </div>
        <div>
          <label>{t("Cardholder Name:")}</label>
          <input
            type="text"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            placeholder="Enter cardholder name"
            required
          />
        </div>
        <div>
          <label>{t("Expiry Date:")}</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YYYY"
            required
          />
        </div>
        <div>
          <label>{t("CVV:")}</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Enter CVV"
            required
          />
        </div>
        <div className='submitbtn'>
          <button type="submit">{t("Submit Payment")}</button>
        </div>
      </form>
    </div>
  );
};

export default ProceedCheckOut;
