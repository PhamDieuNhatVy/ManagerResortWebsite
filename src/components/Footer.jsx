import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 pt-4">
      <div className="container mx-auto px-10  justify-around">
        <div className="flex flex-wrap justify-around">
          {/* Column 1: Company Info */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Mrs. Hang Farm</h5>
            <p className="text-gray-600">Enjoy a relaxing stay at our beautiful hotel & resort.</p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Quick Links</h5>
            <ul className="list-none space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
              </li>
              <li>
                <Link to="/rooms" className="text-gray-600 hover:text-gray-900">Rooms</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Our Services</h5>
            <ul className="list-none space-y-2">
              <li className="text-gray-600">Free Wi-Fi</li>
              <li className="text-gray-600">24/7 Room Service</li>
              <li className="text-gray-600">Airport Pickup</li>
              <li className="text-gray-600">Swimming Pool</li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="flex-1 px-4 mb-6 min-w-[200px]">
            <h5 className="text-xl font-bold mb-2">Follow Us</h5>
            <ul className="list-none space-y-2">
              <li>
                <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaFacebook className="mr-2" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaInstagram className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaTwitter className="mr-2" /> Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaLinkedin className="mr-2" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center bg-black p-4">
        <p className="text-white">© 2024 Mrs. Hang Farm. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
