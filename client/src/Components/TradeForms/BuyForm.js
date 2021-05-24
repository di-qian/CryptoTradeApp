import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import './TradeForm.css';
import {
  listCryptos,
  listCryptosDetails,
  updateCryptosDetails,
  updateCryptos,
  addCrypto,
} from '../../actions/cryptoActions';
import {
  CRYPTO_UPDATE_DETAILS_RESET,
  CRYPTO_UPDATE_RESET,
  CRYPTO_CREATE_RESET,
} from '../../constants/cryptoConstants';

const BuyForm = (props) => {
  const { cryptoPrice, cryptoTickers, buyorderStatusToast } = props;
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { crypto } = cryptoListDetails;
  const cryptoUpdateDetails = useSelector((state) => state.cryptoUpdateDetails);
  const { detail_update_success, error: detail_update_fail } =
    cryptoUpdateDetails;
  const cryptoUpdate = useSelector((state) => state.cryptoUpdate);
  const { cryptos_update_success, error: cryptos_update_fail } = cryptoUpdate;

  const cryptoAdd = useSelector((state) => state.cryptoAdd);
  const { success: crypto_add_success, error: crypto_add_fail } = cryptoAdd;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [show, setShow] = useState(false);

  const [buyAmount, setBuyAmount] = useState(0);

  useEffect(() => {
    setBuyAmount(0);
  }, [crypto]);

  useEffect(() => {
    if (detail_update_success && cryptos_update_success) {
      buyorderStatusToast('Buy Order Completed!');
      //toast.success('Buy Order Completed!');
      dispatch({ type: CRYPTO_UPDATE_DETAILS_RESET });
      dispatch({ type: CRYPTO_UPDATE_RESET });
    }

    if (detail_update_fail || cryptos_update_fail) {
      buyorderStatusToast('Buy Order Failed!');
      dispatch({ type: CRYPTO_UPDATE_DETAILS_RESET });
      dispatch({ type: CRYPTO_UPDATE_RESET });
    }
  }, [
    dispatch,
    detail_update_success,
    cryptos_update_success,
    detail_update_fail,
    cryptos_update_fail,
    buyorderStatusToast,
  ]);

  useEffect(() => {
    if (crypto_add_success) {
      buyorderStatusToast('Buy Order Completed!');
      //toast.success('Buy Order Completed!');
      dispatch({ type: CRYPTO_CREATE_RESET });
    }

    if (crypto_add_fail) {
      buyorderStatusToast('Buy Order Failed!');
      //toast.error('Buy Order Failed!');
      dispatch({ type: CRYPTO_CREATE_RESET });
    }
  }, [dispatch, crypto_add_success, crypto_add_fail, buyorderStatusToast]);

  const retrieveCashInfo = () => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cashinfo[0];
  };

  const addCryptoToDatabase = async () => {
    let newCrypto = {
      user_id: userInfo._id,
      owner_email: userInfo.email,
      asset_name: cryptoTickers.base_currency_name,
      asset_ticker: cryptoTickers.base_currency_symbol,
      quantity: buyAmount / cryptoPrice,
      purchase_price: cryptoPrice,
    };
    await dispatch(addCrypto(newCrypto));

    await dispatch(listCryptosDetails(crypto.asset_ticker, userInfo._id));

    updateCash();

    handleClose();
  };

  const updateCryptoDetail = async () => {
    var quantity;
    var add_quantity;
    var cryptoCurrentAverageCost;
    var purchase_price;
    var regp = /[^0-9.-]+/g;
    cryptoCurrentAverageCost = Number(
      parseFloat(crypto.purchase_price.replace(regp, ''))
    );
    add_quantity = buyAmount / cryptoPrice;
    quantity = (+crypto.quantity + +add_quantity).toFixed(8);
    purchase_price =
      (+buyAmount + +crypto.quantity * cryptoCurrentAverageCost) / +quantity;
    setBuyAmount(0);

    await dispatch(
      updateCryptosDetails({ ...crypto, quantity, purchase_price })
    );

    dispatch(listCryptosDetails(crypto.asset_ticker, userInfo._id));

    updateCash();

    handleClose();
  };

  const updateCash = async () => {
    var cash = retrieveCashInfo().quantity - buyAmount;
    var user_id = userInfo._id;
    const asset_name = 'Cash';

    await dispatch(updateCryptos(user_id, asset_name, cash));
    dispatch(listCryptos(userInfo._id));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Form>
        <Form.Label className="TradeForm-intro">
          Total cash available $
          {retrieveCashInfo() && retrieveCashInfo().quantity.toFixed(2)}
        </Form.Label>

        <Form.Group as={Row} controlId="buyFormTradeAmount">
          <Form.Label column sm="6">
            Amount in USD ($):
          </Form.Label>
          <Col sm="6">
            <Form.Control
              autoComplete="off"
              placeholder="$0.00"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="EstBuyPrice">
          <Form.Label column sm="4">
            {crypto && crypto.asset_ticker} Bid Price:
          </Form.Label>
          <Col sm="8">
            <Form.Control
              placeholder="$0.00"
              value={`$${cryptoPrice}`}
              disabled={true}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="EstBuyQuantity">
          <Form.Label column sm="4">
            Est {crypto && crypto.asset_ticker}:
          </Form.Label>
          <Col sm="8">
            <Form.Control
              placeholder="$0.00"
              value={(buyAmount / cryptoPrice).toFixed(8)}
              disabled={true}
            />
          </Col>
        </Form.Group>

        <br />

        <Alert
          variant={'danger'}
          show={
            retrieveCashInfo() ? buyAmount > retrieveCashInfo().quantity : false
          }
        >
          Insufficient fund
        </Alert>

        <Form.Group as={Row} controlId="sumbits">
          <Col className="d-flex justify-content-center">
            <Button
              variant="outline-info"
              type="button"
              disabled={buyAmount > 0 ? false : true}
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
          <p>Purchase amount in USD ${buyAmount}</p>
          <p>Market price ${cryptoPrice}</p>
          <p>
            {' '}
            Estimated {crypto && crypto.asset_ticker} (QTY) :{' '}
            {(buyAmount / cryptoPrice).toFixed(8)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={
              crypto && !crypto.not_own
                ? updateCryptoDetail
                : addCryptoToDatabase
            }
          >
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

export default BuyForm;
