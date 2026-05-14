import React, { useState, useEffect } from 'react';

const Reports = ({ shopInfo }) => {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState({
    bills: [],
    totalSales: 0,
    totalProfit: 0,
    totalItems: 0
  });

  const generateReport = () => {
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    
    const filtered = bills.filter(bill => {
      const billDate = new Date(bill.date).toISOString().split('T')[0];
      return billDate >= fromDate && billDate <= toDate;
    });

    const totalSales = filtered.reduce((sum, bill) => sum + bill.total, 0);
    const totalProfit = filtered.reduce((sum, bill) => sum + (bill.profit || 0), 0);
    const totalItems = filtered.reduce((sum, bill) => sum + bill.items.length, 0);

    setReportData({
      bills: filtered,
      totalSales,
      totalProfit,
      totalItems
    });
  };

  const downloadCSV = () => {
    let csv = `${shopInfo.shop.shopName} - Report\n`;
    csv += `From: ${fromDate} To: ${toDate}\n\n`;
    csv += 'Date,Bill No,Customer,Items,Total,Profit\n';
    
    reportData.bills.forEach(bill => {
      csv += `${new Date(bill.date).toLocaleDateString()},${bill.billNo},${bill.customer},${bill.items.length},${bill.total},${bill.profit || 0}\n`;
    });

    csv += `\nTotal,,,${reportData.totalItems},${reportData.totalSales},${reportData.totalProfit}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shopInfo.shop.shopName}-report-${fromDate}.csv`;
    a.click();
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${shopInfo.shop.shopName} - Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .shop-name { font-size: 28px; font-weight: bold; color: #1a237e; }
            .shop-details { font-size: 14px; color: #666; }
            h2 { color: #1a237e; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #1a237e; color: white; padding: 12px; }
            td { border: 1px solid #000; padding: 8px; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding: 15px; background: #f5f5f5; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="shop-name">${shopInfo.shop.shopName}</div>
            <div class="shop-details">${shopInfo.shop.address || ''}</div>
            <div class="shop-details">Phone: ${shopInfo.shop.phone || ''} | Owner: ${shopInfo.shop.ownerName}</div>
          </div>

          <h2>Sales Report</h2>
          <p>From: ${fromDate} To: ${toDate}</p>
          
          <table>
            <tr>
              <th>Date</th>
              <th>Bill No</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Profit</th>
            </tr>
            ${reportData.bills.map(bill => `
              <tr>
                <td>${new Date(bill.date).toLocaleDateString()}</td>
                <td>${bill.billNo}</td>
                <td>${bill.customer}</td>
                <td>${bill.items.length}</td>
                <td>₹${bill.total}</td>
                <td>₹${bill.profit || 0}</td>
              </tr>
            `).join('')}
          </table>

          <div class="total">
            <p><strong>Total Sales:</strong> ₹${reportData.totalSales}</p>
            <p><strong>Total Profit:</strong> ₹${reportData.totalProfit}</p>
            <p><strong>Total Bills:</strong> ${reportData.bills.length}</p>
          </div>

          <div class="footer">
            Generated on: ${new Date().toLocaleString()}<br>
            ${shopInfo.shop.shopName} - All Rights Reserved
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <div>
      <h2>REPORTS - {shopInfo.shop.shopName}</h2>

      <div className="card">
        <h3>Date Range</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10 }}>
          <div className="form-group">
            <label>From:</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>To:</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={generateReport}>Generate</button>
          <button className="btn btn-primary" onClick={downloadPDF}>PDF</button>
          <button className="btn" onClick={downloadCSV}>CSV File</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="stats-box">
          <div className="label">Total Sales</div>
          <div className="value">₹{reportData.totalSales}</div>
        </div>
        <div className="stats-box">
          <div className="label">Total Profit</div>
          <div className="value">₹{reportData.totalProfit}</div>
        </div>
        <div className="stats-box">
          <div className="label">Total Bills</div>
          <div className="value">{reportData.bills.length}</div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="card">
        <h3>Bill Details</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bill No</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {reportData.bills.map(bill => (
              <tr key={bill.id}>
                <td>{new Date(bill.date).toLocaleDateString()}</td>
                <td>{bill.billNo}</td>
                <td>{bill.customer}</td>
                <td>{bill.items.length}</td>
                <td>₹{bill.total}</td>
                <td style={{ color: 'green' }}>+₹{bill.profit || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;