import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'mg', label: 'Malagasy', flag: '🇲🇬' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  const currentLang = languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];

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
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-150 ease-out"
      >
        <span className="text-base">{currentLang?.flag}</span>
        <span className="text-sm font-medium text-foreground">{currentLang?.label}</span>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground transition-transform duration-150"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg elevation-moderate z-200 dropdown-slide-in">
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
      )}
    </div>
  );
};

export default LanguageSelector;