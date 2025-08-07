import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const MemberFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  memberStats = { total: 0, active: 0, inactive: 0 }
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const synodOptions = [
    { value: '', label: 'All Synods' },
    { value: 'antananarivo', label: 'Antananarivo', color: '#2563EB' },
    { value: 'fianarantsoa', label: 'Fianarantsoa', color: '#DC2626' },
    { value: 'mahajanga', label: 'Mahajanga', color: '#059669' },
    { value: 'toamasina', label: 'Toamasina', color: '#D97706' },
    { value: 'antsiranana', label: 'Antsiranana', color: '#7C3AED' },
    { value: 'toliara', label: 'Toliara', color: '#DC2626' }
  ];

  const groupOptions = [
    { value: '', label: 'All Groups' },
    { value: 'mpiandry', label: 'Mpiandry' },
    { value: 'mpampianatra', label: 'Mpampianatra' },
    { value: 'mpiomana_d1', label: 'Mpiomana D1' },
    { value: 'mpiomana_d2', label: 'Mpiomana D2' }
  ];

  const localChurchOptions = [
    { value: '', label: 'All Churches' },
    { value: 'analakely', label: 'Analakely' },
    { value: 'isotry', label: 'Isotry' },
    { value: 'andohalo', label: 'Andohalo' },
    { value: 'faravohitra', label: 'Faravohitra' },
    { value: 'ambohipo', label: 'Ambohipo' }
  ];

  const attendanceOptions = [
    { value: '', label: 'All Members' },
    { value: 'active', label: 'Active (Last 7 days)' },
    { value: 'inactive_7', label: 'Inactive (7+ days)' },
    { value: 'inactive_30', label: 'Inactive (30+ days)' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-semibold text-card-foreground">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconSize={16}
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            iconName={isCollapsed ? "ChevronDown" : "ChevronUp"}
            iconSize={16}
          />
        </div>
      </div>
      {/* Member Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-foreground">{memberStats?.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <div className="text-lg font-semibold text-success">{memberStats?.active}</div>
          <div className="text-xs text-muted-foreground">Active</div>
        </div>
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <div className="text-lg font-semibold text-warning">{memberStats?.inactive}</div>
          <div className="text-xs text-muted-foreground">Inactive</div>
        </div>
      </div>
      {/* Filter Controls */}
      {!isCollapsed && (
        <div className="space-y-4">
          {/* Search */}
          <Input
            type="search"
            placeholder="Search members..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />

          {/* Synod Filter */}
          <Select
            label="Synod"
            options={synodOptions}
            value={filters?.synod || ''}
            onChange={(value) => handleFilterChange('synod', value)}
            className="w-full"
          />

          {/* Local Church Filter */}
          <Select
            label="Local Church"
            options={localChurchOptions}
            value={filters?.localChurch || ''}
            onChange={(value) => handleFilterChange('localChurch', value)}
            className="w-full"
          />

          {/* Group Filter */}
          <Select
            label="Group"
            options={groupOptions}
            value={filters?.group || ''}
            onChange={(value) => handleFilterChange('group', value)}
            className="w-full"
          />

          {/* Attendance Filter */}
          <Select
            label="Attendance Status"
            options={attendanceOptions}
            value={filters?.attendance || ''}
            onChange={(value) => handleFilterChange('attendance', value)}
            className="w-full"
          />

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Registration Date</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filters?.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
              <Input
                type="date"
                placeholder="To"
                value={filters?.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberFilters;