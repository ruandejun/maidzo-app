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
import {fetchApi} from 'actions/api'

const LIMIT = 10

class OrderDetailItems extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            items: [],
            isFetching: false,
            loadingMore: false,
            canLoadMore: true
        }
    }

    componentDidMount(){
        this.onRefresh()
    }

    onRefresh(){
        const {order_id} = this.props

        if(!order_id){
            return
        }

        this.setState({isFetching: true, loadingMore: false, canLoadMore: true}, () => {
            fetchApi('get', `page/order/${order_id}/get_items_by_offer/`, {offset: 0, limit: LIMIT})
            .then((data) => {
                // console.log(data)

                this.setState({isFetching: false, items: data, canLoadMore: data.length == LIMIT})
            })
            .catch((error) => {
                console.log(error)
                this.setState({isFetching: false, canLoadMore: false})
            })
        })
    }

    onEndReached(){
        const {order_id} = this.props

        if(!order_id){
            return
        }

        if(!this.state.canLoadMore || this.state.loadingMore){
            return
        }

        this.setState({loadingMore: true}, () => {
            fetchApi('get', `page/order/${order_id}/get_items_by_offer/`, {offset: this.state.items.length, limit: this.state.items.length + LIMIT})
            .then((data) => {
                // console.log(data)
                let items = this.state.items
                data.map((item) => {
                    items.push(item)
                })

                this.setState({loadingMore: false, items: items, canLoadMore: data.length == LIMIT})
            })
            .catch((error) => {
                console.log(error)
                this.setState({loadingMore: false})
            })
        })
    }

    renderItem({item, index}){
        return(
            <OrderDetailItem {...item}/>
        )
    }

    renderFooter(){
        if(!this.state.loadingMore){
            return null
        }

        return(
            <View style={{width: '100%', height: 30, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size='small' color='#aaaaaa'/>
            </View>
        )
    }

    render() {

        const {isFetching, items} = this.state

        return (
            <View style={styles.container}>
                <FlatList 
                    renderItem={this.renderItem.bind(this)}
                    data={items}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{flex : 1}}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.onEndReached.bind(this)}
                    ListFooterComponent={this.renderFooter.bind(this)}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailItems);
