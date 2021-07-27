import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { DashboardStackParamList } from "../../navigations/DashboardNavigator";
import { NavigationItem } from "../../navigations/NavigationItem";
import CommonStyle from "../../styles/CommonStyle";
import { BallIndicator } from "react-native-indicators";
import AppHeader from "../AppHeader";
import { Colors, Fonts } from "../../styles/Values";
import { Text } from "react-native-elements";
import { priceSynchronization } from "../../redux/actions/price-sync";
import { RouteProp, StackActions } from "@react-navigation/native";
type PriceSyncNavigationProp = StackNavigationProp<DashboardStackParamList, 'PriceSync'>;
type PriceSyncRouteProp = RouteProp<DashboardStackParamList, 'PriceSync'>;
  
type Props = {
    navigation: PriceSyncNavigationProp;
    route: PriceSyncRouteProp;
    handlePriceSynchronization: any;
};

const PriceSync = (props: Props) => {

    const [handlingRequest, setHandlingRequest] = useState(false)

    useEffect(() => {
        priceSynchronization();
      }, [])

    const priceSynchronization  = () => {
        const {itemCode, priceCode} = props.route.params
        setHandlingRequest(true);
        props.handlePriceSynchronization(itemCode, priceCode).then((respData : any) => {
            setHandlingRequest(false);

            props.navigation.dispatch(
                StackActions.replace(NavigationItem.BarcodeScanner, {
                    priceSync: (!respData.error),
                })
            );
        })
    }

    return (
        <SafeAreaView style={CommonStyle.safeArea}>
            <AppHeader title="Price Sync" hideBackButton={true}/>
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <BallIndicator color={Colors.primary} />
                    <Text style={styles.text}>
                        Price release in progress...
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper: {
        flexDirection: "column",
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'

    },
    text: {
        flex: 1, 
        paddingTop: 36, 
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        fontWeight: 'normal'
    }
});

const mapStateToProps = (state: any, ownProps: any) => ({
})

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    handlePriceSynchronization: (itemCode: string, priceCode: string) => dispatch(priceSynchronization(itemCode, priceCode))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceSync)