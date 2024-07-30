import React, { useContext, useState, useEffect } from 'react';
import './CartNew.css';
import { StoreContext } from '../../context/StoreContextProvider';
import { useNavigate } from 'react-router-dom';
import ViewPromotions from '../../components/ViewPromotions/ViewPromotions';
import { useTranslation } from 'react-i18next';
import { OrderModeLabel } from '../../enums/OrderMode';

const CartNew = ({ selectedOrderType, hideCheckoutButton, isDarkTheme }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getTotalPriceOfCartItems, cartRestaurant, user } = useContext(StoreContext);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponError, setCouponError] = useState('');
    const [showPromotions, setShowPromotions] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [storeUID, setStoreUID] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleViewPromotions = () => {
        setShowPromotions(true);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const applyCoupon = () => {
        if (couponCode === 'SAVE10') {
            setAppliedCoupon(couponCode);
            setDiscount(10);
            setCouponError('');
        } else {
            setAppliedCoupon('');
            setDiscount(0);
            setCouponError('Invalid coupon code');
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(itemId, newQuantity);
        }
    };
    const [selectedPizza, setSelectedPizza] = useState(null);
    const handleEdit = (pizza) => {
        // Set selected pizza and price state
        setSelectedPizza(pizza);
        // Navigate to CustomizePizza with state
        navigate('/CustomizePizza', { state: { selectedPizza: pizza, price: pizza.price } });
        console.log("edit",pizza)
    };

    const calculateItemTotal = (item) => {
        if (item.type === 'pizza') {
            return item.price && item.quantity ? item.price * item.quantity : 0;
        } else if (item.type === 'halfAndHalfPizza') {
            const totalPriceLeft = item.leftPizza.price * item.quantity;
            const totalPriceRight = item.rightPizza.price * item.quantity;
            return totalPriceLeft + totalPriceRight;
        } else {
            return 0;
        }
    };

    const calculateTotalWithDiscount = () => {
        const totalPrice = getTotalPriceOfCartItems();
        return totalPrice - discount;
    };

    const handleApplyPromotion = (offer) => {
        const discountAmount = parseFloat(offer.discount.match(/[\d.]+/)[0]);
        setDiscount(discountAmount);
        setShowPromotions(false);
    };

    const renderIngredient = (ingredient, customizations) => {
        return ingredient.split(',').map((item, index) => {
            const [name, customization] = item.split(' (');
            const customizationText = customization ? customization.replace(')', '') : '';
            const isRedText = customizationText === 'Light' || customizationText === 'Extra';
            return (
                <span key={index}>
                    <span className="green-text">{name}</span>
                    {customizationText && (
                        <span className={isRedText ? 'red-text' : ''}> ({customizationText})</span>
                    )}
                </span>
            );
        });
    };

    const total = calculateTotalWithDiscount();

    return (
        <div className={`cart-container ${isDarkTheme ? 'dark-theme' : ''}`}>
            <div className="cart-container-inner">
                <h2>My Cart</h2>
                {cartRestaurant && (
                    <div className="selected-restaurant">
                        <h3>Selected Restaurant:</h3>
                        <p>{cartRestaurant.BusinessName}</p>
                    </div>
                )}
                {selectedOrderType !== null ? (
                    <div className="selected-order-type">
                        <h3>Order Type:</h3>
                        <p>{OrderModeLabel[selectedOrderType]}</p>
                    </div>
                ) : (
                    <p>No Order Type Selected</p>
                )}
                <hr />
                <div className="cart-items">
                {cart && cart.map((item, index) => (
  <div key={index} className="cart-item">
    <div className="cart-item-top">
      <p>{item.size} - {item.name}</p><br />
      {item.meat && <p>{renderIngredient(item.meat)}</p>}
      {item.vegetable && <p>{renderIngredient(item.vegetable)}</p>}
      <p>${(item.price * item.quantity).toFixed(2)}</p>
    </div>

    <div className="cart-item-bottom">
      <p>Quantity:</p>
      <select
        value={item.quantity}
        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
        className="quantity-select"
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <span
        className="cart-item-action"
        style={{ color: 'darkred', cursor: 'pointer', marginLeft: '10px' }}
        onClick={() => handleEdit(item)}
      >
        Edit
      </span>
      <span
        className="cart-item-action"
        style={{ color: 'darkred', cursor: 'pointer', marginLeft: '10px' }}
        onClick={() => {
          console.log('Removing item with index:', index);
          removeFromCart(index); // Use index to remove item
        }}
      >
        Remove
      </span>
    </div>
    <hr />
  </div>
))}

                </div>

                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className='cart-total-details'>
                            <p>SubTotal</p>
                            <p>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <p>Tax</p>
                            <p>$0.02</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <b>Total</b>
                            <b>${total.toFixed(2)}</b>
                        </div>
                        <a href="/promotions" className="promotions-link">Current Promotions</a>
                        {showPromotions && <ViewPromotions onClose={() => setShowPromotions(false)} onApplyCoupon={handleApplyPromotion} />}
                        <div className="cart-promocode-input">
                            <input type="text" placeholder='Enter coupon code' value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                            <button onClick={applyCoupon}>Apply</button>
                            {couponError && <p className="coupon-error">{couponError}</p>}
                        </div>
                    </div>
                    {!hideCheckoutButton && (
                        <button onClick={() => navigate('/PlaceOrder')}>PROCEED TO CHECKOUT</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartNew;
