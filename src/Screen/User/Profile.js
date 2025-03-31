import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {Caption, Title} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import getCustomerNameAndEmail from '../../Service/UserAPI/getCustomerProfile';
import imgPlaceHolder from '../Admin/user_boy.png';

import instagramImg from './img/instagram.png';
import facebookImg from './img/facebook.png';
import twitterImg from './img/twitter.png';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({name: '', email: ''});
  const navigation = useNavigation();

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const fkcustomerId = await AsyncStorage.getItem('customerID');
      const response = await getCustomerNameAndEmail();
      setCustomerInfo({
        name: response.data.name,
        email: response.data.email,
        fkcustomerId: fkcustomerId,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch customer info');
    }
  };

  const handleLogoutPress = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const imagePick = ({navigate}) => {
    ImagePicker.openPicker({cropping: true})
      .then(image => setProfile(image.path))
      .catch(error => console.log(error));
  };

  const SocialIcons = () => (
    <View style={styles.socialIconsContainer}>
      <TouchableOpacity style={styles.socialIcon}>
        <Image
          source={instagramImg}
          style={[styles.socialImg, {width: 33, height: 33}]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialIcon}>
        <Image source={facebookImg} style={styles.socialImg} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialIcon}>
        <Image
          source={twitterImg}
          style={[styles.socialImg, {width: 31, height: 31}]}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <ProfileImage profile={profile} onPickImage={imagePick} />
          <ProfileDetails customerInfo={customerInfo} />
          <SocialIcons />
        </View>
        <View style={styles.belowContainer}>
          <ProfileOption
            icon="calendar"
            text="My Booking"
            textStyle={{color: 'blue', fontWeight: 'bold'}} // Custom text styles
            iconStyle={{tintColor: 'blue'}} // Custom icon styles
            onPress={() => navigation.navigate('BookingHistory')}
          />
        </View>
        <View style={styles.belowContainer}>
          {/* <ProfileOption icon="envelope" text="Message" onPress={() => {}} /> */}
          <ProfileOption
            icon="share-alt"
            text="Invite a fried"
            onPress={() => {}}
          />
        </View>
        <View style={styles.belowContainer}>
          <ProfileOption icon="star" text="Rate us" onPress={() => {}} />
        </View>
        <View style={styles.belowContainer}>
          <ProfileOption
            icon="trash"
            text="Delect Account"
            onPress={() => {}}
          />
        </View>
        <View style={styles.belowContainer}>
          <ProfileOption
            icon="settings"
            text="Help & Support"
            onPress={() => {}}
          />
        </View>
        <View style={styles.belowContainer}>
          <ProfileOption
            icon="logout"
            text="Logout"
            onPress={handleLogoutPress}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const ProfileImage = ({profile, onPickImage}) => (
  <View style={styles.imgContainer}>
    <Image
      style={styles.image}
      source={profile ? {uri: profile} : imgPlaceHolder}
    />
    <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
      <Entypo name="pencil" size={20} color="#ff6600" />
    </TouchableOpacity>
  </View>
);

const ProfileDetails = ({customerInfo}) => (
  <View style={styles.textContainer}>
    <Title style={styles.name}>{customerInfo.name}</Title>
    <View style={styles.emailContainer}>
      <Icon name="envelope" size={14} color="#142d73" style={styles.icon} />
      <Caption style={styles.email}>{customerInfo.email}</Caption>
    </View>
  </View>
);

