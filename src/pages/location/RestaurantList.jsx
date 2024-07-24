import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './LocationDummy.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContextProvider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const RestaurantList = () => {
  const { setCartRestaurant } = useContext(StoreContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await axios.post('https://test.tandooripizza.com/api/online/stores', {});
        setStores(response.data.Data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the store data', error);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSelectRestaurant = (restaurant) => {
    setCartRestaurant(restaurant);
    localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
    console.log('Selected Restaurant:', restaurant); // Ensure this logs the correct restaurant object
  };

  const handleOrderNow = (e, restaurant) => {
    e.stopPropagation();
    handleSelectRestaurant(restaurant);
    navigate(`/LoginModal?restaurantName=${encodeURIComponent(restaurant.BusinessName)}`);
  };

  return (
    <div className={`dummy-container ${darkMode ? 'dark-mode' : ''}`}>
      {loading && (
        <Box className="loader-container">
          <Box className="loader-box">
            <CircularProgress />
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Loading...
            </Typography>
          </Box>
        </Box>
      )}

      <h1>Order Now</h1><br/>
      <div className="restaurant-container">
        {stores.map((store) => (
          <div className="restaurant-item" key={store.ID} onClick={() => handleSelectRestaurant(store)}>
            <h3>{store.BusinessName}</h3>
            <p>{store.BusinessAddress1}<br />
              {store.LandlineNumber}</p>
            <p>Latitude: {store.Latitude}, Longitude: {store.Longitude}</p>
            <Button
              variant="contained"
              color="primary"
              className="order-btn"
              onClick={(e) => handleOrderNow(e, store)}
              disabled={loading}
            >
              ORDER NOW
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
