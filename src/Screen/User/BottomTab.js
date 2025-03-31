/* eslint-disable prettier/prettier */
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Profile from './Profile';
import userDashboard from './Home';
import BookingHistory from './BookingHistory';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarIcon: ({focused}) => {
          let iconName;
          let IconComponent;

          if (route.name === 'userDashboard') {
            IconComponent = focused ? Entypo : AntDesign;
            iconName = 'home';
          } else if (route.name === 'Booking History') {
            IconComponent = AntDesign;
            iconName = focused ? 'heart' : 'hearto';
          } else if (route.name === 'Profile') {
            IconComponent = FontAwesome;
            iconName = focused ? 'user' : 'user-o';
          }

          return (
            <View style={styles.iconContainer}>
              <IconComponent
                name={iconName}
                color={focused ? 'green' : '#000'}
                size={21}
              />
            </View>
          );
        },
      })}>
      <Tab.Screen
        name="userDashboard"
        component={userDashboard}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Booking History"
        component={BookingHistory}
        options={{
          tabBarLabel: 'Booking',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 45,
    backgroundColor: '#fff',
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBarIconStyle: {
    marginBottom: -5, // Adjust the spacing between the icon and the label
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
