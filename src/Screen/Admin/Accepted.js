import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DataIsNotPresent from './DataIsNotPresent.jpg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Fontisto from 'react-native-vector-icons/Fontisto';
import turfbookingAcceptedList from '../../Service/AdminAPI/getTurfbookingAcceptedList';
import UserImg from './user_boy.png';
const {width, height} = Dimensions.get('window');
// export default function Module3() {
export default function Accepted() {
  const [acceptedList, setAcceptedList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchAcceptedList(currentPage);
  }, []);

  const fetchAcceptedList = async page => {
    setLoading(true);
    try {
      const response = await turfbookingAcceptedList(page - 1, itemsPerPage);
      console.log(response.data);
      console.log('get Accepted List Updated >>>>>>>>>>>>>>>>>>:', response);
      setAcceptedList(prevList => [...prevList, ...response.data.content]);
      setHasMore(response.data.content.length === itemsPerPage);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error in AcceptedList>>>>>>>>', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNextPage = () => {
    if (!loading && hasMore) {
      fetchAcceptedList(currentPage + 1);
    }
  };
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      {acceptedList.length === 0 ? (
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
          data={acceptedList}
          keyExtractor={item => item.id}
          onEndReached={handleNextPage}
          ListFooterComponent={loading && <ActivityIndicator size="large" />}
          onEndReachedThreshold={0.1}
          renderItem={({item, index}) => (
            <View key={item.id} style={styles.flatStyle}>
              <View style={{flexDirection: 'row', gap: 30}}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  <View style={styles.Inputicon}>
                    <Image
                      source={UserImg}
                      style={{width: 80, height: 80, top: -10}}
                    />
                  </View>

                  <Text
                    style={{fontSize: 13, fontWeight: '700', color: 'green'}}>
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).toLowerCase()}
                  </Text>
                </View>
                <View style={{flexDirection: 'column', marginBottom: 7}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      marginBottom: 7,
                      color: '#010048',
                    }}>
                    Name : {item.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 7,
                    }}>
                    <View style={styles.Inputicon}>
                      <FontAwesome5
                        name="address-card"
                        color={'#010048'}
                        size={14}
                      />
                    </View>
                    <Text
                      style={{fontSize: 12, fontWeight: '700', marginLeft: 7}}>
                      Address : {item.presentAddress}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginBottom: 7}}>
                    <View style={styles.Inputicon}>
                      {/* <Feather name="user-alt" color={'black'} size={15} /> */}
                      <FontAwesome5
                        name="phone-alt"
                        color={'#010048'}
                        size={14}
                      />
                    </View>
                    <Text
                      style={{fontSize: 12, fontWeight: '700', marginLeft: 10}}>
                      PhoneNo : {item.phoneNumber}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginBottom: 7}}>
                    <View style={styles.Inputicon}>
                      {/* <Feather name="user-alt" color={'black'} size={15} /> */}
                      <FontAwesome5
                        name="user-alt"
                        color={'#010048'}
                        size={14}
                      />
                    </View>
                    <Text
                      style={{fontSize: 12, fontWeight: '700', marginLeft: 10}}>
                      Gender : {item.gender}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginBottom: 7}}>
                    <View style={styles.Inputicon}>
                      {/* <Feather name="user-alt" color={'black'} size={15} /> */}
                      <Fontisto name="date" color={'#010048'} size={14} />
                    </View>
                    <Text
                      style={{fontSize: 12, fontWeight: '700', marginLeft: 10}}>
                      StartTime : {moment.utc(item.startTime).format('hh:mm')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginBottom: 7}}>
                    <View style={styles.Inputicon}>
                      {/* <Feather name="user-alt" color={'black'} size={15} /> */}
                      <Fontisto name="date" color={'#010048'} size={14} />
                    </View>
                    <Text
                      style={{fontSize: 12, fontWeight: '700', marginLeft: 10}}>
                      EndTime : {moment.utc(item.endTime).format('hh:mm')}
                    </Text>
                  </View>
                </View>
              </View>
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
    // backgroundColor: 'white',
  },
  flatStyle: {
    justifyContent: 'space-around',
    padding: 10,
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
  imageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    // justifyContent: 'center',
    width: '70%',
    marginLeft: 62,
    marginTop: 2,
    elevation: 2,
  },
  textItem: {
    fontSize: 14,
    alignItems: 'center',
    fontWeight: 'bold',
    elvation: 2,
    marginTop: 35,
  },
  button: {
    padding: 7,
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: '#32CD32',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  amountContainer: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // marginBottom: 10,
    right: 18,
    top: 18,
  },
});
