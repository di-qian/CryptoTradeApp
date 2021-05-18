const {
  MAKE_DEPOSIT_REQUEST,
  MAKE_DEPOSIT_SUCCESS,
  MAKE_DEPOSIT_FAIL,
  MAKE_DEPOSIT_RESET,
} = require('../constants/transactionConstants');

export const makeDepositReducer = (state = {}, action) => {
  switch (action.type) {
    case MAKE_DEPOSIT_REQUEST:
      return { loading: true };
    case MAKE_DEPOSIT_SUCCESS:
      return { loading: false, success: true, deposit: action.payload };
    case MAKE_DEPOSIT_FAIL:
      return { loading: false, error: action.payload };
    case MAKE_DEPOSIT_RESET:
      return {};
    default:
      return state;
  }
};
