import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    Alert,
    TouchableOpacity,
    FlatList,
    Linking
} from 'react-native'
import Header from 'components/Header'
import axios from 'axios'
import Global, { getBottomSpace } from 'src/Global'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart } from 'Carts/redux/action'
import { SheetManager } from 'react-native-actions-sheet'
import ImageView from "react-native-image-viewing"
import FastImage from 'react-native-fast-image'
import Stepper from 'components/Stepper'
import TranslateText from '../../components/TranslateText'

const ProductDetailView = () => {
    const route = useRoute()
    const { product } = route.params
    const navigation = useNavigation()
    const [productData, setProductData] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [imageViewerVisible, setImageViewerVisible] = useState(false)
    const [selectProps, setSelectedProps] = useState({})
    const [updateTimes, setUpdateTimes] = useState(0)
    const dispatch = useDispatch()
    const cartCount = useSelector(state => state.cart.count ?? 0)

    const loadData = useCallback(() => {
        if (product) {
            setLoading(true)
            let url = product.click_url ?? ''
            if (url.toLowerCase().indexOf('http') != 0) {
                url = 'https:' + product.click_url
            }
            let endpoint = `https://quanly.chuyenhang365.com/page/get_item_details/`;

            console.log({ url })

            axios.postForm(endpoint, {
                url: url
            }, {
                responseType: 'json'
            }).then((response) => {
                setLoading(false)
                console.log({ response })
                if (response && response.data && response.data.data) {
                    setProductData(response.data.data)
                }
            })
                .catch((error) => {
                    setLoading(false)
                    console.log({ error })
                })
        } else {
            Alert.alert('Lỗi', 'Sản phẩm không tồn tại', [
                { text: 'Quay lại', onPress: () => navigation.goBack() }
            ])
        }

    }, [product])

    useEffect(() => {
        loadData()
    }, [loadData])

    const onRefresh = () => {
        loadData()
    }

    let totalQuantity = 0
    let totalPrice = 0

    const keys = Object.keys(selectProps)
    for (const key of keys) {
        const sub = selectProps[key]
        totalQuantity += sub.quantity
        totalPrice += (sub.quantity * sub.price)
    }

    const onAddCart = () => {
        if (!productData || totalPrice === 0 || totalQuantity === 0) return

        Alert.alert('Xác nhận đơn!', `Xác nhận đặt ${totalQuantity} sản phẩm với tổng giá tiền ${totalPrice} ${productData.currency}!`, [
            { text: 'Huỷ' },
            {
                text: 'Xác nhận', onPress: () => {
                    for (const key of keys) {
                        const option = selectProps[key]
                        const options = {}
                        options[option.title] = option.value

                        dispatch(addItemToCart(productData.title, productData.title, productData.shop_info.shop_name, option.quantity,
                            option.sale_price, JSON.stringify(options), productData.click_url, productData.click_url, 'CNY',
                            productData.main_imgs[0], option.origin_price))
                    }
                }
            }
        ])
    }

    const onShowProps = () => {
        SheetManager.show('product-props', {
            payload: {
                sku_props: productData.sku_props,
                skus: productData.skus
            }
        })
    }

    const imageList = productData ? productData.main_imgs.map((item) => ({ uri: item })) : []

    const renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => setImageViewerVisible(true)} style={{ width: Global.ScreenWidth, height: Global.ScreenHeight * 0.3, backgroundColor: 'blue' }}>
                <FastImage source={item} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
                <View style={{ position: 'absolute', top: 10, right: 10, height: 18, borderRadius: 9, width: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000055' }}>
                    <Text style={{ fontSize: 11, color: 'white' }}>{`${index + 1}/${imageList.length}`}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const openCart = () => {
        navigation.navigate('CartView')
    }

    const openLink = () => {
        Linking.openURL(productData.product_url)
            .then(() => { })
            .catch(() => { })
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                title='Chi tiết sản phẩm' leftIcon={'chevron-left'} leftAction={() => navigation.goBack()}
                rightIcon='shopping-cart'
                rightAction={openCart}
                rightCount={cartCount}
            />
            <ScrollView style={{ flex: 1, width: '100%' }} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
                {productData &&
                    <View style={{ flex: 1, width: '100%' }}>
                        <FlatList pagingEnabled horizontal data={imageList} renderItem={renderImage} style={{ width: '100%', height: Global.ScreenHeight * 0.3 }} />
                        <ImageView images={imageList} imageIndex={0} visible={imageViewerVisible} onRequestClose={() => setImageViewerVisible(false)} />
                        <View style={{ flex: 1, paddingBottom: 16 }}>
                            <View style={{ padding: 16, backgroundColor: 'white' }}>
                                <TranslateText style={{ width: '100%', fontSize: 16, color: 'black', fontWeight: '400' }} text={productData.title} />
                                <Text style={{ fontSize: 16, color: 'black', fontWeight: '400', marginTop: 16 }}>{`Giá từ: `}<Text style={{ fontSize: 20, fontWeight: '700' }}>{productData.price_info.origin_price}</Text>{` ${productData.currency}`}</Text>
                                <TouchableOpacity onPress={openLink} style={{ width: '100%', height: 44, backgroundColor: 'white', borderWidth: 1, borderRadius: 5, marginTop: 16, borderColor: Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 14, color: 'black' }}>{'Mở link gốc'}</Text>
                                </TouchableOpacity>
                            </View>
                            {productData.sku_props.map((prop) => {
                                return (
                                    <View key={prop.pid} style={{ marginTop: 16, padding: 16, backgroundColor: 'white' }}>
                                        <TranslateText style={{ fontSize: 18, color: 'black', marginBottom: 8, fontWeight: '700' }} text={prop.prop_name} />
                                        {prop.values.map((value) => {
                                        
                                            const priceFilter = productData.skus.filter((s) => s.props_ids.split(';').indexOf(`${prop.pid}:${value.vid}`) >= 0)
                                            if (priceFilter && priceFilter.length > 0) {
                                                const price = priceFilter[0]

                                                const hasSale = price.sale_price && price.origin_price !== price.sale_price
                                                const option = selectProps[`${prop.pid}:${value.vid}`]
                                                return (
                                                    <View key={value.vid} style={{ flexDirection: 'row', paddingVertical: 8 }}>
                                                        <FastImage source={{ uri: value.imageUrl }} style={{ width: 60, height: 60 }} resizeMode='cover' />
                                                        <View style={{ marginHorizontal: 8, flex: 1 }}>
                                                            <TranslateText style={{ fontSize: 16, fontWeight: '400', color: 'black' }} text={value.name} />
                                                            <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', marginTop: 5 }}>
                                                                <Text style={{ textDecorationLine: hasSale ? 'line-through' : 'none', fontSize: hasSale ? 14 : 16 }}>{price.origin_price}</Text>
                                                                {hasSale && <Text style={{ textDecorationLine: 'none', color: Global.MainColor, fontWeight: '700' }}>{`  ${price.sale_price}`}</Text>}
                                                                <Text>{` ${productData.currency}`}</Text>
                                                            </Text>
                                                        </View>
                                                        <View style={{ alignItems: 'flex-end', width: 100 }}>
                                                            <Stepper
                                                                style={{ borderWidth: 1, borderColor: Global.MainColor, padding: 2, borderRadius: 4 }}
                                                                showSeparator={false}
                                                                valueStyle={{ flex: 1 }}
                                                                placeholder='0'
                                                                value={option ? option.quantity.toString() : '0'}
                                                                onChange={quantity => {
                                                                    const newOptions = selectProps
                                                                    newOptions[`${prop.pid}:${value.vid}`] = { ...option, ...price, title: prop.prop_name, value: value.name, price: hasSale ? price.sale_price : price.origin_price, quantity: parseInt(quantity.toString()) }
                                                                    setSelectedProps(newOptions)
                                                                    setUpdateTimes(old => old + 1)
                                                                }}
                                                                step={1}
                                                                min={0}
                                                                max={price.stock}
                                                                subButton={
                                                                    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Text style={{ fontSize: 16, color: Global.MainColor }}>-</Text>
                                                                    </View>
                                                                }
                                                                addButton={
                                                                    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Text style={{ fontSize: 16, color: Global.MainColor }}>+</Text>
                                                                    </View>
                                                                }
                                                            />
                                                            <Text style={{ fontSize: 10, color: '#333333', marginTop: 3 }}>{`Kho: ${price.stock}`}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            } else {
                                                return null
                                            }

                                        })}
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                }
            </ScrollView>
            {productData &&
                <View style={{ flexDirection: 'row', width: '100%', paddingTop: 8, backgroundColor: '#eeeeee', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 16 }}>
                        <Text style={{ fontSize: 14, color: 'black', }}>{`Tổng số sản phẩm: `}
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>{totalQuantity}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, marginTop: 8, color: 'black' }}>{`Thành tiền: `}
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>{totalPrice}</Text>
                            <Text>{` ${productData.currency}`}</Text>
                        </Text>
                    </View>
                    <TouchableOpacity disabled={totalQuantity === 0 || totalPrice === 0} onPress={onAddCart} style={{ borderRadius: 5, width: 100, height: '100%', backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Đặt hàng</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )

}

export default ProductDetailView