import {ADD_POST, FETCH_IMAGES, FETCH_POST, FETCH_POSTS, SET_FILTER} from '../actions/actionTypes'

const initialState = {
  posts: null,
  currentPost: null,
  currentImages: null,
  filter: '',
}

export default function post(state = initialState, action) {
  switch (action.type) {
    case FETCH_POSTS:
      return {
        ...state,
        posts: action.payload,
      }
    case FETCH_POST:
      return {
        ...state,
        currentPost: action.payload,
      }
    case ADD_POST:
      return {
        ...state,
        posts: state.posts ? [...state.posts, action.payload] : action.payload,
      }
    case FETCH_IMAGES:
      return {
        ...state,
        currentImages: action.payload,
      }
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      }
    default:
      return state
  }
}
