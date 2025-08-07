import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MemberSelectionPanel from './components/MemberSelectionPanel';
import BadgePreview from './components/BadgePreview';
import BadgeCustomizationPanel from './components/BadgeCustomizationPanel';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import PrintPreviewModal from './components/PrintPreviewModal';
import Icon from '../../components/AppIcon';

const QRBadgeGenerator = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentTheme, setCurrentTheme] = useState('light');

  // Mock data
  const mockMembers = [
    {
      id: "uuid-001",
      firstName: "Rakoto",
      lastName: "Andry",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
      group: "Mpiandry",
      synod: "Antananarivo",
      localChurch: "Ambatonakanga"
    },
    {
      id: "uuid-002",
      firstName: "Rasoa",
      lastName: "Hery",
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
      group: "Mpampianatra",
      synod: "Fianarantsoa",
      localChurch: "Ambohimahasoa"
    },
    {
      id: "uuid-003",
      firstName: "Rabe",
      lastName: "Koto",
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
      group: "Mpiomana D1",
      synod: "Toamasina",
      localChurch: "Brickaville"
    },
    {
      id: "uuid-004",
      firstName: "Ravao",
      lastName: "Naina",
      photo: "https://randomuser.me/api/portraits/women/4.jpg",
      group: "Mpiomana D2",
      synod: "Mahajanga",
      localChurch: "Marovoay"
    },
    {
      id: "uuid-005",
      firstName: "Randria",
      lastName: "Mamy",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
      group: "Mpiandry",
      synod: "Toliara",
      localChurch: "Betioky"
    },
    {
      id: "uuid-006",
      firstName: "Razafy",
      lastName: "Vola",
      photo: "https://randomuser.me/api/portraits/women/6.jpg",
      group: "Mpampianatra",
      synod: "Antsiranana",
      localChurch: "Sambava"
    },
    {
      id: "uuid-007",
      firstName: "Rasolofo",
      lastName: "Hanta",
      photo: "https://randomuser.me/api/portraits/men/7.jpg",
      group: "Mpiomana D1",
      synod: "Antananarivo",
      localChurch: "Analakely"
    },
    {
      id: "uuid-008",
      firstName: "Raharison",
      lastName: "Fidy",
      photo: "https://randomuser.me/api/portraits/women/8.jpg",
      group: "Mpiomana D2",
      synod: "Fianarantsoa",
      localChurch: "Ihosy"
    }
  ];

  const [synodColors, setSynodColors] = useState({
    'Antananarivo': '#2563EB',
    'Fianarantsoa': '#DC2626',
    'Toamasina': '#059669',
    'Mahajanga': '#D97706',
    'Toliara': '#7C3AED',
    'Antsiranana': '#0891B2'
  });

  const [badgeSettings, setBadgeSettings] = useState({
    paperSize: 'A4',
    includeCuttingGuides: true,
    highQuality: true,
    includeMemberId: true
  });

  const currentUser = {
    name: 'Admin User',
    role: 'admin',
    email: 'admin@fpvm.org'
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleMemberSelect = (memberId) => {
    setSelectedMembers(prev => 
      prev?.includes(memberId)
        ? prev?.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = (memberIds) => {
    setSelectedMembers(memberIds);
  };

  const handleClearAll = () => {
    setSelectedMembers([]);
  };

  const handleSynodColorChange = (synod, color) => {
    setSynodColors(prev => ({
      ...prev,
      [synod]: color
    }));
  };

  const handleGenerateSelected = async () => {
    if (selectedMembers?.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate badge generation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProcessingProgress(i);
    }

    setIsProcessing(false);
    setProcessingProgress(0);
  };

  const handleDownloadAll = () => {
    // Mock download functionality
    const selectedMemberData = mockMembers?.filter(member => 
      selectedMembers?.includes(member?.id)
    );
    
    console.log('Downloading badges for:', selectedMemberData);
    // In real app, would generate and download ZIP file
  };

  const handleDownloadSingle = (memberId) => {
    const member = mockMembers?.find(m => m?.id === memberId);
    console.log('Downloading badge for:', member);
    // In real app, would generate and download single badge
  };

  const handlePrintPreview = () => {
    setShowPrintPreview(true);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const selectedMemberData = mockMembers?.filter(member => 
    selectedMembers?.includes(member?.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
        userRole={currentUser?.role}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-foreground">QR Badge Generator</h1>
                <p className="text-sm text-muted-foreground">Generate and manage member badges</p>
              </div>
            </div>

            <UserProfileDropdown
              user={currentUser}
              onLogout={handleLogout}
              onLanguageChange={handleLanguageChange}
              onThemeChange={handleThemeChange}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <BreadcrumbNavigation />

          <BulkActionsToolbar
            selectedCount={selectedMembers?.length}
            onGenerateSelected={handleGenerateSelected}
            onDownloadAll={handleDownloadAll}
            onPrintPreview={handlePrintPreview}
            isProcessing={isProcessing}
            processingProgress={processingProgress}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Member Selection Panel */}
            <div className="lg:col-span-4">
              <MemberSelectionPanel
                members={mockMembers}
                selectedMembers={selectedMembers}
                onMemberSelect={handleMemberSelect}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
              {/* Badge Customization */}
              <BadgeCustomizationPanel
                synodColors={synodColors}
                onSynodColorChange={handleSynodColorChange}
                settings={badgeSettings}
                onSettingsChange={setBadgeSettings}
              />

              {/* Badge Preview Grid */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-card-foreground">Badge Preview</h3>
                  <div className="text-sm text-muted-foreground">
                    {selectedMemberData?.length} badge{selectedMemberData?.length !== 1 ? 's' : ''} ready
                  </div>
                </div>

                {selectedMemberData?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="CreditCard" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h4 className="text-lg font-medium text-muted-foreground mb-2">No Members Selected</h4>
                    <p className="text-sm text-muted-foreground">
                      Select members from the left panel to preview their badges
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {selectedMemberData?.map((member) => (
                      <BadgePreview
                        key={member?.id}
                        member={member}
                        synodColors={synodColors}
                        onDownload={handleDownloadSingle}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        selectedMembers={selectedMembers}
        members={mockMembers}
        synodColors={synodColors}
        settings={badgeSettings}
      />
      {/* Mobile Bottom Padding */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default QRBadgeGenerator;