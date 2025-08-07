import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import CameraViewfinder from './components/CameraViewfinder';
import ScanResultOverlay from './components/ScanResultOverlay';
import RecentScansPanel from './components/RecentScansPanel';
import ScannerHeader from './components/ScannerHeader';
import ScannerSettings from './components/ScannerSettings';
import OfflineIndicator from './components/OfflineIndicator';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  
  // State management
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRecentScans, setShowRecentScans] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showScanResult, setShowScanResult] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingScans, setPendingScans] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [currentTheme, setCurrentTheme] = useState('light');
  
  // Scanner settings
  const [scannerSettings, setScannerSettings] = useState({
    cameraFacing: 'environment',
    audioFeedback: true,
    vibrationFeedback: true,
    autoCloseDelay: 3000,
    scanSensitivity: 'medium',
    showRecentScans: true,
    offlineMode: false
  });

  // Mock member data
  const mockMembers = [
    {
      id: 'fpvm-member-001',
      firstName: 'Jean',
      lastName: 'Rakoto',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      group: 'Mpiandry',
      synod: 'Antananarivo',
      church: 'FPVM Analakely',
      lastScan: null
    },
    {
      id: 'fpvm-member-002',
      firstName: 'Marie',
      lastName: 'Razafy',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      group: 'Mpampianatra',
      synod: 'Fianarantsoa',
      church: 'FPVM Betsileo',
      lastScan: null
    },
    {
      id: 'fpvm-member-003',
      firstName: 'Paul',
      lastName: 'Andry',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      group: 'Mpiomana D1',
      synod: 'Toamasina',
      church: 'FPVM Tamatave',
      lastScan: null
    },
    {
      id: 'fpvm-member-004',
      firstName: 'Sophie',
      lastName: 'Rabe',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      group: 'Mpiomana D2',
      synod: 'Mahajanga',
      church: 'FPVM Majunga',
      lastScan: null
    },
    {
      id: 'fpvm-member-005',
      firstName: 'Michel',
      lastName: 'Hery',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      group: 'Mpiandry',
      synod: 'Antsiranana',
      church: 'FPVM Diego',
      lastScan: null
    }
  ];

  const currentUser = {
    name: 'Scanner Operator',
    role: 'user',
    email: 'scanner@fpvm.org'
  };

  // Initialize kiosk mode from session storage
  useEffect(() => {
    const savedKioskMode = sessionStorage.getItem('kioskMode') === 'true';
    setIsKioskMode(savedKioskMode);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'fr';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Audio feedback
  const playAudioFeedback = useCallback((type = 'success') => {
    if (!scannerSettings?.audioFeedback) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext?.createOscillator();
    const gainNode = audioContext?.createGain();

    oscillator?.connect(gainNode);
    gainNode?.connect(audioContext?.destination);

    oscillator?.frequency?.setValueAtTime(type === 'success' ? 800 : 400, audioContext?.currentTime);
    oscillator.type = 'sine';
    gainNode?.gain?.setValueAtTime(0.3, audioContext?.currentTime);

    oscillator?.start();
    oscillator?.stop(audioContext?.currentTime + 0.2);
  }, [scannerSettings?.audioFeedback]);

  // Vibration feedback
  const triggerVibration = useCallback((pattern = [100]) => {
    if (!scannerSettings?.vibrationFeedback || !navigator.vibrate) return;
    navigator.vibrate(pattern);
  }, [scannerSettings?.vibrationFeedback]);

  // Handle QR scan result
  const handleScanResult = useCallback((qrCode) => {
    const member = mockMembers?.find(m => m?.id === qrCode);
    const now = new Date();
    
    let result = {
      qrCode,
      timestamp: now,
      member: member || null,
      status: 'error',
      message: 'QR Code not recognized'
    };

    if (member) {
      const lastScan = member?.lastScan;
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      if (lastScan && new Date(lastScan) > oneHourAgo) {
        // Duplicate scan within 1 hour
        result = {
          ...result,
          status: 'duplicate',
          message: 'Please wait at least 1 hour between scans',
          nextScanTime: new Date(new Date(lastScan).getTime() + 60 * 60 * 1000)
        };
        playAudioFeedback('error');
        triggerVibration([100, 100, 100]);
      } else {
        // Valid scan - determine entry or exit
        const isEntry = !lastScan || new Date(lastScan) < oneHourAgo;
        result = {
          ...result,
          status: isEntry ? 'entry' : 'exit',
          message: isEntry ? 'Entry recorded successfully' : 'Exit recorded successfully'
        };
        
        // Update member's last scan time
        member.lastScan = now?.toISOString();
        
        playAudioFeedback('success');
        triggerVibration([200]);
      }
    } else {
      playAudioFeedback('error');
      triggerVibration([100, 100, 100]);
    }

    // Add to recent scans
    setRecentScans(prev => [result, ...prev?.slice(0, 9)]);
    
    // Handle offline storage
    if (isOffline && result?.status !== 'error') {
      setPendingScans(prev => prev + 1);
      // In real app, store in IndexedDB or localStorage
    }

    setScanResult(result);
    setShowScanResult(true);
  }, [mockMembers, isOffline, playAudioFeedback, triggerVibration]);

  // Handle settings change
  const handleSettingsChange = useCallback((newSettings) => {
    setScannerSettings(newSettings);
    localStorage.setItem('scannerSettings', JSON.stringify(newSettings));
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  }, []);

  // Handle theme change
  const handleThemeChange = useCallback((theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // Handle sync
  const handleSync = useCallback(async () => {
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPendingScans(0);
  }, []);

  // Clear scan history
  const handleClearHistory = useCallback(() => {
    setRecentScans([]);
  }, []);

  const mainContentClass = isKioskMode 
    ? 'w-full h-screen' 
    : `flex-1 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'} transition-all duration-300`;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar - Hidden in kiosk mode */}
      {!isKioskMode && (
        <NavigationSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userRole={currentUser?.role}
        />
      )}
      {/* Main Content */}
      <div className={mainContentClass}>
        {/* Header */}
        <ScannerHeader
          isKioskMode={isKioskMode}
          onKioskToggle={setIsKioskMode}
          onSettingsClick={() => setShowSettings(true)}
          showSettings={!isKioskMode}
          currentUser={currentUser}
        />

        {/* Breadcrumb Navigation - Hidden in kiosk mode */}
        {!isKioskMode && (
          <div className="px-4 lg:px-6 pt-4">
            <BreadcrumbNavigation />
          </div>
        )}

        {/* User Profile Dropdown - Hidden in kiosk mode */}
        {!isKioskMode && (
          <div className="absolute top-4 right-4 z-100">
            <UserProfileDropdown
              user={currentUser}
              onLogout={handleLogout}
              onLanguageChange={handleLanguageChange}
              onThemeChange={handleThemeChange}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          </div>
        )}

        {/* Camera Viewfinder */}
        <div className={`
          relative
          ${isKioskMode 
            ? 'h-screen' :'h-[calc(100vh-120px)] lg:h-[calc(100vh-160px)]'
          }
        `}>
          <CameraViewfinder
            onScanResult={handleScanResult}
            isActive={true}
            cameraFacing={scannerSettings?.cameraFacing}
            onCameraError={(error) => console.error('Camera error:', error)}
          />
        </div>

        {/* Offline Indicator */}
        <OfflineIndicator
          isOffline={isOffline}
          pendingScans={pendingScans}
          onSyncNow={handleSync}
          autoSync={true}
        />

        {/* Recent Scans Panel - Hidden in kiosk mode */}
        {!isKioskMode && scannerSettings?.showRecentScans && (
          <RecentScansPanel
            recentScans={recentScans}
            isVisible={showRecentScans}
            onToggle={() => setShowRecentScans(!showRecentScans)}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Scan Result Overlay */}
        <ScanResultOverlay
          scanResult={scanResult}
          isVisible={showScanResult}
          onClose={() => setShowScanResult(false)}
          autoCloseDelay={scannerSettings?.autoCloseDelay}
        />

        {/* Scanner Settings Modal */}
        <ScannerSettings
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
          settings={scannerSettings}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </div>
  );
};

export default QRCodeScanner;