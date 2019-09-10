import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Linking,
    Image,
    TextInput
} from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: '95%', marginLeft : '2.5%', borderRadius: 8,
        backgroundColor: 'white', padding: 16, marginTop : 5, marginBottom : 5
    },
    headerContainer: {
        flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', height: 30
    },
    dateText: {
        fontSize: 13, color: '#777777', fontFamily: Global.FontName, marginRight: 5
    },
    titleText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, flex: 1
    },
    detailView: {
        borderTopColor: '#CECECE', borderTopWidth: 1, marginTop : 8
    },
    detailText: {
        fontSize: 13, color: '#333333', fontFamily: Global.FontName, marginTop : 5
    }
})

import Global, { imageUrl, convertMoney } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'

class PayItem extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            viewMode: 'general'
        }
    }

    onDetail(){
        this.setState({viewMode: this.state.viewMode == 'general' ? 'detail' : 'general'})
    }

    onOpenOrder(){
        if(this.props.onOpenOrder){
            this.props.onOpenOrder()
        }
    }

    render() {

        const { id, transaction_holder, type, amount, detail, status, order, created } = this.props
        const {viewMode} = this.state

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.onDetail.bind(this)} style={styles.headerContainer}>
                    <Text style={styles.titleText}>
                        {convertMoney(amount) + ' đ'}
                    </Text>
                    <Text style={styles.dateText}>{created}</Text>
                    <Icon size={15} color='#aaaaaa' name={viewMode == 'general' ? 'chevron-down' : 'chevron-up'}/>
                </TouchableOpacity>
                {viewMode == 'detail' && 
                    <View style={styles.detailView}>
                        <Text style={styles.detailText}>
                            {'ID: '}
                            <Text style={{color: Global.MainColor}}>{id}</Text>
                        </Text>
                        <Text style={styles.detailText}>
                            {'Tên: '}
                            <Text style={{color: 'black'}}>{transaction_holder}</Text>
                        </Text>
                        <Text style={styles.detailText}>
                            {'Hình thức: '}
                            <Text style={{color: 'green'}}>{type}</Text>
                        </Text>
                        <Text style={styles.detailText}>
                            {'Trạng thái: '}
                            <Text style={{color: 'black', fontWeight: '500'}}>{status}</Text>
                        </Text>
                        <Text style={styles.detailText}>
                            {'Ghi chú: '}
                            <Text style={{color: 'black'}}>{detail}</Text>
                        </Text>
                        {order && order.toString().length > 0 &&
                            <Text onPress={this.onOpenOrder.bind(this)} style={styles.detailText}>
                                {'Đơn hàng: '}
                                <Text style={{color: 'blue', textDecorationLine: 'underline'}}>{order}</Text>
                            </Text>
                        }
                    </View>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(PayItem);