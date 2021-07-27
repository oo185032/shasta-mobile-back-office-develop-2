import React, { useState } from 'react';
import { connect } from "react-redux";
import { Text, Icon } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import { useTranslation } from 'react-i18next';
import { Colors, CustomDimensions, Fonts } from '../../styles/Values';
import { Item, ItemId } from '../../redux/store/Item';

type Props = {
    items: Item[];
}

const AdditionalDetails = (props: Props) => {
    const { t, i18n } = useTranslation(['additionalDetails', 'common']);
    const { items } = props
    const [isAdditionalDetailsExpanded, setIsAdditionalDetailsExpanded] = useState(false)
    let item: ItemId | undefined = undefined;
    
    if (items.length > 0) {
        item = items[0].itemId
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
                return ''
            }
        }
        return ''
    }

    /**************************************************************************************************/
    /* Per our conversation with Nicole on June 10 and June 11:
    /*  1. Existing UX does not fit Locations object we get in GET item details call.
    /*  2. BGC will not send Location for pilot, so we will not focus on Location
    /*  So, for now, keeping this method as a shell to be used when we need to work on locations later
    /**************************************************************************************************/
    const getLocations = () => {
        let returnVar;
        if ( isAdditionalDetailsExpanded && item && item.locations && item.locations.length > 0) 
        { /*
            item.locations.map( (elem, index) => {
                let displayLocation = '';
                returnVar = 
                    <View style={styles.textBox}>
                        <Text style={styles.item}>{t('location')}</Text>
                        <Text style={styles.item}>{displayLocation}</Text>
                    </View>
            })*/
        }
        return (
            returnVar             
        )        
    }

    const handleExpand = () => {        
        setIsAdditionalDetailsExpanded(!isAdditionalDetailsExpanded)
    }

    return (
        <View>
            <View style={{ marginTop: 24, paddingLeft: 10, display: 'flex', flexDirection: 'row'}}>
                <Text style={ styles.detailsText } onPress={handleExpand}>{t('additionalDetailsTitle')}</Text>
                <View style={{marginTop: 5, marginLeft: 7}}>
                    <Icon type='ionicon' size={12} style={{ marginLeft: 5, textAlignVertical: 'bottom' }} onPress={handleExpand}
                            name={isAdditionalDetailsExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}/>  
                </View>              
            </View>
                <View style={styles.itemContainer}>
                    <View style={styles.textBox}>
                        <Text style={[styles.item, {paddingTop:0}]}>{t('common:department')}</Text>
                        <Text style={[styles.item, {paddingTop: 0}]}>{departmentValue()}</Text>
                    </View>
                    {/* Keeping this piece of code over here for future work
                    {
                         isAdditionalDetailsExpanded && <> 
                            <View style={styles.textBox}>
                                <Text style={styles.item}>A Field Label</Text>
                                <Text style={styles.item}>Field Value</Text>
                            </View>
                         </>
                    } 
                    {getLocations()}
                    */}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    detailsText: {
        fontSize: 16, 
        fontFamily: Fonts.family, 
        lineHeight: 24
    },
    item: {
        fontFamily: Fonts.family,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        paddingTop: 8
    },
    itemContainer: {
        marginTop: 8,
        marginBottom: 8,
        paddingRight: 16,
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 8,
        display: 'flex', 
        borderRadius: CustomDimensions.borderRadius, 
        justifyContent: 'space-between', 
        borderColor: Colors.lightBorder, 
        borderWidth: 1                 
    },
    textBox: {
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
});

const mapStateToProps = (state: any, ownProps: any) => ({
    items: state.itemDetails.items
})

export default connect(
    mapStateToProps
)(AdditionalDetails)

