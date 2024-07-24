import React, { useState,useContext } from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OrderMode, OrderModeLabel } from '../../enums/OrderMode'; // Adjust the import path as necessary
import { StoreContext } from '../../context/StoreContextProvider';

const OrderType = ({ onOrderTypeChange }) => {
 
  const navigate = useNavigate();
  const { selectedOrderType, setSelectedOrderType } = useContext(StoreContext);

  const handleOrderTypeClick = (orderMode) => {
    setSelectedOrderType(orderMode);
    onOrderTypeChange(orderMode);
    navigate('/Home'); // Navigate to the home page
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '70vh', backgroundColor: '#antikwhite' }} // Adjust background color here
    >
      <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
        <h2>Select Order Type</h2><br/><br/>
        <Grid container spacing={4} justifyContent="center">
          {Object.keys(OrderMode).map((key) => {
            const orderMode = OrderMode[key];
            const isSelected = selectedOrderType === orderMode;

            return (
              <Grid item key={orderMode}>
                <Box
                  onClick={() => handleOrderTypeClick(orderMode)}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: isSelected ? 'blue' : 'grey.300',
                    color: isSelected ? 'white' : 'black',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    textAlign: 'center',
                    boxShadow: isSelected ? '0px 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
                    '&:hover': {
                      bgcolor: isSelected ? 'blue' : 'grey.400',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {OrderModeLabel[orderMode]}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};

export default OrderType;
