import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MetricsCard from './components/MetricsCard';
import FilterBar from './components/FilterBar';
import AttendanceChart from './components/AttendanceChart';
import MemberAnalysisTable from './components/MemberAnalysisTable';
import AbsenceTrackingCard from './components/AbsenceTrackingCard';
import ExportControls from './components/ExportControls';
import Icon from '../../components/AppIcon';

const AttendanceReports = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [currentTheme, setCurrentTheme] = useState('light');

  // Mock user data
  const currentUser = {
    name: 'Marie Rasoamalala',
    role: 'admin',
    email: 'marie.rasoamalala@fpvm.org'
  };

  // Mock metrics data
  const metricsData = [
    {
      title: 'Présences totales',
      value: '2,847',
      subtitle: 'Ce mois',
      icon: 'Users',
      trend: 'up',
      trendValue: '+12%',
      color: 'primary'
    },
    {
      title: 'Durée moyenne',
      value: '2h 15min',
      subtitle: 'Par service',
      icon: 'Clock',
      trend: 'up',
      trendValue: '+5min',
      color: 'success'
    },
    {
      title: 'Groupe le plus actif',
      value: 'Mpiandry',
      subtitle: '89% de présence',
      icon: 'TrendingUp',
      trend: 'neutral',
      color: 'warning'
    },
    {
      title: 'Membres absents',
      value: '47',
      subtitle: '7+ jours',
      icon: 'AlertTriangle',
      trend: 'down',
      trendValue: '-8',
      color: 'destructive'
    }
  ];

  // Mock attendance trend data
  const attendanceTrendData = [
    { date: '2025-01-01', attendance: 245, duration: 135 },
    { date: '2025-01-02', attendance: 289, duration: 142 },
    { date: '2025-01-03', attendance: 312, duration: 138 },
    { date: '2025-01-04', attendance: 298, duration: 145 },
    { date: '2025-01-05', attendance: 334, duration: 140 },
    { date: '2025-01-06', attendance: 356, duration: 148 },
    { date: '2025-01-07', attendance: 378, duration: 152 }
  ];

  // Mock group comparison data
  const groupComparisonData = [
    { name: 'Mpiandry', value: 89 },
    { name: 'Mpampianatra', value: 76 },
    { name: 'Mpiomana D1', value: 82 },
    { name: 'Mpiomana D2', value: 71 }
  ];

  // Mock member analysis data
  const memberAnalysisData = [
    {
      id: '1',
      name: 'Jean',
      surname: 'Rakoto',
      group: 'Mpiandry',
      synod: 'Antananarivo',
      church: 'Ambatonakanga',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      totalAttendance: 28,
      attendanceRate: 93,
      avgDuration: 145,
      lastAttendance: '2025-01-06'
    },
    {
      id: '2',
      name: 'Marie',
      surname: 'Razafy',
      group: 'Mpampianatra',
      synod: 'Fianarantsoa',
      church: 'Analakely',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      totalAttendance: 25,
      attendanceRate: 83,
      avgDuration: 138,
      lastAttendance: '2025-01-05'
    },
    {
      id: '3',
      name: 'Paul',
      surname: 'Andriamahefa',
      group: 'Mpiomana D1',
      synod: 'Toamasina',
      church: 'Isotry',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      totalAttendance: 22,
      attendanceRate: 73,
      avgDuration: 142,
      lastAttendance: '2025-01-04'
    },
    {
      id: '4',
      name: 'Hery',
      surname: 'Ramanana',
      group: 'Mpiomana D2',
      synod: 'Mahajanga',
      church: 'Faravohitra',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      totalAttendance: 18,
      attendanceRate: 60,
      avgDuration: 135,
      lastAttendance: '2025-01-03'
    },
    {
      id: '5',
      name: 'Nivo',
      surname: 'Raharison',
      group: 'Mpiandry',
      synod: 'Toliara',
      church: 'Andohalo',
      photo: 'https://randomuser.me/api/portraits/men/5.jpg',
      totalAttendance: 30,
      attendanceRate: 100,
      avgDuration: 155,
      lastAttendance: '2025-01-07'
    }
  ];

  // Mock absent members data
  const absentMembersData = [
    {
      id: '6',
      name: 'Lova',
      surname: 'Randriamampionona',
      group: 'Mpampianatra',
      synod: 'Antsiranana',
      church: 'Ambatonakanga',
      photo: 'https://randomuser.me/api/portraits/women/6.jpg',
      daysSinceLastAttendance: 35,
      lastAttendance: '2024-12-03'
    },
    {
      id: '7',
      name: 'Fidy',
      surname: 'Razanakolona',
      group: 'Mpiomana D1',
      synod: 'Antananarivo',
      church: 'Analakely',
      photo: 'https://randomuser.me/api/portraits/men/7.jpg',
      daysSinceLastAttendance: 21,
      lastAttendance: '2024-12-17'
    },
    {
      id: '8',
      name: 'Soa',
      surname: 'Rakotomalala',
      group: 'Mpiandry',
      synod: 'Fianarantsoa',
      church: 'Isotry',
      photo: 'https://randomuser.me/api/portraits/women/8.jpg',
      daysSinceLastAttendance: 12,
      lastAttendance: '2024-12-26'
    },
    {
      id: '9',
      name: 'Tovo',
      surname: 'Andrianjafy',
      group: 'Mpiomana D2',
      synod: 'Toamasina',
      church: 'Faravohitra',
      photo: 'https://randomuser.me/api/portraits/men/9.jpg',
      daysSinceLastAttendance: 8,
      lastAttendance: '2024-12-30'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'BarChart3' },
    { id: 'member-analysis', label: 'Analyse des membres', icon: 'Users' },
    { id: 'absence-tracking', label: 'Suivi des absences', icon: 'AlertTriangle' }
  ];

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('fpvm-language') || 'fr';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('fpvm-language', language);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('fpvm-theme', theme);
  };

  const handleLogout = () => {
    localStorage.removeItem('fpvm-auth');
    window.location.href = '/login';
  };

  const handleApplyFilters = (filters) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Filters applied:', filters);
    }, 1500);
  };

  const handleExport = (exportConfig) => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log('Export completed:', exportConfig);
      // In real app, trigger download here
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
        userRole={currentUser?.role}
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name={isSidebarCollapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Rapports de présence</h1>
                <p className="text-sm text-muted-foreground">
                  Analyses et statistiques de fréquentation
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

        {/* Main Content */}
        <main className="p-6 pb-20 lg:pb-6">
          <BreadcrumbNavigation />

          {/* Filter Bar */}
          <FilterBar onApplyFilters={handleApplyFilters} isLoading={isLoading} />

          {/* Loading State */}
          {isLoading && (
            <div className="bg-card border border-border rounded-lg p-8 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Génération du rapport en cours...</span>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metricsData?.map((metric, index) => (
                  <MetricsCard key={index} {...metric} />
                ))}
              </div>

              {/* Tabs */}
              <div className="bg-card border border-border rounded-lg mb-6">
                <div className="border-b border-border">
                  <nav className="flex space-x-8 px-6">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`
                          flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                          ${activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                          }
                        `}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <AttendanceChart
                          data={attendanceTrendData}
                          type="line"
                          title="Tendance des présences"
                          height={350}
                        />
                        <AttendanceChart
                          data={groupComparisonData}
                          type="bar"
                          title="Comparaison par groupe"
                          height={350}
                        />
                      </div>
                    </div>
                  )}

                  {/* Member Analysis Tab */}
                  {activeTab === 'member-analysis' && (
                    <MemberAnalysisTable members={memberAnalysisData} />
                  )}

                  {/* Absence Tracking Tab */}
                  {activeTab === 'absence-tracking' && (
                    <AbsenceTrackingCard absentMembers={absentMembersData} />
                  )}
                </div>
              </div>

              {/* Export Controls */}
              <ExportControls onExport={handleExport} isExporting={isExporting} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AttendanceReports;