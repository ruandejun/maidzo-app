/**
 * @flow
 * @providesModule HomeMainView
 */

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
    Linking,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2', alignItems: 'center'
    },
    itemContainer: {
        width: '95%', marginLeft: '2.5%', flexDirection: 'row', backgroundColor: 'white', marginBottom: 10, marginTop: 10, padding: 16, alignItems: 'center', justifyContent: 'center'
    },
    callButton: {
        margin: 10, width: 40, borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green'
    },
    titleText: {
        fontSize: 16, color: '#333333', fontFamily: Global.FontName, fontWeight: '500'
    }
})

import { connect } from 'react-redux';
import Global, { Media, contacts } from 'src/Global';
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FlatList } from 'react-native-gesture-handler';

class ContactView extends React.Component {

    onCall(phone){
        Linking.canOpenURL(`tel:${phone}`)
        .then(canOpen => {
            if(canOpen){
                Linking.openURL(`tel:${phone}`)
            }
        })
    }

    renderItem({item, index}){
        return(
            <View style={styles.itemContainer}>
                <View style={{flex: 1}}>
                    <Text style={styles.titleText}>{item.title + ':\n'}</Text>
                    <Text style={styles.titleText}>{'Gọi: '}
                        <Text style={{color: Global.MainColor}}>{item.number}</Text>
                    </Text>
                </View>
                <TouchableOpacity onPress={this.onCall.bind(this, item.number)} style={styles.callButton}>
                    <Icon name='phone' color='white' size={20}/>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                <Header
                    title='Liên Hệ'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <FlatList
                    data={contacts}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => index.toString()}
                    style={{flex: 1, width: Global.ScreenWidth}}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactView);
