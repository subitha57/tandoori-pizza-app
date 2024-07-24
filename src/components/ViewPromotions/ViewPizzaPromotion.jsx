import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContextProvider';
import FoodItem from '../foodItem/FoodItem';
import CustomizeForm from '../customize/CustomizeForm';
import './ViewPizzaPromotion.css';
import { useTheme } from '../Theme/ThemeContext'; // Import the ThemeContext

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const { darkTheme } = useTheme(); // Get the current theme from the context
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [applyPromotion, setApplyPromotion] = useState(false);

  const toggleCustomizeForm = (item) => {
    setSelectedPizza(item);
    setShowCustomizeForm(!showCustomizeForm);
  };

  const handleApplyPromotion = () => {
    const achariGobhiPizza = food_list.find(item => item.name === 'Achari Gobhi');
    if (achariGobhiPizza) {
      setSelectedPizza(achariGobhiPizza);
      setApplyPromotion(true);
      setShowCustomizeForm(true);
    }
  };

  return (
    <div className={`promotion ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <h2>View Current Promotions</h2>
       <div className='food-display-list'>
        {food_list.map((item, index) => {
          if (category === 'All' || category === item.category) {
            return (
              <div className='food-item' key={index}>
                <FoodItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={applyPromotion ? (item.price * 0.9).toFixed(2) : item.price}
                  image={item.image}
                />
                {category === 'Pizza' && (
                  <button className='customize-button' onClick={() => toggleCustomizeForm(item)}>
                    Customize Pizza
                  </button>
                )} 
              </div>
            );
          }
          return null;
        })} 
      </div>
      {showCustomizeForm && (
        <CustomizeForm
          selectedPizza={selectedPizza}
          foodList={food_list}
          applyPromotion={applyPromotion}
          onClose={() => setShowCustomizeForm(false)}
          isVisible={showCustomizeForm}
        />
      )}
      <div className="apply-promotion-container">
        {!applyPromotion && (
          <button className="apply-promotion-button" onClick={handleApplyPromotion}>
            Apply Promotion
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
