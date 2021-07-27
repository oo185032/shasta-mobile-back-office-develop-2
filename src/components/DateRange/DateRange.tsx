import React, { useRef, useState } from 'react';
import { View, Keyboard, Platform, ViewProps, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import CommonStyle from '../../styles/CommonStyle';
import TextField from '../TextField';
import { convertDateToUTC } from '../../utils/DateUtils';
import { Colors, Fonts } from '../../styles/Values';

export interface DateRangeProps extends ViewProps {
  startDate: Date;
  endDate: Date;
  onSelectDateRange?: (startDate: Date, endDate: Date) => void;
}

const DateRange = (props: DateRangeProps) => {
  const { t } = useTranslation('dateRange');
  const [startDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const endDateInputRef = useRef(null);

  const onSelectDate = (event: Event, selectedDate: Date | undefined) => {
    setShowCalendar(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
      if (props.onSelectDateRange) {
        props.onSelectDateRange(startDate, selectedDate);
      }
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const showDatePicker = () => {
    Keyboard.dismiss();
    setShowCalendar(true);
    endDateInputRef.current.blur();
  };
  return (
    <View style={{ paddingTop: 16, paddingLeft: 10 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{ fontSize: 12, color: Colors.secondaryBlue, fontFamily: Fonts.family, lineHeight: 14 }}
          onPress={handleExpand}>
          {t('showing')} {t('dateFormatShort', { date: convertDateToUTC(startDate) })} -{' '}
          {t('dateFormatShort', { date: convertDateToUTC(endDate) })}
        </Text>
        <View style={{ paddingLeft: 5 }}>
          <Icon
            name={isExpanded ? 'close' : 'edit'}
            type="app_icon"
            color={Colors.secondaryBlue}
            onPress={handleExpand}
            size={isExpanded ? 18 : 12}
          />
        </View>
      </View>
      {isExpanded && (
        <View style={{ paddingTop: 6, marginLeft: -10 }}>
          <TextField
            label={t('start')}
            placeholder={t('selectDate')}
            labelStyle={CommonStyle.inputLabel}
            rightIcon={{ name: 'date-picker', type: 'app_icon', size: 25 }}
            disabled={true}
            disabledInputStyle={{ color: 'rgba(0, 0, 0, 0.6)' }}
            value={t('dateFormat', { date: convertDateToUTC(startDate) })}
          />
          <TextField
            inputRef={endDateInputRef}
            label={t('end')}
            placeholder={t('selectDate')}
            wrapperStyle={{ marginTop: 5, marginBottom: 5 }}
            labelStyle={CommonStyle.inputLabel}
            rightIcon={{ name: 'date-picker', type: 'app_icon', size: 25 }}
            value={endDate ? t('dateFormat', { date: convertDateToUTC(endDate) }) : ''}
            onFocus={showDatePicker}
            showSoftInputOnFocus={false}
          />
          {showCalendar && (
            <DateTimePicker
              value={endDate}
              mode="date"
              minimumDate={startDate}
              onChange={(event, date) => {
                onSelectDate(event, date);
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default DateRange;
