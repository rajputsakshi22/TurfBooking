import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const slots = [
  {
    id: 1,
    date: '2024-08-29',
    time: '10:00 AM - 11:00 AM',
    status: 'Available',
  },
  {id: 2, date: '2024-08-29', time: '11:00 AM - 12:00 PM', status: 'Booked'},
  {id: 3, date: '2024-08-28', time: '09:00 AM - 10:00 AM', status: 'Booked'},
  {
    id: 4,
    date: '2024-08-28',
    time: '10:00 AM - 11:00 AM',
    status: 'Available',
  },
  {
    id: 5,
    date: '2024-08-29',
    time: '11:00 AM - 12:00 PM',
    status: 'Available',
  },
  {id: 6, date: '2024-08-28', time: '09:00 AM - 10:00 AM', status: 'Booked'},
];

const BookingSlot = () => {
  const renderItem = ({item}) => (
    <View style={styles.slotContainer}>
      <View
        style={[
          styles.slot,
          item.status === 'Available'
            ? styles.availableSlot
            : styles.bookedSlot,
          {borderColor: item.status === 'Available' ? 'green' : 'red'},
        ]}>
        <Icon
          name={item.status === 'Available' ? 'check-circle' : 'times-circle'}
          size={20}
          color={item.status === 'Available' ? 'green' : 'red'}
          style={styles.slotIcon}
        />
        <View style={styles.slotDetails}>
          <Text
            style={[
              styles.slotStatus,
              {color: item.status === 'Available' ? 'green' : 'red'},
            ]}>
            {item.status}
          </Text>
          <Text
            style={[
              styles.slotTime,
              {color: item.status === 'Available' ? 'green' : 'red'},
            ]}>
            {item.date}
          </Text>
          <Text
            style={[
              styles.slotTime,
              {color: item.status === 'Available' ? 'green' : 'red'},
            ]}>
            {item.time}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={slots}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      horizontal={true} // This makes the list horizontal
      showsHorizontalScrollIndicator={false} // Optional: hides the scrollbar
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  slotContainer: {
    marginHorizontal: 5,
  },
  slot: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 3,
    borderWidth: 1.5,
    borderRadius: 12,
    position: 'relative',
    marginTop: 20,
  },
  slotIcon: {
    position: 'absolute',
    top: -10,
    right: -5,
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 5,
  },
  availableSlot: {
    backgroundColor: '#e7f9e7',
  },
  bookedSlot: {
    backgroundColor: '#f9e7e7',
  },
  slotDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotTime: {
    fontSize: 10.5,
  },
  slotStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
});

export default BookingSlot;
