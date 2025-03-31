import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getUserByPhoneNo = async phoneNo => {
  let token = await AsyncStorage.getItem('token');

  console.log('payload', phoneNo);
  return Axios.get(`turfbooking/customer/getByPhoneNo?phoneNo=${phoneNo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default getUserByPhoneNo;
