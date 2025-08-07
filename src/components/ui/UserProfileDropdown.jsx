import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const UserProfileDropdown = ({ 
  user = { name: 'Admin User', role: 'admin', email: 'admin@fpvm.org' },
  onLogout,
  onLanguageChange,
  onThemeChange,
  currentLanguage = 'en',
  currentTheme = 'light'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: 'Sun' },
    { value: 'dark', label: 'Dark', icon: 'Moon' },
    { value: 'system', label: 'System', icon: 'Monitor' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (languageCode) => {
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    setIsOpen(false);
  };

  const handleThemeSelect = (theme) => {
    if (onThemeChange) {
      onThemeChange(theme);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: 'Administrator',
      controller: 'Controller',
      user: 'User'
    };
    return roleMap?.[role] || role;
  };

  const getInitials = (name) => {
    return name
      .split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors duration-150 ease-out"
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          {getInitials(user?.name)}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{getRoleDisplayName(user?.role)}</div>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground transition-transform duration-150"
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg elevation-moderate z-200 dropdown-slide-in">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">{user?.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                <div className="text-xs text-muted-foreground">{getRoleDisplayName(user?.role)}</div>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">
              Language
            </div>
            {languages?.map((language) => (
              <button
                key={language?.code}
                onClick={() => handleLanguageSelect(language?.code)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm
                  hover:bg-muted transition-colors duration-150 ease-out
                  ${currentLanguage === language?.code ? 'bg-muted text-foreground' : 'text-popover-foreground'}
                `}
              >
                <span className="text-base">{language?.flag}</span>
                <span className="flex-1 text-left">{language?.label}</span>
                {currentLanguage === language?.code && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Theme Selection */}
          <div className="p-2 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">
              Theme
            </div>
            {themes?.map((theme) => (
              <button
                key={theme?.value}
                onClick={() => handleThemeSelect(theme?.value)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm
                  hover:bg-muted transition-colors duration-150 ease-out
                  ${currentTheme === theme?.value ? 'bg-muted text-foreground' : 'text-popover-foreground'}
                `}
              >
                <Icon name={theme?.icon} size={16} className="text-muted-foreground" />
                <span className="flex-1 text-left">{theme?.label}</span>
                {currentTheme === theme?.value && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150 ease-out"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;