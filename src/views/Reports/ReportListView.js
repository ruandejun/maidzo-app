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
        backgroundColor: '#f6f6f6', paddingBottom: getBottomSpace()
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import {fetchApi} from 'actions/api'
import ReportItem from './component/ReportItem'
import { getBottomSpace } from 'react-native-iphone-x-helper';

const LIMIT = 20

class ReportListView extends React.Component {

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
        const {user} = this.props

        if(!user){
            return
        }

        this.setState({isFetching: true, loadingMore: false, canLoadMore: true}, () => {
            fetchApi('get', `page/get_data_tickets/`, {order: 'asc', offset: 0, limit: LIMIT})
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

        if(!user){
            return
        }

        if(this.state.isFetching || !this.state.canLoadMore || this.state.loadingMore){
            return
        }

        this.setState({loadingMore: true}, () => {
            fetchApi('get', `page/get_data_tickets/`, {order: 'asc', offset: this.state.items.length, limit: LIMIT})
            .then((data) => {
                // console.log(data)
                if(data){
                    let items = this.state.items
                    data.rows.map((item) => {
                        items.push(item)
                    })
    
                    this.setState({loadingMore: false, items: items, canLoadMore: items.length < data.total})
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
            <ReportItem {...item} onDetail={this.onDetail.bind(this, item.id)}/>
        )
    }

    onDetail(ticket_id){
        this.props.navigation.navigate('ReportDetailView', {ticket_id: ticket_id})
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

    render() {

        const {isFetching, items} = this.state

        return (
            <View style={styles.container}>
                <Header
                    title='Danh sách khiếu nại'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
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
        user: state.auth.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportListView);
