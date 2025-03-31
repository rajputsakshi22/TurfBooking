/* eslint-disable prettier/prettier */
import Axios from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getTurfforBooking = async turfId => {
  const token = await AsyncStorage.getItem('token');

  console.log('From turf for booking ', turfId);
  return Axios.get(`turfbooking/booking/getTurf-forBooking?turfId=${turfId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export default getTurfforBooking;
