import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import Loader from '../Components/Loader';
import FormContainer from '../Components/FormContainer';
import { register } from '../actions/userActions';
import { GET_ERRORS_RESET } from '../constants/userConstants';

const RegisterPage = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [confirmPasswordEdit, setConfirmPasswordEdit] = useState(false);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo, errors } = userRegister;

  const redirect = '/auth/dashboard';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
    dispatch({ type: GET_ERRORS_RESET });
  }, [history, userInfo, redirect, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setEmailEdit(false);
    setPasswordEdit(false);
    setConfirmPasswordEdit(false);
    await dispatch(register(name, email, password, confirmPassword));
  };

  const settingEmail = (e) => {
    setEmail(e);
    setEmailEdit(true);
  };

  const settingPassword = (e) => {
    setPassword(e);
    setPasswordEdit(true);
  };

  const settingConfirmPassword = (e) => {
    setConfirmPassword(e);
    setConfirmPasswordEdit(true);
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
          <h3 className="pagetitlefont">Sign Up</h3>
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group className="groupposition" controlId="name">
              <Form.Label className="mr-1">
                <i className="fas fa-asterisk fa-xs fh mr-1"></i>Name
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={errors && errors.name && !name}
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="groupposition" controlId="email">
              <Form.Label className="mr-1">
                {' '}
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

            <Form.Group className="groupposition" controlId="confirmPassword">
              <Form.Label className="mr-1">
                <i className="fas fa-asterisk fa-xs fh mr-1"></i>Confirm
                Password
              </Form.Label>

              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => settingConfirmPassword(e.target.value)}
                isInvalid={
                  errors && errors.confirmPassword && !confirmPasswordEdit
                }
              ></Form.Control>
              <Form.Control.Feedback
                className="tooltipposition"
                type="invalid"
                tooltip
              >
                {errors && errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="mr-2">
              Register
            </Button>
            <Link className="btn btn-dark" to="/">
              Go Back
            </Link>
          </Form>
          <Row className="py-3">
            <Col>
              Have an Account?{' '}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                Login
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;
