import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const putUpdateBooking = async (bookingId, status) => {
  let token = await AsyncStorage.getItem('token');
  // let status = 'accepted'
  console.log('payload', bookingId, status);
  return Axios.put(
    `turfbooking/booking/update-booking?bookingId=${bookingId}&status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default putUpdateBooking;
