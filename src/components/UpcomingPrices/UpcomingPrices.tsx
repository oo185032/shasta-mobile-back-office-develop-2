import React, { useState } from 'react';
import { Text, Icon } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DateRange from '../DateRange';
import { PriceDetail } from '../../redux/store/Item';
import { dateFormatConverter, convertDateToUTC} from '../../utils/DateUtils';
import { capitalizeFirstLetter, formatPrice } from '../../utils/StringUtils';

import getConfig from '../../config';
import { Colors, CustomDimensions, Fonts } from '../../styles/Values';
let config = getConfig();
export const defaultStartDate = moment(new Date()).add(1, 'days').toDate()
export const defaultEndDate = moment(new Date()).add(1 + config.itemPricesOffsetEndDate, 'days').toDate()

const Price = (props: {item: PriceDetail, key: number}) => {
    const { t, i18n } = useTranslation('upcomingPrices');
    const { item } = props
    const endDateDisplay = item.endDate ? item.endDate : t('unlimited');
    const getDateInterval = () => {        
        var dateInterval = ""
        if (item.startDate) {
            dateInterval +=t('dateFormat',{date:convertDateToUTC(new Date(item.startDate))})
        }
        dateInterval += "-"
        if (item.endDate) {
            dateInterval +=t('dateFormat',{date:convertDateToUTC(new Date(item.endDate))})
        } else {
            dateInterval += t('unlimited')
        }
        return dateInterval
    } 
    return (
        <View style={{...styles.container}}>
            <View style={styles.left}>
                <View>
                    <Text style={styles.leftprice}>{ capitalizeFirstLetter(item.priceType, true)}</Text>
                </View>
                <View style={styles.dateContainerStyles}>
                    <Text style={styles.dateStyles}>{item.startDate}</Text>
                    <Text style={{ marginLeft: 5, marginRight: 5 }}> - </Text>
                    <Text style={styles.dateStyles}>{endDateDisplay}</Text>
                </View>
                {/* Per Jira 688 taking out the batch info since BGC will not have batch data 
                and bff taking this field out. Keeping this as commented out in case we need it in the future 
                and its in Figma design currently.
                <View>
                    <Text style={styles.batchName}>{item.batchName}</Text> 
                </View> 
                */}
            </View>
            <View style={styles.right}>
                <View>
                    <Text style={styles.rightprice}>
                    {Number(item.quantity) <= 1 ? 
                                `${t('priceConversion', { value: item.price })}` :
                                `${t('priceWithQuantity', {quantity:item.quantity, value: item.price })}`}
                    </Text>
                </View>
            </View> 
        </View>

    )
}

type Props = {
    itemsPrices: PriceDetail[];
    handleDateInterval: (startDate: Date, endDate: Date) => void
}

const UpcomingPrices = (props: Props) => {
    const { t, i18n } = useTranslation('upcomingPrices');
    const { itemsPrices } = props;
    const [startDate, setStartDate] = useState(defaultStartDate)
    const [endDate, setEndDate] = useState<Date>(defaultEndDate)
    const [isExpanded, setIsExpanded] = useState(false)
    
    const handleExpand = () => {        
        setIsExpanded(!isExpanded)
    }

    const onChangeDateInterval = (startDate: Date, endDate: Date) => {
        setStartDate(startDate)
        setEndDate(endDate)
        setIsExpanded(true)
        props.handleDateInterval(startDate, endDate)
    }



    return (
        <View>
            <View style={{ marginTop: 24, paddingLeft: 10, display: 'flex', flexDirection: 'row'}}>
                <Text style={{ fontSize: 16, fontFamily: Fonts.family, lineHeight: 24 }} onPress={handleExpand}>{t('upcomingPrices')}</Text>
                <View style={{marginTop: 5, marginLeft: 7}}>
                    <Icon type='ionicon' size={12} style={{ marginLeft: 5, textAlignVertical: 'bottom' }} 
                            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} onPress={handleExpand}/>
                </View>
            </View>
            <DateRange 
                style={{ padding: 10 }}
                startDate={startDate}
                endDate={endDate}
                onSelectDateRange={onChangeDateInterval}
                />
            {
                itemsPrices.length  
                ?   itemsPrices.slice(0, isExpanded ? itemsPrices.length : Math.min(2, itemsPrices.length)).map((item, index) => {
                        return(<Price item={item} key={index}/>)
                    })
                :   <View style={{ flex:1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={styles.noPrice}>
                            {t('noPrices')}
                        </Text> 
                    </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.lightBorder,
        backgroundColor: '#fff',
        borderRadius: CustomDimensions.borderRadius,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 8, 
        paddingTop: 8,
        fontFamily: Fonts.family,
        marginTop: 8
    },
    left: {
        display: 'flex',
        flex: 1
    },
    right: {
        display: 'flex',
        flex: 1,
    },
    leftprice: {
        fontSize: 14,
        lineHeight: 24,
        color: '#000',
        alignSelf: 'flex-start',
        fontWeight: '400',
        fontFamily: Fonts.family,
        paddingBottom: 4
    },
    rightprice: {
        alignSelf: 'flex-end',
        fontSize: 19,
        lineHeight: 32,
        color: '#000',
        fontWeight: '400',
        fontFamily: Fonts.family
    },
    dateContainerStyles: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateStyles: {
        backgroundColor: 'rgba(116, 116, 128, 0.08)',
        borderRadius: 2,
        paddingRight: 7,
        paddingLeft: 7,
        fontFamily: Fonts.family,
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 16,
    }, 
    itemQuantityContainer: {
        display: 'flex',
        alignItems: 'flex-end'
    }, 
    noEndDateStyle: {
        color: 'red'
    },
    batchName: {
        fontFamily: Fonts.family,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
        paddingTop: 4
    },
    noPrice: {
        fontSize: 12, 
        textAlignVertical: "center", 
        textAlign: "center", 
        paddingTop: 10, 
        fontFamily: Fonts.family
    }   
});

export default UpcomingPrices

