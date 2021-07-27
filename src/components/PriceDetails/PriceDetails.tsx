import React, { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { convertDateToUTC } from '../../utils/DateUtils';
import { Colors, CustomDimensions, Fonts } from '../../styles/Values';

const PriceDetails = (props: any) => {
  const { t } = useTranslation('priceDetails');
  const {
    headerText,
    priceText,
    priceCode,
    isLoyalty,
    onPressFunction,
    selected,
    startDate,
    endDate,
    quantityText,
    index,
    isSelectedByDefault,
    isForMultipleSelection,
    override,
  } = props;
  const endDateDisplay = endDate ? t('dateFormat', { date: convertDateToUTC(new Date(endDate)) }) : t('unlimited');
  const startDateDisplay = convertDateToUTC(new Date(startDate));
  const [isChildSelected, setIsChildSelected] = useState(isSelectedByDefault);

  /**********************************************************
   * Actions to take when user presses/clicks on a price box
   **********************************************************/
  const pressActions = () => {
    if (onPressFunction) {
      setIsChildSelected(!isChildSelected);
      onPressFunction(priceCode, isChildSelected);
    }
  };

  /**************************************************************
   * Method to return a conditional borderColor
   **************************************************************/
  const getBorderStyle = (isForMultipleSelection: boolean) => {
    if (isForMultipleSelection) {
      return { borderColor: isChildSelected ? '#3C4CE4' : Colors.lightBorder };
    } else {
      return { borderColor: selected === priceCode ? '#3C4CE4' : Colors.lightBorder };
    }
  };

  return (
    <Pressable onPress={pressActions}>
      <View style={[{ ...styles.container, marginTop: index === 0 ? 0 : 8 }, getBorderStyle(isForMultipleSelection)]}>
        <View style={styles.left}>
          <View>
            <Text style={styles.leftprice}>{headerText}</Text>
          </View>
          <View style={styles.dateContainerStyles}>
            <Text style={[styles.dateStyles, styles.secondRowCommon]}>
              {t('dateFormat', { date: startDateDisplay })}
            </Text>
            <Text style={{ marginLeft: 5, marginRight: 5 }}> - </Text>
            <Text style={[styles.dateStyles, styles.secondRowCommon]}>{endDateDisplay}</Text>
          </View>
          {override && (
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 8 }}>
              <Text style={styles.storeOverrideText}>{t('storeOverride')}</Text>
            </View>
          )}
        </View>
        <View style={styles.right}>
          <View>
            <Text style={styles.rightprice}>
              {isLoyalty && (
                <Icon name="loyalty" type="app_icon" color={Colors.primary} style={styles.loyaltyIcon} size={20} />
              )}
              {priceText}
            </Text>
          </View>
          <View style={styles.itemQuantityContainer}>
            <Text style={styles.secondRowCommon}>{quantityText}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    backgroundColor: '#fff',
    borderRadius: CustomDimensions.borderRadius,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    paddingTop: 8,
    fontFamily: Fonts.family,
  },
  left: {
    display: 'flex',
  },
  right: {
    display: 'flex',
  },
  leftprice: {
    fontSize: 14,
    lineHeight: 24,
    color: '#000',
    alignSelf: 'flex-start',
    fontWeight: '400',
    fontFamily: Fonts.family,
  },
  secondRowCommon: {
    fontFamily: Fonts.family,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  dateContainerStyles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateStyles: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    borderRadius: 2,
    paddingRight: 7,
    paddingLeft: 7,
  },
  itemQuantityContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  noEndDateStyle: {
    color: 'red',
  },
  batchInfo: {
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: '400',
  },
  rightprice: {
    alignSelf: 'flex-end',
    fontSize: 19,
    color: '#000',
    fontWeight: '400',
    fontFamily: Fonts.family,
  },
  discountPercentage: {
    fontSize: 14,
    color: '#3C3C43',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  loyaltyIcon: {
    marginRight: 3,
  },
  storeOverrideText: {
    borderStyle: 'solid',
    backgroundColor: 'rgba(253, 181, 165, 1)',
    borderRadius: 32,
    paddingLeft: 8,
    paddingRight: 8,
    fontFamily: Fonts.family,
    fontSize: 12,
    lineHeight: 16,
  },
});

export default PriceDetails;
