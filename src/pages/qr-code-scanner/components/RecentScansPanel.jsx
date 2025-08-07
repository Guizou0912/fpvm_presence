import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentScansPanel = ({ 
  recentScans = [], 
  isVisible = false, 
  onToggle,
  onClearHistory 
}) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = async () => {
    setIsClearing(true);
    
    // Simulate clearing delay
    setTimeout(() => {
      if (onClearHistory) {
        onClearHistory();
      }
      setIsClearing(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'entry':
        return { icon: 'LogIn', color: 'text-success' };
      case 'exit':
        return { icon: 'LogOut', color: 'text-warning' };
      case 'error':
        return { icon: 'AlertCircle', color: 'text-destructive' };
      case 'duplicate':
        return { icon: 'Clock', color: 'text-warning' };
      default:
        return { icon: 'Info', color: 'text-muted-foreground' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const scanTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - scanTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          fixed bottom-6 left-6 z-200 w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 ease-out elevation-moderate
          ${isVisible 
            ? 'bg-muted text-muted-foreground' 
            : 'bg-primary text-primary-foreground'
          }
        `}
        title={isVisible ? 'Hide Recent Scans' : 'Show Recent Scans'}
      >
        <Icon name={isVisible ? 'ChevronDown' : 'History'} size={24} />
      </button>
      {/* Panel */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-150 bg-card border-t border-border
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        max-h-96 lg:max-h-80
      `}>
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="History" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-card-foreground">Recent Scans</h3>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {recentScans?.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {recentScans?.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                title="Clear History"
              >
                {isClearing ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon name="Trash2" size={16} />
                )}
              </button>
            )}
            
            <button
              onClick={onToggle}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="ChevronDown" size={16} />
            </button>
          </div>
        </div>

        {/* Scans List */}
        <div className="overflow-y-auto max-h-64 lg:max-h-48">
          {recentScans?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Scan" size={48} className="text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium text-card-foreground mb-2">No Recent Scans</h4>
              <p className="text-sm text-muted-foreground">
                Scan QR codes to see activity history here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentScans?.map((scan, index) => {
                const statusInfo = getStatusIcon(scan?.status);
                
                return (
                  <div key={`${scan?.timestamp}-${index}`} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      {/* Member Photo */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {scan?.member?.photo ? (
                          <Image
                            src={scan?.member?.photo}
                            alt={`${scan?.member?.firstName} ${scan?.member?.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name="User" size={20} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Scan Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-card-foreground truncate">
                            {scan?.member ? 
                              `${scan?.member?.firstName} ${scan?.member?.lastName}` : 
                              'Unknown Member'
                            }
                          </h4>
                          <div className={`flex items-center space-x-1 ${statusInfo?.color}`}>
                            <Icon name={statusInfo?.icon} size={14} />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            {scan?.member?.group && (
                              <>
                                <Icon name="Users" size={12} />
                                <span>{scan?.member?.group}</span>
                              </>
                            )}
                          </div>
                          
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(scan?.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Error Message */}
                    {scan?.status === 'error' && scan?.message && (
                      <div className="mt-2 ml-13">
                        <p className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                          {scan?.message}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {recentScans?.length > 0 && (
          <div className="border-t border-border p-4 bg-muted/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-card-foreground">
                  {recentScans?.filter(s => s?.status === 'entry')?.length}
                </div>
                <div className="text-xs text-muted-foreground">Entries</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-card-foreground">
                  {recentScans?.filter(s => s?.status === 'exit')?.length}
                </div>
                <div className="text-xs text-muted-foreground">Exits</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-card-foreground">
                  {recentScans?.filter(s => s?.status === 'error')?.length}
                </div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 z-100 bg-black bg-opacity-25 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default RecentScansPanel;