import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PrintPreviewModal = ({ 
  isOpen, 
  onClose, 
  selectedMembers, 
  members, 
  synodColors, 
  settings 
}) => {
  if (!isOpen) return null;

  const selectedMemberData = members?.filter(member => 
    selectedMembers?.includes(member?.id)
  );

  const badgesPerPage = settings?.paperSize === 'A4' ? 8 : 10;
  const pages = Math.ceil(selectedMemberData?.length / badgesPerPage);

  const generateQRCode = (memberId) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="60" fill="white"/>
        <rect x="5" y="5" width="5" height="5" fill="black"/>
        <rect x="15" y="5" width="5" height="5" fill="black"/>
        <rect x="25" y="5" width="5" height="5" fill="black"/>
        <rect x="35" y="5" width="5" height="5" fill="black"/>
        <rect x="5" y="15" width="5" height="5" fill="black"/>
        <rect x="15" y="15" width="5" height="5" fill="black"/>
        <rect x="25" y="15" width="5" height="5" fill="black"/>
        <rect x="35" y="15" width="5" height="5" fill="black"/>
        <text x="30" y="55" text-anchor="middle" font-size="6" fill="black">${memberId}</text>
      </svg>
    `)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Print Preview</h2>
            <p className="text-sm text-muted-foreground">
              {selectedMemberData?.length} badges • {pages} page{pages !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              iconName="Printer"
              iconPosition="left"
              onClick={handlePrint}
            >
              Print
            </Button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {Array.from({ length: pages }, (_, pageIndex) => (
            <div key={pageIndex} className="mb-8 last:mb-0">
              <div className="text-sm text-muted-foreground mb-4">
                Page {pageIndex + 1} of {pages}
              </div>
              
              <div 
                className="bg-white border border-border rounded-lg p-8 print:border-0 print:shadow-none"
                style={{ 
                  aspectRatio: settings?.paperSize === 'A4' ? '210/297' : '8.5/11',
                  minHeight: '400px'
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {selectedMemberData?.slice(pageIndex * badgesPerPage, (pageIndex + 1) * badgesPerPage)?.map((member) => {
                      const synodColor = synodColors?.[member?.synod] || '#2563EB';
                      
                      return (
                        <div 
                          key={member?.id}
                          className="relative bg-white border border-gray-300 rounded-lg overflow-hidden"
                          style={{ 
                            width: '8.5cm', 
                            height: '5.5cm',
                            fontSize: '12px'
                          }}
                        >
                          {/* Cutting guides */}
                          {settings?.includeCuttingGuides && (
                            <>
                              <div className="absolute -top-2 left-0 right-0 h-px bg-gray-400" />
                              <div className="absolute -bottom-2 left-0 right-0 h-px bg-gray-400" />
                              <div className="absolute -left-2 top-0 bottom-0 w-px bg-gray-400" />
                              <div className="absolute -right-2 top-0 bottom-0 w-px bg-gray-400" />
                            </>
                          )}
                          {/* Header */}
                          <div 
                            className="text-center py-1 text-white font-bold text-xs"
                            style={{ backgroundColor: synodColor }}
                          >
                            CARTE FPVM
                          </div>
                          {/* Content */}
                          <div className="flex items-center space-x-2 p-2 h-full">
                            {/* Photo */}
                            <div className="w-12 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
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
                              <div className="font-bold text-gray-900 text-xs truncate">
                                {member?.firstName} {member?.lastName}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {member?.group}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {member?.synod}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {member?.localChurch}
                              </div>
                            </div>

                            {/* QR Code */}
                            <div className="w-12 h-12 flex-shrink-0">
                              <img
                                src={generateQRCode(member?.id)}
                                alt="QR Code"
                                className="w-full h-full"
                              />
                            </div>
                          </div>
                          {/* Footer */}
                          {settings?.includeMemberId && (
                            <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                              {member?.id}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;