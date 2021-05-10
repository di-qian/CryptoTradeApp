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

const reducer = combineReducers({
  cryptoList: cryptoListReducer,
  cryptoListDetails: cryptoListDetailsReducer,
  cryptoUpdateDetails: cryptoUpdateDetailsReducer,
  cryptoUpdate: cryptoUpdateReducer,
  cryptoAdd: cryptoAddReducer,
  cryptoDelete: cryptoDeleteReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
