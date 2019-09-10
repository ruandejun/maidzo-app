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
    itemContainer: {
        width: '95%', alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', padding: 16, marginTop : 8
    }
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import {fetchApi} from 'actions/api'

const LIMIT = 10

class OrderDetailTransaction extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            items: [],
            isFetching: false
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

        this.setState({isFetching: true}, () => {
            fetchApi('get', `page/order/${order_id}/get_order_transaction_informaiton/`, )
            .then((data) => {
                // console.log(data)

                this.setState({isFetching: false, items: data})
            })
            .catch((error) => {
                console.log(error)
                this.setState({isFetching: false, })
            })
        })
    }

    renderItem({item, index}){
        return(
            <View style={styles.itemContainer}>
                <Text style={{fontSize: 16, color: 'black', fontWeight: '500', fontFamily: Global.FontName, width: '100%'}}>{item.id + ' - ' + item.type}</Text>
                <Text style={{fontSize: 14, marginTop : 10, color: 'black', fontFamily: Global.FontName, width: '100%'}}>{item.transaction_tag}</Text>
                <Text style={{fontSize: 13, color: '#aaaaaa', fontFamily: Global.FontName, width: '100%', textAlign: 'right'}}>{item.created_tag}</Text>
            </View>
        )
    }

    openItem(link){
        this.props.navigation.navigate('TaobaoWebView', {url: link})
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
                    ListEmptyComponent={() => <Text style={{width: '100%', fontSize: 13, textAlign: 'center', padding: 16, fontFamily: Global.FontName, color: '#aaaaaa'}}>Chưa có giao dịch</Text>}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFetching: state.order.detailFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailTransaction);
