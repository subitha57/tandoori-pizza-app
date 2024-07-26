import React, { useContext, useEffect, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContextProvider';
import { useNavigate } from 'react-router-dom'; 
import defaultPizzaImage from '../../assets/Plain.png';

const FoodItem = ({
  id,
  name,
  price,
  description,
  image,
  darkTheme,
  customizationOptions,
  showAddToCartButton,
  SizeCategoryId
}) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const { cartItems, addToCart, removeFromCart, user, cartRestaurant } = useContext(StoreContext);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('authToken') !== null;

  useEffect(() => {
    const existingCartItem = cartItems[id];
    setIsAddedToCart(!!existingCartItem);
    setCartItem(existingCartItem);
  }, [cartItems, id]);

  useEffect(() => {
    if (SizeCategoryId) {
      fetchSizes(SizeCategoryId);
    }
  }, [SizeCategoryId]);

  const fetchSizes = async (SizeCategoryId) => {
    try {
      const response = await fetch(`https://your-api-endpoint.com/sizes?SizeCategoryId=${SizeCategoryId}`);
      const data = await response.json();
      setSizes(data);
      setSelectedSize(data[0]);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const handleAddToCart = () => {
   

    addToCart({
      id,
      name,
      price,
      description,
      image: image || defaultPizzaImage,
      quantity,
      size: selectedSize,
      ...customizationOptions,
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(id);
  };

  const dynamicPrice = cartItem ? cartItem.quantity * price : price;

  return (
    <div className='food-item'>
      <div className='food-item-image-container'>
        <img className='food-item-image' src={image || defaultPizzaImage} alt={name} />
        {/*{showAddToCartButton && (
          !isAddedToCart ? (
            <img
              className='add'
              onClick={handleAddToCart}
              src={assets.add_icon_white}
              alt="Add to cart"
            />
          ) : (
            <div className='food-item-counter'>
              <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="Remove from cart" />
              <p>{cartItem.quantity}</p>
              <img onClick={handleAddToCart} src={assets.add_icon_green} alt="Add to cart" />
            </div>
          )
        )}*/}
      </div>
      <div className='food-item-info'>
        <div className='food-item-name-rating'>
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
      </div>
      <p className={`food-item-desc ${darkTheme ? 'light-input' : 'dark-input'}`}>{description}</p>
    
    </div>
  );
};

export default FoodItem;
