import React, {useEffect, useState} from 'react';
import { View, ScrollView, SafeAreaView, Text, StyleSheet } from 'react-native';
import {NavigationItem} from '../../navigations/NavigationItem';
import CommonStyle from "../../styles/CommonStyle";
import AppHeader from "../AppHeader";
import ItemAvatar from '../ItemAvatar';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { CustomDimensions, Colors, Fonts } from '../../styles/Values'
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import PriceDetails from '../PriceDetails';
import Counter from '../Counter';
import CustomAlert from '../CustomAlert';
import { RouteProp } from '@react-navigation/native';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import { ItemWithAttributes, NewItem } from '../../redux/store/itemAttributes';
import { createNewItem } from '../../redux/actions/item-details';
import { StackNavigationProp } from '@react-navigation/stack';
import InProgress from '../InProgress';
import { customAlerts } from '../../redux/store/customAlerts'
import { Item } from '../../redux/store/Item';
import { setDetectChangeErrorAlert } from '../../redux/actions/customAlerts';
//import ErrorAlertModal from '../ErrorAlertModal';
import { ItemPrice } from '../../redux/store/itemPrices';

type ShelfTagRouteProp = RouteProp<DashboardStackParamList, 'ShelfTag'>;
type ShelfTagNavigationProp = StackNavigationProp<DashboardStackParamList, 'ShelfTag'>;

type Props = {
    prices: ItemPrice[];
    item: ItemWithAttributes;
    items: Item[];
    route: ShelfTagRouteProp;
    navigation: ShelfTagNavigationProp;
    sendNewItem: any;
    customAlerts: customAlerts;
    toggleErrorAlertModal: any;
}

