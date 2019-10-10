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
        backgroundColor: '#f0f0f0'
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import {getOrder, getMoreOrder} from './redux/action'
import OrderListItem from './component/OrderListItem'
import {fetchApi} from 'actions/api'
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { TextInput } from 'react-native-gesture-handler';

const LIMIT = 10

const filters = [
    {title: 'Tất cả đơn hàng', path: 'get_data_orders/data.json'},
    {title: 'Chờ đặt', path: 'get_data_orders_paid/'},
    {title: 'Đã kiểm', path: 'get_data_orders_checked/'},
    {title: 'Thanh toán', path: 'get_data_orders_payment_left/'},
    {title: 'Hoàn tiền', path: 'get_data_orders_refund/'},
]

class OrderListView extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            orderItems: [],
            isFetching: false,
            loadingMore: false,
            canLoadMore: true,
            filter: filters[0],
            keyword: ''
        }
    }

    componentDidMount(){
        this.props.getOrder('asc', 0, 1)
        this.onRefresh()
    }

    onRefresh(){
        const {filter} = this.state

        this.setState({isFetching: true, loadingMore: false, canLoadMore: true}, () => {
            let body = {order: 'asc', offset: 0, limit: LIMIT}
            if(this.state.keyword.length > 0){
                body.search = this.state.keyword
            }

            fetchApi('get', `page/${filter ? filter.path : 'get_data_orders/data.json'}`, body)
            .then((data) => {
                // console.log(data)

                this.setState({isFetching: false, orderItems: data.rows, canLoadMore: data.rows.length < data.total})
            })
            .catch((error) => {
                console.log(error)
                this.setState({isFetching: false, canLoadMore: false})
            })
        })
    }

    onEndReached(){
        const {filter} = this.state

        if(this.state.isFetching || !this.state.canLoadMore || this.state.loadingMore){
            return
        }

        this.setState({loadingMore: true}, () => {
            let body = {order: 'asc', offset: this.state.orderItems.length, limit: LIMIT}
            if(this.state.keyword.length > 0){
                body.search = this.state.keyword
            }

            fetchApi('get', `page/${filter ? filter.path : 'get_data_orders/data.json'}`, body)
            .then((data) => {
                // console.log(data)
                if(data){
                    let orderItems = this.state.orderItems
                    data.rows.map((item) => {
                        orderItems.push(item)
                    })
    
                    this.setState({loadingMore: false, items: orderItems, canLoadMore: orderItems.length < data.total})
                } else {
                    this.setState({loadingMore: false})
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({loadingMore: false})
            })
        })
    }

    renderItem({item, index}){
        return(
            <OrderListItem {...item} onPress={this.onDetail.bind(this, item)}/>
        )
    }

    renderFooter(){
        if(!this.state.loadingMore){
            return null
        }

        return(
            <View style={{width: '100%', height: 30, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={Media.LoadingIcon} style={{width : 30, height : 30}} resizeMode='contain'/>
            </View>
        )
    }

    onDetail(item){
        this.props.navigation.navigate('OrderDetailView', {order_id: item.id})
    }

    scrollToTop(){
        if(this.orderList && this.state.orderItems.length > 0){
            this.orderList.scrollToIndex({index: 0, viewOffset: 0})
        }
    }

    onFilter(){
        let items = filters.map((item) => {
            return{
                title: item.title,
                onPress: () => this.setState({filter: item}, this.onRefresh.bind(this))
            }
        })
        ActionSheet.show(items, {title: 'Bỏ'})
    }

    onEndEditing(){
        this.onRefresh()
    }

    render() {

        const {isFetching, orderItems, filter, keyword} = this.state

        return (
            <View style={styles.container}>
                <Header title='Quản lý đơn hàng'
                    leftIcon='angle-double-up'
                    leftAction={this.scrollToTop.bind(this)}
                />

                <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, paddingTop : 10, borderBottomWidth: 1, borderBottomColor: '#CECECE', backgroundColor: '#e1e1e1'}}>
                    <View style={{flex: 1, marginLeft: 8, marginRight: 8, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingLeft: 10, paddingRight: 10}}>
                        <TextInput 
                            ref={ref => this.searchInput = ref}
                            returnKeyType='search'
                            onEndEditing={this.onEndEditing.bind(this)}
                            underlineColorAndroid='#00000000'
                            placeholderTextColor='#777777'
                            style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, width: '100%', padding: 0}}
                            placeholder='Từ khoá'
                            value={keyword}
                            onChangeText={(text) => this.setState({keyword : text})}
                        />
                    </View>
                    <TouchableOpacity onPress={this.onFilter.bind(this)} style={{marginRight: 8, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#CECECE', backgroundColor: 'white', width: 160, flexDirection: 'row', alignItems: 'center', paddingLeft: 8, paddingRight: 8}}>
                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginRight: 8, flex: 1}}>{filter.title}</Text>
                        <Icon name='chevron-down' color='#aaaaaa' size={14}/>
                    </TouchableOpacity>
                </View>

                <FlatList 
                    ref={ref => this.orderList = ref}
                    renderItem={this.renderItem.bind(this)}
                    data={orderItems}
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
        isFetching: state.order.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getOrder: (order, offset, limit) => dispatch(getOrder(order, offset, limit)),
        getMoreOrder: (order, offset, limit) => dispatch(getMoreOrder(order, offset, limit))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderListView);
