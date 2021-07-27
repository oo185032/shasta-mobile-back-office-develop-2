import React, { useState }  from 'react';
import {  SafeAreaView } from "react-native";
import { Button, Text } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';
import {
    StyleSheet,
    View
} from "react-native";
import { useTranslation } from 'react-i18next';
import { NavigationItem } from "../../navigations/NavigationItem";
import CommonStyle from "../../styles/CommonStyle";
import AppHeader from "../AppHeader";
import CustomAlert from '../CustomAlert';
type Props = {
    items: any;
}

const ScanFail = (props: Props) => {
    const { t, i18n } = useTranslation('scanFail');
    const navigation = useNavigation();
    const { module } = props.route.params;
    const [isError, setIsError] = useState(true)
    const getContent = () => {
        return (
            <Text style={{ color: '#000' }}>
                {t('scanFailed')}{ ' '}
                <Text
                    style={{ color: '#000', textDecorationColor: '#000', textDecorationLine: 'underline', textDecorationStyle: 'solid' }}
                    onPress={() => { 
                        navigation.push(NavigationItem.ManualScan, { module })
                    }}
                >
                    {t('manualScan')}
                </Text>
            </Text>
        )
    }
    return (
        <SafeAreaView style={CommonStyle.safeArea}>
            <AppHeader title={t('title')} backNavigationRoute={NavigationItem.DashboardStack}/>
            <View style={styles.container}>
                <View style={styles.alertContainer}>
                {
                    isError ? 
                    <CustomAlert
                        type='error'
                        content={getContent()}
                        autoClose={false}
                        manualClose={() => {setIsError(false)}}
                    /> : null
                }
                </View>
                <View style={styles.buttonsContainer}>
                    <Button
                        title={t('scanNextItem')}
                        buttonStyle={{ backgroundColor: '#5565FD', marginBottom: 10, borderRadius: 5, padding: 20 }}
                        onPress={() => {
                            navigation.push(NavigationItem.BarcodeScanner, { module });
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
        flexGrow: 1
    },
    alertContainer: {
        flex: 5
    },
    buttonsContainer: {
        marginTop: 10 ,
        flex: 1,
        display: 'flex'
    }
});
  
export default ScanFail;

