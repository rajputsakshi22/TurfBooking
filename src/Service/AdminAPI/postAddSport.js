/* eslint-disable prettier/prettier */
import Axios from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const postAddSport = async payload => {
  console.log('postAddSport :-', payload);
  const token = await AsyncStorage.getItem('token');
  // console.log(token);
  return Axios.post(`turfbooking/sports/add`, payload, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export default postAddSport;
