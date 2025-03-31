import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const getCityWiseSearch = async (pageNo, keyword) => {
  let token = await AsyncStorage.getItem('token');
  let fkUserId = await AsyncStorage.getItem('customerID');
  let role = await AsyncStorage.getItem('role');
  //localhost:8282/turfbooking/turf/getCityWiseSearch/0?keyword=p&role=customer&fkUserId=1
  return Axios.get(
    `/turfbooking/turf/getCityWiseSearch/${pageNo}?keyword=${keyword}&role=${role}&fkUserId=${fkUserId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export default getCityWiseSearch;
