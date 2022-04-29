import {AppBar, Toolbar, Typography, Button, Container, Stack, Menu, MenuItem} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import {useState} from 'react'
import {connect} from 'react-redux'
import Auth from '../Auth/Auth'

import {signOutUser} from '../../services/firebase'
import {Link, Navigate, useLocation, useNavigate} from 'react-router-dom'

function Appbar(props) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  const navigate = useNavigate()
  const location = useLocation()
  // const [openRegister, setOpenRegister] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleMenuClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    signOutUser().then(() => setAnchorEl(null))
  }

  const handleAddPostClick = () => {
    navigate('/add')
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  // const handleLoginClose = () => {
  //   setOpenLogin(false)
  // }

  // const handleRegisterClose = () => {
  //   setOpenRegister(false)
  // }

  // const onLoginClick = () => {
  //   setOpenRegister(false)
  //   setOpenLogin(true)
  // }

  // const onRegisterClick = () => {
  //   setOpenRegister(true)
  //   setOpenLogin(false)
  // }

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{p: {xs: 0}}}>
        <Toolbar>
          <Stack direction="row" alignItems="center" sx={{width: '100%'}}>
            <Typography variant="h6" component="div" sx={{mr: 'auto'}}>
              TO-база
            </Typography>

            {props.user === null ? (
              <Button color="inherit" onClick={handleClickOpen}>
                Войти
              </Button>
            ) : (
              <>
                <Typography>{props.user.email}</Typography>
                <Button
                  sx={{color: '#ffffff'}}
                  id="menu-button"
                  aria-controls={openMenu ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                  onClick={handleMenuClick}
                >
                  <MenuIcon />
                </Button>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  MenuListProps={{'aria-labelledby': 'menu-button'}}
                >
                  {location.pathname === '/' ? (
                    <MenuItem onClick={handleAddPostClick}>Добавить пост</MenuItem>
                  ) : (
                    <MenuItem onClick={handleHomeClick}>На главную</MenuItem>
                  )}

                  <MenuItem onClick={handleSignOut}>
                    Выйти
                    <LogoutIcon sx={{color: '#000000', opacity: '0.6', ml: 1}} />
                  </MenuItem>
                </Menu>
              </>
            )}

            <Auth
              open={open}
              handleClose={handleClose}
              // openRegister={openRegister}
              // handleLoginClose={handleLoginClose}
              // handleRegisterClose={handleRegisterClose}
              // onLoginClick={onLoginClick}
              // onRegisterClick={onRegisterClick}
            />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  }
}

export default connect(mapStateToProps, null)(Appbar)
