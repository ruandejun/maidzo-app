const actions = {
  GET_CART: 'GET_CART',
  GET_CART_SUCCESS: 'GET_CART_SUCCESS',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
  ADD_CART_ITEM: 'ADD_CART_ITEM',
  ADD_CART_MANUAL: 'ADD_CART_MANUAL',
  ADD_CART_ITEM_SUCCESS: 'ADD_CART_ITEM_SUCCESS',
  DELETE_CART_ITEM: 'DELETE_CART_ITEM',
  DELETE_SELECTED_ITEM: 'DELETE_SELECTED_ITEM',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  UPDATE_CART_ITEM_SERVICE: 'UPDATE_CART_ITEM_SERVICE',
  GET_CART_COUNT: 'GET_CART_COUNT',
  GET_CART_COUNT_SUCCESS: 'GET_CART_COUNT_SUCCESS',
  LOGOUT: 'LOGOUT',
}

export const deleteCartItem = (id) => {
  return {
    type: actions.DELETE_CART_ITEM,
    value: id,
    pk:	id,
    name:	'xoa_san_pham'
  }
}

export const deleteSelected = (ids) => {
  return {
    type: actions.DELETE_SELECTED_ITEM,
    value: ids,
    pk:	'xoa_da_chon',
    name:	'xoa_da_chon'
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

export const getCartCount = () => {
  return {
    type: actions.GET_CART_COUNT
  }
}

export const addItemToCart = (name, short_description, vendor, quantity, price, options_selected, detail_url, link_origin, currency, image_url, price_origin, note = '') => {
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
      http_referer: 'https://shipway247.com/',
      note: note
    }
  }
}

export const addManualItem = (add_item_username, link_add_item, name_add_item, link_image, add_item_quantity, add_item_price, add_item_currency, add_item_color,
                              add_item_size, add_item_note) => {
  return {
    type: actions.ADD_CART_MANUAL,
    payload: {
      add_item_username, link_add_item, name_add_item, link_image, add_item_quantity, add_item_price, add_item_currency, add_item_color, add_item_size, add_item_note
    }
  }
}

export default actions