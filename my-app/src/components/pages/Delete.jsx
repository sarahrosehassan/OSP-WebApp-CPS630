import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import '../styles/insert.css'; 

const DeleteDataPage = () => {
  const [message, setMessage] = useState('');

  const handleDelete = async (e, action, payload) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action, ...payload })
      });
      const data = await res.json();
      setMessage(data.message || 'Action completed.');
    } catch (error) {
      setMessage('Error deleting data.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="insert-body">
        <div className="insert-container">
          <h1>Delete Data</h1>
          {message && <p><strong>{message}</strong></p>}

          <form onSubmit={e => handleDelete(e, 'delete_item', {
            item_id: e.target.item_id.value
          })}>
            <h2>Delete Item</h2>
            <input name="item_id" type="number" placeholder="Item ID" required />
            <button type="submit">Delete Item</button>
          </form>

          <form onSubmit={e => handleDelete(e, 'delete_order', {
            order_id: e.target.order_id.value
          })}>
            <h2>Delete Order</h2>
            <input name="order_id" type="number" placeholder="Order ID" required />
            <button type="submit">Delete Order</button>
          </form>

          <form onSubmit={e => handleDelete(e, 'delete_shopping_cart', {
            cart_id: e.target.cart_id.value
          })}>
            <h2>Delete Shopping Cart Entry</h2>
            <input name="cart_id" type="number" placeholder="Cart ID" required />
            <button type="submit">Delete Cart Entry</button>
          </form>

          <form onSubmit={e => handleDelete(e, 'delete_trip', {
            trip_id: e.target.trip_id.value
          })}>
            <h2>Delete Trip</h2>
            <input name="trip_id" type="number" placeholder="Trip ID" required />
            <button type="submit">Delete Trip</button>
          </form>

          <form onSubmit={e => handleDelete(e, 'delete_truck', {
            truck_id: e.target.truck_id.value
          })}>
            <h2>Delete Truck</h2>
            <input name="truck_id" type="number" placeholder="Truck ID" required />
            <button type="submit">Delete Truck</button>
          </form>

          <form onSubmit={e => handleDelete(e, 'delete_user', {
            user_id: e.target.user_id.value
          })}>
            <h2>Delete User</h2>
            <input name="user_id" type="number" placeholder="User ID" required />
            <button type="submit">Delete User</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeleteDataPage;
