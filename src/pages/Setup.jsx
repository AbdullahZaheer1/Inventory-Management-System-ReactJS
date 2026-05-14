import React, { useState, useEffect } from 'react';

const Setup = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [shopData, setShopData] = useState({
    shopName: '',
    ownerName: '',
    address: '',
    phone: '',
    gst: ''
  });
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });

  // Setup component mein changes - last mein onComplete ke saath
  const handleSave = () => {
    if (!shopData.shopName || !shopData.ownerName) {
      alert('Please fill shop name and owner name');
      return;
    }

    const completeData = {
      shop: shopData,
      employees: employees,
      setupDate: new Date().toISOString()
    };

    localStorage.setItem('shopSetup', JSON.stringify(completeData));
    localStorage.setItem('setupComplete', 'true');

    // Call onComplete to navigate
    if (onComplete) {
      onComplete();
    }
  };

  const addEmployee = () => {
    if (newEmployee.name) {
      setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
      setNewEmployee({ name: '', role: '' });
    }
  };

  const removeEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#c0c0c0',
      padding: 20
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 600 }}>
        <h3> SHOP SETUP - STEP {step}/2</h3>

        {step === 1 ? (
          <>
            <div className="form-group">
              <label>Shop Name *</label>
              <input
                type="text"
                value={shopData.shopName}
                onChange={(e) => setShopData({ ...shopData, shopName: e.target.value })}
                placeholder="e.g., Kamran Oil Shop"
              />
            </div>

            <div className="form-group">
              <label>Owner Name *</label>
              <input
                type="text"
                value={shopData.ownerName}
                onChange={(e) => setShopData({ ...shopData, ownerName: e.target.value })}
                placeholder="Owner full name"
              />
            </div>

            <div className="form-group">
              <label>Shop Address (Optional)</label>
              <textarea
                value={shopData.address}
                onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                placeholder="Shop address"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <input
                type="text"
                value={shopData.phone}
                onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                placeholder="Contact number"
              />
            </div>

            <div className="form-group">
              <label>GST Number (Optional)</label>
              <input
                type="text"
                value={shopData.gst}
                onChange={(e) => setShopData({ ...shopData, gst: e.target.value })}
                placeholder="GST if applicable"
              />
            </div>

            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Next → Add Employees
            </button>
          </>
        ) : (
          <>
            <h4 style={{ marginBottom: 15 }}>Add Employees (Optional)</h4>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Employee name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                style={{ flex: 2 }}
              />
              <input
                type="text"
                placeholder="Role (optional)"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={addEmployee}>Add</button>
            </div>

            {employees.length > 0 && (
              <table style={{ marginBottom: 20 }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.name}</td>
                      <td>{emp.role || '-'}</td>
                      <td>
                        <button className="btn" style={{ padding: '2px 10px' }} onClick={() => removeEmployee(emp.id)}>✖</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={handleSave}>Complete Setup</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Setup;