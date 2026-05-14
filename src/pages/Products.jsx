import React, { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(saved);
    setFilteredProducts(saved);
  }, []);

  // Filter products
  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString().includes(search)
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const saveProducts = (newProducts) => {
    localStorage.setItem('products', JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.sellingPrice) {
      alert('Please fill all fields');
      return;
    }

    const newProduct = {
      id: editingId || Date.now(),
      ...formData,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellingPrice: Number(formData.sellingPrice),
      stock: Number(formData.stock) || 0
    };

    let newProducts;
    if (editingId) {
      newProducts = products.map(p => p.id === editingId ? newProduct : p);
    } else {
      newProducts = [...products, newProduct];
    }

    saveProducts(newProducts);
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', purchasePrice: '', sellingPrice: '', stock: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      const newProducts = products.filter(p => p.id !== id);
      saveProducts(newProducts);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete ALL products?')) {
      saveProducts([]);
    }
  };

  return (
    <div>
      <h2>PRODUCTS</h2>

      {/* Search Bar */}
      <div className="card">
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', purchasePrice: '', sellingPrice: '', stock: '' });
          }}>
            ➕ Add
          </button>
          <button className="btn" onClick={handleDeleteAll}>🗑️ Delete All</button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card">
          <h3>{editingId ? 'Edit' : 'Add'} Product</h3>
          
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', marginBottom: 10 }}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input
              type="number"
              placeholder="Purchase Price"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
            />
            <input
              type="number"
              placeholder="Selling Price"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>

          <div>
            <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
            <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card">
        <h3>Product List ({filteredProducts.length})</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Purchase</th>
              <th>Selling</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>₹{p.purchasePrice}</td>
                <td>₹{p.sellingPrice}</td>
                <td>{p.stock}</td>
                <td>
                  {p.stock < 10 ? 
                    <span style={{ color: 'red' }}>⚠️ LOW</span> : 
                    <span style={{ color: 'green' }}>✓ OK</span>
                  }
                </td>
                <td>
                  <button className="btn" style={{ padding: '2px 10px', marginRight: 5 }} onClick={() => {
                    setFormData(p);
                    setEditingId(p.id);
                    setShowForm(true);
                  }}>Edit</button>
                  <button className="btn" style={{ padding: '2px 10px' }} onClick={() => handleDelete(p.id)}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;