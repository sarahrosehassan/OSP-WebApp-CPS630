import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import Navbar from '../layout/Navbar';
import '../styles/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch cart items from backend
  const fetchCartItems = () => {
    fetch('http://localhost/osp_it1-2_cps630/backend/api/cart.php', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCartItems(data.items); // Update cart state
        } else {
          console.error('Error fetching cart items:', data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
        setLoading(false);
      });
  };

  // Fetch available items for sale
  useEffect(() => {
    fetch('http://localhost/osp_it1-2_cps630/backend/api/items.php')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Failed to load items:', err));

    // Fetch initial cart items
    fetchCartItems();
  }, []);

  // Handle item removal from the cart
  const handleRemoveItem = (itemId) => {
    fetch('http://localhost/osp_it1-2_cps630/backend/api/remove_from_cart.php', {
      method: 'POST',
      body: new URLSearchParams({ item_id: itemId }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCartItems(cartItems.filter((item) => item.item_id !== itemId)); // Remove from state
          alert('Item removed from cart');
        } else {
          alert('Failed to remove item from cart');
        }
      })
      .catch((error) => {
        console.error('Error removing item:', error);
        alert('Error removing item from cart');
      });
  };

  // Handle adding item to the cart (either via button or drag-drop)
  const handleAddToCart = (itemId) => {
    fetch('http://localhost/osp_it1-2_cps630/backend/api/add_to_cart.php', {
      method: 'POST',
      body: new URLSearchParams({ item_id: itemId }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Item added to cart');
          fetchCartItems(); // Re-fetch cart items after adding
        } else {
          alert('Failed to add item to cart');
        }
      })
      .catch((error) => {
        console.error('Error adding item:', error);
        alert('Error adding item to cart');
      });
  };

  // Handle the drag event (set itemId for the dragged item)
  const handleDragStart = (e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId); // Store dragged item ID
  };

  // Handle drop event (add dragged item to cart)
  const handleDrop = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain'); // Retrieve the dragged item ID
    handleAddToCart(itemId); // Add only the dragged item
  };

  // Prevent default behavior to allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  return (
    <>
      <Navbar />
      {/* Cart Button */}
      <button className="cart-btn" onClick={toggleCart}>
        <FaShoppingCart />
        {cartItems.length > 0 && <span className="cart-indicator">{cartItems.length}</span>}
      </button>

      {/* Cart Widget (Dropdown style) */}
      {cartOpen && (
        <div className="cart-dropdown" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div className="cart">
            <h3>Your Cart</h3>
            {loading ? (
              <p>Loading cart items...</p>
            ) : cartItems.length > 0 ? (
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.item_id}>
                    <span>{item.item_name} (x{item.quantity})</span>
                    <span className="item-price">${item.price * item.quantity}</span>
                    <button
                      className="btn-delete"
                      onClick={() => handleRemoveItem(item.item_id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Your cart is empty.</p>
            )}

            <button className="close-btn" onClick={toggleCart}>
              Close
            </button>

            {/* Proceed to Delivery Button */}
            {cartItems.length > 0 && (
              <Link to="/delivery">
                <button className="proceed-btn">
                  Proceed to Delivery
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Items */}
      <div className="dashboard-container">
        <h1 className="section-title">Luxury Collection</h1>
        <div className="items-grid">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                className="luxury-item"
                key={item.item_id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item.item_id)}
              >
                <div className="luxury-badge">Luxury</div>
                <img
                  src={`/images/${item.item_image}`}
                  alt={item.item_name}
                />
                <div className="item-details">
                  <h3 className="item-name">{item.item_name}</h3>
                  <p className="origin">Origin: {item.made_in}</p>
                  <p className="price">${parseFloat(item.price).toFixed(2)}</p>
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(item.item_id)}>
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
};

export default Cart;
