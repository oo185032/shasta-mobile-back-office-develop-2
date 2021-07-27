import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Icon } from 'react-native-elements';
import { Colors } from '../../styles/Values';

interface Props {
  data: any;
  onSelected: Function;
  container?: object;
  dropDownContainer?: object;
  textStyle?: object;
  labelStyle?: object;
  selectedLabelStyle?: object;
  placeHolder?: string;
  zIndex?: number;
  zIndexInverse?: number;
  onOpen?: Function;
  defaultValue?: string;
  onDropdownOpen?: Function;
}

const DropDown = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(props.defaultValue || null);
  const [items, setItems] = useState(props.data);

  const dropdownOpen = (open: boolean) => {
    setOpen(open);
    props.onDropdownOpen && props.onDropdownOpen();
  };

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      showTickIcon={false}
      searchable={false}
      placeholder={props.placeHolder || ''}
      ArrowUpIconComponent={() => <Icon name="caret-up" type="ionicon" color={Colors.black} size={15} />}
      ArrowDownIconComponent={() => <Icon name="caret-down" type="ionicon" color={Colors.black} size={15} />}
      onChangeValue={(value: string) => {
        props.onSelected(value);
      }}
      style={props.container || styles.container}
      textStyle={props.textStyle || styles.textStyle}
      selectedItemLabelStyle={props.selectedLabelStyle || styles.selectedLabelStyle}
      listItemLabelStyle={props.labelStyle || styles.labelStyle}
      dropDownContainerStyle={props.selectedLabelStyle || styles.dropDownContainer}
      placeholderStyle={styles.placeholderStyle}
      setOpen={dropdownOpen}
      setValue={setValue}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.mediumBorder,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropDownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.black,
  },

  labelStyle: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 24,
    color: Colors.lightText,
  },
  selectedLabelStyle: {
    color: Colors.secondaryBlue,
  },
  placeholderStyle: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.lightText,
  },
});
export default DropDown;
