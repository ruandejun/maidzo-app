import React from 'react'
import {
    View, Text, 
} from 'react-native'
import ActionSheet from "react-native-actions-sheet"

function ProductPropsSheet(props) {
    const { skus, sku_props } = props.payload

    return (
        <ActionSheet id={props.sheetId}>
            <View>
                <Text>Hello World</Text>
            </View>
        </ActionSheet>
    );
}

export default ProductPropsSheet;