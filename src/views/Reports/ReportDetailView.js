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
    RefreshControl,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6', paddingBottom: getBottomSpace()
    },
    headerContainer: {
        width: '100%', padding: 16, backgroundColor: 'white'
    },
    descriptionText: {
        fontSize: 15, color: '#777777', fontFamily: Global.FontName, marginTop : 5
    },
    itemContainer: {
        backgroundColor: 'white', marginTop : 5, padding: 8, borderRadius: 5
    }
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import {fetchApi, fetchUnlengthApi} from 'actions/api'
import ReportItem from './component/ReportItem'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { TextInput } from 'react-native-gesture-handler';

class ReportDetailView extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            detail_ticket: null,
            isFetching: false,
            comment: ''
        }
    }

    componentDidMount(){
        this.onRefresh()
    }

    onRefresh(){
        const ticket_id = this.props.navigation.getParam('ticket_id')

        if(!ticket_id){
            return
        }

        this.setState({isFetching: true}, () => {
            fetchApi('get', `page/get_ticket_details/${ticket_id}`)
            .then((data) => {
                // console.log(data)

                this.setState({isFetching: false, detail_ticket: data.data_tiket})
            })
            .catch((error) => {
                console.log(error)
                this.setState({isFetching: false})
            })
        })
    }

    renderItem({item, index}){
        return(
            <View style={styles.itemContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 13, fontWeight: '500', color: Global.MainColor, fontFamily: Global.FontName}}>{item.created_by_tag}</Text>
                    <Text style={{fontSize: 12, color: '#777777', fontFamily: Global.FontName}}>{item.created_tag}</Text>
                </View>
                <Text style={{marginTop : 8, fontSize: 14, color: 'black', fontFamily: Global.FontName}}>{item.body}</Text>
            </View>
        )
    }

    renderHeader(){
        if(!this.state.detail_ticket){
            return null
        }

        const {detail_ticket} = this.state
        const {id, status, group, full_name_tag, title, body, order_item, order, shipment_package, type_tag, created_tag} = detail_ticket

        return(
            <View style={styles.headerContainer}>
                <Text style={styles.descriptionText}>{'Id: '}
                    <Text style={{color: 'black'}}>{id}</Text>
                </Text>

                <Text style={styles.descriptionText}>{'Tên: '}
                    <Text style={{color: 'black'}}>{full_name_tag}</Text>
                </Text>

                <Text style={styles.descriptionText}>{'Tiêu đề: '}
                    <Text style={{color: 'black'}}>{title}</Text>
                </Text>

                <Text style={styles.descriptionText}>{'Nội dung: '}
                    <Text style={{color: 'black'}}>{body}</Text>
                </Text>

                {order > 0 &&
                    <Text style={styles.descriptionText}>{'Đơn hàng: '}
                        <Text style={{color: 'black'}}>{order}</Text>
                    </Text>
                }

                {order_item > 0 &&
                    <Text style={styles.descriptionText}>{'Sản phẩm: '}
                        <Text style={{color: 'black'}}>{order_item}</Text>
                    </Text>
                }

                {!!shipment_package && shipment_package > 0 &&
                    <Text style={styles.descriptionText}>{'Vận đơn: '}
                        <Text style={{color: 'black'}}>{shipment_package}</Text>
                    </Text>
                }

                <Text style={styles.descriptionText}>{'Loại: '}
                    <Text style={{color: 'black'}}>{type_tag}</Text>
                </Text>

                <Text style={styles.descriptionText}>{'Thời gian: '}
                    <Text style={{color: 'black'}}>{created_tag}</Text>
                </Text>
            </View>
        )
    }

    renderFooter(){

        return(
            <View style={{width: '100%', flexDirection: 'row', padding: 8, backgroundColor: '#CECECE', alignItems: 'center'}}>
                <View style={{flex: 1, marginRight: 10, height: 30, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', padding: 5, paddingLeft: 10, paddingRight: 10,}}>
                    <TextInput 
                        value={this.state.comment}
                        onChangeText={(text) => this.setState({comment: text})}
                        underlineColorAndroid="#00000000"
                        placeholder='Nhập nội dung phản hồi'
                        placeholderTextColor='#aaaaaa'
                        style={{fontSize: 14, color: 'black', fontFamily: Global.FontName, padding: 0, flex: 1}}
                    />
                </View>
                <TouchableOpacity onPress={this.sendComment.bind(this)} style={{width: 60, height: 30, borderRadius: 15, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 15, fontWeight: '500', fontFamily: Global.FontName, color: 'white'}}>Gửi</Text>
                </TouchableOpacity>
            </View>
        )
    }

    sendComment(){
        if(this.state.comment.length == 0){
            return
        }

        const ticket_id = this.props.navigation.getParam('ticket_id')

        if(!ticket_id){
            return
        }

        fetchUnlengthApi('post', `page/create_comment/`, {ticket_id: ticket_id, addComment: this.state.comment})
        .then((data) => {
            // console.log(data)

            CustomAlert(null, data.msg)

            if(data.success){
                this.onRefresh()
            }

            this.setState({comment: ''})
        })
        .catch((error) => {
            console.log(error)
            CustomAlert(null, 'Gửi phản hồi không thành công')
        })
    }

    render() {

        const ticket_id = this.props.navigation.getParam('ticket_id')
        const {isFetching, detail_ticket} = this.state

        return (
            <View style={styles.container}>
                <Header
                    title={'Chi tiết khiếu nại - ' + ticket_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.onRefresh.bind(this)}/>}
                style={{flex: 1, width: '100%', height: Global.ScreenHeight - 44 - getStatusBarHeight() - getBottomSpace()}}>
                    <FlatList 
                        renderItem={this.renderItem.bind(this)}
                        data={detail_ticket ? detail_ticket.commentticketbox_set : []}
                        style={{flex : 1, height: Global.ScreenHeight - 100 - getBottomSpace() - getStatusBarHeight()}}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={this.renderHeader.bind(this)}
                    />
                    {this.renderFooter()}
                </KeyboardAwareScrollView>
                
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportDetailView);
