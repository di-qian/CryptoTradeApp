const {
  CRYPTO_LIST_REQUEST,
  CRYPTO_LIST_SUCCESS,
  CRYPTO_LIST_FAIL,
  CRYPTO_LIST_DETAILS_REQUEST,
  CRYPTO_LIST_DETAILS_SUCCESS,
  CRYPTO_LIST_DETAILS_FAIL,
  CRYPTO_LIST_DETAILS_RESET,
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
