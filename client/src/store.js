import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  cryptoListReducer,
  cryptoListDetailsReducer,
  cryptoUpdateDetailsReducer,
  cryptoUpdateReducer,
  cryptoAddReducer,
  cryptoDeleteReducer,
} from './reducers/cryptoReducers';

import { userLoginReducer, userRegisterReducer } from './reducers/userReducers';
import { makeDepositReducer } from './reducers/transactionReducers';

const reducer = combineReducers({
  cryptoList: cryptoListReducer,
  cryptoListDetails: cryptoListDetailsReducer,
  cryptoUpdateDetails: cryptoUpdateDetailsReducer,
  cryptoUpdate: cryptoUpdateReducer,
  cryptoAdd: cryptoAddReducer,
  cryptoDelete: cryptoDeleteReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  makeDeposit: makeDepositReducer,
});

const userInfoFromStorage = sessionStorage.getItem('userInfo')
  ? JSON.parse(sessionStorage.getItem('userInfo'))
  : null;

const initialState = { userLogin: { userInfo: userInfoFromStorage } };

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
