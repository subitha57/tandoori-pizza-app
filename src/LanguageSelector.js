// src/components/LanguageSelector.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import './LanguageSelector.css'

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (language) => {
    i18n.changeLanguage(language);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box >
      <LanguageIcon
        onClick={handleIconClick}
        style={{ cursor: 'pointer' }}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('en')}>English</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('es')}>Español</MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
