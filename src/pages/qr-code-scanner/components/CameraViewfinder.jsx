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
  const previousFrameRef = useRef(null);
  const streamRef = useRef(null);
  const scanTimeoutRef = useRef(null);
  const motionCheckIntervalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [motionDetected, setMotionDetected] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);

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
          startMotionDetection();
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
    
    if (scanTimeoutRef?.current) {
      clearTimeout(scanTimeoutRef?.current);
      scanTimeoutRef.current = null;
    }

    if (motionCheckIntervalRef?.current) {
      clearInterval(motionCheckIntervalRef?.current);
      motionCheckIntervalRef.current = null;
    }

    setScanningActive(false);
    setMotionDetected(false);
  };

  const startMotionDetection = () => {
    if (!videoRef?.current || !canvasRef?.current) return;

    motionCheckIntervalRef.current = setInterval(() => {
      if (scanningActive) return;
      
      const video = videoRef?.current;
      const canvas = canvasRef?.current;
      const context = canvas?.getContext('2d');

      if (video?.readyState === video?.HAVE_ENOUGH_DATA) {
        canvas.width = video?.videoWidth;
        canvas.height = video?.videoHeight;
        context?.drawImage(video, 0, 0, canvas?.width, canvas?.height);

        const currentFrame = context?.getImageData(0, 0, canvas?.width, canvas?.height);
        
        if (previousFrameRef?.current) {
          const motionLevel = detectMotion(previousFrameRef?.current, currentFrame);
          
          if (motionLevel > 0.02) { // Motion threshold (2% of pixels changed)
            if (!motionDetected) {
              setMotionDetected(true);
              startScanning();
            }
          }
        }
        
        previousFrameRef.current = currentFrame;
      }
    }, 200); // Check for motion every 200ms
  };

  const detectMotion = (previousFrame, currentFrame) => {
    if (!previousFrame || !currentFrame) return 0;
    
    const prevData = previousFrame?.data;
    const currData = currentFrame?.data;
    let changedPixels = 0;
    const threshold = 30; // Pixel difference threshold
    
    // Sample every 4th pixel for performance (checking R, G, B values)
    for (let i = 0; i < prevData?.length; i += 16) {
      const rDiff = Math.abs(prevData?.[i] - currData?.[i]);
      const gDiff = Math.abs(prevData?.[i + 1] - currData?.[i + 1]);
      const bDiff = Math.abs(prevData?.[i + 2] - currData?.[i + 2]);
      
      if (rDiff > threshold || gDiff > threshold || bDiff > threshold) {
        changedPixels++;
      }
    }
    
    return changedPixels / (prevData?.length / 16);
  };

  const startScanning = () => {
    if (!videoRef?.current || !canvasRef?.current || scanningActive) return;

    setScanningActive(true);
    setIsScanning(true);

    const scanForQR = () => {
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
          // QR code found - trigger result and stop scanning
          if (onScanResult) {
            onScanResult(qrCode);
          }
          stopScanningSession();
        } else if (scanningActive) {
          // Continue scanning for up to 3 seconds
          scanTimeoutRef.current = setTimeout(scanForQR, 100);
        }
      }
    };

    // Start scanning immediately
    scanForQR();

    // Auto-stop scanning after 3 seconds if no QR code found
    scanTimeoutRef.current = setTimeout(() => {
      stopScanningSession();
    }, 3000);
  };

  const stopScanningSession = () => {
    setScanningActive(false);
    setIsScanning(false);
    setMotionDetected(false);
    
    if (scanTimeoutRef?.current) {
      clearTimeout(scanTimeoutRef?.current);
      scanTimeoutRef.current = null;
    }

    // Reset motion detection after 1 second delay
    setTimeout(() => {
      previousFrameRef.current = null;
    }, 1000);
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
    
    // Simulate random QR code detection (30% chance per scan when motion detected)
    if (Math.random() < 0.3) {
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
            <div className={`absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 opacity-80 transition-colors ${
              motionDetected ? 'border-yellow-400' : isScanning ? 'border-green-400' : 'border-white'
            }`}></div>
            {/* Top Right */}
            <div className={`absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 opacity-80 transition-colors ${
              motionDetected ? 'border-yellow-400' : isScanning ? 'border-green-400' : 'border-white'
            }`}></div>
            {/* Bottom Left */}
            <div className={`absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 opacity-80 transition-colors ${
              motionDetected ? 'border-yellow-400' : isScanning ? 'border-green-400' : 'border-white'
            }`}></div>
            {/* Bottom Right */}
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 opacity-80 transition-colors ${
              motionDetected ? 'border-yellow-400' : isScanning ? 'border-green-400' : 'border-white'
            }`}></div>
            
            {/* Scanning Animation */}
            {isScanning && (
              <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse">
                <div className="absolute inset-0 bg-green-400 bg-opacity-20 rounded-lg"></div>
              </div>
            )}

            {/* Motion Detection Animation */}
            {motionDetected && !isScanning && (
              <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg">
                <div className="absolute inset-0 bg-yellow-400 bg-opacity-10 rounded-lg"></div>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-white text-sm font-medium bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              {isScanning ? 'Scanning for QR code...' : motionDetected ? 'Motion detected - scanning...' : 'Present QR code to start scanning'}
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
      {(isScanning || motionDetected) && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <div className={`text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
            isScanning ? 'bg-green-500' : 'bg-yellow-500'
          }`}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>{isScanning ? 'Scanning QR Code...' : 'Motion Detected'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraViewfinder;