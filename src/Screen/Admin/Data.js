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
import getBookingList from '../../Service/AdminAPI/getBookingList';

export default function Data() {
  const [bookedList, setBookedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Replace with your desired number of items per page

  useEffect(() => {
    fetchBookedList(currentPage);
  }, []);

  const fetchBookedList = async page => {
    setLoading(true);
    try {
      const response = await getBookingList(page - 1, itemsPerPage);
      console.log(response.data);
      setBookedList(prevList => [...prevList, ...response.data.content]);
      setHasMore(response.data.content.length === itemsPerPage);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error(error, 'Error in loading list');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (!loading && hasMore) {
      fetchBookedList(currentPage);
    }
  };

  if (loading && currentPage === 1) {
    // Show loading indicator for the initial fetch
    return <ActivityIndicator size="large" />;
  }

  return bookedList.length === 0 ? (
    <View style={styles.imageContainer}>
      <Text style={styles.textItem}>Data is not present</Text>
      <Image
        source={DataIsNotPresent}
        style={{
          flex: 1,
          height: 500,
          alignItems: 'center',
          width: '150%', // Use '100%' to take the full width
          resizeMode: 'contain', // Ensure the image fits without cropping
          marginTop: 0,
          padding: 0,
          marginBottom: 54,
          // marginTop:h(0.5),
        }}
      />
    </View>
  ) : (
    <FlatList
      data={bookedList}
      keyExtractor={item => item.id}
      onEndReached={handleNextPage}
      ListFooterComponent={loading && <ActivityIndicator size="large" />}
      onEndReachedThreshold={0.1}
      renderItem={({item, index}) => (
        <View key={item.id} style={styles.flatStyle}>
          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={styles.Inputicon}>
              {/* <Feather name="user-alt" color={'black'} size={15} /> */}
              <FontAwesome5 name="user-alt" color={'#ff751a'} size={18} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginLeft: 10,
                color: '#010048',
              }}>
              Name : {item.name}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={styles.Inputicon}>
              {/* <Feather name="user-alt" color={'black'} size={15} /> */}
              <FontAwesome5 name="phone-alt" color={'black'} size={15} />
            </View>
            <Text style={{fontSize: 15, fontWeight: '700', marginLeft: 10}}>
              PhoneNo : {item.phoneNumber}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={styles.Inputicon}>
              {/* <Feather name="user-alt" color={'black'} size={15} /> */}
              <FontAwesome5 name="address-card" color={'black'} size={15} />
            </View>
            <Text style={{fontSize: 15, fontWeight: '700', marginLeft: 8}}>
              Address : {item.presentAddress}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={styles.Inputicon}>
              {/* <Feather name="user-alt" color={'black'} size={15} /> */}
              <Fontisto name="date" color={'black'} size={15} />
            </View>
            <Text style={{fontSize: 15, fontWeight: '700', marginLeft: 10}}>
              startTime : {moment.utc(item.startTime).format('hh:mm')}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={styles.Inputicon}>
              {/* <Feather name="user-alt" color={'black'} size={15} /> */}
              <Fontisto name="date" color={'black'} size={15} />
            </View>
            <Text style={{fontSize: 15, fontWeight: '700', marginLeft: 10}}>
              endTime : {moment.utc(item.endTime).format('hh:mm')}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={styles.Inputicon}>
              {/* <Feather name="user-alt" color={'black'} size={15} /> */}
              <FontAwesome5 name="user-alt" color={'black'} size={15} />
            </View>
            <Text style={{fontSize: 15, fontWeight: '700', marginLeft: 10}}>
              gender : {item.gender}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 7}}>
            <View style={styles.Inputicon}>
              {/* <Feather name="user-alt" color={'black'} size={15} /> */}
              <MaterialCommunityIcons
                name="list-status"
                color={'black'}
                size={15}
              />
            </View>
            <Text style={{fontSize: 15, fontWeight: '700', marginLeft: 10}}>
              Status : {item.status}
            </Text>
          </View>
          {/* <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#32CD32' }]} onPress={() => handleBooking(item.id, 'accepted')}>
                                <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#f01d1d' }]}>
                                <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>

                        </View> */}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  flatStyle: {
    justifyContent: 'space-between',
    padding: 20,
    shadowColor: '#38Acec',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 2,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 10,
  },
  Inputicon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // width: width / 12,
    // backgroundColor: '#e8ecf8',
    // height: height / 17,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginBottom: 10,
    right: 18,
    bottom: 18,
  },
  button: {
    padding: 7,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    // padding: w(2),
    // borderRadius: w(2),
    elevation: 2,
  },
  textItem: {
    fontSize: 14,
    alignItems: 'center',
    fontWeight: 'bold',
    // color: 'darkblue',
    marginBottom: 0,
    elevation: 2,
    marginTop: 15,
  },
});
