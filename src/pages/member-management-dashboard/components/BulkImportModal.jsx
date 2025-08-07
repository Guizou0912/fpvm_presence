import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkImportModal = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileSelect(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && (file?.type === 'text/csv' || file?.name?.endsWith('.csv') || file?.name?.endsWith('.xlsx'))) {
      setSelectedFile(file);
      setImportResults(null);
    } else {
      alert('Please select a valid CSV or Excel file');
    }
  };

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileSelect(e?.target?.files?.[0]);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock import results
      const mockResults = {
        total: 150,
        successful: 142,
        failed: 8,
        errors: [
          { row: 15, error: 'Invalid email format: john.doe@invalid' },
          { row: 23, error: 'Missing required field: synod' },
          { row: 45, error: 'Duplicate member ID: FPVM123456' },
          { row: 67, error: 'Invalid group: InvalidGroup' },
          { row: 89, error: 'Missing required field: firstName' },
          { row: 101, error: 'Invalid phone format: +261-invalid' },
          { row: 123, error: 'Missing required field: localChurch' },
          { row: 134, error: 'Invalid date format: 32/13/2023' }
        ]
      };
      
      setImportResults(mockResults);
      
      if (onImport) {
        await onImport(mockResults);
      }
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `firstName,lastName,email,phone,synod,localChurch,group,dateOfBirth,gender,address,photo
Jean,Rakoto,jean.rakoto@example.com,+261 34 12 345 67,antananarivo,analakely,mpiandry,1985-03-15,male,"Lot 123 Analakely",https://example.com/photo1.jpg
Marie,Ratsimba,marie.ratsimba@example.com,+261 33 98 765 43,fianarantsoa,isotry,mpampianatra,1990-07-22,female,"Lot 456 Isotry",https://example.com/photo2.jpg`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_import_template.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResults(null);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success text-success-foreground rounded-full flex items-center justify-center">
              <Icon name="Upload" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Bulk Import Members</h2>
              <p className="text-sm text-muted-foreground">Import multiple members from CSV or Excel file</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Template Download */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Download Template</h3>
                <p className="text-sm text-muted-foreground">Get the CSV template with required columns</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                iconName="Download"
                iconPosition="left"
              >
                Template
              </Button>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
              ${selectedFile ? 'border-success bg-success/5' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-3">
                <Icon name="FileCheck" size={48} className="mx-auto text-success" />
                <div>
                  <p className="font-medium text-card-foreground">{selectedFile?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile?.size / 1024)?.toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  iconName="X"
                  iconPosition="left"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium text-card-foreground">Drop your file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef?.current?.click()}
                  iconName="FolderOpen"
                  iconPosition="left"
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Import Results */}
          {importResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-card-foreground">{importResults?.total}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="bg-success/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success">{importResults?.successful}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="bg-destructive/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">{importResults?.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>

              {importResults?.errors?.length > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-2">Import Errors</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {importResults?.errors?.map((error, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        <span className="font-mono">Row {error?.row}:</span> {error?.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              {importResults ? 'Close' : 'Cancel'}
            </Button>
            {!importResults && (
              <Button
                onClick={processFile}
                disabled={!selectedFile}
                loading={isProcessing}
                iconName="Upload"
                iconPosition="left"
              >
                Import Members
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;