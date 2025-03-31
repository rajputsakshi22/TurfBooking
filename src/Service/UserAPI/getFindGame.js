import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/axiosInstance';

// export const getFindGame = async (game = '') => {
//   try {
//     console.log('Game Parameter:', game); // Log the game parameter

//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       console.error('Token not found');
//       return [];
//     }

//     const response = await Axios.get(
//       `turfbooking/customer/findGames?game=${game}`,
//       {
//         headers: {Authorization: `Bearer ${token}`},
//       },
//     );

//     console.log('API Response:', response.data);
//     console.log('Response Status:', response.status);
//     console.log('Response Headers:', response.headers);

//     if (Array.isArray(response.data) && response.data.length > 0) {
//       return response.data;
//     } else {
//       console.warn('No games found or response data is not an array');
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching games:', error);
//     throw error;
//   }
// };

export const getFindGame = async (game = '') => {
  let token = await AsyncStorage.getItem('token');
  // localhost:8282/turfbooking/turf/getLocationWiseTurfDetails/0?address=Kharadi Pune
  return Axios.get(`turfbooking/customer/findGames?game=${game}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};
