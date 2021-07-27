import React, { useRef } from 'react';
import {View, Keyboard, Platform, ViewProps} from 'react-native';
import { useState } from 'react';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import CommonStyle from '../../styles/CommonStyle'
import { convertDateToUTC } from '../../utils/DateUtils';
import TextField from '../TextField';

export interface DateRangeProps extends ViewProps {
    startDate: Date
    endDate: Date
    onSelectDateRange?: (startDate: Date, endDate: Date) => void
}

const PriceOverrideDateRange = (props: DateRangeProps) => {
    const { t, i18n } = useTranslation('priceOverrideDateRange');
    const [startDate, setStartDate] = useState(props.startDate)
    const [endDate, setEndDate] = useState(props.endDate)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showStartCalendar, setStartShowCalendar] = useState(false)
    const defaultStartDate = moment(new Date()).toDate()

    /****************************************************************************
     * Saves newly selected start date, then sends start and end dates to parent
     ****************************************************************************/
    const onSelectStartDate = (event: Event, selectedDate: Date|undefined) => {
        setStartShowCalendar(Platform.OS === 'ios');
        // If entered start date is later then end date, set the end date with that start date
        if (selectedDate) {
            setStartDate(selectedDate)
            if ( selectedDate > endDate) {
                setEndDate(selectedDate);
            } 
           
            // Send selected dates to parent
            if (props.onSelectDateRange){
                props.onSelectDateRange(selectedDate, endDate)
            }
        }
    }      

    /****************************************************************************
     * Saves newly selected end date, then sends start and end dates to parent
     ****************************************************************************/
    const onSelectEndDate = (event: Event, selectedDate: Date|undefined) => {
        setShowCalendar(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate)
            // Send selected dates to parent
            if (props.onSelectDateRange){
                props.onSelectDateRange(startDate, selectedDate)
            }
        }
    }

    /**************************************
     * onFocus function for start date
     *************************************/
    const showStartDatePicker = () => {
        Keyboard.dismiss();
        setStartShowCalendar(true)
    }  

    /**************************************
     * onFocus function for end date
     *************************************/
    const showEndDatePicker = () => {
        Keyboard.dismiss();
        setShowCalendar(true)
    }    

    return (
        <View>
            <TextField
                label={t('start')}
                placeholder={t('selectStartDate')}
                labelStyle={[CommonStyle.inputLabel, {paddingBottom: 0}]}
                rightIcon={{name: 'date-picker', type: 'app_icon', size: 24}}
                value={startDate ? t('dateFormat',{date:convertDateToUTC(startDate)}): ""}
                onFocus={showStartDatePicker}
                showSoftInputOnFocus={false}
            />
            <TextField
                label={t('end')}
                placeholder={t('selectEndDate')}
                wrapperStyle={{marginTop: 10, marginBottom: 10}}
                labelStyle={[CommonStyle.inputLabel, {paddingBottom: 0}]}
                rightIcon={{name: 'date-picker', type: 'app_icon', size: 24}}
                value={endDate ? t('dateFormat',{date:convertDateToUTC(endDate)}): ""}
                onFocus={showEndDatePicker}
                showSoftInputOnFocus={false}
            />
            {showCalendar && 
                <DateTimePicker
                    value={endDate}
                    mode='date'
                    minimumDate={startDate}
                    onChange={(event, date) => {onSelectEndDate(event, date)}}
                />
            }
            {showStartCalendar && 
                <DateTimePicker
                    value={startDate}
                    mode='date'
                    minimumDate={defaultStartDate}
                    onChange={(event, date) => {onSelectStartDate(event, date)}}
                />
            }                    
        </View>
    )
}

export default PriceOverrideDateRange