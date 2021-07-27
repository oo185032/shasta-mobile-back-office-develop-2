import React from 'react';
import { View, Text, SafeAreaView} from 'react-native';
import CommonStyle from '../styles/CommonStyle'
import AppHeader from "./AppHeader";

const ReportingScreen = () => {
  
    return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title="" hideBackButton={true}/>
    <View style={CommonStyle.container}>
      <Text>Reporting Screen</Text>
    </View>
    </SafeAreaView>
  );

};

export default ReportingScreen