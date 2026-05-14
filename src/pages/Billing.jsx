import React, { useState, useEffect } from 'react';
import QRScanner from './QRScanner';

const Billing = ({ shopInfo }) => {
  const [bill, setBill] = useState({
    id: Date.now(),
    billNo: 'B' + Date.now(),
    customer: '',
    vehicle: '',
    items: [],
    date: new Date().toISOString()
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('products') || '[]'));
    setCustomers(JSON.parse(localStorage.getItem('customers') || '[]'));
  }, []);

  const handleQRScan = (qrData) => {
    try {
      const [vehicle, name, phone] = qrData.split('|');
      
      let customer = customers.find(c => c.vehicle === vehicle);
      
      if (customer) {
        setBill({
          ...bill,
          customer: customer.name,
          vehicle: customer.vehicle
        });
        alert(`Customer Found: ${customer.name}`);
      } else {
        const newCustomer = {
          id: Date.now(),
          name: name || 'Unknown',
          phone: phone || '',
          vehicle: vehicle,
          lastVisit: new Date().toISOString()
        };
        
        const updatedCustomers = [...customers, newCustomer];
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        setCustomers(updatedCustomers);
        
        setBill({
          ...bill,
          customer: newCustomer.name,
          vehicle: newCustomer.vehicle
        });
        
        alert(`New Customer Added: ${newCustomer.name}`);
      }
      
      setShowScanner(false);
    } catch (error) {
      alert('Invalid QR Code');
    }
  };

  const addItem = () => {
    if (!selectedProduct) {
      alert('Select a product');
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    if (product.stock < quantity) {
      alert(`Only ${product.stock} items in stock!`);
      return;
    }

    const newItem = {
      productId: product.id,
      name: product.name,
      price: product.sellingPrice,
      quantity: quantity,
      total: product.sellingPrice * quantity
    };

    setBill({
      ...bill,
      items: [...bill.items, newItem]
    });

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (index) => {
    const newItems = bill.items.filter((_, i) => i !== index);
    setBill({...bill, items: newItems});
  };

  const calculateTotal = () => {
    return bill.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateProfit = () => {
    let profit = 0;
    bill.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        profit += (item.price - product.purchasePrice) * item.quantity;
      }
    });
    return profit;
  };

  const saveBill = () => {
    if (!bill.customer || !bill.vehicle || bill.items.length === 0) {
      alert('Please fill all fields and add items');
      return;
    }

    // Update stock
    const updatedProducts = products.map(product => {
      const soldItem = bill.items.find(item => item.productId === product.id);
      if (soldItem) {
        return {
          ...product,
          stock: product.stock - soldItem.quantity
        };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Save bill
    const finalBill = {
      ...bill,
      total: calculateTotal(),
      profit: calculateProfit()
    };

    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    localStorage.setItem('bills', JSON.stringify([...bills, finalBill]));

    // Update customer last visit
    const updatedCustomers = customers.map(c => {
      if (c.vehicle === bill.vehicle) {
        return {...c, lastVisit: new Date().toISOString()};
      }
      return c;
    });
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));

    alert('Bill saved successfully!');
    printBill(finalBill);
    
    // Reset form
    setBill({
      id: Date.now(),
      billNo: 'B' + Date.now(),
      customer: '',
      vehicle: '',
      items: [],
      date: new Date().toISOString()
    });
  };

  const printBill = (billData) => {
    const printWindow = window.open('', '_blank');
    
    // Get shop info from props
    const shop = shopInfo?.shop || {};
    const employees = shopInfo?.employees || [];
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill ${billData.billNo}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px;
              background: white;
            }
            .bill-container {
              max-width: 300px;
              margin: 0 auto;
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px dashed #000;
            }
            .shop-name { 
              font-size: 20px; 
              font-weight: bold; 
              margin-bottom: 5px;
            }
            .shop-details { 
              font-size: 11px; 
              color: #333;
              margin: 3px 0;
            }
            .bill-title {
              font-size: 16px;
              font-weight: bold;
              margin: 10px 0;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .customer-info { 
              margin: 15px 0;
              padding: 10px;
              background: #f5f5f5;
              font-size: 12px;
            }
            table { 
              width: 100%; 
              margin: 15px 0;
              font-size: 12px;
            }
            th, td { 
              padding: 5px; 
              text-align: left;
            }
            th {
              border-bottom: 1px solid #000;
            }
            .item-name {
              font-size: 11px;
            }
            .total-row {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #000;
              text-align: right;
              font-weight: bold;
              font-size: 14px;
            }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 11px;
              padding-top: 15px;
              border-top: 1px dashed #000;
            }
            .thankyou {
              font-size: 12px;
              font-weight: bold;
              margin: 10px 0;
            }
            .employee {
              font-size: 10px;
              margin-top: 10px;
              color: #666;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <!-- Shop Header from Setup -->
            <div class="header">
              <div class="shop-name">${shop.shopName || 'Shop '}</div>
              <div class="shop-details">${shop.address || 'Pakistan'}</div>
              <div class="shop-details">${shop.phone ? 'Tel: ' + shop.phone : ''}</div>
              <div class="shop-details">${shop.gst ? 'GST: ' + shop.gst : ''}</div>
              <div class="bill-title">TAX INVOICE</div>
              <div class="shop-details">Bill No: ${billData.billNo}</div>
              <div class="shop-details">Date: ${new Date(billData.date).toLocaleString()}</div>
            </div>

            <!-- Customer Information -->
            <div class="customer-info">
              <div><strong>Customer:</strong> ${billData.customer}</div>
              <div><strong>Vehicle:</strong> ${billData.vehicle}</div>
            </div>

            <!-- Items Table -->
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${billData.items.map(item => `
                  <tr>
                    <td class="item-name">${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="divider"></div>

            <!-- Total Amount -->
            <div class="total-row">
              <div>Total Amount: ₹${billData.total}</div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="thankyou">Thank you for visiting!</div>
              <div>** Keep Your Vehicle Healthy **</div>
              <div class="employee">
                ${employees.length > 0 ? 'Billed by: ' + employees[0].name : 'Billed by: Admin'}
              </div>
              <div style="margin-top: 8px; font-size: 9px;">
                Next Service Due: +5000 km
              </div>
            </div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      <h2>🧾 NEW BILL - #{bill.billNo}</h2>

      <div className="card">
        {/* QR Scanner Button */}
        <div style={{ marginBottom: 15 }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowScanner(true)}
          >
            📷 Scan Customer QR
          </button>
        </div>

        {/* Customer Info */}
        <div className="form-group">
          <label>Customer Name:</label>
          <input
            type="text"
            value={bill.customer}
            onChange={(e) => {
              const customer = customers.find(c => c.name.toLowerCase() === e.target.value.toLowerCase());
              setBill({
                ...bill, 
                customer: e.target.value,
                vehicle: customer ? customer.vehicle : ''
              });
            }}
            list="customers"
            placeholder="Enter customer name"
          />
          <datalist id="customers">
            {customers.map(c => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>Vehicle Number:</label>
          <input
            type="text"
            value={bill.vehicle}
            onChange={(e) => setBill({...bill, vehicle: e.target.value})}
            placeholder="Enter vehicle number"
          />
        </div>

        {/* Add Items Section */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <label>Add Products:</label>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{ flex: 2, padding: 8 }}
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name} - ₹{p.sellingPrice} (Stock: {p.stock})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ flex: 1, padding: 8 }}
            />

            <button 
              className="btn btn-primary"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>

        {/* Items Table */}
        {bill.items.length > 0 && (
          <>
            <table style={{ width: '100%', marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.total}</td>
                    <td>
                      <button className="btn" style={{ padding: '2px 8px' }} onClick={() => removeItem(index)}>✖</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <h3>Total: ₹{calculateTotal()}</h3>
              <button 
                className="btn btn-primary"
                style={{ background: 'green', padding: '10px 30px' }}
                onClick={saveBill}
              >
                🖨️ Save & Print Bill
              </button>
            </div>
          </>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Billing;