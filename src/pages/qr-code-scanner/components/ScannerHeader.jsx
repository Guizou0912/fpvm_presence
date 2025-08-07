import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import KioskModeToggle from '../../../components/ui/KioskModeToggle';

const ScannerHeader = ({ 
  isKioskMode = false, 
  onKioskToggle,
  onSettingsClick,
  showSettings = true,
  currentUser = { name: 'Scanner User', role: 'user' }
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isKioskMode) {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-100">
        <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-center">
          <div className="text-lg font-semibold">{formatTime(currentTime)}</div>
          <div className="text-xs opacity-80">{formatDate(currentTime)}</div>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-card border-b border-border px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Church" size={20} color="white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">FPVM Presence</h1>
            <p className="text-xs text-muted-foreground">QR Code Scanner</p>
          </div>
        </div>

        {/* Center - Time and Date */}
        <div className="flex-1 flex justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          {/* Kiosk Mode Toggle */}
          <KioskModeToggle
            isKioskMode={isKioskMode}
            onToggle={onKioskToggle}
            isVisible={true}
            exitGesture="triple-tap"
          />

          {/* Settings Button */}
          {showSettings && (
            <button
              onClick={onSettingsClick}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Scanner Settings"
            >
              <Icon name="Settings" size={20} />
            </button>
          )}

          {/* User Info */}
          <div className="hidden lg:flex items-center space-x-2 text-sm">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              {currentUser?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
            </div>
            <div className="text-right">
              <div className="text-foreground font-medium">{currentUser?.name}</div>
              <div className="text-muted-foreground text-xs capitalize">{currentUser?.role}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile User Info */}
      <div className="lg:hidden mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              {currentUser?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
            </div>
            <span className="text-foreground font-medium">{currentUser?.name}</span>
            <span className="text-muted-foreground text-xs">({currentUser?.role})</span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Wifi" size={14} />
            <span>Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ScannerHeader;