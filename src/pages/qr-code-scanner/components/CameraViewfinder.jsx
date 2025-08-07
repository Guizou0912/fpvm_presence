import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const CameraViewfinder = ({ 
  onScanResult, 
  isActive = true, 
  cameraFacing = 'environment',
  onCameraError 
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive, cameraFacing]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices?.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        videoRef?.current?.play();
        
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          startScanning();
        };
      }
    } catch (err) {
      setError('Camera access denied or not available');
      setIsLoading(false);
      if (onCameraError) {
        onCameraError(err);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef?.current) {
      streamRef?.current?.getTracks()?.forEach(track => track?.stop());
      streamRef.current = null;
    }
    
    if (scanIntervalRef?.current) {
      clearInterval(scanIntervalRef?.current);
      scanIntervalRef.current = null;
    }
  };

  const startScanning = () => {
    if (!videoRef?.current || !canvasRef?.current) return;

    scanIntervalRef.current = setInterval(() => {
      if (isScanning) return;
      
      const video = videoRef?.current;
      const canvas = canvasRef?.current;
      const context = canvas?.getContext('2d');

      if (video?.readyState === video?.HAVE_ENOUGH_DATA) {
        canvas.width = video?.videoWidth;
        canvas.height = video?.videoHeight;
        context?.drawImage(video, 0, 0, canvas?.width, canvas?.height);

        const imageData = context?.getImageData(0, 0, canvas?.width, canvas?.height);
        const qrCode = detectQRCode(imageData);
        
        if (qrCode) {
          setIsScanning(true);
          if (onScanResult) {
            onScanResult(qrCode);
          }
          
          setTimeout(() => {
            setIsScanning(false);
          }, 2000);
        }
      }
    }, 100);
  };

  const detectQRCode = (imageData) => {
    // Mock QR code detection - in real implementation, use a QR code library
    // For demo purposes, we'll simulate QR code detection
    const mockQRCodes = [
      'fpvm-member-001',
      'fpvm-member-002', 
      'fpvm-member-003',
      'fpvm-member-004',
      'fpvm-member-005'
    ];
    
    // Simulate random QR code detection (5% chance per scan)
    if (Math.random() < 0.05) {
      return mockQRCodes?.[Math.floor(Math.random() * mockQRCodes?.length)];
    }
    
    return null;
  };

  const switchCamera = () => {
    const newFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  if (error) {
    return (
      <div className="relative w-full h-full bg-muted flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="CameraOff" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Camera Error</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry Camera
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
      
      {/* Hidden Canvas for QR Detection */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm">Starting camera...</p>
          </div>
        </div>
      )}

      {/* Scanning Overlay Frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Corner Brackets */}
          <div className="w-64 h-64 relative">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white opacity-80"></div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white opacity-80"></div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white opacity-80"></div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white opacity-80"></div>
            
            {/* Scanning Animation */}
            {isScanning && (
              <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse">
                <div className="absolute inset-0 bg-green-400 bg-opacity-20 rounded-lg"></div>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-white text-sm font-medium bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              {isScanning ? 'Scanning...' : 'Position QR code within frame'}
            </p>
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="absolute bottom-6 right-6 flex space-x-3">
        <button
          onClick={switchCamera}
          className="w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
          title="Switch Camera"
        >
          <Icon name="RotateCcw" size={20} />
        </button>
      </div>

      {/* Scanning Status Indicator */}
      {isScanning && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Scanning QR Code...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraViewfinder;