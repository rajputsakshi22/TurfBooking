/* eslint-disable prettier/prettier */
import Axios from '../../utils/axiosInstance';

const postSignup = async payload => {
  console.log('postsignup :-', payload);
  return Axios.post(`turfbooking/customer/signup`, payload);
};

export default postSignup;
