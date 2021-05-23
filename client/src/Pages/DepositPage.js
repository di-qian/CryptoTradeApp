import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import {
  Alert,
  Form,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
} from 'react-bootstrap';
import { listCryptos } from '../actions/cryptoActions';
import DepositForm from '../Components/DepositForm';

const DepositPage = ({ history }) => {
  const dispatch = useDispatch();

  const [cashTotal, setCashTotal] = useState(0);

  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const makeDepositInfo = useSelector((state) => state.makeDeposit);
  const { loading, error, success, deposit } = makeDepositInfo;

  // useEffect(() => {
  //   if (!userInfo) {
  //     history.push('/auth/fail');
  //   } else {
  //     dispatch(listCryptos(userInfo._id));
  //     setCashTotal(retrieveCashInfo());
  //   }
  // }, [dispatch, success, error]);

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(listCryptos(userInfo._id));
      setCashTotal(retrieveCashInfo());
    }
  }, []);

  useEffect(() => {
    setCashTotal(retrieveCashInfo());
  }, [cryptos]);

  const retrieveCashInfo = () => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cashinfo[0] && cashinfo[0].quantity.toFixed(2);
  };

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