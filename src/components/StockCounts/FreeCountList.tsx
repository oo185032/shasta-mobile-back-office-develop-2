import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, Icon, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import AppHeader from '../AppHeader';
import { NavigationItem, Modules } from '../../navigations/NavigationItem';
import { Colors, Fonts, CustomDimensions } from '../../styles/Values';
import CommonStyle from '../../styles/CommonStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type FreeCountListNavigationProp = StackNavigationProp<DashboardStackParamList, 'FreeCountList'>;
type FreeCountListRouteProp = RouteProp<DashboardStackParamList, 'FreeCountList'>;

type Props = {
  navigation: FreeCountListNavigationProp;
  route: FreeCountListRouteProp;
  documentData: any;
};

const FreeCountList = (props: Props) => {
  const { t, i18n } = useTranslation('freeCountList');
  const screenTitle = props.route.params ? props.route.params.title : '';
  console.log('DOCUMENT', props.documentData);
  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={t('itemList')} />
      <View style={[styles.row, { justifyContent: 'center' }]}>
        <Text style={styles.title}>{screenTitle}</Text>
        <Icon name="edit" type="app_icon" color={Colors.black} size={20} />
      </View>

      <View style={styles.horizontalItem}>
        <View style={styles.row}>
          <Badge value="Free" badgeStyle={styles.badgeStyle} textStyle={styles.badgeText} />
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.docId}>{`DocID ${props.documentData.documentID}`}</Text>
        </View>
        <Text style={styles.lines}>0 Lines</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.horizontalItem}>
        <TouchableOpacity style={styles.row}>
          <Icon name="filter" type="app_icon" color={Colors.primary} size={24} />
          <Text style={styles.filter}>{t('searchAndFilter')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.9}
          onPress={() => props.navigation.push(NavigationItem.CountSummary)}>
          <Icon name="completed" type="app_icon" color={Colors.primary} size={24} />
          <Text style={styles.complete}>{t('complete')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Icon name="speaker-phone" type="material" color={Colors.primary} size={75} style={{ marginBottom: 30 }} />
        <Text style={styles.scan}>{t('scanFirstItem')}</Text>
      </View>
      <TouchableOpacity
        onPress={() => props.navigation.push(NavigationItem.InventoryItemDetails)}
        style={styles.floatingButton}
        activeOpacity={0.8}>
        <Icon name="scan-circle-outline" type="ionicon" color={Colors.primaryText} size={30} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    alignItems: 'center',
    backgroundColor: 'white',
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
  horizontalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.secondary,
    fontWeight: '400',
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
  docId: {
    fontSize: 13,
    lineHeight: 24,
    color: Colors.secondary,
    fontWeight: '400',

    paddingRight: 10,
  },
  lines: {
    fontSize: 13,
    lineHeight: 24,
    color: Colors.secondary,
    fontWeight: '400',
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.secondary,
  },
  complete: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '400',
    marginLeft: 2,
    color: Colors.black,
  },
  filter: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '400',
    marginLeft: 2,
    color: Colors.black,
  },
  scan: {
    fontSize: 16,
    lineHeight: 24,
  },
});

const mapStateToProps = (state: any) => ({
  documentData: state.inventory.documentData,
});

export default connect(mapStateToProps)(FreeCountList);
