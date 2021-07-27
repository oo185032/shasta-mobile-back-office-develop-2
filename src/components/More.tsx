import React from 'react';
import { View, Text, SafeAreaView} from 'react-native';
import CommonStyle from '../styles/CommonStyle'
import AppHeader from "../components/AppHeader";

const MoreScreen = () => {
  
    return (
    <SafeAreaView style={CommonStyle.safeArea}>
      <AppHeader title="" hideBackButton={true}/>

    <View style={CommonStyle.container}>
      <Text>More Screen</Text>
    </View>
    </SafeAreaView>
  );

};

export default MoreScreen