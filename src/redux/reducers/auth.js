//import {SIGN_UP} from '../actions/actionTypes'

import {SIGN_IN} from '../actions/actionTypes'

const initialState = {
  user: null,
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: action.payload,
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
