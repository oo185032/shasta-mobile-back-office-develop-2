import React, { useRef, useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import CommonStyle from '../../styles/CommonStyle';
import { NavigationItem } from '../../navigations/NavigationItem';
import AppHeader from '../AppHeader';
import ItemAvatar from '../ItemAvatar';
import TextField from '../TextField';
import InProgress from '../InProgress';
import PriceOverrideDateRange from '../PriceOverrideDateRange';
import Counter from '../Counter/Counter';
import { connect } from 'react-redux';
import { Item, ItemId } from '../../redux/store/Item';
import { OverridePrice } from '../../redux/store/itemPrices';
import { STATUS_ENUM } from '../../redux/constants';
import { createOverrideItemPrices } from '../../redux/actions/item-prices';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type PriceOverrideNavigationProp = StackNavigationProp<DashboardStackParamList, 'PriceOverride'>;
type Props = {
  items: Item[];
  createOverride: any;
  navigation: PriceOverrideNavigationProp;
};

const PriceOverride = (props: Props) => {
  const { t } = useTranslation(['priceOverride', 'common']);
  const { items } = props;
  const defaultDate = moment(new Date()).toDate();
  const defaultItemQuantity = 1;
  const defaultLabelQuantity = 1;
  const [priceOverride, setPriceOverride] = useState('');
  const inputRef = useRef(null);
  const [startDate, setStartDate] = useState<Date>(defaultDate);
  const [endDate, setEndDate] = useState<Date>(defaultDate);
  // Below will be used when we make actual calls
  const [itemCount, setItemCount] = useState(defaultItemQuantity);
  const [labelCount, setLabelCount] = useState(defaultLabelQuantity);
  const [handlingRequest, setHandlingRequest] = useState(false);

  /***********************************************************************
   * To pass data to ItemAvatar
   ***********************************************************************/
  let item: ItemId | undefined;

  if (items.length > 0) {
    item = items[0].itemId;
  }

  /***********************************************************************
   * Latest start date and end date, which are coming from child component
   ***********************************************************************/
  const onChangeDateInterval = (startDate: Date, endDate: Date) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  /***********************************************************************
   * User provided item quantity coming from child component
   ***********************************************************************/
  const itemQuantity = (itemCount: number) => {
    setItemCount(itemCount);
  };

  /***********************************************************************
   * User provided item quantity coming from child component
   ***********************************************************************/
  const labelQuantity = (labelCount: number) => {
    setLabelCount(labelCount);
  };

  /***********************************************************************
   * Skeleton method for now. It will be responsible calling API
   ***********************************************************************/
  const submitAndPrint = async () => {
    //Making sure that we have a valid item.
    if (!item) {
      //A generic error condition.
      //Will add an action when design team comes up with one
      return;
    }

    //Prep new price object for save operation
    let newPrice: OverridePrice = {
      item: {
        upc: item.itemUPC,
        shortDescription: items[0].shortDescription ? items[0].shortDescription.value : '',
        departmentId: item.departmentId,
      },
      itemPrice: {
        currency: 'USD', //TO DO... Need to find a way to get it from current locale
        price: Number(priceOverride),
        effectiveDate: startDate.toISOString() + '',
        endDate: endDate.toISOString() + '',
        status: STATUS_ENUM.ACTIVE,
        quantity: itemCount,
      },
    };

    setHandlingRequest(true);
    await props.createOverride(item.itemCode, newPrice).then((respData: any) => {
      setHandlingRequest(false);
      if (!respData.error) {
        //Success
        //Nothing for this condition yet.
      } else {
        //Failure
        //A generic error condition.
        //Will add an action when design team comes up with one
      }
    });
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={t('title')} backNavigationRoute={NavigationItem.PriceVerify} />
      {handlingRequest ? (
        <InProgress displayText={'saveProgress'} />
      ) : (
        <ScrollView>
          <View style={[CommonStyle.container, { paddingTop: 0 }]}>
            <ItemAvatar itemCode={item?.itemUPC} itemDesc={item?.itemDetails.description.shortDescription.value} />

            <TextField
              label={t('priceOverride') + t('currency')}
              inputRef={inputRef}
              placeholder={t('priceOverride') + t('currency')}
              wrapperStyle={{ marginTop: 1, marginBottom: 1 }}
              labelStyle={[CommonStyle.inputLabel, { paddingBottom: 0 }]}
              keyboardType="number-pad"
              onChangeText={(text) => setPriceOverride(text)}
            />
            <Counter
              containerMargin={{ marginTop: -5 }}
              defaultCounter={defaultItemQuantity}
              labelText={t('priceMultiple')}
              onSelectCounter={itemQuantity}
            />
            <PriceOverrideDateRange startDate={startDate} endDate={endDate} onSelectDateRange={onChangeDateInterval} />
            <Counter
              containerMargin={{ marginTop: -5 }}
              defaultCounter={defaultLabelQuantity}
              labelText={t('common:labelQuantity')}
              onSelectCounter={labelQuantity}
            />
          </View>
        </ScrollView>
      )}
      {!handlingRequest && (
        <View style={{ padding: 16 }}>
          <Button
            title={t('submitAndPrint')}
            buttonStyle={CommonStyle.primaryButton}
            titleStyle={CommonStyle.primaryTitle}
            disabledStyle={CommonStyle.disabledPrimaryButton}
            disabledTitleStyle={CommonStyle.primaryTitle}
            disabled={priceOverride === '' || itemCount < 0 || labelCount < 0}
            onPress={submitAndPrint}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state: any) => ({
  items: state.itemDetails.items,
});

const mapDispatchToProps = (dispatch: any) => ({
  createOverride: (itemCode: string, newPrice: OverridePrice) => dispatch(createOverrideItemPrices(itemCode, newPrice)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PriceOverride);
