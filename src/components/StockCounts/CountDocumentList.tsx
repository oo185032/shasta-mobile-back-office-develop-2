import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Card, Icon, Badge, Overlay, Button } from "react-native-elements";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import * as realmService from '../../database/realmService';
import { DashboardStackParamList } from "../../navigations/DashboardNavigator";
import { RouteProp } from "@react-navigation/native";
import AppHeader from "../AppHeader";
import { NavigationItem} from "../../navigations/NavigationItem";
import CommonStyle from "../../styles/CommonStyle";
import { Colors } from "../../styles/Values";
import CustomAlert from "../CustomAlert";
import moment from "moment";


const radioTypes = [
  { label: 'Store 1', value: 0 },
  { label: 'Store 2', value: 1 },
  { label: 'Store 3', value: 2 },
];

type CountDocumentListNavigationProp = StackNavigationProp<DashboardStackParamList, 'CountDocumentList'>;
type CountDocumentListrouteProp = RouteProp<DashboardStackParamList, 'CountDocumentList'>;
type Props = {
  navigation: CountDocumentListNavigationProp;
  route: CountDocumentListrouteProp;
};
interface Item {
  documentId: string;
  name: string;
  type: string;
  createdDate: number;
  updatedDate: number;
  users: string;
  status: string;
}

