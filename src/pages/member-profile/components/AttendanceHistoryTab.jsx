import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AttendanceHistoryTab = ({ member }) => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock attendance data
  const attendanceRecords = [
    {
      id: 1,
      date: '2025-01-05',
      entryTime: '08:30:00',
      exitTime: '11:45:00',
      duration: '3h 15min',
      service: 'Culte dominical',
      location: 'FPVM Analakely'
    },
    {
      id: 2,
      date: '2025-01-03',
      entryTime: '19:00:00',
      exitTime: '21:30:00',
      duration: '2h 30min',
      service: 'Réunion de prière',
      location: 'FPVM Analakely'
    },
    {
      id: 3,
      date: '2024-12-29',
      entryTime: '08:15:00',
      exitTime: '12:00:00',
      duration: '3h 45min',
      service: 'Culte dominical',
      location: 'FPVM Analakely'
    },
    {
      id: 4,
      date: '2024-12-25',
      entryTime: '09:00:00',
      exitTime: '11:30:00',
      duration: '2h 30min',
      service: 'Culte de Noël',
      location: 'FPVM Analakely'
    },
    {
      id: 5,
      date: '2024-12-22',
      entryTime: '08:45:00',
      exitTime: '11:15:00',
      duration: '2h 30min',
      service: 'Culte dominical',
      location: 'FPVM Analakely'
    },
    {
      id: 6,
      date: '2024-12-19',
      entryTime: '19:15:00',
      exitTime: '21:00:00',
      duration: '1h 45min',
      service: 'Réunion de prière',
      location: 'FPVM Analakely'
    },
    {
      id: 7,
      date: '2024-12-15',
      entryTime: '08:30:00',
      exitTime: '11:45:00',
      duration: '3h 15min',
      service: 'Culte dominical',
      location: 'FPVM Analakely'
    },
    {
      id: 8,
      date: '2024-12-12',
      entryTime: '19:00:00',
      exitTime: '20:45:00',
      duration: '1h 45min',
      service: 'Réunion de prière',
      location: 'FPVM Analakely'
    }
  ];

  const periodOptions = [
    { value: 'all', label: 'Toute la période' },
    { value: '7days', label: '7 derniers jours' },
    { value: '30days', label: '30 derniers jours' },
    { value: '3months', label: '3 derniers mois' },
    { value: '6months', label: '6 derniers mois' },
    { value: '1year', label: '1 an' }
  ];

  const sortOptions = [
    { value: 'desc', label: 'Plus récent en premier' },
    { value: 'asc', label: 'Plus ancien en premier' }
  ];

  const filteredRecords = useMemo(() => {
    let filtered = [...attendanceRecords];
    
    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filterPeriod) {
        case '7days':
          cutoffDate?.setDate(now?.getDate() - 7);
          break;
        case '30days':
          cutoffDate?.setDate(now?.getDate() - 30);
          break;
        case '3months':
          cutoffDate?.setMonth(now?.getMonth() - 3);
          break;
        case '6months':
          cutoffDate?.setMonth(now?.getMonth() - 6);
          break;
        case '1year':
          cutoffDate?.setFullYear(now?.getFullYear() - 1);
          break;
      }
      
      filtered = filtered?.filter(record => new Date(record.date) >= cutoffDate);
    }
    
    // Sort records
    filtered?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [filterPeriod, sortOrder]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getServiceIcon = (service) => {
    if (service?.includes('Culte')) return 'Church';
    if (service?.includes('prière')) return 'Heart';
    return 'Calendar';
  };

  const getServiceColor = (service) => {
    if (service?.includes('Culte')) return 'text-primary';
    if (service?.includes('prière')) return 'text-success';
    return 'text-warning';
  };

  // Calculate statistics
  const totalAttendances = filteredRecords?.length;
  const totalDuration = filteredRecords?.reduce((acc, record) => {
    const [hours, minutes] = record?.duration?.split('h ');
    const h = parseInt(hours);
    const m = parseInt(minutes?.replace('min', ''));
    return acc + (h * 60) + m;
  }, 0);
  const averageDuration = totalAttendances > 0 ? Math.round(totalDuration / totalAttendances) : 0;

  const exportToPDF = () => {
    // Mock PDF export functionality
    alert('Export PDF en cours de développement...');
  };

  const exportToExcel = () => {
    // Mock Excel export functionality
    alert('Export Excel en cours de développement...');
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalAttendances}</p>
              <p className="text-sm text-muted-foreground">Présences totales</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {Math.floor(averageDuration / 60)}h {averageDuration % 60}min
              </p>
              <p className="text-sm text-muted-foreground">Durée moyenne</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
              </p>
              <p className="text-sm text-muted-foreground">Temps total</p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters and Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Select
              label="Période"
              options={periodOptions}
              value={filterPeriod}
              onChange={setFilterPeriod}
              className="w-full sm:w-48"
            />

            <Select
              label="Tri"
              options={sortOptions}
              value={sortOrder}
              onChange={setSortOrder}
              className="w-full sm:w-48"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={exportToPDF}
              iconName="FileText"
              iconPosition="left"
            >
              Export PDF
            </Button>
            
            <Button
              variant="outline"
              onClick={exportToExcel}
              iconName="Download"
              iconPosition="left"
            >
              Export Excel
            </Button>
          </div>
        </div>
      </div>
      {/* Attendance Records */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground">
            Historique des présences ({filteredRecords?.length} enregistrements)
          </h3>
        </div>

        <div className="divide-y divide-border">
          {filteredRecords?.length > 0 ? (
            filteredRecords?.map((record) => (
              <div key={record?.id} className="p-6 hover:bg-muted/50 transition-colors duration-150">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getServiceColor(record?.service)} bg-current/10`}>
                      <Icon name={getServiceIcon(record?.service)} size={20} className={getServiceColor(record?.service)} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <h4 className="font-medium text-card-foreground">{record?.service}</h4>
                        <span className="text-sm text-muted-foreground">{record?.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(record?.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="LogIn" size={16} className="text-success" />
                      <span className="text-muted-foreground">Entrée:</span>
                      <span className="font-medium text-card-foreground">{record?.entryTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="LogOut" size={16} className="text-destructive" />
                      <span className="text-muted-foreground">Sortie:</span>
                      <span className="font-medium text-card-foreground">{record?.exitTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-primary" />
                      <span className="font-medium text-primary">{record?.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                Aucune présence trouvée
              </h3>
              <p className="text-muted-foreground">
                Aucun enregistrement de présence pour la période sélectionnée.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryTab;