import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ProgressBarAndroid,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    StatusBar,
    Modal,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
})

import { connect } from 'react-redux';
import Global, { Media, getBottomSpace, decode, getStatusBarHeight } from 'src/Global';
import Header, { headerStyles } from 'components/Header'
import Webview from 'react-native-webview'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { addItemToCart } from 'Carts/redux/action'
import { fetchUnlengthApi } from 'actions/api'
import CustomAlert from '../../components/CustomAlert';
import { jsCheckReadyToAddCart, jsGetProductDetailForCart, jsHideTaobaoThing, jsShowOptionsPopup } from './script/taobao'
import { jsCheckJDReadyToAddCart, jsGetJDProductDetailForCart, jsHideJDThing, jsShowJDOptionsPopup } from './script/jd'
import { jsHide1688Thing, js1688ShowOptionsPopup, jsCheck1688ReadyToAddCart, jsGet1688ProductDetailForCart } from './script/alibaba'
import { jsGetChemistDetailForCart } from './script/chemist'
import ProgressBar from 'react-native-progress/Bar'
import Share from 'react-native-share'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
// import testData from './script/test21.json'
import Stepper from 'teaset/components/Stepper/Stepper';

class Option1688View extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedAmount: {},
            selectedProps: null
        }
    }

    componentDidMount() {
        const { skuModel, onClose } = this.props
        const { skuPriceScale, skuInfoMap, skuProps } = skuModel
        if (skuProps && skuProps.length == 2) {
            this.setState({ selectedProps: skuProps[0].value[0], selectedAmount: {} })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.skuModel != this.props.skuModel) {
            const { skuModel, onClose } = this.props
            const { skuPriceScale, skuInfoMap, skuProps } = skuModel
            if (skuProps && skuProps.length == 2) {
                this.setState({ selectedProps: skuProps[0].value[0], selectedAmount: {} })
            }
        }
    }

    onBuy() {
        let carts = []
        const { skuModel, tempModel, onBuy, orderParamModel, shareModel } = this.props
        const { skuInfoMap, skuProps } = skuModel
        const { selectedAmount } = this.state
        const { offerTitle, companyName } = tempModel
        const { orderParam } = orderParamModel
        const { skuParam, canBookedAmount } = orderParam
        const { skuRangePrices, skuPriceType } = skuParam

        const keys = Object.keys(selectedAmount)
        let totalAmount = 0

        if (skuProps && skuProps.length == 1) {
            for (var i = 0; i < keys.length; i++) {
                const amount = selectedAmount[keys[i]]
                const detail = skuInfoMap[keys[i]]
                totalAmount += amount
                if (detail && amount > 0) {
                    const filter = skuProps[0].value.filter((item) => item.name == keys[i])

                    let price = detail.discountPrice
                    if (skuPriceType == 'rangePrice') {
                        let itemPrice = skuRangePrices[0].price
                        for (var k = 0; k < skuRangePrices.length; k++) {
                            if (amount > skuRangePrices[k].beginAmount) {
                                itemPrice = skuRangePrices[k].price
                            }
                        }

                        price = itemPrice
                    }

                    if (filter && filter.length > 0) {
                        let cart = { title: offerTitle, shop_name: companyName, quantity: amount, price: price, options: [{ propertyTitle: skuProps[0].prop, propertyValue: keys[i] }], image: filter[0].imageUrl ? filter[0].imageUrl : shareModel.picUrl }

                        carts.push(cart)
                    }

                }
            }
        } else if (skuProps && skuProps.length == 2) {
            for (var i = 0; i < keys.length; i++) {
                const amount = selectedAmount[keys[i]]
                const props = keys[i].split('&gt;')
                const detail = skuInfoMap[keys[i]]
                totalAmount += amount

                if (detail && amount > 0 && props.length == 2) {
                    const filter0 = skuProps[0].value.filter((item) => item.name == props[0])
                    const filter1 = skuProps[1].value.filter((item) => item.name == props[1])

                    let price = detail.discountPrice
                    if (skuPriceType == 'rangePrice') {
                        let itemPrice = skuRangePrices[0].price
                        for (var k = 0; k < skuRangePrices.length; k++) {
                            if (amount >= skuRangePrices[k].beginAmount) {
                                itemPrice = skuRangePrices[k].price
                            }
                        }

                        price = itemPrice
                    }

                    if (filter0 && filter1 && filter0.length > 0 && filter1.length > 0) {
                        let cart = { title: offerTitle, shop_name: companyName, quantity: amount, price: price, options: [{ propertyTitle: skuProps[0].prop, propertyValue: props[0] }, { propertyTitle: skuProps[1].prop, propertyValue: props[1] }], image: filter0[0].imageUrl ? filter0[0].imageUrl : shareModel.picUrl }

                        carts.push(cart)
                    }
                }
            }
        } else if(!skuProps){
            const amount = (selectedAmount && selectedAmount[offerTitle]) ? selectedAmount[offerTitle] : 0
            totalAmount += amount
            let cart = { title: offerTitle, shop_name: companyName, quantity: amount, price: skuRangePrices[0].price, options: [], image: shareModel.picUrl }

            carts.push(cart)
        }

        if (skuRangePrices && skuRangePrices.length > 0 && totalAmount < skuRangePrices[0].beginAmount) {
            alert(`Phải mua tối thiểu ${skuRangePrices[0].beginAmount} sản phẩm`)
            return
        }

        if (onBuy) {
            onBuy(carts)
        }
    }

    render() {
        const { skuModel, orderParamModel, onClose, shareModel, tempModel } = this.props
        const { skuPriceScale, skuInfoMap, skuProps } = skuModel
        const { selectedAmount, selectedProps } = this.state
        const { orderParam } = orderParamModel
        const { skuParam, canBookedAmount } = orderParam
        const { skuRangePrices, skuPriceType } = skuParam
        const { offerTitle, companyName } = tempModel

        let totalAmount = 0
        let totalPrice = 0

        const keys = Object.keys(selectedAmount)
        for (var i = 0; i < keys.length; i++) {
            const amount = selectedAmount[keys[i]]

            if (skuProps) {
                const detail = skuInfoMap[keys[i]]
                if (detail) {
                    totalAmount += amount
                    let price = 0
                    if (skuPriceType == 'rangePrice') {
                        let itemPrice = skuRangePrices[0].price
                        for (var k = 0; k < skuRangePrices.length; k++) {
                            if (amount >= skuRangePrices[k].beginAmount) {
                                itemPrice = skuRangePrices[k].price
                            }
                        }

                        price = parseInt(amount * parseFloat(itemPrice) * 100) / 100
                    } else {
                        price = parseInt(amount * parseFloat(detail.discountPrice) * 100) / 100
                    }

                    totalPrice += price
                }
            } else {
                totalAmount += amount
                let price = 0
                if (skuPriceType == 'rangePrice') {
                    let itemPrice = skuRangePrices[0].price
                    for (var k = 0; k < skuRangePrices.length; k++) {
                        if (amount >= skuRangePrices[k].beginAmount) {
                            itemPrice = skuRangePrices[k].price
                        }
                    }

                    price = parseInt(amount * parseFloat(itemPrice) * 100) / 100
                } else {
                    price = parseInt(amount * parseFloat(skuRangePrices[0].price) * 100) / 100
                }

                totalPrice += price
            }

        }

        if (skuProps && skuProps.length == 1) {
            return (
                <View style={{ height: Global.ScreenHeight - 50 - getBottomSpace() - getStatusBarHeight(), width: '100%', backgroundColor: '#eeeeee', paddingBottom: getBottomSpace() }}>
                    {skuPriceType != 'rangePrice' &&
                        <View style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, color: Global.MainColor, fontFamily: Global.FontName }}>{skuPriceScale}</Text>
                            {skuRangePrices.length > 0 &&
                                <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>{`Tối thiểu ${skuRangePrices[0].beginAmount} sản phẩm`}</Text>
                            }
                        </View>
                    }
                    {skuPriceType == 'rangePrice' &&
                        <View style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 16 }}>
                            {skuRangePrices.map((item, index) => {
                                let amount = ''
                                if (index < skuRangePrices.length - 1) {
                                    amount = `${item.beginAmount}-${skuRangePrices[index + 1].beginAmount - 1}`
                                } else {
                                    amount = `> ${item.beginAmount}`
                                }
                                return (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, color: Global.MainColor, fontFamily: Global.FontName }}>{'￥' + item.price}</Text>
                                        <Text style={{ fontSize: 10, color: '#333333', fontFamily: Global.FontName }}>{amount}</Text>

                                    </View>
                                )
                            })}
                        </View>
                    }
                    <View style={{ width: '95%', flex: 1, alignSelf: 'center', }}>
                        {skuProps && skuProps.length > 0 &&
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1 }}>
                                    {skuProps[0].value.map((item, index) => {
                                        const detail = skuInfoMap[item.name]
                                        const amount = (selectedAmount && selectedAmount[item.name]) ? selectedAmount[item.name] : 0

                                        if (detail) {
                                            return (
                                                <View key={index.toString()} style={{ width: '100%', backgroundColor: 'white', marginBottom: 10, borderRadius: 5, flexDirection: 'row', padding: 16, paddingHorizontal: 8, alignItems: 'center' }}>
                                                    <Image source={{ uri: item.imageUrl ? item.imageUrl : shareModel.picUrl }} style={{ width: 50, height: 50, borderRadius: 2, marginRight: 10 }} />
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 15, color: 'black', fontFamily: Global.FontName }}>{item.name}</Text>
                                                        <Text style={{ fontSize: 12, color: '#777777', fontFamily: Global.FontName }}>{'Số lượng: ' + detail.canBookCount}</Text>
                                                        {skuPriceType != 'rangePrice' && <Text style={{ fontSize: 12, color: '#777777', fontFamily: Global.FontName }}>{'Giá: ￥' + detail.discountPrice}</Text>}
                                                    </View>
                                                    <Stepper style={{ height: 30 }} min={0} max={detail.canBookCount} value={amount} onChange={value => this.setState({ selectedAmount: { ...selectedAmount, [item.name]: value } })} />
                                                </View>
                                            )
                                        } else {
                                            return null
                                        }

                                    })}
                                </View>
                            </ScrollView>
                        }
                    </View>

                    <View style={{ padding: 10, paddingHorizontal: 16, flexDirection: 'row', backgroundColor: 'white', marginTop: 5, width: '100%' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontFamily: Global.FontName, color: '#333333' }}>{`Tổng số lượng: ${totalAmount}`}</Text>
                            <Text style={{ fontSize: 14, fontFamily: Global.FontName, color: '#333333', marginTop: 5 }}>{`Tổng số tiền: ￥${totalPrice}`}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={this.onBuy.bind(this)} disabled={totalAmount == 0} >
                            <View style={{ width: 100, height: 40, borderRadius: 20, backgroundColor: totalAmount > 0 ? Global.MainColor : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 15, fontFamily: Global.FontName }}>Đặt mua</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <TouchableOpacity onPress={() => onClose && onClose()} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: 'red', position: 'absolute', top: 5, right: 5 }}>
                        <Icon name='times' color='white' size={20} />
                    </TouchableOpacity>
                </View>
            )
        } else if (skuProps && skuProps.length == 2) {
            return (
                <View style={{ height: Global.ScreenHeight - 50 - getBottomSpace() - getStatusBarHeight(), width: '100%', backgroundColor: '#eeeeee', paddingBottom: getBottomSpace() }}>
                    <View style={{ width: '100%', flex: 1, alignSelf: 'center', flexDirection: 'row', marginTop: 16 }}>
                        <View style={{ width: 150, height: '100%' }}>
                            <ScrollView style={{ width: 150, height: '100%' }}>
                                <View style={{ width: 150 }}>
                                    {skuProps[0].value.map((item, index) => {
                                        let totalAmount = 0
                                        for (var i = 0; i < skuProps[1].value.length; i++) {
                                            const itemName = `${item.name}&gt;${skuProps[1].value[i].name}`
                                            totalAmount += ((selectedAmount && selectedAmount[itemName]) ? selectedAmount[itemName] : 0)
                                        }

                                        return (
                                            <TouchableOpacity onPress={() => this.setState({ selectedProps: item })} key={index.toString()} style={{ width: '100%', backgroundColor: 'white', borderColor: Global.MainColor, borderWidth: selectedProps && selectedProps.name == item.name ? 2 : 0, marginBottom: 3, borderRadius: 5, flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                                                <Image source={{ uri: item.imageUrl }} style={{ width: 50, height: 50, borderRadius: 2, marginRight: 5 }} />
                                                <Text style={{ fontSize: 13, color: 'black', fontFamily: Global.FontName, flex: 1 }}>{item.name}</Text>
                                                {totalAmount > 0 &&
                                                    <View style={{ backgroundColor: Global.MainColor, position: 'absolute', bottom: 2, right: 2, height: 16, borderRadius: 8, justifyContent: 'center', paddingHorizontal: 8 }}>
                                                        <Text style={{ fontSize: 11, color: 'white', fontFamily: Global.FontName, fontWeight: 'bold' }}>{totalAmount}</Text>
                                                    </View>
                                                }
                                            </TouchableOpacity>
                                        )

                                    })}
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <View style={{ flexDirection: 'row', padding: 8, width: '100%' }}>
                                <Image source={selectedProps ? { uri: selectedProps.imageUrl } : null} style={{ width: 100, height: 100, borderRadius: 2, marginRight: 10 }} />

                                {skuPriceType != 'rangePrice' &&
                                    <View style={{ paddingRight: 16, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text numberOfLines={3} style={{ textAlign: 'center', fontSize: 20, fontWeight: '600', color: Global.MainColor, fontFamily: Global.FontName }}>{skuRangePrices.length == 2 ? `￥${skuRangePrices[0].price} \n~\n￥${skuRangePrices[1].price}` : skuPriceScale}</Text>
                                        {skuRangePrices.length > 0 &&
                                            <Text style={{ textAlign: 'center', fontSize: 10, color: '#333333', fontFamily: Global.FontName, marginTop: 5 }}>{`Tối thiểu ${skuRangePrices[0].beginAmount} sản phẩm`}</Text>
                                        }
                                    </View>
                                }


                                {skuPriceType == 'rangePrice' &&
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                                        {skuRangePrices.map((item, index) => {
                                            let amount = ''
                                            if (index < skuRangePrices.length - 1) {
                                                amount = `${item.beginAmount}-${skuRangePrices[index + 1].beginAmount - 1}`
                                            } else {
                                                amount = `> ${item.beginAmount}`
                                            }
                                            return (
                                                <View style={{ marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 15, color: Global.MainColor, fontFamily: Global.FontName }}>{'￥' + item.price}</Text>
                                                    <Text style={{ fontSize: 9, color: '#333333', fontFamily: Global.FontName }}>{amount}</Text>

                                                </View>
                                            )
                                        })}
                                    </View>
                                }
                            </View>
                            {selectedProps &&
                                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, width: '100%' }}>
                                    <View style={{ flex: 1 }}>
                                        {skuProps[1].value.map((item, index) => {
                                            const itemName = `${selectedProps.name}&gt;${item.name}`
                                            const detail = skuInfoMap[itemName]
                                            const amount = (selectedAmount && selectedAmount[itemName]) ? selectedAmount[itemName] : 0

                                            if (detail) {
                                                return (
                                                    <View key={index.toString()} style={{ width: '100%', backgroundColor: 'white', marginBottom: 10, borderRadius: 5, flexDirection: 'row', padding: 8, alignItems: 'center' }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ fontSize: 15, color: 'black', fontFamily: Global.FontName }}>{item.name}</Text>
                                                            <Text style={{ fontSize: 12, color: '#777777', fontFamily: Global.FontName }}>{'Số lượng: ' + detail.canBookCount}</Text>
                                                            {skuPriceType != 'rangePrice' && <Text style={{ fontSize: 12, color: '#777777', fontFamily: Global.FontName }}>{'Giá: ￥' + detail.discountPrice}</Text>}
                                                        </View>
                                                        <Stepper style={{ height: 30 }} min={0} max={detail.canBookCount} value={amount} onChange={value => this.setState({ selectedAmount: { ...selectedAmount, [itemName]: value } })} />
                                                    </View>
                                                )
                                            } else {
                                                return null
                                            }

                                        })}
                                    </View>
                                </ScrollView>
                            }
                        </View>
                    </View>

                    <View style={{ padding: 10, paddingHorizontal: 16, flexDirection: 'row', backgroundColor: 'white', marginTop: 5, width: '100%' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontFamily: Global.FontName, color: '#333333' }}>{`Tổng số lượng: ${totalAmount}`}</Text>
                            <Text style={{ fontSize: 14, fontFamily: Global.FontName, color: '#333333', marginTop: 5 }}>{`Tổng số tiền: ￥${totalPrice}`}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={this.onBuy.bind(this)} disabled={totalAmount == 0} >
                            <View style={{ width: 100, height: 40, borderRadius: 20, backgroundColor: totalAmount > 0 ? Global.MainColor : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 15, fontFamily: Global.FontName }}>Đặt mua</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <TouchableOpacity onPress={() => onClose && onClose()} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: 'red', position: 'absolute', top: 5, right: 5 }}>
                        <Icon name='times' color='white' size={20} />
                    </TouchableOpacity>
                </View>
            )
        } else if (!skuProps) {
            return (
                <View style={{ height: Global.ScreenHeight - 50 - getBottomSpace() - getStatusBarHeight(), width: '100%', backgroundColor: '#eeeeee', paddingBottom: getBottomSpace() }}>
                    {skuPriceType != 'rangePrice' &&
                        <View style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, color: Global.MainColor, fontFamily: Global.FontName }}>{skuPriceScale}</Text>
                            {skuRangePrices.length > 0 &&
                                <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>{`Tối thiểu ${skuRangePrices[0].beginAmount} sản phẩm`}</Text>
                            }
                        </View>
                    }
                    {skuPriceType == 'rangePrice' &&
                        <View style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 16 }}>
                            {skuRangePrices.map((item, index) => {
                                let amount = ''
                                if (index < skuRangePrices.length - 1) {
                                    amount = `${item.beginAmount}-${skuRangePrices[index + 1].beginAmount - 1}`
                                } else {
                                    amount = `> ${item.beginAmount}`
                                }
                                return (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, color: Global.MainColor, fontFamily: Global.FontName }}>{'￥' + item.price}</Text>
                                        <Text style={{ fontSize: 10, color: '#333333', fontFamily: Global.FontName }}>{amount}</Text>

                                    </View>
                                )
                            })}
                        </View>
                    }
                    <View style={{ width: '95%', flex: 1, alignSelf: 'center', }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ width: '100%', backgroundColor: 'white', marginBottom: 10, borderRadius: 5, flexDirection: 'row', padding: 16, paddingHorizontal: 8, alignItems: 'center' }}>
                                <Image source={{ uri: shareModel.picUrl }} style={{ width: 50, height: 50, borderRadius: 2, marginRight: 10 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: '#777777', fontFamily: Global.FontName }}>{'Số lượng: ' + canBookedAmount}</Text>
                                </View>
                                <Stepper style={{ height: 30 }} min={0} max={canBookedAmount} value={totalAmount} onChange={value => this.setState({ selectedAmount: { ...selectedAmount, [offerTitle]: value } })} />
                            </View>
                        </View>
                    </View>

                    <View style={{ padding: 10, paddingHorizontal: 16, flexDirection: 'row', backgroundColor: 'white', marginTop: 5, width: '100%' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontFamily: Global.FontName, color: '#333333' }}>{`Tổng số lượng: ${totalAmount}`}</Text>
                            <Text style={{ fontSize: 14, fontFamily: Global.FontName, color: '#333333', marginTop: 5 }}>{`Tổng số tiền: ￥${totalPrice}`}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={this.onBuy.bind(this)} disabled={totalAmount == 0} >
                            <View style={{ width: 100, height: 40, borderRadius: 20, backgroundColor: totalAmount > 0 ? Global.MainColor : 'gray', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 15, fontFamily: Global.FontName }}>Đặt mua</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <TouchableOpacity onPress={() => onClose && onClose()} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: 'red', position: 'absolute', top: 5, right: 5 }}>
                        <Icon name='times' color='white' size={20} />
                    </TouchableOpacity>
                </View>
            )
        } else {
            return null
        }
    }
}

