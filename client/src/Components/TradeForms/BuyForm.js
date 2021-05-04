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
} from 'react-bootstrap';
import './TradeForm.css';
import { listCryptos } from '../../actions/cryptoActions';

const BuyForm = () => {
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;

  const [show, setShow] = useState(false);

  useEffect(() => {
    //dispatch(listCryptos());
  }, []);

  const retrieveCashInfo = () => {
    const cash = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cash[0];
  };

  const settingResolvedAt = async () => {
    // setResolvedAt(Date.now());
    // await dispatch(updateBug('UPDATE_RESOLVEDAT', { ...bug, resolvedAt }));

    // const combined_comment = 'assigned the task status to RESOLVED!';

    // await dispatch(createBugComment(match.params.id, { combined_comment }));
    // setIsConfirmMode(true);
    handleClose();
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

        <Form.Group as={Row} controlId="buyFormTradeAmount">
          <Form.Label column sm="6">
            Amount in USD
          </Form.Label>
          <Col sm="6">
            <Form.Control placeholder="$0.00" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="BidPrice">
          <Form.Label column sm="6">
            Limited BTC Price
          </Form.Label>
          <Col sm="6">
            <Form.Control placeholder="$0.00" />
          </Col>
        </Form.Group>
        <br />
        <Form.Group as={Row} controlId="sumbits">
          <Col className="d-flex justify-content-center">
            <Button
              variant="outline-info"
              type="button"
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
          Once confirmed, the form can no longer be edited!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={settingResolvedAt}>
            Confirm
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
