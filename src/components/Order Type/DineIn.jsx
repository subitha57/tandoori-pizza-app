import React, { useState } from 'react';
import { Button, Modal, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import './DineIn.css'; // Import your CSS file

const DineIn = ({ onClose, closeOrderType }) => {
  const [reservationTime, setReservationTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleReservationTimeChange = (e) => {
    setReservationTime(e.target.value);
  };

  const handleNumberOfPeopleChange = (e) => {
    setNumberOfPeople(parseInt(e.target.value));
  };

  const handleClose = () => {
    setOpen(false);
    onClose(); // Close the modal
  };

  const handleContinue = () => {
    handleClose();
    closeOrderType();  // Close the modal
    navigate('/FoodDisplay'); // Navigate to the home page
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="dinein-modal">
          <div className="modal-header">
            <Button onClick={handleClose} className="close-button">
              <CloseIcon />
            </Button>
          </div>
          <div className="modal-content">
            <h2>Dine In</h2><br />
            <div className="form-group">
              <label htmlFor="reservationTime">Reservation Time:</label>
              <input type="time" id="reservationTime" value={reservationTime} onChange={handleReservationTimeChange} />
            </div>
            <div className="form-group">
              <label htmlFor="numberOfPeople">Number of People:</label>
              <input type="number" id="numberOfPeople" min="1" value={numberOfPeople} onChange={handleNumberOfPeopleChange} />
            </div>
            <Button onClick={handleContinue} variant="contained" className="continue-button">Continue</Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default DineIn;
