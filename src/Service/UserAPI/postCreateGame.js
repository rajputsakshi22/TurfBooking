import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

const postCreateGame = async payload => {
  console.log('post Create Game', payload);
  const token = AsyncStorage.getItem('token');
  return Axios.post('turfbooking/booking/addGameTeam', payload, {
    headers: {
      headers: {Authorization: `Bearer ${token}`},
    },
  });
};

export default postCreateGame;
