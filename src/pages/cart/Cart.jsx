import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContextProvider';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ViewPromotions from '../../components/ViewPromotions/ViewPromotions';
import { useTranslation } from 'react-i18next';

const Cart = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cart, removeFromCart, getTotalPriceOfCartItems, applyOffer } = useContext(StoreContext);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponError, setCouponError] = useState('');
    const [showPromotions, setShowPromotions] = useState(false);
    const [discount, setDiscount] = useState(0);

    console.log("cart items", cart)
    const handleViewPromotions = () => {
        setShowPromotions(true);
    };

    const applyCoupon = () => {
        // Simulated coupon code validation
        if (couponCode === 'SAVE10') {
            setAppliedCoupon(couponCode);
            setDiscount(10); // Assuming the discount is Rs. 10 for the SAVE10 coupon
            setCouponError('');
        } else {
            setAppliedCoupon('');
            setDiscount(0);
            setCouponError('Invalid coupon code');
        }
    };

    const calculateItemTotal = (item) => {
        if (item.type === 'pizza') {
            // Calculate total for regular pizza
            return item.price && item.quantity ? item.price * item.quantity : 0;
        } else if (item.type === 'halfAndHalfPizza') {
            // Calculate total for half and half pizza
            const totalPriceLeft = item.leftPizza.price * item.quantity;
            const totalPriceRight = item.rightPizza.price * item.quantity;
            return totalPriceLeft + totalPriceRight;
        } else {
            // Handle other types of items here
            return 0;
        }
    };

    const calculateTotalWithDiscount = () => {
        const totalPrice = getTotalPriceOfCartItems();
        return totalPrice - discount;
    };

    const handleApplyPromotion = (offer) => {
        // Apply promotion logic here
        const discountAmount = parseFloat(offer.discount.match(/[\d.]+/)[0]);
        setDiscount(discountAmount);
        setShowPromotions(false);
    };
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0) - discount + (cart.length === 0 ? 0 : 2);
    return (
        <div className="cart">
            <div className="cart-items">
                <div className="selected-order-type">
                    <p>{t("Selected Order Type:")}<span className="order-type"></span></p>
                </div><br /><br />
                <div className="cart-items-title">
                    <p>{t("Items")}</p>
                    <p>{t("Title")}</p>
                    <p>{t("Price")}</p>
                    <p>{t("Quantity")}</p>
                    <p>{t("Total")}</p>
                    <p>{t("Remove")}</p>
                </div>
                <br />
                <hr />
                {cart && cart.map((item, itemId) => {
                    return (
                        <div key={itemId}>
                            <div className='cart-items-title cart-items-item'>
                                <img src={item.image} alt={item.name} />
                                <div className="cart-item-details">
                                    <p>{item.name}</p>
                                    {item.size && <p>{t("Size")}: {item.size}</p>}
                                    {item.crust && <p>{t("Crust")}: {item.crust}</p>}
                                    {item.sauce && <p>{t("Sauce")}: {item.sauce}</p>}
                                    {item.cheese && <p>{t("Cheese")}: {item.cheese}</p>}
                                    {item.ingredients && (
                                        <>
                                            <p>{t("Ingredients")}:</p>
                                            <p>{t("Left")}: {item.ingredients.left.join(', ')}</p>
                                            <p>{t("Right")}: {item.ingredients.right.join(', ')}</p>
                                        </>
                                    )} 
                                </div>
                                <p>$.{item.price.toFixed(2)}</p>
                                <p>{item.quantity}</p>
                                <p> Rs.{(item.price * item.quantity).toFixed(2)}</p>
                                <p onClick={() => removeFromCart(itemId)} className='cross'>X</p>
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
                            Rs. {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <p>{t("Discount")}</p>
                            <p>Rs.{discount}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <p>{t("Delivery Fee")}</p>
                            <p>Rs.{getTotalPriceOfCartItems() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <b>{t("Total")}</b>
                            <b>Rs.{total.toFixed(2)}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/PlaceOrder')}>{t("PROCEED TO CHECKOUT")}</button>
                </div>

                <div className="cart-promocode">
                    <div>
                        <div className="terms-and-conditions">
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox />}
                                    label={
                                        <span>
                                            {t("I agree to the")}{' '}
                                            <Link to="/TermsAndCondition">{t("terms and conditions")}</Link>
                                        </span>
                                    }
                                />
                            </FormGroup>
                        </div>
                        <button onClick={handleViewPromotions}>{t("View Current Promotions")}</button>
                        {showPromotions && <ViewPromotions onClose={() => setShowPromotions(false)} onApplyCoupon={handleApplyPromotion} />}
                        <div className="cart-promocode-input">
                            <input type="text" placeholder={t('Enter coupon code')} value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                            <button onClick={applyCoupon}>{t("Apply")}</button>
                            {couponError && <p className="coupon-error">{couponError}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
