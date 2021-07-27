import React, { MutableRefObject, useState } from "react";
import { View, StyleProp, ViewStyle, StyleSheet, 
        NativeSyntheticEvent, TextInputFocusEventData, 
        TextStyle } from "react-native";
import { InputProps} from "react-native-elements";
import { Colors, Fonts } from "../../styles/Values";
import ImageCapInset from 'react-native-image-capinsets-next';
import { TextInput } from "react-native-gesture-handler";

export interface TextFieldProps extends InputProps {
    hightAndWidth?: StyleProp<ViewStyle> //User provided height and weight
    verticalMargin?: StyleProp<ViewStyle> //User provided verticalMargin
    inputTextStyle?: StyleProp<TextStyle> //User provided styles for input text
    inputRef?: MutableRefObject<null>
    defaultEntry?: string
    isInvalid?: boolean
  }

/***********************************************************************
 * This component is customizable form of TextField component.
 * Callers can set custom height, width and vertical margin.
 * It uses TextInput and not Input, where textAlign is more flexible
 ***********************************************************************/
const CustomTextField = (props: TextFieldProps) => {

    const [active, setActive] = useState(false)

    const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setActive(true)
        if (props.onFocus) {
            props.onFocus(e)
        }
    }
  
    const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setActive(false)
      if (props.onBlur) {
          props.onBlur(e)
      }
    }

    const getBackgroundImage = () => {
        if (props.disabled) {
            return require("../../assets/textfield_disable.png")
        } else if (props.isInvalid) {
            return require("../../assets/textfield_error.png")
        } else if (active) {
            return require("../../assets/textfield_focused.png")
        } else {
            return require("../../assets/textfield_default.png")
        }
    }

    return (
        <View style={[props.hightAndWidth, props.verticalMargin]}>
        <View style={{position: 'absolute'}}>
            <ImageCapInset
                  source={ getBackgroundImage() }
                  style = {props.hightAndWidth}
                  capInsets={{ top: 30, right: 30, bottom: 30, left: 30 }}/>
        </View>
        
        <TextInput
          {...props}
          ref={props.inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
          defaultValue={props.defaultEntry}
          style={[style.input, props.inputTextStyle]}
        /> 
      </View>
    );
}

const style = StyleSheet.create({
    input: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: Fonts.size.default,
        fontFamily: Fonts.family,
        backgroundColor: Colors.transparent,
        borderWidth: 1,
        borderColor: Colors.transparent,
    }
});

export default CustomTextField;