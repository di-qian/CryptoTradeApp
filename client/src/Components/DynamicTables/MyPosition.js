import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './MyPosition.css';
import { useSelector } from 'react-redux';

const MyPosition = ({ cryptoPrice, openPrice }) => {
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { crypto } = cryptoListDetails;
  const [cryptoQuantity, setCryptoQuantity] = useState(0);

  var return_today;
  var percentage_today;
  var worth;
  var return_total;
  var percentage_total;
  var purchase_price;

  useEffect(() => {
    crypto && !crypto.not_own && setCryptoQuantity(crypto.quantity);
  }, [crypto]);

  if (cryptoPrice && openPrice && crypto && !crypto.not_own) {
    return_today = ((cryptoPrice - openPrice) * cryptoQuantity).toFixed(2);

    worth = (cryptoQuantity * cryptoPrice).toFixed(2);
    percentage_today = ((return_today / worth) * 100).toFixed(2);
    var regp = /[^0-9.-]+/g;
    purchase_price = parseFloat(crypto.purchase_price.replace(regp, ''));

    return_total = (worth - purchase_price * cryptoQuantity).toFixed(2);
    percentage_total = (
      (return_total / (purchase_price * cryptoQuantity)) *
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
              <h6>{crypto && (!crypto.not_own ? cryptoQuantity : 0)}</h6>
              <p className="header_position">Quantity</p>
            </Col>
            <Col>
              <h6>
                {crypto && (!crypto.not_own ? crypto.purchase_price : '----')}
              </h6>
              <p className="header_position">Average Cost</p>
            </Col>
            <Col>
              <h6>${crypto && (!crypto.not_own ? worth : 0)}</h6>
              <p className="header_position">Value</p>
            </Col>
          </Row>
          <Row className="row__return">
            <div>
              <p className="row__return_header">Today's Return</p>
              {crypto &&
                (!crypto.not_own ? (
                  <p
                    className={
                      return_today > 0 ? 'positivecolor' : 'negativecolor'
                    }
                  >
                    {return_today > 0 && '+'}${return_today && return_today} (
                    {percentage_today > 0 && '+'}
                    {percentage_today && percentage_today}%)
                  </p>
                ) : (
                  <p>----</p>
                ))}
            </div>
            <div>
              <p className="row__return_header">Total Return</p>
              {crypto &&
                (!crypto.not_own ? (
                  <p
                    className={
                      return_total > 0 ? 'positivecolor' : 'negativecolor'
                    }
                  >
                    {return_total > 0 && '+'}${return_total && return_total} (
                    {percentage_total > 0 && '+'}
                    {percentage_total && percentage_total}%)
                  </p>
                ) : (
                  <p>----</p>
                ))}
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MyPosition;
