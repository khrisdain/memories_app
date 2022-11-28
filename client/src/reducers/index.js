import { combineReducers } from 'redux'; //combine reducers turn object with a diffrent reducing functions value into a reducing function that can be passed to same createStore

import posts from './posts';
import auth from './auth';

export default combineReducers({ posts, auth });