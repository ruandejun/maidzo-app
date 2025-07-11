import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Pressable,
    TouchableOpacity
} from 'react-native'
import axios from 'axios'
import FastImage from 'react-native-fast-image'
import { convertMoney } from 'src/Global'
import TranslateText from 'components/TranslateText'

const ITEM_SIZE = Dimensions.get('screen').width > 700 ? (Dimensions.get('screen').width * 0.25 - 12) : (Dimensions.get('screen').width * 0.5 - 12)

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white', width: ITEM_SIZE, height: ITEM_SIZE + 100, borderRadius: 5,
        shadowColor: '#444444',
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    }
})

const ProductItem = (props) => {
    const { title, pict_url, convert, zk_final_price, reserve_price, onPress } = props

    const image_url = pict_url.indexOf('http') === 0 ? pict_url : ('https:' + pict_url)

    return (
        <TouchableOpacity onPress={() => onPress && onPress()} style={styles.container}>
            <FastImage source={{ uri: image_url }} style={{ width: ITEM_SIZE, height: ITEM_SIZE, borderTopLeftRadius: 5, borderTopRightRadius: 5, overflow: 'hidden' }} />
            <View style={{ flex: 1, paddingHorizontal: 5, justifyContent: 'space-between' }}>
                <TranslateText numberOfLines={4} style={{ fontSize: 12, color: 'black', marginTop: 5, fontWeight: '500' }} text={title}/>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: 'black', fontWeight: '700' }}>{convertMoney(zk_final_price * convert, true)}</Text>
                    {reserve_price > zk_final_price && <Text style={{ fontSize: 12, color: '#444444', textDecorationLine: 'line-through', marginLeft: 5 }}>{convertMoney(reserve_price * convert, true)}</Text>}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProductItem