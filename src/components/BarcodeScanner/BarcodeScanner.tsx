import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import { connect } from 'react-redux';
import {Button, Icon, Text} from 'react-native-elements';
import {RNCamera, BarCodeReadEvent} from 'react-native-camera';
import { useTranslation } from 'react-i18next';
import BarcodeMask from 'react-native-barcode-mask';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { searchItemDetails, clearPriceReleased, priceVerify, getItemAttributes } from "../../redux/actions/item-details";
import CommonStyle from '../../styles/CommonStyle'
import {Modules, NavigationItem} from '../../navigations/NavigationItem';
import { Colors, CustomDimensions, Fonts } from '../../styles/Values';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import AppHeader from '../AppHeader';
import CustomAlert from '../CustomAlert';
import InProgress from '../InProgress';
import DataWedgeManager from '../../utils/DataWedgeManager';
import { DEFAULT_START_DATE, DEFAULT_END_DATE } from "../UpcomingPrices";
import { getDepartments } from "../../redux/actions/departments"

type BarcodeScannerNavigationProp = StackNavigationProp<DashboardStackParamList, 'BarcodeScanner'>;
type BarcodeScannerRouteProp = RouteProp<DashboardStackParamList, 'BarcodeScanner'>;

type Props = {
    navigation: BarcodeScannerNavigationProp;
    handleBarcodeSearch: any;
    getPriceVerifyDetails: any;
    getEditableItem: any;
    isPriceReleased: any;
    isAvailableZebraScanner: boolean;
    clearPriceReleaseToPOS: Function;
    route: BarcodeScannerRouteProp;
    getDepartmentsList: any;
};

