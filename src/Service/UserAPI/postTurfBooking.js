import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const postTurfBooking = async payload => {
  console.log('Bookig data', payload);
  const token = AsyncStorage.getItem('token');
  return Axios.post('turfbooking/booking/turf', payload, {
    headers: {
      headers: {Authorization: `Bearer ${token}`},
    },
  });
};

export default postTurfBooking;
