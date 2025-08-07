import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';


const FilterBar = ({ onApplyFilters, isLoading = false }) => {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    synod: '',
    group: '',
    church: ''
  });

  const dateRangeOptions = [
    { value: 'today', label: "Aujourd\'hui" },
    { value: 'yesterday', label: 'Hier' },
    { value: 'last7days', label: '7 derniers jours' },
    { value: 'last30days', label: '30 derniers jours' },
    { value: 'thisMonth', label: 'Ce mois' },
    { value: 'lastMonth', label: 'Mois dernier' },
    { value: 'thisYear', label: 'Cette année' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  const synodOptions = [
    { value: '', label: 'Tous les synodes' },
    { value: 'antananarivo', label: 'Antananarivo' },
    { value: 'fianarantsoa', label: 'Fianarantsoa' },
    { value: 'toamasina', label: 'Toamasina' },
    { value: 'mahajanga', label: 'Mahajanga' },
    { value: 'toliara', label: 'Toliara' },
    { value: 'antsiranana', label: 'Antsiranana' }
  ];

  const groupOptions = [
    { value: '', label: 'Tous les groupes' },
    { value: 'mpiandry', label: 'Mpiandry' },
    { value: 'mpampianatra', label: 'Mpampianatra' },
    { value: 'mpiomana_d1', label: 'Mpiomana D1' },
    { value: 'mpiomana_d2', label: 'Mpiomana D2' }
  ];

  const churchOptions = [
    { value: '', label: 'Toutes les églises' },
    { value: 'ambatonakanga', label: 'Ambatonakanga' },
    { value: 'analakely', label: 'Analakely' },
    { value: 'isotry', label: 'Isotry' },
    { value: 'faravohitra', label: 'Faravohitra' },
    { value: 'andohalo', label: 'Andohalo' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateRange: 'last30days',
      startDate: '',
      endDate: '',
      synod: '',
      group: '',
      church: ''
    };
    setFilters(resetFilters);
    if (onApplyFilters) {
      onApplyFilters(resetFilters);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Date Range */}
        <div className="lg:col-span-2">
          <Select
            label="Période"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
        </div>

        {/* Custom Date Range */}
        {filters?.dateRange === 'custom' && (
          <>
            <div>
              <Input
                label="Date de début"
                type="date"
                value={filters?.startDate}
                onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
              />
            </div>
            <div>
              <Input
                label="Date de fin"
                type="date"
                value={filters?.endDate}
                onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
              />
            </div>
          </>
        )}

        {/* Synod Filter */}
        <div>
          <Select
            label="Synode"
            options={synodOptions}
            value={filters?.synod}
            onChange={(value) => handleFilterChange('synod', value)}
          />
        </div>

        {/* Group Filter */}
        <div>
          <Select
            label="Groupe"
            options={groupOptions}
            value={filters?.group}
            onChange={(value) => handleFilterChange('group', value)}
          />
        </div>

        {/* Church Filter */}
        <div>
          <Select
            label="Église locale"
            options={churchOptions}
            value={filters?.church}
            onChange={(value) => handleFilterChange('church', value)}
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="default"
            onClick={handleApplyFilters}
            loading={isLoading}
            iconName="Filter"
            iconPosition="left"
          >
            Appliquer les filtres
          </Button>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Réinitialiser
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Dernière mise à jour: {new Date()?.toLocaleString('fr-FR')}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;