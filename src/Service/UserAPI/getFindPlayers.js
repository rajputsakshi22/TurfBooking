/* eslint-disable prettier/prettier */
import Axios from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Correcting the pageNo parameter and using it correctly
const getFindPlayers = async pageNo => {
  const token = await AsyncStorage.getItem('token');
  return Axios.get(`turfbooking/customer/findPlayers/${pageNo}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};
export default getFindPlayers;
