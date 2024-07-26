import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@mui/material';

const ExploreMenu = ({ setCategory, category, isDarkTheme }) => {
  const { t } = useTranslation();

  return (
    <div className={`explore-menu ${isDarkTheme ? 'dark-theme' : ''}`} id='explore-menu'>
     
     
      <div className="sticky-container">
        <ButtonGroup 
          variant="contained" 
          color="primary" 
          className='explore-menu-list'
          size="large"
        >
          {menu_list.map((item, index) => (
            <Button
              key={index}
              onClick={() => setCategory(item.menu_name)}
              className={`menu-button ${category === item.menu_name ? "active" : ""} ${isDarkTheme ? 'dark-button' : ''}`}
              sx={{
                padding: '20px 48px', 
                fontSize: '16px'
              }}
            >
              {item.menu_name}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
