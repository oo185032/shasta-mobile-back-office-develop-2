import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, StatusBar } from "react-native";
import { Header, HeaderProps, Icon, BottomSheet } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { NavigationItem } from "../../navigations/NavigationItem";
import { Colors, Fonts } from "../../styles/Values";
import { connect } from "react-redux";
import { setDetectChangeCustomAlert } from '../../redux/actions/customAlerts';
type props =  {
  title: string;
  hideBackButton?: boolean;
  backNavigationRoute?: string;
  backNavigationOptions: Object;
  showHeaderRight?: boolean;
  showEditIcon?: boolean,
  isChangeDetected: () => boolean,
  toggleCustomAlertModal: any;
}
const AppHeader = (props: props) => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation("appHeader");
  const backButton = {
    icon: "arrow-back",
    color: "#000",
    onPress: () => {
      props.backNavigationRoute
        ? navigation.push(props.backNavigationRoute)
        : navigation.goBack();
    },
  };

  const headerLeft = () => {
    return (
      <TouchableOpacity onPress={() =>       
        {
       
        if(props.isChangeDetected && props.isChangeDetected()){
          props.toggleCustomAlertModal(true)
        } else{
      
            props.backNavigationRoute 
            ? navigation.push(props.backNavigationRoute, props.backNavigationOptions ?? {}) 
            : navigation.goBack()
        }}}>
        <Icon
          name="arrow-back"
          color={"#000"}
          size={16}
        />
      </TouchableOpacity>
    );
  };

  const headerRight = () => {
    return (
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <Icon
          name="dots-vertical"
          type="material-community"
          color={"#000"}
          size={16}
        />
      </TouchableOpacity>
    );
  };
  const navigateTo = () => {
    setIsVisible(false);
    navigation.push(NavigationItem.ManualScan, {});
  };

  const navigateToEdit = ()=>{
    setIsVisible(false);
    navigation.push(NavigationItem.EditItem, {});
  }

  return (
    <>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"}/>
      <View style={{height: 56, flexDirection: 'row'}}>

        {/************************* Header Left ********************/}
        <View style={{alignItems: 'flex-start', justifyContent: 'center', marginLeft: 12}}>
          { !props.hideBackButton && headerLeft() }
        </View>

        {/************************* Center ********************/}
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 19, fontFamily: Fonts.family, lineHeight: 32 }}>{props.title}</Text>
        </View>
        
        {/************************* Header Right ********************/}
        <View style={{alignItems: 'flex-end', justifyContent: 'center', marginRight: 14}}>
          { props.showHeaderRight && headerRight() }
        </View>

      </View>

      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        <View style={styles.bottomSheetContainer}>
          <View
            style={[styles.bottomSheetRow, { justifyContent: "space-between" }]}
          >
            <Text style={styles.quickText}>{t("quickTools")}</Text>
            <TouchableOpacity
              style={styles.bottomSheetRow}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeText}>{t("close")}</Text>
              <Icon
                name="close-circle"
                type="ionicon"
                color={Colors.mediumBorder}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.bottomButtonWrapper}>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => navigateTo()}
              >
                <Icon
                  name="scan-outline"
                  type="ionicon"
                  color={Colors.background}
                  size={25}
                />
              </TouchableOpacity>
              <Text style={styles.bottomButtonText}>{t("manualScan")}</Text>
            </View>

            {props.showEditIcon && <View style={styles.bottomButtonWrapper}>
              <TouchableOpacity style={styles.bottomButton} onPress={()=>navigateToEdit()}>
                 <Icon
                  name="ios-pencil"
                  type="ionicon"
                  color="#ffffff"
                  size={20}
                />
              </TouchableOpacity>
              <Text style={styles.bottomButtonText}>{t("editItem")}</Text>
            </View>}
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: "white",
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bottomSheetRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickText: {
    fontSize: 14,
    lineHeight: 16,
    color: Colors.black,
    fontWeight: "400",
  },
  closeText: {
    fontSize: 14,
    lineHeight: 16,
    marginRight: 8,
    color: Colors.lightText,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  bottomButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal:35,
  },
  bottomButton: {
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  bottomButtonText: {
    fontSize: 15,
    lineHeight: 16,
    fontWeight: "400",
    color: Colors.primary,
  },
});


AppHeader.defaultProps = {
  showHeaderRight: true,
  showEditIcon:false,
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  toggleCustomAlertModal: (showCustomAlert: boolean) => dispatch(setDetectChangeCustomAlert(showCustomAlert))
})

export default connect(
  null,
  mapDispatchToProps
  )(AppHeader)

