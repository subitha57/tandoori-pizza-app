import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ExploreMenu = ({ setCategory, category, isDarkTheme }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menu_name) => {
    setCategory(menu_name);
    handleClose();
  };

  return (
    <div className={`explore-menu ${isDarkTheme ? 'dark-theme' : ''}`} id='explore-menu'>
      <div className="sticky-container">
        {isMobile ? (
          <>
            <Button
              aria-controls="menu"
              aria-haspopup="true"
              onClick={handleClick}
              className={`menu-button ${isDarkTheme ? 'dark-button' : ''}`}
              startIcon={<MoreVertIcon />}
            >
              {t('Menu')}
            </Button>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
            >
              {menu_list.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleMenuItemClick(item.menu_name)}
                  className={`menu-item ${category === item.menu_name ? 'active' : ''} ${isDarkTheme ? 'dark-menu-item' : ''}`}
                >
                  {item.menu_name}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
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
                  padding: '20px 50px', 
                  fontSize: '16px'
                }}
              >
                {item.menu_name}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
