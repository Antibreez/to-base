import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  DialogActions,
  FormHelperText,
  Typography,
} from '@mui/material'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {useState} from 'react'

//import {signUp} from '../../redux/actions/auth'
import {setUser} from '../../redux/actions/auth'
import {connect} from 'react-redux'

import {
  getErrorMessage,
  createUser,
  signInUser,
  signOutUser,
  sendConfirmEmail,
  setUserData,
} from '../../services/firebase'
import {createTheme} from '@mui/system'
import {ThemeProvider} from '@emotion/react'

function Auth(props) {
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegAgainPassword, setShowRegAgainPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPasswordAgain, setRegAgainPassword] = useState('')
  const [authWindow, setAuthWindow] = useState('login')
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [passwordRegValid, setPasswordRegValid] = useState(true)
  const [passwordRegAgainValid, setPasswordRegAgainValid] = useState(true)

  const [errorMessage, setErrorMessage] = useState('')

  const resetRegister = () => {
    setEmail('')
    setRegPassword('')
    setRegAgainPassword('')
    setShowRegPassword(false)
    setShowRegAgainPassword(false)
    setEmailValid(true)
    setPasswordRegValid(true)
    setPasswordRegAgainValid(true)
  }

  const resetLogin = () => {
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setEmailValid(true)
    setPasswordValid(true)
  }

  const onClose = () => {
    setTimeout(() => {
      resetLogin()
      resetRegister()
      setAuthWindow('login')
    }, 300)
    props.handleClose()
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowRegPassword = () => {
    setShowRegPassword(!showRegPassword)
  }

  const handleClickShowRegAgainPassword = () => {
    setShowRegAgainPassword(!showRegAgainPassword)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
    setPasswordValid(true)
  }

  const handleRegPasswordChange = event => {
    setRegPassword(event.target.value)
    setPasswordRegValid(true)
  }

  const handleRegAgainPasswordChange = event => {
    setRegAgainPassword(event.target.value)
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
    setEmailValid(true)
  }

  const loginHandler = e => {
    e.preventDefault()

    console.log('Email ', email)

    const isEmailValid = email.trim().length > 0 && email.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/) !== null
    const isPasswordValid = password.trim().length > 0 && password.length > 5

    setEmailValid(isEmailValid)
    setPasswordValid(isPasswordValid)

    if (isEmailValid && isPasswordValid) {
      setErrorMessage('')
      signInUser(email, password)
        .then(userCredential => {
          const verified = userCredential.user.emailVerified

          if (verified) {
            //props.setUser(userCredential.user)
            //localStorage.setItem('userUid', userCredential.user.uid)
            onClose()
          } else {
            signOutUser().then(setErrorMessage('Email ???? ??????????????????????'))
          }
        })
        .catch(e => {
          setErrorMessage(getErrorMessage(e.message))
        })
    }
  }

  const registerHandler = e => {
    e.preventDefault()

    const isEmailValid = email.trim().length > 0 && email.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/) !== null
    const isPasswordRegValid = regPassword.trim().length > 0 && regPassword.length > 5
    const isPasswordRegAgainValid = regPassword === regPasswordAgain

    setEmailValid(isEmailValid)
    setPasswordRegValid(isPasswordRegValid)
    setPasswordRegAgainValid(isPasswordRegAgainValid)

    if (isEmailValid && isPasswordRegValid && isPasswordRegAgainValid) {
      setErrorMessage('')
      createUser(email, regPassword)
        .then(user => {
          setUserData(user.user.uid, {isAdmin: false})

          sendConfirmEmail().then(() => {
            signOutUser().then(() => {
              setAuthWindow('emailSended')
            })
          })
        })
        .catch(e => {
          setErrorMessage(getErrorMessage(e.message))
        })
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={props.open} onClose={onClose}>
        {authWindow === 'login' ? (
          <>
            <DialogTitle style={{textAlign: 'center'}}>??????????</DialogTitle>
            <DialogContent sx={{pb: 0}}>
              <TextField
                autoFocus
                margin="dense"
                id="emailLogin"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                onChange={handleEmailChange}
                value={email}
                error={!emailValid}
                helperText={emailValid ? '' : '?????????????? ???????????????????? Email'}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="outlined-adornment-password">????????????</InputLabel>
                <OutlinedInput
                  error={!passwordValid}
                  id="passwordLogin"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  label="????????????"
                  onChange={handlePasswordChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {!passwordValid && (
                  <FormHelperText error={!passwordValid}>???????????? ???????????? ?????????????????? ?????????????? 6 ????????????????</FormHelperText>
                )}
              </FormControl>
            </DialogContent>
            <DialogContent sx={{py: 1}} style={{textAlign: 'center'}}>
              {!!errorMessage && (
                <Typography variant="body2" style={{color: 'red', fontWeight: 'bold'}}>
                  {errorMessage}
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{p: 1}} style={{justifyContent: 'center'}}>
              <Button variant="contained" onClick={loginHandler}>
                ??????????
              </Button>
              <Button variant="outlined" onClick={onClose}>
                ????????????
              </Button>
            </DialogActions>
            <DialogContent sx={{pt: 1}} style={{textAlign: 'center'}}>
              <Button
                onClick={() => {
                  setErrorMessage('')
                  resetLogin()
                  setAuthWindow('register')
                }}
              >
                ????????????????????????????????????
              </Button>
            </DialogContent>
          </>
        ) : authWindow === 'register' ? (
          <>
            <DialogTitle style={{textAlign: 'center'}}>????????????????????????????????????</DialogTitle>
            <DialogContent sx={{pb: 0}}>
              <TextField
                autoFocus
                margin="dense"
                id="emailRegister"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                onChange={handleEmailChange}
                value={email}
                error={!emailValid}
                helperText={emailValid ? '' : '?????????????? ???????????????????? Email'}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="outlined-adornment-password">????????????</InputLabel>
                <OutlinedInput
                  error={!passwordRegValid}
                  id="passwordRegister"
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  label="????????????"
                  onChange={handleRegPasswordChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowRegPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showRegPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {!passwordRegValid && (
                  <FormHelperText error={!passwordRegValid}>???????????? ???????????? ?????????????????? ?????????????? 6 ????????????????</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="outlined-adornment-password">???????????? ?????? ??????</InputLabel>
                <OutlinedInput
                  error={!passwordRegAgainValid}
                  id="passwordRegisterAgain"
                  type={showRegAgainPassword ? 'text' : 'password'}
                  value={regPasswordAgain}
                  label="???????????? ?????? ??????"
                  onChange={handleRegAgainPasswordChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowRegAgainPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showRegAgainPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {!passwordRegAgainValid && (
                  <FormHelperText error={!passwordRegAgainValid}>???????????? ???? ??????????????????</FormHelperText>
                )}
              </FormControl>
            </DialogContent>
            <DialogContent sx={{py: 1}} style={{textAlign: 'center'}}>
              {!!errorMessage && (
                <Typography variant="body2" style={{color: 'red', fontWeight: 'bold'}}>
                  {errorMessage}
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{p: 1}} style={{justifyContent: 'center'}}>
              <Button variant="contained" onClick={registerHandler}>
                ????????????????????????????????????
              </Button>
              <Button variant="outlined" onClick={onClose}>
                ????????????
              </Button>
            </DialogActions>
            <DialogContent sx={{pt: 1}} style={{textAlign: 'center'}}>
              <Button
                onClick={() => {
                  setErrorMessage('')
                  resetRegister()
                  setAuthWindow('login')
                }}
              >
                ??????????
              </Button>
            </DialogContent>
          </>
        ) : authWindow === 'emailSended' ? (
          <>
            <DialogTitle sx={{pb: 4}} style={{textAlign: 'center'}}>
              ???? ???????? ?????????? ???????????????????? ???????????? ?????? ?????????????????????????? ?????????????????????????????? ????????????
            </DialogTitle>
            <DialogContent style={{textAlign: 'center'}}>
              <Button onClick={() => setAuthWindow('login')}>??????????</Button>
            </DialogContent>
          </>
        ) : null}
      </Dialog>
    </>
  )
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    //signUp: (email, password) => dispatch(signUp(email, password)),
    setUser: value => dispatch(setUser(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
