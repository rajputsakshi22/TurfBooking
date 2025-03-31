import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getCustomerNameAndEmail = async () => {
  let token = await AsyncStorage.getItem('token');
  let fkCustomerId = await AsyncStorage.getItem('customerID');
  // return Axios.get(`turfbooking/customer/getCustomerNameAndEmail?fkCustomerId=1`, {
  return Axios.get(
    `turfbooking/customer/getCustomerNameAndEmail?fkCustomerId=${fkCustomerId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export default getCustomerNameAndEmail;
