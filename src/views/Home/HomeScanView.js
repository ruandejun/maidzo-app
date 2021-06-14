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
    Alert,
    Linking
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1, width: Global.ScreenWidth,
        backgroundColor: '#f6f6f6', alignItems: 'center', justifyContent: 'center'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%'
    }
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import { RNCamera } from 'react-native-camera'
import Header from 'components/Header'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { QRreader } from 'react-native-qr-scanner'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ImagePicker from 'react-native-image-picker'
import {ModalIndicator} from 'teaset'

class HomeScanView extends React.Component {

    state = {
        tracking: null
    }

    qrtimeout = null

    onRead(data) {
        // console.log(data)
        if (data && data.data) {
            let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            if(regex.test(data.data)){
                this.onpenWeb(data.data)
            }
        }
    }

    onpenWeb(link) {
        if(Global.showCart){
            this.props.navigation.navigate('TaobaoWebView', { url: link.replace('#modal=sku', '') })
        } else {
            Linking.openURL(link)
        }
    }


    onSelectPhoto() {
        try {
            ModalIndicator.show()
            ImagePicker.launchImageLibrary({}, (response) => {
                ModalIndicator.hide()
                // console.log('Response = ', response);

                if (response.didCancel) {
                    // console.log('User cancelled image picker');
                }
                else if (response.error) {
                    // console.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                }
                else {
                    if (response.uri) {
                        var path = response.path;
                        if (!path) {
                            path = response.uri;
                        }
                        QRreader(path).then((data) => {
                            // console.log(data)
            
                            let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
                            if(regex.test(data)){
                                this.onpenWeb(data)
                            }
            
                        }).catch((err) => {
                            // console.log(err)
                            CustomAlert('Thất bại', 'Không tìm thấy mã QR trong ảnh')
                        });

                    }
                }
            });
        } catch (error) {
            ModalIndicator.hide()
            console.log(error)
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <Header title='Scan QR Code' leftIcon={'chevron-left'} leftAction={() => this.props.navigation.goBack()} />
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}

                    onBarCodeRead={this.onRead.bind(this)}
                >
                </RNCamera>

                <TouchableOpacity onPress={this.onSelectPhoto.bind(this)} style={{ position: 'absolute', top: getStatusBarHeight() + 70, right: 20, borderRadius: 5, width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffffaa' }} >
                    <Icon name='images' size={25} color={Global.MainColor} />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScanView);
