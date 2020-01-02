import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import WebView from 'react-native-webview'
import Global from 'src/Global'
import Icon from 'react-native-vector-icons/FontAwesome5'

const styles = StyleSheet.create({
    container: {
        width: Global.ScreenWidth * 0.9,
        height: Global.ScreenWidth * 0.9,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        paddingTop: 30
    },
    webview: {
        width: '100%',
        height: '100%'
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5, height: 30, width: 30, alignItems: 'center', justifyContent: 'center'
    }
})


export default class PopupView extends React.PureComponent{

    render(){

        const html = this.props.html.replace('src="/', `src="${Global.apiUrl}/`)

        return(
            <View style={styles.container}>
                <WebView 
                    style={styles.webview}
                    source={{html: html}}
                />
                <TouchableOpacity style={styles.closeButton} onPress={() => this.props.onClose && this.props.onClose()}>
                    <Icon name='times' size={16} color='black'/>
                </TouchableOpacity>
            </View>
        )
    }
}