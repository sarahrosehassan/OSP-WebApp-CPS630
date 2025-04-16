import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import '../styles/update.css';
const UpdateDataPage = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e, action, payload) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action, ...payload })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('Error submitting data.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="update-body">
      <div style={{ padding: '30px', fontFamily: 'Arial', textAlign: 'center' }}>
        <h1>Update Records</h1>
        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

        <form onSubmit={e => handleSubmit(e, 'update_item', {
          item_id: e.target.item_id.value,
          item_name: e.target.item_name.value,
          price: e.target.price.value,
          made_in: e.target.made_in.value
        })}>
          <h2>Update Item</h2>
          <input type="number" name="item_id" placeholder="Item ID" required />
          <input type="text" name="item_name" placeholder="Name" required />
          <input type="number" name="price" step="0.01" placeholder="Price" required />
          <input type="text" name="made_in" placeholder="Made In" required />
          <button type="submit">Update</button>
        </form>

        <form onSubmit={e => handleSubmit(e, 'update_order', {
          order_id: e.target.order_id.value,
          order_status: e.target.order_status.value
        })}>
          <h2>Update Order</h2>
          <input type="number" name="order_id" placeholder="Order ID" required />
          <input type="text" name="order_status" placeholder="Status" required />
          <button type="submit">Update</button>
        </form>

        <form onSubmit={e => handleSubmit(e, 'update_shopping_cart', {
          cart_id: e.target.cart_id.value,
          quantity: e.target.quantity.value
        })}>
          <h2>Update Shopping Cart</h2>
          <input type="number" name="cart_id" placeholder="Cart ID" required />
          <input type="number" name="quantity" placeholder="Quantity" required />
          <button type="submit">Update</button>
        </form>

        <form onSubmit={e => handleSubmit(e, 'update_trip', {
          trip_id: e.target.trip_id.value,
          destination_address: e.target.destination_address.value,
          price: e.target.price.value
        })}>
          <h2>Update Trip</h2>
          <input type="number" name="trip_id" placeholder="Trip ID" required />
          <input type="text" name="destination_address" placeholder="Destination Address" required />
          <input type="number" name="price" step="0.01" placeholder="Price" required />
          <button type="submit">Update</button>
        </form>

        <form onSubmit={e => handleSubmit(e, 'update_truck', {
          truck_id: e.target.truck_id.value,
          availability_code: e.target.availability_code.value
        })}>
          <h2>Update Truck</h2>
          <input type="number" name="truck_id" placeholder="Truck ID" required />
          <input type="text" name="availability_code" placeholder="Availability Code" required />
          <button type="submit">Update</button>
        </form>

        <form onSubmit={e => handleSubmit(e, 'update_user', {
          user_id: e.target.user_id.value,
          full_name: e.target.full_name.value,
          phone: e.target.phone.value,
          address: e.target.address.value
        })}>
          <h2>Update User</h2>
          <input type="number" name="user_id" placeholder="User ID" required />
          <input type="text" name="full_name" placeholder="Full Name" required />
          <input type="text" name="phone" placeholder="Phone" required />
          <input type="text" name="address" placeholder="Address" required />
          <button type="submit">Update</button>
        </form>
      </div>
      </div>
    </>
  );
};

export default UpdateDataPage;
