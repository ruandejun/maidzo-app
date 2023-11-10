import React, { useEffect, useState } from 'react'
import {
    Text,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'


const TranslateText = (props) => {
    const { text, showOriginal } = props
    const [textVi, setTextVi] = useState('')
    const currentLang = useSelector(state => state.cart.lang) ?? 'vi'

    useEffect(() => {
        const getText = async () => {
            if (text === '') {
                setTextVi('')
            } else {
                const result = await AsyncStorage.getItem(text)
                // console.log({result})
                if (!result || result.length === 0) {
                    let endpoint = `https://maidzo.vn/page/get_translate/?dest=vi&src=zh-cn&key=${text}`;

                    axios({
                        baseURL: endpoint,
                        method: 'get',
                        responseType: 'json'
                    }).then((response) => {
                        if (response && response.data && response.data.key) {
                            setTextVi(response.data.key)
                            AsyncStorage.setItem(text, response.data.key)
                                .then(() => { })
                                .catch((error) => console.log({ error }))
                        }
                    })
                        .catch((error) => {
                            // console.log({ error })
                        })
                } else {
                    setTextVi(result)
                }
            }
        }

        getText()
    }, [text])

    if(currentLang.toLowerCase() === 'cn') {
        return (
            <Text {...props}>{text}</Text>
        )
    }

    return (
        <Text {...props}>{`${showOriginal ? `${text} / ` : ''}${textVi}`}</Text>
    )
}

export default TranslateText