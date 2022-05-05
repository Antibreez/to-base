import {Container, Stack, CircularProgress} from '@mui/material'
import {useEffect} from 'react'
import {connect} from 'react-redux'
import {Route, Routes, Navigate, withRouter, Outlet} from 'react-router-dom'
import Appbar from './components/AppBar'
import Post from './pages/Post'
import {setUser} from './redux/actions/auth'
import {fetchPosts} from './redux/actions/post'
import {onAuthChanged, getCurrentUser, auth} from './services/firebase'

import {onAuthStateChanged} from 'firebase/auth'

function App(props) {
  useEffect(() => {
    props.fetchPosts()

    onAuthStateChanged(auth, user => {
      if (user) {
        props.setUser(user)
      } else {
        props.setUser(null)
      }
    })
  }, [])

  return (
    <>
      {props.posts === null ? (
        <Stack direction="row" justifyContent="center" sx={{p: 5}}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Appbar />
          <Outlet />
        </>
      )}
    </>
  )
}

function mapStateToProps(state) {
  return {
    posts: state.post.posts,
    user: state.auth.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPosts: value => dispatch(fetchPosts(value)),
    setUser: value => dispatch(setUser(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
