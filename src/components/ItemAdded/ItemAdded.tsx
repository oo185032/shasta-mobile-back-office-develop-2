import React, {useState} from 'react';
import { View, ScrollView, SafeAreaView, Text, StyleSheet, Dimensions, BackHandler} from 'react-native';
import {Modules, NavigationItem} from '../../navigations/NavigationItem';
import CommonStyle from "../../styles/CommonStyle";
import AppHeader from "../AppHeader";
import { useTranslation } from 'react-i18next';
import { CustomDimensions, Colors, Fonts } from '../../styles/Values'
import { NewItem } from '../../redux/store/itemAttributes';
import { Button } from "react-native-elements";
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigations/DashboardNavigator';
import CustomAlert from '../CustomAlert';
import { useEffect } from 'react';
import moment from 'moment';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { formatPrice } from '../../utils/StringUtils';
import { connect } from 'react-redux';
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import { Department } from '../../redux/store/departments';

type ItemAddedNavigationProp = StackNavigationProp<DashboardStackParamList, 'ItemAdded'>;
type ItemAddedRouteProp = RouteProp<DashboardStackParamList, 'ItemAdded'>;
type Props = {
    navigation: ItemAddedNavigationProp;
    route: ItemAddedRouteProp;
    item: NewItem;
	departments: Department[];
    categories: Department[];
    subCategories: Department[];
}
   const ItemAdded = (props: Props) => {
    const { t, i18n } = useTranslation('itemAdded');

    const DEFAULT_TEXT = '';
    const { item } = props.route.params;;
    const [requiredShowSuccessMessage, setRequiredShowSuccessMessage] = useState(true)
    const [nesting, setNesting] = useState('');

    useEffect(() => {

        if (requiredShowSuccessMessage) {
            setTimeout(() => {
                setRequiredShowSuccessMessage(false)
            }, 3000)
        }

		if (item && item.nodeId) {
			const nodeItems = item.nodeId.split('-');
			if (nodeItems.length > 3) {
				const subCategoryId = nodeItems[nodeItems.length - 1];
				const categoryId = nodeItems[nodeItems.length - 2];
				const departmentId = nodeItems[nodeItems.length - 3];
				
				const departmentName = props.departments.find(d => d.departmentId === departmentId)?.departmentName ?? DEFAULT_TEXT;
				const categorytName = props.categories.find(c => c.departmentId === categoryId)?.departmentName ?? DEFAULT_TEXT;
				const subCategories = props.subCategories.find(s => s.departmentId === subCategoryId)?.departmentName ?? DEFAULT_TEXT;

				setNesting(departmentName  + '/' + categorytName + '/' + subCategories);

			}
		}
        
    }, [])

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            props.navigation.push(NavigationItem.BarcodeScanner, { module: Modules.NewItem }) 
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <SafeAreaView style={CommonStyle.safeArea}>
            <AppHeader title={t('title')} backNavigationRoute={NavigationItem.BarcodeScanner} backNavigationOptions={{module: Modules.NewItem}}/>
            {
                requiredShowSuccessMessage && 
                <View style={{ marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 10 }}>
                    <CustomAlert type='success' content={t('savedMessage')} autoClose={false} manualClose={() => { setRequiredShowSuccessMessage(false) }}/>
                </View>
            }
            <ScrollView>
                <View style={CommonStyle.container}>
                    <Text style={styles.title}>{(item && item.shortDescription) ? item.shortDescription : DEFAULT_TEXT}</Text>
                    <Text style={styles.subtitle}>{(item && item.upc) ? item.upc : DEFAULT_TEXT}</Text>
                    <View style={styles.content}>
                        {/*************************** Description Field ***************************/}
                        <View style={styles.verticalTextBox}>
                            <Text style={styles.attribute}>{t('itemDescription')}</Text>
                            <Text style={styles.attributeValue}>
                                {(item && item.longDescription) ? item.longDescription : DEFAULT_TEXT}
                            </Text>  
                        </View>
                        {/*************************** Department Field ***************************/}
                        <View style={styles.verticalTextBox}>
                            <Text style={styles.attribute}>{t('itemAttributes')}</Text>
                            <Text style={styles.nestingText}>
                                {(nesting) 
                                    ? nesting 
                                    : DEFAULT_TEXT
                                }
                            </Text> 
                        </View>
                        {/*************************** SKU Field ***************************/}
                        <View style={styles.textBox}>
                            <Text style={styles.attribute}>{t('sku')}</Text>
                            <Text style={styles.attributeValue}>
                                {(item && item.sku) ? item.sku : DEFAULT_TEXT}
                            </Text>            
                        </View>
                        {/*************************** Price Field ***************************/}
                        <View style={styles.textBox}>
                            <Text style={styles.attribute}>{t('price')}</Text>
                            <Text style={styles.attributeValue}>
                                {(item && item.itemPrice.price && item.itemPrice.currency) ? formatPrice(item.itemPrice.price, item.itemPrice.currency) : DEFAULT_TEXT}
                            </Text>            
                        </View>
                        {/*************************** Price Multiple Field ***************************/}
                        <View style={styles.textBox}>
                            <Text style={styles.attribute}>{t('priceMultiple')}</Text>
                            <Text style={styles.attributeValue}>
                                {(item && item.itemPrice.priceMultiplet) ? item.itemPrice.priceMultiplet + '' : DEFAULT_TEXT}
                            </Text>            
                        </View>
                        {/*************************** Start Date Field ***************************/}
                        <View style={styles.textBox}>
                            <Text style={styles.attribute}>{t('startDate')}</Text>
                            <Text style={styles.attributeValue}>
                                {(item && item.itemPrice.effectiveDate) ? moment(item.itemPrice.effectiveDate).format('MM/DD/YYYY') : DEFAULT_TEXT}
                            </Text>            
                        </View>
                        {/*************************** End Date Field ***************************/}
                        <View style={styles.textBox}>
                            <Text style={styles.attribute}>{t('endDate')}</Text>
                            <Text style={styles.attributeValue}>
                                {(item && item.itemPrice.endDate) ? moment(item.itemPrice.endDate).format('MM/DD/YYYY') : DEFAULT_TEXT}
                            </Text>            
                        </View>
                    </View>                                                                     
                </View>
            </ScrollView>

            {/*************************** Submit Button ***************************/}
            <View style={{ margin: 15 }}>
                <Button
                    title={t('returnButton')}
                    buttonStyle={CommonStyle.primaryButton}
                    titleStyle={CommonStyle.primaryTitle}     
                    onPress={() => props.navigation.push(NavigationItem.BarcodeScanner, { priceSync: false, module: Modules.NewItem })}
                />  
            </View>
        </SafeAreaView>    
  );

};


const styles = StyleSheet.create({
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
    content: {
        paddingTop: 4,
        paddingRight: 16,
        paddingBottom: 12,
        paddingLeft: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: Colors.secondary,
        borderRadius: CustomDimensions.borderRadius
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
	nestingText: {
        lineHeight: 24,
        fontFamily: Fonts.family,
        fontSize: Fonts.size.default,
		textTransform: 'capitalize',
    },
    textBox: {
        paddingTop: 8,
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    verticalTextBox: {
        paddingTop: 8,
        flexDirection: 'column',  
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
    primaryButton: {
        backgroundColor: Colors.primary,
        borderRadius: CustomDimensions.borderRadius,
        marginTop: 16,
        marginBottom: 16,
        width: 160,
        marginRight: 15,
        flex: 1
    }
})

const mapStateToProps = (state: any, ownProps: any) => ({
    departments: state.departments.departments ?? [],
    categories: state.departments.categories ?? [],
    subCategories: state.departments.subCategories ?? [],
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({});
export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(ItemAdded);