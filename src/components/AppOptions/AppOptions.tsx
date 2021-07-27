import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {View, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import { connect } from "react-redux";
import {Button, Text } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';
import { saveAppOptions } from '../../redux/actions/app-options';
import AppHeader from '../AppHeader';
import {RootStackParamList} from '../../navigations/AuthNavigator';
import CommonStyle from '../../styles/CommonStyle'
import { useState } from 'react';
import CustomAlert from '../CustomAlert';
import TextField from '../TextField';
import { Colors, CustomDimensions } from '../../styles/Values';

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  route: LoginRouteProp;
  navigation: LoginNavigationProp;
  handleSaveOptions: any;
  organization: string,
  enterpriseUnit: string,
  environment: string,
  appOptions: any,
};

const AppOptions = (props: Props) => {
    const { t, i18n } = useTranslation('appOptions');
    const [organization, setOrganization] = useState(props.organization);
    const [enterpriseUnit, setEnterpriseUnit] = useState(props.enterpriseUnit);
    const [environment, setEnvironment] = useState(props.environment);
    const [isError, setIsError] = useState(false);
    const [handlingRequest, setHandlingRequest] = useState(false);

    const handleSaveOptions = () => {
      props.handleSaveOptions(organization, enterpriseUnit, environment);
      props.navigation.popToTop();
    }

    const handleChangeText = (id: string, text: string) => {
        switch(id) {
            case "organization": 
              setOrganization(text);
              break;
            case "enterpriseUnit":
              setEnterpriseUnit(text);
              break;
            default: 
              break;
        }
    }

    const handleEnvironmentClick = (env: string) => {
      setEnvironment(env);
    };
  return (
    <SafeAreaView style={CommonStyle.safeArea}>
        <AppHeader title="" hideBackButton={true}/>
      <ScrollView>
        <View style={CommonStyle.container}>
          <Text style={[CommonStyle.title, {marginBottom: 20}]}>{t('settings')}</Text> 
          <TextField
            label={t('organization')}
            placeholder={t('organization')}
            labelStyle={CommonStyle.inputLabel}
            onChangeText={(text) => handleChangeText('organization', text)}
            value={organization}
          /> 
          <TextField
            label={t('enterpriseUnit')}
            placeholder={t('enterpriseUnit')}
            wrapperStyle={{marginTop: 7, marginBottom: 7}}
            labelStyle={CommonStyle.inputLabel}
            onChangeText={text => handleChangeText('enterpriseUnit', text)}
            value={enterpriseUnit}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1, marginBottom: 24}}>
            <View style={{ width: '30%' }}>
              <Button 
                title={t('dev')}
                buttonStyle={ environment === 'dev' ? styles.selectedButton: styles.unselectedButton }
                titleStyle={ environment === 'dev' ? styles.selectedButtonTitle: styles.unselectedButtonTitle }
                onPress={() => handleEnvironmentClick('dev')}
              />
            </View>
            <View style={{ width: '30%' }}>
              <Button 
                title={t('staging')}
                buttonStyle={ environment === 'staging' ? styles.selectedButton: styles.unselectedButton }
                titleStyle={ environment === 'staging' ? styles.selectedButtonTitle: styles.unselectedButtonTitle }
                onPress={() => handleEnvironmentClick('staging')}
              />
            </View>
            <View style={{ width: '30%' }}>
              <Button 
                  title={t('production')}
                  buttonStyle={ environment === 'production' ? styles.selectedButton: styles.unselectedButton }
                  titleStyle={ environment === 'production' ? styles.selectedButtonTitle: styles.unselectedButtonTitle }
                  onPress={() => handleEnvironmentClick('production')}
              />
            </View>
          </View>
          <Button
            title={t('save')}
            buttonStyle={CommonStyle.primaryButton}
            titleStyle={CommonStyle.primaryTitle}
            loading={handlingRequest}
            onPress={handleSaveOptions}
            disabled={organization === '' || enterpriseUnit === '' || environment === ''}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const mapStateToProps = (state: any, ownProps: any) => ({
  organization: state.appOptions.organization,
  enterpriseUnit: state.appOptions.enterpriseUnit,
  environment: state.appOptions.environment,
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  handleSaveOptions: (organization: string, enterpriseUnit: string, environment: string) => dispatch(saveAppOptions(organization, enterpriseUnit, environment))
})


const styles = StyleSheet.create({
  selectedButton: {
    backgroundColor: Colors.primary,
    borderRadius: CustomDimensions.borderRadius,
    padding: CustomDimensions.primaryButtonPadding,
  },
  unselectedButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: CustomDimensions.borderRadius,
    padding: CustomDimensions.primaryButtonPadding,
  },
  selectedButtonTitle: {
    color: 'white',
    fontSize: 14,
  },
  unselectedButtonTitle: {
    color: 'black',
    fontSize: 14,
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppOptions)
