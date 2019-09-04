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
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getBottomSpace } from 'src/Global';
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'

class AboutView extends React.Component {

    onOpenLink(url){
        Linking.canOpenURL(url)
        .then(canOpen => {
            if(canOpen){
                Linking.openURL(url)
            }
        })
    }

    render() {

        const {user} = this.props

        return (
            <View style={styles.container}>
                <Header
                    title='Giới thiệu'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
                    <Image source={Media.LogoFull} style={{width: 300, height: 100}} resizeMode='contain'/>
                    <Text style={{width: '90%', fontSize: 15, color: '#333333', fontFamily: Global.FontName, marginTop : 20}}>{'Website: '}
                        <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={this.onOpenLink.bind(this, 'https://maidzo.vn')}>https://maidzo.vn</Text>
                    </Text>
                    <View style={{width: '90%', backgroundColor: '#CECECE', height: 1, marginTop : 15, marginBottom : 15}}/>
                    <Text style={{width: '90%', fontSize: 15, color: '#333333', fontFamily: Global.FontName}}>{'Địa chỉ: '}
                        <Text style={{color: Global.MainColor, textDecorationLine: 'underline'}} onPress={this.onOpenLink.bind(this, 'https://goo.gl/maps/NXYjvb2GAvVrS6DB8')}>Số 9, Lô 5B Trung Yên 6, Trung Hòa, Cầu Giấy, Thành phố Hà Nội</Text>
                    </Text>
                    <View style={{width: '90%', backgroundColor: '#CECECE', height: 1, marginTop : 15, marginBottom : 15}}/>
                    <Text style={{width: '90%', fontSize: 15, color: '#333333', fontFamily: Global.FontName}}>{'Hotline: '}
                        <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={this.onOpenLink.bind(this, 'tel:+841900989977')}>1900989977</Text>
                        <Text>{'   |   '}</Text>
                        <Text style={{color: Global.MainColor, textDecorationLine: 'underline'}} onPress={this.onOpenLink.bind(this, 'tel:+842466833354')}>842466833354</Text>
                    </Text>
                    <View style={{width: '90%', backgroundColor: '#CECECE', height: 1, marginTop : 15, marginBottom : 15}}/>
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutView);
