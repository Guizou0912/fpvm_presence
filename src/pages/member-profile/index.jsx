import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import PersonalInfoTab from './components/PersonalInfoTab';
import AttendanceHistoryTab from './components/AttendanceHistoryTab';
import QRBadgeTab from './components/QRBadgeTab';
import StatisticsPanel from './components/StatisticsPanel';

const MemberProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [currentTheme, setCurrentTheme] = useState('light');

  // Get member ID from URL params
  const memberId = searchParams?.get('id') || '1';

  // Mock member data
  const [member, setMember] = useState({
    id: memberId,
    firstName: 'Rakoto',
    lastName: 'Andriamampianina',
    email: 'rakoto.andriamampianina@gmail.com',
    phone: '+261 34 12 345 67',
    dateOfBirth: '1985-03-15',
    address: 'Lot II M 45 Antananarivo 101',
    group: 'mpiandry',
    synod: 'antananarivo',
    localChurch: 'fpvm_analakely',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    joinDate: '2020-01-15',
    status: 'active'
  });

  const [currentUser] = useState({
    name: 'Admin FPVM',
    role: 'admin',
    email: 'admin@fpvm.org'
  });

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'fr';
    setCurrentLanguage(savedLanguage);
  }, []);

  const tabs = [
    {
      id: 'personal',
      label: 'Informations personnelles',
      icon: 'User',
      component: PersonalInfoTab
    },
    {
      id: 'attendance',
      label: 'Historique de présence',
      icon: 'Calendar',
      component: AttendanceHistoryTab
    },
    {
      id: 'badge',
      label: 'Badge QR',
      icon: 'CreditCard',
      component: QRBadgeTab
    }
  ];

  const customBreadcrumbs = [
    { label: 'Accueil', path: '/', icon: 'Home' },
    { label: 'Tableau de bord', path: '/member-management-dashboard', icon: 'Users' },
    { label: 'Membres', path: '/member-management-dashboard', icon: 'Users' },
    { 
      label: `${member?.firstName} ${member?.lastName}`, 
      path: `/member-profile?id=${member?.id}`, 
      icon: 'User',
      isLast: true 
    }
  ];

  const handleSaveMember = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMember(prev => ({ ...prev, ...formData }));
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Membre supprimé avec succès !');
      navigate('/member-management-dashboard');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du membre');
    } finally {
      setIsLoading(false);
    }
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
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const ActiveTabComponent = tabs?.find(tab => tab?.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
        userRole={currentUser?.role}
      />
      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex p-2 hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name={isSidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                  Profil de {member?.firstName} {member?.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestion complète du profil membre
                </p>
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

        {/* Page Content */}
        <main className="p-6">
          {/* Breadcrumb */}
          <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-6">
              {/* Member Header Card */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Member Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-border">
                      {member?.photo ? (
                        <Image
                          src={member?.photo}
                          alt={`${member?.firstName} ${member?.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="User" size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-card-foreground">
                          {member?.firstName} {member?.lastName}
                        </h2>
                        <p className="text-muted-foreground">{member?.email}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>ID: {member?.id}</span>
                          <span>•</span>
                          <span>Membre depuis: {new Date(member.joinDate)?.toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <div className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                          Actif
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-card border border-border rounded-lg">
                <div className="border-b border-border">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`
                          flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                          ${activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                          }
                        `}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {ActiveTabComponent && (
                    <ActiveTabComponent
                      member={member}
                      onSave={handleSaveMember}
                      onDelete={handleDeleteMember}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Statistics Sidebar */}
            <div className="xl:col-span-1">
              <StatisticsPanel member={member} />
            </div>
          </div>
        </main>
      </div>
      {/* Mobile Bottom Spacing */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default MemberProfile;