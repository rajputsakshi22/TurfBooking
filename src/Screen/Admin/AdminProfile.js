import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {debounce} from 'lodash';
import DataIsNotPresent from './DataIsNotPresent.jpg';
import moment from 'moment';
import getBookingList from '../../Service/AdminAPI/getBookingList';
import getUserByPhoneNo from '../../Service/AdminAPI/getUserByPhoneNo';
import imgPlaceHolder from './user_boy.png';
import Entypo from 'react-native-vector-icons/Entypo';
import {Caption, Title} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import UserImg from './user_boy.png';
import {G} from 'react-native-svg';
export default function Data() {
  const [bookedList, setBookedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [phoneNo, setPhoneNo] = useState(''); // State to store phone number
  const [profile, setProfile] = useState(null);

  const imagePick = () => {
    ImagePicker.openPicker({
      cropping: true,
    })
      .then(image => {
        setProfile(image.path);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to pick image.');
      });
  };

  useEffect(() => {
    fetchBookedList(currentPage);
  }, []);

  const fetchBookedList = async page => {
    setLoading(true);
    try {
      const response = await getBookingList(page - 1, itemsPerPage);
      console.log(
        '1111111111111111<>>>>>>>>>>>>>>>>>>>>>>>>>>>>list',
        response.data,
      );
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

  const handleSearchByPhoneNo = async searchText => {
    setLoading(true);
    try {
      const response = await getUserByPhoneNo(searchText);
      console.log('22222222222222>>>>>>>>>>>>>>>>>>>>>>', response.data);
      setBookedList([response.data]);
      setHasMore(false);
    } catch (error) {
      console.error(error, 'Error in fetching user by phone number');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearchByPhoneNo, 500), []);

  const handleTextInputChange = text => {
    setPhoneNo(text);
    if (text.length > 0) {
      debouncedSearch(text);
    } else {
      setBookedList([]);
      setCurrentPage(1);
      setHasMore(true);
      fetchBookedList(1);
    }
  };

  if (loading && currentPage === 1) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.profileImage}
              source={profile ? {uri: profile} : imgPlaceHolder}
            />
            <TouchableOpacity onPress={imagePick} style={styles.editIcon}>
              <Entypo name="pencil" size={18} color="grey" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileText}>
            <Title style={styles.profileTitle}>Ashivini Sports</Title>
            <Caption style={styles.profileCaption}>kharadi Pune</Caption>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              maxLength={10}
              style={styles.searchInput}
              placeholder="Search by Mobile No."
              value={phoneNo}
              onChangeText={handleTextInputChange}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {bookedList.length === 0 ? (
        <View style={styles.imageContainer}>
          <Text style={styles.textItem}>Data is not present</Text>
          <Image source={DataIsNotPresent} style={styles.imageStyle} />
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
              <View
                style={{
                  flexDirection: 'row',
                  gap: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                    gap: 40,
                  }}>
                  <View style={styles.Inputicon}>
                    <Image source={UserImg} style={{width: 70, height: 70}} />
                  </View>
                  <Text style={[styles.itemText, {color: 'green'}]}>
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).toLowerCase()}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.itemText}>Name: {item.name}</Text>

                  <Text style={styles.itemText}>
                    Address: {item.presentAddress}
                  </Text>
                  <Text style={styles.itemText}>Gender: {item.gender}</Text>

                  <Text style={styles.itemText}>
                    Start Time: {moment.utc(item.startTime).format('hh:mm')}
                  </Text>
                  <Text style={styles.itemText}>
                    End Time: {moment.utc(item.endTime).format('hh:mm')}
                  </Text>

                  <Text style={styles.itemText}>
                    PhoneNo: {item.phoneNumber}
                  </Text>
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
    margin: 5,
    justifyContent: 'center',
  },

  profileSection: {
    flexDirection: 'row',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 27,
    margin: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 55,
    borderWidth: 3,
  },
  editIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#b1d4e0',
    borderRadius: 16,
    padding: 2,
  },
  profileText: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    fontWeight: '700',
  },
  profileCaption: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    fontWeight: '700',
  },
  searchSection: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
    elevation: 27,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'green',
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchIcon: {
    padding: 10,
  },
  searchResult: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 2,
  },
  resultTextHighlight: {
    color: '#1F41BB',
  },
  dataSection: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },

  flatStyle: {
    justifyContent: 'space-between',
    padding: 10,
    shadowColor: '#38Acec',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 2,
    backgroundColor: 'white',
    margin: 3,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 7,
    color: '#010048',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageStyle: {
    flex: 1,
    height: 500,
    width: '100%',
    resizeMode: 'contain',
    marginTop: 0,
    padding: 0,
    marginBottom: 54,
  },
  textItem: {
    fontSize: 14,
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 0,
    elevation: 2,
    marginTop: 15,
  },
  Inputicon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    marginLeft: 10,
  },
});
