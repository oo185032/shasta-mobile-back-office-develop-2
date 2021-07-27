import React, { useEffect, useState } from 'react';
import { store } from '../../redux/store';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Text, Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavigationItem, Modules } from '../../navigations/NavigationItem';
import { requestCameraPermission } from '../../utils/Permission';
import { Colors, Fonts, CustomDimensions } from '../../styles/Values';
import CommonStyle from '../../styles/CommonStyle';
import { userLogout } from '../../redux/actions/user';
import DataWedgeManager from '../../utils/DataWedgeManager';
import { DATA_WEDGE_STATE } from '../../redux/constants';
import * as realm from '../../database/realm';

const Dashboard = (props: StackScreenProps<any, any>) => {
  const { t, i18n } = useTranslation('dashboard');
  const [priceVerify, setPriceVerify] = useState(false);
  const [releasePrice, setReleasePrice] = useState(false);
  const [editItemAttributes, setEditItemAttributes] = useState(false);
  const [addNewItem, setAddNewItem] = useState(false);
  const [isAvailableZebraScanner, setIsAvailableZebraScanner] = useState(false);
  useEffect(() => {
    initilaizeLDFlags();
    checkDataWedge();
  }, []);

  const checkDataWedge = () => {
    if (isAvailableZebraScanner || props.storedDataWedgeFlag) return;
    const dw = new DataWedgeManager();
    dw.configCallback = configuratedZebraDataWedge;
    dw.register();
    dw.registerBroadcastReceiver();
    dw.determineVersion();
  };

  const configuratedZebraDataWedge = (result: boolean, dataWedgeManager: DataWedgeManager) => {
    setIsAvailableZebraScanner(result);
    store.dispatch({ type: DATA_WEDGE_STATE, payload: result });
    dataWedgeManager.unregister();
  };

  const initilaizeLDFlags = async () => {
    const priceVerifyFlag = await props.ldClient.boolVariation('price-verify', false);
    setPriceVerify(priceVerifyFlag);
    const releasePriceFlag = await props.ldClient.boolVariation('release-price', false);
    setReleasePrice(releasePriceFlag);
    const editItemAttributesFlag = await props.ldClient.boolVariation('edit-item-attributes', false);
    setEditItemAttributes(editItemAttributesFlag);
    const addNewItemFlag = await props.ldClient.boolVariation('add-new-item', false);
    setAddNewItem(addNewItemFlag);
  };

  const navigateToBarcodeScanner = (module: string) => {
    if (Platform.OS === 'android') {
      requestCameraPermission(() => {
        props.navigation.push(NavigationItem.BarcodeScanner, { module });
      });
    } else {
      props.navigation.push(NavigationItem.BarcodeScanner, { module });
    }
  };

  const logout = () => {
    realm.closeRealms();
    props.resetState();
    props.navigation.popToTop();
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <ScrollView>
        <View style={[CommonStyle.container, { paddingTop: 0 }]}>
          <View style={style.header}>
            <Text style={style.username}>{t('greeting')}</Text>
            <Icon name="logout" type="app_icon" color={Colors.secondary} size={25} onPress={() => logout()} />
          </View>
          <Text style={style.title}>{t('beginATask')}</Text>
          {releasePrice && (
            <Button
              title={t('releasePrice')}
              onPress={() => navigateToBarcodeScanner(Modules.ReleaseToPOS)}
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              icon={<Icon name="release-price-pos" type="app_icon" color={Colors.primary} size={24} />}
            />
          )}
          {priceVerify && (
            <Button
              title={t('priceVerify')}
              onPress={() => navigateToBarcodeScanner(Modules.PriceVerification)}
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              icon={<Icon name="price-verification" type="app_icon" color={Colors.primary} size={24} />}
            />
          )}
          {editItemAttributes && (
            <Button
              title={t('editItemAttributes')}
              onPress={() => navigateToBarcodeScanner(Modules.EditItem)}
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              icon={<Icon name="edit" type="app_icon" color={Colors.primary} size={24} />}
            />
          )}
          {addNewItem && (
            <Button
              title={t('addNewItem')}
              onPress={() => navigateToBarcodeScanner(Modules.NewItem)}
              buttonStyle={style.button}
              titleStyle={style.buttonTitle}
              icon={<Icon name="add-new-item" type="app_icon" color={Colors.primary} size={24} />}
            />
          )}
          <Button
            title={t('reduceToClear')}
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            icon={<Icon name="reduce-to-clear" type="app_icon" color={Colors.primary} size={24} />}
          />
          <Button
            title={t('batchRelease')}
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            icon={<Icon name="batch-release" type="app_icon" color={Colors.primary} size={24} />}
          />
          <Button
            title={t('stockCounts')}
            onPress={() => props.navigation.navigate(NavigationItem.CountDocumentList)}
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            icon={<Icon name="stock-counts" type="app_icon" color={Colors.primary} size={24} />}
          />
          <Button
            title={t('inventoryAdjustments')}
            onPress={() => props.navigation.navigate(NavigationItem.InventoryAdjustmentsList)}
            buttonStyle={style.button}
            titleStyle={style.buttonTitle}
            icon={<Icon name="inventory-adjustments" type="app_icon" color={Colors.primary} size={24} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Fonts.size.title,
    fontFamily: Fonts.family,
    lineHeight: 32,
    fontWeight: Fonts.weight,
    height: 48,
    textAlignVertical: 'center',
  },
  username: {
    color: Colors.secondary,
    fontFamily: Fonts.family,
    fontSize: Fonts.size.default,
    fontWeight: 'bold',
  },
  button: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
    borderColor: Colors.lightBorder,
    borderRadius: CustomDimensions.borderRadius,
    height: 56,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  buttonTitle: {
    paddingLeft: 9,
    color: Colors.text,
    fontFamily: Fonts.family,
    fontSize: Fonts.size.default,
    fontWeight: '400',
    lineHeight: 24,
  },
});

const mapStateToProps = (state: any, ownProps: any) => ({
  ldClient: state.launchDarkly.ldClient,
  storedDataWedgeFlag: state.dataWedge.isAvailableZebraScanner,
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  resetState: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
