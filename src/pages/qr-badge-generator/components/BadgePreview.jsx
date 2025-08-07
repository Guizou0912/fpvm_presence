import React, { useRef } from 'react';

import Button from '../../../components/ui/Button';

const BadgePreview = ({ member, synodColors, onDownload }) => {
  const canvasRef = useRef(null);

  const generateQRCode = (memberId) => {
    // Mock QR code generation - in real app would use actual QR library
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="10" y="10" width="10" height="10" fill="black"/>
        <rect x="30" y="10" width="10" height="10" fill="black"/>
        <rect x="50" y="10" width="10" height="10" fill="black"/>
        <rect x="70" y="10" width="10" height="10" fill="black"/>
        <rect x="10" y="30" width="10" height="10" fill="black"/>
        <rect x="30" y="30" width="10" height="10" fill="black"/>
        <rect x="50" y="30" width="10" height="10" fill="black"/>
        <rect x="70" y="30" width="10" height="10" fill="black"/>
        <text x="50" y="95" text-anchor="middle" font-size="8" fill="black">${memberId}</text>
      </svg>
    `)}`;
  };

  const synodColor = synodColors?.[member?.synod] || '#2563EB';

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Badge Preview */}
      <div className="relative bg-white p-4" style={{ aspectRatio: '8.5/5.5' }}>
        {/* Header */}
        <div 
          className="text-center py-2 mb-3 rounded-t-lg"
          style={{ backgroundColor: synodColor }}
        >
          <h3 className="text-white font-bold text-sm">CARTE FPVM</h3>
        </div>

        {/* Content */}
        <div className="flex items-center space-x-4 h-full">
          {/* Photo */}
          <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={member?.photo}
              alt={`${member?.firstName} ${member?.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold text-gray-900 mb-1 truncate">
              {member?.firstName} {member?.lastName}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {member?.group}
            </div>
            <div className="text-xs text-gray-500">
              {member?.synod} • {member?.localChurch}
            </div>
          </div>

          {/* QR Code */}
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={generateQRCode(member?.id)}
              alt="QR Code"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          ID: {member?.id}
        </div>
      </div>
      {/* Actions */}
      <div className="p-3 bg-muted border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground truncate">
            {member?.firstName} {member?.lastName}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => onDownload(member?.id)}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BadgePreview;