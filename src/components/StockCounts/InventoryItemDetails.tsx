import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Icon, Badge } from 'react-native-elements';
import CommonStyle from '../../styles/CommonStyle';
import { Colors } from '../../styles/Values';
import AppHeader from '../AppHeader';
import { NavigationItem } from '../../navigations/NavigationItem';
import ItemAvatar from '../ItemAvatar';
import TextField from '../TextField';
import DropdownMenu from '../Dropdown';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
type InventoryItemDetailsNavigationProp = StackNavigationProp<DashboardStackParamList, 'InventoryItemDetails'>;
type InventoryItemDetailscRouteProp = RouteProp<DashboardStackParamList, 'InventoryItemDetails'>;

const width = Dimensions.get('window').width;
const boxWidth = width - 60;

type Props = {
  navigation: InventoryItemDetailsNavigationProp;
  route: InventoryItemDetailscRouteProp;
};

const InventoryItemDetails = (props: Props) => {
  const { count, itemCode, shortDescription } = props.route.params;
  const [itemData, setItemData] = useState({ count, itemCode, shortDescription });
  const [bohValue, setBohValue] = useState(12);
  const [added, setAddValue] = useState('');
  const [total, setTotal] = useState('');
  const [badgeValue, setBadgeValue] = useState('');
  const [isAdditionalDetailsExpanded, setIsAdditionalDetailsExpanded] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleExpand = () => {
    setIsAdditionalDetailsExpanded(!isAdditionalDetailsExpanded);
  };

  const onIncrement = () => {
    if (added.length > 0) {
      let totalBoh;
      if (total.length > 0) {
        totalBoh = parseInt(total) + parseInt(added);
        setTotal(totalBoh.toString());
        const difference = bohValue > totalBoh ? bohValue - totalBoh : totalBoh - bohValue;
        const finalValue = totalBoh < bohValue ? `-${difference}` : `+${difference}`;
        setBadgeValue(finalValue);
      } else {
        totalBoh = bohValue + parseInt(added);
        setBohValue(totalBoh);
      }
    }
  };

  const onChangeTotal = (text) => {
    if (text.length > 0) {
      setTotal(text);
      const difference = bohValue > parseInt(text) ? bohValue - parseInt(text) : parseInt(text) - bohValue;
      const finalValue = bohValue > parseInt(text) ? `-${difference}` : `+${difference}`;
      setBadgeValue(finalValue);
    }
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={'Item Details'} backNavigationRoute={NavigationItem.InventoryItemList} />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.subHeader}>Produce Count</Text>
      </View>
      <View style={CommonStyle.container}>
        <ItemAvatar url="../../assets/icecream.png" itemCode={itemData.shortDescription} itemDesc={itemData.itemCode} />

        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              width: boxWidth / 2,
              marginRight: 15,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={{ width: boxWidth / 4 - 4 }}>
              <Text style={styles.label}>Package</Text>
              <DropdownMenu
                data={[
                  { label: 'EA', value: 'ea' },
                  { label: 'CA', value: 'ca' },
                  { label: 'PL', value: 'pl' },
                  { label: 'BG', value: 'bg' },
                  { label: 'TB', value: 'tb' },
                ]}
                defaultValue={'ea'}
                onSelected={(value) => {}}
              />
            </View>
            <View style={{ width: boxWidth / 4 - 5 }}>
              <Text style={styles.label}>Total</Text>
              <TextField
                maxLength={6}
                inputRef={inputRef}
                keyboardType={'number-pad'}
                inputWidth={boxWidth / 4 + 10}
                wrapperStyle={{ width: boxWidth / 4 }}
                onSubmitEditing={(event) => onChangeTotal(event.nativeEvent.text)}
              />
            </View>
          </View>
          <View
            style={{
              width: boxWidth / 2,
              marginLeft: 15,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={{ width: boxWidth / 4 - 5 }}>
              <Text style={styles.label}>Increment</Text>
              <TextField
                maxLength={6}
                keyboardType={'number-pad'}
                inputWidth={boxWidth / 4 + 10}
                wrapperStyle={{ width: boxWidth / 4 }}
                onChangeText={(text) => setAddValue(text)}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onIncrement()}
              style={[
                styles.box,
                {
                  width: boxWidth / 4 - 5,
                  alignSelf: 'flex-end',
                  marginBottom: 8,
                },
                { justifyContent: 'center', alignItems: 'center' },
              ]}>
              <Text style={styles.add}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            paddingLeft: 10,
            display: 'flex',
            flexDirection: 'row',
          }}>
          <Text style={{ fontSize: 16 }} onPress={handleExpand}>
            Item Details{' '}
            <Icon
              type="ionicon"
              size={16}
              style={{ marginLeft: 5, textAlignVertical: 'bottom' }}
              name={isAdditionalDetailsExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            />
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            marginTop: 10,
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderRadius: 10,
            justifyContent: 'space-between',
            borderColor: '#ccc',
            borderWidth: 2,
          }}>
          <View style={{ alignSelf: 'flex-start', display: 'flex' }}>
            <Text style={styles.itemTitle}>BOH</Text>
            <Text style={styles.itemTitle}>Supplier</Text>
            {isAdditionalDetailsExpanded && (
              <>
                <Text style={styles.itemTitle}>SKU</Text>
                <Text style={styles.itemTitle}>Item Cost</Text>
                <Text style={styles.itemTitle}>Extended Cost</Text>
              </>
            )}
          </View>
          <View style={{ alignSelf: 'flex-end', display: 'flex' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
              }}>
              <Text style={styles.itemValue}>{bohValue}</Text>
              {total.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="next" type="app_icon" color={Colors.black} size={24} />
                  <Text style={styles.newTotal}>{total}</Text>
                  {parseInt(badgeValue) !== 0 && (
                    <Badge
                      value={badgeValue}
                      badgeStyle={[
                        styles.badge,
                        {
                          backgroundColor: bohValue > parseInt(total) ? Colors.orange : Colors.successBorder,
                        },
                      ]}
                      textStyle={styles.badgeValue}
                    />
                  )}
                </View>
              )}
            </View>
            <Text style={styles.itemValue}>{''}</Text>
            {isAdditionalDetailsExpanded && (
              <>
                <Text style={styles.itemValue}>{''}</Text>
                <Text style={styles.itemValue}>{''}</Text>
                <Text style={styles.itemValue}>{''}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.secondary,
    fontWeight: '400',
  },
  horizontalItem: {
    flexDirection: 'row',
    marginHorizontal: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  box: {
    height: 60,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 10,
  },
  flexBoxText: {
    paddingLeft: 5,
    marginVertical: 5,
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.secondary,
    fontWeight: '400',
    padding: 5,
  },
  itemValue: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
    fontWeight: '400',
    padding: 5,
    alignSelf: 'flex-end',
  },
  newTotal: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
    fontWeight: '400',
    padding: 5,
  },
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: 'red',
  },
  badgeValue: {
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
    fontWeight: '400',
  },
  add: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
    fontWeight: '400',
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    color: Colors.secondary,
    fontWeight: '400',
    paddingLeft: 5,
    marginVertical: 5,
  },
});

export default InventoryItemDetails;
