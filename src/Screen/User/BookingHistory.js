import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import getBookingHistory from '../../Service/UserAPI/getBookingHistory';
import moment from 'moment';

const BookingHistory = () => {
  const [bookingHistory, setbookingHistory] = useState([]);

  useEffect(() => {
    fetchBookingHistory();
  }, []);
  const fetchBookingHistory = async () => {
    try {
      const bookingHistory = await getBookingHistory();
      console.log('Booking History:', bookingHistory);
      setbookingHistory(bookingHistory);
      // You can now use bookingHistory to display the data in your UI
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.history}>
          Previous History For Last Booking Turf Slots
        </Text>

        {bookingHistory.map((booking, index) => (
          <View key={index} style={styles.Box3}>
            <Text style={styles.name}>Name: {booking.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '98%',
                padding: 10,
                paddingTop: 8,
                paddingBottom: 8,
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 9,
                  }}>
                  <FontAwesome name="phone" size={16} color="#e87a28" />
                  <Text style={styles.text}>
                    Phone No : {booking.phoneNumber}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 9,
                  }}>
                  <FontAwesome
                    name="map-marker"
                    size={17}
                    color="#e87a28"
                    style={{marginLeft: 4, marginTop: 4}}
                  />

                  <Text style={styles.text}>Location : {booking.address}</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialIcons
                    name="date-range"
                    size={16}
                    color="#e87a28"
                    style={{marginRight: 5, marginTop: 6}}
                  />
                  <Text style={styles.text}>
                    Date : {moment(booking.startTime).format('DD-MM-YYYY')}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FontAwesome
                    name="clock-o"
                    size={17}
                    color="#e87a28"
                    style={{marginRight: 5, marginTop: 6}}
                  />
                  <Text style={styles.text}>
                    Time:{' '}
                    {`${moment(booking.startTime).format('hh:mm A')} - ${moment(
                      booking.endTime,
                    ).format('hh:mm A')}`}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    color: 'green',
                    fontSize: 14,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Paid
                </Text>
                <Text
                  style={{
                    color: '#00264d',
                    fontWeight: '600',
                    fontSize: 19,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  <FontAwesome name="rupee" color={'#e87a28'} size={18} />
                  {booking.price}
                </Text>

                {/* asking points its booking history or billing history */}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: {
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 15,
    color: '#010048',
    textAlign: 'center',
  },
  bookingItem: {
    marginBottom: 10,
    borderRadius: 12,
    padding: 10,
    width: '90%',
  },
  separator: {
    borderBottomColor: '#e87a28',
    borderBottomWidth: 1.5,
    fontSize: 10,
    fontWeight: '600',
    marginVertical: 8,
  },
  history: {
    margin: 8,
    fontSize: 14,
    color: '#010048',
    fontWeight: 'bold',
  },
  Box3: {
    borderRadius: 10,
    backgroundColor: 'white',
    shadowOpacity: 2,
    elevation: 20,
    width: '96%',
    padding: 20,
    height: 'auto',
    marginTop: 3,
    marginBottom: 3,
    padding: 5,
  },
  text: {
    color: '#142d73',
    fontWeight: '600',
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    color: '#142d73',
    fontWeight: '600',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default BookingHistory;
