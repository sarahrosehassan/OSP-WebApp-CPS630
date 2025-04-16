import React from 'react';
import './footer.css';
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Stay updated with our latest collections and exclusive offers</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="main-footer">
          {/* Brand */}
          <div className="footer-col">
            <h4 className="brand-name">LUXE HAVEN</h4>
            <p className="brand-description">
              Discover the epitome of luxury with our curated collection of designer handbags.
              Each piece tells a story of craftsmanship and elegance.
            </p>
            <div className="social-links">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaPinterestP /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Best Sellers</a></li>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-col">
            <h5 className="footer-title">Customer Service</h5>
            <ul className="footer-links">
              <li><a href="#">Shipping Information</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Care Instructions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h5 className="footer-title">Contact Us</h5>
            <ul className="footer-contact">
              <li><FaMapMarkerAlt /> 123 Luxury Lane, Toronto, ON</li>
              <li><FaPhone /> +1 (416) 555-0123</li>
              <li><FaEnvelope /> contact@luxehaven.com</li>
              <li><FaClock /> Mon - Sat: 10:00 - 19:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bottom-footer">
          <p>&copy; 2024 Luxe Haven. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
