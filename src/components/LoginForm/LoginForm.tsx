import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import LDClient from 'launchdarkly-react-native-client-sdk';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import { userLogin } from '../../redux/actions/user';
import { connect } from 'react-redux';
import { Button, Text } from 'react-native-elements';
import { NavigationItem } from '../../navigations/NavigationItem';
import { RootStackParamList } from '../../navigations/AuthNavigator';
import { RouteProp } from '@react-navigation/native';
import CommonStyle from '../../styles/CommonStyle';
import CustomAlert from '../CustomAlert';
import TextField from '../TextField';
import { Colors } from '../../styles/Values';

const deviceHeight = Dimensions.get('window').height;

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  route: LoginRouteProp;
  navigation: LoginNavigationProp;
  handleUserLogin: any;
  isUserLoggingIn: boolean;
  hasUserLoggedIn: boolean;
  ldClient: LDClient;
  appOptions: any;
};

const LoginForm = (props: Props) => {
  const { t } = useTranslation('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [handlingRequest, setHandlingRequest] = useState(false);

  const handleLogin = async () => {
    setHandlingRequest(true);
    // eslint-disable-next-line prefer-regex-literals
    const account = new RegExp('acct:[\\w-_]*@[\\w-_]*', 'g').test(username)
      ? username
      : `acct:${props.appOptions.organization}@${username}`;
    props.handleUserLogin(account, password).then((resp: any) => {
      setHandlingRequest(false);
      if (resp && !resp.error) {
        setLDUser(account);
        return props.navigation.push(NavigationItem.DashboardStack);
      } else {
        setIsError(true);
      }
    });
  };

  const setLDUser = async (identifier: string) => {
    const user = { key: identifier };
    await props.ldClient.identify(user);
  };

  const handleChangeText = (id: string, text: string) => {
    switch (id) {
      case 'username':
        setUsername(text);
        break;
      case 'password':
        setPassword(text);
        break;
      default:
        break;
    }
  };

  const handleMoreOptions = () => {
    return props.navigation.push(NavigationItem.AppOptions);
  };

  return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={75} extraScrollHeight={deviceHeight / 4}>
        <View style={[CommonStyle.container, { paddingTop: 76 }]}>
          <Text style={[CommonStyle.title, { lineHeight: 40, marginBottom: isError ? 0 : 40 }]}>{t('signIn')}</Text>
          {isError ? (
            <CustomAlert
              style={{ marginVertical: 16 }}
              type="error"
              content="Error: Invalid Username/Password"
              autoClose={false}
              manualClose={() => {
                setIsError(false);
              }}
            />
          ) : null}
          <TextField
            label={t('usernameLabel')}
            placeholder={t('username')}
            labelStyle={CommonStyle.inputLabel}
            inputStyle={CommonStyle.input}
            placeholderTextColor={Colors.mediumBorder}
            onChangeText={(text) => handleChangeText('username', text)}
          />
          <TextField
            label={t('password')}
            placeholder={t('password')}
            secureTextEntry={true}
            wrapperStyle={{ marginVertical: 16 }}
            labelStyle={CommonStyle.inputLabel}
            inputStyle={CommonStyle.input}
            placeholderTextColor={Colors.mediumBorder}
            onChangeText={(text) => handleChangeText('password', text)}
          />
          <Button
            title={t('signIn')}
            buttonStyle={CommonStyle.primaryButton}
            titleStyle={CommonStyle.primaryTitle}
            disabledStyle={CommonStyle.disabledPrimaryButton}
            disabledTitleStyle={CommonStyle.primaryTitle}
            loading={handlingRequest}
            onPress={handleLogin}
            disabled={username === '' || password === ''}
          />
          <Text style={[CommonStyle.linkText, { marginTop: 20 }]} onPress={handleMoreOptions}>
            {t('moreOptions')}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: any) => ({
  isUserLoggingIn: state.user.isUserLoggingIn,
  hasUserLoggedIn: state.user.hasUserLoggedIn,
  ldClient: state.launchDarkly.ldClient,
  appOptions: state.appOptions,
});

const mapDispatchToProps = (dispatch: any) => ({
  handleUserLogin: (username: string, password: string) => dispatch(userLogin(username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
