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
    Linking,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6', paddingBottom: getBottomSpace()
    },
})

import { connect } from 'react-redux';
import Global, { imageUrl, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import {fetchApi, fetchUploadApi} from 'actions/api'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import FastImage from 'react-native-fast-image';

const LIMIT = 20

class ImageSearchView extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            items: [],
            isFetching: false,
        }
    }

    componentDidMount(){
        this.onRefresh()
    }

    onRefresh(){
        const image = this.props.navigation.getParam('image')

        this.setState({isFetching: true}, () => {
            fetchUploadApi(`page/image_search/?type=taobao`, image)
            .then((data) => {
                let items = []
                // console.log(data)
                if(data){
                    try {
                        if(data && data.result){
                            data.result.map((item) => {
                                items.push(item)
                            })
                        }

                        
                    } catch (error) {
                        
                    }
                }
                this.setState({items: items, isFetching: false})
            })
            .catch((error) => {
                console.log(error)
                this.setState({isFetching: false})
            })
        })
    }

    renderItem({item, index}){
        return(
            <TouchableOpacity onPress={this.onPressItem.bind(this, imageUrl(item.detail_url))} style={{backgroundColor: 'white', padding: 10, marginTop : 8, flexDirection: 'row'}}>
                <FastImage source={{uri: imageUrl(item.pic_url)}} style={{width: 60, height: 60}} resizeMode='cover'/>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 8}}>
                    <Text style={{fontSize: 14, color: Global.MainColor, fontFamily: Global.Fontname, width: '100%'}} numberOfLines={1}>{item.nick}</Text>
                    <Text style={{fontSize: 13, marginTop: 5, color: '#333333', fontFamily: Global.Fontname, width: '100%'}}>{item.title}</Text>
                    <Text style={{fontSize: 13, marginTop: 5, color: '#333333', fontFamily: Global.Fontname, width: '100%'}}>{'Giá: ¥' + item.reserve_price}</Text>
                    <Text style={{fontSize: 13, marginTop: 5, color: '#333333', fontFamily: Global.Fontname, width: '100%'}}>{'Giao dịch: ' + item.view_sales}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    onPressItem(link){
        if(Global.showCart){
            this.props.navigation.navigate('TaobaoWebView', { url: link.replace('#modal=sku', '') })
        } else {
            Linking.openURL(link)
        }
    }

    render() {

        const {isFetching, items} = this.state

        return (
            <View style={styles.container}>
                <Header
                    title='Tìm kiếm sản phầm'
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
                    ListEmptyComponent={() => isFetching ? null : <Text style={{width: '100%', fontSize: 13, textAlign: 'center', padding: 16, fontFamily: Global.FontName, color: '#aaaaaa'}}>Không tìm thấy sản phẩm</Text>}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageSearchView);
