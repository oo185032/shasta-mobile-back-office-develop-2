import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {NavigationItem} from '../navigations/NavigationItem';
import TabNavigator from './TabNavigator';
import DashboardNavigation from './DashboardNavigator';
import LoginForm from '../components/LoginForm';
import AppOptions from '../components/AppOptions';

export type RootStackParamList = {
    Login: undefined
    AppOptions: undefined
    Tabs: undefined
    DashboardStack: undefined
};

const AuthStack = createStackNavigator<RootStackParamList>();
const AuthNavigator: FunctionComponent = () => (
        <AuthStack.Navigator headerMode="none">
            <AuthStack.Screen name={NavigationItem.Login} component={LoginForm} />
            <AuthStack.Screen name={NavigationItem.AppOptions} component={AppOptions} />
            <AuthStack.Screen name={NavigationItem.DashboardStack} component={DashboardNavigation} />
        </AuthStack.Navigator>
    )

export default AuthNavigator;