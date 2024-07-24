import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/navbar/Navbar.jsx';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Cart from './pages/cart/Cart.jsx';
import Footer from './components/footer/Footer.jsx';
import RegisterPopup from './components/login/RegisterPopup.jsx'; // Adjusted import path
import PlaceOrder from './pages/placeOrder/PlaceOrder.jsx';
import CustomizeForm from './components/customize/CustomizeForm.jsx';
import HalfAndHalfPizza from './components/HalfAndHalf/HalfAndHalfPizza.jsx';
import OrderType from './components/Order Type/OrderType.jsx';
import ScrollButton from './ScrollButton.jsx';
import Delivery from './components/Order Type/Delivery.jsx';
import TakeOut from './components/Order Type/TakeOut.jsx';
import DineIn from './components/Order Type/DineIn.jsx';
import ProceedCheckout from './pages/ProceedCheckOut/ProceedCheckOut.jsx';
import TermsAndConditions from './pages/TermsAnd Conditions/TermsAndCondition.jsx';
import GeoLocation from './components/Order Type/GeoLocation.jsx';
import PreviousOrder from './components/Order Type/PreviousOrder/PreviousOrder.jsx';
import ViewPizzaPromotion from './components/ViewPromotions/ViewPizzaPromotion.jsx';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon
import { ThemeProvider } from './components/Theme/ThemeContext.js';
import DarkMode from './components/Theme/DarkMode.jsx';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector.js';
import CartNew from './pages/cart/CartNew.jsx'; 
import ExploreMenu from './components/ExploreMenu/ExploreMenu.jsx';
import FoodDisplay from './components/foodDisplay/FoodDisplay.jsx';
import LoginModal from './components/login/LoginModal.jsx'; // Ensure LoginModal is imported
import ViewOrderDetails from './components/Order Type/PreviousOrder/ViewOrderDetails.jsx';
import RestaurantList from './pages/location/RestaurantList.jsx';



function App() {
  const [showLogin, setShowLogin] = useState(false); // State to manage RegisterPopup or LoginPopup visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Adjust authentication state as needed
  const navigate = useNavigate();
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [showHalfAndHalfPizza, setShowHalfAndHalfPizza] = useState(false);
  const [isHalfAndHalfPizzaOpen, setIsHalfAndHalfPizzaOpen] = useState(false);
  const [orderType, setOrderType] = useState(null);
  

  const handleOrderTypeChange = (orderType) => {
    setOrderType(orderType);
    setSelectedOrderType(orderType);
    console.log('Order Type Selected:', orderType);
  };
  const handleCloseHalfAndHalfPizza = () => {
    setIsHalfAndHalfPizzaOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false); // Close the login popup after successful login
    // Redirect the user to the OrderType page after login
    navigate('/OrderType');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAuthenticated(false); // Reset authenticated state
    localStorage.removeItem('authToken'); 
    //setSelectedOrderType(''); // Reset selected order type on logout
    navigate('/'); // Redirect to the homepage after logout
  };

  

  const handleContinue = () => {
    navigate('/OrderType');
  };

  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(prevTheme => !prevTheme);
  };

  const pastOrders = [
    {
      date: '2024-05-01',
      total: 25.5,
      items: [
        { name: 'Pizza', price: 12.5 },
        { name: 'Salad', price: 8 },
        { name: 'Drink', price: 5 },
      ],
    },
    {
      date: '2024-04-28',
      total: 18,
      items: [
        { name: 'Burger', price: 10 },
        { name: 'Fries', price: 5 },
        { name: 'Drink', price: 3 },
      ],
    },
  ];

  const handleSelect = (newSelectedPizza) => {
    setSelectedPizza(newSelectedPizza);
  };

  return (
    <ThemeProvider>
      {showLogin && <RegisterPopup setShowLogin={setShowLogin} onLoginSuccess={handleLoginSuccess} />}
      <div className={`app ${darkTheme ? "dark-theme" : "light-theme"}`}>
        <div className="top-right-corner">
          <LanguageSelector />
          <button className='theme-button' onClick={toggleTheme}>
            {darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
          </button>
        </div> 
        <Navbar setShowLogin={setShowLogin} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        {isHalfAndHalfPizzaOpen && (
          <HalfAndHalfPizza handleCloseHalfAndHalfPizza={handleCloseHalfAndHalfPizza} selectedPizza={selectedPizza} />
        )}
        <Routes>
          <Route path='/' element={<RestaurantList/>}/>
          <Route path="/Home" element={<Home />} />
          <Route path="/Cart" element={<Cart selectedOrderType={selectedOrderType} darkTheme={darkTheme} />} />
          <Route path='/CartNew' element={<CartNew  selectedOrderType={selectedOrderType}/>} />
          <Route path='/OrderType' element={<OrderType onOrderTypeChange={handleOrderTypeChange} />}/>
          <Route path="/FoodDisplay" element={<FoodDisplay selectedOrderType={selectedOrderType} category={'FeistyProducts'} />} />
          <Route path='/RegisterPopup' element={<RegisterPopup onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path="/order/:orderID"  element={<ViewOrderDetails/>}/>
          <Route path="/LoginModal" element={<LoginModal onLoginSuccess={handleLoginSuccess} />} /> {/* Adjust the route path for LoginModal */}
          <Route path='/' element={<ExploreMenu />} />
          <Route path="/PlaceOrder" element={<PlaceOrder />} />
          <Route path="/CustomizePizza" element={<CustomizeForm onSelect={handleSelect} />} />
          
          <Route path="/ExploreMenu" element={<ExploreMenu />} />
          <Route path="/ScrollButton" element={<ScrollButton />} />
          <Route path="/Delivery" element={<Delivery onContinue={handleContinue} />} />
          <Route path="/TakeOut" element={<TakeOut />} />
          <Route path="/DineIn" element={<DineIn />} />
          <Route path="/ProceedCheckout" element={<ProceedCheckout darkTheme={true} />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/GeoLocation" element={<GeoLocation />} />
          <Route path="/PreviousOrder" element={<PreviousOrder pastOrders={pastOrders} />} />
         
         
        </Routes>
      </div>
      <Footer />
      <DarkMode darkTheme={darkTheme} toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}

export default App;
