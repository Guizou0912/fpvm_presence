import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const GroupsManagement = ({ 
  groups, 
  churches, 
  synodes, 
  onEdit, 
  isMobile = false 
}) => {
  const getChurchById = (churchId) => {
    return churches?.find(church => church?.id === churchId);
  };

  const getSynodeById = (synodeId) => {
    return synodes?.find(synode => synode?.id === synodeId);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'leadership': return 'Crown';
      case 'education': return 'GraduationCap';
      case 'worship': return 'Music';
      default: return 'Users';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'leadership': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'education': return 'bg-green-100 text-green-700 border-green-200';
      case 'worship': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'leadership': return 'Direction';
      case 'education': return 'Enseignement';
      case 'worship': return 'Adoration';
      default: return 'Général';
    }
  };

  // Group by churches for better organization
  const groupedByChurch = churches?.reduce((acc, church) => {
    const churchGroups = groups?.filter(group => group?.churchId === church?.id) || [];
    if (churchGroups?.length > 0) {
      const synode = getSynodeById(church?.synodeId);
      acc?.push({
        church,
        synode,
        groups: churchGroups
      });
    }
    return acc;
  }, []) || [];

  if (isMobile) {
    return (
      <div className="space-y-6">
        {groupedByChurch?.map(({ church, synode, groups: churchGroups }) => (
          <div key={church?.id} className="space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-border">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: synode?.colorCode }}
              />
              <div>
                <h4 className="font-medium text-foreground">{church?.name}</h4>
                <p className="text-xs text-muted-foreground">{synode?.name}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                ({churchGroups?.length} groupes)
              </span>
            </div>

            {churchGroups?.map((group) => (
              <div
                key={group?.id}
                className="bg-background border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getTypeIcon(group?.type)} 
                      size={18} 
                      className="text-muted-foreground" 
                    />
                    <div>
                      <h5 className="font-medium text-foreground">
                        {group?.name}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {group?.description}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    onClick={() => onEdit?.(group)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">
                      {group?.memberCount}
                    </span>
                    <span className="text-xs text-muted-foreground">membres</span>
                  </div>
                  
                  <div className={`
                    px-2 py-1 rounded text-xs font-medium border
                    ${getTypeColor(group?.type)}
                  `}>
                    {getTypeLabel(group?.type)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedByChurch?.map(({ church, synode, groups: churchGroups }) => (
        <div key={church?.id} className="space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-border">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: synode?.colorCode }}
            />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {church?.name}
              </h3>
              <p className="text-sm text-muted-foreground">{synode?.name}</p>
            </div>
            <span className="text-sm text-muted-foreground">
              ({churchGroups?.length} groupes)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {churchGroups?.map((group) => (
              <div
                key={group?.id}
                className="bg-background border border-border rounded-lg p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon 
                        name={getTypeIcon(group?.type)} 
                        size={20} 
                        className="text-muted-foreground" 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {group?.name}
                      </h4>
                      <div className={`
                        inline-flex px-2 py-1 rounded text-xs font-medium border mt-1
                        ${getTypeColor(group?.type)}
                      `}>
                        {getTypeLabel(group?.type)}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    onClick={() => onEdit?.(group)}
                  />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {group?.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {group?.memberCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Membres</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: synode?.colorCode }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {synode?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {church?.name}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit2"
                      onClick={() => onEdit?.(group)}
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
        </div>
      ))}

      {groupedByChurch?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={64} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucun groupe créé
          </h3>
          <p className="text-muted-foreground mb-4">
            Créez d'abord des synodes et des églises, puis ajoutez des groupes
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupsManagement;