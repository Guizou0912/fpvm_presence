import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsPanel = ({ member }) => {
  // Mock statistics data
  const stats = {
    totalAttendances: 24,
    averageDuration: '2h 45min',
    lastAttendance: '2025-01-05',
    attendanceRate: 85,
    longestSession: '4h 15min',
    favoriteService: 'Culte dominical',
    monthlyAverage: 6,
    currentStreak: 3
  };

  const recentActivities = [
    {
      id: 1,
      type: 'attendance',
      description: 'Présence au culte dominical',
      date: '2025-01-05',
      duration: '3h 15min',
      icon: 'Church',
      color: 'text-primary'
    },
    {
      id: 2,
      type: 'attendance',
      description: 'Réunion de prière',
      date: '2025-01-03',
      duration: '2h 30min',
      icon: 'Heart',
      color: 'text-success'
    },
    {
      id: 3,
      type: 'badge_generated',
      description: 'Nouveau badge généré',
      date: '2024-12-30',
      icon: 'CreditCard',
      color: 'text-warning'
    },
    {
      id: 4,
      type: 'profile_updated',
      description: 'Profil mis à jour',
      date: '2024-12-28',
      icon: 'User',
      color: 'text-secondary'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getAttendanceRateColor = (rate) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getAttendanceRateBg = (rate) => {
    if (rate >= 80) return 'bg-success/10';
    if (rate >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="space-y-6">
      {/* Attendance Rate Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Taux de présence</h3>
          <div className={`px-3 py-1 rounded-full ${getAttendanceRateBg(stats?.attendanceRate)}`}>
            <span className={`text-sm font-medium ${getAttendanceRateColor(stats?.attendanceRate)}`}>
              {stats?.attendanceRate}%
            </span>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                stats?.attendanceRate >= 80 ? 'bg-success' :
                stats?.attendanceRate >= 60 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${stats?.attendanceRate}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Basé sur les 3 derniers mois
          </p>
        </div>
      </div>
      {/* Key Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Statistiques clés</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Présences totales</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">{stats?.totalAttendances}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Durée moyenne</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">{stats?.averageDuration}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Série actuelle</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">{stats?.currentStreak} semaines</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Icon name="Award" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Plus longue session</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">{stats?.longestSession}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Icon name="Heart" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Service préféré</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">{stats?.favoriteService}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Icon name="BarChart3" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Moyenne mensuelle</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">{stats?.monthlyAverage} présences</span>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Activité récente</h3>
        
        <div className="space-y-3">
          {recentActivities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity?.color} bg-current/10`}>
                <Icon name={activity?.icon} size={16} className={activity?.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">
                  {activity?.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activity?.date)}
                  </span>
                  {activity?.duration && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {activity?.duration}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors duration-150">
            Voir toute l'activité
          </button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Actions rapides</h3>
        
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-150 text-left">
            <Icon name="QrCode" size={16} className="text-primary" />
            <span className="text-sm text-card-foreground">Scanner QR code</span>
          </button>

          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-150 text-left">
            <Icon name="Download" size={16} className="text-success" />
            <span className="text-sm text-card-foreground">Télécharger badge</span>
          </button>

          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-150 text-left">
            <Icon name="FileText" size={16} className="text-warning" />
            <span className="text-sm text-card-foreground">Rapport de présence</span>
          </button>

          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-150 text-left">
            <Icon name="Mail" size={16} className="text-secondary" />
            <span className="text-sm text-card-foreground">Envoyer notification</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;