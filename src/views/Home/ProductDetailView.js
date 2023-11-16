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
    Linking,
    Dimensions
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
import Icon from 'react-native-vector-icons/FontAwesome5';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ProductDetailView = () => {
    const route = useRoute()
    const { product } = route.params
    const navigation = useNavigation()
    const [productData, setProductData] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [imageViewerVisible, setImageViewerVisible] = useState(false)
    const [cartProps, setCartProps] = useState({})
    const [selectedProps, setSelectedProps] = useState({})
    const [updateTimes, setUpdateTimes] = useState(0)
    const dispatch = useDispatch()
    const cartCount = useSelector(state => state.cart.count ?? 0)
    const [showDetail, setShowDetail] = useState(true)
    const insets = useSafeAreaInsets()

    const loadData = useCallback(() => {
        if (product) {
            setLoading(true)
            let url = product.click_url ?? ''
            var urlRegex = /(https?:\/\/[^\s]+)/
            if (!urlRegex.test(url)) {
                url = 'https:' + product.click_url
            }
            let endpoint = `https://quanly.chuyenhang365.com/page/get_item_details/`;

            console.log({ url })

            axios.postForm(endpoint, {
                url: url.trim()
            }, {
                responseType: 'json'
            }).then((response) => {
                setLoading(false)
                console.log({ response })
                if (response && response.data && response.data.data) {
                    const pData = response.data.data
                    setProductData(pData)
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

    const keys = Object.keys(cartProps)
    for (const key of keys) {
        const sub = cartProps[key]
        totalQuantity += sub.quantity
        totalPrice += (sub.quantity * sub.price)
    }

    // const onAddCart = () => {
    //     if (!productData || totalPrice === 0 || totalQuantity === 0) {
    //         alert('Vui lòng thêm sản phẩm!')
    //         return
    //     }

    //     Alert.alert('Xác nhận đơn!', `Xác nhận đặt ${totalQuantity} sản phẩm với tổng giá tiền ${totalPrice} ${productData.currency}!`, [
    //         { text: 'Huỷ' },
    //         {
    //             text: 'Xác nhận', onPress: () => {
    //                 for (const key of keys) {
    //                     const option = cartProps[key]
    //                     const options = {}
    //                     const pkeys = Object.keys(selectedProps)
    //                     for (const pkey of pkeys) {
    //                         const prop = selectedProps[pkey]
    //                         options[prop.prop.prop_name] = prop.value.name
    //                     }
    //                     options[option.title] = option.value

    //                     console.log({ options })

    //                     dispatch(addItemToCart(productData.title, productData.title, productData.shop_info.shop_name, option.quantity,
    //                         option.sale_price, JSON.stringify(options), productData.click_url, productData.click_url, 'CNY',
    //                         productData.main_imgs[0], option.origin_price))
    //                 }
    //             }
    //         }
    //     ])
    // }

    const onShowProps = () => {
        SheetManager.show('product-props', {
            payload: {
                product: productData,
                insets: insets,
                onAdd: ({ options, sku, image, quantity, note }) => {
                    console.log({ options, sku, image, quantity })
                    let url = product.click_url ?? ''

                    var urlRegex = /(https?:\/\/[^\s]+)/
                    if (!urlRegex.test(url)) {
                        url = 'https:' + product.click_url
                    }

                    console.log({options, sku, image, quantity, note })

                    dispatch(addItemToCart(productData.title, productData.title, productData.shop_info.shop_name, quantity,
                        sku.sale_price, JSON.stringify(options), url, url, 'CNY',
                        image, sku.origin_price, note))
                }
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

    function convertObjectToFlatString(obj) {
        const flatString = Object.keys(obj).sort((a, b) => parseInt(a) < parseInt(b))
            .map((key) => `${obj[key].propString}`)
            .join(';');
        return flatString;
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                title='Chi tiết sản phẩm' leftIcon={'chevron-left'} leftAction={() => navigation.goBack()}
                rightIcon='shopping-cart'
                rightAction={openCart}
                rightCount={cartCount}
            />
            {
                !productData && product && product.title &&
                <View style={{ flex: 1, width: '100%', backgroundColor: 'white', paddingBottom: 16, minHeight: Global.ScreenHeight * 0.3 + 60 }}>
                    <FlatList pagingEnabled horizontal data={imageList} renderItem={renderImage} style={{ width: '100%', height: Global.ScreenHeight * 0.3 }} />
                    <ImageView images={[{ uri: product.pict_url }]} imageIndex={0} visible={imageViewerVisible} onRequestClose={() => setImageViewerVisible(false)} />
                    <View style={{ flex: 1, minHeight: 100, paddingBottom: 16 }}>
                        <View style={{ width: '100%', padding: 16, backgroundColor: 'white' }}>
                            <TranslateText style={{ width: '100%', fontSize: 16, color: 'black', fontWeight: '400' }} text={product.title} />
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: '400', marginTop: 16 }}>{`Giá từ: `}<Text style={{ fontSize: 20, fontWeight: '700' }}>{product.zk_final_price}</Text>{` CNY`}</Text>
                        </View>
                    </View>
                </View>
            }
            {
                loading &&
                <View style={{ backgroundColor: 'white', padding: 16 }}>
                    <SkeletonPlaceholder borderRadius={4}>
                        <SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item width={Global.ScreenWidth - 32} height={16} />
                            <SkeletonPlaceholder.Item marginTop={8} width={Global.ScreenWidth - 96} height={16} />
                            <SkeletonPlaceholder.Item marginTop={8} width={Global.ScreenWidth - 120} height={16} />
                            <SkeletonPlaceholder.Item marginTop={8} width={Global.ScreenWidth - 180} height={16} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                </View>
            }
            <View style={{ flex: 1 }}>

                <ScrollView style={{ flex: 1, width: '100%' }} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
                    {productData &&
                        <View style={{ flex: 1, width: '100%' }}>
                            <FlatList pagingEnabled horizontal data={imageList} renderItem={renderImage} style={{ width: '100%', height: Global.ScreenHeight * 0.3 }} />
                            <ImageView images={imageList} imageIndex={0} visible={imageViewerVisible} onRequestClose={() => setImageViewerVisible(false)} />
                            <View style={{ flex: 1, paddingBottom: 16 }}>
                                <View style={{ width: '100%', padding: 16, backgroundColor: 'white' }}>
                                    <TranslateText style={{ width: '100%', fontSize: 16, color: 'black', fontWeight: '400' }} text={productData.title} />
                                    {productData.price_info && <Text style={{ fontSize: 16, color: 'black', fontWeight: '400', marginTop: 16 }}>{`Giá từ: `}<Text style={{ fontSize: 20, fontWeight: '700' }}>{productData.price_info.origin_price}</Text>{` ${productData.currency}`}</Text>}
                                    {productData.sku_price_scale && <Text style={{ fontSize: 16, color: 'black', fontWeight: '400', marginTop: 16 }}>{`Giá: `}<Text style={{ fontSize: 20, fontWeight: '700' }}>{productData.sku_price_scale}</Text></Text>}
                                </View>
                                <View style={{ width: '100%', backgroundColor: 'white', marginTop: 16, padding: 16 }}>
                                    <TouchableOpacity onPress={() => setShowDetail((old) => !old)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Text style={{ fontSize: 20, fontWeight: '700', color: Global.MainColor }}>Chi tiết sản phẩm</Text>
                                        <Icon name={showDetail ? 'chevron-down' : 'chevron-right'} size={22} color={Global.MainColor} />
                                    </TouchableOpacity>
                                    {
                                        showDetail &&
                                        <View style={{ width: '100%', marginTop: 8 }}>
                                            {
                                                productData.product_props.map((prop, index) => {
                                                    const keys = Object.keys(prop)
                                                    for (const key of keys) {
                                                        return (
                                                            <TranslateText key={`${key}-${index}`} style={{ fontSize: 14, color: 'black', marginTop: 4, width: '100%' }} text={`${key}: ${prop[key]}`} />
                                                        )
                                                    }
                                                })
                                            }
                                        </View>
                                    }
                                </View>
                                {/* {productData.sku_props.map((prop, index) => {

                                    if (index !== (productData.sku_props.length - 1)) {
                                        return (
                                            <View key={prop.pid} style={{ marginTop: 16, padding: 16, backgroundColor: 'white' }}>
                                                <TranslateText style={{ fontSize: 18, color: 'black', marginBottom: 8, fontWeight: '700' }} text={prop.prop_name} />
                                                <FlatList
                                                    data={prop.values}
                                                    numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                                                    style={{ width: '100%' }}
                                                    renderItem={({ item: value, index: vIndex }) => {
                                                        return (
                                                            <TouchableOpacity onPress={() => {
                                                                const newProps = selectedProps
                                                                newProps[index] = { ...value, value, propString: `${prop.pid}:${value.vid}`, prop }
                                                                setSelectedProps(newProps)
                                                                setCartProps({})
                                                                setUpdateTimes(old => old + 1)
                                                            }} key={value.vid} style={{ borderWidth: selectedProps && selectedProps[index] && selectedProps[index].vid === value.vid ? 1 : 0, backgroundColor: selectedProps && selectedProps[index] && selectedProps[index].vid === value.vid ? '#ffcccc' : 'white', borderColor: Global.MainColor, flexDirection: 'row', alignItems: 'center', padding: 5, borderRadius: 5, width: Global.ScreenWidth * 0.5 - 32 }}>
                                                                <FastImage source={{ uri: value.imageUrl }} style={{ width: 30, height: 30 }} resizeMode='cover' />
                                                                <View style={{ marginHorizontal: 8, flex: 1 }}>
                                                                    <TranslateText style={{ fontSize: 14, fontWeight: '400', color: 'black' }} text={value.name} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    }}
                                                />
                                            </View>
                                        )
                                    } else {
                                        return (
                                            <View key={prop.pid} style={{ marginTop: 16, padding: 16, backgroundColor: 'white' }}>
                                                <TranslateText style={{ fontSize: 18, color: 'black', marginBottom: 8, fontWeight: '700' }} text={prop.prop_name} />
                                                {prop.values.map((value) => {
                                                    const prevProps = convertObjectToFlatString(selectedProps)
                                                    const currentProps = prevProps.length > 0 ? `${prevProps};${prop.pid}:${value.vid}` : `${prop.pid}:${value.vid}`
                                                    console.log({ currentProps })
                                                    const priceFilter = productData.skus.filter((s) => s.props_ids === currentProps)
                                                    if (priceFilter && priceFilter.length > 0) {
                                                        const price = priceFilter[0]

                                                        const hasSale = price.sale_price && price.origin_price !== price.sale_price
                                                        const option = cartProps[`${prop.pid}:${value.vid}`]
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
                                                                            const newOptions = cartProps
                                                                            newOptions[`${prop.pid}:${value.vid}`] = { ...option, ...price, title: prop.prop_name, value: value.name, price: hasSale ? price.sale_price : price.origin_price, quantity: parseInt(quantity.toString()) }
                                                                            setCartProps(newOptions)
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
                                    }

                                })} */}
                            </View>
                        </View>
                    }
                </ScrollView>

            </View>
            {productData &&
                <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#eeeeee', height: 60 + insets.bottom, paddingBottom: insets.bottom }}>
                    <TouchableOpacity onPress={onShowProps} style={{ borderRadius: 25, width: '100%', height: 50, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                    {/* <View style={{ flexDirection: 'row', width: '100%', paddingTop: 8, backgroundColor: '#eeeeee', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 16 }}>
                        <Text style={{ fontSize: 14, color: 'black', }}>{`Tổng số sản phẩm: `}
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>{totalQuantity}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, marginTop: 8, color: 'black' }}>{`Thành tiền: `}
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>{totalPrice.toFixed(2)}</Text>
                            <Text>{` ${productData.currency}`}</Text>
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onAddCart} style={{ borderRadius: 5, width: 100, height: '100%', backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Đặt hàng</Text>
                    </TouchableOpacity>
                </View> */}
                </View>
            }
        </View>
    )

}

export default ProductDetailView