const actions = {
  GET_CART: 'GET_CART',
  GET_CART_SUCCESS: 'GET_CART_SUCCESS',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
}

export const getCart = () => {
  return {
    type: actions.GET_CART
  }
}

export default actions
