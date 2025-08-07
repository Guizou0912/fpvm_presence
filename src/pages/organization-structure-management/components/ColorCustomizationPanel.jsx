import React, { useState } from 'react';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const ColorCustomizationPanel = ({ 
  isOpen, 
  onClose, 
  synodes, 
  onColorChange 
}) => {
  const [previewColors, setPreviewColors] = useState({});

  const predefinedColors = [
    { color: '#3B82F6', name: 'Bleu' },
    { color: '#10B981', name: 'Vert' },
    { color: '#F59E0B', name: 'Jaune' },
    { color: '#EF4444', name: 'Rouge' },
    { color: '#8B5CF6', name: 'Violet' },
    { color: '#06B6D4', name: 'Cyan' },
    { color: '#F97316', name: 'Orange' },
    { color: '#84CC16', name: 'Lime' },
    { color: '#EC4899', name: 'Rose' },
    { color: '#6B7280', name: 'Gris' },
    { color: '#14B8A6', name: 'Teal' },
    { color: '#F43F5E', name: 'Rose foncé' }
  ];

  const handleColorPreview = (synodeId, color) => {
    setPreviewColors(prev => ({
      ...prev,
      [synodeId]: color
    }));
  };

  const handleApplyColor = (synodeId, color) => {
    onColorChange?.(synodeId, color);
    setPreviewColors(prev => {
      const newPreviews = { ...prev };
      delete newPreviews?.[synodeId];
      return newPreviews;
    });
  };

  const handleSaveAll = () => {
    Object.entries(previewColors)?.forEach(([synodeId, color]) => {
      onColorChange?.(synodeId, color);
    });
    setPreviewColors({});
    onClose();
  };

  const getCurrentColor = (synodeId) => {
    return previewColors?.[synodeId] || synodes?.find(s => s?.id === synodeId)?.colorCode;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Personnalisation des couleurs de synodes
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div className="space-y-6">
            {synodes?.map((synode) => {
              const currentColor = getCurrentColor(synode?.id);
              const hasChanges = previewColors?.[synode?.id];
              
              return (
                <div
                  key={synode?.id}
                  className="p-4 border border-border rounded-lg bg-background"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: currentColor }}
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {synode?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {synode?.churchCount} églises • {synode?.memberCount} membres
                        </p>
                      </div>
                    </div>
                    
                    {hasChanges && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleColorPreview(synode?.id, synode?.colorCode)}
                        >
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApplyColor(synode?.id, previewColors?.[synode?.id])}
                        >
                          Appliquer
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                    {predefinedColors?.map((colorOption) => (
                      <button
                        key={colorOption?.color}
                        onClick={() => handleColorPreview(synode?.id, colorOption?.color)}
                        className={`
                          relative w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110
                          ${currentColor === colorOption?.color 
                            ? 'border-foreground ring-2 ring-ring ring-offset-2' 
                            : 'border-border'
                          }
                        `}
                        style={{ backgroundColor: colorOption?.color }}
                        title={colorOption?.name}
                      >
                        {currentColor === colorOption?.color && (
                          <Icon 
                            name="Check" 
                            size={16} 
                            className="absolute inset-0 m-auto text-white drop-shadow"
                          />
                        )}
                      </button>
                    ))}
                    
                    {/* Custom Color Picker */}
                    <div className="relative">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => handleColorPreview(synode?.id, e?.target?.value)}
                        className="w-10 h-10 border-2 border-border rounded-lg cursor-pointer"
                        title="Couleur personnalisée"
                      />
                      <Icon 
                        name="Palette" 
                        size={12} 
                        className="absolute bottom-0 right-0 bg-background rounded-full p-1 text-muted-foreground" 
                      />
                    </div>
                  </div>
                  {/* Preview Section */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Impact de cette couleur:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">Badges des membres</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="QrCode" size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">QR codes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Tag" size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">Identifiants visuels</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Les couleurs s'appliqueront automatiquement aux badges et QR codes
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Fermer
              </Button>
              
              {Object.keys(previewColors)?.length > 0 && (
                <Button
                  onClick={handleSaveAll}
                  iconName="Save"
                >
                  Sauvegarder tout ({Object.keys(previewColors)?.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCustomizationPanel;