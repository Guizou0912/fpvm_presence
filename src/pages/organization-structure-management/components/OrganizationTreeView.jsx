import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const OrganizationTreeView = ({ 
  data, 
  onSelectSynode, 
  onSelectChurch, 
  selectedSynode, 
  selectedChurch 
}) => {
  const [expandedSynodes, setExpandedSynodes] = useState({});
  const [expandedChurches, setExpandedChurches] = useState({});

  const toggleSynode = (synodeId) => {
    setExpandedSynodes(prev => ({
      ...prev,
      [synodeId]: !prev?.[synodeId]
    }));
  };

  const toggleChurch = (churchId) => {
    setExpandedChurches(prev => ({
      ...prev,
      [churchId]: !prev?.[churchId]
    }));
  };

  const getChurchesForSynode = (synodeId) => {
    return data?.churches?.filter(church => church?.synodeId === synodeId) || [];
  };

  const getGroupsForChurch = (churchId) => {
    return data?.groups?.filter(group => group?.churchId === churchId) || [];
  };

  return (
    <div className="space-y-2">
      {data?.synodes?.map((synode) => {
        const churches = getChurchesForSynode(synode?.id);
        const isExpanded = expandedSynodes?.[synode?.id];
        const isSelected = selectedSynode?.id === synode?.id;

        return (
          <div key={synode?.id} className="space-y-1">
            {/* Synode Node */}
            <div
              className={`
                flex items-center p-2 rounded-lg cursor-pointer transition-colors
                ${isSelected 
                  ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted'
                }
              `}
              onClick={() => onSelectSynode?.(synode)}
            >
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  toggleSynode(synode?.id);
                }}
                className="mr-2 p-0.5 hover:bg-background rounded"
              >
                <Icon 
                  name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                  size={14} 
                />
              </button>

              <div 
                className="w-3 h-3 rounded-full mr-2 border border-border"
                style={{ backgroundColor: synode?.colorCode }}
              />

              <Icon name="Building2" size={16} className="text-muted-foreground mr-2" />
              
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground">
                  {synode?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {churches?.length} églises · {synode?.memberCount} membres
                </div>
              </div>
            </div>
            {/* Churches */}
            {isExpanded && (
              <div className="ml-6 space-y-1">
                {churches?.map((church) => {
                  const groups = getGroupsForChurch(church?.id);
                  const isChurchExpanded = expandedChurches?.[church?.id];
                  const isChurchSelected = selectedChurch?.id === church?.id;

                  return (
                    <div key={church?.id} className="space-y-1">
                      {/* Church Node */}
                      <div
                        className={`
                          flex items-center p-2 rounded-lg cursor-pointer transition-colors
                          ${isChurchSelected 
                            ? 'bg-secondary/10 border border-secondary/20' :'hover:bg-muted'
                          }
                        `}
                        onClick={() => onSelectChurch?.(church)}
                      >
                        <button
                          onClick={(e) => {
                            e?.stopPropagation();
                            toggleChurch(church?.id);
                          }}
                          className="mr-2 p-0.5 hover:bg-background rounded"
                        >
                          <Icon 
                            name={isChurchExpanded ? "ChevronDown" : "ChevronRight"} 
                            size={14} 
                          />
                        </button>

                        <Icon name="Church" size={16} className="text-muted-foreground mr-2" />
                        
                        <div className="flex-1">
                          <div className="font-medium text-sm text-foreground">
                            {church?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {groups?.length} groupes · {church?.memberCount} membres
                          </div>
                        </div>
                      </div>
                      {/* Groups */}
                      {isChurchExpanded && (
                        <div className="ml-6 space-y-1">
                          {groups?.map((group) => (
                            <div
                              key={group?.id}
                              className="flex items-center p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                            >
                              <Icon name="Users" size={14} className="text-muted-foreground mr-3" />
                              
                              <div className="flex-1">
                                <div className="font-medium text-sm text-foreground">
                                  {group?.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {group?.memberCount} membres
                                </div>
                              </div>

                              <div className="flex items-center">
                                <div className={`
                                  px-2 py-1 rounded text-xs font-medium
                                  ${group?.type === 'leadership' ? 'bg-blue-100 text-blue-700' :
                                    group?.type === 'education' ? 'bg-green-100 text-green-700' :
                                    group?.type === 'worship'? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                  }
                                `}>
                                  {group?.type}
                                </div>
                              </div>
                            </div>
                          ))}

                          {groups?.length === 0 && (
                            <div className="text-xs text-muted-foreground italic p-2">
                              Aucun groupe
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {churches?.length === 0 && (
                  <div className="text-xs text-muted-foreground italic p-2">
                    Aucune église
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {data?.synodes?.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <Icon name="Building2" size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Aucun synode créé</p>
          <p className="text-xs">Commencez par créer un synode</p>
        </div>
      )}
    </div>
  );
};

export default OrganizationTreeView;