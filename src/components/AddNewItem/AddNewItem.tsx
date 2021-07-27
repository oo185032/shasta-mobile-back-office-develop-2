import React, {useState} from 'react';
import { View, ScrollView, SafeAreaView, Text, StyleSheet, Dimensions} from 'react-native';
import CommonStyle from "../../styles/CommonStyle";
import AppHeader from "../AppHeader";
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomDimensions, Colors, Fonts } from '../../styles/Values'
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import Counter from '../Counter';
import CustomTextField from '../CustomTextField';
import TextField from '../TextField';
import { Platform } from 'react-native';
import { Keyboard } from 'react-native';
import moment from 'moment';
import { useRef } from 'react';
import { Department } from '../../redux/store/departments';
import { ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import {  Item, NewItem } from '../../redux/store/itemAttributes';
import { createNewItem, getItemAttributes } from '../../redux/actions/item-details';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import CustomAlert from '../CustomAlert';
import { Modules, NavigationItem } from '../../navigations/NavigationItem';
import InProgress from '../InProgress';
import { customAlerts } from '../../redux/store/customAlerts'
import  ConfirmModal from '../CustomAlertModal/CustomAlertModal'
import ErrorAlertModal from '../ErrorAlertModal';
import { setDetectChangeCustomAlert, setDetectChangeErrorAlert } from '../../redux/actions/customAlerts';
import { UPC_DUPLICATE_ERROR } from '../../services/itemService';
import { ValidationItem, validationMap } from './validationForm';
import { LayoutChangeEvent } from 'react-native';
import { getDepartments, EMPTY_KEY, EMPTY_VALUE } from '../../redux/actions/departments';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

type AddNewItemNavigationProp = StackNavigationProp<DashboardStackParamList, 'AddNewItem'>;

type Props = {
    navigation: AddNewItemNavigationProp;
    item: Item;
    departments: Department[];
    categories: Department[];
    subCategories: Department[];
    sendNewItem: any;
    getEditableItem: any;
    customAlerts: customAlerts;
    toggleErrorAlertModal: any;
    toggleCustomAlertModal: any;
    getCategories: any,
    getSubCategories: any,

}

const AddNewItem = (props: Props) => {
    const { t, i18n } = useTranslation('addNewItem');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    const { item, departments, customAlerts, categories, subCategories } = props;

    const [handlingRequest, setHandlingRequest] = useState(false);
    const [isError, setIsError] = useState(false)
    const [upc, setUPC] = useState('');
    const [sku, setSKU] = useState('');
    const [posDescription, setPosDescription] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [pack, setPack] = useState('');
    const [price, setPrice] = useState('');
    const defaultPriceMultiple = 1;
    const [priceMultiplet, setPriceMultiple] = useState(defaultPriceMultiple);
    const defaultStartDate = new Date();
    const defaultEndDate = moment(new Date()).add(30, 'days').toDate();
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [isEditStartDate, setEditingStartDate] = useState(false);
    const [isEditFinishDate, setEditingFinishDate] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const defaultLabelQuantity = 1;
    const [labelCount, setLabelCount] = useState(defaultLabelQuantity);
    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void

    const [validationDictionary, setValidationDictionary] = useState(validationMap)

    useEffect(() => {
        setUPC((item && item.itemUPC) ? item.itemUPC : '');
        setSKU((item && item.itemSKU) ? item.itemSKU : '');
        setItemDescription((item && item.itemDetails && item.itemDetails.description && item.itemDetails.description.longDescription 
            && item.itemDetails.description.longDescription.value) ? item.itemDetails.description.longDescription.value : '');
        setPosDescription((item && item.itemDetails && item.itemDetails.description && item.itemDetails.description.shortDescription 
            && item.itemDetails.description.shortDescription.value) ? item.itemDetails.description.shortDescription.value : '');
        setPack((item && item.itemAttributes && item.itemAttributes.pack) ? item.itemAttributes.pack +'' : '');

        if (departments && Array.isArray(departments)) {
            if (item && item.departmentId) {
                const department = departments.find(d => d.departmentId && (d.departmentId === item.departmentId));
                if (department?.departmentName) {
                    processNewDepartment(department.departmentId);
                } else {
                    setEmptyDepartment();
                }
            } else {
                setEmptyDepartment();
            }
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            props.toggleCustomAlertModal(true);
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    

    /*************************** Data and Handlers for Department Picker ***************************/
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const refreshPickerDepartments = () => {
        if (!departments || !Array.isArray(departments)) { return }
        return departments.map( (s, i) => {
            if (!s.departmentId || !s.departmentName) return;
            if ( s.departmentId === selectedDepartment) {
                return <Picker.Item label={s.departmentName} value={s.departmentId} color="rgba(60, 76, 228, 1)" style={styles.attributeValue} key={i}/>
            } else {
                return <Picker.Item label={s.departmentName} value={s.departmentId} color={Colors.secondary} style={styles.attributeValue} key={i}/>
            }
        })
    };
    let pickerDepartmentItems = refreshPickerDepartments(); 
    const processNewDepartment = (newDepartment: string) => {
        setSelectedDepartment(newDepartment);
        pickerDepartmentItems = refreshPickerDepartments();
        if (newDepartment != EMPTY_KEY) {
            validationDictionary.department.errorLabel = undefined;
            setIsVisibleCategory(true);
            setIsVisibleSubCategory(false);
            props.getCategories(newDepartment);
        }
    }

    const setEmptyDepartment = () => {
        const emptyDepartment: Department = {departmentId: EMPTY_KEY, departmentName: EMPTY_VALUE};
        if (!departments.find(d => d.departmentId && (d.departmentId === emptyDepartment.departmentId))) {
            departments.unshift(emptyDepartment);
            processNewDepartment(emptyDepartment.departmentId); 
        }
    }

    /*************************** Data and Handlers for Category Picker ***************************/
    const [isVisibleCategory, setIsVisibleCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const refreshPickerCategories = () => {
        return categories.map( (s, i) => {
            if (!s.departmentId || !s.departmentName) return;
            if ( s.departmentId === selectedCategory) {
                return <Picker.Item label={s.departmentName} value={s.departmentId} color="rgba(60, 76, 228, 1)" style={styles.attributeValue} key={i}/>
            } else {
                return <Picker.Item label={s.departmentName} value={s.departmentId} color={Colors.secondary} style={styles.attributeValue} key={i}/>
            }
        })
    };
    let pickerCategoryItems = refreshPickerCategories(); 
    const processNewCategory = (newCategory: string) => {
        setSelectedCategory(newCategory);
        pickerCategoryItems = refreshPickerCategories();
        
        if (newCategory != EMPTY_KEY) {
            validationDictionary.category.errorLabel = undefined;
            setIsVisibleSubCategory(true);
            props.getSubCategories(selectedDepartment, newCategory);
        }
    }

    /*************************** Data and Handlers for SubCategory Picker ***************************/
    const [isVisibleSubCategory, setIsVisibleSubCategory] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const refreshPickerSubCategories = () => {
        return subCategories.map( (s, i) => {
            if (!s.departmentId || !s.departmentName) return;
            if ( s.departmentId === selectedSubCategory) {
                return <Picker.Item label={s.departmentName} value={s.departmentId} color="rgba(60, 76, 228, 1)" style={styles.attributeValue} key={i}/>
            } else {
                return <Picker.Item label={s.departmentName} value={s.departmentId} color={Colors.secondary} style={styles.attributeValue} key={i}/>
            }
        })
    };
    let pickerSubCategoryItems = refreshPickerSubCategories(); 
    const processNewSubCategory = (newSubCategory: string) => {
        setSelectedSubCategory(newSubCategory);
        pickerSubCategoryItems = refreshPickerSubCategories();
        if (newSubCategory != EMPTY_KEY) {
            validationDictionary.subCategory.errorLabel = undefined;
        }
    }

    const setEmptySubCategory = () => {
        const emptySubCategory: Department = {departmentId: EMPTY_KEY, departmentName: EMPTY_VALUE};
        if (!subCategories.find(d => d.departmentId && (d.departmentId === emptySubCategory.departmentId))) {
            subCategories.unshift(emptySubCategory);
            processNewSubCategory(emptySubCategory.departmentId); 
        }
    }
    /************************************ Handle Date Picker **********************************/

    const onSelectDate = (event: Event, selectedDate: Date|undefined) => {
        setShowCalendar(Platform.OS === 'ios');
        if (selectedDate) {
            if (isEditStartDate) {
                setStartDate(selectedDate)
                setEditingStartDate(false)
            } else if (isEditFinishDate) {
                setEndDate(selectedDate)
                setEditingFinishDate(false)
            } 
        }
    }

    const showStartDatePicker = (target: any) => {
        setEditingStartDate(true)
        Keyboard.dismiss();
        setShowCalendar(true)
        inputRef.current.blur()   
    }

    const showFinishDatePicker = (target: any) => {
        setEditingFinishDate(true)
        Keyboard.dismiss();
        setShowCalendar(true)
        inputRef.current.blur()   
    }

    /************************************ Handle entered data **********************************/

    const updateUPC = (text: string) => {
        setUPC(text);
        validationDictionary.upc.errorLabel = undefined;
    }

    const updatePosDescription = (text: string) => {
        setPosDescription(text);
        validationDictionary.posDescription.errorLabel = undefined;
    }

    const updateItemDescription = (text: string) => {
        setItemDescription(text);
        validationDictionary.itemDescription.errorLabel = undefined;
    }

    const updatePack = (text: string) => {
        setPack(text);
        validationDictionary.pack.errorLabel = undefined;
    }

    const updatePrice = (text: string) => {
        setPrice(text);
        validationDictionary.price.errorLabel = undefined;
    }

    /************************************ Handle back navigation **********************************/

    const addConfirmModal = () =>{
        if(customAlerts && customAlerts.showCustomAlert){
            return (
                <ConfirmModal 
                    title={t('unsaved_alert_header')}
                    message={t('unsaved_alert_message')}
                    backNavigationRoute={NavigationItem.BarcodeScanner}
                    backNavigationOptions={{module: Modules.NewItem}}
                />
            )
        } 
    }

    /************************************ Handle submit buttons **********************************/

     const saveItem = () => {
        if (!validate()) {
            return;
        }
        const newItem = createNewItem();
         sendRequest(newItem, () => {props.navigation.push(NavigationItem.ItemAdded, {item: newItem})})
    }

    const sendRequest = (newItem: NewItem, successCallback: () => void) => {
        setHandlingRequest(true);
        props.sendNewItem(newItem).then((respData : any) => {
            setHandlingRequest(false);
            if (!respData.error) {
                successCallback();   
            } else if (respData.code == UPC_DUPLICATE_ERROR) {
                props.toggleErrorAlertModal(true);
            } else {
                setIsError(true);
            }
        })
    }
   
    const saveAndPrint = () => {
        if (!validate()) {
            return;
        }
        const newItem = createNewItem();
        props.navigation.push(NavigationItem.ShelfTag, {newItem: newItem});
    }

    const createNewItem = (): NewItem => {
        var newItem: NewItem = {
            copiedFromItemCode: (item && item.itemCode) ?? '',
            upc: upc,
            longDescription: itemDescription,
            shortDescription: posDescription,
            nodeId: `001-${selectedDepartment}-${selectedCategory}-${selectedSubCategory}`,
            departmentId: selectedDepartment,
            departmentName: departments.find(d => d.departmentId === selectedDepartment)?.departmentName,
            itemPrice: {
                price: Number(price),
                quantity: labelCount,
                currency: 'USD',
                effectiveDate: moment(startDate).format() ?? "",
                endDate: moment(endDate).format() ?? "",
            }
        }
        if (sku) {
            newItem.sku = sku;
        }
        return newItem;
    }

    const addDuplicateUPCErrorModal = () => {
        if(customAlerts && customAlerts.showErrorAlert) {
            return (
                <ErrorAlertModal 
                    title={t('upc_duplicate_error_header')}
                    message={t('upc_duplicate_error_message')}
                />
            )
        } 
    }

    const validate = () => {
        var firstInvalidYPosition: number|undefined;
        if (!validationDictionary.upc.allowEmpty && !upc) {
            validationDictionary.upc.errorLabel = t('emptyUPC');
            firstInvalidYPosition = validationDictionary.upc.yPosition;
        } else if (validationDictionary.upc.pattern && !upc.match(validationDictionary.upc.pattern)) {
            validationDictionary.upc.errorLabel = t('emptyUPC');
            firstInvalidYPosition = validationDictionary.upc.yPosition;
        }
        if (!validationDictionary.posDescription.allowEmpty && !posDescription) {
            validationDictionary.posDescription.errorLabel = t('emptyPosDescription');
            firstInvalidYPosition = firstInvalidYPosition ?? validationDictionary.posDescription.yPosition;
        } else if (validationDictionary.posDescription.pattern && !posDescription.match(validationDictionary.posDescription.pattern)) {
            validationDictionary.posDescription.errorLabel = t('posDescriptionLimit');
            firstInvalidYPosition = firstInvalidYPosition ?? validationDictionary.posDescription.yPosition;
        }
        if (!validationDictionary.itemDescription.allowEmpty && !itemDescription) {
            validationDictionary.itemDescription.errorLabel = t('emptyItemDescription');
            firstInvalidYPosition = firstInvalidYPosition ?? validationDictionary.itemDescription.yPosition;
        } else if (validationDictionary.itemDescription.pattern && !itemDescription.match(validationDictionary.itemDescription.pattern)) {
            validationDictionary.itemDescription.errorLabel = t('itemDescriptionLimit');
            firstInvalidYPosition = firstInvalidYPosition ?? validationDictionary.itemDescription.yPosition;
        }

        if (!selectedDepartment || selectedDepartment == EMPTY_KEY) {
            validationDictionary.department.errorLabel = t('selectDepartment');
            firstInvalidYPosition = validationDictionary.department.yPosition;
        }

        if (!selectedCategory || selectedCategory == EMPTY_KEY) {
            validationDictionary.category.errorLabel = t('selectCategory');
            firstInvalidYPosition = validationDictionary.category.yPosition;
        }

        if (!selectedSubCategory || selectedSubCategory == EMPTY_KEY) {
            validationDictionary.subCategory.errorLabel = t('selectSubCategory');
            firstInvalidYPosition = validationDictionary.subCategory.yPosition;
        }

        if (!validationDictionary.pack.allowEmpty && !pack) {
            validationDictionary.pack.errorLabel = t('emptyPack');
            firstInvalidYPosition = validationDictionary.pack.yPosition;
        }

        if (!validationDictionary.price.allowEmpty && !price) {
            validationDictionary.price.errorLabel = t('emptyPrice');
            firstInvalidYPosition = validationDictionary.price.yPosition;
        }

        Keyboard.dismiss();

        setValidationDictionary(validationDictionary);

        const findedError = Object.values(validationDictionary).find((item: ValidationItem) => item.errorLabel );
        if (findedError) {
            if (firstInvalidYPosition) {
                scrollViewRef.current.scrollTo({
                    x: 0,
                    y: firstInvalidYPosition,
                    animated: true
                  });
            }
            forceUpdate();
            return false
        }
        return true;
    }
  
    return (
        <>
        <SafeAreaView style={CommonStyle.safeArea}>
            <AppHeader 
                title={t('title')} 
                backNavigationRoute={NavigationItem.BarcodeScanner} 
                backNavigationOptions={{module: Modules.NewItem}} 
                isChangeDetected={() => { return true}}
            />
            { handlingRequest  
                ? <InProgress displayText={t('saveProgress')} />
                : <ScrollView ref={scrollViewRef}>
                    <View style={CommonStyle.container}>
                    {
                        isError && 
                        <View style={{marginBottom: 20, marginLeft: 10, marginRight: 10 }}>
                            <CustomAlert 
                                type='error' 
                                content={t('saveError')} 
                                autoClose={false} 
                                manualClose={() => { setIsError(false) }}/>
                        </View>
                    }
                        <Text style={styles.subtitle}>{t('required')}</Text>
                        {/*************************** UPC Field ***************************/}
                        <TextField
                            onLayout={(event: LayoutChangeEvent) => {validationDictionary.upc.yPosition = event.nativeEvent.layout.y}}
                            isInvalid={!!validationDictionary.upc.errorLabel}
                            label={t('upc')}
                            placeholder={t('placeholderUpc')}
                            labelStyle={CommonStyle.inputLabel}
                            keyboardType='number-pad'
                            value={upc}
                            onChangeText={upcText => updateUPC(upcText)}
                        />
                        {validationDictionary.upc.errorLabel 
                            && <Text style={styles.errorText}>{validationDictionary.upc.errorLabel}</Text>
                        }
                        {/*************************** POS Description Field ***************************/}
                        <Text style={[styles.attribute, {paddingTop: 3}]}>{t('posDescription')}</Text>
                        <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center' }}>
                            <CustomTextField
                                hightAndWidth = {styles.descriptionBox}
                                onLayout={(event: LayoutChangeEvent) => {validationDictionary.posDescription.yPosition = event.nativeEvent.layout.y}}
                                isInvalid={!!validationDictionary.posDescription.errorLabel}
                                inputTextStyle = {styles.descriptionText}
                                placeholder={t('placeholderPosDescription')}
                                keyboardType='visible-password'
                                onChangeText={editedDescription => updatePosDescription(editedDescription)}
                                value={posDescription}
                                multiline={true}
                                numberOfLines={5}
                            ></CustomTextField>                                
                        </View>
                        {validationDictionary.posDescription.errorLabel 
                            && <Text style={styles.errorText}>{validationDictionary.posDescription.errorLabel}</Text>
                        }
                        {/*************************** Item Description Field ***************************/}
                        <Text style={[styles.attribute, {paddingTop: 3}]}>{t('itemDescription')}</Text>
                        <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center' }}>
                            <CustomTextField
                                hightAndWidth = {styles.descriptionBox}
                                onLayout={(event: LayoutChangeEvent) => {validationDictionary.itemDescription.yPosition = event.nativeEvent.layout.y}}
                                isInvalid={!!validationDictionary.itemDescription.errorLabel}
                                inputTextStyle = {styles.descriptionText}
                                placeholder={t('placeholderItemDescription')}
                                keyboardType='visible-password'
                                onChangeText={editedDescription => updateItemDescription(editedDescription)}
                                value={itemDescription}
                                multiline={true}
                                numberOfLines={5}
                            ></CustomTextField>                                
                        </View>
                        {validationDictionary.itemDescription.errorLabel 
                            && <Text style={styles.errorText}>{validationDictionary.itemDescription.errorLabel}</Text>
                        }
                        {/*************************** Department Field ***************************/}                
                        <Text style={styles.attribute}>{t('department')}</Text>
                        <View style={validationDictionary.department.errorLabel ? styles.pickerErrorBorder : styles.pickerBorder}>
                            {
                                props.departments 
                                    ?   <Picker
                                            onLayout={(event: LayoutChangeEvent) => {validationDictionary.department.yPosition = event.nativeEvent.layout.y}}
                                            mode="dropdown"
                                            selectedValue={selectedDepartment}
                                            style={{color:"rgba(0, 0, 0, 1)"}}
                                            onValueChange={itemValue => processNewDepartment(itemValue)}>
                                                {pickerDepartmentItems}
                                        </Picker>
                                    :   <ActivityIndicator size="small" color={Colors.primary} />
                            }                                            
                        </View>
                        {validationDictionary.department.errorLabel 
                            && <Text style={styles.errorText}>{validationDictionary.department.errorLabel}</Text>
                        }
                        {/*************************** Category Field ***************************/}  
                        {
                            isVisibleCategory &&
                            <View>
                                <Text style={styles.attribute}>{t('category')}</Text>
                                <View style={validationDictionary.category.errorLabel ? styles.pickerErrorBorder : styles.pickerBorder}>
                                    {
                                        props.categories 
                                            ?   <Picker
                                                    onLayout={(event: LayoutChangeEvent) => {validationDictionary.category.yPosition = event.nativeEvent.layout.y}}
                                                    mode="dropdown"
                                                    selectedValue={selectedCategory}
                                                    style={{color:"rgba(0, 0, 0, 1)"}}
                                                    onValueChange={itemValue => processNewCategory(itemValue)}>
                                                        {pickerCategoryItems}
                                                </Picker>
                                            :   <ActivityIndicator size="small" color={Colors.primary} />
                                    }                                            
                                </View>
                                {validationDictionary.category.errorLabel 
                                    && <Text style={styles.errorText}>{validationDictionary.category.errorLabel}</Text>
                                }
                            </View>
                        }              
                        
                        {/*************************** SubCategory Field ***************************/}
                        {
                            isVisibleSubCategory &&
                            <View>
                                <Text style={styles.attribute}>{t('subCategory')}</Text>
                                <View style={validationDictionary.subCategory.errorLabel ? styles.pickerErrorBorder : styles.pickerBorder}>
                                    {
                                        props.subCategories 
                                            ?   <Picker
                                                    onLayout={(event: LayoutChangeEvent) => {validationDictionary.subCategory.yPosition = event.nativeEvent.layout.y}}
                                                    mode="dropdown"
                                                    selectedValue={selectedSubCategory}
                                                    style={{color:"rgba(0, 0, 0, 1)"}}
                                                    onValueChange={itemValue => processNewSubCategory(itemValue)}>
                                                        {pickerSubCategoryItems}
                                                </Picker>
                                            :   <ActivityIndicator size="small" color={Colors.primary} />
                                    }                                            
                                </View>
                                {validationDictionary.subCategory.errorLabel 
                                    && <Text style={styles.errorText}>{validationDictionary.subCategory.errorLabel}</Text>
                                }
                            </View>
                        }                
                        
                        {/*************************** SKU Field ***************************/}
                        <TextField
                            label={t('sku')}
                            placeholder={t('placeholderSku')}
                            labelStyle={CommonStyle.inputLabel}
                            keyboardType='number-pad'
                            value={sku}
                            onChangeText={upcText => setSKU(upcText)}
                        />
                        {/*************************** Pack Field ***************************/}
                        <TextField
                            onLayout={(event: LayoutChangeEvent) => {validationDictionary.pack.yPosition = event.nativeEvent.layout.y}}
                            isInvalid={!!validationDictionary.pack.errorLabel}
                            label={t('pack')}
                            placeholder={t('placeholderPack')}
                            labelStyle={CommonStyle.inputLabel}
                            keyboardType='number-pad'
                            value={pack}
                            onChangeText={packText => updatePack(packText)}
                        />     
                        {validationDictionary.pack.errorLabel 
                            && <Text style={styles.errorText}>{validationDictionary.pack.errorLabel}</Text>
                        }           
                        {/*************************** Price Field ***************************/}
                        <TextField
                            onLayout={(event: LayoutChangeEvent) => {validationDictionary.price.yPosition = event.nativeEvent.layout.y}}
                            isInvalid={!!validationDictionary.price.errorLabel}
                            label={t('price')}
                            placeholder={t('placeholderPrice')}
                            labelStyle={CommonStyle.inputLabel}
                            keyboardType='number-pad'
                            value={price}
                            onChangeText={price => updatePrice(price)}
                        />
                        {validationDictionary.price.errorLabel 
                            && <Text style={styles.errorText}>{validationDictionary.price.errorLabel}</Text>
                        }
                        {/*************************** Price Multiple Counter ***************************/}
                        <Counter
                            min={1}
                            defaultCounter= {priceMultiplet}
                            labelStyle={styles.counterLabel}
                            labelText={t('priceMultiple')}
                            onSelectCounter={setPriceMultiple}
                        />
                        {/*************************** Start Date ***************************/}
                        <TextField
                            label={t('startDate')}
                            labelStyle={CommonStyle.inputLabel}
                            rightIcon={{name: 'date-picker', type: 'app_icon', size: 26}}
                            value={startDate ? moment(startDate).format('MM/DD/YYYY') : ""}
                            onFocus={showStartDatePicker}
                            showSoftInputOnFocus={false}
                        />
                        {/*************************** End Date ***************************/}
                        <TextField
                            label={t('endDate')}
                            wrapperStyle={{marginTop: 10, marginBottom: 10}}
                            labelStyle={CommonStyle.inputLabel}
                            rightIcon={{name: 'date-picker', type: 'app_icon', size: 26}}
                            value={endDate ? moment(endDate).format('MM/DD/YYYY') : ""}
                            onFocus={showFinishDatePicker}
                            showSoftInputOnFocus={false}
                        />
                        {showCalendar && 
                            <DateTimePicker
                                value={endDate}
                                mode='date'
                                minimumDate={startDate}
                                onChange={(event, date) => {onSelectDate(event, date)}}
                            />
                        }

                        {/*************************** Label Quantity Counter ***************************/}   
                        <Counter
                            defaultCounter= {labelCount}
                            labelStyle={styles.counterLabel}
                            labelText={t('quantity')}
                            onSelectCounter={setLabelCount}
                            />
                                                                                                                
                    </View>
                </ScrollView>
            }
            {/*************************** Submit Buttons ***************************/}
            {!handlingRequest 
                && <View style={{  padding: 16, flexDirection:'row'}}>
                    <View style={{flex: 1}}>
                            <Button
                                title={t('saveItem')}
                                buttonStyle={CommonStyle.secondaryTwoUpButton}
                                titleStyle={CommonStyle.secondaryTitle}
                                onPress={saveItem} 
                            />
                    </View>
                    <View style={{paddingLeft: 8, flex: 1}}>
                        <Button
                            title={t('savePrint')}
                            buttonStyle={[CommonStyle.primaryTwoUpButton]}
                            titleStyle={CommonStyle.primaryTitle}
                            disabledStyle = {CommonStyle.disabledPrimaryTwoUp}
                            disabledTitleStyle = {CommonStyle.primaryTitle}
                            onPress={saveAndPrint}
                        />
                    </View>
                </View>
            }
        </SafeAreaView>
        {addConfirmModal()}
        {addDuplicateUPCErrorModal()}
        </>
  );

}

const styles = StyleSheet.create({
    subtitle: {
        paddingBottom: 10,
        color: Colors.text,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        fontWeight: '600',
    },
    errorText: {
        marginTop: -7,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        color: Colors.errorBorder,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
        fontWeight: '600',
    },
    attribute: {
        lineHeight: 24,
        color: Colors.secondary,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
    },
    attributeValue: {
        lineHeight: 24,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
    },
    textBox: {
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    descriptionText: {
        textAlignVertical: 'top', 
        textAlign: 'left', 
        paddingLeft: 25, 
        paddingRight: 25, 
        paddingTop: 25        
    },
    descriptionBox: {
        height: 110, 
        width: Dimensions.get('window').width - 18
    },
    pickerBorder: {
        borderWidth: 1, 
        borderColor: Colors.mediumBorder, 
        borderRadius: CustomDimensions.borderRadius, 
        marginBottom: 15
    },
    pickerErrorBorder: {
        borderWidth: 1, 
        borderColor: Colors.errorBorder, 
        borderRadius: CustomDimensions.borderRadius, 
        marginBottom: 15
    },
    counterLabel: {
        fontWeight: '400', 
        fontSize: Fonts.size.default, 
        color: Colors.lightText, 
        lineHeight: 32, 
        flex:4, 
        paddingBottom: 5
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        borderRadius: CustomDimensions.borderRadius,
        marginTop: 16,
        marginBottom: 16,
        width: 160,
        marginRight: 15,
        flex: 1
    },
    secondaryButton: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.mediumBorder,
        borderRadius: CustomDimensions.borderRadius,
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 15,
        width: 160,
        flex: 1
    }
})

const mapStateToProps = (state: any, ownProps: any) => ({
    item: state.itemAttributes.item,
    departments: state.departments.departments ?? [],
    categories: state.departments.categories ?? [],
    subCategories: state.departments.subCategories ?? [],
    customAlerts :  state.customAlerts
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    sendNewItem: ( newItem: NewItem ) => dispatch(createNewItem(newItem)),
    getEditableItem: ( barcode: string ) => dispatch(getItemAttributes(barcode)),
    getCategories: (departmentId: string) => dispatch(getDepartments(departmentId, undefined, true)),
    getSubCategories: (departmentId: string, categoryId: string) => dispatch(getDepartments(departmentId, categoryId, true)),
    toggleErrorAlertModal: (showErrorAlert: boolean) => dispatch(setDetectChangeErrorAlert(showErrorAlert)),
    toggleCustomAlertModal: (showCustomAlert: boolean) => dispatch(setDetectChangeCustomAlert(showCustomAlert))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(AddNewItem);