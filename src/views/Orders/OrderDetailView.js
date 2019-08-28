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
import {getDetailInfo, getDetailItems} from './redux/action'
import OrderDetailItem from './component/OrderDetailItem'

class OrderDetailView extends React.Component {

    componentDidMount(){
        this.onRefresh(0)
    }

    onRefresh(){
        const order_id = this.props.navigation.getParam('order_id')

        if(!order_id){
            return
        }

        this.props.getDetailInfo(order_id)
        this.props.getDetailItems(order_id)
    }

    renderItem({item, index}){
        return(
            <OrderDetailItem {...item}/>
        )
    }

    render() {

        const {isFetching, detailItems} = this.props
        const order_id = this.props.navigation.getParam('order_id')

        return (
            <View style={styles.container}>
                <Header title={'Chi tiết đơn hàng - ' + order_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <FlatList 
                    renderItem={this.renderItem.bind(this)}
                    data={detailItems}
                    refreshing={false}
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
        isFetching: state.order.detailFetching,
        orderDetail: state.order.detail,
        detailItems: state.order.detailItems,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailInfo: (id) => dispatch(getDetailInfo(id)),
        getDetailItems: (id, offset, limit) => dispatch(getDetailItems(id, offset, limit))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailView);
