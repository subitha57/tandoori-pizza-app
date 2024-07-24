import React, { useContext, useState, useEffect } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContextProvider';
import FoodItem from '../foodItem/FoodItem';
import { useTranslation } from 'react-i18next';
import CartNew from '../../pages/cart/CartNew';
import CustomizePizza from '../customize/CustomizeForm';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import navigate from react-router-dom

const FoodDisplay = ({ category }) => {
  const { t } = useTranslation();
  const {
    feistyProducts,
    beverages,
    appetizers,
    extras,
    loading,
    error,
    getTotalPriceOfCartItems,
    cart,
    selectedOrderType,
    addToCart,
    cartRestaurant, // Assuming cartRestaurant is part of the context
  } = useContext(StoreContext);

  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customizedPrice, setCustomizedPrice] = useState(0);
  const [selectedFoodItemId, setSelectedFoodItemId] = useState(null);
  const [size, setSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    setTotalPrice(getTotalPriceOfCartItems());
  }, [feistyProducts, beverages, appetizers, extras, cart]);

  const toggleCustomizeForm = (item) => {
    setSelectedPizza(item);
    setShowCustomizeForm(!showCustomizeForm);
    setCustomizedPrice(null);
    setSelectedFoodItemId(item.Id);
  };

  const handleApplyPromotion = () => {
    setPromotionApplied(true);
  };

  const handleAddToCart = (item) => {
  
      addPizzaToCart(item);
   
  };

  const addPizzaToCart = (item) => {
    const itemToAdd = {
      ...item,
      name: item.Name,
      size,
      quantity,
      price: item.LargePrice // Adjust price based on size and quantity if needed
    };
    addToCart(itemToAdd);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={200} bgcolor="lightgray" borderRadius={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={200} bgcolor="lightgray" borderRadius={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  const renderItems = () => {
    switch (category) {
      case 'Beverages':
        return beverages.map((item) => (
          <div className={`food-item ${selectedFoodItemId === item.Id ? 'selected' : ''}`} key={item.Id}>
            <FoodItem key={item.Id} id={item.Id} name={item.Name} description={item.Description} price={item.Cost} image={item.Image} showAddToCartButton={true} />
          </div>
        ));
      case 'Appetizers':
        return appetizers.map((item) => (
          <div className={`food-item ${selectedFoodItemId === item.Id ? 'selected' : ''}`} key={item.Id}>
            <FoodItem key={item.Id} id={item.Id} name={item.Name} description={item.Description} price={item.Cost} image={item.Image} showAddToCartButton={true} />
          </div>
        ));
      case 'Extras':
        return extras.map((item) => (
          <div className={`food-item ${selectedFoodItemId === item.Id ? 'selected' : ''}`} key={item.Id}>
            <FoodItem key={item.Id} id={item.Id} name={item.Name} description={item.Description} price={item.Cost} image={item.Image} showAddToCartButton={true} />
          </div>
        ));
      default:
        return feistyProducts.map((item) => (
          <div className={`food-item ${selectedFoodItemId === item.Id ? 'selected' : ''}`} key={item.Id}>
            <FoodItem
              key={item.Id}
              id={item.Id}
              name={item.Name}
              description={item.Description}
              price={item.Id === selectedPizza?.Id && customizedPrice !== null ? customizedPrice : item.LargePrice}
              image={item.Image}
              isFeisty={true}
              showAddToCartButton={false}
            />
            <div className="food-item-options">
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="size">Size</InputLabel>
                <Select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                  <MenuItem value="Extra Large">Extra Large</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="quantity">Quantity</InputLabel>
                <Select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  fullWidth
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="food-item-buttons">
                <Button
                  variant="contained"
                  className="customize-button"
                  onClick={() => toggleCustomizeForm(item)}
                  style={{ margin: '0 10px 10px 0' }}
                >
                  {t('Customize')}
                </Button>
                <Button
                  variant="contained"
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(item)}
                  style={{ margin: '0 0 10px 10px' }}
                >
                  {t('Add To Cart')}
                </Button>
              </div>
            </div>
          </div>
        ));
    }
  };

  return (
    <div className="container">
      <div className="cart-container ">
        <CartNew selectedOrderType={selectedOrderType} />
      </div>
      <div className="food-display-container">
        <div className="food-display" id="food-display">
          <h2>
            {category === 'Beverages'
              ? t('Beverages')
              : category === 'Appetizers'
              ? t('Appetizers')
              : category === 'Extras'
              ? t('Extras')
              : t('Pizza')}
          </h2>
          <div className="food-display-list">{renderItems()}</div>
          <p>Total Price: ${totalPrice}</p>
          {showCustomizeForm && selectedPizza && (
            <CustomizePizza
              selectedPizza={selectedPizza}
              foodList={feistyProducts}
              onClose={() => setShowCustomizeForm(false)}
              setPrice={setCustomizedPrice}
              isVisible={showCustomizeForm}
              promotionApplied={promotionApplied}
              setSelectedPizza={setSelectedPizza}
            />
          )}
          {!promotionApplied && (
            <button className="apply-promotion-button" onClick={handleApplyPromotion}>
              {t('Apply Promotion')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDisplay;
