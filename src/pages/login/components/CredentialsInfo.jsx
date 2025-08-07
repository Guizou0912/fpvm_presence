import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CredentialsInfo = () => {
  const [isVisible, setIsVisible] = useState(false);

  const credentials = [
    {
      role: 'Administrateur',
      email: 'admin@fpvm.org',
      password: 'admin123',
      description: 'Accès complet à la gestion des membres et rapports'
    },
    {
      role: 'Contrôleur',
      email: 'controller@fpvm.org',
      password: 'controller123',
      description: 'Accès aux rapports de présence uniquement'
    },
    {
      role: 'Utilisateur Simple',
      email: 'user@fpvm.org',
      password: 'user123',
      description: 'Accès au scanner QR uniquement'
    }
  ];

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
      >
        <Icon name="Info" size={16} />
        <span>Identifiants de démonstration</span>
        <Icon name={isVisible ? "ChevronUp" : "ChevronDown"} size={16} />
      </button>
      {isVisible && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="space-y-3">
            {credentials?.map((cred, index) => (
              <div key={index} className="text-xs">
                <div className="font-medium text-foreground mb-1">{cred?.role}</div>
                <div className="text-muted-foreground space-y-1">
                  <div>Email: <span className="font-mono">{cred?.email}</span></div>
                  <div>Mot de passe: <span className="font-mono">{cred?.password}</span></div>
                  <div className="text-xs italic">{cred?.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsInfo;