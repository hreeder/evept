import { combineReducers, createStore, applyMiddleware } from 'redux';

import auth from './auth'
import characters from './characters'
import esi from './esi'
import sde from './sde'
import { reducer as formsReducer } from 'redux-form'

import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware';
import { createLogger } from 'redux-logger';


const loggerIgnoreActions = [
  '@@redux-form/REGISTER_FIELD',
  '@@redux-form/CHANGE',
  '@@redux-form/FOCUS',
  '@@redux-form/BLUR',
  '@@redux-form/TOUCH',
  '@@redux-form/SET_SUBMIT_SUCCEEDED',
  '@@redux-form/DESTROY'
]

const loggerCollapseExceptions = [
  'esi.addCharacter_FULFILLED'
]

const reduxLoggerOptions = {
  predicate: (getState, action) => !loggerIgnoreActions.includes(action.type),
  collapsed: (getState, action, logEntry) => !logEntry.error && !loggerCollapseExceptions.includes(action.type)
}

const middleware = [
  thunk,
  promise(),
  process.env.NODE_ENV === "development" && createLogger(reduxLoggerOptions)
].filter(Boolean)


export default createStore(combineReducers({
  auth,
  characters,
  esi,
  sde,
  form: formsReducer
}), applyMiddleware(...middleware));