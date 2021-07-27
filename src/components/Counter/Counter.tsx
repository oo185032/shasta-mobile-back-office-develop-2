import React, { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { Icon } from 'react-native-elements';
import CommonStyle from '../../styles/CommonStyle';
import { Colors } from '../../styles/Values';
import CustomTextField from '../CustomTextField';

export interface CounterProps extends ViewProps {
    min?: number
    max?: number
    labelText: string
    labelStyle?: StyleProp<ViewStyle>
    containerMargin?: StyleProp<ViewStyle>
    defaultCounter: number
    onSelectCounter?: (counter: number) => void
}

const Counter = (props: CounterProps) => {
    const [counter, setCounter] = useState(props.defaultCounter)

    /*****************************************************************
    * Increments counter and provides the latest value to its parent
    ******************************************************************/    
    const increment = () => {
        if (props.max && counter >= props.max) { return }
        setCounter( counter + 1 )
        if( props.onSelectCounter ){
          props.onSelectCounter(counter + 1);
        }
      }

    /*****************************************************************
    * Decrements counter and provides the latest value to its parent
    ******************************************************************/      
    const decrement = () => {
      const minLimit = props.min ?? 0;
      if( counter > minLimit ) {
        setCounter( counter - 1 )
      }
      if( props.onSelectCounter ){
        props.onSelectCounter(counter - 1);
      }        
    }

    /*****************************************************************************************
    * Processes user entry into edit-able counter input box
    * This method:
    * 1. Gets the user provided string
    * 2. Converts it into a numeric field and analyzes that field:
    *   i. If the entered value is legit numeric field then passes to its callera as it is
    *   ii. If that value is not a legit numeric field then passes -10 to its caller, 
    *       to take an appropriate action 
    * 
    * NOTE: As of May 6, 2021 and per our conversation with Nicole on May 5, 2021, there are
    * no error cases strategy for this widget yet, so this method and its logic will need
    * further work once we have defined error strategies.
    *****************************************************************************************/         
    const processEditedCount = (enteredCount: string) => {
      
      // Indicator of invalid user entries, i.e. blank, -, etc
      let localCount = -10

      // Valid numeric entry case
      if( enteredCount && +enteredCount >= 0 ){
        localCount = + enteredCount
      }
      // Update counter 
      setCounter(localCount)

      // Pass the info to parent
      if( props.onSelectCounter ){
        props.onSelectCounter(localCount);
      }
    }

    return (
        <View style={[styles.container, props.containerMargin ?? {marginTop: 0}]}>          
          <Text style={props.labelStyle ?? [CommonStyle.secondaryTitle, styles.labelText]}> {props.labelText} </Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={decrement}>
                <Icon
                    name='minus'
                    color={Colors.secondary} 
                    size={20}
                    type='app_icon'
                />
            </TouchableOpacity>              
            <CustomTextField
                hightAndWidth = {{height: 42, width: 48}}
                verticalMargin = {{marginVertical: 5}}
                inputTextStyle = {{textAlign: 'center'}}
                labelStyle={CommonStyle.inputLabel}
                keyboardType='number-pad'
                onChangeText={editedCount => processEditedCount(editedCount)}
                value={counter >= 0 ? counter.toString(): ''}
            />
            <TouchableOpacity style={{paddingLeft: 4}} onPress={increment}>
                <Icon
                    name='add'
                    color={Colors.secondary} 
                    size={16}
                    type='app_icon'
                />
            </TouchableOpacity>                
          </View>  
        </View> 
    )
}

const styles = StyleSheet.create({
    container: {
      flexDirection:'row', 
      alignItems: 'center', 
    },
    labelText: {
      color: Colors.lightText,
      fontSize: 16, 
      lineHeight: 24, 
      flex:4, 
      paddingLeft: '3%'
    },
    counterContainer: {
      flexDirection:'row', 
      flex:2, 
      paddingRight: '10%', 
      justifyContent: 'center', 
      alignItems: 'center'      
    }
  })

  export default Counter