const ProfileOption = ({icon, text, onPress}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      onPress={onPress}
      style={styles.optionContainer}>
      <SimpleLineIcons
        name={icon}
        size={18}
        color="#010048"
        style={[styles.optionIcon, isHovered && {color: 'green'}]}
      />
      <Text style={[styles.optionText, isHovered && {color: 'green'}]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f5f5',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  imgContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 55,
    borderWidth: 3,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  textContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#142d73',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    color: '#142d73',
    fontWeight: '600',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  belowContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    padding: 10,
    marginBottom: 5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },

  optionIcon: {
    marginRight: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#010048',
    fontWeight: 'bold',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
    marginTop: 15,
  },
  socialIcon: {
    padding: 1,
  },
  socialImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import imgPlaceHolder from '../Admin/user_boy.png';
// import Entypo from 'react-native-vector-icons/Entypo';
// import {Caption, Title} from 'react-native-paper';
// import ImagePicker from 'react-native-image-crop-picker';
// import {useNavigation} from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import getCustomerNameAndEmail from '../../Service/UserAPI/getCustomerProfile';

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [customerInfo, setCustomerInfo] = useState({name: '', email: ''});
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchCustomerInfo();
//   }, []);

//   const fetchCustomerInfo = async () => {
//     try {
//       const fkcustomerId = await AsyncStorage.getItem('customerID');
//       const response = await getCustomerNameAndEmail();
//       console.log('get CustomerProfile>>>>>>>>>>>>>>>>>>>1234:', fkcustomerId);
//       setCustomerInfo({
//         name: response.data.name,
//         email: response.data.email,
//         fkcustomerId: fkcustomerId,
//       });
//     } catch (error) {
//       // console.log("get CustomerId >>>>>>>>>>>>>>>>>>>>:");
//       Alert.alert('Error', 'Failed to fetch customer info');
//     }
//   };
//   const handleLogoutPress = async () => {
//     try {
//       await AsyncStorage.removeItem('token');
//       navigation.navigate('Signin');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };
//   const handleProfilePress = () => {};
//   const handleMessagePress = () => {};
//   const handleLocationPress = () => {};
//   const handleSettingsPress = () => {};

//   const imagePick = () => {
//     ImagePicker.openPicker({
//       cropping: true,
//     })
//       .then(image => {
//         console.log(image);
//         setProfile(image.path);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.profileContainer}>
//         <View style={styles.imgContainer}>
//           <Image
//             style={styles.image}
//             source={profile ? {uri: profile} : imgPlaceHolder}
//           />
//           <TouchableOpacity
//             onPress={imagePick}
//             style={{alignItems: 'flex-end', top: -10}}>
//             <Entypo name="pencil" size={20} color="#ff6600" />
//           </TouchableOpacity>
//         </View>
//         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//           <View style={styles.textContainer}>
//             <Title style={styles.name}>{customerInfo.name}</Title>
//             <View style={styles.emailContainer}>
//               <View style={styles.iconContainer}>
//                 <Icon
//                   name="envelope"
//                   size={14}
//                   color="#142d73"
//                   style={styles.icon}
//                 />
//               </View>
//               <Caption style={styles.email}>{customerInfo.email}</Caption>
//             </View>
//           </View>
//         </View>
//       </View>
//       <View style={styles.belowContainer}>
//         <TouchableOpacity onPress={handleProfilePress}>
//           <View style={{flexDirection: 'row', padding: 20, marginRight: 190}}>
//             <SimpleLineIcons
//               name="user"
//               size={18}
//               color="#010048"
//               style={{marginRight: 20}}
//             />
//             <Text style={styles.iconText}>My Booking</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleMessagePress}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginRight: 200,
//               padding: 20,
//             }}>
//             <Icon
//               name="envelope"
//               size={18}
//               color="#010048"
//               style={{marginRight: 20}}
//             />
//             <Text style={styles.iconText}>Message</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleSettingsPress}>
//           <View style={{flexDirection: 'row', padding: 20, marginRight: 200}}>
//             <Icon
//               name="cog"
//               size={22}
//               color="#010048"
//               style={{marginRight: 20}}
//             />
//             <Text style={styles.iconText}>Settings</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleLogoutPress}>
//           <View style={{flexDirection: 'row', padding: 20, marginRight: 200}}>
//             <MaterialIcons
//               name="logout"
//               size={22}
//               color="#010048"
//               style={{marginRight: 20}}
//             />
//             <Text style={styles.iconText}>Logout</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Profile;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 5,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     flexDirection: 'column',
//   },
//   profileContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     margin: 6,
//     backgroundColor: '#f0f5f5',
//     borderRadius: 10,
//     padding: 10,
//     shadowColor: '#38Acec',
//     // shadowOffset: {
//     //   width: 0,
//     //   height: 10,
//     // },
//     shadowOpacity: 0.46,
//     shadowRadius: 10.14,
//     elevation: 2,
//   },
//   imgContainer: {},
//   textContainer: {
//     alignItems: 'center',
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   image: {
//     width: 110,
//     height: 110,
//     marginTop: 35,
//     borderRadius: 55,
//     borderWidth: 3,
//   },
//   // textContainer: {
//   //   marginTop: 5,
//   //   alignItems: 'center',
//   // },
//   name: {
//     fontFamily: 'Roboto-Bold',
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 5,
//   },
//   emailContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   iconContainer: {
//     marginRight: 5,
//   },
//   icon: {
//     // Icon styles...
//   },
//   email: {
//     fontFamily: 'Poppins-Bold',
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   belowContainer: {
//     flex: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     margin: 5,
//     backgroundColor: '#f0f5f5',
//     borderRadius: 10,
//     padding: 10,
//     shadowColor: '#38Acec',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.46,
//     shadowRadius: 11.14,
//     elevation: 10,
//     marginBottom: 50,
//   },

//   rowContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   iconText: {
//     fontSize: 16,
//     color: '#000',
//   },
// });
