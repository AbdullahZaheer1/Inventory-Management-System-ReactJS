import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [shopData, setShopData] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetOptions, setResetOptions] = useState({
    products: false,
    customers: false,
    bills: false,
    all: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('shopSetup');
    if (saved) {
      setShopData(JSON.parse(saved));
    }
  }, []);

  const handleReset = () => {
    if (!resetOptions.products && !resetOptions.customers && !resetOptions.bills && !resetOptions.all) {
      alert('Select at least one option');
      return;
    }

    if (window.confirm('⚠️ Are you sure? This cannot be undone!')) {
      if (resetOptions.all || resetOptions.products) {
        localStorage.removeItem('products');
      }
      if (resetOptions.all || resetOptions.customers) {
        localStorage.removeItem('customers');
      }
      if (resetOptions.all || resetOptions.bills) {
        localStorage.removeItem('bills');
      }

      alert('Data deleted successfully!');
      setShowResetConfirm(false);
      setResetOptions({ products: false, customers: false, bills: false, all: false });
      
      // Refresh page
      window.location.reload();
    }
  };

  const handleFullReset = () => {
    if (window.confirm('⚠️ COMPLETE RESET - All data including shop setup will be deleted!')) {
      localStorage.clear();
      alert('System reset complete! Redirecting to setup...');
      window.location.reload();
    }
  };

  return (
    <div>
      <h2>SETTINGS</h2>

      {/* Shop Info */}
      <div className="card">
        <h3>SHOP INFORMATION</h3>
        {shopData && (
          <table>
            <tbody>
              <tr><td><strong>Shop Name:</strong></td><td>{shopData.shop.shopName}</td></tr>
              <tr><td><strong>Owner:</strong></td><td>{shopData.shop.ownerName}</td></tr>
              <tr><td><strong>Address:</strong></td><td>{shopData.shop.address || '-'}</td></tr>
              <tr><td><strong>Phone:</strong></td><td>{shopData.shop.phone || '-'}</td></tr>
              <tr><td><strong>GST:</strong></td><td>{shopData.shop.gst || '-'}</td></tr>
              <tr><td><strong>Employees:</strong></td><td>{shopData.employees?.length || 0}</td></tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Reset Data Section */}
      <div className="card">
        <h3>⚠️ RESET DATA</h3>
        
        {!showResetConfirm ? (
          <button className="btn btn-primary" onClick={() => setShowResetConfirm(true)}>
            🗑️ Reset / Delete Data
          </button>
        ) : (
          <div>
            <h4 style={{ color: 'red', marginBottom: 15 }}>Select data to delete:</h4>
            
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 10 }}>
                <input 
                  type="checkbox" 
                  checked={resetOptions.all}
                  onChange={(e) => setResetOptions({
                    all: e.target.checked,
                    products: e.target.checked,
                    customers: e.target.checked,
                    bills: e.target.checked
                  })}
                /> <strong>DELETE ALL DATA</strong>
              </label>
              
              <label style={{ display: 'block', marginBottom: 10, marginLeft: 20 }}>
                <input 
                  type="checkbox" 
                  checked={resetOptions.products}
                  disabled={resetOptions.all}
                  onChange={(e) => setResetOptions({...resetOptions, products: e.target.checked})}
                /> Delete All Products
              </label>
              
              <label style={{ display: 'block', marginBottom: 10, marginLeft: 20 }}>
                <input 
                  type="checkbox" 
                  checked={resetOptions.customers}
                  disabled={resetOptions.all}
                  onChange={(e) => setResetOptions({...resetOptions, customers: e.target.checked})}
                /> Delete All Customers
              </label>
              
              <label style={{ display: 'block', marginBottom: 10, marginLeft: 20 }}>
                <input 
                  type="checkbox" 
                  checked={resetOptions.bills}
                  disabled={resetOptions.all}
                  onChange={(e) => setResetOptions({...resetOptions, bills: e.target.checked})}
                /> Delete All Bills
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleReset}>Confirm Delete</button>
              <button className="btn" onClick={() => setShowResetConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Full System Reset */}
      <div className="card">
        <h3 style={{ color: 'red' }}>💀 COMPLETE SYSTEM RESET</h3>
        <p style={{ marginBottom: 15 }}>This will delete ALL data and return to first-time setup!</p>
        <button className="btn" style={{ background: 'red', color: 'white' }} onClick={handleFullReset}>
          ⚠️ Reset Everything
        </button>
      </div>
    </div>
  );
};

export default Settings;