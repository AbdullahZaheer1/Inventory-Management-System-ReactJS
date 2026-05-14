import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const GenerateQR = ({ shopInfo }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(saved);
  }, []);

  const generateQR = async (customer) => {
    try {
      const qrData = `${customer.vehicle}|${customer.name}|${customer.phone}`;
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (err) {
      alert('Error generating QR code');
    }
  };

  const printSticker = () => {
    if (!qrCodeUrl) {
      alert('Please generate QR code first');
      return;
    }

    const customer = customers.find(c => c.name === selectedCustomer);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Sticker - ${selectedCustomer}</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              margin: 0;
              font-family: Arial;
              background: #f0f0f0;
            }
            .sticker {
              text-align: center;
              padding: 20px;
              background: white;
              border: 2px solid #000;
              border-radius: 10px;
              width: 300px;
            }
            .shop-name {
              font-size: 20px;
              font-weight: bold;
              color: #1a237e;
            }
            img { width: 200px; height: 200px; margin: 10px 0; }
            .customer-name { font-size: 18px; font-weight: bold; }
            .vehicle { font-size: 16px; color: #666; }
            @media print {
              body { background: white; }
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <div class="shop-name">${shopInfo.shop.shopName}</div>
            <div style="font-size: 12px;">${shopInfo.shop.phone || ''}</div>
            <img src="${qrCodeUrl}" />
            <div class="customer-name">${selectedCustomer}</div>
            <div class="vehicle">${customer?.vehicle || ''}</div>
            <div style="font-size: 10px; margin-top: 10px;">Scan for quick billing</div>
          </div>
          <script>
            window.onload = () => setTimeout(() => window.print(), 500);
          </script>
        </body>
      </html>
    `);
  };

  return (
    <div>
      <h2>QR STICKERS - {shopInfo.shop.shopName}</h2>

      <div className="card">
        <div className="form-group">
          <label>Select Customer:</label>
          <select
            value={selectedCustomer}
            onChange={(e) => {
              setSelectedCustomer(e.target.value);
              const customer = customers.find(c => c.name === e.target.value);
              if (customer) generateQR(customer);
            }}
          >
            <option value="">-- Choose Customer --</option>
            {customers.map(c => (
              <option key={c.id} value={c.name}>
                {c.name} - {c.vehicle}
              </option>
            ))}
          </select>
        </div>

        {qrCodeUrl && (
          <div style={{ textAlign: 'center' }}>
            <img src={qrCodeUrl} alt="QR Code" style={{ width: 200, height: 200, margin: '20px 0' }} />
            <br />
            <button className="btn btn-primary" onClick={printSticker}>
              🖨️ Print Sticker
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateQR;