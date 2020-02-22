import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Linking,
    Image,
    Clipboard
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
import { Toast } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'

class OrderTransportItem extends React.Component {

    constructor(props) {
        super(props)

    }

    onReport(){
        if(this.props.onReport){
            this.props.onReport()
        }
    }

    render() {

        const {tracking_number, id, note, status, created_by_username,
              created_tag} = this.props

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={() => {Clipboard.setString(`${tracking_number}`); Toast.message('Đã copy')}} style={{flexDirection: 'row', marginTop: 5, width: '100%'}}>
                            <Text style={{fontSize: 13, color: '#333333', flex: 1, fontFamily: Global.FontName}}>{`Mã vận chuyển: `}
                                <Text style={{ color: 'black', fontSize: 14 }}>{tracking_number}</Text>
                            </Text>
                            <Icon name='copy' style={{width: 30}} size={20} color='#CECECE'/>
                        </TouchableOpacity>
                        <Text style={styles.titleText}>{'Tạo bởi: '}
                            <Text style={{color: '#333333'}}>{created_by_username}</Text>
                        </Text>
                        {!!note && note.length > 0 &&
                            <Text style={styles.titleText}>{'Ghi chú: '}
                                <Text style={{color: '#333333'}}>{note}</Text>
                            </Text>
                        }
                        <Text style={styles.titleText}>{'Ngày tạo: '}
                            <Text style={{color: '#333333'}}>{created_tag}</Text>
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={this.onReport.bind(this)} style={{width: 100, height: 35, marginTop: 10, alignSelf: 'center', backgroundColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Khiếu nại</Text>
                </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderTransportItem);