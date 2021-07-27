import React, { useState, useEffect }  from 'react';
import {
    StyleSheet,
    View,
    Text,
    ViewProps,
    TouchableOpacity,
    StyleProp,
    ViewStyle
} from "react-native";

import { Icon } from 'react-native-elements';
import { Colors, CustomDimensions, Fonts } from '../../styles/Values';
import PropTypes from "prop-types"
export interface CustomAlertProps extends ViewProps {
    content: any
    type: 'success' | 'error' | 'warning'
    autoClose: boolean
    manualClose?: () => void
    borderColor?: string
    backgroundColor?: string
    successIconColor?: string
    custom?: StyleProp<ViewStyle>
  }

const CustomAlert = (props: CustomAlertProps) => {
    const [isOpen, setIsOpen] = useState(true)
    const { content, autoClose, } = props
    useEffect(() => {
        if (autoClose) {
        setTimeout(() => {
            setIsOpen(false)
        }, 3000)
        }
    })
    const getClass = () => {
        switch(props.type) {
            case 'success':
                return { name: 'check', color: Colors.successBorder, backgroundColor: Colors.successBackground, iconColor: Colors.successBorder, textColor: Colors.text }
            case 'error':
                return { name: 'exclamation', color: Colors.errorBorder, backgroundColor: Colors.errorBackground, iconColor: Colors.errorBorder, textColor: Colors.text }
            case 'warning':
                return { name: 'exclamation', color: Colors.primary, backgroundColor: Colors.primary, iconColor: Colors.primary, textColor: Colors.black }
            default:
                return { name: '', color: '', textColor: '' }
        }
    }

    const close = () => {
        if (autoClose) {
            setIsOpen(false)
        } else if(props.manualClose){
            props.manualClose()
        }
    }

    const { name, color, textColor, iconColor, backgroundColor } = getClass()

    return (
            isOpen ?
            <View style={[props.style, styles.container, props.custom, {backgroundColor:props.backgroundColor || backgroundColor, borderColor: props.borderColor || color }]}>
                <View style={styles.left}>
                    <Icon
                        name={name}
                        color={props.successIconColor || iconColor}
                        size={24}
                        type="evilicon"
                    />
                </View>
                <View style={styles.content}>
                    <Text style={{ ...styles.contentText, color: textColor, fontWeight: '400' }}>{content}</Text>
                </View>
                <View style={styles.right}>
                    <TouchableOpacity style={{ flex: 1, paddingLeft: 10, paddingRight: 10}} onPress={close}>
                        <Icon
                            name='close'
                            color={Colors.secondary} 
                            size={16}
                            type="material"
                        />
                    </TouchableOpacity>
            </View>
            </View>
            : null
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 5,
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        flex: 10
    },
    contentText: {
        fontSize: 14,   
        fontFamily: 'Inter',
        lineHeight: 24
    },
    left: {
        paddingTop: 2,
        flex: 1,
        fontWeight: '900'
    },
    right: {
        paddingTop: 3,
        display: 'flex'
    },
    text: {
        flex: 1, 
        paddingTop: 10, 
        paddingBottom: 8,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.small,
        fontWeight: 'normal'
    }
})


CustomAlert.propTypes={
    showCloseIcon:PropTypes.bool
  }

CustomAlert.defaultProps={
  showCloseIcon:true
}

export default CustomAlert
