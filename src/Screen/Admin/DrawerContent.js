import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, Alert} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getTurfOwnerNameAndEmail from '../../Service/AdminAPI/getAdminProfile';

const DrawerList = [
  {icon: 'home-circle', label: 'DashBoard', navigateTo: 'DashBoard'},
  {icon: 'bookshelf', label: 'Sports', navigateTo: 'Sports'},
  {icon: 'account', label: 'Profile', navigateTo: 'Profile'},
  {icon: 'account-group', label: 'Requested', navigateTo: 'Requested'},
  {icon: 'account-group', label: 'Accepted', navigateTo: 'Accepted'},
  {icon: 'application-edit', label: 'Booking Form', navigateTo: 'BookForm'},
  {icon: 'note-text', label: 'Notice', navigateTo: 'Notice'},
];
const DrawerLayout = ({icon, label, navigateTo}) => {
  const navigation = useNavigation();
  return (
    <DrawerItem
      icon={({color, size}) => (
        <Icon name={icon} color={'#010048'} size={size} />
      )}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo);
      }}
      style={styles.drawerItem}
      labelStyle={styles.drawerLabel}
    />
  );
};

const DrawerItems = () => {
  return DrawerList.map((el, i) => (
    <DrawerLayout
      key={i}
      icon={el.icon}
      label={el.label}
      navigateTo={el.navigateTo}
    />
  ));
};

const DrawerContent = props => {
  const navigation = useNavigation();
  const [OwnerProfile, setOwnerProfile] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState({name: '', email: ''});

  useEffect(() => {
    fetchOwnerInfo();
  }, []);

  const fetchOwnerInfo = async () => {
    try {
      const fkUserId = await AsyncStorage.getItem('turfID');
      const response = await getTurfOwnerNameAndEmail();
      console.log('get OwnerProfile>>>>>>>>>>>>>>>>>>>1234:', fkUserId);
      // console.log("get OwnerProfile111>>>>>>>>>>>>>>>>>>>1234:", response.data);
      setOwnerInfo({
        name: response.data.name,
        email: response.data.email,
        fkUserId: fkUserId,
      });
    } catch (error) {
      console.error('Failed to fetch owner info:', error);
      Alert.alert('Error', 'Failed to fetch owner info>>>>>>>>');
    }
  };
  const handleSignOut = () => {
    navigation.navigate('AdminSignin');
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <TouchableOpacity activeOpacity={0.8}>
            <View
              style={{
                width: '50%',
                height: 36,
                marginTop: 1,
                marginLeft: 12,
              }}>
              <Image
                style={{
                  width: '50%',
                  height: '100%',
                  resizeMode: 'contain',
                  // marginBottom:20,
                }}
                source={require('../../Images/download_prev_ui.png')}
              />
            </View>
            <View style={styles.userInfoSection}>
              <View style={styles.icons}>
                <SimpleLineIcons
                  name="user"
                  size={25}
                  color="white"
                  style={{
                    height: 59,
                    width: '79%',
                    marginTop: 7,
                    marginLeft: 9,
                  }}
                  onPress={() => redirectToUpdate(fkUserID)}
                />
              </View>
              <View
                style={{
                  marginLeft: 15,
                  width: '70%',
                  paddingRight: 5,
                }}>
                <Text
                  style={{
                    color: '#010048',
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    fontWeight: '700',
                    paddingLeft: 1,
                    padding: 4,
                  }}>
                  {ownerInfo.name}
                </Text>
                <View style={styles.container}>
                  <MaterialCommunityIcons
                    name="email"
                    size={12}
                    color="#010048"
                    style={styles.icon}
                  />
                  <Text style={styles.emailText}>{ownerInfo.email}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.drawerSection}>
            <DrawerItems />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color="#010048" size={size} />
          )}
          label="Sign Out"
          labelStyle={{color: '#010048'}}
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
};
export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 13,
  },
  userInfoSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
    shadowOpacity: 2,
    elevation: 10,
    borderRadius: 8,
    marginTop: 5,
    marginVertical: 1,
    height: 104,
    padding: 6,
    margin: 2,
    width: '98%',
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  icons: {
    borderRadius: 35,
    // backgroundColor: '#fff',
    alignContent: 'center',
    shadowColor: '#38Acec',
    shadowOpacity: 2,
    elevation: 20,
    shadowColor: '#38Acec',
    shadowOpacity: 0.46,
    shadowRadius: 8,
    width: '23%',
    marginLeft: 1,
    height: '57%',
    padding: 6,
    backgroundColor: '#e87a28',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  email: {
    fontSize: 14,
    color: '#142d73',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 2,
    marginTop: 1,
  },
  emailText: {
    color: '#010048',
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },

  textContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  captionA: {
    fontSize: 12,
    lineHeight: 14,
    color: '#010048',
  },
  headerText: {
    fontSize: 20,

    color: '#010048',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#010048',
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    backgroundColor: '#e87a28',
    borderRadius: 13,
    width: '96%',
    marginLeft: 5,
  },
  caption: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    lineHeight: 14,
    width: '100%',
    color: '#010048',
    fontWeight: '700',
  },
  drawerSection: {
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    backgroundColor: '#fff',
    shadowColor: '#38Acec',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
