import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import DayBook from './pages/DayBook';
import GenerateQR from './pages/GenerateQR';
import Settings from './pages/Settings';
import Setup from './pages/Setup';
import './index.css';

function App() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [shopInfo, setShopInfo] = useState({ shop: { shopName: 'Shop Kamran', ownerName: 'Admin' } });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if setup is complete
    const completed = localStorage.getItem('setupComplete') === 'true';
    setSetupComplete(completed);

    // Load shop info
    const saved = localStorage.getItem('shopSetup');
    if (saved) {
      setShopInfo(JSON.parse(saved));
    }

    // If setup complete and on root, redirect to dashboard
    if (completed && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, []);

  const handleSetupComplete = () => {
    setSetupComplete(true);
    const saved = localStorage.getItem('shopSetup');
    if (saved) {
      setShopInfo(JSON.parse(saved));
    }
    navigate('/dashboard');
  };

  // Sidebar buttons component
  const Sidebar = () => {
    const navigateTo = (path) => {
      navigate(path);
    };

    return (
      <div className="sidebar">
        <h2> {shopInfo.shop.shopName}</h2>
        <button onClick={() => navigateTo('/dashboard')}>🏠 DASHBOARD</button>
        <button onClick={() => navigateTo('/billing')}>🧾 NEW BILL</button>
        <button onClick={() => navigateTo('/products')}>📦 PRODUCTS</button>
        <button onClick={() => navigateTo('/customers')}>👤 CUSTOMERS</button>
        <button onClick={() => navigateTo('/qr')}>🏷️ QR STICKER</button>
        <button onClick={() => navigateTo('/reports')}>📊 REPORTS</button>
        <button onClick={() => navigateTo('/daybook')}>📅 DAY BOOK</button>
        <button onClick={() => navigateTo('/settings')}>⚙️ SETTINGS</button>
      </div>
    );
  };

  if (!setupComplete) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard shopInfo={shopInfo} />} />
          <Route path="/dashboard" element={<Dashboard shopInfo={shopInfo} />} />
          <Route path="/billing" element={<Billing shopInfo={shopInfo} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/qr" element={<GenerateQR shopInfo={shopInfo} />} />
          <Route path="/reports" element={<Reports shopInfo={shopInfo} />} />
          <Route path="/daybook" element={<DayBook shopInfo={shopInfo} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <div className="status-bar">
        {shopInfo.shop.shopName} | Owner: {shopInfo.shop.ownerName} | {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}

export default App;