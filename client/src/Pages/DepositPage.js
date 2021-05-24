import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap';
import { listCryptos } from '../actions/cryptoActions';
import DepositForm from '../Components/DepositForm';

const DepositPage = ({ history }) => {
  const dispatch = useDispatch();

  const [cashTotal, setCashTotal] = useState(0);

  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(listCryptos(userInfo._id));
    }
  }, [dispatch, history, userInfo]);

  useEffect(() => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');
    cashinfo[0] && setCashTotal(cashinfo[0].quantity.toFixed(2));
  }, [cryptos]);

  const makeDepositStatusToast = (e) => {
    dispatch(listCryptos(userInfo._id));
    toast.success(e);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col
            xs={{ span: 10, offset: 1 }}
            sm={{ span: 8, offset: 2 }}
            md={{ span: 6, offset: 3 }}
            className="form-outline"
          >
            <p className="title-deposit-page">
              Available Cash in USD: ${cashTotal}
            </p>
            <DepositForm makeDepositStatusToast={makeDepositStatusToast} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DepositPage;
