import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import '../styles/search.css';

const SearchOrders = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    setResults([]);

    try {
      const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/search.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ search_query: query })
      });
      const data = await res.json();
      if (data.success && data.orders.length > 0) {
        setResults(data.orders);
      } else {
        setMessage('No orders found matching your search.');
      }
    } catch (err) {
      setMessage('Failed to fetch search results.');
    }
  };

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-container">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by Order-ID or User-ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className="search-results">
        {message && <p>{message}</p>}

        {results.length > 0 && (
          <>
            <h2>Search Results</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Total Price</th>
                  <th>Payment Code</th>
                  <th>Order Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.order_id}</td>
                    <td>{order.user_id}</td>
                    <td>{order.name}</td>
                    <td>${parseFloat(order.total_price).toFixed(2)}</td>
                    <td>{order.payment_code}</td>
                    <td>{order.order_status}</td>
                    <td>{order.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchOrders;
