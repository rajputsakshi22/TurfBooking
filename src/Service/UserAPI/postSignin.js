/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const postSignin = async payload => {
  console.log('postsignin payload :-', payload);
  const Id = await AsyncStorage.getItem('customerID')
  console.log(Id);
  return await Axios.post(
    `turfbooking/customer/signin?username=${payload.username}&password=${payload.password}`,
  );
};

export default postSignin;
