import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getLocationWise = async (pageNo, address = '') => {
  let token = await AsyncStorage.getItem('token');
  // localhost:8282/turfbooking/turf/getLocationWiseTurfDetails/0?address=Kharadi Pune
  return Axios.get(
    `turfbooking/turf/getLocationWiseTurfDetails/${pageNo}?address=${address}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export default getLocationWise;
