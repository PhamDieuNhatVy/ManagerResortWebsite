import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* Column 1: Company Info */}
          <div className="col-md-3">
            <h5 className="font-weight-bold">Mrs. Hang Farm</h5>
            <p>Enjoy a relaxing stay at our beautiful hotel & resort.</p>
        
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-md-3">
            <h5 className="font-weight-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white">About Us</Link>
              </li>
              <li>
                <Link to="/rooms" className="text-white">Rooms</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="col-md-3">
            <h5 className="font-weight-bold">Our Services</h5>
            <ul className="list-unstyled">
              <li>Free Wi-Fi</li>
              <li>24/7 Room Service</li>
              <li>Airport Pickup</li>
              <li>Swimming Pool</li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="col-md-3">
            <h5 className="font-weight-bold">Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://facebook.com" className="text-white">Facebook</a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-white">Instagram</a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-white">Twitter</a>
              </li>
              <li>
                <a href="https://linkedin.com" className="text-white">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center pt-4">    <p>© 2024 Mrs. Hang Farm. All rights reserved.</p></div>
    </footer>
  );
};

export default Footer;
