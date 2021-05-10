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
  CRYPTO_CREATE_REQUEST,
  CRYPTO_CREATE_SUCCESS,
  CRYPTO_CREATE_FAIL,
  CRYPTO_DELETE_REQUEST,
  CRYPTO_DELETE_SUCCESS,
  CRYPTO_DELETE_FAIL,
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
    console.log(cryptoTicker);
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
      `/api/v1/cryptos/${crypto.asset_ticker}`,
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

export const addCrypto = (crypto) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CRYPTO_CREATE_REQUEST,
    });

    // const {
    //   userLogin: { userInfo },
    // } = getState();

    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // };

    //const { data } = await axios.post(`/api/bugs`, newbug, config);

    const { data } = await axios.post(
      `/api/v1/cryptos/${crypto.asset_ticker}`,
      crypto
    );

    dispatch({
      type: CRYPTO_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    // if (message === 'Not authorized, token failed') {
    //   dispatch(logout());
    // }
    dispatch({
      type: CRYPTO_CREATE_FAIL,
      payload: error.response.data,
    });
  }
};

export const deleteCrypto = (id, owner_email) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CRYPTO_DELETE_REQUEST,
    });

    // const {
    //   userLogin: { userInfo },
    // } = getState();

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // };

    //await axios.delete(`/api/bugs/${id}`, config);
    await axios.delete(`/api/v1/cryptos/${id}`, {
      data: { owner_email: owner_email },
    });

    dispatch({
      type: CRYPTO_DELETE_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    // if (message === 'Not authorized, token failed') {
    //   dispatch(logout());
    // }
    dispatch({
      type: CRYPTO_DELETE_FAIL,
      payload: message,
    });
  }
};