const EditItemShelfTag = (props: Props) => {
    const { t, i18n } = useTranslation('editItemShelfTag');
    const defaultLabelQuantity = 1;
    const [handlingRequest, setHandlingRequest] = useState(false);
    const [labelCount, setLabelCount] = useState(defaultLabelQuantity);
    const [isError, setIsError] = useState(false);
    const { prices, item } = props
    const [selectedUpdated, setSelectedUpdated] = useState(false);


    /***********************************************************************************
     * This method will be used to set the isSelected field in each price object 
     * during initialization.
     * UX requires each price to be selected when Request Shelf Tag panel first loaded
     ***********************************************************************************/
    useEffect(() => {
        //If there is an update in PriceDetails section, exit. It is not inital case.
        if( selectedUpdated ) {
            return;
        }

        //Set isSelected field to true for each price object.
        prices.map((item)=>{
            item.isSelected = true;
        });
        //console.log('Initial prices: ', prices)
      });


    /****************************************************************************************
     * Each time when user presses/clicks on a price in Price Detail child object,
     * it lets this parent know about this action via handleSelection method.
     * 
     * This method:
     * 1. Sets selectedUpdated field to indicate that this is not the inital state anymore
     * 2. Finds the correct price and updates its isSelected field.
     * 
     * isSelected field will be used later when we utilize POST label item api.
     ***************************************************************************************/
    const handleSelection = (selection: any) => {
        setSelectedUpdated(true)

        prices.map((item)=>{
            if ( item.priceCode === selection)
                item.isSelected = !item.isSelected;
        });
        //console.log('Updated prices: ', prices)
    }


    {/*************************** Data and Handlers for Label Format Picker ***************************/}
    const [selectedLabelFormat, setSelectedLabelFormat] = useState('Shelf Talker');
    const labelFormats = ['Shelf Talker','Promo','End Cap'];
    const refreshPickerLabelFormats = () => {
        return labelFormats.map( (s, i) => {
            if ( s === selectedLabelFormat) {
                return <Picker.Item label={s} value={s} color="rgba(60, 76, 228, 1)" style={styles.attributeValue} key={i}/>
            } else {
                return <Picker.Item label={s} value={s} color={Colors.secondary} style={styles.attributeValue} key={i}/>
            }
        })
    };
    let pickerLabelFormatItems = refreshPickerLabelFormats(); 
    const processNewLabelFormat = (newLabelFormat: string) => {
        setSelectedLabelFormat(newLabelFormat);
        pickerLabelFormatItems = refreshPickerLabelFormats();        
    }

    {/*************************** Data and Handlers for Print Location Picker ***************************/}
    const [selectedPrintLocation, setSelectedPrintLocation] = useState('RTI Lab');
    const printLocations = ['RTI Lab'];
    const refreshPickerPrintLocations = () => {
        return printLocations.map( (s, i) => {
            if ( s === selectedPrintLocation) {
                return <Picker.Item label={s} value={s} color="rgba(60, 76, 228, 1)" style={styles.attributeValue} key={i}/>
            } else {
                return <Picker.Item label={s} value={s} color={Colors.secondary} style={styles.attributeValue} key={i}/>
            }
        })
    };
    let pickerPrintLocationItems = refreshPickerPrintLocations();

    const processNewPrintLocation = (newPrintLocation: string) => {
        setSelectedPrintLocation(newPrintLocation);
        pickerPrintLocationItems = refreshPickerPrintLocations();        
    }

    const getContent = () => {
        return <Text style={{ fontSize: 14, color: "#000" }}>Printer error. Out of tags.</Text>;
    };

    /****************************************************************************
     * This is a placeholder method. 
     * As of July9, 2021, this method has no use since backend api is not ready
     * 
     * QUESTION for Nicole:
     * What happens when there is an error on the print label call?
    ****************************************************************************/
    const saveAndPrint = () => {
        if (!prices || (prices && prices.length <= 0)) {
            return;
        }
        
        setHandlingRequest(true);
        //Make a call to the new label api
        //Either return to required panel or display an error
        props.navigation.push(NavigationItem.EditItem)
        setHandlingRequest(false);
/*
            props.sendNewItem(newItem).then((respData : any) => {
                setHandlingRequest(false);
                if (!respData.error) {
                    props.navigation.push(NavigationItem.ItemAdded, {item: newItem})                    
                } else if (respData.code == UPC_DUPLICATE_ERROR) {
                    props.toggleErrorAlertModal(true);
                } else {
                    setIsError(true);
                }
            })
*/ 
    }

    /**************************************************************************
     * As of July9, 2021, this method has no use since backend api is not ready
     * and we don't know what to do with an error case as in the question previous
     * method. 
     * 
     * It is coped from Add Item's request shelf tag file and will keep it here
     * until we have a clear direction about the error case
     */
    /*
    const addDuplicateUPCErrorModal = () =>{
        if(props.customAlerts && props.customAlerts.showErrorAlert){
            return (
                <ErrorAlertModal 
                    title={t('upc_duplicate_error_header')}
                    message={t('upc_duplicate_error_message')}
                />
            )
        } 
    }
    */


    return (
        <>
        <SafeAreaView style={CommonStyle.safeArea}>
            <AppHeader title={t('title')}/>
            {/*************************** Error Alert ***************************/}
            {isError && <View style={{margin:15}}>
                <CustomAlert
                    type='error'
                    content={getContent()}
                    autoClose={false}  
                    manualClose={() => {setIsError(false)}}                     
                    />
            </View>}
            { handlingRequest  
                ? <InProgress displayText={t('saveProgress')} />
                :<ScrollView>
                    <View style={[CommonStyle.container, {paddingTop: 0}]}>
                        <ItemAvatar itemCode={item?.itemUPC} itemDesc={item?.itemDetails.description.shortDescription.value} />
                        {/*************************** Price Details ***************************/}  
                        <View>
                        {
                            prices.map((item,index)=>{
                                return(
                                    <PriceDetails 
                                        key={index}
                                        isForMultipleSelection={true}
                                        isSelectedByDefault={true}
                                        onPressFunction={handleSelection} 
                                        type={item.priceType} 
                                        headerText={`${item.priceType} ${t('common:price')}`} 
                                        priceText={Number(item.quantity) <= 1 ? 
                                            `${t('common:priceConversion', { value: item.price })}` :
                                            `${t('common:priceWithQuantity', {quantity:item.quantity, value: item.price })}`}    
                                        //quantityText='$0.21 per oz'
                                        priceCode={item.priceCode}
                                        startDate={item.startDate} 
                                        endDate={item.endDate} 
                                        isLoyalty={item.priceType=="LOYALTY"}
                                        index={index}/>                            
                            )})
                        }
                        </View>  
                        <Counter
                            defaultCounter= {labelCount}
                            labelText={t('common:labelQuantity')}
                            onSelectCounter={setLabelCount}
                            />

                        {/*************************** Department Field ***************************/}                
                        <Text style={styles.attribute}>{t('labelFormat')}</Text>
                        <View style={styles.pickerBorder}>
                            <Picker
                                mode="dropdown"
                                selectedValue={selectedLabelFormat}
                                style={{color:"rgba(0, 0, 0, 1)"}}
                                onValueChange={itemValue => processNewLabelFormat(itemValue)}>
                                    {pickerLabelFormatItems}
                            </Picker>                    
                        </View>
                        {/*************************** Department Field ***************************/}                
                        <Text style={styles.attribute}>{t('printLocation')}</Text>
                        <View style={styles.pickerBorder}>
                            <Picker
                                mode="dropdown"
                                selectedValue={selectedPrintLocation}
                                style={{color:"rgba(0, 0, 0, 1)"}}
                                onValueChange={itemValue => processNewPrintLocation(itemValue)}>
                                    {pickerPrintLocationItems}
                            </Picker>                    
                        </View>
                                                                                                                
                    </View>
                </ScrollView>
            }
            {/*************************** Submit Button ***************************/}
            {!handlingRequest 
                &&<View style={{ margin: 15 }}>
                    <Button
                        title={t('submitButton')}
                        buttonStyle={CommonStyle.primaryButton}
                        titleStyle={CommonStyle.primaryTitle}  
                        onPress={saveAndPrint}   
                    />  
                </View>
            }
        </SafeAreaView>   
        </> 
  );

}

