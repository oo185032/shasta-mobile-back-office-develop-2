import { StyleSheet } from 'react-native';
import { Colors, Fonts, CustomDimensions } from './Values'

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background
      },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'stretch',
        paddingTop: CustomDimensions.contentPaddingTop,
        paddingLeft: CustomDimensions.contentPadding,
        paddingRight: CustomDimensions.contentPadding,
        paddingBottom: CustomDimensions.contentPadding,
    },
    inputLabel: {
        color: Colors.secondary,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        fontWeight: 'normal',
        paddingBottom: 4,
        marginLeft: -8,
        lineHeight:24
    }, 
    input: {
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        fontWeight: 'normal',
        lineHeight:24,
        color:Colors.text
    },
    title: {
        color: Colors.text,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.header
    }, 
    primaryButton: {
        backgroundColor: Colors.primary,
        borderRadius: CustomDimensions.borderRadius,
        height:44,
    },
    primaryTitle: {
        color: Colors.primaryText,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        fontWeight: '400',
    },
    secondaryButton: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.lightBorder,
        borderRadius: CustomDimensions.borderRadius,
        padding: CustomDimensions.secondaryButtonPadding,
    }, 
    secondaryTitle: {
        color: Colors.text,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        fontWeight: '400',
    },
    primaryTwoUpButton: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        borderRadius: CustomDimensions.borderRadius,
        borderWidth: 1,
        height: 44,
        padding: 5
    },
    disabledPrimaryButton: {
        backgroundColor: Colors.disabledPrimary,
        borderColor: Colors.disabledPrimary,
        fontWeight: '400',
    },
    secondaryTwoUpButton: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderRadius: CustomDimensions.borderRadius,
        borderColor: Colors.lightBorder,   
        height: 44,
        padding: 5   
    },
    linkText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: Fonts.size.small
    }
})