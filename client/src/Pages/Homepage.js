import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { USER_LOGIN_ERRORS_RESET } from '../constants/userConstants';
import TopGainerTable from '../Components/DynamicTables/TopGainerTable';
import TopLoserTable from '../Components/DynamicTables/TopLoserTable';
import NewsList from '../Components/NewsList';

const Homepage = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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

  return (
    <>
      <Container>
        <Row className="mb-4">
          <Col>
            <TopGainerTable />
          </Col>
          <Col>
            <TopLoserTable />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewsList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Homepage;
