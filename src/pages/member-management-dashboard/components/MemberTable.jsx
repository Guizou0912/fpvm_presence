import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const MemberTable = ({ 
  members, 
  selectedMembers, 
  onSelectMember, 
  onSelectAll, 
  onEdit, 
  onDelete, 
  onDownloadBadge,
  onViewProfile,
  sortBy,
  sortOrder,
  onSort 
}) => {
  const [loadingBadges, setLoadingBadges] = useState(new Set());

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
    if (!lastAttendance) return { status: 'never', color: 'text-gray-500', text: 'Never' };
    
    const daysSince = Math.floor((new Date() - new Date(lastAttendance)) / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 7) return { status: 'active', color: 'text-success', text: `${daysSince}d ago` };
    if (daysSince <= 30) return { status: 'inactive', color: 'text-warning', text: `${daysSince}d ago` };
    return { status: 'very_inactive', color: 'text-destructive', text: `${daysSince}d ago` };
  };

  const handleDownloadBadge = async (member) => {
    setLoadingBadges(prev => new Set([...prev, member.id]));
    try {
      await onDownloadBadge(member);
    } finally {
      setLoadingBadges(prev => {
        const newSet = new Set(prev);
        newSet?.delete(member?.id);
        return newSet;
      });
    }
  };

  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(column, newOrder);
  };

  const SortableHeader = ({ column, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortBy === column && (
          <Icon 
            name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            size={14} 
          />
        )}
      </div>
    </th>
  );

  const allSelected = members?.length > 0 && members?.every(member => selectedMembers?.includes(member?.id));
  const someSelected = selectedMembers?.length > 0 && !allSelected;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <SortableHeader column="name">Member</SortableHeader>
              <SortableHeader column="group">Group</SortableHeader>
              <SortableHeader column="synod">Synod</SortableHeader>
              <SortableHeader column="localChurch">Church</SortableHeader>
              <SortableHeader column="registrationDate">Registered</SortableHeader>
              <SortableHeader column="lastAttendance">Last Visit</SortableHeader>
              <SortableHeader column="totalVisits">Visits</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                QR Badge
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {members?.map((member) => {
              const attendanceInfo = getAttendanceStatus(member?.lastAttendance);
              const isSelected = selectedMembers?.includes(member?.id);
              const isBadgeLoading = loadingBadges?.has(member?.id);

              return (
                <tr 
                  key={member?.id}
                  className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => onSelectMember(member?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={member?.photo}
                          alt={`${member?.firstName} ${member?.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div 
                          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-card"
                          style={{ backgroundColor: getSynodColor(member?.synod) }}
                          title={member?.synod}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-card-foreground">
                          {member?.firstName} {member?.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {member?.memberId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGroupBadgeColor(member?.group)}`}>
                      {member?.group?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getSynodColor(member?.synod) }}
                      />
                      <span className="text-sm text-card-foreground capitalize">
                        {member?.synod}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-card-foreground">
                    {member?.localChurch}
                  </td>
                  <td className="px-4 py-4 text-sm text-card-foreground">
                    {new Date(member.registrationDate)?.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm ${attendanceInfo?.color}`}>
                      {attendanceInfo?.text}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-card-foreground">
                    {member?.totalVisits || 0}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      {member?.qrCode ? (
                        <div className="flex items-center space-x-1 text-success">
                          <Icon name="CheckCircle" size={16} />
                          <span className="text-xs">Ready</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-warning">
                          <Icon name="Clock" size={16} />
                          <span className="text-xs">Pending</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProfile(member)}
                        iconName="Eye"
                        iconSize={14}
                        title="View Profile"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(member)}
                        iconName="Edit"
                        iconSize={14}
                        title="Edit Member"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadBadge(member)}
                        loading={isBadgeLoading}
                        iconName="Download"
                        iconSize={14}
                        title="Download Badge"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(member)}
                        iconName="Trash2"
                        iconSize={14}
                        title="Delete Member"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {members?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No members found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add new members to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MemberTable;