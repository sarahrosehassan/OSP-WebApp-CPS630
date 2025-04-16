import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import '../styles/payment.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [formData, setFormData] = useState({
    payment_method: 'debit',
    gift_card_code: '',
    payment_code: '',
    card_number: '',
    expiry_date: '',
    cvv: ''
  });
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    fetch('http://localhost/osp_it1-2_cps630/backend/api/payment.php', {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const total = parseFloat(data.total_price) || 0;
          const fee = parseFloat(data.delivery_fee) || 0;
          setTotalPrice(total);
          setOriginalTotal(total);
          setDeliveryFee(fee);
        } else {
          setAlert({ message: data.message, type: 'danger' });
        }
      })
      .catch(() => {
        setAlert({ message: 'Failed to load payment details.', type: 'danger' });
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyGiftCard = async () => {
    if (!formData.gift_card_code) {
      setAlert({ message: 'Please enter a gift card code.', type: 'danger' });
      return;
    }

    const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/apply_giftcard.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ gift_code: formData.gift_card_code })
    });

    const data = await res.json();
    if (data.success) {
      if (!data.fully_covered) {
        setTotalPrice(parseFloat(data.remaining_amount));
        setAlert({ message: data.message, type: 'info' });
      } else {
        setTotalPrice(0);
        setAlert({ message: data.message, type: 'success' });
      }
    } else {
      setAlert({ message: data.message, type: 'danger' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost/osp_it1-2_cps630/backend/api/payment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      setAlert({ message: data.message + ' Redirecting to homepage...', type: 'success' });
      setRedirecting(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } else {
      setAlert({ message: data.message, type: 'danger' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="payment-body">
      <div className={`payment-container ${redirecting ? 'fade-out' : ''}`}>
        <div className="container">
          <h1 className="section-title">Secure Payment</h1>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="form-container">
                <div className="payment-icon">
                  <i className="fas fa-lock"></i>
                </div>

                {alert.message && (
                  <div className={`alert alert-${alert.type}`}>{alert.message}</div>
                )}

                <div className="total-price">
                ${originalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                <small>Including delivery fee (${deliveryFee.toFixed(2)}) and 13% tax</small>
                </div>


                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="payment_method" value="debit" checked={formData.payment_method === 'debit'} onChange={handleChange} />
                        <label className="form-check-label">Credit/Debit Card</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="payment_method" value="gift" checked={formData.payment_method === 'gift'} onChange={handleChange} />
                        <label className="form-check-label">Gift Card</label>
                      </div>
                    </div>
                  </div>

                  {formData.payment_method === 'gift' && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="gift_card_code">Gift Card Code</label>
                      <div className="d-flex">
                        <input type="text" className="form-control me-2" name="gift_card_code" value={formData.gift_card_code} onChange={handleChange} />
                        <button type="button" className="btn btn-outline-dark" onClick={applyGiftCard}>Apply</button>
                      </div>
                    </div>
                  )}

                  {formData.payment_method === 'debit' && totalPrice > 0 && (
                    <>
                      <div className="form-group">
                        <label className="form-label" htmlFor="card_number">Card Number</label>
                        <input type="text" className="form-control" name="card_number" value={formData.card_number} onChange={handleChange} required />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label" htmlFor="expiry_date">Expiry Date</label>
                            <input type="text" className="form-control" name="expiry_date" value={formData.expiry_date} onChange={handleChange} placeholder="MM/YY" required />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label" htmlFor="cvv">CVV</label>
                            <input type="text" className="form-control" name="cvv" value={formData.cvv} onChange={handleChange} required />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="payment_code">Discount Code</label>
                    <input type="text" className="form-control" name="payment_code" value={formData.payment_code} onChange={handleChange} required />
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary">Complete Payment</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default PaymentPage;
