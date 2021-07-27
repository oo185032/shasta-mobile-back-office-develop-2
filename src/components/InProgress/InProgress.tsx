import React, { useState }  from 'react';
import {
    StyleSheet,
    View
} from "react-native";
import { BallIndicator } from "react-native-indicators";
import { Text } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../styles/Values';

const InProgress = (props: any) => {
    const { t, i18n } = useTranslation('dashboard');
    return (
        <View style={styles.container} >
            <View style={styles.spinner}>
                <BallIndicator color={Colors.primary} /> 
                <View style={{ alignSelf: 'center', marginTop: 60 }}>
                    <Text style={{ fontSize: 16 }}>
                        {props.displayText || t('loading')}
                    </Text>
                </View>
            </View>        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: "center",
        position: 'absolute',
        width: '100%',
        zIndex: 2,
        height: '100%',
    },
    spinner: {
        display: 'flex',
        justifyContent: "center",
        alignContent: 'center'
    }
})


export default InProgress
