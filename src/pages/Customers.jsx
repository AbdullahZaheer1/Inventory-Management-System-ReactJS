import React, { useState, useEffect } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(saved);
    setFilteredCustomers(saved);
  }, []);

  // Filter customers
  useEffect(() => {
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.vehicle.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [search, customers]);

  const saveCustomers = (newCustomers) => {
    localStorage.setItem('customers', JSON.stringify(newCustomers));
    setCustomers(newCustomers);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.vehicle) {
      alert('Please fill all fields');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      ...formData,
      lastVisit: new Date().toISOString()
    };

    saveCustomers([...customers, newCustomer]);
    setShowForm(false);
    setFormData({ name: '', phone: '', vehicle: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer?')) {
      saveCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete ALL customers?')) {
      saveCustomers([]);
    }
  };

  return (
    <div>
      <h2>CUSTOMERS</h2>

      {/* Search Bar */}
      <div className="card">
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <input
            type="text"
            placeholder="🔍 Search by name, phone or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>➕ Add</button>
          <button className="btn" onClick={handleDeleteAll}>🗑️ Delete All</button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card">
          <h3>Add Customer</h3>
          
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', marginBottom: 10 }}
          />
          
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{ width: '100%', marginBottom: 10 }}
          />
          
          <input
            type="text"
            placeholder="Vehicle Number"
            value={formData.vehicle}
            onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
            style={{ width: '100%', marginBottom: 10 }}
          />

          <div>
            <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
            <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="card">
        <h3>Customer List ({filteredCustomers.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.vehicle}</td>
                <td>{new Date(c.lastVisit).toLocaleDateString()}</td>
                <td>
                  <button className="btn" style={{ padding: '2px 10px' }} onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;