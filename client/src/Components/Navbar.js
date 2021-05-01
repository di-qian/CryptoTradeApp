import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavBar = () => {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <div className="navbar">
        <div className="navbar-container container-fluid">
          <Link to="/" className="navbar-logo">
            <i className="fas fa-rocket navbar-icon" />
            IntelliTrade
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            {click ? (
              <i className="fas fa-times" />
            ) : (
              <i className="fas fa-bars" />
            )}
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-links">
                Deposit
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-links">
                Log out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
