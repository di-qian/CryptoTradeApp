const {
  CRYPTO_LIST_REQUEST,
  CRYPTO_LIST_SUCCESS,
  CRYPTO_LIST_FAIL,
  CRYPTO_LIST_DETAILS_REQUEST,
  CRYPTO_LIST_DETAILS_SUCCESS,
  CRYPTO_LIST_DETAILS_FAIL,
  CRYPTO_LIST_DETAILS_RESET,
  CRYPTO_UPDATE_DETAILS_REQUEST,
  CRYPTO_UPDATE_DETAILS_SUCCESS,
  CRYPTO_UPDATE_DETAILS_FAIL,
  CRYPTO_UPDATE_DETAILS_RESET,
  CRYPTO_UPDATE_REQUEST,
  CRYPTO_UPDATE_SUCCESS,
  CRYPTO_UPDATE_FAIL,
  CRYPTO_UPDATE_RESET,
} = require('../constants/cryptoConstants');

export const cryptoListReducer = (state = { cryptos: [] }, action) => {
  switch (action.type) {
    case CRYPTO_LIST_REQUEST:
      return { loading: true, cryptos: [] };
    case CRYPTO_LIST_SUCCESS:
      return {
        loading: false,
        cryptos: action.payload.data.cryptos,
      };
    case CRYPTO_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const cryptoListDetailsReducer = (state = { cryptos: [] }, action) => {
  switch (action.type) {
    case CRYPTO_LIST_DETAILS_REQUEST:
      return { loading: true, cryptos: [] };
    case CRYPTO_LIST_DETAILS_SUCCESS:
      return {
        loading: false,
        crypto: action.payload.data.crypto[0],
      };
    case CRYPTO_LIST_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CRYPTO_LIST_DETAILS_RESET:
      return { cryptos: [] };
    default:
      return state;
  }
};

export const cryptoUpdateDetailsReducer = (state = { crypto: {} }, action) => {
  switch (action.type) {
    case CRYPTO_UPDATE_DETAILS_REQUEST:
      return { loading: true };
    case CRYPTO_UPDATE_DETAILS_SUCCESS:
      return {
        loading: false,
        detail_update_success: true,
        crypto: action.payload,
      };
    case CRYPTO_UPDATE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CRYPTO_UPDATE_DETAILS_RESET:
      return { crypto: {} };
    default:
      return state;
  }
};

export const cryptoUpdateReducer = (state = { cryptos: {} }, action) => {
  switch (action.type) {
    case CRYPTO_UPDATE_REQUEST:
      return { loading: true };
    case CRYPTO_UPDATE_SUCCESS:
      return {
        loading: false,
        cryptos_update_success: true,
        cryptos: action.payload,
      };
    case CRYPTO_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case CRYPTO_UPDATE_RESET:
      return { cryptos: {} };
    default:
      return state;
  }
};
