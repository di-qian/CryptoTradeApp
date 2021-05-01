import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  cryptoListReducer,
  cryptoListDetailsReducer,
} from './reducers/cryptoReducers';

const reducer = combineReducers({
  cryptoList: cryptoListReducer,
  cryptoListDetails: cryptoListDetailsReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
