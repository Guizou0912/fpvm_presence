import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const OfflineIndicator = ({ 
  isOffline = false,
  pendingScans = 0,
  onSyncNow,
  autoSync = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    setIsVisible(isOffline || pendingScans > 0);
  }, [isOffline, pendingScans]);

  useEffect(() => {
    // Auto-sync when coming back online
    if (!isOffline && pendingScans > 0 && autoSync) {
      handleSync();
    }
  }, [isOffline, pendingScans, autoSync]);

  const handleSync = async () => {
    if (isSyncing || isOffline) return;
    
    setIsSyncing(true);
    
    try {
      if (onSyncNow) {
        await onSyncNow();
      }
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date?.toLocaleDateString('fr-FR');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-200 lg:left-auto lg:right-6 lg:w-80">
      <div className={`
        bg-card border rounded-lg p-4 elevation-moderate
        ${isOffline ? 'border-warning' : 'border-success'}
      `}>
        <div className="flex items-start space-x-3">
          {/* Status Icon */}
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
            ${isOffline 
              ? 'bg-warning text-warning-foreground' 
              : 'bg-success text-success-foreground'
            }
          `}>
            {isSyncing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon 
                name={isOffline ? 'WifiOff' : 'Wifi'} 
                size={16} 
              />
            )}
          </div>

          {/* Status Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`
                text-sm font-medium
                ${isOffline ? 'text-warning' : 'text-success'}
              `}>
                {isOffline ? 'Offline Mode' : 'Back Online'}
              </h4>
              
              {!isOffline && pendingScans > 0 && !isSyncing && (
                <button
                  onClick={handleSync}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Sync Now
                </button>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              {isOffline 
                ? 'Scans are being saved locally and will sync when connection is restored.'
                : isSyncing 
                  ? 'Syncing pending scans...' :'Connection restored. All scans are up to date.'
              }
            </p>

            {/* Pending Scans Counter */}
            {pendingScans > 0 && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {pendingScans} scan{pendingScans !== 1 ? 's' : ''} pending
                  </span>
                </div>
                
                {lastSyncTime && (
                  <span className="text-muted-foreground">
                    Last sync: {formatLastSync(lastSyncTime)}
                  </span>
                )}
              </div>
            )}

            {/* Sync Progress */}
            {isSyncing && (
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isOffline && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="HardDrive" size={12} />
                <span>Data saved locally</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="RefreshCw" size={12} />
                <span>Auto-sync enabled</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;