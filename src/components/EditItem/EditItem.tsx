import React, {useState} from 'react';
import { View, ScrollView, SafeAreaView, Text, StyleSheet, BackHandler} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {NavigationItem} from '../../navigations/NavigationItem';
import CommonStyle from "../../styles/CommonStyle";
import AppHeader from "../AppHeader";
import ItemAvatar from '../ItemAvatar';
import { useTranslation } from 'react-i18next';
import { CustomDimensions, Colors, Fonts } from '../../styles/Values'
import { connect } from "react-redux";
import { ItemWithAtrributesToEdit, ItemWithAttributes } from '../../redux/store/itemAttributes';
import { Button, CheckBox, Icon } from "react-native-elements";
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import { customAlerts } from '../../redux/store/customAlerts'
import  ConfirmModal from '../CustomAlertModal/CustomAlertModal'
import Counter from '../Counter';
import { setDetectChangeCustomAlert } from '../../redux/actions/customAlerts';
import { editItem } from '../../redux/actions/item-details';
import CustomAlert from '../CustomAlert';
import { getItemPrices } from '../../redux/actions/item-prices';


type EditItemNavigationProp = StackNavigationProp<DashboardStackParamList, 'EditItem'>;
type Props = {
    item: ItemWithAttributes;
    navigation: EditItemNavigationProp;
    customAlerts: customAlerts;
    toggleCustomAlertModal: any;
    sendEditedItem: any;
    getItemPrices: any;
}
   const EditItem = (props: Props) => {
    const { t } = useTranslation(['editItem', 'common']);
    const DEFAULT_TEXT = '';
    const DEFAULT_BOOLEAN = false;
    const CHECKBOX_SIZE = 18 
    const { item, customAlerts } = props;

    const defaultLabelQuantity = 1;
    const [labelCount, setLabelCount] = useState(defaultLabelQuantity);

    const [handlingRequest, setHandlingRequest] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSaveSuccesfull, setIsSaveSuccesfull] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    // Below are optional fields. If we don't get them from backend will not display them 
    // per our conversation with Nicole on May 19th.
  
    const initialWeight = (item && item.itemAttributes && item.itemAttributes.randomWeight) 
                                ?  item.itemAttributes.randomWeight : DEFAULT_BOOLEAN;
    const [randomWeightCheck, setRandomWeightCheck] = useState(initialWeight);

    const initialFSElibility = (item && item.itemAttributes && item.itemAttributes.foodStampEligible) 
                                    ?  item.itemAttributes.foodStampEligible : DEFAULT_BOOLEAN;
    const [foodStampCheck, setFoodStampCheck] = useState(initialFSElibility);

 
     // Description is a required field. 
    const defaultDescription = (item && item.itemDetails && item.itemDetails.description && item.itemDetails.description.longDescription) 
                                    ? item.itemDetails.description.longDescription.value : DEFAULT_TEXT

    // Collapsable section related fields
    const [isFlagsExpanded, setIsFlagsExpanded] = useState(true)
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true)
                                
    const handleDetailsExpand = () => {        
        setIsDetailsExpanded(!isDetailsExpanded)
    }
                                
    const handleFlagsExpand = () => {        
        setIsFlagsExpanded(!isFlagsExpanded)
    }


    const addConfirmModal = () =>{
        if(customAlerts && customAlerts.showCustomAlert){
            return (
                <ConfirmModal 
                title={t('unsaved_alert_header')}
                message={t('unsaved_alert_message')}
                backNavigationRoute={NavigationItem.DashboardStack}
            />
            )
        } 
    }

    const departmentValue = () => {
        if ( item ) {
            const deptId = item.departmentId ? item.departmentId : ''
            const deptName = item.departmentName ? item.departmentName : ''

            if( deptId && deptName){
                return deptId + ' - ' + deptName
            } else if( deptId || deptName ) {
                return deptId ? deptId : deptName
            } else {
                return DEFAULT_TEXT
            }
        }
        return DEFAULT_TEXT
    }

    const detectChange = () =>{        
        if( initialWeight == randomWeightCheck && initialFSElibility === foodStampCheck){
            return false
        } else {
            return true
        }
    }

    const backAction = () => {
        if(detectChange()){
                    props.toggleCustomAlertModal(true)
                  } else {
                    props.navigation.push(NavigationItem.Dashboard)
                }
      return true;
    };

    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
    
          return () =>  BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [detectChange])
      );

    /***********************************************************************
     * User provided item quantity coming from child component
     ***********************************************************************/
     const labelQuantity = (labelCount: number) => {
        setLabelCount(labelCount);
    }      
    
    /********************************************************************
     * Plain save operation
     *******************************************************************/
    const saveChanges = () => {  
        submitItem(false);
    }

    /**************************************************************************
     * Entry point to save and bring user to Shelf Tag component
     * This methood will make a call to save the edited item first. 
     * 1. If there is an error for SAVE it will display it
     * 2. Is SAVE is successful then will allow user to print
     * 
     * PLEASE NOTE that this is still work in progress since save operation
     * has been blocked by environment. So for now, bringing reques tag panel
     * without making a save call.
     *************************************************************************/    
    const saveAndPrint = () => { 
/*                     
        submitItem(true);
        if ( isSaveSuccesfull ) {
            setHandlingRequest(true);
            props.getItemPrices(item.itemUPC).then((respData : any) => {
                setHandlingRequest(false);
                if (!respData.error) { 
                    props.navigation.push(NavigationItem.EditItemShelfTag)
                } else {
                    //See Question 2 for Nicole for complete implementation
                    setIsError(true)
                    setErrorMessage('getPricesError')
                }
            });
        }
*/        
       
        setHandlingRequest(true);
        props.getItemPrices(item.itemUPC).then((respData : any) => {
            setHandlingRequest(false);
            if (!respData.error) { 
                props.navigation.push(NavigationItem.EditItemShelfTag)
            } else {
                //See Question 2 for Nicole for complete implementation
                setIsError(true)
                setErrorMessage('getPricesError')
            }
        });
    }

    /********************************************************************
     * This method will make a backend call to save item attributes and 
     * it will be called from plain save, save and print operations.
     *******************************************************************/  
    const submitItem = ( needsForwarding: boolean ) => {
        let editItem: ItemWithAtrributesToEdit = {
            item: {
                upc: item.itemUPC,
                departmentId: item.departmentId
            },
            itemAttributes: {
                randomWeight: item.itemAttributes.randomWeight,
                foodStampEligible: item.itemAttributes.foodStampEligible
            }
        }  

        setHandlingRequest(true);
        props.sendEditedItem(item.itemCode, editItem).then((respData : any) => {
            setHandlingRequest(false);
            //Success case
            if (!respData.error) { 
                if ( !needsForwarding ) {
                    setIsSaveSuccesfull(true); 
                    setIsError(false); 
                } 
            } else { //Failure case
                setIsSaveSuccesfull(false);
                setIsError(true);
                setErrorMessage('saveError')
            }
        })
    }


    return (
        <>
            <SafeAreaView style={CommonStyle.safeArea}>
            <AppHeader title={t('title')} backNavigationRoute={NavigationItem.DashboardStack} isChangeDetected={detectChange}/>
            {/*************************** Messages Section ***************************/}
            {
                isSaveSuccesfull && 
                <View style={{ marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 10 }}>
                    <CustomAlert type='success' content={t('savedMessage')} custom={{position: 'absolute', zIndex: 1}} 
                                autoClose={false} manualClose={() => { setIsSaveSuccesfull(false) }}/>
                </View>
            }  
            {
                isError && 
                <View style={{ marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 10 }}>
                    <CustomAlert type='error' content={t(`${errorMessage}`)} custom={{position: 'absolute', zIndex: 1}} 
                                autoClose={false} manualClose={() => { setIsError(false) }}/>
                </View>
            }              
            <ScrollView>
                <View style={[CommonStyle.container, {paddingTop: 0}]}>
                    <ItemAvatar itemCode={item?.itemUPC} itemDesc={item?.itemDetails.description.shortDescription.value} />
                    {/*************************** Item Flags ***************************/}
                    <View style={[styles.groupTitleContainer, {marginTop: 15}]}>
                        <Text style={styles.groupTitle} onPress={handleFlagsExpand}>{t('itemFlags')}</Text>
                        <View style={{marginTop: 5, marginLeft: 15}}>
                            <Icon type='ionicon' size={12} style={{ marginLeft: 5, textAlignVertical: 'bottom' }} onPress={handleFlagsExpand}
                                    name={isFlagsExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}/>  
                        </View> 
                    </View> 
                    {
                        isFlagsExpanded && <>
                        <View style={styles.container}>
                            {/*************************** Random Weight ***************************/} 
                            <View style={[styles.elementContainer, {marginTop: 0}]}>
                                <Text style={styles.attribute}>{t('randomWeight')}</Text>
                                <CheckBox
                                    checked={randomWeightCheck}
                                    checkedColor={Colors.primaryBlue}
                                    onIconPress={() => setRandomWeightCheck(!randomWeightCheck)}
                                    size={CHECKBOX_SIZE}
                                    uncheckedColor={Colors.mediumBorder}
                                    containerStyle={{padding:0, marginLeft:0, marginRight: 0, marginTop: 0}}
                                /> 
                            </View>  
                            {/*************************** Food Stamp Eligible ***************************/} 
                            <View style={styles.elementContainer}>
                                <Text style={styles.attribute}>{t('foodStampEligible')}</Text>                 
                                <CheckBox
                                    checked={foodStampCheck}
                                    checkedColor={Colors.primaryBlue}
                                    onIconPress={() => setFoodStampCheck(!foodStampCheck)}
                                    size={CHECKBOX_SIZE}
                                    uncheckedColor={Colors.mediumBorder}
                                    containerStyle={{padding:0, marginLeft:0, marginRight: 0}}
                                />                              
                            </View>                                      
                        </View>
                        </>
                    }
                    {/*************************** Additional Item Details ***************************/}
                    <View style={[styles.groupTitleContainer, {marginTop: 24}]}>
                        <Text style={styles.groupTitle} onPress={handleDetailsExpand}>{t('additionalItemDetails')}</Text>
                            <View style={{marginTop: 5, marginLeft: 15}}>
                                <Icon type='ionicon' size={12} style={{ marginLeft: 5, textAlignVertical: 'bottom' }} onPress={handleDetailsExpand}
                                        name={isDetailsExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}/>  
                            </View> 
                    </View>
                    {
                        isDetailsExpanded && <>
                        <View style={styles.container}>
                            <View style={[styles.elementContainer, {marginTop: 0}]}>
                                <Text style={styles.attribute}>{t('itemDescription')}</Text>           
                            </View>
                            <View style={{ flexDirection:'row', alignItems: 'center', justifyContent:'space-between'}}>
                                <Text style={styles.attributeValue}>{defaultDescription}</Text>
                            </View>

                            <View style={[styles.elementContainer, {marginTop: 16}]}>
                                <Text style={styles.attribute}>{t('common:department')}</Text> 
                                <Text style={styles.attributeValue}>{departmentValue()}</Text>
                            </View>

                            <View style={styles.elementContainer}>
                                <Text style={styles.attribute}>{t('sku')}</Text> 
                                <Text style={styles.attributeValue}>
                                    {(item && item.itemSKU) ? item.itemSKU: DEFAULT_TEXT}
                                </Text>
                            </View> 

                            {/*************************************************************************************************** 
                             * COMMENTING OUT PACK/SIZE FOR PILOT per our converstion with Nicole on June 30th & her to do list
                             ***************************************************************************************************/}
                            {   /* Converted pack field to string to check its existance since it is an optional field
                                    If it is 0, JS thinks that pack field wasn't sent. To be able to distinguish between 0 (falsy) and not sent (falsy)
                                    converted pack field to string to do check truthy/falsy check  */}
                            {/* <View style={styles.elementContainer}>
                                <Text style={styles.attribute}>{t('pack')}</Text> 
                                <Text style={styles.attributeValue}>                        

                                    {(item && item.itemAttributes && item.itemAttributes.pack + '') ? item.itemAttributes.pack : DEFAULT_TEXT}
                                </Text>
                            </View>

                            <View style={styles.elementContainer}>
                                <Text style={styles.attribute}>{t('size')}</Text> 
                                <Text style={styles.attributeValue}>
                                    {(item && item.itemAttributes && item.itemAttributes.size) ? item.itemAttributes.size : DEFAULT_TEXT}
                                </Text>
                            </View>    */}

                            <View style={styles.elementContainer}>
                                <Text style={styles.attribute}>{t('taxability')}</Text> 
                                <Text style={styles.attributeValue}>
                                    {(item && item.itemAttributes && item.itemAttributes.taxability) ? item.itemAttributes.taxability : DEFAULT_TEXT}
                                </Text>
                            </View>   

                            {/****************************************************************************************************** 
                             * COMMENTING OUT PACK/SIZE FOR PILOT per our converstion with Nicole on June 30th & her to do list
                             ******************************************************************************************************/}                            
                             {/* <View style={styles.elementContainer}>
                                <Text style={styles.attribute}>{t('timeRestrictions')}</Text> 
                                <Text style={styles.attributeValue}>
                                    {(item && item.itemAttributes && item.itemAttributes.timeRestriction) ? item.itemAttributes.timeRestriction : DEFAULT_TEXT}
                                </Text>
                            </View> */}

                            <View style={styles.elementContainer}>
                                <Text style={styles.attribute}>{t('ageRestrictions')}</Text> 
                                <Text style={styles.attributeValue}>
                                    {(item && item.itemAttributes && item.itemAttributes.ageRestriction) ? item.itemAttributes.ageRestriction : DEFAULT_TEXT}
                                </Text>
                            </View>                                                                                                                 
                        </View>
                        </>
                    } 

                    <Counter
                        //Figma says 32 for marginTop. 
                        // 8 px comes from groupTitleContainer's margin bottom.
                        // So 24 + 8 = 32 in total
                        containerMargin={{marginTop: 24}}
                        defaultCounter= {defaultLabelQuantity}
                        labelText={t('common:labelQuantity')}
                        onSelectCounter={labelQuantity}
                    />                                                                                       
                </View>
            </ScrollView>

            <View style={{ padding: 16, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    <Button
                        title={t('saveChanges')}
                        buttonStyle={CommonStyle.secondaryTwoUpButton}
                        titleStyle={CommonStyle.secondaryTitle}
                        onPress={saveChanges} 
                    />
                </View>
                <View style={{paddingLeft: 8, flex: 1}}>
                    <Button
                        title={t('saveAndPrintTag')}
                        buttonStyle={[CommonStyle.primaryTwoUpButton]}
                        titleStyle={CommonStyle.primaryTitle}
                        disabledStyle = {CommonStyle.disabledPrimaryButton}
                        disabledTitleStyle = {CommonStyle.primaryTitle}
                        onPress={saveAndPrint}
                        //disabled={selectedPrice === null}
                    />
                </View>
            </View>
        </SafeAreaView>    
        {addConfirmModal()}
        </> 
  );

};


const styles = StyleSheet.create({
    container: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.lightBorder,
        backgroundColor: '#fff',
        borderRadius: CustomDimensions.borderRadius,
        padding: 16,
        fontFamily: Fonts.family
    },
    elementContainer: {
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent:'space-between', 
        marginTop: 8
    },
    groupTitle: {
        fontFamily: Fonts.family,
        fontSize: 16,
        lineHeight: 24
    },
    groupTitleContainer: {
        marginLeft: 8, 
        display: 'flex', 
        flexDirection: 'row', 
        marginBottom: 8        
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
    }
})

const mapStateToProps = (state: any, ownProps: any) => ({
    detailedItems: state.itemDetails.items,
    item: state.itemAttributes.item,
    customAlerts :  state.customAlerts
})

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    sendEditedItem: ( itemCode: string, editedItem: ItemWithAtrributesToEdit ) => dispatch(editItem(itemCode, editedItem)),
    toggleCustomAlertModal: (showCustomAlert: boolean) => dispatch(setDetectChangeCustomAlert(showCustomAlert)),
    getItemPrices: ( barcode: string, isCurrentPrice: boolean ) => dispatch(getItemPrices(barcode, isCurrentPrice=true))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(EditItem)
