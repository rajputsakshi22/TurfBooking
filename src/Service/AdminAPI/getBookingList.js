import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getBookingList = async pageNo => {
  let token = await AsyncStorage.getItem('token');
  let turfId = await AsyncStorage.getItem('turfID');
  console.log('payload', pageNo, turfId);
  return Axios.get(
    `turfbooking/booking/turfbookingAcceptedList/${pageNo}?turfId=${turfId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default getBookingList;
