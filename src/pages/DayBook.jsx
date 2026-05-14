import React, { useState, useEffect } from 'react';

const DayBook = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayData, setDayData] = useState({
    bills: [],
    totalSales: 0,
    totalProfit: 0,
    products: {}
  });

  useEffect(() => {
    loadDayData();
  }, [selectedDate]);

  const loadDayData = () => {
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    
    const dayBills = bills.filter(bill => {
      const billDate = new Date(bill.date).toISOString().split('T')[0];
      return billDate === selectedDate;
    });

    // Calculate product wise sales
    const productSales = {};
    dayBills.forEach(bill => {
      bill.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = {
            quantity: 0,
            total: 0
          };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].total += item.total;
      });
    });

    const totalSales = dayBills.reduce((sum, bill) => sum + bill.total, 0);
    const totalProfit = dayBills.reduce((sum, bill) => sum + (bill.profit || 0), 0);

    setDayData({
      bills: dayBills,
      totalSales,
      totalProfit,
      products: productSales
    });
  };

  return (
    <div>
      <h2>Day Book - Daily Record</h2>

      <div style={{ background: 'white', padding: 20, borderRadius: 10, marginTop: 20 }}>
        {/* Date Selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: 10, borderRadius: 5, border: '1px solid #ddd', flex: 1 }}
          />
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
          <div style={{ background: '#e8f5e8', padding: 20, borderRadius: 10 }}>
            <h3>Total Sales</h3>
            <p style={{ fontSize: 28, fontWeight: 'bold', color: 'green' }}>₹{dayData.totalSales}</p>
          </div>
          <div style={{ background: '#e3f2fd', padding: 20, borderRadius: 10 }}>
            <h3>Total Profit</h3>
            <p style={{ fontSize: 28, fontWeight: 'bold', color: 'blue' }}>₹{dayData.totalProfit}</p>
          </div>
        </div>

        {/* Product-wise Sales */}
        {Object.keys(dayData.products).length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h3>Product-wise Sales</h3>
            <table style={{ width: '100%', marginTop: 10 }}>
              <thead style={{ background: '#f5f5f5' }}>
                <tr>
                  <th style={{ padding: 10 }}>Product</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dayData.products).map(([name, data]) => (
                  <tr key={name}>
                    <td style={{ padding: 10 }}>{name}</td>
                    <td>{data.quantity}</td>
                    <td>₹{data.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bills List */}
        <h3>Transactions</h3>
        <table style={{ width: '100%', marginTop: 10 }}>
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: 10 }}>Time</th>
              <th>Bill No</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {dayData.bills.map(bill => (
              <tr key={bill.id}>
                <td style={{ padding: 10 }}>{new Date(bill.date).toLocaleTimeString()}</td>
                <td>{bill.billNo}</td>
                <td>{bill.customer}</td>
                <td>{bill.items.length}</td>
                <td>₹{bill.total}</td>
              </tr>
            ))}
            {dayData.bills.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 20, textAlign: 'center' }}>No transactions on this date</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DayBook;