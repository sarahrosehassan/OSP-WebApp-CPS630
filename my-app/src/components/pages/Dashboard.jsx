import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost/osp_it1-2_cps630/backend/api/items.php')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to load items:', err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="section-title">Luxury Collection</h1>
        <div className="items-grid">
          {items.length > 0 ? (
            items.map((item) => (
              <div className="luxury-item" key={item.item_id}>
                <div className="luxury-badge">Luxury</div>
                <Link to={`/reviews?item_id=${item.item_id}`}>
                  <img
                    src={`/images/${item.item_image}`}
                    alt={item.item_name}
                    style={{ cursor: 'pointer' }}
                  />
                </Link>
                <div className="item-details">
                  <h3 className="item-name">{item.item_name}</h3>
                  <p className="origin">Origin: {item.made_in}</p>
                  <p className="price">${parseFloat(item.price).toFixed(2)}</p>
                  <button className="add-to-cart-btn" onClick={() => alert('Add to cart')}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </>
  );
}
