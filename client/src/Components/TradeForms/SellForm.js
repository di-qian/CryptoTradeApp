import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Card,
  Nav,
  Form,
  Row,
  Col,
  Button,
  Modal,
  Alert,
} from 'react-bootstrap';
import './TradeForm.css';
import {
  listCryptos,
  listCryptosDetails,
  updateCryptosDetails,
  updateCryptos,
} from '../../actions/cryptoActions';
import {
  CRYPTO_UPDATE_DETAILS_RESET,
  CRYPTO_UPDATE_RESET,
} from '../../constants/cryptoConstants';

const SellForm = ({ cryptoPrice }) => {
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;
  const cryptoUpdateDetails = useSelector((state) => state.cryptoUpdateDetails);
  const { detail_update_success } = cryptoUpdateDetails;
  const cryptoUpdate = useSelector((state) => state.cryptoUpdate);
  const { cryptos_update_success } = cryptoUpdate;

  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [sellAmount, setSellAmount] = useState(0);

  useEffect(() => {
    if (detail_update_success && cryptos_update_success) {
      setShowAlert(true);

      dispatch({ type: CRYPTO_UPDATE_DETAILS_RESET });
      dispatch({ type: CRYPTO_UPDATE_RESET });
    }
  }, [detail_update_success, cryptos_update_success]);

  useEffect(() => {
    return () => {
      setShowAlert(false);
    };
  }, []);

  const retrieveCashInfo = () => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cashinfo[0];
  };

  const updateCryptoDetail = async () => {
    var quantity;
    var sell_quantity;
    var cryptoCurrentAverageCost;
    var purchase_price;
    var regp = /[^0-9.-]+/g;
    cryptoCurrentAverageCost = Number(
      parseFloat(crypto.purchase_price.replace(regp, ''))
    );
    sell_quantity = sellAmount * cryptoPrice;
    quantity = (+crypto.quantity - +sellAmount).toFixed(8);
    purchase_price =
      (+crypto.quantity * cryptoCurrentAverageCost - +sell_quantity) /
      +quantity;
    setSellAmount(0);

    await dispatch(
      updateCryptosDetails({ ...crypto, quantity, purchase_price })
    );

    var cash = retrieveCashInfo().quantity + +sell_quantity;
    const owner_email = 'johndoe@gmail.com';
    const asset_name = 'Cash';

    await dispatch(updateCryptos(owner_email, asset_name, cash));

    dispatch(listCryptosDetails(crypto.ticker, crypto.owner_email));
    dispatch(listCryptos());
    handleClose();
  };

  const enterSellAmount = (e) => {
    setSellAmount(e);
    setShowAlert(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Form>
        <Form.Label className="TradeForm-intro">
          Total purchase power $
          {retrieveCashInfo() && retrieveCashInfo().quantity}
        </Form.Label>
        <hr />

        <Form.Group as={Row} controlId="sellFormTradeAmount">
          <Form.Label column sm="6">
            Sell Amount In Crypto
          </Form.Label>
          <Col sm="6">
            <Form.Control
              placeholder="$0.00"
              value={sellAmount}
              onChange={(e) => enterSellAmount(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="EstSellPrice">
          <Form.Label column sm="6">
            {crypto && crypto.ticker} Ask Price
          </Form.Label>
          <Col sm="6">
            <Form.Control
              placeholder="$0.00"
              value={`$${cryptoPrice}`}
              disabled={true}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="EstSellQuantity">
          <Form.Label column sm="6">
            Est Amount in USD
          </Form.Label>
          <Col sm="6">
            <Form.Control
              placeholder="$0.00"
              value={'$' + (sellAmount * cryptoPrice).toFixed(2)}
              disabled={true}
            />
          </Col>
        </Form.Group>
        <Alert
          variant={'danger'}
          show={crypto ? sellAmount > crypto.quantity : false}
        >
          Insufficient Crypto
        </Alert>

        {showAlert && (
          <Alert
            variant={'success'}
            dismissible
            transition
            show={showAlert}
            onClose={() => setShowAlert(false)}
          >
            Sell Order Completed
          </Alert>
        )}

        <Form.Group as={Row} controlId="sumbits">
          <Col className="d-flex justify-content-center">
            <Button
              variant="outline-info"
              type="button"
              disabled={sellAmount > 0 ? false : true}
              block
              onClick={() => handleShow()}
            >
              Review Order
            </Button>
          </Col>
        </Form.Group>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Review Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Sell Amount In Crypto: {sellAmount} {crypto && crypto.ticker}
          </p>
          <p>Market Price: ${cryptoPrice}</p>
          <p>
            {' '}
            Estimated Amount in USD : ${(sellAmount * cryptoPrice).toFixed(2)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={updateCryptoDetail}>
            Place Order
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SellForm;
