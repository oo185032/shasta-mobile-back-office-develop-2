import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-elements';
import { searchItemDetails } from '../../redux/actions/item-details';
import { Modules, NavigationItem } from '../../navigations/NavigationItem';
import CommonStyle from '../../styles/CommonStyle';
import AppHeader from '../AppHeader';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import TextField from '../TextField';
import InProgress from '../InProgress';
import { RouteProp } from '@react-navigation/native';
import { DEFAULT_START_DATE, DEFAULT_END_DATE } from '../UpcomingPrices';
import { priceVerify, getItemAttributes } from '../../redux/actions/item-details';
import { getDepartments } from '../../redux/actions/departments';
import ScanResults from '../StockCounts/ScanResults';
import * as realmService from '../../database/realmService';
import { doc } from 'prettier';

type ManualScanNavigationProp = StackNavigationProp<DashboardStackParamList, 'ManualScan'>;
type ManualScanRouteProp = RouteProp<DashboardStackParamList, 'ManualScan'>;
type Props = {
  navigation: ManualScanNavigationProp;
  handleBarcodeSearch: any;
  route: ManualScanRouteProp;
  getPriceVerifyDetails: any;
  getEditableItem: any;
  getDepartmentsList: any;
};

const ManualScan = (props: Props) => {
  const { t, i18n } = useTranslation('manualScan');
  const [handlingRequest, setHandlingRequest] = useState(false);
  const [barcode, setBarcode] = useState('');
  const inputRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const { module: mod } = props.route.params;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  //Keeping focus just here and not in text field eliminates
  //keyboard to pop-up after navigation ends up on a page
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSearch = () => {
    setHandlingRequest(true);
    if (mod === Modules.PriceVerification) {
      searchForPriceVerify();
    } else if (mod === Modules.ReleaseToPOS) {
      searchForItemDetails();
    } else if (mod === Modules.EditItem || mod === Modules.NewItem) {
      searchForEditableItem();
    } else {
      //searchForScanResults();
      searchInventoryCacheItem();
    }
  };

  const searchForScanResults = () => {
    setHandlingRequest(false);
    setVisible(true);
  };

  const searchInventoryCacheItem = async () => {
    const response = await realmService.readItemDetails(barcode);
    setHandlingRequest(false);
    if (response != undefined) {
      props.navigation.push(NavigationItem.InventoryItemDetails, {
        count: response.count,
        itemCode: response.itemCode,
        shortDescription: response.shortDescription,
      });
    }
  };

  const searchForItemDetails = () => {
    props.handleBarcodeSearch(barcode).then((respData: any) => {
      setHandlingRequest(false);
      if (!respData.error) {
        props.navigation.push(NavigationItem.ItemDetails);
      } else {
        props.navigation.push(NavigationItem.ScanFail, { module: mod });
      }
    });
  };

  const searchForPriceVerify = () => {
    Promise.all([
      props.getPriceVerifyDetails(barcode),
      props.handleBarcodeSearch(barcode, DEFAULT_START_DATE, DEFAULT_END_DATE),
    ]).then((respData: any) => {
      const [_, itemDetails] = respData;
      setHandlingRequest(false);
      if (itemDetails || !itemDetails.error) {
        props.navigation.push(NavigationItem.PriceVerify);
      } else {
        props.navigation.push(NavigationItem.ScanFail, { module: Modules.PriceVerification });
      }
    });
  };

  const searchForEditableItem = () => {
    Promise.all([props.getDepartmentsList(), props.getEditableItem(barcode)]).then((reply: any) => {
      const [_, itemDetails] = reply;
      setHandlingRequest(false);
      if (!itemDetails.error) {
        if (mod === Modules.EditItem) {
          props.navigation.push(NavigationItem.EditItem);
        } else if (mod === Modules.NewItem) {
          props.navigation.push(NavigationItem.AddNewItem);
        }
      } else {
        props.navigation.push(NavigationItem.ScanFail, { module: mod });
      }
    });
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader
        title={t('title')}
        backNavigationRoute={
          mod == Modules.CountDocumentList ? NavigationItem.CountDocumentList : NavigationItem.DashboardStack
        }
      />
      {handlingRequest ? (
        <InProgress displayText={t('scanningProgress')} />
      ) : (
        <View style={CommonStyle.container}>
          <TextField
            inputRef={inputRef}
            label={t('enterBarcode')}
            placeholder={t('barcode')}
            wrapperStyle={{ marginTop: 10, marginBottom: 16 }}
            labelStyle={CommonStyle.inputLabel}
            keyboardType="number-pad"
            onChangeText={(text) => setBarcode(text)}
          />
          <View style={{ flex: 1 }} />
          <Button
            title={t('cancel')}
            buttonStyle={CommonStyle.secondaryButton}
            titleStyle={CommonStyle.secondaryTitle}
            onPress={() => props.navigation.goBack()}
          />
          <Button
            title={t('search')}
            buttonStyle={[CommonStyle.primaryButton, { marginTop: 8 }]}
            titleStyle={CommonStyle.primaryTitle}
            disabledStyle={CommonStyle.disabledPrimaryButton}
            disabledTitleStyle={CommonStyle.primaryTitle}
            disabled={barcode === ''}
            loading={handlingRequest}
            onPress={handleSearch}
          />
        </View>
      )}
      {visible && (
        <ScanResults
          showError={false}
          onClose={() => {
            setVisible(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalHeaderText: {
    flex: 1,
    fontSize: 19,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: '400',
  },
});

const mapStateToProps = (state: any, ownProps: any) => ({});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  handleBarcodeSearch: (barcode: string, startDate: Date, endDate: Date) =>
    dispatch(searchItemDetails(barcode, startDate, endDate)),
  getPriceVerifyDetails: (barcode: string, isCurrentPrice: boolean) =>
    dispatch(priceVerify(barcode, (isCurrentPrice = true))),
  getEditableItem: (barcode: string) => dispatch(getItemAttributes(barcode)),
  getDepartmentsList: () => dispatch(getDepartments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualScan);
