import axios from 'axios';
import {
  MAKE_DEPOSIT_FAIL,
  MAKE_DEPOSIT_REQUEST,
  MAKE_DEPOSIT_SUCCESS,
} from '../constants/transactionConstants';

export const makeDeposit =
  (token, cashInfo, cashDeposit) => async (dispatch, getState) => {
    try {
      dispatch({
        type: MAKE_DEPOSIT_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const asset_name = 'Cash';
      const user_id = cashInfo.user_id;
      const cash = cashInfo.quantity;

      const { data } = await axios.post(
        '/api/v1/transactions',
        { token, user_id, cash, asset_name, cashDeposit },
        config
      );

      dispatch({
        type: MAKE_DEPOSIT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // const message =
      //   error.response && error.response.data.message
      //     ? error.response.data.message
      //     : error.message;
      //   if (message === 'Not authorized, token failed') {
      //     dispatch(logout());
      //   }
      dispatch({
        type: MAKE_DEPOSIT_FAIL,
        payload: error.response.data,
      });
    }
  };
