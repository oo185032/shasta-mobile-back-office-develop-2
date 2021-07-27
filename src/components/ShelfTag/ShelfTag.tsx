import React, {useEffect, useState} from 'react';
import { View, ScrollView, SafeAreaView, Text, StyleSheet, Dimensions} from 'react-native';
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
import { formatPrice } from '../../utils/StringUtils';
import moment from 'moment';
import { NewItem } from '../../redux/store/itemAttributes';
import { createNewItem } from '../../redux/actions/item-details';
import { StackNavigationProp } from '@react-navigation/stack';
import InProgress from '../InProgress';
import { customAlerts } from '../../redux/store/customAlerts'
import { Item, ItemId } from '../../redux/store/Item';
import { setDetectChangeErrorAlert } from '../../redux/actions/customAlerts';
import { UPC_DUPLICATE_ERROR } from '../../services/itemService';
import ErrorAlertModal from '../ErrorAlertModal';

type ShelfTagRouteProp = RouteProp<DashboardStackParamList, 'ShelfTag'>;
type ShelfTagNavigationProp = StackNavigationProp<DashboardStackParamList, 'ShelfTag'>;

type Props = {
    items: Item[];
    route: ShelfTagRouteProp;
    navigation: ShelfTagNavigationProp;
    sendNewItem: any;
    customAlerts: customAlerts;
    toggleErrorAlertModal: any;
}

const ShelfTag = (props: Props) => {
    const { t, i18n } = useTranslation('shelfTag');
    const DEFAULT_TEXT = '';
    const { selectedPrice, newItem } = props.route.params;
    const defaultLabelQuantity = 1;
    const [handlingRequest, setHandlingRequest] = useState(false);
    const [labelCount, setLabelCount] = useState((newItem && newItem.itemPrice.quantity) ? newItem.itemPrice.quantity : defaultLabelQuantity);
    const [isError, setIsError] = useState(false);
    const [priceDetails, setPriceDetails] = useState(selectedPrice ?? null);
    let item: ItemId | undefined = undefined;

    useEffect(() => {
        if (newItem) {
            const priceDetail = {
                price: newItem.itemPrice.price,
                currency: newItem.itemPrice.currency,
                startDate: moment(newItem.itemPrice.effectiveDate).format('MM/DD/YYYY') ?? "",
                endDate: moment(newItem.itemPrice.endDate).format('MM/DD/YYYY') ?? "",
                priceType: "REGULAR",
                priceCode: "",
                batchId: "",
                batchName: "",
                status: "CURRENT_AND_FUTURE"
            }
            setPriceDetails(priceDetail);
        }
        
        if (props.items.length > 0) {
            item = props.items[0].itemId
        }
        
    }, []);

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

    const saveAndPrint = () => {
        if (!newItem) return;
        setHandlingRequest(true);
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
    }

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
                        {newItem 
                            ?<View>
                                <Text style={styles.title}>{(newItem && newItem.shortDescription) ? newItem.shortDescription : DEFAULT_TEXT}</Text>
                                <Text style={styles.subtitle}>{(newItem && newItem.upc) ? newItem.upc : DEFAULT_TEXT}</Text>
                            </View>
                            :<ItemAvatar itemCode={item?.itemUPC} itemDesc={item?.itemDetails.description.shortDescription.value} />
                        }
                        {/*************************** Selected Price Details ***************************/}  
                        <View>
                        {
                        priceDetails && 
                            <PriceDetails 
                                type={priceDetails.priceType} 
                                headerText={`${priceDetails.priceType} ${t('price')}`} 
                                priceText={formatPrice(priceDetails.price, priceDetails.currency)} 
                                quantityText='$0.21 per oz'
                                priceCode={priceDetails.priceCode}
                                startDate={priceDetails.startDate} 
                                endDate={priceDetails.endDate} 
                                isLoyalty={priceDetails.priceType=="LOYALTY"}/>
                    }                    
                        </View>  
                        <Counter
                            defaultCounter= {labelCount}
                            labelText={t('quantity')}
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
        {addDuplicateUPCErrorModal()}
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
    items: state.itemDetails.items,
    customAlerts :  state.customAlerts
})

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    sendNewItem: ( newItem: NewItem ) => dispatch(createNewItem(newItem)),
    toggleErrorAlertModal: (showErrorAlert: boolean) =>
        dispatch(setDetectChangeErrorAlert(showErrorAlert))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(ShelfTag);