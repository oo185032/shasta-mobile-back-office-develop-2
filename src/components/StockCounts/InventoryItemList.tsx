import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, SafeAreaView } from 'react-native';
import CommonStyle from '../../styles/CommonStyle';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Badge, Icon } from 'react-native-elements';
import AppHeader from '../AppHeader';
import { Colors } from '../../styles/Values';
import { NavigationItem } from '../../navigations/NavigationItem';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';

type InventoryItemListNavigationProp = StackNavigationProp<DashboardStackParamList, 'InventoryItemList'>;
type InventoryItemListrouteProp = RouteProp<DashboardStackParamList, 'InventoryItemList'>;
type Props = {
  navigation: InventoryItemListNavigationProp;
  route: InventoryItemListrouteProp;
};
const rowSwipeAnimatedValues = {};
const list_Data = [
  {
    key: '0',
    title: 'Pepsi, 0.33L',
    serialNumber: '653625362536256',
    value: '+1',
    totalCount: '13',
  },
];

interface Item {
  title: string;
  serialNumber: string;
  value: string;
  totalCount: string;
}

const InventoryItemList = (props: Props) => {
  const [listData, setListData] = useState(list_Data);
  list_Data.forEach((_, i) => {
    rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
  });
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };
  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };
  const onRowDidOpen = (rowKey) => {};
  const onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
    rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };
  const badgeColor = (value: string) => {
    let color = Colors.errorBorder;
    if (value === '+1') {
      color = Colors.successBorder;
    } else if (value === '-1') {
      color = Colors.primary;
    } else {
      color = Colors.secondary;
    }
    return color;
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableHighlight
      onPress={() => props.navigation.push(NavigationItem.InventoryItemDetails)}
      style={styles.rowFront}
      underlayColor={'#AAA'}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <View style={{ flex: 0.7 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.serialNumber}>{item.serialNumber}</Text>
          <Text style={styles.subText}>User ID</Text>
          <Text style={styles.subText}>Modified: 03/21 4:56 PM</Text>
        </View>
        <View style={{ flex: 0.3, alignItems: 'flex-end', paddingTop: 5 }}>
          <Icon type="ionicon" name="checkmark-circle-outline" size={24} color="green" />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: 5,
            }}>
            <Text style={styles.type}>EA</Text>
            <Text style={styles.totalCount}>{item.totalCount}</Text>
            <Badge
              value={item.value}
              textStyle={styles.badgeLabel}
              badgeStyle={[styles.badge, { backgroundColor: badgeColor(item.value) }]}
            />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}>
        <Animated.View
          style={[
            styles.trash,
            {
              transform: [
                {
                  scale: rowSwipeAnimatedValues[data.item.key].interpolate({
                    inputRange: [2, 75],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}>
          <Icon type="ionicon" name="trash" size={20} color={Colors.pink} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={'Item List'} backNavigationRoute={NavigationItem.CountDocumentList} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <Text style={styles.subHeaderTitle}>Produce Count</Text>
        <Icon name="pencil-outline" type="ionicon" color={Colors.black} size={15} />
      </View>
      <View style={styles.horizontalItem}>
        <View style={styles.row}>
          <Badge value="Free" badgeStyle={styles.badgeStyle} textStyle={styles.badgeText} />
          <Text style={styles.docId}>DocID 956678</Text>
        </View>
        <Text style={styles.lines}>1/1 Lines</Text>
      </View>
      <View style={styles.divider} />
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={styles.row}>
          <Icon name="filter-outline" type="ionicon" color={Colors.primary} size={20} />
          <Text style={styles.filter}>Search & Filter</Text>
        </View>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.9}
          onPress={() => props.navigation.push(NavigationItem.CountSummary)}>
          <Icon name="checkmark-circle-outline" type="ionicon" color={Colors.primary} size={20} />
          <Text style={styles.complete}>Complete</Text>
        </TouchableOpacity>
      </View>
      <SwipeListView
        style={{ paddingHorizontal: 15 }}
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        disableRightSwipe={true}
        rightOpenValue={-75}
        onRowDidOpen={onRowDidOpen}
        onSwipeValueChange={onSwipeValueChange}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  horizontalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  badgeStyle: {
    paddingHorizontal: 5,
    height: 22,
    borderRadius: 3,
    marginRight: 10,
    backgroundColor: Colors.primaryLight,
  },
  badgeText: {
    marginBottom: 2,
    color: Colors.black,
    fontSize: 12,
    lineHeight: 16,
  },
  lines: {
    fontSize: 13,
    lineHeight: 24,
    color: Colors.secondary,
    fontWeight: '400',
  },
  docId: {
    fontSize: 13,
    lineHeight: 24,
    color: Colors.secondary,
    fontWeight: '400',
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.secondary,
  },
  backTextWhite: {
    color: '#FFF',
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5565FD',
    position: 'absolute',
    right: 20,
    bottom: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderColor: Colors.lightBorder,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    right: 5,
  },
  trash: {
    height: 25,
    width: 25,
  },
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 15,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.29)',
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  complete: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.black,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 24,
    flex: 0.33,
    fontWeight: '400',
    color: Colors.secondary,
  },
  countType: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
    fontSize: 12,
    lineHeight: 16,
    backgroundColor: Colors.primaryLight,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  serialNumber: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.secondary,
  },
  subText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.secondary,
  },
  totalCount: {
    fontSize: 19,
    marginTop: 3,
    fontWeight: '400',
    paddingHorizontal: 5,
    color: Colors.black,
  },
  type: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.black,
  },
  subHeaderTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.black,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  filter: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.black,
  },
  badgeLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    paddingBottom: 0,
  },
});
export default InventoryItemList;
