//import {signInUser} from '../../services/firebase'
import {SIGN_IN} from './actionTypes'
//import {SIGN_UP} from './actionTypes'

// export const signIn = (email, password) => async dispatch => {
//   return new Promise((res, rej) => {
//     signInUser(email, password)
//       .then(userCredential => {
//         dispatch({
//           type: SIGN_IN,
//           payload: userCredential,
//         })
//         res(userCredential)
//       })
//       .catch(e => {
//         rej(e)
//       })
//   })
// }

export const setUser = value => {
  return {
    type: SIGN_IN,
    payload: value,
  }
}

// export const signUp = (email, password) => async dispatch => {
//   return new Promise((res, rej) => {
//     createUser(email, password)
//       .then(userCredential => {
//         console.log(userCredential)
//         dispatch({
//           type: SIGN_UP,
//           payload: userCredential,
//         })
//         res()
//       })
//       .catch(e => {
//         rej(e)
//       })
//   })
// }