class TaobaoWebView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            searchKeyword: '',
            url: props.navigation.getParam('url'),
            suggestions: [],
            options1688: null,
            searchSource: 0 //0 = 1688, 1 = taobao, 2 = tmall, 3 = chemistwarehouse, 4 = JD
        }
    }

    loadingTimer = null
    currentUrl = null

    componentDidMount() {
        let url = this.props.navigation.getParam('url')
        if (url && url.indexOf('https://www.chemistwarehouse.com.au') != -1 || url.indexOf('https://dis.as.criteo.com') != -1) {
            this.setState({ searchSource: 3 })
        } else if (url && url.indexOf('m.1688.com') != -1 || url.indexOf('1688.com') != -1) {
            this.setState({ searchSource: 0 })
        } if (url && url.indexOf('m.jd.com') != -1 || url.indexOf('jd.com') != -1) {
            this.setState({ searchSource: 4 })
        } else if (url && url.indexOf('https://m.intl.taobao.com') != -1 || url.indexOf('intl.taobao.com') != -1) {
            this.setState({ searchSource: 1 })
        } else {
            this.setState({ searchSource: 2 })
        }
    }

    onstartRequest(event) {
        try {
            console.log(event)

            this.currentUrl = event.mainDocumentURL ? event.mainDocumentURL : event.url

            if (this.currentUrl && this.currentUrl.indexOf('http') != 0) {
                return false
            }

            // if(this.loadingTimer){
            //     clearTimeout(this.loadingTimer)
            //     this.loadingTimer = null
            // }

            // this.loadingTimer = setTimeout(() => {
            //     fetch(event.url)
            //     .then((res) => res.text())
            //     .then((data) => {
            //         console.log(event.url)
            //         console.log(data)
            //     })
            //     .catch((error) => {
            //         console.log(error)
            //     })
            // }, 100)
        } catch (error) {
            console.log(error)
        }

        return true
    }

    handleWebViewNavigationStateChange(newState) {
        this.setState({ loading: newState && newState.loading })
        // console.log(newState)
        if (newState && !newState.loading) {
            this.webview.injectJavaScript(jsHideTaobaoThing)
            this.webview.injectJavaScript(jsHide1688Thing)
            this.webview.injectJavaScript(jsHideJDThing)
        }
    }

    async addToCart() {
        if (!this.props.user) {
            CustomAlert('Lỗi', 'Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ hàng', [
                { text: 'Bỏ' },
                { text: 'Đăng nhập', onPress: () => this.props.navigation.navigate('LoginView') }
            ])
            return
        }

        // console.log(this.currentUrl)
        if (!this.currentUrl) {
            return
        }

        if (this.currentUrl.indexOf('https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?item_id=') == 0) {
            this.setState({ url: this.currentUrl.replace('https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?item_id=', 'https://detail.m.tmall.com/item.htm?id=') })
            return
        }
        if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') == -1 && this.currentUrl.indexOf('m.1688.com/offer') == -1 && this.currentUrl.indexOf('item.m.jd.com') == -1 &&
            this.currentUrl.indexOf('item.m.paipai.com') == -1 && this.currentUrl.indexOf('https://www.chemistwarehouse.com.au/buy/') == -1 && this.currentUrl.indexOf('https://dis.as.criteo.com/dis/dis.aspx' == -1)
        ) {
            CustomAlert(null, 'Đây không phải trang chi tiết sản phẩm')
            return
        }

        if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1) {
            this.webview.injectJavaScript(jsCheckReadyToAddCart)
        } else if (this.currentUrl.indexOf('m.1688.com/offer') != -1) {
            this.webview.injectJavaScript(jsCheck1688ReadyToAddCart)
        } else if (this.currentUrl.indexOf('item.m.jd.com') != -1 || this.currentUrl.indexOf('item.m.paipai.com') != -1) {
            this.webview.injectJavaScript(jsCheckJDReadyToAddCart)
        } else if (this.currentUrl.indexOf('https://www.chemistwarehouse.com.au/buy/') != -1 || this.currentUrl.indexOf('https://dis.as.criteo.com/dis/dis.aspx') != -1) {
            this.webview.injectJavaScript(jsGetChemistDetailForCart)
        }
    }

    onBack() {
        this.props.navigation.goBack()
    }

    async onMessage(event) {
        try {
            if (event.nativeEvent.data && this.currentUrl) {
                let response = JSON.parse(event.nativeEvent.data)
                console.log({ response })
                if (response) {
                    if (response.type == '1688ShowOptionPopUp') {
                        const startIndex = response.value.indexOf('__INIT_DATA=')
                        if (startIndex > -1) {
                            const endIndex = response.value.indexOf('</script>', startIndex)
                            const dataString = response.value.substring(startIndex + 12, endIndex)
                            try {
                                const data = JSON.parse(dataString)
                                if (data && data.globalData) {
                                    // if(data.globalData.skuModel && data.globalData.skuModel.skuProps){
                                    this.setState({ options1688: data.globalData })
                                    // } else {
                                    //     alert('Hiện tại không thể mua sản phẩm này')
                                    // }

                                }
                            } catch (error) {
                                console.log({ error })
                            }
                        }
                        return
                    }
                    if (response.type == 'checkReadyToAddCart') {
                        if (response.value == 1) {
                            if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1) {
                                this.webview.injectJavaScript(jsGetProductDetailForCart)
                            } else if (this.currentUrl.indexOf('m.1688.com/offer') != -1) {
                                this.webview.injectJavaScript(jsGet1688ProductDetailForCart)
                            } else if (this.currentUrl.indexOf('item.m.jd.com') != -1 || this.currentUrl.indexOf('item.m.paipai.com') != -1) {
                                this.webview.injectJavaScript(jsGetJDProductDetailForCart)
                            }
                        } else if (response.value == 2) {
                            CustomAlert('Có lỗi', 'Vui lòng chọn thuộc tính sản phẩm')
                        } else if (response.value == 3) {
                            CustomAlert('Có lỗi', 'Sản phẩm đã hết hàng hoặc phải đăng nhập để đặt hàng.', [
                                { text: 'Cancel' },
                                { text: 'Đăng nhập', onPress: () => this.setState({ url: `https://login.m.taobao.com/login_oversea.htm?spm=a2141.8294655.toolbar.3&redirectURL=${this.currentUrl}` }) }
                            ])
                        } else {
                            if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1) {
                                this.webview.injectJavaScript(jsShowOptionsPopup)
                            } else if (this.currentUrl.indexOf('m.1688.com/offer') != -1) {
                                this.webview.injectJavaScript(js1688ShowOptionsPopup)
                            } else if (this.currentUrl.indexOf('item.m.jd.com') != -1 || this.currentUrl.indexOf('item.m.paipai.com') != -1) {
                                this.webview.injectJavaScript(jsShowJDOptionsPopup)
                            }
                        }
                    }
                    if (response.type == 'getProductDetailForCart') {
                        const carts = response.value
                        carts.map((cart) => {
                            let options = {}
                            cart.options.map((item) => {
                                options[item.propertyTitle] = item.propertyValue
                            })

                            this.props.addItemToCart(cart.title, cart.title, cart.shop_name, cart.quantity,
                                cart.price, JSON.stringify(options), cart.detailUrl, cart.detailUrl, cart.currency,
                                cart.image, cart.price)
                        })

                        this.webview.reload()
                    }
                }
            }
        } catch (error) {
            console.log({ error })
        }
    }

    onBuy1688(carts) {
        console.log({ carts })
        this.setState({ options1688: null, })
        carts.map((cart) => {
            let options = {}
            cart.options.map((item) => {
                options[item.propertyTitle] = item.propertyValue
            })

            this.props.addItemToCart(cart.title, cart.title, cart.shop_name, cart.quantity,
                cart.price, JSON.stringify(options), this.currentUrl, this.currentUrl, 'CNY',
                cart.image, cart.price)
        })
        this.webview.reload()
    }

    openCart() {
        this.props.navigation.navigate('CartView')
    }

    onEndSubmit() {
        if (this.state.searchKeyword.indexOf('https://') != 0) {
            return
        }

        this.setState({ url: this.state.searchKeyword, options1688: null })
    }

    goBack() {
        if (this.webview) {
            this.webview.goBack()
        }
    }

    reloadWeb() {
        if (this.webview) {
            this.webview.reload()
        }
    }

    searchTimer = null

    onChangeText(text) {

        let searchKeyword = text

        try {
            const results = text.match(/(https?:\/\/[^\s]+)/g)
            // console.log(results)
            if (results && results.length > 0) {
                searchKeyword = results[0]
            } else {
                if (this.searchTimer) {
                    clearTimeout(this.searchTimer)
                    this.searchTimer = null
                }

                this.searchTimer = setTimeout(async () => {
                    const suggestions = await fetchUnlengthApi('get', 'page/key_translate/', { key: searchKeyword })
                    if (suggestions) {
                        this.setState({ suggestions: suggestions })
                    } else {
                        this.setState({ suggestions: [] })
                    }
                }, 1000);
            }
        } catch (error) {
            console.log(error)
        }

        this.setState({ searchKeyword: searchKeyword, suggestions: [] })
    }

    onPressSuggestion(suggestion) {

        const { searchSource } = this.state
        let currentUrl = this.state.url

        if (searchSource == 1) {
            currentUrl = `https://m.intl.taobao.com/search/search.html?q=${suggestion.zh_value}`
        } else if (searchSource == 0) {
            currentUrl = `https://m.1688.com/offer_search/-6D7033.html?keywords=${suggestion.zh_value}`
        } else if (searchSource == 3) {
            currentUrl = `https://www.chemistwarehouse.com.au/search/go?w=${suggestion.key}`
        } else if (searchSource == 2) {
            currentUrl = `https://list.tmall.com/search_product.htm?q=${suggestion.zh_value}&type=p&tmhkh5=&spm=a220m.8599659.a2227oh.d100&from=mallfp..m_1_searchbutton&searchType=default&closedKey=`
        } else if (searchSource == 4) {
            currentUrl = `https://so.m.jd.com/ware/search.action?keyword=${suggestion.zh_value}&searchFrom=home&sf=11&as=1`
        }

        // console.log(currentUrl)

        this.setState({ searchKeyword: '', suggestions: [], url: currentUrl })
    }

    renderSuggestion({ item, index }) {
        return (
            <TouchableOpacity onPress={this.onPressSuggestion.bind(this, item)} style={{ padding: 8, width: '100%' }}>
                <Text style={{ fontSize: 14, color: 'black', fontFamily: Global.FontName }}>{item.key}
                    <Text style={{ fontSize: 12, color: '#777777' }}>{'\n' + item.zh_value}</Text>
                </Text>
            </TouchableOpacity>
        )
    }

    onShare() {
        Share.open({ url: this.currentUrl.replace('#modal=sku', '') })
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
    }

    renderHeader() {
        const { searchSource } = this.state

        return (
            <View style={{ flexDirection: 'row', height: 60, backgroundColor: '#CECECE' }}>
                <TouchableOpacity onPress={() => this.setState({ searchSource: 0 })} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 0 ? Global.MainColor : 'white' }}>
                    <Image source={Media.AlibabaIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName }}>1688</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({ searchSource: 1 })} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 1 ? Global.MainColor : 'white' }}>
                    <Image source={Media.TaobaoIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName }}>taobao</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({ searchSource: 2 })} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 2 ? Global.MainColor : 'white' }}>
                    <Image source={Media.TmallIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName }}>tmall</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({ searchSource: 4 })} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 3 ? Global.MainColor : 'white' }}>
                    <Image source={Media.JDIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName }}>jd</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const { url, suggestions, options1688 } = this.state
        const { cartCount } = this.props

        return (
            <View style={styles.container}>
                <SafeAreaView style={headerStyles.container}>
                    <StatusBar translucent barStyle='dark-content' backgroundColor='#00000000' networkActivityIndicatorVisible={this.state.loading} />
                    <TouchableOpacity style={headerStyles.iconLeft} onPress={this.onBack.bind(this)}>
                        <Icon name={'times'} size={22} color={Global.MainColor} />
                    </TouchableOpacity>

                    <View style={[headerStyles.searchContainer]}>
                        <Icon name='search' size={15} color='#7f7f7f' />
                        <TextInput
                            style={[headerStyles.searchInput,]}
                            underlineColorAndroid='#00000000'
                            placeholder={'Nhập link sản phẩm cần tìm kiếm'}
                            placeholderTextColor='#7f7f7f'
                            value={this.state.searchKeyword}
                            clearButtonMode='always'
                            clearTextOnFocus={true}
                            onChangeText={this.onChangeText.bind(this)}
                            onSubmitEditing={this.onEndSubmit.bind(this)}
                            onEndEditing={this.onEndSubmit.bind(this)}
                        />
                    </View>

                    <TouchableOpacity style={headerStyles.iconRight} onPress={this.openCart.bind(this)}>
                        <Icon name={'shopping-cart'} size={23} color={Global.MainColor} />

                        {cartCount > 0 &&
                            <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'green', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 9, fontFamily: Global.FontName, color: 'white' }}>{cartCount}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                    <View style={headerStyles.headerSeparator} />
                </SafeAreaView>
                {(!suggestions || suggestions.length == 0) && this.state.loading && <ProgressBar height={1} borderRadius={0} width={Global.ScreenWidth} color="#2196F3" indeterminate={true} />}
                {/* <View style={{backgroundColor: Global.MainColor, width: '100%', paddingHorizontal: 10, paddingVertical: 5}}>
                    <View style={{height: 32, borderRadius: 5, justifyContent: 'center', backgroundColor: 'white', padding: 5}}>
                         <Text style={{fontSize: 14, color: 'black'}}>{this.currentUrl}</Text>
                    </View>
                </View> */}
                {(!suggestions || suggestions.length == 0) &&
                    <View style={{ flex: 1 }}>
                        <Webview
                            ref={ref => (this.webview = ref)}
                            onNavigationStateChange={this.handleWebViewNavigationStateChange.bind(this)}
                            style={{ flex: 1 }} source={{ uri: url }}
                            onShouldStartLoadWithRequest={this.onstartRequest.bind(this)}
                            onMessage={this.onMessage.bind(this)}
                            javaScriptEnabled={true}
                            originWhitelist={['*']}
                        />
                    </View>
                }
                {(!suggestions || suggestions.length == 0) &&
                    <View style={{ width: Global.ScreenWidth, backgroundColor: Global.MainColor, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={this.goBack.bind(this)} style={{ width: 50, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='chevron-left' color='white' size={20} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.reloadWeb.bind(this)} style={{ width: 50, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='redo' color='white' size={20} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onShare.bind(this)} style={{ width: 50, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='share' color='white' size={20} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.addToCart.bind(this)} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='cart-plus' color='white' size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 16, marginTop: 5, color: 'white', fontFamily: Global.FontName, fontWeight: '500' }}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>
                }
                {suggestions && suggestions.length > 0 &&
                    <KeyboardAwareFlatList
                        ListHeaderComponent={this.renderHeader.bind(this)}
                        data={suggestions}
                        style={{ flex: 1 }}
                        renderItem={this.renderSuggestion.bind(this)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={options1688 != null}
                    onRequestClose={() => {
                        this.setState({ options1688: null })
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Option1688View {...options1688} onClose={() => this.setState({ options1688: null })} onBuy={this.onBuy1688.bind(this)} />
                    </View>
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cartCount: state.cart.count,
        user: state.auth.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addItemToCart: (name, short_description, vendor, quantity, price, options_selected, detail_url, link_origin, currency, image_url, price_origin) => dispatch(addItemToCart(name, short_description, vendor, quantity, price, options_selected, detail_url, link_origin, currency, image_url, price_origin)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaobaoWebView);
