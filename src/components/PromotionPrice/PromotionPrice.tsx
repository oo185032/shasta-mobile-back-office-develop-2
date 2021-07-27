import React from 'react';
import {
    StyleSheet,
    View
} from "react-native";
import { Text } from 'react-native-elements';
import { Icon, Image } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { getPaddedDate, convertDateToUTC } from "../../utils/DateUtils";
import { formatPrice, formatPercent } from '../../utils/StringUtils';

const getDiscountPercentage = (currPrice: number, newPrice: number): number => {
    return (((currPrice - newPrice) / currPrice) * -1)
}

const PromotionPrice  = (props: any) => {
    const { t, i18n } = useTranslation('promotionPrice');
    const { item } = props;
    const currentPrice = item.itemsPrices.filter((e: any) => (e.status === "CURRENT_AND_FUTURE" && e.priceCode === "demo-priceCode"))[0]
    const promotionPrice = item.itemsPrices.filter((e: any) => (e.status === "ON_HOLD" && e.priceCode === "demo-priceCode"))[0]
    const startDate = convertDateToUTC(new Date(promotionPrice.startDate))
    const endDate = convertDateToUTC(new Date(promotionPrice.endDate))
    const discountPercentage = getDiscountPercentage(currentPrice.price, promotionPrice.price);
    return (
        <View style={styles.container} >
            <View style={styles.left}>
                <Text style={styles.promotionPrice}>{t('promotionPrice')}</Text>
                <View style={styles.dateContainerStyles}>
                    <Text style={styles.dateStyles}>{t('dateFormat', { date: startDate })}</Text>
                    <Text style={{ marginLeft: 5, marginRight: 5 }}> - </Text>
                    <Text style={styles.dateStyles}>{t('dateFormat', { date: endDate })}</Text>
                </View>
                <View style={styles.daysInfo}>
                    <Image
                        source={require("../../assets/caln.png")}
                        style={{
                            width: 16,
                            height: 16,
                            marginRight: 10,
                            alignSelf: 'center'
                        }}
                    />
                    <Text style={styles.days}>{promotionPrice.batchName}</Text>

                </View>
            </View>
            <View style={styles.right}>
                <Text style={styles.price}> {t('priceConversion', { value: promotionPrice.price })}</Text>
                <Text style={discountPercentage < 0 ? styles.discountPercentageReduction : styles.discountPercentageIncrease}>{formatPercent(discountPercentage, true)}</Text>
                <Text style={styles.batchInfo}>{`${t('batch')} ${promotionPrice.batchId}`}</Text>
            </View>        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        marginBottom: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#5565FD',
        borderRadius: 10,
        padding: 15
    },
    left: {
        display: 'flex',
    },
    right: {
        display: 'flex',
    },
    promotionPrice: {
        fontSize: 16,
        color: '#000',
        fontWeight: '900'
    },
    dateContainerStyles: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8
    },
    dateStyles: {
        backgroundColor: 'rgba(116, 116, 128, 0.08)',
        borderRadius: 2,
        padding: 2,
        fontSize: 12
    },
    batchInfo: {
        alignSelf: 'flex-end',
        fontSize: 14,
        fontWeight: '400'
    },
    price: {
        alignSelf: 'flex-end',
        fontSize: 19,
        marginBottom: 5
    },
    discountPercentageReduction: {
        fontSize: 12,
        color: '#469F3D',
        alignSelf: 'flex-end',
        marginBottom: 8
    },
    discountPercentageIncrease: {
        fontSize: 12,
        color: '#EE586B',
        alignSelf: 'flex-end',
        marginBottom: 8
    },
    daysInfo: {
        display: 'flex',
        flexDirection: 'row'
    },
    days: {
        textTransform: 'uppercase',
        fontSize: 14,
        alignSelf: 'center'
    }
})


export default PromotionPrice
