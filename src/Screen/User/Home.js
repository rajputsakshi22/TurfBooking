import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getAllTurfList from '../../Service/UserAPI/getAllTurfList';
import getCityWiseSearch from '../../Service/UserAPI/getCityWiseSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';

const Home = () => {
  const [payloadList, setPayloadList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadPayloadList(1);
  }, []);

  const loadPayloadList = async (page, keyword = '') => {
    const customerID = AsyncStorage.getItem('customerID');

    setLoading(true);
    try {
      const response = keyword
        ? await getCityWiseSearch(page - 1, keyword)
        : await getAllTurfList(page - 1);
      // Assuming response.data.content has your turfs list
      const newTurfList = response.data.content.map(turf => ({
        ...turf,
        images: turf.images || [], // Ensure there are images, even if it's an empty array
      }));
      setPayloadList(prevList =>
        page === 1
          ? response.data.content
          : [...prevList, ...response.data.content],
      );
      console.log('data111 fetching getSerach list', response.data);
      // console.log('data111 fetching getSerach list', response.data.customerId);

      // console.log('fetching22 getSerach list', response);
      setHasMore(response.data.content.length === itemsPerPage);
      setCurrentPage(page + 1);
    } catch (error) {
      console.error('Error fetching getSerach list', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (!loading && hasMore) {
      loadPayloadList(currentPage, searchKeyword);
    }
  };

  const handleSearch = keyword => {
    setSearchKeyword(keyword);
    if (keyword) {
      loadPayloadList(1, keyword);
    } else {
      loadPayloadList(1);
    }
  };
  // const keyExtractor = (item, index) => `${item.turfID}_${index}`;

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Explore Turf in City !',
      headerTitleStyle: {
        fontSize: 20,
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#33334d',
        height: 50,
      },
      headerLeftContainerStyle: {
        marginLeft: 10,
      },
    });
  });
  const TurfSwiper = ({turf}) => (
    <Swiper style={styles.swiper} loop={true} autoplay={true}>
      {turf.images.map((image, index) => (
        <View key={index} style={styles.slide}>
          <Image source={{uri: image}} style={styles.imagesize} />
        </View>
      ))}
    </Swiper>
  );

  const renderUserRow = item => {
    return (
      <View style={styles.container}>
        <TurfSwiper turf={item} />
        <View style={styles.infoContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={[styles.locationContainer, {left: 120}]}>
              <MaterialIcons name="food-bank" size={22} color="green" />

              <Icon name="home-circle" size={22} color="green" />
              <Icon name="hours-24" size={22} color="green" />
              <Image
                style={{width: 21, height: 21, resizeMode: 'contain'}}
                source={require('../User/male-female.png')}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => Linking.openURL(item.location)}>
              <View style={styles.locationContainer}>
                <Icon name="map-marker-circle" size={20} color="green" />
                <Text style={styles.address}>{item.address}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(item.location)}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: 'contain',
                  left: -18,
                  top: 8,
                }}
                source={require('../User/google-maps.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.locationContainer}>
            <Image
              style={{width: 19, height: 19, resizeMode: 'contain'}}
              source={require('../User/rupee-symbol.png')}
            />
            <Text style={styles.price}>{item.price} </Text>
          </View>
          <View style={styles.locationContainer}>
            <View style={styles.buttonContainer}>
              <DetailsButton
                onPress={() =>
                  navigation.navigate('BookNow', {
                    address: item.address,
                    turfID: item.turfID,
                    price: item.price,
                    location: item.location,
                    images: item.images,
                  })
                }
              />
            </View>

            <View style={styles.contactButton1}>
              <Text
                style={{
                  fontFamily: 'cursive',
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: '#fff',
                  top: -8,
                }}>
                i
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const DetailsButton = ({onPress}) => (
    <TouchableOpacity style={styles.contactButton} onPress={onPress}>
      <Text style={styles.detailsText}>See More</Text>
    </TouchableOpacity>
  );

  return (
    // Main Container (Updated View)
    <View style={{flex: 1, width: '100%'}}>
      <View style={styles.searchContainer}>
        <View style={styles.headingab}>
          <Text style={styles.headingA}>Top Sports Complexes in Cities</Text>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require('../../Images/download_prev_ui.png')}
            />
          </View>
        </View>

        <View style={styles.searchBar}>
          <FontAwesome5
            name="search"
            size={18}
            color="#ff6600"
            style={{marginLeft: 18, marginRight: 10}}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Search For Cities Place.."
            placeholderTextColor="#aaa"
            value={searchKeyword}
            onChangeText={handleSearch}
          />
          <Ionicons
            name="location-outline"
            size={22}
            color="green"
            style={{marginLeft: 14, right: 18}}
          />
        </View>

        <Text style={styles.bookVenues}>Book Venues</Text>
      </View>

      {/* FlatList (Updated for scrolling) */}
      <FlatList
        data={payloadList}
        renderItem={({item}) => renderUserRow(item)}
        onEndReached={handleNextPage}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading && <ActivityIndicator size="large" />}
        keyExtractor={(item, index) => `${item.turfID}_${index}`}
      />
    </View> // <-- Closed flex container
  );
};

export default Home;
const styles = StyleSheet.create({
  swiper: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesize: {
    width: '100%',
    height: '98%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  headingab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headingA: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#010048',
    marginLeft: 4,
    marginTop: 6,
    marginBottom: 18,
  },
  imageStyle: {
    height: 120,
    width: 100,
    marginHorizontal: 10,
  },

  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  // searchContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  // },
  searchIcon: {
    marginRight: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingVertical: 8,
  },

  container: {
    borderRadius: 10,
    margin: 2,
    backgroundColor: 'white',
    shadowColor: '#00FF00', // Hex code for green
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10, // Android shadow
  },

  infoContainer: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 20,
  },
  // imageStyledumy: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   // Add other styles specific to the image
  // },
  name: {
    fontSize: 16,
    color: '#010048',
    fontWeight: 'bold',
    margin: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  rating: {
    fontSize: 13,
    color: 'black',
    fontWeight: '500',
    marginLeft: 5,
  },
  price: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: 'green',
    width: '96%',
    height: 28,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: -40,
  },
  contactButton1: {
    flexDirection: 'row',
    backgroundColor: 'green',
    width: '12%',
    height: 28,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
  },
  contactText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: '#ff6600',
    width: 83,
    height: 23,
    justifyContent: 'center',
    borderRadius: 5,
  },
  detailsText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  icon: {
    marginRight: 5,
  },
  searchContainer: {
    padding: 1,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    color: '#010048',
    fontSize: 16,
    paddingVertical: 8,
  },
  bookVenues: {
    fontSize: 12,
    color: 'green',
    fontWeight: '800',
    marginHorizontal: 13,
  },
});
