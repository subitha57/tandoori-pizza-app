import React, { useState } from 'react';
import { Button, Modal, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import './Delivery.css'; // Import your CSS file

const Delivery = ({ onClose, closeOrderType }) => {
  const [address, setAddress] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [orderHour, setOrderHour] = useState('');
  const [orderMinute, setOrderMinute] = useState('');
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleOrderTimeChange = (e) => {
    setOrderTime(e.target.value);
  };

  const handleOrderDateChange = (e) => {
    setOrderDate(e.target.value);
  };

  const handleOrderHourChange = (e) => {
    setOrderHour(e.target.value);
  };

  const handleOrderMinuteChange = (e) => {
    setOrderMinute(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    onClose(); // Close the modal
  };

  const handleContinue = () => {
    handleClose(); // Close the modal
    closeOrderType();
    navigate('/FoodDisplay'); // Navigate to the home page
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="delivery-modal">
          <div className="modal-header">
            <Button onClick={handleClose} className="close-button">
              <CloseIcon />
            </Button>
          </div>
          <div className="modal-content">
            <h2>Delivery</h2><br />
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" value={address} onChange={handleAddressChange} />
            </div>
            <hr />
            <div className="form-group">
              <label htmlFor="orderDate">Order Date:</label>
              <input type="date" id="orderDate" value={orderDate} onChange={handleOrderDateChange} />
            </div>
            <div className="form-group">
              <label htmlFor="orderTime">Order Time:</label>
              <input type="time" id="orderTime" value={orderTime} onChange={handleOrderTimeChange} />
            </div>
           
            <Button onClick={handleContinue} variant="contained" className="continue-button">Continue</Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default Delivery;
