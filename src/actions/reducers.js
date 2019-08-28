import { combineReducers } from 'redux';
import NavigationService from './NavigationService';

import auth from 'Sessions/redux/reducer';
import cart from 'Carts/redux/reducer'
import notification from 'Notifications/redux/reducer'
import order from 'Orders/redux/reducer'

const AppReducer = combineReducers({
    auth,
    cart,
    notification,
    order,
});

export default AppReducer;
