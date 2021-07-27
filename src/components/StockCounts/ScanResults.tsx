import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Overlay, Icon, Card, Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NavigationItem } from '../../navigations/NavigationItem';
import CommonStyle from '../../styles/CommonStyle';
import { Colors } from '../../styles/Values';
import CustomAlert from '../CustomAlert';
import ItemAvatar from '../ItemAvatar';

const WIDTH = Dimensions.get('window').width;

type Props = {
  onClose: any;
  showError: boolean;
};

interface Item {
  title: string;
  status: string;
  count: string;
}

const ScanResults = (props: Props) => {
  const [error, setIsError] = useState(true);
  const [success, setIsSuccess] = useState(true);
  const [visible, setVisible] = useState(true);
  const [itemNotFound, setItemNotFound] = useState(false);
  const navigation = useNavigation();

  const getContent = () => {
    return (
      <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>Item is not found in any open documents</Text>
    );
  };

  const getSuccessContent = () => {
    return <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>Item exists in 2 open documents:</Text>;
  };
  const notFoundAlert = () => {
    return <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>Item is not found in the Catalog</Text>;
  };

  const badgeColor = (status: string) => {
    let color = Colors.errorBorder;
    if (status === 'Open') {
      color = Colors.errorBorder;
    } else if (status === 'Pending') {
      color = Colors.primary;
    } else {
      color = Colors.primary;
    }
    return color;
  };
  const renderItem = ({ item }: { item: Item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.horizontalItem}>
        <Text style={styles.documentName}>{item.title}</Text>
        <Badge
          status={'success'}
          value={item.status}
          badgeStyle={[styles.badge, { backgroundColor: badgeColor(item.status) }]}
        />
      </View>
      <View style={styles.horizontalItem}>
        <View style={styles.row}>
          <Text style={styles.countType}>{item.count}</Text>
          <Text style={styles.docId}>HBC00123</Text>
        </View>

        <Text style={styles.lines}>3 Lines</Text>
      </View>
      <View style={styles.horizontalItem}>
        <Text style={styles.userId}>User ID</Text>
        <View style={styles.row}>
          <Text style={styles.date}>Created:</Text>
          <Text style={styles.date}>03/21/2021</Text>
          <Text style={styles.time}>4:56 PM</Text>
        </View>
      </View>
      <View style={styles.horizontalItem}>
        <Text style={styles.userId}>User ID</Text>
        <View style={styles.row}>
          <Text style={styles.date}>Modified:</Text>
          <Text style={styles.date}>03/21/2021</Text>
          <Text style={styles.time}>4:59 PM</Text>
        </View>
      </View>
    </Card>
  );

  const onCloseOverlay = () => {
    props.onClose;
    setVisible(false);
  };

  const onAddNew = () => {
    setVisible(false);
    navigation.navigate(NavigationItem.ChooseCountType);
  };

  const onCreateNew = () => {
    setVisible(false);
    navigation.navigate(NavigationItem.ChooseCountType);
  };

  return (
    <Overlay isVisible={visible} overlayStyle={{ width: WIDTH, flex: 1, marginTop: 10, marginBottom: 50 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>Scan Results</Text>
          <TouchableOpacity onPress={onCloseOverlay} activeOpacity={0.8}>
            <Icon name="close-outline" type="ionicon" color={Colors.black} size={30} />
          </TouchableOpacity>
        </View>
        {props.showError && (
          <View style={{ flex: 1 }}>
            {itemNotFound && (
              <CustomAlert
                style={{ margin: 16 }}
                type="error"
                content={notFoundAlert()}
                autoClose={false}
                manualClose={() => {
                  setItemNotFound(false);
                }}
              />
            )}
            <View style={styles.buttonWrapper}>
              <Button
                title="Ok"
                buttonStyle={CommonStyle.primaryButton}
                titleStyle={CommonStyle.primaryTitle}
                onPress={() => setVisible(false)}
              />
            </View>
          </View>
        )}
        {!props.showError && (
          <View style={{ flex: 1 }}>
            <ItemAvatar url="../../assets/icecream.png" itemCode="Pepsi, 0.33 L" itemDesc="4578987654334567" />

            {error && (
              <CustomAlert
                style={{ margin: 16 }}
                content={getContent()}
                type="warning"
                autoClose={false}
                manualClose={() => {
                  setIsError(false);
                }}
              />
            )}
            {/*        
                {success &&<CustomAlert 
                    style={{margin: 16}} 
                    content={getSuccessContent()}
                    type='success' 
                    autoClose={false}
                    borderColor={Colors.orange}
                    successIconColor={Colors.orange}
                    backgroundColor={"rgba(240, 104, 30, 0.40)"} 
                    manualClose={() => {setIsSuccess(false)}}
                    
                    />}
             <View>
               <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            </View>


            <View style={styles.addNew}>
            <TouchableOpacity style={styles.row} activeOpacity={0.9} onPress={onAddNew}>
                    <Icon name='add' type='antdesign' color={Colors.primary} size={20} />
                    <Text style={styles.add}>Add New</Text>
                </TouchableOpacity>
            </View> */}
            <View style={styles.buttonWrapper}>
              <Button
                title="Create New Free Count"
                buttonStyle={CommonStyle.primaryButton}
                titleStyle={CommonStyle.primaryTitle}
                onPress={onCreateNew}
              />
            </View>
          </View>
        )}
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalHeaderText: {
    flex: 1,
    fontSize: 19,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: '400',
  },
  card: {
    borderRadius: 5,
    margin: 0,
    marginVertical: 5,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: Colors.primary,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.secondary,
    marginVertical: 20,
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  horizontalItem: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  rightAlign: {
    textAlign: 'right',
  },
  add: {
    fontSize: 14,

    marginLeft: 5,

    color: Colors.primary,
  },
  filter: {
    fontSize: 14,

    marginLeft: 5,
    color: Colors.primary,
  },
  storeName: {
    marginLeft: 5,
    color: Colors.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  documentName: {
    fontSize: 14,
    lineHeight: 24,
    color: Colors.black,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  countType: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
    fontSize: 12,
    lineHeight: 16,
    backgroundColor: Colors.primaryLight,
  },
  docId: {
    padding: 2,
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 5,
  },
  lines: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
  },
  userId: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
  },
  date: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
    marginRight: 2,
  },
  time: {
    color: Colors.lightText,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 3,
  },
  addNew: {
    marginTop: 10,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
  },
});

export default ScanResults;
