import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Badge, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CommonStyle from '../../styles/CommonStyle';
import { Colors, Fonts } from '../../styles/Values';
import AppHeader from '../AppHeader';
import { NavigationItem } from '../../navigations/NavigationItem';
import * as realmService from '../../database/realmService';

const data = [
  { title: 'Original', lines: 3, quantity: 36, cost: '$36.00' },
  { title: 'New', lines: 3, quantity: 35, cost: '$35.00' },
  { title: 'Difference', lines: 0, quantity: -1, cost: '-$1.00' },
];

type Props = {
  documentData: any;
};

const CountSummary = (props: Props) => {
  const navigation = useNavigation();

  const submitDocument = async () => {
    const docs = await realmService.updateUserDocStatus(props.documentData.documentID);
    navigation.push(NavigationItem.CountDocumentList);
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={'Count Summary'} />
      <View style={{ flex: 1 }}>
        <Text style={styles.subTitle}>Beverage Count</Text>
        <View style={[styles.horizontalItem, { paddingHorizontal: 15 }]}>
          <Badge value="Free" badgeStyle={styles.badgeStyle} textStyle={styles.badgeText} />
          <Text style={styles.docId}>{`DocID ${props.documentData.documentID}`}</Text>
        </View>
        <Card containerStyle={styles.card}>
          <View>
            <View style={styles.header}>
              <View style={styles.titleContainer}></View>
              <View style={styles.wrapper}>
                <Text style={styles.headings}>Lines</Text>
              </View>
              <View style={styles.wrapper}>
                <Text style={styles.headings}>Qty</Text>
              </View>
              <View style={styles.wrapper}>
                <Text style={styles.headings}>Cost</Text>
              </View>
            </View>

            {data.map((item, index) => {
              return (
                <View style={styles.horizontalItem} key={`${index}`}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleStyle}>{item.title}</Text>
                  </View>
                  <View style={styles.wrapper}>
                    <Text style={styles.data}>{item.lines}</Text>
                  </View>
                  <View style={styles.wrapper}>
                    <Text style={styles.data}>{item.quantity}</Text>
                  </View>
                  <View style={styles.wrapper}>
                    <Text style={styles.data}>{item.cost}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          onPress={() => navigation.push(NavigationItem.InventoryItemList)}
          containerStyle={styles.editButtonContainer}
          buttonStyle={[styles.button, { backgroundColor: Colors.primaryLight }]}
          titleStyle={styles.editButtonText}
          title="Edit Document"
        />
        <Button
          onPress={() => {
            submitDocument();
          }}
          containerStyle={styles.submitButtonContainer}
          buttonStyle={[styles.button, { backgroundColor: Colors.primary }]}
          titleStyle={styles.submitButtonText}
          title="Submit Document"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.secondary,
    fontWeight: '400',
  },
  card: {
    padding: 0,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 16,
  },
  header: {
    backgroundColor: Colors.primaryLight,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  horizontalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  headings: {
    fontSize: 13,
    lineHeight: 24,
    color: Colors.black,
    fontWeight: '400',
  },
  titleContainer: {
    flex: 0.4,
  },
  titleStyle: {
    fontSize: 14,
    lineHeight: 24,
    color: Colors.secondary,
    fontWeight: '400',
  },
  data: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
    fontWeight: '400',
  },
  wrapper: {
    flex: 0.2,
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
    color: 'black',

    fontSize: 12,
    lineHeight: 16,
  },
  docId: {
    fontSize: 13,
    lineHeight: 24,
    color: Colors.secondary,
    fontWeight: '400',
  },
  buttonWrapper: {
    flexDirection: 'row',
    padding: 16,
  },
  editButtonContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
  },
  editButtonText: {
    fontFamily: Fonts.family,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
    fontWeight: '400',
  },
  submitButtonText: {
    fontFamily: Fonts.family,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primaryText,
    fontWeight: '400',
  },
  submitButtonContainer: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 8,
  },
  button: {
    height: 44,
  },
});

const mapStateToProps = (state: any) => ({
  documentData: state.inventory.documentData,
});

export default connect(mapStateToProps)(CountSummary);
