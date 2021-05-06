import axios from 'axios';
const {
  CRYPTO_LIST_REQUEST,
  CRYPTO_LIST_SUCCESS,
  CRYPTO_LIST_FAIL,
  CRYPTO_LIST_DETAILS_REQUEST,
  CRYPTO_LIST_DETAILS_SUCCESS,
  CRYPTO_LIST_DETAILS_FAIL,
  CRYPTO_UPDATE_DETAILS_REQUEST,
  CRYPTO_UPDATE_DETAILS_SUCCESS,
  CRYPTO_UPDATE_DETAILS_FAIL,
  CRYPTO_UPDATE_REQUEST,
  CRYPTO_UPDATE_SUCCESS,
  CRYPTO_UPDATE_FAIL,
} = require('../constants/cryptoConstants');

export const listCryptos = () => async (dispatch) => {
  try {
    dispatch({ type: CRYPTO_LIST_REQUEST });

    const { data } = await axios.get('/api/v1/cryptos');

    dispatch({ type: CRYPTO_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: CRYPTO_LIST_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const listCryptosDetails = (cryptoTicker, userEmail) => async (
  dispatch
) => {
  try {
    dispatch({ type: CRYPTO_LIST_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/cryptos/${cryptoTicker}`);

    dispatch({ type: CRYPTO_LIST_DETAILS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: CRYPTO_LIST_DETAILS_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const updateCryptosDetails = (crypto) => async (dispatch) => {
  try {
    dispatch({ type: CRYPTO_UPDATE_DETAILS_REQUEST });

    const { data } = await axios.put(
      `/api/v1/cryptos/${crypto.ticker}`,
      crypto
    );

    dispatch({ type: CRYPTO_UPDATE_DETAILS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: CRYPTO_UPDATE_DETAILS_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const updateCryptos = (owner_email, asset_name, cash) => async (
  dispatch
) => {
  try {
    dispatch({ type: CRYPTO_UPDATE_REQUEST });

    const { data } = await axios.put('/api/v1/cryptos', {
      owner_email,
      asset_name,
      cash,
    });

    dispatch({ type: CRYPTO_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: CRYPTO_UPDATE_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
