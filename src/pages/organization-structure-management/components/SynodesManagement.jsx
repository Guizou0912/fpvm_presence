import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const SynodesManagement = ({ 
  synodes, 
  churches, 
  onColorChange, 
  onEdit, 
  isMobile = false 
}) => {
  const getChurchCountForSynode = (synodeId) => {
    return churches?.filter(church => church?.synodeId === synodeId)?.length || 0;
  };

  const handleColorPicker = (synodeId, event) => {
    event.stopPropagation();
    onColorChange?.(synodeId, event.target?.value);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {synodes?.map((synode) => (
          <div
            key={synode?.id}
            className="bg-background border border-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: synode?.colorCode }}
                />
                <div>
                  <h4 className="font-medium text-foreground">
                    {synode?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Créé le {new Date(synode?.createdAt)?.toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreVertical"
                onClick={() => onEdit?.(synode)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {getChurchCountForSynode(synode?.id)}
                </div>
                <div className="text-xs text-muted-foreground">Églises</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {synode?.memberCount}
                </div>
                <div className="text-xs text-muted-foreground">Membres</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-xs text-muted-foreground">Couleur:</label>
                <input
                  type="color"
                  value={synode?.colorCode}
                  onChange={(e) => handleColorPicker(synode?.id, e)}
                  className="w-6 h-6 border border-border rounded cursor-pointer"
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Edit2"
                  onClick={() => onEdit?.(synode)}
                >
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {synodes?.map((synode) => (
          <div
            key={synode?.id}
            className="bg-background border border-border rounded-lg p-6 hover:shadow-sm transition-shadow"
            style={{ borderLeftColor: synode?.colorCode, borderLeftWidth: '4px' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
                  style={{ backgroundColor: synode?.colorCode }}
                />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {synode?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Créé le {new Date(synode?.createdAt)?.toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={synode?.colorCode}
                  onChange={(e) => handleColorPicker(synode?.id, e)}
                  className="w-8 h-8 border border-border rounded cursor-pointer"
                  title="Changer la couleur"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MoreVertical"
                  onClick={() => onEdit?.(synode)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {getChurchCountForSynode(synode?.id)}
                </div>
                <div className="text-sm text-muted-foreground">Églises</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {synode?.memberCount}
                </div>
                <div className="text-sm text-muted-foreground">Membres</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Palette" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {synode?.colorCode}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit2"
                  onClick={() => onEdit?.(synode)}
                >
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  className="text-destructive hover:text-destructive"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {synodes?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Building2" size={64} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucun synode créé
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre premier synode pour organiser votre structure
          </p>
        </div>
      )}
    </div>
  );
};

export default SynodesManagement;