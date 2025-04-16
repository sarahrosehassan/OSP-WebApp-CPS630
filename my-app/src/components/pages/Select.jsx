import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import '../styles/select.css';

const SelectData = () => {
  const [table, setTable] = useState('');
  const [filter, setFilter] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/select.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ table, filter })
    });

    const data = await res.json();
    if (data.success) {
      setResults(data.data);
      setMessage('');
    } else {
      setResults([]);
      setMessage(data.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="select-body">
      <div style={{ padding: '60px 20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Select Data from Database</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <label>
            Choose a Table:
            <select value={table} onChange={(e) => setTable(e.target.value)} required>
              <option value="">-- Select --</option>
              <option value="users">Users</option>
              <option value="orders">Orders</option>
              <option value="items">Items</option>
              <option value="trip">Trips</option>
              <option value="shopping_cart">Shopping Cart</option>
              <option value="truck">Trucks</option>
            </select>
          </label>
          <label>
            Filter (optional):
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder='e.g. user_id=1 or name LIKE "%John%"'
            />
          </label>
          <button type="submit">Fetch Data</button>
        </form>

        {message && <p><strong>{message}</strong></p>}

        {results.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                {Object.keys(results[0]).map((col, i) => (
                  <th key={i} style={{ border: '1px solid #ddd', padding: '10px', background: '#007bff', color: '#fff' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} style={{ border: '1px solid #ddd', padding: '10px' }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </>
  );
};

export default SelectData;
