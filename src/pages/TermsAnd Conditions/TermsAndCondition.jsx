import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TermsAndConditionsModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">
          Terms and Conditions
        </Typography>
        <Typography variant="body2" component="p">
          {/* Add your terms and conditions text here */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit...
        </Typography>
      </Box>
    </Modal>
  );
};

export default TermsAndConditionsModal;
