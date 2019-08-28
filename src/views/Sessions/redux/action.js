const actions = {
  LOGIN: 'LOGIN',
  SIGN_UP: 'SIGN_UP',
  LOGIN_SUCCESSFULLY: 'LOGIN_SUCCESSFULLY',
  GET_USER: 'GET_USER',
  LOGIN_FAIL: 'LOGIN_FAIL',
  SIGN_UP_FAIL: 'SIGN_UP_FAIL',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  UNMOUNT_ERROR: 'UNMOUNT_ERROR',
}

export const unmountError = () => {
  return {
    type: actions.UNMOUNT_ERROR
  }
}

export const login = (username, password) => {
  return {
    type: actions.LOGIN,
    username, password
  }
}

export const getUser = () => {
  return {
    type: actions.GET_USER
  }
}

export const register = (username, email, facebook, phone, password, verifypassword) => {
  return {
    type: actions.SIGN_UP,
    username, email, facebook, phone, password, verifypassword
  }
}

export default actions