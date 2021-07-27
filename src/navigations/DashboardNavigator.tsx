import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationItem } from '../navigations/NavigationItem';
import ItemDetails from '../components/ItemDetails';
import Dashboard from '../components/Dashboard';
import BarcodeScanner from '../components/BarcodeScanner';
import ManualScan from '../components/ManualScan';
import PriceSync from '../components/PriceSync';
import ScanFail from '../components/ScanFail';
import PriceVerify from '../components/PriceVerify';
import CountDocumentList from '../components/StockCounts';
import ChooseCountType from '../components/StockCounts/ChooseCountType';
import NameYourDocument from '../components/StockCounts/NameYourDocument';
import FreeCountList from '../components/StockCounts/FreeCountList';
import PriceOverride from '../components/PriceOverride';
import EditItem from '../components/EditItem';
import InventoryItemDetails from '../components/StockCounts/InventoryItemDetails';
import InventoryItemList from '../components/StockCounts/InventoryItemList';
import CountSummary from '../components/StockCounts/CountSummary';
import ShelfTag from '../components/ShelfTag';
import { PriceDetail } from '../redux/store/Item';
import AddNewItem from '../components/AddNewItem';
import { NewItem } from '../redux/store/itemAttributes';
import ItemAdded from '../components/ItemAdded';
import EditItemShelfTag from '../components/EditItem/EditItemShelfTag';
import InventoryAdjustmentsList from '../components/InventoryAdjustments/InventoryAdjustmentsList';
import AdjustmentItemDetails from '../components/InventoryAdjustments/AdjustmentItemDetails';

export type DashboardStackParamList = {
  Dashboard: undefined;
  BarcodeScanner: { priceSync?: boolean; module: string; barcode?: string };
  ManualScan: { module: string };
  ItemDetails: undefined;
  ScanFail: { module?: string };
  PriceSync: { itemCode: string; priceCode: string };
  PriceVerify: undefined;
  CountDocumentList: { module: string };
  ChooseCountType: undefined;
  NameYourDocument: undefined;
  FreeCountList: undefined;
  PriceOverride: undefined;
  EditItem: undefined;
  AddNewItem: undefined;
  InventoryItemDetails: { count?: number; itemCode?: string; shortDescription?: string };
  InventoryItemList: undefined;
  EditItemShelfTag: undefined;
  ShelfTag: { selectedPrice?: PriceDetail; newItem?: NewItem };
  ItemAdded: { item: NewItem };
  CountSummary: undefined;
  InventoryAdjustmentsList: undefined;
  AdjustmentItemDetails: undefined;
};

const DashboardStack = createStackNavigator<DashboardStackParamList>();
const DashboardNavigation: FunctionComponent = () => (
  <DashboardStack.Navigator headerMode="none">
    <DashboardStack.Screen name={NavigationItem.Dashboard} component={Dashboard} />
    <DashboardStack.Screen name={NavigationItem.BarcodeScanner} component={BarcodeScanner} />
    <DashboardStack.Screen name={NavigationItem.ManualScan} component={ManualScan} />
    <DashboardStack.Screen name={NavigationItem.ItemDetails} component={ItemDetails} />
    <DashboardStack.Screen name={NavigationItem.PriceSync} component={PriceSync} />
    <DashboardStack.Screen name={NavigationItem.ScanFail} component={ScanFail} />
    <DashboardStack.Screen name={NavigationItem.PriceVerify} component={PriceVerify} />
    <DashboardStack.Screen name={NavigationItem.CountDocumentList} component={CountDocumentList} />
    <DashboardStack.Screen name={NavigationItem.ChooseCountType} component={ChooseCountType} />
    <DashboardStack.Screen name={NavigationItem.NameYourDocument} component={NameYourDocument} />
    <DashboardStack.Screen name={NavigationItem.FreeCountList} component={FreeCountList} />
    <DashboardStack.Screen name={NavigationItem.PriceOverride} component={PriceOverride} />
    <DashboardStack.Screen name={NavigationItem.EditItem} component={EditItem} />
    <DashboardStack.Screen name={NavigationItem.InventoryItemDetails} component={InventoryItemDetails} />
    <DashboardStack.Screen name={NavigationItem.InventoryItemList} component={InventoryItemList} />
    <DashboardStack.Screen name={NavigationItem.ShelfTag} component={ShelfTag} />
    <DashboardStack.Screen name={NavigationItem.EditItemShelfTag} component={EditItemShelfTag} />
    <DashboardStack.Screen name={NavigationItem.AddNewItem} component={AddNewItem} />
    <DashboardStack.Screen name={NavigationItem.ItemAdded} component={ItemAdded} />
    <DashboardStack.Screen name={NavigationItem.CountSummary} component={CountSummary} />
    <DashboardStack.Screen name={NavigationItem.InventoryAdjustmentsList} component={InventoryAdjustmentsList} />
    <DashboardStack.Screen name={NavigationItem.AdjustmentItemDetails} component={AdjustmentItemDetails} />
  </DashboardStack.Navigator>
);

export default DashboardNavigation;
