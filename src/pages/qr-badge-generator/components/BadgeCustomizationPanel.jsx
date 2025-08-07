import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BadgeCustomizationPanel = ({ 
  synodColors, 
  onSynodColorChange, 
  settings, 
  onSettingsChange 
}) => {
  const synodOptions = [
    { value: 'Antananarivo', label: 'Antananarivo' },
    { value: 'Fianarantsoa', label: 'Fianarantsoa' },
    { value: 'Toamasina', label: 'Toamasina' },
    { value: 'Mahajanga', label: 'Mahajanga' },
    { value: 'Toliara', label: 'Toliara' },
    { value: 'Antsiranana', label: 'Antsiranana' }
  ];

  const colorOptions = [
    { value: '#2563EB', label: 'Blue' },
    { value: '#DC2626', label: 'Red' },
    { value: '#059669', label: 'Green' },
    { value: '#D97706', label: 'Orange' },
    { value: '#7C3AED', label: 'Purple' },
    { value: '#0891B2', label: 'Cyan' }
  ];

  const paperSizeOptions = [
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
    { value: 'Legal', label: 'Legal (8.5 × 14 in)' }
  ];

  const handleColorChange = (synod, color) => {
    onSynodColorChange(synod, color);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">Badge Customization</h3>
      {/* Synod Colors */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-card-foreground">Synod Colors</h4>
        {synodOptions?.map((synod) => (
          <div key={synod?.value} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{synod?.label}</span>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: synodColors?.[synod?.value] || '#2563EB' }}
              />
              <Select
                options={colorOptions}
                value={synodColors?.[synod?.value] || '#2563EB'}
                onChange={(color) => handleColorChange(synod?.value, color)}
                className="w-32"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Layout Settings */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-card-foreground">Layout Settings</h4>
        
        <Select
          label="Paper Size"
          options={paperSizeOptions}
          value={settings?.paperSize}
          onChange={(value) => onSettingsChange({ ...settings, paperSize: value })}
        />

        <div className="space-y-3">
          <Checkbox
            label="Include cutting guides"
            checked={settings?.includeCuttingGuides}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              includeCuttingGuides: e?.target?.checked 
            })}
          />
          
          <Checkbox
            label="High quality print mode"
            checked={settings?.highQuality}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              highQuality: e?.target?.checked 
            })}
          />
          
          <Checkbox
            label="Include member ID"
            checked={settings?.includeMemberId}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              includeMemberId: e?.target?.checked 
            })}
          />
        </div>
      </div>
      {/* Badge Dimensions */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-card-foreground mb-2">Badge Specifications</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Size: 8.5cm × 5.5cm</div>
          <div>Format: Standard ID card</div>
          <div>Resolution: 300 DPI (print ready)</div>
        </div>
      </div>
    </div>
  );
};

export default BadgeCustomizationPanel;