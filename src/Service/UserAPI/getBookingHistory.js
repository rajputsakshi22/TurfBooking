// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Axios from '../../utils/axiosInstance';

// const getBookingHistory = async () => {
//   let token = await AsyncStorage.getItem('token');
//   let fkCustomerId = await AsyncStorage.getItem('customerID');

//   //localhost:8282/turfbooking/customer/getBookingHistory?fkCustomerId=8
//   return Axios.get(
//     `turfbooking/customer/getBookingHistory?fkCustomerId=${fkCustomerId}`,
//     {
//       headers: {Authorization: `Bearer ${token}`},
//     },
//   );
// };

// export default getBookingHistory;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

// Function to get booking history
const getBookingHistory = async () => {
  try {
    // Retrieve token and customer ID from AsyncStorage
    let token = await AsyncStorage.getItem('token');
    let fkCustomerId = await AsyncStorage.getItem('customerID');

    // Make the API call to get booking history
    const response = await Axios.get(
      `turfbooking/customer/getBookingHistory?fkCustomerId=${fkCustomerId}`,
      {
        headers: {Authorization: `Bearer ${token}`}, // Pass the token in the headers
      },
    );

    // Extract and parse the _response field from the request
    const bookingHistory = JSON.parse(response.request._response);

    return bookingHistory; // Return the parsed booking history data
  } catch (error) {
    console.error('Error fetching booking history:', error);
    throw error; // Throw error to be handled by the caller
  }
};

export default getBookingHistory;
