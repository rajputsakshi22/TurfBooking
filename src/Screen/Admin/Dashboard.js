import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import postAddSport from '../../Service/AdminAPI/postAddSport';
import getcountApiForDashBoard from '../../Service/AdminAPI/getcountApiForDashBoard';
import {ScrollView} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');
const validationSchema = Yup.object().shape({
  sportsName: Yup.string().required('Required'),
});

const Dashboard = ({navigation}) => {
  const [ownerTurfID, setOwnerTurfID] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalCountDashboard, setTotalCountDashboard] = useState({});

  useEffect(() => {
    fetchDashboardData(); // Initial fetch
    const intervalId = setInterval(fetchDashboardData, 30000); // Auto-update every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // const fetchDashboardData = async () => {
  //   try {
  //     const response = await getcountApiForDashBoard();
  //     setTotalCountDashboard(response.data);
  //     console.log('Dashboard data received:', response.data);
  //   } catch (error) {
  //     console.error('Error fetching dashboard data:', error);
  //   }
  // };
  const fetchDashboardData = async () => {
    setLoading(true); // Show loader
    try {
      const response = await getcountApiForDashBoard();
      setTotalCountDashboard(response.data);
      console.log('Dashboard data received:', response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    const getTurfID = async () => {
      try {
        const turfID = await AsyncStorage.getItem('turfID');
        if (turfID) {
          setOwnerTurfID(turfID);
        } else {
          console.warn('TurfID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching turfID:', error);
      }
    };

    getTurfID();
  }, []);

  return (
    <ScrollView>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Formik
        initialValues={{sportsName: '', turfId: ''}}
        validationSchema={validationSchema}
        onSubmit={async (values, {resetForm}) => {
          try {
            const turfID = await AsyncStorage.getItem('turfID');
            setOwnerTurfID(turfID);
            const data = {
              turfId: turfID,
              sportsName: values.sportsName,
            };
            await postAddSport(data);
            navigation.navigate('Module1');
            Alert.alert('Successfully added sport');
            resetForm();
          } catch (error) {
            console.error('Error adding sport:', error);
            Alert.alert('Error: Cannot add sport, please try again!');
          }
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          touched,
          resetForm,
        }) => (
          <View style={styles.container}>
            <View style={styles.cardContainer}>
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>Booking Slots</Text>
                    <Text style={styles.cardValue}>
                      {totalCountDashboard.bookedTimingSlots}
                    </Text>
                  </View>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#80bfff"
                    style={styles.iconStyle}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>Remaining Slots</Text>
                    <Text style={styles.cardValue}>
                      {totalCountDashboard.remainingTimingSlots}
                    </Text>
                  </View>
                  <Icon
                    name="clock-o"
                    size={20}
                    color="#d27979"
                    style={styles.iconStyle}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>Offline Booking</Text>
                    <Text style={styles.cardValue}>
                      {totalCountDashboard.offlineBooking}
                    </Text>
                  </View>
                  <Icon
                    name="briefcase"
                    size={20}
                    color="#d27979"
                    style={styles.iconStyle}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>Requested Slots</Text>
                    <Text style={styles.cardValue}>
                      {totalCountDashboard.requestedBooking}
                    </Text>
                  </View>
                  <Icon
                    name="users"
                    size={20}
                    color="#ff8533"
                    style={styles.iconStyle}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>Accepted Booking</Text>
                    {/* <Text style={styles.cardValue}>{acceptedBooking}</Text> */}
                    <Text style={styles.cardValue}>
                      {' '}
                      {totalCountDashboard.acceptedBooking}{' '}
                    </Text>
                  </View>
                  <Icon
                    name="check-circle"
                    size={20}
                    color="#ff8533"
                    style={styles.iconStyle}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.cardTitle}>Online Booking</Text>
                    <Text style={styles.cardValue}>
                      {' '}
                      {totalCountDashboard.onlineBooking}
                    </Text>
                  </View>
                  <Icon
                    name="globe"
                    size={20}
                    color="#339966"
                    style={styles.iconStyle}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.footer}></View> */}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  notificationIconContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  notificationIcon: {
    position: 'relative',
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
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 7,
    marginBottom: 10,
    width: '48%',
    height: 60,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#010048',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#38Acec',
  },
  iconStyle: {
    marginLeft: 5,
  },
  footer: {
    height: 50,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
});

export default Dashboard;
