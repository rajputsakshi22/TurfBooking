/* eslint-disable prettier/prettier */
import Axios from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAdminAllTurfList = async () => {
  const token = await AsyncStorage.getItem('token');
  return Axios.get(`turfbooking/turf/get-booking-forTurf/0?turfId=1`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export default getAdminAllTurfList;
