import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ExportControls = ({ onExport, isExporting = false }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    reportType: 'complete',
    includeCharts: true,
    includeMemberDetails: true,
    includeAbsenceTracking: true,
    dateRange: 'current'
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel (XLSX)' },
    { value: 'csv', label: 'CSV' }
  ];

  const reportTypeOptions = [
    { value: 'complete', label: 'Rapport complet' },
    { value: 'summary', label: 'Résumé exécutif' },
    { value: 'attendance_only', label: 'Présences uniquement' },
    { value: 'absence_tracking', label: 'Suivi des absences' },
    { value: 'member_analysis', label: 'Analyse des membres' }
  ];

  const dateRangeOptions = [
    { value: 'current', label: 'Période actuelle' },
    { value: 'last_month', label: 'Mois dernier' },
    { value: 'last_quarter', label: 'Trimestre dernier' },
    { value: 'last_year', label: 'Année dernière' }
  ];

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExport = () => {
    if (onExport) {
      onExport(exportConfig);
    }
  };

  const getExportIcon = () => {
    switch (exportConfig?.format) {
      case 'pdf':
        return 'FileText';
      case 'excel':
        return 'FileSpreadsheet';
      case 'csv':
        return 'Database';
      default:
        return 'Download';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
          <Icon name="Download" size={20} />
          <span>Exporter le rapport</span>
        </h3>
        <div className="text-sm text-muted-foreground">
          Personnalisez votre export
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Format Selection */}
        <div>
          <Select
            label="Format d'export"
            options={formatOptions}
            value={exportConfig?.format}
            onChange={(value) => handleConfigChange('format', value)}
          />
        </div>

        {/* Report Type */}
        <div>
          <Select
            label="Type de rapport"
            options={reportTypeOptions}
            value={exportConfig?.reportType}
            onChange={(value) => handleConfigChange('reportType', value)}
          />
        </div>

        {/* Date Range */}
        <div>
          <Select
            label="Période"
            options={dateRangeOptions}
            value={exportConfig?.dateRange}
            onChange={(value) => handleConfigChange('dateRange', value)}
          />
        </div>
      </div>
      {/* Export Options */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-card-foreground mb-4">Options d'inclusion</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Inclure les graphiques"
            description="Ajouter les visualisations de données"
            checked={exportConfig?.includeCharts}
            onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
            disabled={exportConfig?.format === 'csv'}
          />
          <Checkbox
            label="Détails des membres"
            description="Informations complètes des membres"
            checked={exportConfig?.includeMemberDetails}
            onChange={(e) => handleConfigChange('includeMemberDetails', e?.target?.checked)}
          />
          <Checkbox
            label="Suivi des absences"
            description="Liste des membres absents"
            checked={exportConfig?.includeAbsenceTracking}
            onChange={(e) => handleConfigChange('includeAbsenceTracking', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-6 border-t border-border gap-4">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Info" size={16} />
            <span>Aperçu de l'export:</span>
          </div>
          <ul className="text-xs space-y-1 ml-6">
            <li>• Format: {formatOptions?.find(f => f?.value === exportConfig?.format)?.label}</li>
            <li>• Type: {reportTypeOptions?.find(r => r?.value === exportConfig?.reportType)?.label}</li>
            <li>• Période: {dateRangeOptions?.find(d => d?.value === exportConfig?.dateRange)?.label}</li>
          </ul>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
          >
            Aperçu
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            iconName={getExportIcon()}
            iconPosition="left"
          >
            {isExporting ? 'Export en cours...' : 'Exporter'}
          </Button>
        </div>
      </div>
      {/* Quick Export Buttons */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Exports rapides</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            iconPosition="left"
            onClick={() => {
              const quickConfig = { ...exportConfig, format: 'pdf', reportType: 'summary' };
              if (onExport) onExport(quickConfig);
            }}
          >
            PDF Résumé
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="FileSpreadsheet"
            iconPosition="left"
            onClick={() => {
              const quickConfig = { ...exportConfig, format: 'excel', reportType: 'complete' };
              if (onExport) onExport(quickConfig);
            }}
          >
            Excel Complet
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Database"
            iconPosition="left"
            onClick={() => {
              const quickConfig = { ...exportConfig, format: 'csv', reportType: 'attendance_only' };
              if (onExport) onExport(quickConfig);
            }}
          >
            CSV Présences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;