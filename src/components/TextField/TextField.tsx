import React, { MutableRefObject, useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { Image, Input, InputProps } from 'react-native-elements';
import { Colors, Fonts } from '../../styles/Values';
import ImageCapInset from 'react-native-image-capinsets-next';

export interface TextFieldProps extends InputProps {
  wrapperStyle?: StyleProp<ViewStyle>;
  inputRef?: MutableRefObject<null>;
  defaultEntry?: any;
  inputWidth?: number;
  isInvalid?: boolean;
  leftBadge?: boolean;
  incrementSign?: string;
}

const TextField = (props: TextFieldProps) => {
  const [active, setActive] = useState(false);

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setActive(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setActive(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const getBackgroundImage = () => {
    if (props.disabled) {
      return require('../../assets/textfield_disable.png');
    } else if (props.isInvalid) {
      return require('../../assets/textfield_error.png');
    } else if (active) {
      return require('../../assets/textfield_focused.png');
    } else {
      return require('../../assets/textfield_default.png');
    }
  };

  return (
    <View style={props.wrapperStyle}>
      <View style={{ position: 'absolute', left: -7, bottom: 4 }}>
        {Platform.OS === 'ios' ? (
          <Image
            source={getBackgroundImage()}
            style={{ width: Dimensions.get('window').width - 18, height: 70, resizeMode: 'stretch' }}
            capInsets={{ top: 30, right: 30, bottom: 30, left: 30 }}
          />
        ) : (
          <ImageCapInset
            source={getBackgroundImage()}
            style={{ width: props.inputWidth || Dimensions.get('window').width - 18, height: 70 }}
            capInsets={{ top: 30, right: 30, bottom: 30, left: 30 }}
          />
        )}
      </View>
      {props.leftBadge && (
        <View style={style.indicatorStyle}>
          <Text style={style.incrementalSign}>{props.incrementSign}</Text>
        </View>
      )}
      <Input
        {...props}
        ref={props.inputRef}
        onFocus={onFocus}
        onBlur={onBlur}
        errorStyle={{ height: 0 }}
        inputContainerStyle={style.input}
        defaultValue={props.defaultEntry}
        style={{ fontSize: 16, fontFamily: Fonts.family, lineHeight: 24 }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  input: {
    backgroundColor: Colors.transparent,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: Platform.OS === 'ios' ? 8 : 3,
    paddingBottom: Platform.OS === 'ios' ? 8 : 3,
    borderWidth: 1,
    borderColor: Colors.transparent,
  },
  indicatorStyle: {
    width: 17,
    marginBottom: 11,
    marginLeft: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: Colors.lightGrey,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementalSign: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default TextField;
