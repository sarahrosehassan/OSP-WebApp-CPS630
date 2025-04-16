import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import '../styles/process.css';

const ProcessPayment = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [tripDetails, setTripDetails] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCartAndTripDetails = async () => {
      try {
        const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/process.php', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (data.success) {
          const cart = data.cart_items || [];
          const trip = data.trip_details || {};

          setCartItems(cart);
          setTripDetails(trip);

          const subtotal = cart.reduce((acc, item) => acc + Number(item.total || 0), 0);
          const fee = Number(trip.delivery_fee || 0);
          setTotalAmount(subtotal);
          setDeliveryFee(fee);
          setFinalTotal(subtotal + fee);
        } else {
          setFetchError(data.message || 'Failed to fetch data.');
        }
      } catch (error) {
        console.error('Error fetching cart/trip:', error);
        setFetchError('Error fetching cart and trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndTripDetails();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center">
          <h4>Loading order details...</h4>
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center text-danger">
          <h4>{fetchError}</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="process-body">
      <div className="container my-5">
        <h1 className="text-center mb-4">Order Details</h1>
        <div className="row">
          <div className="col-md-8 offset-md-2">

            {/* Trip Details */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Trip Details</h5>
                <p><strong>Source Address:</strong> {tripDetails.source_address || 'N/A'}</p>
                <p><strong>Destination Address:</strong> {tripDetails.destination_address || 'N/A'}</p>
                <p><strong>Distance:</strong> {tripDetails.distance ?? 'N/A'} km</p>
                <p><strong>Truck Code:</strong> {tripDetails.truck_code || 'N/A'}</p>
                <p><strong>Delivery Fee:</strong> ${Number(deliveryFee).toFixed(2)}</p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Your Cart</h5>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>${Number(item.price).toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>${Number(item.total).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No items in your cart.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <div className="row mb-2">
                  <div className="col-6">Subtotal:</div>
                  <div className="col-6 text-end">${totalAmount.toFixed(2)}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-6">Delivery Fee:</div>
                  <div className="col-6 text-end">${Number(deliveryFee).toFixed(2)}</div>
                </div>
                <hr />
                <div className="row fw-bold">
                  <div className="col-6">Total Amount:</div>
                  <div className="col-6 text-end">${finalTotal.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Proceed to Payment Button */}
            <div className="text-center">
              <Link to="/payment" className="btn btn-success btn-lg">
                <i className="fas fa-credit-card me-2"></i>Proceed to Payment
              </Link>
            </div>

          </div>
        </div>
      </div>
      </div>
        
    </>
  );
};

export default ProcessPayment;
