import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ScanResultOverlay = ({ 
  scanResult, 
  onClose, 
  isVisible = false,
  autoCloseDelay = 3000 
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible || !scanResult) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'entry':
        return 'bg-success text-success-foreground';
      case 'exit':
        return 'bg-warning text-warning-foreground';
      case 'error':
        return 'bg-destructive text-destructive-foreground';
      case 'duplicate':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'entry':
        return 'LogIn';
      case 'exit':
        return 'LogOut';
      case 'error':
        return 'AlertCircle';
      case 'duplicate':
        return 'Clock';
      default:
        return 'Info';
    }
  };

  const getStatusMessage = (status, member) => {
    switch (status) {
      case 'entry':
        return `Welcome, ${member?.firstName} ${member?.lastName}!`;
      case 'exit':
        return `Goodbye, ${member?.firstName} ${member?.lastName}!`;
      case 'error':
        return 'QR Code not recognized';
      case 'duplicate':
        return 'Please wait before scanning again';
      default:
        return 'Scan completed';
    }
  };

  return (
    <div className={`
      fixed inset-0 z-300 flex items-center justify-center p-4
      ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
    `}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      {/* Result Card */}
      <div className={`
        relative bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 elevation-pronounced
        ${isClosing ? 'animate-slide-out-up' : 'animate-slide-in-down'}
      `}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full transition-colors"
        >
          <Icon name="X" size={20} className="text-muted-foreground" />
        </button>

        {/* Status Header */}
        <div className="flex items-center justify-center mb-6">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${getStatusColor(scanResult?.status)}
          `}>
            <Icon name={getStatusIcon(scanResult?.status)} size={32} />
          </div>
        </div>

        {/* Member Information */}
        {scanResult?.member && (
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
              <Image
                src={scanResult?.member?.photo}
                alt={`${scanResult?.member?.firstName} ${scanResult?.member?.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-xl font-semibold text-card-foreground mb-1">
              {scanResult?.member?.firstName} {scanResult?.member?.lastName}
            </h3>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-2">
              <Icon name="Users" size={16} />
              <span>{scanResult?.member?.group}</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={16} />
              <span>{scanResult?.member?.church}</span>
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-card-foreground mb-2">
            {getStatusMessage(scanResult?.status, scanResult?.member)}
          </p>
          
          {scanResult?.message && (
            <p className="text-sm text-muted-foreground">
              {scanResult?.message}
            </p>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
            <Icon name="Clock" size={16} />
            <span>{new Date(scanResult.timestamp)?.toLocaleString('fr-FR')}</span>
          </div>
        </div>

        {/* Additional Info for Errors */}
        {scanResult?.status === 'duplicate' && scanResult?.nextScanTime && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-warning-foreground">
              <Icon name="Clock" size={16} />
              <span>Next scan available at: {new Date(scanResult.nextScanTime)?.toLocaleTimeString('fr-FR')}</span>
            </div>
          </div>
        )}

        {/* Action Buttons for Errors */}
        {scanResult?.status === 'error' && (
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanResultOverlay;