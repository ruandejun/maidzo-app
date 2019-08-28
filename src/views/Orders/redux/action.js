const actions = {
  CREATE_ORDER: 'CREATE_ORDER',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
  CREATE_ORDER_ERROR: 'CREATE_ORDER_ERROR',
  GET_ORDER : 'GET_ORDER',
  GET_ORDER_SUCCESS: 'GET_ORDER_SUCCESS',
  GET_DETAIL: 'GET_DETAIL',
  GET_DETAIL_SUCCESS: 'GET_DETAIL_SUCCESS',
  GET_DETAIL_ITEMS: 'GET_DETAIL_ITEMS',
  GET_DETAIL_ITEMS_SUCCESS: 'GET_DETAIL_ITEMS_SUCCESS',
  }

  export const createOrderFromCart = (full_name, street, district, city, phone_number, ship_method, order_note, facebook, item_submit) => {
    return {
      type: actions.CREATE_ORDER,
      full_name, street, district, city, phone_number, ship_method, order_note, facebook, item_submit
    }
  }

  export const getOrder = (order, offset, limit) => {
    return {
      type: actions.GET_ORDER,
      order, offset, limit
    }
  }

  export const getDetailInfo = (id) => {
    return {
      type: actions.GET_DETAIL,
      id
    }
  }

  export const getDetailItems = (id, offset, limit) => {
    return {
      type: actions.GET_DETAIL_ITEMS,
      id, offset, limit
    }
  }

  export default actions
  