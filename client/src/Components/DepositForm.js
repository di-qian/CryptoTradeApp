import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { MAKE_DEPOSIT_RESET } from '../constants/transactionConstants';
import { makeDeposit } from '../actions/transactionActions';
import stripeLogo from '../img/stripelogo.png';
import './DepositForm.css';

const DepositForm = (props) => {
  const [cashDeposit, setCashDeposit] = useState(0);

  const { makeDepositStatusToast } = props;
  const dispatch = useDispatch();

  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const makeDepositInfo = useSelector((state) => state.makeDeposit);
  const { loading, error, success, deposit } = makeDepositInfo;

  useEffect(() => {
    if (success) {
      makeDepositStatusToast(`$${cashDeposit} Deposited Successfully`);

      dispatch({ type: MAKE_DEPOSIT_RESET });
    }

    if (error) {
      makeDepositStatusToast('Deposit Failed!');

      dispatch({ type: MAKE_DEPOSIT_RESET });
    }

    setCashDeposit(0);
  }, [success, error]);

  const retrieveCashInfo = () => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cashinfo[0];
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
          onChange={(e) => setCashDeposit(e.target.value)}
        />
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
            <Button variant="primary">DEPOSIT</Button>
          </StripeCheckout>
        </InputGroup.Append>
      </InputGroup>
      <img className="img-stripe" src={stripeLogo} />
    </div>
  );
};

export default DepositForm;
