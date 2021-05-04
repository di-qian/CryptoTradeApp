import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './MyPosition.css';
import { useDispatch, useSelector } from 'react-redux';

const MyPosition = ({ cryptoPrice, openPrice }) => {
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;

  var return_today;
  var percentage_today;
  var worth;
  var return_total;
  var percentage_total;
  var purchase_price;

  if (cryptoPrice && openPrice && crypto) {
    return_today = ((cryptoPrice - openPrice) * crypto.quantity).toFixed(2);

    worth = (crypto.quantity * cryptoPrice).toFixed(2);
    percentage_today = ((return_today / worth) * 100).toFixed(2);
    var regp = /[^0-9.-]+/g;
    purchase_price = parseFloat(crypto.purchase_price.replace(regp, ''));

    return_total = (worth - purchase_price * crypto.quantity).toFixed(2);
    percentage_total = (
      (return_total / (purchase_price * crypto.quantity)) *
      100
    ).toFixed(2);
  }

  return (
    <div>
      <div className="title">Position</div>
      <div className="crypto_position">
        <Container className="crypto_position__container">
          <Row>
            <Col>
              <h5>{crypto && crypto.quantity}</h5>
              <p className="header_position">Quantity</p>
            </Col>
            <Col>
              <h5>{crypto && crypto.purchase_price}</h5>
              <p className="header_position">Average Cost</p>
            </Col>
            <Col>
              <h5>${worth}</h5>
              <p className="header_position">Value</p>
            </Col>
          </Row>
          <Row className="row__return">
            <div>
              <p className="row__return_header">Today's Return</p>
              <p
                className={return_today > 0 ? 'positivecolor' : 'negativecolor'}
              >
                {return_today > 0 && '+'}${return_today && return_today} (
                {percentage_today > 0 && '+'}
                {percentage_today && percentage_today}%)
              </p>
            </div>
            <div>
              <p className="row__return_header">Total Return</p>
              <p
                className={return_total > 0 ? 'positivecolor' : 'negativecolor'}
              >
                {return_total > 0 && '+'}${return_total && return_total} (
                {percentage_total > 0 && '+'}
                {percentage_total && percentage_total}%)
              </p>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MyPosition;
