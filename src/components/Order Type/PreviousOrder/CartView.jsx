import React, { useContext, useState, useEffect } from 'react';
import './CartView.css';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContextProvider';
import { useNavigate } from 'react-router-dom';
import ViewPromotions from '../../ViewPromotions/ViewPromotions';
import { useTranslation } from 'react-i18next';

const CartNew = ({ selectedOrderType }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cart, removeFromCart, getTotalPriceOfCartItems, cartRestaurant, user } = useContext(StoreContext);
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

    const handleProceedToCheckout = async () => {
       
        const orderData = {
            userName: user?.userName || null,
      email: user?.email || null,
      phoneNumber: user?.phoneNumber || null,
      address: user?.address || null,
      promoID: 0,
      discount: 0,
      items: cart.map(item => ({
        isHybrid: false,
        name: item.name,
        productId: item.id,
        quantity: item.quantity,
        cost: item.price,
        items: (item.toppings || []).map(topping => ({
          id: topping.id,
          isHybrid: false,
          name: topping.name,
          productId: topping.productId,
          quantity: topping.quantity,
          cost: topping.cost,
          items: [],
          isPizza: false,
          isNo: topping.isNo,
          isExtra: topping.isExtra,
          isRegular: topping.isRegular,
          size: topping.size,
          topCat: topping.topCat,
          subCat: topping.subCat
        })),
        isPizza: item.isPizza,
        isNo: item.isNo,
        isExtra: item.isExtra,
        isLight: item.isLight,
        isRegular: item.isRegular,
        isSubstitude: item.isSubstitude,
        size: item.size,
        topCat: item.topCat,
        subCat: item.subCat,
        crust: item.crust,
        crustprice: item.crustprice
      })),
      deliveryCharges: 0,
      paymentMethod: null,
      payments: [],
      amountDue: 0,
      paid: 0,
      mode: 0,
      appliedCredits: 0,
      remainingCredits: 0,
      customerCredits: 0,
      comments: cart.map(item => ({
        type: 0,
        itemId: `pizza-${item.id}`
      })),
      taxExempt: false,
      waitTime: 15,
      gratuity: 0,
      creditApplied: false,
      futureOrder: false,
      subtotal: cart.reduce((acc, item) => acc + item.price, 0),
      total: cart.reduce((acc, item) => acc + item.price, 0) , 
      storeUID: 2270
        };

        try {
            const response = await axios.post('https://test.tandooripizza.com/api/online/order/save', orderData);
            if (response.status === 200) {
                // Order saved successfully
                console.log('Order saved:', response.data);
               navigate('/ProceedCheckOut')
            } else {
                console.error('Failed to save order:', response.data);
            }
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0) - discount ;

    return (
        <div className="cart-container" style={{ border: '3px solid black', padding: '10px', backgroundColor: 'white' }}>
            <h2 style={{ textAlign: 'center' }}>My Cart</h2><br />
            {cartRestaurant && (
                <div className="selected-restaurant">
                    <h3>Selected Restaurant:</h3>
                    <p>{cartRestaurant.BusinessName}</p>
                </div>
            )}<br />
          
            {/*{username ? (
                <div className="logged-in-user">
                    <h3>Logged in as:</h3>
                    <p>{username}</p>
                </div>
            ) : (
                <div className="logged-out-user">
                    <p>{t("Not logged in")}</p>
                </div>
            )}*/}
            <br />
            <div className="cart-items">
                <div className="cart-items-title">
                    <p style={{ flex: 3 }}>{t("Title")}</p>
                    <p style={{ flex: 1, textAlign: 'center' }}>{t("Quantity")}</p>
                    <p style={{ flex: 1, textAlign: 'right' }}>{t("Total")}</p>
                    <p style={{ flex: 1, textAlign: 'right' }}>{t("Remove")}</p>
                </div>
                <br />
                <hr />
                {cart && cart.map((item, itemId) => {
                    return (
                        <div key={itemId}>
                            <div className='cart-items-title cart-items-item'>
                                <div className="cart-item-details" style={{ flex: 3 }}>
                                    <p>{item.name}</p>
                                    {item.size && <p>{t("Size")}: {item.size}</p>}
                                    {item.crust && <p>{t("Crust")}: {item.crust}</p>}
                                    {item.sauce && <p>{t("Sauce")}: {item.sauce}</p>}
                                    {item.cheese && <p>{t("Cheese")}: {item.cheese}</p>}
                                </div>
                                <p style={{ flex: 1, marginRight: '10px', textAlign: 'center' }}>No:{item.quantity}</p>
                                <p style={{ flex: 1, textAlign: 'right' }}> $.{(item.price * item.quantity).toFixed(2)}</p>
                                <p style={{ flex: 1, textAlign: 'right' }} onClick={() => removeFromCart(itemId)} className='cross'>X</p>
                            </div>
                            <hr />
                        </div>
                    );
                })}
            </div>

            <div className='cart-bottom'>
                <div className="cart-total">
                    <h2>{t("Cart Total")}</h2>
                    <div>
                        <div className='cart-total-details'>
                            <p>{t("SubTotal")}</p>
                            $. {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <p>{t("Discount")}</p>
                            <p>$.{discount}</p>
                        </div>
                        <hr />
                       {/* <div className='cart-total-details'>
                            <p>{t("Delivery Fee")}</p>
                            <p>$.{getTotalPriceOfCartItems() === 0 ? 0 : 2}</p>
                        </div>*/}
                        <hr />
                        <div className='cart-total-details'>
                            <b>{t("Total")}</b>
                            <b>$.{total.toFixed(2)}</b>
                        </div>
                       
                    </div>
                    <button onClick={handleProceedToCheckout}>{t("PROCEED TO CHECKOUT")}</button>
                </div>
            </div>
        </div>
    );
};

export default CartNew;
