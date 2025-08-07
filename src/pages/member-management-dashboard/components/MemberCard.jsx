import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const MemberCard = ({ 
  member, 
  isSelected = false, 
  onSelect, 
  onEdit, 
  onDelete, 
  onDownloadBadge,
  onViewProfile 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getSynodColor = (synod) => {
    const colors = {
      antananarivo: '#2563EB',
      fianarantsoa: '#DC2626',
      mahajanga: '#059669',
      toamasina: '#D97706',
      antsiranana: '#7C3AED',
      toliara: '#DC2626'
    };
    return colors?.[synod] || '#64748B';
  };

  const getGroupBadgeColor = (group) => {
    const colors = {
      mpiandry: 'bg-blue-100 text-blue-800',
      mpampianatra: 'bg-green-100 text-green-800',
      mpiomana_d1: 'bg-purple-100 text-purple-800',
      mpiomana_d2: 'bg-orange-100 text-orange-800'
    };
    return colors?.[group] || 'bg-gray-100 text-gray-800';
  };

  const getAttendanceStatus = (lastAttendance) => {
    if (!lastAttendance) return { status: 'never', color: 'text-gray-500', text: 'Never attended' };
    
    const daysSince = Math.floor((new Date() - new Date(lastAttendance)) / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 7) return { status: 'active', color: 'text-success', text: `${daysSince} days ago` };
    if (daysSince <= 30) return { status: 'inactive', color: 'text-warning', text: `${daysSince} days ago` };
    return { status: 'very_inactive', color: 'text-destructive', text: `${daysSince} days ago` };
  };

  const handleDownloadBadge = async () => {
    setIsLoading(true);
    try {
      await onDownloadBadge(member);
    } finally {
      setIsLoading(false);
    }
  };

  const attendanceInfo = getAttendanceStatus(member?.lastAttendance);

  return (
    <div className={`
      bg-card border rounded-lg p-4 transition-all duration-200 hover:elevation-subtle
      ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
    `}>
      {/* Header with Checkbox and Actions */}
      <div className="flex items-start justify-between mb-3">
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(member?.id, e?.target?.checked)}
          className="mt-1"
        />
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewProfile(member)}
            iconName="Eye"
            iconSize={16}
            title="View Profile"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(member)}
            iconName="Edit"
            iconSize={16}
            title="Edit Member"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadBadge}
            loading={isLoading}
            iconName="Download"
            iconSize={16}
            title="Download Badge"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(member)}
            iconName="Trash2"
            iconSize={16}
            title="Delete Member"
          />
        </div>
      </div>
      {/* Member Photo and Basic Info */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
          <Image
            src={member?.photo}
            alt={`${member?.firstName} ${member?.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card"
            style={{ backgroundColor: getSynodColor(member?.synod) }}
            title={member?.synod}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">
            {member?.firstName} {member?.lastName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{member?.localChurch}</p>
        </div>
      </div>
      {/* Group Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGroupBadgeColor(member?.group)}`}>
          {member?.group?.replace('_', ' ')?.toUpperCase()}
        </span>
      </div>
      {/* Member Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Member ID:</span>
          <span className="font-mono text-xs">{member?.memberId}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Registered:</span>
          <span>{new Date(member.registrationDate)?.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Last Attendance:</span>
          <span className={attendanceInfo?.color}>{attendanceInfo?.text}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Visits:</span>
          <span className="font-semibold">{member?.totalVisits || 0}</span>
        </div>
      </div>
      {/* QR Code Status */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="QrCode" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">QR Badge:</span>
          </div>
          <div className="flex items-center space-x-2">
            {member?.qrCode ? (
              <span className="text-success">Generated</span>
            ) : (
              <span className="text-warning">Pending</span>
            )}
            <div className="w-2 h-2 rounded-full bg-current opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;