import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';

// Import all components
import MemberFilters from './components/MemberFilters';
import MemberCard from './components/MemberCard';
import MemberTable from './components/MemberTable';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import AddMemberModal from './components/AddMemberModal';
import BulkImportModal from './components/BulkImportModal';
import MemberPagination from './components/MemberPagination';

const MemberManagementDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    synod: '',
    localChurch: '',
    group: '',
    attendance: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentTheme, setCurrentTheme] = useState('light');

  // Mock member data
  const mockMembers = [
    {
      id: 'member_001',
      memberId: 'FPVM001234',
      firstName: 'Jean',
      lastName: 'Rakoto',
      email: 'jean.rakoto@example.com',
      phone: '+261 34 12 345 67',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      synod: 'antananarivo',
      localChurch: 'Analakely',
      group: 'mpiandry',
      address: 'Lot 123 Analakely, Antananarivo',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      registrationDate: '2024-01-15T08:00:00Z',
      lastAttendance: '2025-01-05T10:30:00Z',
      totalVisits: 45,
      qrCode: 'qr_001234'
    },
    {
      id: 'member_002',
      memberId: 'FPVM001235',
      firstName: 'Marie',
      lastName: 'Ratsimba',
      email: 'marie.ratsimba@example.com',
      phone: '+261 33 98 765 43',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
      synod: 'fianarantsoa',
      localChurch: 'Isotry',
      group: 'mpampianatra',
      address: 'Lot 456 Isotry, Fianarantsoa',
      dateOfBirth: '1990-07-22',
      gender: 'female',
      registrationDate: '2024-02-20T09:15:00Z',
      lastAttendance: '2025-01-03T14:20:00Z',
      totalVisits: 32,
      qrCode: 'qr_001235'
    },
    {
      id: 'member_003',
      memberId: 'FPVM001236',
      firstName: 'Paul',
      lastName: 'Andriamahefa',
      email: 'paul.andriamahefa@example.com',
      phone: '+261 32 55 123 89',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      synod: 'mahajanga',
      localChurch: 'Andohalo',
      group: 'mpiomana_d1',
      address: 'Lot 789 Andohalo, Mahajanga',
      dateOfBirth: '1978-11-08',
      gender: 'male',
      registrationDate: '2023-12-10T11:30:00Z',
      lastAttendance: '2024-12-15T16:45:00Z',
      totalVisits: 78,
      qrCode: null
    },
    {
      id: 'member_004',
      memberId: 'FPVM001237',
      firstName: 'Hery',
      lastName: 'Rasolofo',
      email: 'hery.rasolofo@example.com',
      phone: '+261 34 77 888 99',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      synod: 'toamasina',
      localChurch: 'Faravohitra',
      group: 'mpiomana_d2',
      address: 'Lot 321 Faravohitra, Toamasina',
      dateOfBirth: '1982-05-30',
      gender: 'male',
      registrationDate: '2024-03-05T07:45:00Z',
      lastAttendance: '2025-01-06T09:15:00Z',
      totalVisits: 28,
      qrCode: 'qr_001237'
    },
    {
      id: 'member_005',
      memberId: 'FPVM001238',
      firstName: 'Naina',
      lastName: 'Razafy',
      email: 'naina.razafy@example.com',
      phone: '+261 33 44 555 66',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      synod: 'antsiranana',
      localChurch: 'Ambohipo',
      group: 'mpiandry',
      address: 'Lot 654 Ambohipo, Antsiranana',
      dateOfBirth: '1995-09-12',
      gender: 'female',
      registrationDate: '2024-04-18T13:20:00Z',
      lastAttendance: '2024-11-20T11:30:00Z',
      totalVisits: 15,
      qrCode: 'qr_001238'
    },
    {
      id: 'member_006',
      memberId: 'FPVM001239',
      firstName: 'Ravo',
      lastName: 'Randrianarisoa',
      email: 'ravo.randrianarisoa@example.com',
      phone: '+261 32 11 222 33',
      photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
      synod: 'toliara',
      localChurch: 'Analakely',
      group: 'mpampianatra',
      address: 'Lot 987 Analakely, Toliara',
      dateOfBirth: '1987-12-03',
      gender: 'male',
      registrationDate: '2024-05-22T15:10:00Z',
      lastAttendance: null,
      totalVisits: 0,
      qrCode: null
    }
  ];

  const [members, setMembers] = useState(mockMembers);

  // Load language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Filter and sort members
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members?.filter(member => {
      const matchesSearch = !filters?.search || 
        `${member?.firstName} ${member?.lastName}`?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        member?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        member?.memberId?.toLowerCase()?.includes(filters?.search?.toLowerCase());
      
      const matchesSynod = !filters?.synod || member?.synod === filters?.synod;
      const matchesChurch = !filters?.localChurch || member?.localChurch?.toLowerCase() === filters?.localChurch;
      const matchesGroup = !filters?.group || member?.group === filters?.group;
      
      const matchesAttendance = !filters?.attendance || (() => {
        if (filters?.attendance === 'active') {
          return member?.lastAttendance && 
            (new Date() - new Date(member.lastAttendance)) / (1000 * 60 * 60 * 24) <= 7;
        }
        if (filters?.attendance === 'inactive_7') {
          return !member?.lastAttendance || 
            (new Date() - new Date(member.lastAttendance)) / (1000 * 60 * 60 * 24) > 7;
        }
        if (filters?.attendance === 'inactive_30') {
          return !member?.lastAttendance || 
            (new Date() - new Date(member.lastAttendance)) / (1000 * 60 * 60 * 24) > 30;
        }
        return true;
      })();

      const matchesDateRange = (!filters?.dateFrom || new Date(member.registrationDate) >= new Date(filters.dateFrom)) &&
        (!filters?.dateTo || new Date(member.registrationDate) <= new Date(filters.dateTo));

      return matchesSearch && matchesSynod && matchesChurch && matchesGroup && matchesAttendance && matchesDateRange;
    });

    // Sort members
    filtered?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a?.firstName} ${a?.lastName}`?.toLowerCase();
          bValue = `${b?.firstName} ${b?.lastName}`?.toLowerCase();
          break;
        case 'registrationDate':
          aValue = new Date(a.registrationDate);
          bValue = new Date(b.registrationDate);
          break;
        case 'lastAttendance':
          aValue = a?.lastAttendance ? new Date(a.lastAttendance) : new Date(0);
          bValue = b?.lastAttendance ? new Date(b.lastAttendance) : new Date(0);
          break;
        case 'totalVisits':
          aValue = a?.totalVisits || 0;
          bValue = b?.totalVisits || 0;
          break;
        default:
          aValue = a?.[sortBy] || '';
          bValue = b?.[sortBy] || '';
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [members, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedMembers?.length / itemsPerPage);
  const paginatedMembers = filteredAndSortedMembers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Member statistics
  const memberStats = useMemo(() => {
    const total = members?.length;
    const active = members?.filter(member => 
      member?.lastAttendance && 
      (new Date() - new Date(member.lastAttendance)) / (1000 * 60 * 60 * 24) <= 7
    )?.length;
    const inactive = total - active;

    return { total, active, inactive };
  }, [members]);

  // Event handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      synod: '',
      localChurch: '',
      group: '',
      attendance: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  const handleSelectMember = (memberId, selected) => {
    if (selected) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev?.filter(id => id !== memberId));
    }
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedMembers(paginatedMembers?.map(member => member?.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  const handleSort = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedMembers([]);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedMembers([]);
  };

  const handleAddMember = async (memberData) => {
    setMembers(prev => [...prev, memberData]);
  };

  const handleEditMember = (member) => {
    navigate('/member-profile', { state: { member } });
  };

  const handleDeleteMember = (member) => {
    if (confirm(`Are you sure you want to delete ${member?.firstName} ${member?.lastName}?`)) {
      setMembers(prev => prev?.filter(m => m?.id !== member?.id));
      setSelectedMembers(prev => prev?.filter(id => id !== member?.id));
    }
  };

  const handleViewProfile = (member) => {
    navigate('/member-profile', { state: { member, mode: 'view' } });
  };

  const handleDownloadBadge = async (member) => {
    // Simulate badge download
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Downloading badge for:', member?.firstName, member?.lastName);
  };

  const handleBulkDownloadBadges = async () => {
    const selectedMemberData = members?.filter(member => selectedMembers?.includes(member?.id));
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Bulk downloading badges for:', selectedMemberData?.length, 'members');
    setSelectedMembers([]);
  };

  const handleBulkExport = async () => {
    const selectedMemberData = members?.filter(member => selectedMembers?.includes(member?.id));
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Bulk exporting data for:', selectedMemberData?.length, 'members');
    setSelectedMembers([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedMembers?.length} selected members?`)) {
      setMembers(prev => prev?.filter(member => !selectedMembers?.includes(member?.id)));
      setSelectedMembers([]);
    }
  };

  const handleBulkImport = async (results) => {
    console.log('Import completed:', results);
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
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
        userRole="admin"
      />
      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                iconName="Menu"
                iconSize={20}
                className="hidden lg:flex"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Member Management</h1>
                <p className="text-sm text-muted-foreground">Manage church members and generate QR badges</p>
              </div>
            </div>

            <UserProfileDropdown
              user={{ name: 'Admin User', role: 'admin', email: 'admin@fpvm.org' }}
              onLogout={handleLogout}
              onLanguageChange={handleLanguageChange}
              onThemeChange={handleThemeChange}
              currentLanguage={currentLanguage}
              currentTheme={currentTheme}
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <BreadcrumbNavigation />

          {/* Top Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowAddModal(true)}
                iconName="UserPlus"
                iconPosition="left"
              >
                Add Member
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowImportModal(true)}
                iconName="Upload"
                iconPosition="left"
              >
                Bulk Import
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/qr-badge-generator')}
                iconName="CreditCard"
                iconPosition="left"
              >
                Badge Generator
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  iconName="Grid3X3"
                  iconSize={16}
                />
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  iconName="List"
                  iconSize={16}
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            selectedCount={selectedMembers?.length}
            onBulkDownloadBadges={handleBulkDownloadBadges}
            onBulkExport={handleBulkExport}
            onBulkDelete={handleBulkDelete}
            onClearSelection={handleClearSelection}
          />

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <MemberFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                memberStats={memberStats}
              />
            </div>

            {/* Members Content */}
            <div className="lg:col-span-9 space-y-6">
              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredAndSortedMembers?.length} of {members?.length} members
                </span>
                {selectedMembers?.length > 0 && (
                  <span>
                    {selectedMembers?.length} selected
                  </span>
                )}
              </div>

              {/* Members Display */}
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedMembers?.map(member => (
                    <MemberCard
                      key={member?.id}
                      member={member}
                      isSelected={selectedMembers?.includes(member?.id)}
                      onSelect={handleSelectMember}
                      onEdit={handleEditMember}
                      onDelete={handleDeleteMember}
                      onDownloadBadge={handleDownloadBadge}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              ) : (
                <MemberTable
                  members={paginatedMembers}
                  selectedMembers={selectedMembers}
                  onSelectMember={handleSelectMember}
                  onSelectAll={handleSelectAll}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onDownloadBadge={handleDownloadBadge}
                  onViewProfile={handleViewProfile}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              )}

              {/* Pagination */}
              <MemberPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAndSortedMembers?.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </div>
        </main>
      </div>
      {/* Modals */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMember}
      />
      <BulkImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleBulkImport}
      />
      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

export default MemberManagementDashboard;