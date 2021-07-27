import React from 'react';
import {
    StyleSheet,
    View
} from "react-native";

import { Text } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { getPaddedDate,convertDateToUTC } from '../../utils/DateUtils';
import { formatPrice } from '../../utils/StringUtils';

const CurrentPrice  = (props: any) => {
    const { t, i18n } = useTranslation('currentPrice');
    const { item } = props;
    const currentPrice = item.itemsPrices.filter((e: any) => e.status === "CURRENT_AND_FUTURE" && e.priceCode === "demo-priceCode")[0]
    const startDate = (currentPrice && currentPrice.startDate) ? convertDateToUTC( new Date(currentPrice.startDate)) : null;
    const endDate = (currentPrice && currentPrice.endDate) ? convertDateToUTC( new Date(currentPrice.endDate)) : null;
  
    return (
        <View style={styles.container} >   
            <View style={styles.heading} >  
                <Text style={styles.header}>
                    {t('header')}
                </Text>
            </View>
            <View style={styles.content} >
                <View> 
                    { currentPrice && currentPrice.price && <Text style={styles.price}>{t('priceConversion', { value: currentPrice.price })}</Text> }
                </View>
                <View style={styles.dateContainerStyles}>
                    { startDate && <Text style={styles.dateStyles}>{t('dateFormat', { date: startDate })}</Text> }
                    <Text style={{ marginLeft: 5, marginRight: 5 }}> - </Text>
                    { endDate && <Text style={styles.dateStyles}>{t('dateFormat', { date: endDate })}</Text> }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'rgba(60, 60, 67, 0.13)',
        padding: 0
    },
    heading: {
        backgroundColor: 'rgba(116, 116, 128, 0.08)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingTop: 5
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    header: {
        alignSelf: 'center',
        fontSize: 16,
        color: '#000',
        fontWeight: '900'
    },
    price: {
        color: 'rgba(60, 60, 67, 0.6)',
        fontSize: 19
    },
    dateContainerStyles: {
        display: 'flex',
        flexDirection: 'row',
    },
    dateStyles: {
        backgroundColor: 'rgba(116, 116, 128, 0.08)',
        borderRadius: 2,
        padding: 2,
        alignSelf: 'center',
        fontSize: 12
    }
})


export default CurrentPrice
