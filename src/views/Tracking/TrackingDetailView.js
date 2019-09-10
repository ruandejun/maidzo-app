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
import TrackingItem from './component/TrackingItem'
import {fetchApi} from 'actions/api'

class TrackingDetailView extends React.Component {

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
        const tracking_id = this.props.navigation.getParam('tracking_id')

        console.log(tracking_id)

        if(!tracking_id){
            return
        }

        this.setState({isFetching: true}, () => {
            fetchApi('get', `page/get_tracking_details/${tracking_id}`)
            .then((data) => {
                // console.log(data)

                this.setState({isFetching: false, items: data.list_item})
            })
            .catch((error) => {
                console.log(error)
                this.setState({isFetching: false})
            })
        })
    }

    renderItem({item, index}){
        return(
            <TrackingItem {...item} openItem={this.openItem.bind(this, item.item_url)}/>
        )
    }

    openItem(link){
        this.props.navigation.navigate('TaobaoWebView', {url: link})
    }


    render() {

        const {isFetching, items} = this.state
        const tracking_id = this.props.navigation.getParam('tracking_id')

        return (
            <View style={styles.container}>
                <Header
                    title={'Chi tiết vận đơn - ' + tracking_id}
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

export default connect(mapStateToProps, mapDispatchToProps)(TrackingDetailView);
