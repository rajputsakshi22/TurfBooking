import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getcountApiForDashBoard = async () => {
  const token = await AsyncStorage.getItem('token');
  const role = await AsyncStorage.getItem('role');
  const fkUserId = await AsyncStorage.getItem('turfID');

  //localhost:8282/turfbooking/booking/countApiForDashBoard?role=turfowner&fkUserId=1
  // (`turfbooking/booking/countApiForDashBoard?role=turfowner&fkUserId=${fkUserId}`, {
  return Axios.get(
    `turfbooking/booking/countApiForDashBoard?role=${role}&fkUserId=${fkUserId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export default getcountApiForDashBoard;
