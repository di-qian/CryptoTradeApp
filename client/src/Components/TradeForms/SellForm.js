import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Button,
  Modal,
  Alert,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import './TradeForm.css';
import {
  listCryptos,
  listCryptosDetails,
  updateCryptosDetails,
  updateCryptos,
  deleteCrypto,
} from '../../actions/cryptoActions';
import {
  CRYPTO_UPDATE_DETAILS_RESET,
  CRYPTO_UPDATE_RESET,
  CRYPTO_DELETE_RESET,
} from '../../constants/cryptoConstants';

const SellForm = (props) => {
  const { cryptoPrice, cryptoTickers, sellorderStatusToast } = props;
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;
  const cryptoUpdateDetails = useSelector((state) => state.cryptoUpdateDetails);
  const {
    detail_update_success,
    error: detail_update_fail,
  } = cryptoUpdateDetails;
  const cryptoUpdate = useSelector((state) => state.cryptoUpdate);
  const { cryptos_update_success, error: cryptos_update_fail } = cryptoUpdate;

  const cryptoDelete = useSelector((state) => state.cryptoAdd);
  const {
    success: crypto_delete_success,
    error: crypto_delete_fail,
  } = cryptoDelete;

  const [show, setShow] = useState(false);

  const [sellAmount, setSellAmount] = useState(0);

  useEffect(() => {
    if (detail_update_success && cryptos_update_success) {
      sellorderStatusToast('Sell Order Completed!');
      dispatch({ type: CRYPTO_UPDATE_DETAILS_RESET });
      dispatch({ type: CRYPTO_UPDATE_RESET });
    }

    if (detail_update_fail || cryptos_update_fail) {
      sellorderStatusToast('Sell Order Failed!');
      dispatch({ type: CRYPTO_UPDATE_DETAILS_RESET });
      dispatch({ type: CRYPTO_UPDATE_RESET });
    }
  }, [
    detail_update_success,
    cryptos_update_success,
    detail_update_fail,
    cryptos_update_fail,
  ]);

  useEffect(() => {
    if (crypto_delete_success) {
      sellorderStatusToast('Sell Order Completed!');
      dispatch({ type: CRYPTO_DELETE_RESET });
    }

    if (crypto_delete_fail) {
      sellorderStatusToast('Sell Order Failed!');
      dispatch({ type: CRYPTO_DELETE_RESET });
    }
  }, [crypto_delete_success, crypto_delete_fail]);

  useEffect(() => {
    return () => {};
  }, []);

  const retrieveCashInfo = () => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cashinfo[0];
  };

  const deleteCryptoFromDatabase = async () => {
    const user_email = 'johndoe@gmail.com';
    await dispatch(
      deleteCrypto(cryptoTickers.base_currency_symbol, user_email)
    );

    await dispatch(
      listCryptosDetails(cryptoTickers.base_currency_symbol, user_email)
    );

    updateCash();

    handleClose();
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

    dispatch(listCryptosDetails(crypto.asset_ticker, crypto.owner_email));

    updateCash();
    handleClose();
  };

  const updateCash = async () => {
    var sell_quantity = sellAmount * cryptoPrice;
    var cash = Number(retrieveCashInfo().quantity) + +sell_quantity;
    console.log(sell_quantity);
    console.log(cash);
    const owner_email = 'johndoe@gmail.com';
    const asset_name = 'Cash';

    await dispatch(updateCryptos(owner_email, asset_name, cash));
    dispatch(listCryptos());
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

        <Form.Group as={Row} controlId="sellFormTradeAmount">
          <Form.Label column sm="4">
            Sell Quantity:
          </Form.Label>
          <Col sm="8">
            <InputGroup>
              <FormControl
                autoComplete="off"
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />

              <InputGroup.Append>
                <Button
                  className="button_SellAll"
                  variant="link"
                  onClick={() => setSellAmount(crypto.quantity)}
                >
                  Sell All
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="EstSellPrice">
          <Form.Label column sm="4">
            {crypto && crypto.asset_ticker} Ask Price:
          </Form.Label>
          <Col sm="8">
            <Form.Control
              placeholder="$0.00"
              value={`$${cryptoPrice}`}
              disabled={true}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="EstSellQuantity">
          <Form.Label column sm="4">
            Est $ Total:
          </Form.Label>
          <Col sm="8">
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
            Sell Amount In Crypto: {sellAmount} {crypto && crypto.asset_ticker}
          </p>
          <p>Market Price: ${cryptoPrice}</p>
          <p>
            {' '}
            Estimated Amount in USD : ${(sellAmount * cryptoPrice).toFixed(2)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={
              sellAmount === crypto.quantity
                ? deleteCryptoFromDatabase
                : updateCryptoDetail
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

export default SellForm;