const BarcodeScanner = (props: Props) => {
    const { t, i18n } = useTranslation('barcodeScanner');
    const { isPriceReleased, isAvailableZebraScanner, clearPriceReleaseToPOS } = props;
    const { module } = props.route.params;
    const [barcode, setBarcode] = useState("")
    const [priceReleased, setPriceReleased] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const dw = new DataWedgeManager();

    useEffect(() => {
        if (props.route.params != undefined) {
            if (props.route.params.priceSync) {
                setPriceReleased(true)
            }
            if (props.route.params.barcode) {
                handleReceivedBarcode(props.route.params.barcode);
                return;
            }
        }
        if (isPriceReleased) {
            setTimeout(() => {
                clearPriceReleaseToPOS()
            }, 6000)
        }
        if (isAvailableZebraScanner) {
            checkDataWedge();
        }
    }, [])

    const checkDataWedge = () => {
        dw.barcodeCallback = resultOfZebraScanner;
        dw.register();
        dw.startScan();
    }

    const resultOfZebraScanner = (result: string | null) => {
        if (result) {
            handleReceivedBarcode(result, dw);
        }
    }

    const onBarCodeRead = (scanResult: BarCodeReadEvent) => {
        if (scanResult.data != null) {
            handleReceivedBarcode(scanResult.data); 
        }
    }

    const handleReceivedBarcode = (data: string, dataWedgeManager?: DataWedgeManager) => {
        if (data != barcode) {
            setIsSearching(true)
            setBarcode(data); 
            selectRequest(data).then((respData : any) => {
                const result = Array.isArray(respData) ? respData[respData.length - 1] : respData;
                setIsSearching(false);
                if (!result.error) {
                    if (dataWedgeManager) {
                        dataWedgeManager.stopScan();
                        dataWedgeManager.unregister();
                    }
                    navigateToNextScreen();                    
                } else {
                    props.navigation.push(NavigationItem.ScanFail, { module });
                }
            })
        }
    }

    const selectRequest = (params: any) => {
        if (module === Modules.PriceVerification) {
            return Promise.all([props.getPriceVerifyDetails(params), props.handleBarcodeSearch(params)]);
        } else if (module === Modules.ReleaseToPOS) {
            return props.handleBarcodeSearch(params);
        } else if (module === Modules.EditItem || module === Modules.NewItem) {
            return Promise.all([props.getDepartmentsList(), props.getEditableItem(params)]);
        } else {
            return null;  
        }
    }

    const navigateToNextScreen = () => {
        var nextScreen: NavigationItem = NavigationItem.ItemDetails;
        if (module === Modules.PriceVerification) {
            nextScreen = NavigationItem.PriceVerify;
        } else if (module === Modules.EditItem) {
            nextScreen = NavigationItem.EditItem;
        } else if (module === Modules.NewItem) {
            nextScreen = NavigationItem.AddNewItem;
        }
        props.navigation.push(nextScreen, { module });
    }

    const getTitle = () => {
        const { module: mod } = props.route.params;
        if (mod) {
            switch(mod) {
                case Modules.ReleaseToPOS:
                    return t('scanItem')
                case Modules.PriceVerification:
                    return t('scanShelfTag')
            }
        }
        return t('scanItem')
    }

    return (
      <SafeAreaView style={CommonStyle.safeArea}>
          <AppHeader title={getTitle()} backNavigationRoute={NavigationItem.DashboardStack} />
            {
                isPriceReleased && 
                <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 10, marginRight: 10 }}>
                    <CustomAlert type='success' content={t('priceReleaseMessage')} autoClose={false} manualClose={() => { clearPriceReleaseToPOS() }}/>
                </View>
            }
          {
            isSearching ?
            <InProgress displayText={t('scanningProgress')} /> :
            <View style={{flex: 1}}>
                {
                    isAvailableZebraScanner ?
                        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: 80}}>
                            <Icon
                                name='scan'
                                type='app_icon' 
                                color={Colors.primary} 
                                size={64}
                            />
                            <Text style={styles.text}>Scan first item to begin</Text>
                        </View>
                    :   <RNCamera
                            ref={(cam) => {
                                this.camera = cam;
                            }}
                            style={styles.preview}
                            type={RNCamera.Constants.Type.back}
                            onBarCodeRead={onBarCodeRead.bind(this)}
                            androidCameraPermissionOptions={{
                                title: t('cameraPermissionTitle'),
                                message: t('cameraPermissionMessage'),
                                buttonPositive: t('cameraPermissionAccept'),
                                buttonNegative: t('cameraPermissionDecline'),
                            }}
                            flashMode={RNCamera.Constants.FlashMode.off}>
                            <BarcodeMask width={300} height={200} backgroundColor='#FFFFFF'/>
                        </RNCamera>
                }
                <View style={styles.absolute}>
                    <View style={{flex: 1}}/>
                    <Button
                        title={t('dashboardButtonTitle')}
                        buttonStyle={CommonStyle.secondaryButton}
                        titleStyle={CommonStyle.secondaryTitle}
                        onPress={() => props.navigation.push(NavigationItem.Dashboard)}
                    /> 
                    <Button
                        title={t('manualScanButtonTitle')}
                        buttonStyle={[CommonStyle.primaryButton, {marginTop: 8, marginBottom: CustomDimensions.contentPadding}]}
                        titleStyle={CommonStyle.primaryTitle}
                            onPress={() => props.navigation.push(NavigationItem.ManualScan, { module })}
                    />
                </View>
            </View>
          }
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        padding: CustomDimensions.contentPadding,
    },
    absolute: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0, 
        right: 0,
        padding: CustomDimensions.contentPadding
    }, 
    text: {
        color: Colors.text,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        paddingTop: 37,
        textAlign: 'center'
    }
});

const mapStateToProps = (state: any, ownProps: any) => ({
    isPriceReleased: state.itemDetails.isPriceReleased,
    isAvailableZebraScanner: state.dataWedge.isAvailableZebraScanner
})

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    handleBarcodeSearch: (barcode: string) => dispatch(searchItemDetails(barcode, DEFAULT_START_DATE, DEFAULT_END_DATE)),
    clearPriceReleaseToPOS: () => dispatch(clearPriceReleased()),
    getPriceVerifyDetails: (barcode: string, isCurrentPrice: boolean) => dispatch(priceVerify(barcode, isCurrentPrice=true)),
    getEditableItem: ( barcode: string ) => dispatch(getItemAttributes(barcode)),
    getDepartmentsList: () => dispatch(getDepartments())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BarcodeScanner)