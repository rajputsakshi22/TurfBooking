/* eslint-disable prettier/prettier */
import Axios from '../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const postAdminSignin = async payload => {
  const token = await AsyncStorage.getItem('token');
  console.log('postsignin payload :-', payload);
  return await Axios.post(
    `turfbooking/turf/signin?username=${payload.username}&password=${payload.password}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export default postAdminSignin;
