import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationSidebar from 'components/ui/NavigationSidebar';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import UserProfileDropdown from 'components/ui/UserProfileDropdown';
import KioskModeToggle from 'components/ui/KioskModeToggle';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import OrganizationTreeView from './components/OrganizationTreeView';
import SynodesManagement from './components/SynodesManagement';
import ChurchesManagement from './components/ChurchesManagement';
import GroupsManagement from './components/GroupsManagement';
import AddSynodeModal from './components/AddSynodeModal';
import AddChurchModal from './components/AddChurchModal';
import AddGroupModal from './components/AddGroupModal';
import ColorCustomizationPanel from './components/ColorCustomizationPanel';

const OrganizationStructureManagement = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('synodes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [showAddSynodeModal, setShowAddSynodeModal] = useState(false);
  const [showAddChurchModal, setShowAddChurchModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [selectedSynode, setSelectedSynode] = useState(null);
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Mock organizational data - in real app, this would come from Supabase
  const [organizationData, setOrganizationData] = useState({
    synodes: [
      {
        id: '1',
        name: 'Synode Central',
        colorCode: '#3B82F6',
        churchCount: 5,
        memberCount: 250,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Synode Nord',
        colorCode: '#10B981',
        churchCount: 3,
        memberCount: 180,
        createdAt: '2024-02-10'
      },
      {
        id: '3',
        name: 'Synode Sud',
        colorCode: '#F59E0B',
        churchCount: 4,
        memberCount: 200,
        createdAt: '2024-01-20'
      }
    ],
    churches: [
      {
        id: '1',
        name: 'Église Centrale Antananarivo',
        synodeId: '1',
        groupCount: 4,
        memberCount: 120,
        address: 'Antananarivo, Madagascar'
      },
      {
        id: '2',
        name: 'Église Antsirabe',
        synodeId: '1',
        groupCount: 3,
        memberCount: 85,
        address: 'Antsirabe, Madagascar'
      },
      {
        id: '3',
        name: 'Église Mahajanga',
        synodeId: '2',
        groupCount: 3,
        memberCount: 95,
        address: 'Mahajanga, Madagascar'
      }
    ],
    groups: [
      {
        id: '1',
        name: 'Mpiandry',
        churchId: '1',
        type: 'leadership',
        memberCount: 25,
        description: 'Groupe de direction spirituelle'
      },
      {
        id: '2',
        name: 'Mpampianatra',
        churchId: '1',
        type: 'education',
        memberCount: 30,
        description: 'Groupe d\'enseignement'
      },
      {
        id: '3',
        name: 'Mpiomana D1',
        churchId: '1',
        type: 'worship',
        memberCount: 35,
        description: 'Premier groupe d\'adoration'
      },
      {
        id: '4',
        name: 'Mpiomana D2',
        churchId: '1',
        type: 'worship',
        memberCount: 30,
        description: 'Second groupe d\'adoration'
      }
    ]
  });

  const handleToggleKioskMode = () => {
    setIsKioskMode(!isKioskMode);
  };

  const handleAddSynode = (synodeData) => {
    const newSynode = {
      id: Date.now()?.toString(),
      ...synodeData,
      churchCount: 0,
      memberCount: 0,
      createdAt: new Date()?.toISOString()?.split('T')?.[0]
    };
    setOrganizationData(prev => ({
      ...prev,
      synodes: [...prev?.synodes, newSynode]
    }));
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddChurch = (churchData) => {
    const newChurch = {
      id: Date.now()?.toString(),
      ...churchData,
      groupCount: 0,
      memberCount: 0
    };
    setOrganizationData(prev => ({
      ...prev,
      churches: [...prev?.churches, newChurch]
    }));
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddGroup = (groupData) => {
    const newGroup = {
      id: Date.now()?.toString(),
      ...groupData,
      memberCount: 0
    };
    setOrganizationData(prev => ({
      ...prev,
      groups: [...prev?.groups, newGroup]
    }));
    setRefreshTrigger(prev => prev + 1);
  };

  const handleColorChange = (synodeId, newColor) => {
    setOrganizationData(prev => ({
      ...prev,
      synodes: prev?.synodes?.map(synode => 
        synode?.id === synodeId 
          ? { ...synode, colorCode: newColor }
          : synode
      )
    }));
    setRefreshTrigger(prev => prev + 1);
  };

  const customBreadcrumbs = [
    { label: 'Dashboard', path: '/', icon: 'Home' },
    { label: 'Organization Structure', path: '/organization-structure-management', icon: 'Building2', isLast: true }
  ];

  const tabs = [
    { id: 'synodes', label: 'Synodes', icon: 'Building2' },
    { id: 'churches', label: 'Churches', icon: 'Church' },
    { id: 'groups', label: 'Groups', icon: 'Users' }
  ];

  if (isKioskMode) {
    return <div className="p-8 text-center text-muted-foreground">Kiosk mode not available for this feature</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      } pb-20 lg:pb-0`}>
        
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex items-center justify-center w-8 h-8 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon 
                    name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} 
                    size={20} 
                  />
                </button>
                <h1 className="text-xl font-semibold text-foreground">
                  Organization Structure Management
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <KioskModeToggle 
                  isKioskMode={isKioskMode}
                  onToggle={handleToggleKioskMode}
                />
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
            {/* Left Sidebar - Tree View */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-foreground flex items-center">
                    <Icon name="TreePine" size={18} className="mr-2" />
                    Organization Structure
                  </h3>
                </div>
                <div className="p-4">
                  <OrganizationTreeView 
                    data={organizationData}
                    onSelectSynode={setSelectedSynode}
                    onSelectChurch={setSelectedChurch}
                    selectedSynode={selectedSynode}
                    selectedChurch={selectedChurch}
                  />
                  
                  {/* Quick Add Buttons */}
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      iconName="Plus"
                      onClick={() => setShowAddSynodeModal(true)}
                    >
                      Add Synode
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      iconName="Plus"
                      onClick={() => setShowAddChurchModal(true)}
                      disabled={!selectedSynode}
                    >
                      Add Church
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      iconName="Plus"
                      onClick={() => setShowAddGroupModal(true)}
                      disabled={!selectedChurch}
                    >
                      Add Group
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-card border border-border rounded-lg">
                {/* Top Toolbar */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {tabs?.map((tab) => (
                        <button
                          key={tab?.id}
                          onClick={() => setActiveTab(tab?.id)}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            flex items-center space-x-2
                            ${activeTab === tab?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <Icon name={tab?.icon} size={16} />
                          <span>{tab?.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Palette"
                        onClick={() => setShowColorPanel(!showColorPanel)}
                      >
                        Customize Colors
                      </Button>
                      <Button
                        size="sm"
                        iconName="Plus"
                        onClick={() => {
                          if (activeTab === 'synodes') setShowAddSynodeModal(true);
                          else if (activeTab === 'churches') setShowAddChurchModal(true);
                          else if (activeTab === 'groups') setShowAddGroupModal(true);
                        }}
                      >
                        Add {activeTab?.slice(0, -1)}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'synodes' && (
                    <SynodesManagement 
                      synodes={organizationData?.synodes}
                      churches={organizationData?.churches}
                      onColorChange={handleColorChange}
                      onEdit={(synode) => {
                        setSelectedSynode(synode);
                        setShowAddSynodeModal(true);
                      }}
                    />
                  )}
                  
                  {activeTab === 'churches' && (
                    <ChurchesManagement 
                      churches={organizationData?.churches}
                      synodes={organizationData?.synodes}
                      groups={organizationData?.groups}
                      onEdit={(church) => {
                        setSelectedChurch(church);
                        setShowAddChurchModal(true);
                      }}
                    />
                  )}
                  
                  {activeTab === 'groups' && (
                    <GroupsManagement 
                      groups={organizationData?.groups}
                      churches={organizationData?.churches}
                      synodes={organizationData?.synodes}
                      onEdit={(group) => {
                        setShowAddGroupModal(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Mobile Tabs */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium
                    flex items-center space-x-2 transition-colors
                    ${activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Content */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground capitalize">
                    {activeTab} Management
                  </h3>
                  <Button
                    size="sm"
                    iconName="Plus"
                    onClick={() => {
                      if (activeTab === 'synodes') setShowAddSynodeModal(true);
                      else if (activeTab === 'churches') setShowAddChurchModal(true);
                      else if (activeTab === 'groups') setShowAddGroupModal(true);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="p-4">
                {activeTab === 'synodes' && (
                  <SynodesManagement 
                    synodes={organizationData?.synodes}
                    churches={organizationData?.churches}
                    onColorChange={handleColorChange}
                    onEdit={(synode) => {
                      setSelectedSynode(synode);
                      setShowAddSynodeModal(true);
                    }}
                    isMobile={true}
                  />
                )}
                
                {activeTab === 'churches' && (
                  <ChurchesManagement 
                    churches={organizationData?.churches}
                    synodes={organizationData?.synodes}
                    groups={organizationData?.groups}
                    onEdit={(church) => {
                      setSelectedChurch(church);
                      setShowAddChurchModal(true);
                    }}
                    isMobile={true}
                  />
                )}
                
                {activeTab === 'groups' && (
                  <GroupsManagement 
                    groups={organizationData?.groups}
                    churches={organizationData?.churches}
                    synodes={organizationData?.synodes}
                    onEdit={(group) => {
                      setShowAddGroupModal(true);
                    }}
                    isMobile={true}
                  />
                )}
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Modals */}
      {showAddSynodeModal && (
        <AddSynodeModal
          isOpen={showAddSynodeModal}
          onClose={() => {
            setShowAddSynodeModal(false);
            setSelectedSynode(null);
          }}
          onSubmit={handleAddSynode}
          editData={selectedSynode}
        />
      )}

      {showAddChurchModal && (
        <AddChurchModal
          isOpen={showAddChurchModal}
          onClose={() => {
            setShowAddChurchModal(false);
            setSelectedChurch(null);
          }}
          onSubmit={handleAddChurch}
          synodes={organizationData?.synodes}
          editData={selectedChurch}
        />
      )}

      {showAddGroupModal && (
        <AddGroupModal
          isOpen={showAddGroupModal}
          onClose={() => setShowAddGroupModal(false)}
          onSubmit={handleAddGroup}
          churches={organizationData?.churches}
          synodes={organizationData?.synodes}
        />
      )}

      {/* Color Customization Panel */}
      {showColorPanel && (
        <ColorCustomizationPanel
          isOpen={showColorPanel}
          onClose={() => setShowColorPanel(false)}
          synodes={organizationData?.synodes}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  );
};

export default OrganizationStructureManagement;