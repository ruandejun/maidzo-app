import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import FastImage from 'react-native-fast-image'
import {convertMoney} from 'src/Global'

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
    const { title, pict_url, convert, zk_final_price, reserve_price } = props
    const [titleVi, setTitleVi] = useState('')

    useEffect(() => {
        let key = "f9cf512e88244c1e8de41a2d91885652";
        let endpoint = "https://api.cognitive.microsofttranslator.com";

        let location = "southeastasia";

        axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                // location required if you're using a multi-service or regional (not global) resource.
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': 'zh',
                'to': 'vi'
            },
            data: [{
                'text': title
            }],
            responseType: 'json'
        }).then((response) => {
            if(response && response.data && response.data.length > 0 && response.data[0].translations && response.data[0].translations.length > 0) {
                setTitleVi(response.data[0].translations[0].text)
            }
        })
            .catch((error) => {
                console.log({ error })
            })
    }, [])


    return (
        <View style={styles.container}>
            <FastImage source={{uri: 'https:' + pict_url}} style={{width: ITEM_SIZE, height: ITEM_SIZE, borderTopLeftRadius: 5, borderTopRightRadius: 5, overflow: 'hidden'}} />
            <View style={{flex: 1, paddingHorizontal: 5}}>
            <Text numberOfLines={4} style={{fontSize: 12, color: 'black', marginTop: 5, fontWeight: '500'}}>{titleVi}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                <Text style={{fontSize: 14, color: 'black', fontWeight: '700'}}>{convertMoney(zk_final_price * convert)}</Text>
                {reserve_price > zk_final_price && <Text style={{fontSize: 12, color: '#444444', textDecorationLine: 'line-through', marginLeft: 5}}>{convertMoney(reserve_price * convert)}</Text>}
            </View>
            </View>
        </View>
    )
}

export default ProductItem