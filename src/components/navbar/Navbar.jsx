import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContextProvider';
import LoginModal from '../login/LoginModal';
import { useTranslation } from 'react-i18next';

const Navbar = ({ darkMode }) => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount } = useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('authToken') !== null);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    const fetchSelectedRestaurant = () => {
      const restaurant = localStorage.getItem('selectedRestaurant');
      if (restaurant) {
        setSelectedRestaurant(JSON.parse(restaurant));
      }
    };

    fetchSelectedRestaurant();
  }, []);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('authToken') !== null);
    setUsername(localStorage.getItem('username') || '');
  }, [localStorage.getItem('authToken')]);

  const handleSignIn = () => {
    setShowLogin(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('selectedRestaurant');
    setIsAuthenticated(false);
    setUsername('');
    setSelectedRestaurant(null);
  };

  const handleLoginSuccess = (authToken, restaurant) => {
    localStorage.setItem('authToken', authToken);
    if (restaurant) {
      localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
    }
    setIsAuthenticated(true);
    setUsername(localStorage.getItem('username'));
    setShowLogin(false);
    navigate('/'); // Redirect to home or desired route
  };

  return (
    <div className={`navbar ${darkMode ? 'dark-mode' : ''}`}>
      <Link to='/' className='navbar-title'>
        <h1>{t("Tandoori Pizza")}</h1>
      </Link>
      {selectedRestaurant && location.pathname !== '/' && (
        <div className="restaurant-address">
          <p>{selectedRestaurant.BusinessAddress1}</p>
        </div>
      )}
      <ul className='navbar-menu'>
        {isAuthenticated && (
          <Link to='/PreviousOrder' className='past-orders-link' onClick={() => setMenu('previous-order-page')}>
            {t("PastOrders")}
          </Link>
        )}
      </ul>
      <div className='navbar-right'>
        {isAuthenticated ? (
          <button onClick={handleSignOut}>{t("Sign Out")}</button>
        ) : (
          null
        )}
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default Navbar;
