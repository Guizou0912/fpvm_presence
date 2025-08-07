import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActionsToolbar = ({ 
  selectedCount, 
  onGenerateSelected, 
  onDownloadAll, 
  onPrintPreview, 
  isProcessing, 
  processingProgress 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            <Icon name="Users" size={16} className="inline mr-1" />
            {selectedCount} member{selectedCount !== 1 ? 's' : ''} selected
          </div>
          
          {isProcessing && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">
                Processing... {processingProgress}%
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            iconName="Zap"
            iconPosition="left"
            onClick={onGenerateSelected}
            disabled={selectedCount === 0 || isProcessing}
            loading={isProcessing}
          >
            Generate Selected
          </Button>

          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onDownloadAll}
            disabled={selectedCount === 0 || isProcessing}
          >
            Download All
          </Button>

          <Button
            variant="outline"
            iconName="Printer"
            iconPosition="left"
            onClick={onPrintPreview}
            disabled={selectedCount === 0 || isProcessing}
          >
            Print Preview
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsToolbar;