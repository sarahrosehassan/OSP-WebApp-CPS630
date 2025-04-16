import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import '../styles/insert.css';


const InsertDataPage = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e, endpoint, payload) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/insert.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: endpoint, ...payload })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error submitting data.');
    }
  };

  return (
    <>
    <Navbar />
    <div className="insert-body">
    <div style={{ fontFamily: 'Arial', padding: '30px', textAlign: 'center' }}>
      <h1>Insert Data</h1>
      {message && <p><strong>{message}</strong></p>}

      {/* Insert Item */}
      <form onSubmit={e => handleSubmit(e, 'insert_item', {
        item_name: e.target.item_name.value,
        item_image: e.target.item_image.value,
        price: e.target.price.value,
        made_in: e.target.made_in.value
      })}>
        <h2>Insert New Item</h2>
        <input name="item_name" placeholder="Item Name" required />
        <input name="item_image" placeholder="Image Filename" required />
        <input name="price" type="number" step="0.01" placeholder="Price" required />
        <input name="made_in" placeholder="Made In" required />
        <button type="submit">Insert Item</button>
      </form>

      {/* Insert Order */}
      <form onSubmit={e => handleSubmit(e, 'insert_order', {
        user_id: e.target.user_id.value,
        trip_id: e.target.trip_id.value,
        total_price: e.target.total_price.value,
        payment_code: e.target.payment_code.value,
        order_status: e.target.order_status.value
      })}>
        <h2>Insert New Order</h2>
        <input name="user_id" type="number" placeholder="User ID" required />
        <input name="trip_id" type="number" placeholder="Trip ID" required />
        <input name="total_price" type="number" step="0.01" placeholder="Total Price" required />
        <input name="payment_code" placeholder="Payment Code" required />
        <select name="order_status" required>
          <option value="">Select Order Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button type="submit">Insert Order</button>
      </form>

      {/* Insert Shopping Cart */}
      <form onSubmit={e => handleSubmit(e, 'insert_cart', {
        user_id: e.target.user_id.value,
        item_id: e.target.item_id.value,
        quantity: e.target.quantity.value,
        price: e.target.price.value
      })}>
        <h2>Insert Shopping Cart Entry</h2>
        <input name="user_id" type="number" placeholder="User ID" required />
        <input name="item_id" type="number" placeholder="Item ID" required />
        <input name="quantity" type="number" placeholder="Quantity" required />
        <input name="price" type="number" step="0.01" placeholder="Price" required />
        <button type="submit">Insert to Cart</button>
      </form>

      {/* Insert Trip */}
      <form onSubmit={e => handleSubmit(e, 'insert_trip', {
        user_id: e.target.user_id.value,
        truck_id: e.target.truck_id.value,
        source_address: e.target.source_address.value,
        destination_address: e.target.destination_address.value,
        distance: e.target.distance.value,
        price: e.target.price.value
      })}>
        <h2>Insert Trip</h2>
        <input name="user_id" type="number" placeholder="User ID" required />
        <input name="truck_id" type="number" placeholder="Truck ID" required />
        <input name="source_address" placeholder="Source Address" required />
        <input name="destination_address" placeholder="Destination Address" required />
        <input name="distance" type="number" step="0.01" placeholder="Distance (km)" required />
        <input name="price" type="number" step="0.01" placeholder="Trip Price" required />
        <button type="submit">Insert Trip</button>
      </form>

      {/* Insert Truck */}
      <form onSubmit={e => handleSubmit(e, 'insert_truck', {
        truck_code: e.target.truck_code.value,
        availability_code: e.target.availability_code.value
      })}>
        <h2>Insert Truck</h2>
        <input name="truck_code" placeholder="Truck Code" required />
        <select name="availability_code" required>
          <option value="">Select Availability</option>
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <button type="submit">Insert Truck</button>
      </form>

      {/* Insert User */}
      <form onSubmit={e => handleSubmit(e, 'insert_user', {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        city_code: e.target.city_code.value
      })}>
        <h2>Insert New User</h2>
        <input name="name" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <input name="phone" placeholder="Phone Number" required />
        <input name="address" placeholder="Address" required />
        <input name="city_code" placeholder="City Code" required />
        <button type="submit">Insert User</button>
      </form>
    </div>
    </div>
    </>
  );
};

export default InsertDataPage;
