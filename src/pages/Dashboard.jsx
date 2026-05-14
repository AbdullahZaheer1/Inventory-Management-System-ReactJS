import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayProfit: 0,
    totalProducts: 0,
    lowStock: []
  });

  // Load data from localStorage
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Get today's bills
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const today = new Date().toDateString();
    const todayBills = bills.filter(bill => 
      new Date(bill.date).toDateString() === today
    );

    const todaySales = todayBills.reduce((sum, bill) => sum + bill.total, 0);
    const todayProfit = todayBills.reduce((sum, bill) => sum + (bill.profit || 0), 0);
    
    // Check low stock
    const lowStock = products.filter(p => p.stock < 10);

    setStats({
      todaySales,
      todayProfit,
      totalProducts: products.length,
      lowStock
    });
  };

  return (
    <div>
      <h2>Dashboard</h2>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 20 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Today's Sale</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: '#1a237e' }}>₹{stats.todaySales}</p>
        </div>
        
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Today's Profit</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: 'green' }}>₹{stats.todayProfit}</p>
        </div>
        
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Total Products</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.totalProducts}</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStock.length > 0 && (
        <div style={{ background: '#ffebee', padding: 20, borderRadius: 10, marginTop: 20, border: '2px solid red' }}>
          <h3 style={{ color: 'red' }}>⚠️ LOW STOCK ALERT</h3>
          {stats.lowStock.map(item => (
            <p key={item.id}><strong>{item.name}:</strong> Only {item.stock} left!</p>
          ))}
        </div>
      )}

      {/* Recent Bills */}
      <div style={{ background: 'white', padding: 20, borderRadius: 10, marginTop: 20 }}>
        <h3>Recent Transactions</h3>
        <table style={{ width: '100%', marginTop: 10 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 10 }}>Bill No</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {JSON.parse(localStorage.getItem('bills') || '[]').slice(-5).reverse().map(bill => (
              <tr key={bill.id}>
                <td style={{ padding: 10 }}>{bill.billNo}</td>
                <td>{bill.customer}</td>
                <td>₹{bill.total}</td>
                <td>{new Date(bill.date).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;