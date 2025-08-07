import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MemberSelectionPanel = ({ 
  members, 
  selectedMembers, 
  onMemberSelect, 
  onSelectAll, 
  onClearAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSynod, setSelectedSynod] = useState('');

  const groupOptions = [
    { value: '', label: 'All Groups' },
    { value: 'Mpiandry', label: 'Mpiandry' },
    { value: 'Mpampianatra', label: 'Mpampianatra' },
    { value: 'Mpiomana D1', label: 'Mpiomana D1' },
    { value: 'Mpiomana D2', label: 'Mpiomana D2' }
  ];

  const synodOptions = [
    { value: '', label: 'All Synods' },
    { value: 'Antananarivo', label: 'Antananarivo' },
    { value: 'Fianarantsoa', label: 'Fianarantsoa' },
    { value: 'Toamasina', label: 'Toamasina' },
    { value: 'Mahajanga', label: 'Mahajanga' },
    { value: 'Toliara', label: 'Toliara' },
    { value: 'Antsiranana', label: 'Antsiranana' }
  ];

  const filteredMembers = useMemo(() => {
    return members?.filter(member => {
      const matchesSearch = member?.firstName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           member?.lastName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesGroup = !selectedGroup || member?.group === selectedGroup;
      const matchesSynod = !selectedSynod || member?.synod === selectedSynod;
      
      return matchesSearch && matchesGroup && matchesSynod;
    });
  }, [members, searchTerm, selectedGroup, selectedSynod]);

  const handleSelectAll = () => {
    const allFilteredIds = filteredMembers?.map(member => member?.id);
    onSelectAll(allFilteredIds);
  };

  const isAllSelected = filteredMembers?.length > 0 && 
    filteredMembers?.every(member => selectedMembers?.includes(member?.id));

  const isIndeterminate = filteredMembers?.some(member => selectedMembers?.includes(member?.id)) && 
    !isAllSelected;

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">Select Members</h2>
        <div className="text-sm text-muted-foreground">
          {selectedMembers?.length} selected
        </div>
      </div>
      {/* Search */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-4"
        />
      </div>
      {/* Filters */}
      <div className="space-y-4 mb-6">
        <Select
          label="Filter by Group"
          options={groupOptions}
          value={selectedGroup}
          onChange={setSelectedGroup}
        />
        
        <Select
          label="Filter by Synod"
          options={synodOptions}
          value={selectedSynod}
          onChange={setSelectedSynod}
        />
      </div>
      {/* Bulk Actions */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <Checkbox
          label="Select All"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={handleSelectAll}
        />
        
        {selectedMembers?.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      {/* Members List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredMembers?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Users" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No members found</p>
          </div>
        ) : (
          filteredMembers?.map((member) => (
            <div
              key={member?.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Checkbox
                checked={selectedMembers?.includes(member?.id)}
                onChange={() => onMemberSelect(member?.id)}
              />
              
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={member?.photo}
                  alt={`${member?.firstName} ${member?.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-card-foreground truncate">
                  {member?.firstName} {member?.lastName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {member?.group} • {member?.synod}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Selection Summary */}
      {selectedMembers?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <Icon name="Check" size={16} className="inline mr-1" />
            {selectedMembers?.length} member{selectedMembers?.length !== 1 ? 's' : ''} selected for badge generation
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSelectionPanel;