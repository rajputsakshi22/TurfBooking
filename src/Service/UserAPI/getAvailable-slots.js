import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getAvailableslots = async (date, turfId) => {
  let token = await AsyncStorage.getItem('token');
  console.log('user data from availableSlots:-', {date, turfId});
  // let turfId = await AsyncStorage.getItem("turfId");
  return Axios.get(
    `turfbooking/booking/available-slots?turfId=${turfId}&date=${date}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export default getAvailableslots;
