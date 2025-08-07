import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ChurchesManagement = ({ 
  churches, 
  synodes, 
  groups, 
  onEdit, 
  isMobile = false 
}) => {
  const getSynodeById = (synodeId) => {
    return synodes?.find(synode => synode?.id === synodeId);
  };

  const getGroupCountForChurch = (churchId) => {
    return groups?.filter(group => group?.churchId === churchId)?.length || 0;
  };

  const groupedChurches = synodes?.reduce((acc, synode) => {
    acc[synode?.id] = {
      synode,
      churches: churches?.filter(church => church?.synodeId === synode?.id) || []
    };
    return acc;
  }, {}) || {};

  if (isMobile) {
    return (
      <div className="space-y-6">
        {Object.values(groupedChurches)?.map(({ synode, churches: synodeChurches }) => (
          <div key={synode?.id} className="space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-border">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: synode?.colorCode }}
              />
              <h4 className="font-medium text-foreground">{synode?.name}</h4>
              <span className="text-xs text-muted-foreground">
                ({synodeChurches?.length} églises)
              </span>
            </div>

            {synodeChurches?.map((church) => (
              <div
                key={church?.id}
                className="bg-background border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Church" size={18} className="text-muted-foreground" />
                    <div>
                      <h5 className="font-medium text-foreground">
                        {church?.name}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {church?.address}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    onClick={() => onEdit?.(church)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">
                      {getGroupCountForChurch(church?.id)}
                    </div>
                    <div className="text-xs text-muted-foreground">Groupes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">
                      {church?.memberCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Membres</div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Edit2"
                    onClick={() => onEdit?.(church)}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            ))}

            {synodeChurches?.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm italic">Aucune église dans ce synode</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.values(groupedChurches)?.map(({ synode, churches: synodeChurches }) => (
        <div key={synode?.id} className="space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-border">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: synode?.colorCode }}
            />
            <h3 className="text-lg font-semibold text-foreground">{synode?.name}</h3>
            <span className="text-sm text-muted-foreground">
              ({synodeChurches?.length} églises)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {synodeChurches?.map((church) => (
              <div
                key={church?.id}
                className="bg-background border border-border rounded-lg p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon name="Church" size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {church?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {church?.address}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    onClick={() => onEdit?.(church)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-lg font-bold text-foreground">
                      {getGroupCountForChurch(church?.id)}
                    </div>
                    <div className="text-xs text-muted-foreground">Groupes</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-lg font-bold text-foreground">
                      {church?.memberCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Membres</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: synode?.colorCode }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {synode?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit2"
                      onClick={() => onEdit?.(church)}
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

          {synodeChurches?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Icon name="Church" size={48} className="mx-auto opacity-50 mb-3" />
              <p className="text-sm italic">Aucune église dans ce synode</p>
            </div>
          )}
        </div>
      ))}

      {synodes?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Church" size={64} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucune église créée
          </h3>
          <p className="text-muted-foreground mb-4">
            Créez d'abord des synodes, puis ajoutez des églises
          </p>
        </div>
      )}
    </div>
  );
};

export default ChurchesManagement;