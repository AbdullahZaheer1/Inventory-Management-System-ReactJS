import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    // Create scanner instance
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
    });

    // Success callback
    function success(decodedText, decodedResult) {
      console.log('Scan result:', decodedText);
      scanner.clear();
      setScanning(false);
      onScan(decodedText);
    }

    // Error callback
    function error(errorMessage) {
      // console.log('Scan error:', errorMessage);
      // Ignore errors, just keep scanning
    }

    // Render scanner
    scanner.render(success, error);

    // Cleanup on unmount
    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScan]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 500
      }}>
        <h3 style={{ marginBottom: 20, color: '#1a237e' }}>📷 Scan QR Code</h3>
        
        <div id="qr-reader" style={{ width: '100%' }}></div>
        
        {!scanning && (
          <p style={{ color: 'green', marginTop: 10, fontWeight: 'bold' }}>✓ Scanned Successfully!</p>
        )}
        
        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            padding: '12px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            width: '100%',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};

export default QRScanner;