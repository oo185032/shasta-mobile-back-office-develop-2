import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Dimensions } from 'react-native';
import { Text, Icon, Badge } from 'react-native-elements';
import CommonStyle from '../../styles/CommonStyle';
import { Colors } from '../../styles/Values';
import AppHeader from '../AppHeader';
import { NavigationItem } from '../../navigations/NavigationItem';
import ItemAvatar from '../ItemAvatar';
import TextField from '../TextField';
import DropdownMenu from '../Dropdown';

const width = Dimensions.get('window').width;
const boxWidth = width - 60;

const AdjustmentItemDetails = () => {
  const [bohValue, setBohValue] = useState(12);
  const [adjustment, setAdjustment] = useState('');
  const [total, setTotal] = useState('');
  const [badgeValue, setBadgeValue] = useState('');
  const [isAdditionalDetailsExpanded, setIsAdditionalDetailsExpanded] = useState(true);
  const [reasonCode, setReasonCode] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleExpand = () => {
    setIsAdditionalDetailsExpanded(!isAdditionalDetailsExpanded);
  };

  const onChangeAdjustment = (text: string) => {
    if (text.length > 0) {
      const adjustmentType = reasonCode ? reasonCode.charAt(0) : '';
      setAdjustment(text);
      if (reasonCode) {
        const badgeCount = `${adjustmentType}${text}`;
        setBadgeValue(badgeCount);
        const difference = adjustmentType === '-' ? bohValue - parseInt(text) : bohValue + parseInt(text);
        setTotal(difference.toString());
      }
    }
  };

  const onReasonCodeSelect = (value: string) => {
    const adjustmentType = value.charAt(0);
    setReasonCode(value);
    if (adjustment) {
      const badgeCount = `${adjustmentType}${adjustment}`;
      setBadgeValue(badgeCount);
      const difference = adjustmentType === '-' ? bohValue - parseInt(adjustment) : bohValue + parseInt(adjustment);
      setTotal(difference.toString());
    }
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={'Item Details'} backNavigationRoute={NavigationItem.InventoryAdjustmentsList} />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.subHeader}>Produce Count</Text>
      </View>
      <View style={CommonStyle.container}>
        <ItemAvatar url="../../assets/icecream.png" itemCode="Pepsi, 0.33 L" itemDesc="4578987654334567" />

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
                onSelected={(value: string) => {}}
              />
            </View>
            <View style={{ width: boxWidth / 4 - 5 }}>
              <Text style={styles.label}>Adjustment</Text>
              <TextField
                maxLength={6}
                inputRef={inputRef}
                keyboardType={'number-pad'}
                inputWidth={boxWidth / 4 + 10}
                wrapperStyle={{ width: boxWidth / 4, flexDirection: 'row' }}
                leftBadge={true}
                incrementSign={reasonCode ? reasonCode.charAt(0) : ''}
                onSubmitEditing={(event) => onChangeAdjustment(event.nativeEvent.text)}
              />
            </View>
          </View>
          <View
            style={{
              width: boxWidth / 2,
              marginLeft: 15,
            }}>
            <Text style={styles.label}>Reason code</Text>
            <DropdownMenu
              placeHolder={'-Select-'}
              data={[
                { label: '- 01 Damage', value: '- 01 damage' },
                { label: '- 02 Spoilage', value: '- 02 spoilage' },
                { label: '- 03 Expired', value: '- 03 expired' },
                { label: '+ 04 Found', value: '+ 04 found' },
                { label: '+ 05 Returned', value: '+ 05 returned' },
              ]}
              onDropdownOpen={() => inputRef.current.blur()}
              onSelected={(value: string) => {
                onReasonCodeSelect(value);
              }}
            />
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
          <View style={{ display: 'flex', justifyContent: 'flex-start' }}>
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

export default AdjustmentItemDetails;
