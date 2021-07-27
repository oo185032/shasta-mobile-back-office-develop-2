import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ViewProps,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setDetectChangeCustomAlert } from "../../redux/actions/customAlerts";
import { Icon, Overlay } from "react-native-elements";
import { Colors } from "../../styles/Values";
import { useNavigation } from "@react-navigation/native";
type props = {
  toggleCustomAlertModal: any;
  backNavigationRoute?: string;
  backNavigationOptions: Object;
  title: string;
  message: string;
};

const CustomAlertModal = (props: props) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation("customAlertModal");
  const onCloseOverlay = () => {
    props.toggleCustomAlertModal(false);
  };

  const leaveThePage = async () => {
    await props.toggleCustomAlertModal(false);
    (await props.backNavigationRoute)
      ? navigation.push(props.backNavigationRoute, props.backNavigationOptions ?? {})
      : navigation.goBack();
  };

  return (
    <Overlay isVisible={true} overlayStyle={styles.container}>
      <View style={styles.parentView}>
        <View style={styles.childView1}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingTxt}>{props.title}</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={onCloseOverlay}
              activeOpacity={0.8}
              style={styles.iconTouchableStyle}
            >
              <Icon
                name="close"
                type="ionicon"
                color={Colors.textPrimaryColor}
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.childView2}>
          <Text style={styles.msgBodyTxt}>{props.message}</Text>
        </View>
        <View style={styles.childView3}>
          <TouchableOpacity style={styles.continueBtn} onPress={onCloseOverlay}>
            <Text style={styles.continueBtnTxt}>{t("secondaryBtn")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.leaveBtn} onPress={leaveThePage}>
            <Text style={styles.leaveBtnTxt}>{t("primaryBtn")}</Text>
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
    padding: 2 
  },
  childView1: {
    height: "16%",
    backgroundColor: "white",
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between"
  },
  headingContainer: { 
    marginTop: "6%" 
  },
  headingTxt: {
    color: Colors.textPrimaryColor,
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
  },
  iconTouchableStyle: { 
      alignItems: "flex-end" 
  },
  iconContainer: {
    flexDirection: "row-reverse",
    backgroundColor: "white",
  },
  childView2: {
    backgroundColor: "white",
    height: "67%",
    justifyContent: "center",
    marginHorizontal: 10,
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
    height: "20%",
    alignItems: "center",
  },
  continueBtn: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    width: 152,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: "80%",
    backgroundColor: Colors.primary,
  },
  continueBtnTxt: {
    color: "white",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  },
  leaveBtnTxt: {
    color: Colors.secondary,
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  },
  leaveBtn: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: "80%",
    marginRight: "8%",
  },
  text: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  },
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  toggleCustomAlertModal: (showCustomAlert: boolean) =>
    dispatch(setDetectChangeCustomAlert(showCustomAlert)),
});

export default connect(null, mapDispatchToProps)(CustomAlertModal);
