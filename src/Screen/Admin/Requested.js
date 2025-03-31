import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DataIsNotPresent from './DataIsNotPresent.jpg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import moment from 'moment';
import getBookingForTurf from '../../Service/AdminAPI/getBookingForTurf';
import putUpdateBooking from '../../Service/AdminAPI/putUpdateBooking';
import UserImg from './user_boy.png';

export default function Requested({navigation}) {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchBookingList(currentPage);
  }, []);

  const fetchBookingList = async page => {
    setLoading(true);
    try {
      const response = await getBookingForTurf(page - 1, itemsPerPage);
      console.log(response.data);
      console.log('get Booking List Updated >>>>>>>>>>>>>>>>>>:');
      setBookingList(prevList => [...prevList, ...response.data.content]);
      setHasMore(response.data.content.length === itemsPerPage);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error(error, 'Error in Bookingloading>>>>>>>>>>>>>@@@@');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (!loading && hasMore) {
      fetchBookingList(currentPage);
    }
  };

  const handleBooking = async (bookingId, status) => {
    try {
      const request = await putUpdateBooking(bookingId, status);
      console.log('Booking Done>>>>>>>>>>>>>', request);

      // Update the status in the bookingList state
      setBookingList(prevList =>
        prevList.map(booking =>
          booking.id === bookingId ? {...booking, status} : booking,
        ),
      );

      Alert.alert(
        `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      );
    } catch (error) {
      console.log('Error', error);
    }
  };

  if (loading && currentPage === 1) {
    return <ActivityIndicator size="large" />;
  }

  const getStatusStyle = status => {
    switch (status) {
      case 'accepted':
        return styles.statusAccepted;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <View style={styles.container}>
      {bookingList.length === 0 ? (
        <View style={styles.imageContainer}>
          <Text style={styles.textItem}>Data is not present</Text>
          <Image
            source={DataIsNotPresent}
            style={{
              flex: 1,
              height: 500,
              alignItems: 'center',
              width: '100%',
              resizeMode: 'contain',
              marginTop: 0,
              padding: 8,
              marginBottom: 54,
            }}
          />
        </View>
      ) : (
        <FlatList
          data={bookingList}
          keyExtractor={item => item.id}
          onEndReached={handleNextPage}
          ListFooterComponent={loading && <ActivityIndicator size="large" />}
          onEndReachedThreshold={0.1}
          renderItem={({item}) => (
            <View key={item.id} style={styles.flatStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}>
                  <Image
                    source={UserImg}
                    style={{width: 70, height: 70, marginLeft: 20, top: -5}}
                  />

                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.Inputicon}>
                      <MaterialCommunityIcons
                        name="list-status"
                        color={'#010048'}
                        size={12}
                        style={{top: 2}}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                      }}>
                      Status :
                    </Text>
                    <Text
                      style={[
                        {fontSize: 12, fontWeight: '700', marginLeft: 2},
                        getStatusStyle(item.status),
                      ]}>
                      {item.status}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <TouchableOpacity
                      style={[styles.button, {backgroundColor: '#32CD32'}]}
                      onPress={() => handleBooking(item.id, 'accepted')}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, {backgroundColor: '#ff751a'}]}
                      onPress={() => handleBooking(item.id, 'rejected')}>
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#010048',
                      top: -10,
                    }}>
                    Name : {item.name}
                  </Text>

                  <View style={styles.Inputicon}>
                    <FontAwesome5
                      name="phone-alt"
                      color={'#010048'}
                      size={14}
                    />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        marginLeft: 10,
                      }}>
                      PhoneNo : {item.phoneNumber}
                    </Text>
                  </View>

                  <View style={styles.Inputicon}>
                    <FontAwesome5 name="user-alt" color={'#010048'} size={14} />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        marginLeft: 10,
                      }}>
                      Gender : {item.gender}
                    </Text>
                  </View>

                  <View style={styles.Inputicon}>
                    <Fontisto name="date" color={'#010048'} size={14} />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        marginLeft: 10,
                      }}>
                      StartTime : {moment.utc(item.startTime).format('hh:mm')}
                    </Text>
                  </View>

                  <View style={styles.Inputicon}>
                    <Fontisto name="date" color={'#010048'} size={14} />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        marginLeft: 10,
                      }}>
                      EndTime : {moment.utc(item.endTime).format('hh:mm')}
                    </Text>
                  </View>

                  <View style={styles.Inputicon}>
                    <FontAwesome5
                      name="address-card"
                      color={'#010048'}
                      size={14}
                    />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        marginLeft: 8,
                      }}>
                      Address : {item.presentAddress}
                    </Text>
                  </View>

                  {/* <Text
                      style={[
                        styles.statusText,
                        {top: -3},
                        getStatusStyle(item.status),
                      ]}>
                      {item.status}
                    </Text> */}
                </View>
              </View>
              {/* <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View style={{flexDirection: 'row', marginBottom: 7}}>
                  <View style={styles.Inputicon}>
                    <MaterialCommunityIcons
                      name="list-status"
                      color={'#010048'}
                      size={15}
                      style={{top: 3}}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      top: 3,
                      marginLeft: 10,
                    }}>
                    Status :
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      {marginLeft: 10},
                      getStatusStyle(item.status),
                    ]}>
                    {item.status}
                  </Text>
                </View>

              
              </View> */}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  flatStyle: {
    padding: 22,
    shadowColor: '#38Acec',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 2,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 12,
  },
  Inputicon: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  button: {
    width: 50,
    height: 20,
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 2,
  },
  textItem: {
    fontSize: 14,
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 0,
    elevation: 2,
    marginTop: 90,
  },
  statusAccepted: {
    color: '#32CD32',
  },
  statusRejected: {
    color: '#ff751a',
  },
  statusDefault: {
    color: '#000',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
    top: 3,
  },
});
