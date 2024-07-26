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
import { Button, FormControl, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    cartRestaurant,
  } = useContext(StoreContext);

  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [promotionApplied, setPromotionApplied] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customizedPrice, setCustomizedPrice] = useState(0);
  const [selectedFoodItemId, setSelectedFoodItemId] = useState(null);
  const [size, setSize] = useState('Medium');
  const [quantities, setQuantities] = useState({});
  const [ingredientNames, setIngredientNames] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setTotalPrice(getTotalPriceOfCartItems());
  }, [feistyProducts, beverages, appetizers, extras, cart]);

  useEffect(() => {
    const fetchIngredients = async (ids) => {
      const names = {};
      const uniqueIds = [...new Set(ids)]; // Ensure unique IDs
    
      try {
        // Fetch data for the first ID to get all products
        const response = await axios.get(`https://test.tandooripizza.com/Online/OnlineHome/GetData?id=${uniqueIds[0]}`);
        const products = response.data.Products || [];
    
        // Create a map for quick lookup
        const productMap = {};
        products.forEach(product => {
          productMap[product.Id] = product.Name; // Adjust based on actual field names
        });
    
        // Map ingredient IDs to product names
        uniqueIds.forEach(id => {
          if (productMap[id]) {
            names[id] = productMap[id];
          } else {
            console.warn(`No product found for ID ${id}`);
          }
        });
        
        setIngredientNames(names);
      } catch (error) {
        console.error(`Error fetching ingredients:`, error);
      }
    };
    
    const allIngredientIds = new Set();
  feistyProducts.forEach(item => {
    item.DefaultIncrediantIds.forEach(id => allIngredientIds.add(id));
    item.FixIncrediantIds.forEach(id => allIngredientIds.add(id));
  });

  fetchIngredients([...allIngredientIds]);
}, [feistyProducts]);
  
  const toggleCustomizeForm = (item) => {
    setSelectedPizza(item);
    setShowCustomizeForm(!showCustomizeForm);
    setCustomizedPrice(null);
    setSelectedFoodItemId(item.Id);
  };

  const handleApplyPromotion = () => {
    setPromotionApplied(true);
  };

  const handleAddToCart = (item, isPizza = false) => {
    if (isPizza) {
      addPizzaToCart(item);
    } else {
      addItemToCart(item);
    }
  };

  const addPizzaToCart = (item) => {
    const quantity = quantities[item.Id] || 1;
    const itemToAdd = {
      ...item,
      name: item.Name,
      size,
      quantity,
      price: item.LargePrice,
    };
    addToCart(itemToAdd);
  };

  const addItemToCart = (item) => {
    const quantity = quantities[item.Id] || 1;
    const itemToAdd = {
      ...item,
      name: item.Name,
      quantity,
      price: item.Cost,
    };
    addToCart(itemToAdd);
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));
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
    const renderFoodItemOptions = (item, isPizza = false) => (
      <div className="food-item-options">
        {isPizza && (
          <FormControl fullWidth >
            <label htmlFor="size" className="input-label">{t('Size')}</label>
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
        )}
        <FormControl fullWidth >
          <label htmlFor="quantity" className="input-label">{t('Quantity')}</label>
          <Select
            id="quantity"
            value={quantities[item.Id] || 1}
            onChange={(e) => handleQuantityChange(item.Id, parseInt(e.target.value))}
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
          {isPizza && (
            <Button
              variant="contained"
              className="customize-button"
              onClick={() => toggleCustomizeForm(item)}
              style={{ margin: '0 10px 10px 0' }}
            >
              {t('Customize')}
            </Button>
          )}
          <Button
            variant="contained"
            className="add-to-cart-button"
            onClick={() => handleAddToCart(item, isPizza)}
            style={{ margin: '0 10px 10px 0' }}
          >
            {t('Add To Cart')}
          </Button>
        </div>
      </div>
    );

    const renderFoodItems = (items, isPizza = false) => (
      items.map((item) => (
        <div className={`food-item ${selectedFoodItemId === item.Id ? 'selected' : ''}`} key={item.Id}>
          <FoodItem
            key={item.Id}
            id={item.Id}
            name={item.Name}
            description={item.Description}
            price={isPizza && item.Id === selectedPizza?.Id && customizedPrice !== null ? customizedPrice : item.Cost}
            image={item.Image}
            showAddToCartButton={!isPizza}
            isFeisty={isPizza}
          />
          <div>
            {item.DefaultIncrediantIds.length > 0 && (
              <p>
              Incrediants: {item.DefaultIncrediantIds.map(id => ingredientNames[id]).join(', ')}
              </p>
            )}
            {item.FixIncrediantIds.length > 0 && (
              <p>
                {item.FixIncrediantIds.map(id => ingredientNames[id]).join(', ')}
              </p>
            )}
          </div>
          {renderFoodItemOptions(item, isPizza)}
        </div>
      ))
    );

    switch (category) {
      case 'Beverages':
        return renderFoodItems(beverages);
      case 'Appetizers':
        return renderFoodItems(appetizers);
      case 'Extras':
        return renderFoodItems(extras);
      default:
        return renderFoodItems(feistyProducts, true);
    }
  };

  return (
    <div className="container">
      <div className="cart-container">
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
