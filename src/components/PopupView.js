import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
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
        paddingTop: 10
    },
    webview: {
        width: '100%',
        height: '100%'
    },
    closeButton: {
        height: 30, width: 30, alignItems: 'center', justifyContent: 'space-between'
    },
    headerContainer : {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        width: Global.ScreenWidth * 0.9 - 60,
        fontSize: 15, color: 'black', fontWeight: '500',
        fontFamily: Global.FontName
    }
})


export default class PopupView extends React.PureComponent{

    render(){

        const html = this.props.html.replace('src="/', `src="${Global.apiUrl}/`)
        const title = this.props.title

        return(
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    {title && <Text numberOfLines={0} style={styles.titleText}>{title}</Text>}
                    <TouchableOpacity style={styles.closeButton} onPress={() => this.props.onClose && this.props.onClose()}>
                        <Icon name='times' size={16} color='black'/>
                    </TouchableOpacity>
                </View>
                <WebView 
                    style={styles.webview}
                    source={{html: html}}
                />
            </View>
        )
    }
}