import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getTurfOwnerNameAndEmail = async () => {
  let token = await AsyncStorage.getItem('token');
  let fkUserId = await AsyncStorage.getItem('turfID');
  let role = await AsyncStorage.getItem('role');

  return Axios.get(
    `turfbooking/turf/getTurfOwnerNameAndEmail?fkUserId=${fkUserId}&role=${role}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export default getTurfOwnerNameAndEmail;
