import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const AbsenceTrackingCard = ({ absentMembers = [] }) => {
  const getAbsenceSeverity = (daysSinceLastAttendance) => {
    if (daysSinceLastAttendance >= 30) {
      return {
        level: 'critical',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20',
        icon: 'AlertTriangle',
        label: 'Critique'
      };
    } else if (daysSinceLastAttendance >= 14) {
      return {
        level: 'high',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        icon: 'AlertCircle',
        label: 'Élevé'
      };
    } else if (daysSinceLastAttendance >= 7) {
      return {
        level: 'medium',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        icon: 'Clock',
        label: 'Modéré'
      };
    }
    return {
      level: 'low',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
      borderColor: 'border-muted/20',
      icon: 'Info',
      label: 'Faible'
    };
  };

  const criticalAbsences = absentMembers?.filter(member => member?.daysSinceLastAttendance >= 30);
  const highAbsences = absentMembers?.filter(member => member?.daysSinceLastAttendance >= 14 && member?.daysSinceLastAttendance < 30);
  const mediumAbsences = absentMembers?.filter(member => member?.daysSinceLastAttendance >= 7 && member?.daysSinceLastAttendance < 14);

  const AbsenceMemberCard = ({ member }) => {
    const severity = getAbsenceSeverity(member?.daysSinceLastAttendance);
    
    return (
      <div className={`p-4 rounded-lg border ${severity?.borderColor} ${severity?.bgColor}`}>
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={member?.photo}
              alt={`${member?.name} ${member?.surname}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-card-foreground truncate">
                  {member?.name} {member?.surname}
                </h4>
                <p className="text-sm text-muted-foreground">{member?.group} • {member?.synod}</p>
                <p className="text-xs text-muted-foreground mt-1">{member?.church}</p>
              </div>
              <div className={`flex items-center space-x-1 ${severity?.color}`}>
                <Icon name={severity?.icon} size={16} />
                <span className="text-xs font-medium">{severity?.label}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Dernière présence: </span>
                <span className={severity?.color}>
                  {member?.daysSinceLastAttendance} jour{member?.daysSinceLastAttendance > 1 ? 's' : ''}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Phone"
                iconPosition="left"
              >
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            Suivi des absences
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Critique ({criticalAbsences?.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-muted-foreground">Élevé ({highAbsences?.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-warning/60"></div>
              <span className="text-muted-foreground">Modéré ({mediumAbsences?.length})</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {absentMembers?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="text-lg font-medium text-card-foreground mb-2">
              Aucune absence préoccupante
            </h4>
            <p className="text-muted-foreground">
              Tous les membres ont assisté aux services récemment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Critical Absences */}
            {criticalAbsences?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-destructive mb-3 flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} />
                  <span>Absences critiques (30+ jours)</span>
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {criticalAbsences?.slice(0, 4)?.map(member => (
                    <AbsenceMemberCard key={member?.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {/* High Priority Absences */}
            {highAbsences?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-warning mb-3 flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} />
                  <span>Absences élevées (14-29 jours)</span>
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {highAbsences?.slice(0, 4)?.map(member => (
                    <AbsenceMemberCard key={member?.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {/* Medium Priority Absences */}
            {mediumAbsences?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-warning mb-3 flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>Absences modérées (7-13 jours)</span>
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mediumAbsences?.slice(0, 4)?.map(member => (
                    <AbsenceMemberCard key={member?.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {/* View All Button */}
            {absentMembers?.length > 12 && (
              <div className="text-center pt-4 border-t border-border">
                <Button
                  variant="outline"
                  iconName="Eye"
                  iconPosition="left"
                >
                  Voir tous les membres absents ({absentMembers?.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsenceTrackingCard;