import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScannerSettings = ({ 
  isVisible = false, 
  onClose,
  settings = {},
  onSettingsChange 
}) => {
  const [localSettings, setLocalSettings] = useState({
    cameraFacing: 'environment',
    audioFeedback: true,
    vibrationFeedback: true,
    autoCloseDelay: 3000,
    scanSensitivity: 'medium',
    showRecentScans: true,
    offlineMode: false,
    ...settings
  });

  const cameraOptions = [
    { value: 'environment', label: 'Back Camera (Recommended)' },
    { value: 'user', label: 'Front Camera' }
  ];

  const sensitivityOptions = [
    { value: 'low', label: 'Low (More Accurate)' },
    { value: 'medium', label: 'Medium (Balanced)' },
    { value: 'high', label: 'High (Faster)' }
  ];

  const delayOptions = [
    { value: 1000, label: '1 second' },
    { value: 2000, label: '2 seconds' },
    { value: 3000, label: '3 seconds' },
    { value: 5000, label: '5 seconds' },
    { value: 0, label: 'Manual close' }
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    if (onSettingsChange) {
      onSettingsChange(localSettings);
    }
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      cameraFacing: 'environment',
      audioFeedback: true,
      vibrationFeedback: true,
      autoCloseDelay: 3000,
      scanSensitivity: 'medium',
      showRecentScans: true,
      offlineMode: false
    };
    setLocalSettings(defaultSettings);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Settings Panel */}
      <div className="relative bg-card border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden elevation-pronounced">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Scanner Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 overflow-y-auto max-h-96 space-y-6">
          {/* Camera Settings */}
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-4 flex items-center space-x-2">
              <Icon name="Camera" size={20} className="text-muted-foreground" />
              <span>Camera</span>
            </h3>
            
            <div className="space-y-4">
              <Select
                label="Camera Direction"
                description="Choose which camera to use for scanning"
                options={cameraOptions}
                value={localSettings?.cameraFacing}
                onChange={(value) => handleSettingChange('cameraFacing', value)}
              />
              
              <Select
                label="Scan Sensitivity"
                description="Adjust QR code detection sensitivity"
                options={sensitivityOptions}
                value={localSettings?.scanSensitivity}
                onChange={(value) => handleSettingChange('scanSensitivity', value)}
              />
            </div>
          </div>

          {/* Feedback Settings */}
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-4 flex items-center space-x-2">
              <Icon name="Volume2" size={20} className="text-muted-foreground" />
              <span>Feedback</span>
            </h3>
            
            <div className="space-y-4">
              <Checkbox
                label="Audio Feedback"
                description="Play sound when QR codes are scanned"
                checked={localSettings?.audioFeedback}
                onChange={(e) => handleSettingChange('audioFeedback', e?.target?.checked)}
              />
              
              <Checkbox
                label="Vibration Feedback"
                description="Vibrate device on successful scans (mobile only)"
                checked={localSettings?.vibrationFeedback}
                onChange={(e) => handleSettingChange('vibrationFeedback', e?.target?.checked)}
              />
              
              <Select
                label="Result Display Duration"
                description="How long to show scan results"
                options={delayOptions}
                value={localSettings?.autoCloseDelay}
                onChange={(value) => handleSettingChange('autoCloseDelay', parseInt(value))}
              />
            </div>
          </div>

          {/* Interface Settings */}
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-4 flex items-center space-x-2">
              <Icon name="Layout" size={20} className="text-muted-foreground" />
              <span>Interface</span>
            </h3>
            
            <div className="space-y-4">
              <Checkbox
                label="Show Recent Scans"
                description="Display recent scan history panel"
                checked={localSettings?.showRecentScans}
                onChange={(e) => handleSettingChange('showRecentScans', e?.target?.checked)}
              />
              
              <Checkbox
                label="Offline Mode"
                description="Cache scans when internet is unavailable"
                checked={localSettings?.offlineMode}
                onChange={(e) => handleSettingChange('offlineMode', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Device Info */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-medium text-card-foreground mb-4 flex items-center space-x-2">
              <Icon name="Info" size={20} className="text-muted-foreground" />
              <span>Device Information</span>
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Browser:</span>
                <span className="text-card-foreground">{navigator.userAgent?.split(' ')?.[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Camera Support:</span>
                <span className="text-card-foreground">
                  {navigator.mediaDevices ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connection:</span>
                <span className="text-card-foreground">
                  {navigator.onLine ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={handleReset}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset to Default
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              iconName="Check"
              iconPosition="left"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerSettings;