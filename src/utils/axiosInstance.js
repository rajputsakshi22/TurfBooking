import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

const instance = Axios.create({
  baseURL: 'http://192.168.1.27:8282/',
  // baseURL: 'https://amr.embel.co.in:/',
  // 'http://192.168.1.6:8282/',
  // baseURL: 'http://192.168.10.4:8282/',
  timeout: 500000,
  headers: {'Access-Control-Allow-Origin': '*'},
});
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.log('error :' + JSON.stringify(error));
    console.log('error in axiosInstance before :-', error);
    if (
      error.message === 'Network Error' ||
      error.message === 'Request failed with status code 404'
    ) {
      let refreshToken = await AsyncStorage.getItem('refreshToken');
      return await Axios.post(
        `http://192.168.1.27:8282/turfbooking/customer/refreshToken?refreshToken=${refreshToken}`,
        // `https://amr.embel.co.in:/turfbooking/customer/refreshToken?refreshToken=${refreshToken}`,
      ).then(tokenRefreshResponse => {
        console.log(tokenRefreshResponse.data.accessToken);
        AsyncStorage.setItem('token', tokenRefreshResponse.data.accessToken);
        return Promise.resolve();
      });
    }
    console.log('Rest promise error');
    return Promise.reject(error);
  },
);

export default instance;
