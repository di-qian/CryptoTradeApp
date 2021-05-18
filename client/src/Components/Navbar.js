import React from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';

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

  return (
    <>
      <Navbar bg="light" expand="md" className="mb-3 navbar">
        <LinkContainer to={userInfo ? '/auth/dashboard' : '/'}>
          <Navbar.Brand className="nav-brand">
            <i
              className={
                userInfo
                  ? 'fas fa-rocket navbar-icon nav-brand-lgscreen'
                  : 'fas fa-rocket nav-brand-lgscreen'
              }
            >
              COINx
            </i>

            <i
              className={
                userInfo
                  ? 'fas fa-rocket fa-sm navbar-icon nav-brand-smscreen'
                  : 'fas fa-rocket fa-sm nav-brand-smscreen'
              }
            />
          </Navbar.Brand>
        </LinkContainer>
        {userInfo && (
          <Form inline className="mr-auto">
            <SearchBar />
          </Form>
        )}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-menu-btn"
        >
          <span>
            <i className="fas fa-bars" color="#20FC8F" size="2x" />
          </span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
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
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
