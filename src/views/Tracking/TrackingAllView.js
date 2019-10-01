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
import OrderTrackingItem from 'Orders/component/OrderTrackingItem'
import OrderTransportItem from 'Orders/component/OrderTransportItem'
import {fetchApi} from 'actions/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {ActionSheet} from 'teaset'

const LIMIT = 10

class TrackingAllView extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            items: [],
            isFetching: false,
            loadingMore: false,
            canLoadMore: true,
            filter : {title: 'Kiện hàng của tôi', type: 'get_data_trackings_by_username'}
        }
    }

    componentDidMount(){
        this.onRefresh()
    }

    onRefresh(){
        const {user} = this.props
        const {filter} = this.state

        if(!user || !filter){
            return
        }

        this.setState({isFetching: true, loadingMore: false, canLoadMore: true}, () => {
            fetchApi('get', `page/${filter.type}/${user.username}/`, {order: 'asc', offset: 0, limit: LIMIT})
            .then((data) => {
                // console.log(data)

                this.setState({isFetching: false, items: data.rows, canLoadMore: data.rows.length < data.total})
            })
            .catch((error) => {
                console.log(error)
                this.setState({isFetching: false, canLoadMore: false})
            })
        })
    }

    onEndReached(){
        const {user} = this.props
        const {filter} = this.state

        if(!user || !filter){
            return
        }

        if(this.state.isFetching || !this.state.canLoadMore || this.state.loadingMore){
            return
        }

        this.setState({loadingMore: true}, () => {
            fetchApi('get', `page/${filter.type}/${user.username}/`, {order: 'asc', offset: this.state.items.length, limit: this.state.items.length + LIMIT})
            .then((data) => {
                // console.log(data)
                let items = this.state.items
                data.rows.map((item) => {
                    items.push(item)
                })

                this.setState({loadingMore: false, items: items, canLoadMore: items.length < data.total})
            })
            .catch((error) => {
                console.log(error)
                this.setState({loadingMore: false})
            })
        })
    }

    renderItem({item, index}){
        const {filter} = this.state

        if(filter && filter.type == 'get_data_trackings_by_username'){
            return(
                <OrderTrackingItem {...item} onDetail={this.openItem.bind(this, item.id)} onReport={this.onReport.bind(this, item.id)}/>
            )
        } else {
            return(
                <OrderTransportItem {...item} onReport={this.onReport.bind(this, item.id)}/>
            )
        }
        
    }

    onReport(shipment_package){
        this.props.navigation.navigate('SubmitReportView', {shipment_package: shipment_package})
    }

    openItem(item_id){
        this.props.navigation.navigate('TrackingDetailView', {tracking_id: item_id})
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

    onFilter(){
        ActionSheet.show([
            {title: 'Kiện hàng của tôi', onPress: () => this.setState({filter: {title: 'Kiện hàng của tôi', type: 'get_data_trackings_by_username'}}, this.onRefresh.bind(this))},
            {title: 'Kiện hàng ký gửi', onPress: () => this.setState({filter: {title: 'Kiện hàng ký gửi', type: 'get_data_transport_trackings_by_username'}}, this.onRefresh.bind(this))},
        ], {title: 'Bỏ'})
    }

    onAddTransport(){
        this.props.navigation.navigate('AddTransportView', {onDone: () => this.setState({filter: {title: 'Kiện hàng ký gửi', type: 'get_data_transport_trackings_by_username'}}, this.onRefresh.bind(this))})
    }

    render() {

        const {isFetching, items, filter} = this.state

        return (
            <View style={styles.container}>
                <Header title='Kiện hàng' 
                    rightIcon='qrcode'
                    rightAction={() => this.props.navigation.navigate('ScanQRView')}
                    leftIcon='plus'
                    leftAction={this.onAddTransport.bind(this)}
                />

                <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#CECECE', backgroundColor: '#e1e1e1'}}>
                    <TouchableOpacity onPress={this.onFilter.bind(this)} style={{height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#CECECE', backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 8, paddingRight: 8}}>
                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginRight: 8, flex: 1}}>{filter.title}</Text>
                        <Icon name='chevron-down' color='#aaaaaa' size={14}/>
                    </TouchableOpacity>
                </View>

                <FlatList 
                    renderItem={this.renderItem.bind(this)}
                    data={items}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{flex : 1}}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.onEndReached.bind(this)}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    ListEmptyComponent={() => <Text style={{width: '100%', fontSize: 13, textAlign: 'center', padding: 16, fontFamily: Global.FontName, color: '#aaaaaa'}}>Chưa có thông tin vận chuyển</Text>}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackingAllView);
