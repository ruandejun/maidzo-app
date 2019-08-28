/**
 * @flow
 * @providesModule HomeMainView
 */

import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    AppState,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import {getOrder} from './redux/action'
import OrderListItem from './component/OrderListItem'

class OrderListView extends React.Component {

    componentDidMount(){
        this.onRefresh(0)
    }

    onRefresh(){
        this.props.getOrder()
    }

    renderItem({item, index}){
        return(
            <OrderListItem {...item} onPress={this.onDetail.bind(this, item)}/>
        )
    }

    onDetail(item){
        this.props.navigation.navigate('OrderDetailView', {order_id: item.id})
    }

    render() {

        const {isFetching, orderItems} = this.props

        return (
            <View style={styles.container}>
                <Header title='Quản lý đơn hàng'
                />

                <FlatList 
                    renderItem={this.renderItem.bind(this)}
                    data={orderItems}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{flex : 1}}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFetching: state.order.isFetching,
        orderItems: state.order.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getOrder: (order, offset, limit) => dispatch(getOrder(order, offset, limit))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderListView);
