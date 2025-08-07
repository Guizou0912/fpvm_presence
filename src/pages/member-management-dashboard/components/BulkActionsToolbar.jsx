import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsToolbar = ({ 
  selectedCount, 
  onBulkDownloadBadges, 
  onBulkExport, 
  onBulkDelete,
  onClearSelection 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleBulkDownload = async () => {
    setIsDownloading(true);
    try {
      await onBulkDownloadBadges();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBulkExport = async () => {
    setIsExporting(true);
    try {
      await onBulkExport();
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-6 elevation-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={20} />
          <span className="font-medium">
            {selectedCount} member{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBulkDownload}
            loading={isDownloading}
            iconName="Download"
            iconSize={16}
          >
            Download Badges
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBulkExport}
            loading={isExporting}
            iconName="FileText"
            iconSize={16}
          >
            Export Data
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            iconName="Trash2"
            iconSize={16}
          >
            Delete Selected
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconSize={16}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;