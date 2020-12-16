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
    Linking,
    FlatList,
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

class PrivacyView extends React.Component {

    renderItem({item, index}){

        return(
            <TouchableOpacity onPress={() => Linking.openURL(Global.apiUrl + item.key + '.html')} style={{flexDirection: 'row', width: '100%', padding: 10, alignItems: 'center'}}>
                <Text style={{flex: 1, fontSize: 13, color: '#333333', fontFamily: Global.FontName, marginRight: 8}}>{item.description}</Text>
                <Icon name='chevron-right' size={14} color='#333333'/>
                <View style={{position: 'absolute', left: 0, right: 0, height: 0.5, backgroundColor: '#CECECE', bottom : 0,}}/>
            </TouchableOpacity>
        )
    }

    render() {

        const {user} = this.props

        return (
            <View style={styles.container}>
                <Header
                    title='Điều khoản'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <FlatList 
                    data={this.props.chinhsach}
                    renderItem={this.renderItem.bind(this)}
                    style={{flex: 1, width: '100%'}}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.auth.user,
        chinhsach: state.setting.chinhsach
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyView);
