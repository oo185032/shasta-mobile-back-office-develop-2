import React, { useState } from 'react';
import PriceDetails from '../PriceDetails';
import { SafeAreaView, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { ScrollView, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import CommonStyle from '../../styles/CommonStyle';
import AppHeader from '../AppHeader';
import ItemAvatar from '../ItemAvatar';
import AdditonalDetails from '../AdditonalDetails';
import UpcomingPrices from '../UpcomingPrices';
import { Modules, NavigationItem } from '../../navigations/NavigationItem';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import { searchItemDetails } from '../../redux/actions/item-details';
import { Item, ItemId, PriceDetail } from '../../redux/store/Item';
import { useFocusEffect } from '@react-navigation/native';
import DataWedgeManager from '../../utils/DataWedgeManager';
import { useEffect } from 'react';

type PriceVerifyNavigationProp = StackNavigationProp<DashboardStackParamList, 'PriceVerify'>;
type Props = {
  items: Item[];
  navigation: PriceVerifyNavigationProp;
  reloadItemPrices: (barcode: string, startDate: Date, endDate: Date) => void;
  priceVerifyItems: Item[];
  storedDataWedgeFlag: boolean;
};

const PriceVerify = (props: Props) => {
  const { t } = useTranslation(['priceVerify', 'common']);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const { items, priceVerifyItems } = props;

  let item: ItemId | undefined = undefined;
  let priceItems: ItemId | undefined = undefined;
  const dw = new DataWedgeManager();

  if (items.length > 0) {
    item = items[0].itemId;
  }

  if (priceVerifyItems.length > 0) {
    priceItems = priceVerifyItems[0].itemId;
  }
  const handleSelection = (selection: any) => {
    setSelectedPrice(selection);
  };

  const reloadItem = (startDate: Date, endDate: Date) => {
    const upc = item!.itemUPC;

    props.reloadItemPrices(upc, startDate, endDate);
  };

  useEffect(() => {
    if (props.storedDataWedgeFlag) {
      checkDataWedge();
    }
  }, []);

  const checkDataWedge = () => {
    dw.barcodeCallback = resultOfZebraScanner;
    dw.register();
    dw.switchHardwareScan();
  };

  const resultOfZebraScanner = (result: string | null) => {
    if (result) {
      dw.switchHardwareScan();
      dw.unregister();
      props.navigation.push(NavigationItem.BarcodeScanner, { module: Modules.PriceVerification, barcode: result });
    }
  };

  const navigateToShelfTag = () => {
    if (!priceItems) return;
    const selectedPriceDetails = priceItems.itemsPrices.find((price: PriceDetail) => price.priceCode === selectedPrice);
    if (selectedPriceDetails) {
      props.navigation.push(NavigationItem.ShelfTag, { selectedPrice: selectedPriceDetails });
    }
  };

  /********************************************
   * Brings user back to dashboard
   ********************************************/
  const backAction = () => {
    props.navigation.push(NavigationItem.Dashboard);
    return true;
  };

  /****************************************************
   * Considers just the focused page
   * So, actions in here won't be run for child pages
   ****************************************************/
  useFocusEffect(
    //Action to take when user clicks on device back button
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={t('title')} backNavigationRoute={NavigationItem.DashboardStack} showEditIcon={true} />
      <ScrollView>
        <View style={{ ...CommonStyle.container, paddingTop: 0 }}>
          {/* <ItemAvatar url="../../assets/icecream.png" itemCode='Pistachio Ice cream, 1 PT.' itemDesc='001-993-321' /> */}
          <ItemAvatar itemCode={item?.itemUPC} itemDesc={item?.itemDetails.description.shortDescription.value} />
          {priceItems &&
            priceItems.itemsPrices.map((item, index) => {
              return (
                <PriceDetails
                  key={index}
                  selected={selectedPrice}
                  onPressFunction={handleSelection}
                  type={item.priceType}
                  priceCode={item.priceCode}
                  headerText={`${item.priceType} ${t('common:price')}`}
                  priceText={
                    Number(item.quantity) <= 1
                      ? `${t('common:priceConversion', { value: item.price })}`
                      : `${t('common:priceWithQuantity', { quantity: item.quantity, value: item.price })}`
                  }
                  //Keeping quantityText in here just a placeholder.
                  //Per our conversation with Nicole on June 28...
                  //Currently we have item.quantity but that is not enough to calculate the full quantityText
                  //Also BGC pilot will not use that field.
                  //When we have actual data we can uncomment it!
                  //quantityText='$0.21 per oz'
                  startDate={item.startDate}
                  endDate={item.endDate}
                  isLoyalty={item.priceType === 'LOYALTY'}
                  index={index}
                  override={item.override}
                />
              );
            })}
          <AdditonalDetails />
          {item && <UpcomingPrices itemsPrices={item.itemsPrices} handleDateInterval={reloadItem} />}
        </View>
      </ScrollView>
      <View style={{ padding: 16, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Button
            title={t('priceOverride')}
            buttonStyle={CommonStyle.secondaryTwoUpButton}
            titleStyle={CommonStyle.secondaryTitle}
            onPress={() => props.navigation.push(NavigationItem.PriceOverride)}
          />
        </View>
        <View style={{ paddingLeft: 8, flex: 1 }}>
          <Button
            title={t('requestShelfTag')}
            buttonStyle={[CommonStyle.primaryTwoUpButton]}
            titleStyle={CommonStyle.primaryTitle}
            disabledStyle={CommonStyle.disabledPrimaryButton}
            disabledTitleStyle={CommonStyle.primaryTitle}
            onPress={() => navigateToShelfTag()}
            disabled={selectedPrice === null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: any) => ({
  items: state.itemDetails.items,
  priceVerifyItems: state.priceVerify.items,
  storedDataWedgeFlag: state.dataWedge.isAvailableZebraScanner,
});

const mapDispatchToProps = (dispatch: any) => ({
  reloadItemPrices: (barcode: string, startDate: Date, endDate: Date) =>
    dispatch(searchItemDetails(barcode, startDate, endDate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PriceVerify);
