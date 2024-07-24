import React from 'react'
import './Footer.css';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <div className='footer' id='footer'>
          
            <p className='footer-copyright'>Copyright 2024 @ Tandoori.com - All Right Reserved</p>
        </div>
    )
}

export default Footer