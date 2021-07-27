import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { createDocument } from '../../redux/actions/inventory';
import AppHeader from '../AppHeader';
import { NavigationItem } from '../../navigations/NavigationItem';
import { Colors } from '../../styles/Values';
import CommonStyle from '../../styles/CommonStyle';
import TextField from '../TextField';
import InProgress from '../InProgress';
import CustomAlert from '../CustomAlert';

type Props = {
  createDocument: any;
};

const NameYourDocument = (props: Props) => {
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setIsError] = useState(false);
  const inputRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const navigateTo = () => {
    setLoading(true);
    inputRef.current.blur();

    props.createDocument(documentName, 'Free Count').then((respData: any) => {
      setLoading(false);
      setDocumentName('');
      if (respData.error) {
        navigation.push(NavigationItem.CountDocumentList, { isError: true });
      } else {
        navigation.push(NavigationItem.FreeCountList, { title: documentName });
      }
    });
  };

  const validateOnChange = (event) => {
    const { text } = event.nativeEvent;

    if (text === undefined) return;

    if (!new RegExp(/^([^"]*)$/).test(text)) return; // Must not contain double quotes

    setDocumentName(text);
  };

  const getContent = () => {
    return <Text style={{ fontSize: 14, color: '#000' }}>Invalid name</Text>;
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      {loading ? (
        <InProgress displayText="Creating a new free count..." />
      ) : (
        <View style={{ flex: 1 }}>
          <AppHeader title={'Name Your Free Count'} />
          <View style={{ alignItems: 'center', alignContent: 'center' }}>
            <View style={styles.titleWrapper}>
              <Icon name="location-outline" type="ionicon" color={Colors.primary} size={22} />
              <Text style={styles.storeName}>Store XYZ</Text>
            </View>
          </View>
          {error && (
            <View style={{ marginHorizontal: 15, marginTop: 20 }}>
              <CustomAlert
                type="error"
                content={getContent()}
                autoClose={false}
                manualClose={() => {
                  setIsError(false);
                }}
              />
            </View>
          )}
          <TouchableWithoutFeedback onPress={() => inputRef.current.blur()}>
            <View style={CommonStyle.container}>
              <TextField
                inputRef={inputRef}
                label="Enter Document Name"
                wrapperStyle={{ marginTop: 10, marginBottom: 16 }}
                labelStyle={CommonStyle.inputLabel}
                keyboardType="visible-password"
                maxLength={50}
                value={documentName}
                onChange={validateOnChange}
                onSubmitEditing={() => {
                  navigateTo();
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
});

const mapStateToProps = (state: any) => ({
  items: state.itemDetails.items,
  priceVerifyItems: state.priceVerify.items,
});

const mapDispatchToProps = (dispatch: any) => ({
  createDocument: (name: string, type: string) => dispatch(createDocument(name, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NameYourDocument);
