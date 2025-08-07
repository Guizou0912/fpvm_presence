import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const KioskModeToggle = ({ 
  isKioskMode = false, 
  onToggle,
  isVisible = true,
  exitGesture = 'triple-tap' // 'triple-tap' | 'long-press' | 'key-combo'
}) => {
  const [isConfirmingExit, setIsConfirmingExit] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState(null);

  useEffect(() => {
    if (isKioskMode) {
      // Store kiosk mode state in sessionStorage
      sessionStorage.setItem('kioskMode', 'true');
      
      // Add event listeners for exit gestures
      if (exitGesture === 'triple-tap') {
        document.addEventListener('click', handleTripleTap);
      } else if (exitGesture === 'key-combo') {
        document.addEventListener('keydown', handleKeyCombo);
      }
    } else {
      sessionStorage.removeItem('kioskMode');
      document.removeEventListener('click', handleTripleTap);
      document.removeEventListener('keydown', handleKeyCombo);
    }

    return () => {
      document.removeEventListener('click', handleTripleTap);
      document.removeEventListener('keydown', handleKeyCombo);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [isKioskMode, exitGesture]);

  const handleTripleTap = () => {
    setTapCount(prev => prev + 1);
    
    setTimeout(() => {
      if (tapCount >= 2) {
        setIsConfirmingExit(true);
        setTapCount(0);
      } else {
        setTapCount(0);
      }
    }, 500);
  };

  const handleKeyCombo = (event) => {
    // Ctrl + Shift + K to exit kiosk mode
    if (event.ctrlKey && event.shiftKey && event.key === 'K') {
      event.preventDefault();
      setIsConfirmingExit(true);
    }
  };

  const handleLongPressStart = () => {
    const timer = setTimeout(() => {
      setIsConfirmingExit(true);
    }, 3000); // 3 second long press
    
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleToggleKiosk = () => {
    if (onToggle) {
      onToggle(!isKioskMode);
    }
  };

  const handleConfirmExit = () => {
    handleToggleKiosk();
    setIsConfirmingExit(false);
  };

  const handleCancelExit = () => {
    setIsConfirmingExit(false);
  };

  if (!isVisible && !isKioskMode) {
    return null;
  }

  return (
    <>
      {/* Kiosk Mode Toggle Button */}
      {!isKioskMode && isVisible && (
        <button
          onClick={handleToggleKiosk}
          className="flex items-center space-x-2 px-3 py-2 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 transition-colors duration-150 ease-out text-sm font-medium"
          title="Enable Kiosk Mode for distraction-free scanning"
        >
          <Icon name="Maximize" size={16} />
          <span>Kiosk Mode</span>
        </button>
      )}

      {/* Exit Confirmation Modal */}
      {isConfirmingExit && (
        <div className="fixed inset-0 z-300 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4 elevation-pronounced">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning text-warning-foreground rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Exit Kiosk Mode?</h3>
                <p className="text-sm text-muted-foreground">This will restore the full interface</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmExit}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors duration-150 ease-out font-medium"
              >
                Exit Kiosk Mode
              </button>
              <button
                onClick={handleCancelExit}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-150 ease-out font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              {exitGesture === 'triple-tap' && 'Triple-tap anywhere to exit kiosk mode'}
              {exitGesture === 'long-press' && 'Long-press for 3 seconds to exit kiosk mode'}
              {exitGesture === 'key-combo' && 'Press Ctrl + Shift + K to exit kiosk mode'}
            </div>
          </div>
        </div>
      )}

      {/* Kiosk Mode Exit Hint */}
      {isKioskMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-200">
          <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-xs">
            {exitGesture === 'triple-tap' && 'Triple-tap to exit kiosk mode'}
            {exitGesture === 'long-press' && 'Long-press to exit kiosk mode'}
            {exitGesture === 'key-combo' && 'Ctrl + Shift + K to exit kiosk mode'}
          </div>
        </div>
      )}

      {/* Long Press Area (for long-press exit gesture) */}
      {isKioskMode && exitGesture === 'long-press' && (
        <div
          className="fixed top-0 left-0 w-16 h-16 z-200 opacity-0"
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
        />
      )}
    </>
  );
};

export default KioskModeToggle;