import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import {NavigationContainer} from '@react-navigation/native';
// import AdminDashboard from './AdminDashboard';
// import Notice1 from './Notice1';
// import Module1 from './Dashboard';
// import Module2 from './Profile';
// import Module3 from './Module3';
import DrawerContent from './DrawerContent';
import Sports from './Sports';
// import Module4 from './Module4';
import BookForm from './BookForm';
// import Profile from '../User/Profile';
import ProfileScreen from '../Profile/UserProfiles';
import Dashboard from './Dashboard';
// import AdminProfile from './AdminProfile';
import Requested from './Requested';
import Accepted from './Accepted';
import Notice from './Notice';
import AdminProfile from './AdminProfile';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const AppDrawerNav = () => {
  const [notificationCount, setNotificationCount] = useState(2);
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        // drawerActiveBackgroundColor: '#e87a28',
        drawerActiveTintColor: '#fff',
      }}>
      {/* <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerTitle: 'ADMIN PANEL', headerShown: true }}
      /> */}

      <Drawer.Screen
        name="DashBoard"
        component={Dashboard}
        options={({navigation}) => ({
          headerTitle: 'Dashboard',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Handle notification press
              }}
              style={styles.notificationIcon}>
              <Ionicons name="notifications" size={25} color="#000" />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="Sports"
        component={Sports}
        // options={{headerShown: false}}
        options={{headerTitle: 'Sports', headerShown: true}}
      />

      <Drawer.Screen
        // name="Module2"
        // component={Module2}
        // options={{headerTitle: 'Notice Board', headerShown: true}}
        name="Profile"
        component={AdminProfile}
        options={{headerTitle: 'Profile', headerShown: true}}
      />
      <Drawer.Screen
        name="My Profile"
        component={ProfileScreen}
        options={{headerTitle: 'Notice Board', headerShown: true}}
      />
      <Drawer.Screen
        // name="Module4"
        // component={Module4}
        name="Requested"
        component={Requested}
        options={{headerTitle: 'Requested', headerShown: true}}
      />

      <Drawer.Screen
        // name="Module3"
        // component={Module3}
        // options={{headerTitle: 'Accepted', headerShown: true}}
        name="Accepted"
        component={Accepted}
        options={{headerTitle: 'Accepted', headerShown: true}}
      />

      <Drawer.Screen
        // name="BookForm"
        // component={BookForm}
        // options={{headerShown: false}}
        name="BookForm"
        component={BookForm}
        options={{headerTitle: 'Booking Form', headerShown: true}}
      />

      <Drawer.Screen
        name="Notice"
        // component={Notice1}
        // options={{headerTitle: 'Turf Owner', headerShown: true}}
        component={Notice}
        options={{headerTitle: 'Turf Owner', headerShown: true}}
      />
    </Drawer.Navigator>
  );
};

export default AppDrawerNav;
const styles = StyleSheet.create({
  notificationIconContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  notificationIcon: {
    position: 'relative',
    marginRight: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
