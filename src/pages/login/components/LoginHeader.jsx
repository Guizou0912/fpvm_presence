import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* FPVM Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center elevation-subtle">
          <Icon name="Church" size={32} color="white" />
        </div>
      </div>

      {/* Application Title */}
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        FPVM Presence
      </h1>
      
      <p className="text-muted-foreground text-sm">
        Système de gestion de présence pour les églises FPVM
      </p>
    </div>
  );
};

export default LoginHeader;