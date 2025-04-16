import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import '../styles/reviews.css';

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item_id');
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    ranking: '',
    shipping_rating: '',
    delivery_rating: '',
    service_rating: '',
    review: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itemId) return;
    fetch(`http://localhost/osp_it1-2_cps630/backend/api/reviews.php?item_id=${itemId}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItem(data.item);
          setReviews(data.reviews);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('Failed to load item or reviews'));
  }, [itemId]);

  const handleInput = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      item_id: parseInt(itemId)
    };

    const res = await fetch('http://localhost/osp_it1-2_cps630/backend/api/reviews.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      setSubmitted(true);
      setReviews([{ ...payload, email: 'You', created_at: new Date().toISOString(), review_text: payload.review }, ...reviews]);
      setForm({ ranking: '', shipping_rating: '', delivery_rating: '', service_rating: '', review: '' });
      setError(null);
    } else {
      setError(data.message || 'Submission failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="reviews-body">
      <div className="container py-5">
        {item ? (
          <div className="row">
            <div className="col-md-5 text-center">
              <h2 className="mb-3">{item.item_name}</h2>
              <img src={`../images/${item.item_image}`} className="item-image img-fluid mb-3" alt={item.item_name} />
              <p><strong>Made in:</strong> {item.made_in}</p>
              <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div className="col-md-7">
              <div className="item-card mb-4">
                <h4 className="text-center">Leave a Review</h4>
                {submitted && <p className="text-success text-center">Thank you for your review!</p>}
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                  {[
                    ['ranking', 'Item'],
                    ['shipping_rating', 'Shipping'],
                    ['delivery_rating', 'Delivery'],
                    ['service_rating', 'Service']
                  ].map(([name, label]) => (
                    <div key={name} className="mb-2">
                      <label>{label} Rating:</label>
                      <div className="star-rating">
                        {[5, 4, 3, 2, 1].map(star => (
                          <React.Fragment key={star}>
                            <input
                              type="radio"
                              id={`${name}_${star}`}
                              name={name}
                              value={star}
                              checked={form[name] === star.toString()}
                              onChange={handleInput}
                              required
                            />
                            <label htmlFor={`${name}_${star}`}>★</label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                  <label>Your Review:</label>
                  <input
                    type="text"
                    name="review"
                    className="form-control mb-3"
                    value={form.review}
                    onChange={handleInput}
                    required
                  />
                  <button type="submit" className="btn btn-dark btn-block">Submit Review</button>
                </form>
              </div>
              <h4 className="text-center mb-4">Reviews</h4>
              {reviews.length > 0 ? reviews.map((r, idx) => (
                <div className="review-box mb-3" key={idx}>
                  <strong>{r.email}</strong>
                  <p><em>{r.review_text}</em></p>
                  <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Item: {r.ranking_number}/5 | Shipping: {r.shipping_rating}/5 | Delivery: {r.delivery_rating}/5 | Service: {r.service_rating}/5
                  </div>
                  <small className="text-muted">Posted on {r.created_at}</small>
                </div>
              )) : <p className="text-center">No reviews yet.</p>}
            </div>
          </div>
        ) : (
          <p className="text-center">Loading item...</p>
        )}
      </div>
      </div>
    </>
  );
};

export default Reviews;
