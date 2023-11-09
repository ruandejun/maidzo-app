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
import ActionSheet from "react-native-actions-sheet"
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function ProductPropsSheet(props) {
    const { product, onAdd, insets } = props.payload
    const [imageViewerVisible, setImageViewerVisible] = useState(false)
    const [selectedProps, setSelectedProps] = useState(product.sku_props.map((item) => {}))
    const [quantity, setQuantity] = useState(1)

    const onClose = () => {
        SheetManager.hide('product-props')
    }

    const onChangePropValue = (value, index) => {
        if (index < selectedProps.length) {
            const currProp = selectedProps[index]
            const newProps = [...selectedProps]
            if (currProp && currProp.vid === value.vid) {
                newProps.splice(index, 1, {})
            } else {
                newProps.splice(index, 1, value)
            }

            setSelectedProps(newProps)
        }
        setQuantity(1)
    }

    const filterSkuId = selectedProps.map((value, index) => value && value.vid ? `${product.sku_props[index].pid}:${value.vid}` : '').join(';')
    const filterSkus = product.skus.filter((item) => item.props_ids.indexOf(filterSkuId) >= 0).sort((a, b) => parseFloat(a.sale_price.toString()) > parseFloat((b.sale_price.toString())))
    let selectedSku = (filterSkus && filterSkus.length === 1) ? filterSkus[0] : null

    let imageList = product.main_imgs.map((item) => ({ uri: item }))
    for (const prop of selectedProps) {
        if (prop && prop.imageUrl && prop.imageUrl.length > 0) {
            imageList = [{ uri: prop.imageUrl }]
        }
    }

    const onAddCart = () => {
        if (onAdd) {
            const options = {}
            for (const [index, prop] of selectedProps.entries()) {
                options[product.sku_props[index].prop_name] = prop.name
            }
            onAdd({ options, sku: selectedSku, image: imageList.length > 0 ? imageList[0]['uri'] : '', quantity })
        }
    }

    const readyToBuy = selectedSku && quantity > 0 && selectedSku && selectedSku.stock > 0

    return (
        <ActionSheet id={props.sheetId}>
            <View style={{ width: '100%', minHeight: Dimensions.get('screen').height * 0.75, maxHeight: Dimensions.get('screen').height * 0.9, backgroundColor: 'white', padding: 16, borderTopRightRadius: 8, borderTopLeftRadius: 8 }}>
                <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: '#eeeeee' }}>
                    <TouchableOpacity style={{ marginRight: 8 }} onPress={() => setImageViewerVisible((old) => !old)}>
                        <FastImage source={imageList.length > 0 ? imageList[0] : null} style={{ width: 100, height: 100, }} resizeMode='contain' />
                        <View style={{ position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#00000044', top: 2, right: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name='expand-alt' size={12} color='white' />
                        </View>
                    </TouchableOpacity>
                    <ImageView onRequestClose={() => setImageViewerVisible(false)} images={imageList} visible={imageViewerVisible} />
                    <View style={{ paddingHorizontal: 8, flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 15, fontWeight: '400', color: 'black' }}>
                            <Text style={{ fontSize: 12 }}>{`Giá: ¥`}</Text>
                            {
                                filterSkus && (filterSkus.length === 1 || (filterSkus.length > 1 && filterSkus[filterSkus.length - 1].sale_price === filterSkus[0].sale_price)) &&
                                <>
                                    <Text style={{ textDecorationLine: filterSkus[0].origin_price !== filterSkus[0].sale_price ? 'line-through' : 'none' }}>{filterSkus[0].origin_price}</Text>
                                    {filterSkus[0].origin_price !== filterSkus[0].sale_price && <Text style={{ textDecorationLine: 'none', color: Global.MainColor, fontWeight: '700' }}>{` ¥${filterSkus[0].sale_price}  `}</Text>}

                                </>
                            }
                            {
                                filterSkus && filterSkus.length > 1 && filterSkus[filterSkus.length - 1].sale_price !== filterSkus[0].sale_price &&
                                <Text style={{ color: Global.MainColor, fontWeight: '500' }}>{`${filterSkus[0].sale_price} - ¥${filterSkus[filterSkus.length - 1].sale_price}`}</Text>
                            }
                        </Text>
                        <Text style={{ fontSize: 13, color: '#555555', fontWeight: '400', marginTop: 5 }}>{`Kho: ${selectedSku ? selectedSku.stock : '--'}`}</Text>
                    </View>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {product.sku_props.map((prop, index) => {
                            const currSelectedProp = selectedProps[index]
                            return (
                                <View key={prop.pid} style={{ paddingVertical: 16, backgroundColor: 'white', width: '100%' }}>
                                    <TranslateText showOriginal style={{ fontSize: 12, color: 'black', marginBottom: 8, fontWeight: '600' }} text={prop.prop_name} />
                                    <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                                        {prop.values.map((value,) => {
                                            const filterCurrSkuId = selectedProps.map((v, i) => v && v.vid ? (index === i ? (`${product.sku_props[i].pid}:${value.vid}`) : `${product.sku_props[i].pid}:${v.vid}`) : (index === i ? (`${product.sku_props[i].pid}:${value.vid}`) : '')).join(';')
                                            const filterSkus = product.skus.filter((item) => item.props_ids.indexOf(filterCurrSkuId) >= 0 && item.stock > 0)
                                            console.log({filterSkus})
                                            const isAvailable = filterSkus && filterSkus.length > 0

                                            const isSelected = currSelectedProp && currSelectedProp.vid === value.vid
                                            return (
                                                <TouchableOpacity onPress={() => {
                                                    onChangePropValue(value, index)
                                                }} disabled={!isAvailable} key={value.vid}
                                                    style={{
                                                        opacity: isAvailable ? 1 : 0.5,
                                                        borderWidth: isSelected ? 1 : 0,
                                                        backgroundColor: isSelected ? '#ffcccc' : '#eeeeee',
                                                        borderColor: Global.MainColor, flexDirection: 'row', alignItems: 'center',
                                                        borderRadius: 5,
                                                        minHeight: 30,
                                                        paddingHorizontal: 5, paddingVertical: 3, margin: 3, maxWidth: Global.ScreenWidth - 56
                                                    }}>
                                                    {!!value.imageUrl && value.imageUrl.length > 0 && <FastImage source={{ uri: value.imageUrl }} style={{ width: 30, height: 30 }} resizeMode='cover' />}
                                                    <View style={{ marginHorizontal: 8, maxWidth: Global.ScreenWidth - 96 }}>
                                                        <TranslateText showOriginal style={{ fontSize: 11, fontWeight: '400', color: 'black' }} text={value.name} />
                                                    </View>
                                                    {!!isSelected &&
                                                        <View style={{ position: 'absolute', right: 2, top: 2 }}>
                                                            <Icon name='check-circle' solid color={Global.MainColor} size={10} />
                                                        </View>
                                                    }
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                            // if (index !== (product.sku_props.length - 1)) {
                            //     return (
                            //         <View key={prop.pid} style={{ marginTop: 16, padding: 16, backgroundColor: 'white' }}>
                            //             <TranslateText style={{ fontSize: 18, color: 'black', marginBottom: 8, fontWeight: '700' }} text={prop.prop_name} />
                            //             <FlatList
                            //                 data={prop.values}
                            //                 numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                            //                 style={{ width: '100%' }}
                            //                 renderItem={({ item: value, index: vIndex }) => {
                            //                     return (
                            //                         <TouchableOpacity onPress={() => {
                            //                             const newProps = selectedProps
                            //                             newProps[index] = { ...value, value, propString: `${prop.pid}:${value.vid}`, prop }
                            //                             setSelectedProps(newProps)
                            //                             setCartProps({})
                            //                             setUpdateTimes(old => old + 1)
                            //                         }} key={value.vid} style={{ borderWidth: selectedProps && selectedProps[index] && selectedProps[index].vid === value.vid ? 1 : 0, backgroundColor: selectedProps && selectedProps[index] && selectedProps[index].vid === value.vid ? '#ffcccc' : 'white', borderColor: Global.MainColor, flexDirection: 'row', alignItems: 'center', padding: 5, borderRadius: 5, width: Global.ScreenWidth * 0.5 - 32 }}>
                            //                             <FastImage source={{ uri: value.imageUrl }} style={{ width: 30, height: 30 }} resizeMode='cover' />
                            //                             <View style={{ marginHorizontal: 8, flex: 1 }}>
                            //                                 <TranslateText style={{ fontSize: 14, fontWeight: '400', color: 'black' }} text={value.name} />
                            //                             </View>
                            //                         </TouchableOpacity>
                            //                     )
                            //                 }}
                            //             />
                            //         </View>
                            //     )
                            // } else {
                            //     return (
                            //         <View key={prop.pid} style={{ marginTop: 16, padding: 16, backgroundColor: 'white' }}>
                            //             <TranslateText style={{ fontSize: 18, color: 'black', marginBottom: 8, fontWeight: '700' }} text={prop.prop_name} />
                            //             {prop.values.map((value) => {
                            //                 const prevProps = convertObjectToFlatString(selectedProps)
                            //                 const currentProps = prevProps.length > 0 ? `${prevProps};${prop.pid}:${value.vid}` : `${prop.pid}:${value.vid}`
                            //                 
                            //                 const priceFilter = product.skus.filter((s) => s.props_ids === currentProps)
                            //                 if (priceFilter && priceFilter.length > 0) {
                            //                     const price = priceFilter[0]

                            //                     const hasSale = price.sale_price && price.origin_price !== price.sale_price
                            //                     const option = cartProps[`${prop.pid}:${value.vid}`]
                            //                     return (
                            //                         <View key={value.vid} style={{ flexDirection: 'row', paddingVertical: 8 }}>
                            //                             <FastImage source={{ uri: value.imageUrl }} style={{ width: 60, height: 60 }} resizeMode='cover' />
                            //                             <View style={{ marginHorizontal: 8, flex: 1 }}>
                            //                                 <TranslateText style={{ fontSize: 16, fontWeight: '400', color: 'black' }} text={value.name} />
                            //                                 <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', marginTop: 5 }}>
                            //                                     <Text style={{ textDecorationLine: hasSale ? 'line-through' : 'none', fontSize: hasSale ? 14 : 16 }}>{price.origin_price}</Text>
                            //                                     {hasSale && <Text style={{ textDecorationLine: 'none', color: Global.MainColor, fontWeight: '700' }}>{`  ${price.sale_price}`}</Text>}
                            //                                     <Text>{` ${product.currency}`}</Text>
                            //                                 </Text>
                            //                             </View>
                            //                             <View style={{ alignItems: 'flex-end', width: 100 }}>
                            //                                 <Stepper
                            //                                     style={{ borderWidth: 1, borderColor: Global.MainColor, padding: 2, borderRadius: 4 }}
                            //                                     showSeparator={false}
                            //                                     valueStyle={{ flex: 1 }}
                            //                                     placeholder='0'
                            //                                     value={option ? option.quantity.toString() : '0'}
                            //                                     onChange={quantity => {
                            //                                         const newOptions = cartProps
                            //                                         newOptions[`${prop.pid}:${value.vid}`] = { ...option, ...price, title: prop.prop_name, value: value.name, price: hasSale ? price.sale_price : price.origin_price, quantity: parseInt(quantity.toString()) }
                            //                                         setCartProps(newOptions)
                            //                                         setUpdateTimes(old => old + 1)
                            //                                     }}
                            //                                     step={1}
                            //                                     min={0}
                            //                                     max={price.stock}
                            //                                     subButton={
                            //                                         <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                            //                                             <Text style={{ fontSize: 16, color: Global.MainColor }}>-</Text>
                            //                                         </View>
                            //                                     }
                            //                                     addButton={
                            //                                         <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                            //                                             <Text style={{ fontSize: 16, color: Global.MainColor }}>+</Text>
                            //                                         </View>
                            //                                     }
                            //                                 />
                            //                                 <Text style={{ fontSize: 10, color: '#333333', marginTop: 3 }}>{`Kho: ${price.stock}`}</Text>
                            //                             </View>
                            //                         </View>
                            //                     )
                            //                 } else {
                            //                     return null
                            //                 }

                            //             })}
                            //         </View>
                            //     )
                            // }

                        })}
                    </View>
                </ScrollView>

                <View style={{ width: '100%', paddingTop: 16, paddingBottom: 8, borderTopWidth: 0.5, borderTopColor: '#eeeeee' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ flex: 1, fontSize: 14, color: 'black' }}>Số lượng</Text>
                        <Stepper
                            style={{ borderWidth: 1, borderColor: Global.MainColor, padding: 2, borderRadius: 4 }}
                            showSeparator={false}
                            placeholder='0'
                            value={quantity.toString()}
                            onChange={value => setQuantity(parseInt(value.toString()))}
                            step={1}
                            min={1}
                            max={selectedSku ? selectedSku.stock : 0}
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
                    </View>
                    <TouchableOpacity disabled={!readyToBuy} onPress={onAddCart} style={{ borderRadius: 25, marginTop: 16, width: '100%', height: 50, backgroundColor: !readyToBuy ? '#dddddd' : Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Mua ngay</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name='times' size={18} color='black' />
                </TouchableOpacity>
            </View>
        </ActionSheet>
    );
}

export default ProductPropsSheet;