const actions = {
  GET_CART: 'GET_CART',
  GET_CART_SUCCESS: 'GET_CART_SUCCESS',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
  ADD_CART_ITEM: 'ADD_CART_ITEM',
  ADD_CART_ITEM_SUCCESS: 'ADD_CART_ITEM_SUCCESS',
  DELETE_CART_ITEM: 'DELETE_CART_ITEM',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  UPDATE_CART_ITEM_SERVICE: 'UPDATE_CART_ITEM_SERVICE'
}

export const deleteCartItem = (id) => {
  return {
    type: actions.DELETE_CART_ITEM,
    value: id,
    pk:	id,
    name:	'xoa_san_pham'
  }
}

export const updateCartItem = (pk, value, name) => {
  return {
    type: actions.UPDATE_CART_ITEM,
    pk, value, name
  }
}

export const updateCartItemService = (item_list, value, name) => {
  return {
    type: actions.UPDATE_CART_ITEM_SERVICE,
    item_list, value, name
  }
}

export const getCart = () => {
  return {
    type: actions.GET_CART
  }
}

export const addItemToCart = (name, short_description, vendor, quantity, price, options_selected, detail_url, link_origin, currency, image_url, price_origin) => {
  return {
    type: actions.ADD_CART_ITEM,
    payload: {
      name,
      vendor,
      short_description,
      price,
      options_selected,
      detail_url,
      link_origin,
      currency,
      quantity,
      image_url,
      price_origin,
      is_translate: false,
      shipping: 0,
      http_referer: 'https://Maidzo.vn.com/'
    }
  }
}

export default actions