const styles = StyleSheet.create({
    attribute: {
        lineHeight: 24,
        color: Colors.secondary,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
    },
    title: {
        lineHeight: 24,
        fontWeight: "bold",
        color: Colors.text,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
    },
    subtitle: {
        lineHeight: 16,
        fontWeight: "400",
        color: Colors.secondary,
        fontFamily: Fonts.family,
        fontSize: 12,
    },
    attributeValue: {
        lineHeight: 24,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
    },
    pickerBorder: {
        borderWidth: 1, 
        borderColor: Colors.mediumBorder, 
        borderRadius: CustomDimensions.borderRadius, 
        marginBottom: 15
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        borderRadius: CustomDimensions.borderRadius,
        paddingTop: CustomDimensions.secondaryButtonPadding,
        paddingBottom: CustomDimensions.secondaryButtonPadding,
        width: 140,
        marginRight: 15
    },
    secondaryButton: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.mediumBorder,
        borderRadius: CustomDimensions.borderRadius,
        paddingTop: CustomDimensions.secondaryButtonPadding,
        paddingBottom: CustomDimensions.secondaryButtonPadding,
        marginLeft: 15,
        width: 140
    }
})

const mapStateToProps = (state: any, ownProps: any) => ({
    item: state.itemAttributes.item,
    customAlerts :  state.customAlerts,
    prices: state.itemPrices.item.itemPrices
})

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    sendNewItem: ( newItem: NewItem ) => dispatch(createNewItem(newItem)),
    toggleErrorAlertModal: (showErrorAlert: boolean) =>
        dispatch(setDetectChangeErrorAlert(showErrorAlert))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(EditItemShelfTag);