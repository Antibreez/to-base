import {
  ADD_POST,
  DELETE_POST,
  FETCH_IMAGES,
  FETCH_IMAGE_FILES,
  FETCH_POST,
  FETCH_POSTS,
  REPLACE_POST,
  SET_FILTER,
} from '../actions/actionTypes'

const initialState = {
  posts: null,
  currentPost: null,
  currentImages: null,
  currentImageFiles: null,
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
        posts: state.posts ? [...state.posts, action.payload] : [action.payload],
      }
    case REPLACE_POST:
      return {
        ...state,
        posts: state.posts ? state.posts.map(p => (action.payload.id === p.id ? action.payload : p)) : [action.payload],
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => {
          return post.id !== action.payload
        }),
      }
    case FETCH_IMAGES:
      return {
        ...state,
        currentImages: action.payload,
      }
    case FETCH_IMAGE_FILES:
      return {
        ...state,
        currentImageFiles: action.payload,
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
