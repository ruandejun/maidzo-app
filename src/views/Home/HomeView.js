/**
 * @flow
 * @providesModule HomeMainView
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    AppState,
    TouchableOpacity,
    StatusBar,
    Linking,
    Keyboard,
    RefreshControl,
    Dimensions,
    SafeAreaView,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee', alignItems: 'center'
    },
    itemContainer: {
        flexDirection: 'row', height: 50, alignItems: 'center'
    },
    itemText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, flex: 1, marginLeft: 8, marginRight: 8
    },
    separator: {
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: '#CECECE'
    }
})

import { connect, useDispatch, useSelector } from 'react-redux';
import Global, { Media, contacts, decode, convertMoney } from 'src/Global';
import { getWalletBalance } from 'Wallets/redux/action'
import { getSettings } from 'Setting/redux/action'
import { getCart } from 'Carts/redux/action'
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ScrollView, TextInput, FlatList } from 'react-native-gesture-handler';
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet';
import ImagePicker from 'react-native-image-crop-picker'
import { Overlay } from 'teaset'
import ActionButton from 'react-native-action-button'
import { fetchApi } from 'actions/api'
import PopupView from 'components/PopupView'
import ProductItem from './components/ProductItem';
import remoteConfig from '@react-native-firebase/remote-config'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { updateLanguage } from '../Carts/redux/action';
import { useNavigation } from '@react-navigation/native';

// const templateKeywords = ['quần áo', 'giầy dép', 'điện thoại', 'công nghệ', 'mỹ phẩm', 'túi xách', 'giầy nữ', 'trang sức', 'gia dụng', 'nhà bếp']

const HomeView = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()

    const currentLang = useSelector(state => state.cart.lang) ?? 'vi'
    const [keyword, setKeyword] = useState('');
    const [pastedLink, setPastedLink] = useState('');
    const [currencies, setCurrencies] = useState([]);
    const [cnyConvert, setCnyConvert] = useState(3470);
    const [ifashionItems, setIfashionItems] = useState([]);
    const [flashSaleItems, setFlashSaleItems] = useState([]);
    const [quantitySaleItems, setQuantitySaleItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [templateKeywords, setTemplateKeywords] = useState([
        'quần áo',
        'giầy dép',
        'điện thoại',
        'công nghệ',
        'mỹ phẩm',
        'túi xách',
        'giầy nữ',
        'trang sức',
        'gia dụng',
        'nhà bếp',
    ]);

    const loadIFashion = () => {
        setLoading(true)
        fetchApi('get', 'page/get_item_ifashions/')
            .then((data) => {
                console.log(data)
                if (data) {
                    setIfashionItems(data)
                }

                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
    }

    const loadFlashSale = () => {
        fetchApi('get', 'page/get_item_flash_sale/')
            .then((data) => {
                console.log(data)
                if (data) {
                    setFlashSaleItems(data)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const loadQuanlitySale = () => {
        fetchApi('get', 'page/get_item_quantity_sale/')
            .then((data) => {
                console.log(data)
                if (data) {
                    setQuantitySaleItems(data)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const onLoadCurrency = () => {
        fetchApi('get', 'page/get_data_currency/', { order: 'asc', offset: 0, limit: 50 })
            .then((data) => {
                console.log(data)
                if (data && data.rows) {

                    setCurrencies(data.rows)
                    const cnyFilter = data.rows.filter((item) => item.currency === 'CNY')
                    if (cnyFilter && cnyFilter.length > 0) {
                        setCnyConvert(parseInt(cnyFilter[0].exchange_rate.toString()))
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const onRefresh = () => {
        loadIFashion()
        loadFlashSale()
        loadQuanlitySale()
        onLoadCurrency()

        try {
            const keywords = remoteConfig().getValue('template_keywords').asString()
            console.log({ keywords })

            if (keywords.length > 0)
                setTemplateKeywords(keywords.split(';'))
        } catch (error) {
            console.log({ error })
        }
    }

    let alertOverlayView = null
    const getNotify = () => {
        fetchApi('get', 'api/system_configure/template/thong-bao/')
            .then((data) => {
                if (data && data.body && data.body.length > 0) {
                    // let overlayView = (
                    //     <Overlay.PopView
                    //         modal={true}
                    //         ref={v => alertOverlayView = v}
                    //     >
                    //         <View style={{ width: Global.ScreenWidth, height: Global.ScreenHeight, backgroundColor: '#00000044', alignItems: 'center', justifyContent: 'center' }}>
                    //             <PopupView title={data.title} html={data.body} onClose={() => alertOverlayView && alertOverlayView.close()} />
                    //         </View>
                    //     </Overlay.PopView>
                    // );
                    // Overlay.show(overlayView)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        dispatch(getSettings());
        dispatch(getCart());

        StatusBar.setBarStyle('dark-content');

        getNotify();
        onRefresh();
    }, []);



    const onSearch = () => {
        if (keyword.length == 0) {
            return
        }

        var urlRegex = /(https?:\/\/[^\s]+)/

        if (urlRegex.test(keyword)) {
            navigation.navigate('ProductDetailView', { product: { click_url: keyword.trim() } })
        } else {
            navigation.navigate('HomeSearchView', { keyword: keyword })
        }
    }

    const openDetail = (item) => {
        navigation.navigate('ProductDetailView', { product: item })
    }

    const renderItem = ({ item, index }) => {
        return (
            <ProductItem {...item} convert={cnyConvert} onPress={() => openDetail(item)} />
        )
    }

    const searchWord = (word) => {
        navigation.navigate('HomeSearchView', { keyword: word })
    }

    const langs = ['VI', 'CN']

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row', height: 50 + insets.top, paddingTop: insets.top, alignItems: 'center', justifyContent: 'space-between',
                paddingHorizontal: 16, backgroundColor: 'white', width: '100%'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, height: 40, borderRadius: 20, backgroundColor: '#eeeeee', paddingHorizontal: 16 }}>
                    <Icon name="search" size={15} color="#7f7f7f" />
                    <TextInput
                        style={{ flex: 1, fontSize: 13, color: 'black', marginLeft: 8, lineHeight: 16 }}
                        underlineColorAndroid="#00000000"
                        placeholder={'Nhập link hoặc từ khoá tìm kiếm'}
                        placeholderTextColor="#7f7f7f"
                        value={keyword}
                        returnKeyType="search"
                        onChangeText={(text) => {
                            setKeyword(text)
                        }}
                        onSubmitEditing={onSearch}
                        onEndEditing={onSearch}
                        clearButtonMode="always"
                        autoCapitalize={false}
                        autoCorrect={false}
                    />
                </View>

                <View style={{ marginLeft: 8 }}>
                    <SegmentedControl
                        values={langs}
                        selectedIndex={langs.indexOf(currentLang.toUpperCase())}
                        onChange={(event) => {
                            dispatch(updateLanguage(langs[event.nativeEvent.selectedSegmentIndex].toLowerCase()))
                        }}
                        style={{ width: 80 }}
                        appearance='light'
                    />
                </View>
            </View>

            {!!templateKeywords && templateKeywords.length > 0 &&
                <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white', padding: 16, paddingVertical: 8, paddingTop: 3 }}>
                    {templateKeywords.map((keyword) => {
                        return (
                            <TouchableOpacity key={keyword} onPress={() => searchWord(keyword)} style={{ marginTop: 5, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dddddd', marginRight: 8 }}>
                                <Text style={{ fontSize: 12, color: 'black' }}>{keyword}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            }

            <ScrollView style={{ flex: 1, width: '100%' }} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
                <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>

                    <View style={{ flexDirection: 'row', padding: 16, width: '100%', backgroundColor: Global.MainColor }}>
                        <Text style={{ marginLeft: 8, fontSize: 20, color: 'white', fontWeight: '800', fontFamily: Global.FontName, }}>Ifashions</Text>
                    </View>
                    <FlatList
                        data={ifashionItems}
                        renderItem={renderItem}
                        numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                        showsHorizontalScrollIndicator={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        style={{ width: '100%', backgroundColor: '#eeeeee', marginTop: 8, paddingHorizontal: 8 }}
                        ItemSeparatorComponent={
                            () => <View style={{ width: 8, height: 8 }} />
                        }
                    />


                    <View style={{ flexDirection: 'row', padding: 16, width: '100%', marginTop: 16, backgroundColor: Global.MainColor }}>
                        <Text style={{ marginLeft: 8, fontSize: 20, color: 'white', fontWeight: '800', fontFamily: Global.FontName, }}>Flash sale</Text>
                    </View>

                    <FlatList
                        data={flashSaleItems}
                        renderItem={renderItem}
                        numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                        showsHorizontalScrollIndicator={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        style={{ width: '100%', backgroundColor: '#eeeeee', marginTop: 8, paddingHorizontal: 8 }}
                        ItemSeparatorComponent={
                            () => <View style={{ width: 8, height: 8 }} />
                        }
                    />

                    <View style={{ flexDirection: 'row', padding: 16, width: '100%', marginTop: 16, backgroundColor: Global.MainColor }}>
                        <Text style={{ marginLeft: 8, fontSize: 20, color: 'white', fontWeight: '800', fontFamily: Global.FontName, }}>Sale giới hạn</Text>
                    </View>

                    <FlatList
                        data={quantitySaleItems}
                        renderItem={renderItem}
                        numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        showsHorizontalScrollIndicator={false}
                        style={{ width: '100%', backgroundColor: '#eeeeee', marginTop: 8, paddingHorizontal: 8 }}
                        ItemSeparatorComponent={
                            () => <View style={{ width: 8, height: 8 }} />
                        }
                    />
                </View>
            </ScrollView>

        </View>
    )
}


export default HomeView
