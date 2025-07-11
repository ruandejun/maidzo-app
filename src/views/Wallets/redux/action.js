const actions = {
    GET_WALLET_BALANCE: 'GET_WALLET_BALANCE',
    GET_WALLET_BALANCE_SUCCESS: 'GET_WALLET_BALANCE_SUCCESS',
    GET_SETTING_INFORMATION_SUCCESS: 'GET_SETTING_INFORMATION_SUCCESS',
    GET_NOTIFICATION_SUCCESS: 'GET_NOTIFICATION_SUCCESS'
  }
  
  export const getWalletBalance = (username) => {
    return {
      type: actions.GET_WALLET_BALANCE,
      username
    }
  }
  
  export default actions