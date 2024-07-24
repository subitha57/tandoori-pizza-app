import React, { useEffect } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

const DarkMode = ({ darkTheme, toggleTheme }) => {
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  return (
    <div className="dark-mode-toggle">
      {/*{darkTheme ? (
        <button onClick={toggleTheme}>
          <Brightness7Icon /> {/* Light mode icon 
        </button>
      ) : (
        <button onClick={toggleTheme}>
          <Brightness4Icon /> {/* Dark mode icon
        </button>
      )}*/}
    </div>
  );
};

export default DarkMode;
