const actions = {
  LOGIN: 'LOGIN',
  SIGN_UP: 'SIGN_UP',
  LOGIN_SUCCESSFULLY: 'LOGIN_SUCCESSFULLY',
  GET_USER: 'GET_USER',
  LOGIN_FAIL: 'LOGIN_FAIL',
  SIGN_UP_FAIL: 'SIGN_UP_FAIL',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  UNMOUNT_ERROR: 'UNMOUNT_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
}

export const unmountError = () => {
  return {
    type: actions.UNMOUNT_ERROR
  }
}

export const login = (username, password, device_id, registration_id, platform_type) => {
  return {
    type: actions.LOGIN,
    username, password, device_id, registration_id, platform_type
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

export const updateProfile = (pk, value, name) => {
  return {
    type: actions.UPDATE_PROFILE,
    pk, value, name
  }
}

export const logout = () => {
  return {
    type: actions.LOGOUT
  }
}

export default actions