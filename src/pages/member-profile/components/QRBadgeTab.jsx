import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QRBadgeTab = ({ member }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [badgeData, setBadgeData] = useState(null);
  const canvasRef = useRef(null);

  // Mock QR code generation
  const generateQRCode = (data) => {
    // In a real implementation, this would use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  };

  // Generate badge data
  useEffect(() => {
    if (member) {
      const qrData = `FPVM-${member?.id}-${Date.now()}`;
      const qrCodeUrl = generateQRCode(qrData);
      
      setBadgeData({
        qrCode: qrCodeUrl,
        qrData: qrData,
        fullName: `${member?.firstName} ${member?.lastName}`,
        group: member?.group,
        synod: member?.synod,
        localChurch: member?.localChurch,
        photo: member?.photo,
        generatedDate: new Date()?.toLocaleDateString('fr-FR')
      });
    }
  }, [member]);

  // Draw badge on canvas
  const drawBadge = () => {
    const canvas = canvasRef?.current;
    if (!canvas || !badgeData) return;

    const ctx = canvas?.getContext('2d');
    const dpi = window.devicePixelRatio || 1;
    
    // Badge dimensions in pixels (8.5cm x 5.5cm at 300 DPI)
    const badgeWidth = 1004;
    const badgeHeight = 650;
    
    canvas.width = badgeWidth * dpi;
    canvas.height = badgeHeight * dpi;
    canvas.style.width = `${badgeWidth / 2}px`;
    canvas.style.height = `${badgeHeight / 2}px`;
    
    ctx?.scale(dpi, dpi);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx?.fillRect(0, 0, badgeWidth, badgeHeight);

    // Border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx?.strokeRect(10, 10, badgeWidth - 20, badgeHeight - 20);

    // Header background
    ctx.fillStyle = '#2563EB';
    ctx?.fillRect(10, 10, badgeWidth - 20, 80);

    // Header text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx?.fillText('CARTE FPVM', badgeWidth / 2, 55);

    // Member photo placeholder
    ctx.fillStyle = '#F1F5F9';
    ctx?.fillRect(50, 120, 120, 120);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx?.strokeRect(50, 120, 120, 120);

    // Member name
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx?.fillText(badgeData?.fullName, 200, 160);

    // Group and Synod
    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx?.fillText(`Groupe: ${badgeData?.group}`, 200, 190);
    ctx?.fillText(`Synode: ${badgeData?.synod}`, 200, 220);

    // QR Code placeholder
    ctx.fillStyle = '#F8FAFC';
    ctx?.fillRect(badgeWidth - 200, 120, 150, 150);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx?.strokeRect(badgeWidth - 200, 120, 150, 150);

    // QR Code label
    ctx.fillStyle = '#64748B';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx?.fillText('Code QR', badgeWidth - 125, 290);

    // Local Church
    ctx.fillStyle = '#1E293B';
    ctx.font = '18px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx?.fillText(badgeData?.localChurch, 50, 320);

    // Generation date
    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx?.fillText(`Généré le: ${badgeData?.generatedDate}`, badgeWidth - 50, badgeHeight - 30);

    // Member ID
    ctx.textAlign = 'left';
    ctx?.fillText(`ID: ${member?.id}`, 50, badgeHeight - 30);
  };

  useEffect(() => {
    if (badgeData) {
      drawBadge();
    }
  }, [badgeData]);

  const handleDownloadBadge = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate badge generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const canvas = canvasRef?.current;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `badge-${member?.firstName}-${member?.lastName}.png`;
        link.href = canvas?.toDataURL('image/png');
        link?.click();
      }
    } catch (error) {
      console.error('Erreur lors de la génération du badge:', error);
      alert('Erreur lors de la génération du badge');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateNewQR = () => {
    const newQrData = `FPVM-${member?.id}-${Date.now()}`;
    const newQrCodeUrl = generateQRCode(newQrData);
    
    setBadgeData(prev => ({
      ...prev,
      qrCode: newQrCodeUrl,
      qrData: newQrData,
      generatedDate: new Date()?.toLocaleDateString('fr-FR')
    }));
  };

  const handlePrintBadge = () => {
    const canvas = canvasRef?.current;
    if (canvas) {
      const printWindow = window.open('', '_blank');
      const img = canvas?.toDataURL('image/png');
      
      printWindow?.document?.write(`
        <html>
          <head>
            <title>Badge FPVM - ${badgeData?.fullName}</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; padding: 0; }
                img { width: 8.5cm; height: 5.5cm; }
              }
            </style>
          </head>
          <body>
            <img src="${img}" alt="Badge FPVM" />
          </body>
        </html>
      `);
      
      printWindow?.document?.close();
      printWindow?.focus();
      printWindow?.print();
    }
  };

  if (!badgeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="text-muted-foreground animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Génération du badge en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badge Preview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
          {/* Canvas Preview */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Aperçu du badge</h3>
            
            <div className="bg-muted p-4 rounded-lg inline-block">
              <canvas
                ref={canvasRef}
                className="border border-border rounded shadow-sm"
              />
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              Dimensions: 8.5cm × 5.5cm (format carte de crédit)
            </p>
          </div>

          {/* Badge Information */}
          <div className="lg:w-80 space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Informations du badge</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Nom complet:</span>
                <span className="text-sm font-medium text-card-foreground">{badgeData?.fullName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Groupe:</span>
                <span className="text-sm font-medium text-card-foreground">{badgeData?.group}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Synode:</span>
                <span className="text-sm font-medium text-card-foreground">{badgeData?.synod}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Église locale:</span>
                <span className="text-sm font-medium text-card-foreground">{badgeData?.localChurch}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Code QR:</span>
                <span className="text-xs font-mono text-card-foreground">{badgeData?.qrData}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Date de génération:</span>
                <span className="text-sm font-medium text-card-foreground">{badgeData?.generatedDate}</span>
              </div>
            </div>

            {/* QR Code Preview */}
            <div className="bg-background p-4 rounded-lg border border-border">
              <h4 className="text-sm font-medium text-card-foreground mb-3">Code QR</h4>
              <div className="flex items-center justify-center">
                <Image
                  src={badgeData?.qrCode}
                  alt="Code QR du membre"
                  className="w-32 h-32 border border-border rounded"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Scannez ce code pour l'identification
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Actions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="default"
            onClick={handleDownloadBadge}
            loading={isGenerating}
            iconName="Download"
            iconPosition="left"
            fullWidth
          >
            Télécharger PNG
          </Button>

          <Button
            variant="outline"
            onClick={handlePrintBadge}
            iconName="Printer"
            iconPosition="left"
            fullWidth
          >
            Imprimer
          </Button>

          <Button
            variant="outline"
            onClick={handleGenerateNewQR}
            iconName="RefreshCw"
            iconPosition="left"
            fullWidth
          >
            Nouveau QR
          </Button>

          <Button
            variant="secondary"
            onClick={() => alert('Fonctionnalité en développement')}
            iconName="Share2"
            iconPosition="left"
            fullWidth
          >
            Partager
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-card-foreground mb-1">Instructions d'impression</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Utilisez du papier cartonné de 300g/m² pour une meilleure durabilité</li>
                <li>• Imprimez en qualité haute résolution (300 DPI minimum)</li>
                <li>• Vérifiez que les dimensions sont exactes: 8.5cm × 5.5cm</li>
                <li>• Plastifiez le badge pour une protection optimale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRBadgeTab;