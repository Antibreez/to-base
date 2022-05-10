//import {SIGN_UP} from '../actions/actionTypes'

import {SET_USER_STATUS, SIGN_IN} from '../actions/actionTypes'

const initialState = {
  user: null,
  isAdmin: false,
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: action.payload,
      }
    case SET_USER_STATUS:
      return {
        ...state,
        isAdmin: action.payload,
      }
    // case SIGN_UP:
    //   return {
    //     ...state,
    //     user: action.payload,
    //   }
    default:
      return state
  }
}
