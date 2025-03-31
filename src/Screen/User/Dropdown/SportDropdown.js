import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from 'react-native';

import {useRoute} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import getAvailableslots from '../../Service/UserAPI/getAvailable-slots';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import postTurfBooking from '../../Service/UserAPI/postTurfBooking';
import getTurfforBooking from '../../Service/UserAPI/getTurf-forBooking';
import {useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import BookingSlot from './BookingSlot';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
const SportDropdown = () => {
  const [selectedSport, setselectedSport] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  return (
    <>
      <View style={styles.BGlowA}>
        <View style={styles.header}>
          <MaterialIcons name="sports" color={'black'} size={20} />
          <Text style={styles.title}>Select Sports</Text>
        </View>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            items={turfData.sportlist.map(item => ({
              label: item.sportsName,
              value: item.id, // Use the id as the value
              key: item.id.toString(),
            }))}
            style={{
              fontSize: 16,
              paddingHorizontal: 10,
              color: 'black',
            }}
            placeholder={{label: 'Select Sport', value: null}}
            useNativeAndroidPickerStyle={false}
            onValueChange={itemValue => {
              setselectedSport(itemValue); // Set the selected id in Formik
            }}
          />
          <AntDesign name="down" size={15} style={styles.icon} />
        </View>
        <Text style={styles.Text3}>Selected Sports is: {selectedSport}</Text>
      </View>
    </>
  );
};

export default SportDropdown;
