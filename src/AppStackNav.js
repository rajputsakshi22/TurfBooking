/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import slpash from './Screen/Splash';
import Signin from './Screen/User/Signin';
import Signup from './Screen/User/Signup';
import Welcome from './Screen/Welcome';
// import xyz from './Screen/User/xyz';
import BottomTab from './Screen/User/BottomTab';
import AdminSignup from './Screen/Admin/AdminSignup';
import userDashboard from './Screen/User/Home';
// import AdminDashboard from './Screen/Admin/AdminDashboard';
import BookNow from './Screen/User/BookNow';
// import postAdminSignin from './Service/admin/postAdminSignin';
import AdminSignin from './Screen/Admin/AdminSignin';
// import sports from './Screen/Admin/sports';
import UploadImage from './Screen/Admin/UploadImage';
import AppDrawerNav from './Screen/Admin/AppDrawerNav';
import Home from './Screen/User/Home';
import BookingForm from './Screen/Admin/BookForm';
import BookingSlot from './Screen/User/BookingSlot';
import QRCodeScreen from './Screen/User/QRCodeScreen';
import BookingHistory from './Screen/User/BookingHistory';
import CreateGames from './Screen/User/CreateGames';
import GameAdded from './Screen/User/GameAdded';
// import QRComponente from './Screen/User/QRComponente';

const AppStackNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Data"
          component={Data}
          options={{headerShown: true}}
        /> */}
        <Stack.Screen
          name="Splash"
          component={slpash}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="userDashboard"
          component={userDashboard}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="UploadImage"
          component={UploadImage}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BookNow"
          component={BookNow}
          options={{headerShown: false}}
        />

        {/* <Stack.Screen
          name="QRComponente"
          component={QRComponente}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="AdminSignin"
          component={AdminSignin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminSignup"
          component={AdminSignup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingHistory"
          component={BookingHistory}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ headerShown: false }}
        /> */}

        <Stack.Screen
          name="AppDrawerNav"
          component={AppDrawerNav}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BookingForm"
          component={BookingForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingSlot"
          component={BookingSlot}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="QRCodeScreen"
          component={QRCodeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateGames"
          component={CreateGames}
          options={{headerShown: true}}
        />

        <Stack.Screen
          name="GameAdded"
          component={GameAdded}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStackNav;
