import {
  ADD_POST,
  DELETE_POST,
  FETCH_IMAGES,
  FETCH_IMAGE_FILES,
  FETCH_POST,
  FETCH_POSTS,
  REPLACE_POST,
  SET_FILTER,
} from './actionTypes'
import {getPosts, getImages, getImageFiles} from '../../services/firebase'

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

export const replacePost = post => {
  return {
    type: REPLACE_POST,
    payload: post,
  }
}

export const deletePost = id => {
  return {
    type: DELETE_POST,
    payload: id,
  }
}

export const fetchImages = id => async dispatch => {
  getImages(id)
    .then(images => {
      dispatch(setCurrentImages(images))
    })
    .catch(e => setCurrentImages([]))
}

export const fetchImageFiles = id => async dispatch => {
  getImageFiles(id)
    .then(files => {
      dispatch(setCurrentImageFiles(files))
    })
    .catch(e => setCurrentImageFiles([]))
}

export function setCurrentImages(value) {
  return {
    type: FETCH_IMAGES,
    payload: value,
  }
}

export function setCurrentImageFiles(value) {
  return {
    type: FETCH_IMAGE_FILES,
    payload: value,
  }
}

export function setFilter(value) {
  return {
    type: SET_FILTER,
    payload: value,
  }
}
