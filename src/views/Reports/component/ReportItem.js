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
        width: '95%', marginLeft: '2.5%', borderRadius: 8,
        backgroundColor: 'white', padding: 16, marginTop: 5, marginBottom: 5
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
        borderTopColor: '#CECECE', borderTopWidth: 1, marginTop: 8
    },
    detailText: {
        fontSize: 13, color: '#333333', fontFamily: Global.FontName, marginTop: 5
    }
})

import Global, { imageUrl, convertMoney } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'

class ReportItem extends React.Component {

    constructor(props) {
        super(props)
    }

    onDetail() {
        if (this.props.onDetail) {
            this.props.onDetail()
        }
    }

    render() {

        const { id, title, type, full_name, body, status, created } = this.props

        return (
            <TouchableOpacity onPress={this.onDetail.bind(this)} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>
                        {id}
                    </Text>
                    <Text style={styles.dateText}>{status}</Text>
                </View>
                <View style={styles.detailView}>
                    <Text style={styles.detailText}>
                        <Text style={{ fontWeight: '500' }}>{full_name}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={{ color: Global.MainColor }}>{title}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        {'Hình thức: '}
                        <Text style={{ color: 'green' }}>{type}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        {'Chi tiết: '}
                        <Text style={{ color: 'black', }}>{body}</Text>
                    </Text>
                    <Text style={styles.detailText}>
                        {'Ngày tạo: '}
                        <Text style={{ color: 'black' }}>{created}</Text>
                    </Text>
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportItem);