// TakeOut.jsx
import React, { useState } from 'react';
import { Button, Modal, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './TakeOut.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const TakeOut = ({ onClose, onContinue }) => {
  const [pickupTime, setPickupTime] = useState('');
  const [open, setOpen] = useState(true);
  const navigate=useNavigate();

  const handlePickupTimeChange = (e) => {
    setPickupTime(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    onClose(); // Close the modal
  };

  const handleContinue = () => {
    onClose(); // Close the modal
     // Call the onContinue function
    navigate('/FoodDisplay')
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
        <div className="takeout-modal">
          <div className="modal-header">
            <Button onClick={handleClose} className="close-button">
              <CloseIcon />
            </Button>
          </div>
          <div className="modal-content">
            <h2>Take Out</h2><br />
            <div className="form-group">
              <label htmlFor="pickupTime">Pickup Time:</label>
              <input type="time" id="pickupTime" value={pickupTime} onChange={handlePickupTimeChange} />
            </div>
            <Button onClick={handleContinue} variant="contained" className="continue-button">Continue</Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default TakeOut;
