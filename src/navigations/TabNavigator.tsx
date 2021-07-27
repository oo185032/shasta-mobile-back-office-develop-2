import React, { FunctionComponent } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationItem} from '../navigations/NavigationItem';
import ReportingScreen from '../components/Reporting';
import MoreScreen from '../components/More';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import DashboardNavigation from './DashboardNavigator';
import {Icon} from 'react-native-elements';

type TabBarIconProps = {
    focused: boolean 
    color: string
    size: number
  };

const Tab = createBottomTabNavigator()

const TabNavigator: FunctionComponent = () => {
    const { t, i18n } = useTranslation('tabs');

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#5565FD',
                inactiveTintColor: '#777778',
                keyboardHidesTabBar: true,
                labelStyle: {
                    fontSize: 11
                  }
            }}
            >
            <Tab.Screen 
                name={NavigationItem.DashboardStack} 
                component={DashboardNavigation}
                options={{ 
                    unmountOnBlur: true,
                    tabBarLabel: t('home'),
                    tabBarIcon: (props: TabBarIconProps) => (
                        <Icon name='home_tab' 
                            type='app_icon' 
                            color={props.color}  
                            size={28}/>
                    )
                }} 
                />
            <Tab.Screen 
                name={NavigationItem.Reporting} 
                component={ReportingScreen}
                options={{ 
                    unmountOnBlur: true,
                    tabBarLabel: t('reporting'),
                    tabBarIcon: (props: TabBarIconProps) => (
                        <Icon name='reporting' 
                            type='app_icon' 
                            color={props.color}  
                            size={28}/>
                    )
                }} 
                />
            <Tab.Screen 
                name={NavigationItem.More} 
                component={MoreScreen} 
                options={{ 
                    unmountOnBlur: true,
                    tabBarLabel: t('more'),
                    tabBarIcon: ( props: TabBarIconProps ) => (
                        <Icon name='more' 
                            type='app_icon' 
                            color={props.color}  
                            size={28}/>
                    )
                    }}/>
        </Tab.Navigator>
    );
}   

const styles = StyleSheet.create({
    icon: {
      width: 28,
     height: 28,
    },
});

export default TabNavigator;