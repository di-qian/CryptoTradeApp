import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
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
    console.log('hello');
    dispatch(logout());
  };

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-3">
        <LinkContainer to={userInfo ? '/auth/dashboard' : '/'}>
          <Navbar.Brand>
            <i
              className={
                userInfo ? 'fas fa-rocket navbar-icon' : 'fas fa-rocket'
              }
            >
              COINx{' '}
            </i>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {userInfo && (
            <Form inline>
              <SearchBar />
            </Form>
          )}
          <Nav className="ml-auto">
            {userInfo ? (
              <>
                <Nav.Link>
                  <Button variant="warning">Deposit</Button>
                </Nav.Link>

                <Nav.Link>
                  <Button variant="warning" onClick={logoutHandler}>
                    Logout
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <LinkContainer to="/login">
                <Button variant="secondary">Sign In</Button>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
