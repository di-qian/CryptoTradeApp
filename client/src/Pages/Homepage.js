import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { USER_LOGIN_ERRORS_RESET } from '../constants/userConstants';

import TopGainerTable from '../Components/DynamicTables/TopGainerTable';
import TopLoserTable from '../Components/DynamicTables/TopLoserTable';
import NewsList from '../Components/NewsList';
import TesterMessageToastFrontPage from '../Components/TesterMessageToastFrontPage';

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
      <Row className="justify-content-md-center">
        <Col xs sm="4" md="3" lg="2" className="mr-auto">
          <TesterMessageToastFrontPage />
        </Col>

        <Col sm="4" md="6" lg="8" className="mr-auto">
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
        </Col>
        <Col xs sm="4" md="3" lg="2" className="mr-auto"></Col>
      </Row>
    </>
  );
};

export default Homepage;
