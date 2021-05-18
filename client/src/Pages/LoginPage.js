import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader';
import FormContainer from '../Components/FormContainer';
import { login } from '../actions/userActions';
import { USER_LOGIN_ERRORS_RESET } from '../constants/userConstants';

const LoginPage = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, errors, userInfo } = userLogin;

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/auth/dashboard';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    } else {
      dispatch({ type: USER_LOGIN_ERRORS_RESET });
    }
  }, [history, userInfo, redirect, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    setEmailEdit(false);
    setPasswordEdit(false);
    dispatch(login(email, password));
  };

  const settingEmail = (e) => {
    setEmail(e);
    setEmailEdit(true);
  };

  const settingPassword = (e) => {
    setPassword(e);
    setPasswordEdit(true);
  };

  return (
    <FormContainer>
      <Row className="justify-content-md-center">
        <Col
          xs={{ span: 10, offset: 1 }}
          sm={{ span: 8, offset: 2 }}
          md={{ span: 6, offset: 0 }}
          lg={{ span: 4, offset: 0 }}
        >
          <h3 className="pagetitlefont mb-3">Sign In</h3>

          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group className="groupposition" controlId="email">
              <Form.Label className="mr-1">
                <i className="fas fa-asterisk fa-xs fh mr-1"></i>Email Address
              </Form.Label>

              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => settingEmail(e.target.value)}
                isInvalid={errors && errors.email && !emailEdit}
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="groupposition" controlId="password">
              <Form.Label className="mr-1">
                <i className="fas fa-asterisk fa-xs fh mr-1"></i>Password
              </Form.Label>

              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => settingPassword(e.target.value)}
                isInvalid={errors && errors.password && !passwordEdit}
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="mr-2">
              Sign In
            </Button>
            <Link className="btn btn-dark" to="/">
              Go Back
            </Link>
          </Form>

          <Row className="py-3">
            <Col>
              New User?{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
              >
                Register
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
