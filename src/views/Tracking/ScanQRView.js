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
    PixelRatio
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

class ScanQRView extends React.Component {

    state = {
        tracking: null
    }

    qrtimeout = null

    onRead(data) {
        // console.log(data)
        if (data && data.data) {
            if (this.qrtimeout) {
                clearTimeout(this.qrtimeout)
                this.qrtimeout = null
            }

            let tracking_id = null

            try {
                const result = JSON.parse(data.data)
                if (result) {
                    tracking_id = result.tracking_id
                }

            } catch (error) {

            }

            this.setState({ tracking: { ...data, tracking_id: tracking_id } })
            this.qrtimeout = setTimeout(() => {
                this.setState({ tracking: null })
            }, 1000);
        }
    }

    onOpenTracking(item_id) {
        this.props.navigation.replace('TrackingDetailView', { tracking_id: item_id })
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
            
                            let tracking_id = null
            
                            try {
                                const result = JSON.parse(data)
                                if (result) {
                                    tracking_id = result.tracking_id
                                }
            
                            } catch (error) {
            
                            }
            
                            if (tracking_id) {
                                CustomAlert('Thành công', 'Mở vận đơn ' + tracking_id, [
                                    { text: 'Bỏ', },
                                    { text: 'Mở', onPress: this.onOpenTracking.bind(this, tracking_id) }
                                ])
                            } else {
                                CustomAlert('Thất bại', 'Không tìm thấy mã QR trong ảnh')
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

    renderBounds() {

        const { tracking } = this.state
        if(tracking.bounds.origin && tracking.bounds.origin.length == 4){
            const pixelRatio = PixelRatio.get()
            const leftBottom = { x: tracking.bounds.origin[0].x / pixelRatio, y: tracking.bounds.origin[0].y / pixelRatio }
            const leftTop = { x: tracking.bounds.origin[1].x / pixelRatio, y: tracking.bounds.origin[1].y / pixelRatio }
            const rightTop = { x: tracking.bounds.origin[2].x / pixelRatio, y: tracking.bounds.origin[2].y / pixelRatio }
            const rightBottom = { x: tracking.bounds.origin[3].x / pixelRatio, y: tracking.bounds.origin[3].y / pixelRatio }
            let x = Math.min(leftTop.x, leftBottom.x);
            let y = Math.min(leftTop.y, rightTop.y);
            let width = Math.max(rightTop.x - leftTop.x, rightBottom.x - leftBottom.x)
            let height = Math.max(leftBottom.y - leftTop.y, rightBottom.y - rightTop.y)
    
            console.log({ x, y, width, height })
    
            return (
                <View style={{
                    borderWidth: 1, borderColor: 'red',
                    position: 'absolute', width: width, height: height,
                    left: x, top: y
                }}>
    
                </View>
            )
        } else {
            return null
        }
    }

    render() {

        const { tracking } = this.state

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

                {tracking && tracking.bounds && tracking.bounds.size && tracking.bounds.origin &&
                    <View style={{
                        borderWidth: 1, borderColor: 'red',
                        position: 'absolute', width: parseFloat(tracking.bounds.size.width), height: parseFloat(tracking.bounds.size.width),
                        left: parseFloat(tracking.bounds.origin.x), top: parseFloat(tracking.bounds.origin.y) + 50 + getStatusBarHeight()
                    }}>

                    </View>
                }
                {Platform.OS == 'android' && tracking && tracking.bounds &&
                    this.renderBounds()
                }
                {tracking && tracking.tracking_id &&
                    <TouchableOpacity onPress={this.onOpenTracking.bind(this, tracking.tracking_id)} style={{ backgroundColor: 'white', height: 40, borderRadius: 20, position: 'absolute', width: 300, left: Global.ScreenWidth * 0.5 - 150, bottom: 20 + getBottomSpace(), alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 18, fontFamily: Global.FontName }}>{`Mở vận đơn: ${tracking.tracking_id}`}</Text>
                    </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScanQRView);
