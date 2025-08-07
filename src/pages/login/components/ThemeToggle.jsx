import React from 'react';
import Icon from '../../../components/AppIcon';

const ThemeToggle = ({ currentTheme, onThemeChange }) => {
  const themes = [
    { value: 'light', label: 'Clair', icon: 'Sun' },
    { value: 'dark', label: 'Sombre', icon: 'Moon' },
    { value: 'system', label: 'Système', icon: 'Monitor' }
  ];

  const currentThemeData = themes?.find(theme => theme?.value === currentTheme) || themes?.[0];

  const handleToggle = () => {
    const currentIndex = themes?.findIndex(theme => theme?.value === currentTheme);
    const nextIndex = (currentIndex + 1) % themes?.length;
    onThemeChange(themes?.[nextIndex]?.value);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-150 ease-out"
      title={`Thème actuel: ${currentThemeData?.label}`}
    >
      <Icon name={currentThemeData?.icon} size={16} className="text-muted-foreground" />
      <span className="text-sm font-medium text-foreground hidden sm:inline">
        {currentThemeData?.label}
      </span>
    </button>
  );
};

export default ThemeToggle;