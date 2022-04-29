import {ADD_POST, FETCH_IMAGES, FETCH_POST, FETCH_POSTS, SET_FILTER} from './actionTypes'
import {getPosts, getImages} from '../../services/firebase'

// export const fetchPost = id => async dispatch => {
//   onVal(getPostssRef(), val => {
//     dispatch({
//       type: FETCH_POST,
//       payload: val.val().find(x => x.id === id),
//     })
//   })
// }
export const fetchPosts = () => async dispatch => {
  getPosts
    .then(posts => {
      dispatch({
        type: FETCH_POSTS,
        payload: posts,
      })
    })
    .catch(e => console.log(e))
}

export const fetchPost = id => async dispatch => {
  getPosts
    .then(posts => {
      dispatch({
        type: FETCH_POST,
        payload: posts.find(x => x.id === id),
      })
    })
    .catch(e => console.log(e))
}

export const addPost = post => {
  return {
    type: ADD_POST,
    payload: post,
  }
}

export const fetchImages = id => async dispatch => {
  getImages(id)
    .then(images => {
      dispatch(setImages(images))
    })
    .catch(e => setImages([]))
}

export function setImages(value) {
  return {
    type: FETCH_IMAGES,
    payload: value,
  }
}

export function setFilter(value) {
  return {
    type: SET_FILTER,
    payload: value,
  }
}
