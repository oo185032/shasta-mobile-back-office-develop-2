import React, {useEffect, useState}  from 'react';
import { Alert, BackHandler, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import {
    StyleSheet,
    View
} from "react-native";
import { useTranslation } from 'react-i18next';
import CustomAlert from '../CustomAlert';
import ItemAvatar from '../ItemAvatar';
import PromotionPrice from "../PromotionPrice";
import CurrentPrice from "../CurrentPrice";
import CommonStyle from "../../styles/CommonStyle";
import AppHeader from "../AppHeader";
import { NavigationItem } from '../../navigations/NavigationItem';
import { useFocusEffect } from '@react-navigation/native';
type Props = {
    items: any;
}

const ItemDetails = (props: Props) => {
    const { t, i18n } = useTranslation('itemDetails');
    const { items } = props;
    let item = {}
    if (items.length > 0) {
        item = items[0]['itemId']
    }
    const currentPrice = item.itemsPrices.filter((e: any) => (e.status === "CURRENT_AND_FUTURE" && e.priceCode === "demo-priceCode"))[0]
    const promotionPrice = item.itemsPrices.filter((e: any) => (e.status === "ON_HOLD" && e.priceCode === "demo-priceCode"))[0]
    const isPriceReleased = !(currentPrice && promotionPrice)

    const navigateToPriceSync  = (item: {[key: string]: any}) => {
        let price = item['itemsPrices'].find((i: {[key: string]: any}) => i['status'] == 'ON_HOLD')
        if (price == undefined) return
        props.navigation.push(NavigationItem.PriceSync, {itemCode: item['itemCode'], priceCode: price['priceCode']})
    }
    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            props.navigation.push(NavigationItem.DashboardStack) 
            return true;
          };

          BackHandler.addEventListener('hardwareBackPress', onBackPress);

          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    
    return (
        <SafeAreaView style={CommonStyle.safeArea}>
            <AppHeader title={t('title')} backNavigationRoute={NavigationItem.DashboardStack} />
            <View style={[CommonStyle.container, {paddingTop: 0}]}>
                { !isPriceReleased && <CustomAlert type='success' content={t('scanSuccess')} autoClose={true}/> }
                <ItemAvatar item={item}/>
                { !isPriceReleased && <PromotionPrice item={item} /> }
                <CurrentPrice item={item} />
                <View style={{ marginTop: 10 }}>
                    <Button
                        title={t('suspend')}
                        buttonStyle={CommonStyle.secondaryButton}
                        titleStyle={CommonStyle.secondaryTitle}
                        onPress={() => { props.navigation.navigate(NavigationItem.BarcodeScanner) }}
                    />
                    <Button
                        title={t('applyPrice')}
                        disabled={isPriceReleased}
                        buttonStyle={[CommonStyle.primaryButton, {marginTop: 10}]}
                        titleStyle={CommonStyle.primaryTitle}
                        onPress={() => navigateToPriceSync(item)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const mapStateToProps = (state: any, ownProps: any) => ({
    items: state.itemDetails.items
})
  
export default connect(
mapStateToProps
)(ItemDetails)

