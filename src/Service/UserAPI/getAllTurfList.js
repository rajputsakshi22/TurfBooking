/* eslint-disable prettier/prettier */
import Axios from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAllTurfList = async pageNo => {
  const token = await AsyncStorage.getItem('token');
  // return Axios.get(`turfbooking/turf/list/0`, {
  return Axios.get(`turfbooking/turf/list/${pageNo}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export default getAllTurfList;