const CountDocumentList = (props: Props) => {
  const [selected, setSelected] = useState();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [documentSummary, setdocumentSummary] = useState([]);


  useEffect(() => {
    if (props.route.params !== undefined) {
      if (props.route.params.isError) {
        setError(true);
      }
    }
    getDocumentSummary();
  }, []);

  const toggleOverlay = () => {
    setVisible(true);
  };

  const closeOverlay = () => {
    setVisible(false);
  };
  const onPress = (index) => {
    setSelected(index);
  };

  const getContent = () => {
    return <Text style={{ fontSize: 14, color: '#000' }}>Unable to create a document</Text>;
  };

  const getDocumentSummary = async() =>{
    const docs = await realmService.readDocumentSummary();
    setdocumentSummary(docs);
  }

  const badgeColor = (status: string) => {
    switch (status){
      case("New"):{
        return Colors.new;
      }
      case("In Progress"):{
        return Colors.inProgress;
      }
      case("Pending Approval"):{
        return Colors.pending;
      }
      case("Approved"):{
        return Colors.approved;
      }
      case("Rejected"):{
        return Colors.rejected;
      }
    }
  };

  const renderItem = ({ item }: { item: Item}) => (
    <Card containerStyle={styles.card}>
      <View style={styles.horizontalItem}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Badge
          status={'success'}
          value={item.status}
          textStyle={styles.badgeLabel}
          badgeStyle={[styles.badge, { backgroundColor: badgeColor(item.status) }]}
        />
      </View>
      <View style={styles.horizontalItem}>
        <View style={styles.row}>
          <Text style={styles.countType}>{item.type}</Text>
          <Text style={styles.docId}>HBC00123</Text>
        </View>

        <Text style={styles.lines}>23 Lines</Text>
      </View>
      <View style={styles.horizontalItem}>
        <Text style={styles.userId}>User ID</Text>
        <View style={styles.row}>
          <Text style={styles.date}>Created:</Text>
          <Text style={styles.date}>{moment.unix(item.createdDate).format('MM/DD/YYYY HH:mmA')}</Text>
          {/* <Text style={styles.time}>4:56 PM</Text> */}
        </View>
      </View>
      <View style={styles.horizontalItem}>
        <Text style={styles.userId}>User ID</Text>
        <View style={styles.row}>
          <Text style={styles.date}>Modified:</Text>
          <Text style={styles.date}>{moment.unix(item?.updatedDate).format('MM/DD/YYYY HH:mmA')}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader
        title={"Stock Counts"}
        backNavigationRoute={NavigationItem.DashboardStack}
      />
      <View style={styles.content}>
          <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
          <View style={{ flex: 0.6 }}>
            <Text style={styles.link}>Scan an item or choose from the list below to begin</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.titleWrapper} onPress={toggleOverlay}>
            <Text style={styles.storeName}>Store XYZXYZ</Text>
            <Icon name="caret-down" type="ionicon" color={Colors.black} size={22} />
          </TouchableOpacity>
        </View>
        {error && (
          <View style={{ margin: 15 }}>
            <CustomAlert
              type="error"
              content={getContent()}
              autoClose={false}
              manualClose={() => {
                setError(false);
              }}
            />
          </View>
        )}
        <View style={styles.horizontalItem}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.9}
            onPress={() => {
              props.navigation.push(NavigationItem.ChooseCountType);
            }}>
            <Icon name="add" type="app_icon" color={Colors.primary} size={20} />
            <Text style={styles.add}>Add New</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <Icon name="filter" type="app_icon" color={Colors.primary} size={20} />
            <Text style={styles.filter}>Search & Filter</Text>
          </View>
        </View>
        <FlatList
          data={documentSummary}
          renderItem={renderItem}
          keyExtractor={(item) => item.documentId}
        />
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '85%' }}>
        <View>
          <View style={styles.modalHeaderWrapper}>
            <Text style={styles.modalTitle}> {"You're working at:" } </Text>
            <TouchableOpacity style={{ marginBottom: 20 }} onPress={closeOverlay}>
              <Icon name="close-outline" type="ionicon" color={Colors.black} size={30} />
            </TouchableOpacity>
          </View>
          <View>
            <RadioForm formHorizontal={false} animation={true}>
              {radioTypes.map((obj, i) => {
                return (
                  <RadioButton labelHorizontal={true} key={i} wrapperStyle={styles.radioButtonStyle}>
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={selected === i}
                      onPress={onPress}
                      buttonInnerColor={Colors.primary}
                      buttonOuterColor={Colors.lightBorder}
                      buttonSize={10}
                      buttonStyle={{}}
                      buttonWrapStyle={{ marginLeft: 30, marginTop: 3 }}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      onPress={onPress}
                      labelStyle={styles.radioLabel}
                      labelWrapStyle={{ marginBottom: 5 }}
                    />
                  </RadioButton>
                );
              })}
            </RadioForm>
          </View>
          <View style={styles.modalButtonWrapper}>
            <Button
              title="Cancel"
              titleStyle={styles.cancelButtonTitle}
              buttonStyle={styles.cancelButton}
              onPress={closeOverlay}
            />
            <Button title="Update" titleStyle={styles.updateButtonTitle} buttonStyle={styles.updateButton} />
          </View>
        </View>
      </Overlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    borderRadius: 5,
    margin: 0,
    marginVertical: 5,
  },
  titleWrapper: {
    flexDirection: 'row',
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
    borderColor: Colors.lightBorder,
  },
  separator: {
    height: 1,
    width: "86%",
    backgroundColor: "#CED0CE",
    marginLeft: "14%",
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.secondary,
    paddingRight: 10,
  },
  horizontalItem: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  rightAlign: {
    textAlign: 'right',
  },
  add: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.primary,
  },
  filter: {
    fontSize: 14,
    marginLeft: 5,
    color: Colors.primary,
  },
  storeName: {
    marginLeft: 5,
    color: Colors.black,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  documentName: {
    fontSize: 14,
    lineHeight: 24,
    color: Colors.black,
  },
  badge: {
    paddingHorizontal: 8,
  },
  badgeLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    paddingBottom: 2,
    color: Colors.black,
  },
  countType: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
    fontSize: 12,
    lineHeight: 16,
    backgroundColor: Colors.primaryLight,
  },
  docId: {
    padding: 2,
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 5,
  },
  lines: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
  },
  userId: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
  },
  date: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
    marginRight: 2,
  },
  time: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 3,
  },

  modalHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingBottom: 5,
  },
  modalTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  radioButtonStyle: {
    marginBottom: 20,
    marginLeft: 20,
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    marginLeft: 15,
    color: Colors.black,
    textAlign: 'center',
  },
  modalButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 15,
  },
  cancelButton: {
    height: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 15,
    alignItems: 'center',
  },
  cancelButtonTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.lightText,
  },
  updateButton: {
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.primaryText,
  },
});

export default CountDocumentList;
