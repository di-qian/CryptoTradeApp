import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import './Navbar.css';
import SearchBar from './SearchBar';
import { logout } from '../actions/userActions';

const NavBar = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <Navbar bg="light" expand="md" className="mb-3 navbar">
        <LinkContainer to={userInfo ? '/auth/dashboard' : '/'}>
          <Navbar.Brand className="nav-brand">
            <div>
              <i
                className={
                  userInfo
                    ? 'fas fa-rocket navbar-icon nav-brand-lgscreen'
                    : 'fas fa-rocket nav-brand-lgscreen'
                }
              >
                {} COINx
              </i>
            </div>
            <div className={userInfo ? 'taglineloggedin' : 'taglineloggedout'}>
              A better way to paper trade cryptocurrencies
            </div>
            <i
              className={
                userInfo
                  ? 'fas fa-rocket fa-sm navbar-icon nav-brand-smscreen'
                  : 'fas fa-rocket fa-sm nav-brand-smscreen'
              }
            >
              {userInfo ? '' : ' COINx'}
            </i>
          </Navbar.Brand>
        </LinkContainer>
        {userInfo && (
          <Form inline className="mr-auto">
            <SearchBar />
          </Form>
        )}
        <Navbar.Toggle className="navbar-menu-btn">
          <span onClick={showSidebar}>
            <i
              className="fas fa-bars hamburger-btn"
              color="#20FC8F"
              size="2x"
            />
          </span>
        </Navbar.Toggle>

        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <div className="nav-menu-items" onClick={showSidebar}>
            <div className="navbar-toggle">
              <Link to="#" className="menu-bars"></Link>
            </div>
            {userInfo ? (
              <>
                <div className="nav-text">
                  <Link to={userInfo ? '/auth/dashboard' : '/'}>
                    <span className="nav-text-item">DASHBOARD</span>
                  </Link>
                </div>
                <div className="nav-text">
                  <Link to={userInfo ? '/auth/deposit' : '/'}>
                    <span className="nav-text-item">DEPOSIT</span>
                  </Link>
                </div>
                <div className="nav-text">
                  <Link to="#">
                    <span className="nav-text-item" onClick={logoutHandler}>
                      LOG OUT
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="nav-text">
                  <Link to="/login">
                    <span className="nav-text-item">LOG IN</span>
                  </Link>
                </div>
                <div className="nav-text">
                  <Link to="/register">
                    <span className="nav-text-item">REGISTER</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>

        <Nav className="ml-auto btNavbar">
          {userInfo ? (
            <>
              <LinkContainer to={userInfo ? '/auth/deposit' : '/'}>
                <Nav.Link>
                  <Button variant="warning" className="navbarbtn">
                    Deposit
                  </Button>
                </Nav.Link>
              </LinkContainer>

              <Nav.Link>
                <Button
                  variant="warning"
                  className="navbarbtn"
                  onClick={logoutHandler}
                >
                  Log out
                </Button>
              </Nav.Link>
            </>
          ) : (
            <>
              <LinkContainer to="/login">
                <Nav.Link>
                  <Button variant="warning" className="navbarbtn">
                    Log in
                  </Button>
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/register">
                <Nav.Link>
                  <Button variant="warning" className="navbarbtn">
                    Sign up
                  </Button>
                </Nav.Link>
              </LinkContainer>
            </>
          )}
        </Nav>
      </Navbar>
    </>
  );
};

export default NavBar;
