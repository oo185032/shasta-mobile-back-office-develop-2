import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Icon, Button, Overlay } from 'react-native-elements';
import { RouteProp } from '@react-navigation/native';
import AppHeader from '../AppHeader';
import { NavigationItem } from '../../navigations/NavigationItem';
import { Colors, Fonts, CustomDimensions } from '../../styles/Values';
import CommonStyle from '../../styles/CommonStyle';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
const radioTypes = [
  { label: 'Store 1', value: 0 },
  { label: 'Store 2', value: 1 },
  { label: 'Store 3', value: 2 },
];

type ChooseCountTypeNavigationProp = StackNavigationProp<DashboardStackParamList, 'ChooseCountType'>;
type ChooseCountTyperouteProp = RouteProp<DashboardStackParamList, 'ChooseCountType'>;
type Props = {
  navigation: ChooseCountTypeNavigationProp;
  route: ChooseCountTyperouteProp;
  items: any;
};

const ChooseCountType = (props: Props) => {
  const [selected, setSelected] = useState();
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(true);
  };

  const closeOverlay = () => {
    setVisible(false);
  };
  const onPress = (index) => {
    setSelected(index);
  };

  const navigateToNameYourDocument = () => {
    props.navigation.navigate(NavigationItem.NameYourDocument);
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title={'Choose Count Type'} />
      <View style={{ alignItems: 'center', alignContent: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} style={styles.titleWrapper} onPress={toggleOverlay}>
          <Icon name="location-outline" type="ionicon" color={Colors.primary} size={22} />
          <Text style={styles.storeName}>Store XYZ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Button
          title="Free Count"
          onPress={() => navigateToNameYourDocument()}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          icon={<Icon name="release-price-pos" type="app_icon" color={Colors.primary} size={20} />}
        />
        <Button
          title="Full Count"
          buttonStyle={[styles.button, { marginBottom: 12, marginTop: 12 }]}
          titleStyle={styles.buttonTitle}
          icon={<Icon name="price-verification" type="app_icon" color={Colors.primary} size={20} />}
        />
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '85%' }}>
        <View>
          <View style={styles.modalHeaderWrapper}>
            <Text style={styles.modalTitle}>You're working at:</Text>
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
  container: {
    flex: 1,
    padding: 15,
    marginTop: 20,
  },

  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: Colors.primary,
  },
  storeName: {
    marginLeft: 5,
    color: Colors.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
    borderColor: Colors.secondary,
    borderRadius: CustomDimensions.borderRadius,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 17,
    paddingRight: 17,
    borderWidth: 1,
  },
  buttonTitle: {
    paddingLeft: 23,
    color: Colors.text,
    fontFamily: Fonts.family,
    fontSize: Fonts.size.default,
    fontWeight: '600',
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
export default ChooseCountType;
