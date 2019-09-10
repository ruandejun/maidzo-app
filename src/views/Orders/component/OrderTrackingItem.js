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
    contentContainer: {
        flexDirection: 'row', justifyContent: 'flex-start'
    },
    idText: {
        padding: 3, backgroundColor: Global.MainColor, color: 'white', fontSize: 14, fontWeight: '500', fontFamily: Global.FontName, borderRadius: 3
    },
    statusText: {
        color: '#777777', fontSize: 14, fontFamily: Global.FontName
    },
    titleText: {
        fontSize: 14, color: '#777777', fontFamily: Global.FontName, marginTop : 3
    }
})

import Global, { imageUrl, convertMoney } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'

class OrderTrackingItem extends React.Component {

    constructor(props) {
        super(props)

    }

    onPress(){
        if(this.props.onDetail){
            this.props.onDetail()
        }
    }

    onReport(){
        if(this.props.onReport){
            this.props.onReport()
        }
    }

    render() {

        const {tracking_number, id, first_image_url, status, order, imported_shipment, export_shipment, arrived_tag, weight,
              created_tag, weight_cost} = this.props

        return (
            <TouchableOpacity onPress={this.onPress.bind(this)} style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Image source={{uri: first_image_url}} style={{width: 80, height: 80, marginRight: 8}}/>
                    <View style={{flex: 1}}>
                        <Text style={styles.titleText}>{'Mã vận đơn: '}
                            <Text style={{fontWeight: '500', color: '#333333'}}>{tracking_number}</Text>
                        </Text>
                        <Text style={styles.titleText}>{'Đơn hàng: '}
                            <Text style={{color: '#333333'}}>{order}</Text>
                        </Text>
                        {/* <Text style={styles.titleText}>{'Bao nhập: '}
                            <Text style={{color: '#333333'}}>{imported_shipment}</Text>
                        </Text> */}
                        {/* <Text style={styles.titleText}>{'Bao xếp: '}
                            <Text style={{color: '#333333'}}>{export_shipment}</Text>
                        </Text> */}
                        {/* <Text style={styles.titleText}>{'Ngày tạo: '}
                            <Text style={{color: '#333333'}}>{created_tag}</Text>
                        </Text> */}
                        <Text style={styles.titleText}>{'Ngày nhận: '}
                            <Text style={{color: '#333333'}}>{arrived_tag}</Text>
                        </Text>
                        <Text style={styles.titleText}>{'Cân nặng: '}
                            <Text style={{color: '#333333'}}>{weight}</Text>
                        </Text>
                        <Text style={styles.titleText}>{'Giá: '}
                            <Text style={{color: '#333333'}}>{weight_cost}</Text>
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={this.onReport.bind(this)} style={{width: 100, height: 35, marginTop: 10, alignSelf: 'center', backgroundColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Khiếu nại</Text>
                </TouchableOpacity>
            </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderTrackingItem);