import React, { useState }  from 'react';
import {
    StyleSheet,
    View
} from "react-native";

import { Text, Image } from 'react-native-elements';
import { Fonts } from '../../styles/Values';

const ItemAvatar = (props: any) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { item, itemCode, itemDesc } = props;
    return (
        <View style={styles.container} >
            <View style={{ ...styles.left,  flex: isExpanded ? 4.5 : 2}}>
                {/* <Image
                    source={require("../../assets/icecream.png")}
                    style={{
                        width: isExpanded ? 122 : 48,
                        height: isExpanded ? 122 : 48,
                        borderRadius: isExpanded ? 16 : 5
                    }}
                    onPress={() => {setIsExpanded(!isExpanded)}}
                /> */}
            </View>
            <View style={{ ...styles.right, flex: isExpanded ? 7 : 8}}>
                <Text
                    h4
                    h4Style={styles.h4Style}
                >
                    { itemCode || item?.itemCode }
                </Text>
                <Text style={styles.textStyle}>{itemDesc || item?.itemDetails?.description?.shortDescription?.value}</Text>
            </View>        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 9,
        paddingBottom: 15,
    },
    left: {
        display: 'flex',
        alignItems: 'stretch'
    },
    right: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingTop: 3
    },
    h4Style: {
        fontWeight: "600",
        fontSize: 16,
        color: '#000',
        lineHeight: 24,
        fontFamily: Fonts.family
    },
    textStyle: {
        color: 'rgba(60, 60, 67, 0.6)',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: Fonts.family
    }
})


export default ItemAvatar
