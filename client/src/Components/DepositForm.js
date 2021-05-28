import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { Button, InputGroup, Form, FormControl } from 'react-bootstrap';
import { MAKE_DEPOSIT_RESET } from '../constants/transactionConstants';
import { makeDeposit } from '../actions/transactionActions';
import stripeLogo from '../img/stripelogo.png';
import './DepositForm.css';

const DepositForm = (props) => {
  const [cashDeposit, setCashDeposit] = useState(0);
  const [depositBtnDisabled, setDepositBtnDisabled] = useState(true);

  const { makeDepositStatusToast } = props;
  const dispatch = useDispatch();

  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const makeDepositInfo = useSelector((state) => state.makeDeposit);
  const { error, success } = makeDepositInfo;

  useEffect(() => {
    if (success) {
      makeDepositStatusToast(`$${cashDeposit} Deposited Successfully`);

      dispatch({ type: MAKE_DEPOSIT_RESET });
      setDepositBtnDisabled(true);
    }

    if (error) {
      makeDepositStatusToast('Deposit Failed!');

      dispatch({ type: MAKE_DEPOSIT_RESET });
      setDepositBtnDisabled(true);
    }

    setCashDeposit(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, success, error, makeDepositStatusToast]);

  const retrieveCashInfo = () => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cashinfo[0];
  };

  const validateCashDepoist = (e) => {
    if (Number(e.target.value) > 0) {
      setDepositBtnDisabled(false);
    } else {
      setDepositBtnDisabled(true);
    }
    setCashDeposit(e.target.value);
  };

  const validateDeposit = (e) => {
    if (depositBtnDisabled) {
      return e.stopPropagation();
    }
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="0.00"
          aria-label="Amount (to the nearest dollar)"
          value={cashDeposit}
          onChange={(e) => {
            validateCashDepoist(e);
          }}
          isInvalid={error && error.value}
        />
        <Form.Control.Feedback
          className="tooltipposition"
          type="invalid"
          tooltip
        >
          {error && error.value}
        </Form.Control.Feedback>

        <InputGroup.Append>
          <StripeCheckout
            name="Deposit"
            email={userInfo.email}
            description={`Deposit $${cashDeposit} Into Your Account`}
            amount={cashDeposit * 100}
            token={(token) =>
              dispatch(makeDeposit(token, retrieveCashInfo(), cashDeposit))
            }
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
          >
            <Button
              variant="primary"
              // disabled={depositBtnDisabled}
              onClick={validateDeposit}
            >
              DEPOSIT
            </Button>
          </StripeCheckout>
        </InputGroup.Append>
      </InputGroup>
      <img className="img-stripe" src={stripeLogo} alt="stripe logo" />
    </div>
  );
};

export default DepositForm;
