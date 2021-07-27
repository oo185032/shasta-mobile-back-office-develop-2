import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setDetectChangeErrorAlert } from "../../redux/actions/customAlerts";
import { Icon, Overlay } from "react-native-elements";
import { Colors } from "../../styles/Values";
type props = {
  toggleErrorAlertModal: any;
  title: string;
  message: string;
};

const ErrorAlertModal = (props: props) => {
  const { t, i18n } = useTranslation("errorAlertModal");
  const onCloseOverlay = () => {
    props.toggleErrorAlertModal(false);
  };

  return (
    <Overlay isVisible={true} overlayStyle={styles.container}>
      <View style={styles.parentView}>
        <View style={styles.childView1}>
            <Icon name='alert-circle' type='app_icon' color={Colors.errorBorder} size={24}/>
            <Text style={styles.headingTxt}>{props.title}</Text>
        </View>
        <View style={styles.childView2}>
          <Text style={styles.msgBodyTxt}>{props.message}</Text>
        </View>
        <View style={styles.childView3}>
          <TouchableOpacity style={styles.continueBtn} onPress={onCloseOverlay}>
            <Text style={styles.continueBtnTxt}>{t("okBtn")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 264,
    width: 320,
    marginHorizontal: 20,
    marginVertical: 188,
    borderRadius: 8,
  },
  parentView: { 
    backgroundColor: "white",
    height: "100%", 
    flexDirection: "column",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 12 
  },
  childView1: {
    backgroundColor: "white",
    flexDirection: "row",
  },
  headingTxt: {
    color: Colors.textPrimaryColor,
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    marginLeft: 16
  },
  iconTouchableStyle: { 
      alignItems: "flex-end" 
  },
  childView2: {
    backgroundColor: "white",
    justifyContent: "center"
  },
  msgBodyTxt: {
    color: Colors.textPrimaryColor,
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  },
  childView3: {
    backgroundColor: "white",
    flexDirection: "row-reverse",
    alignItems: "center"
  },
  continueBtn: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: 40,
    backgroundColor: Colors.primary,
  },
  continueBtnTxt: {
    color: "white",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  }
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    toggleErrorAlertModal: (showErrorAlert: boolean) =>
        dispatch(setDetectChangeErrorAlert(showErrorAlert)),
});

export default connect(null, mapDispatchToProps)(ErrorAlertModal);
