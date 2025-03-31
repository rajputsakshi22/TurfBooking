import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from 'react-native';

import {useRoute} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import getAvailableslots from '../../Service/UserAPI/getAvailable-slots';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import postTurfBooking from '../../Service/UserAPI/postTurfBooking';
import getTurfforBooking from '../../Service/UserAPI/getTurf-forBooking';
import {useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import BookingSlot from './BookingSlot';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

const {height, width} = Dimensions.get('window');
const BookNow = () => {
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [SelectedDate, setSelectedDate] = useState(new Date());
  const [numPeople, setNumPeople] = useState(1);
  const [selectedSport, setselectedSport] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [status, setStatus] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState('');
  const [startT, setStartT] = useState('');
  const [endT, setEndT] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const qrCodeRef = useRef(null);
  const route = useRoute();
  const turfId = route.params.turfID;
  const images = route.params.images;

  const handleSlotPress = time => {
    setStartTime(moment.utc(time.startTime).format('DD/MM/YYYY hh:mm'));
    setEndTime(moment.utc(time.endTime).format('DD/MM/YYYY hh:mm'));
    setStatus(time.status);
    setErrorMessage(null); // Clear any previous error messages
  };
  // console.log('images', images);
  const [turfData, setTurfData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',

    sportlist: [
      {
        id: 1,
        sportsName: 'Select Sport',
      },
    ],
  });

  const isValidAmount = amount => {
    return !isNaN(amount) && parseFloat(amount) > 0;
  };

  // Multiple images Swiper component
  const TurfSwiper = ({images}) => (
    <Swiper style={styles.swiper} loop={true} autoplay={true}>
      {images && images.length > 0 ? (
        images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{uri: image}} style={styles.image} />
          </View>
        ))
      ) : (
        <View style={styles.slide}>
          <Text>No images available</Text>
        </View>
      )}
    </Swiper>
  );

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = date => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  useEffect(() => {
    fetchTurfforBooking();
  }, []);

  const fetchTurfforBooking = async () => {
    try {
      const result = await getTurfforBooking(turfId);
      console.log('result fetching terf details', result.data);
      setTurfData(result.data);
    } catch (error) {
      console.log(error, 'Error in fetching turf details');
    }
  };
  const totalPrice = turfData ? turfData.price : 0;
  useEffect(() => {
    if (SelectedDate) {
      getSlots();
    }
  }, [SelectedDate]);

  const getSlots = async () => {
    try {
      let newDate = moment.utc(SelectedDate).format('DD/MM/YYYY');
      console.log('converted date', newDate);
      const response = await getAvailableslots(newDate, turfId);
      setAvailableSlots(response.data);
      console.log('getSlots', response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Available slots not found:', error);
      } else {
        console.error('Error fetching available slots:', error);
      }
    }
  };

  //function for booking
  const handleBooking = async () => {
    setErrorMessage('');
    const customerID = await AsyncStorage.getItem('customerID');
    console.log('customerID', customerID);

    // Validation for required fields
    if (!startTime) {
      setErrorMessage('Start Time is required');
      Alert.alert('Validation Error', 'Start Time is required');
      return;
    }

    if (!endTime) {
      setErrorMessage('End Time is required');
      Alert.alert('Validation Error', 'End Time is required');
      return;
    }

    const data = {
      turfId: turfId,
      startTime: startTime,
      endTime: endTime,
      status: 'request',
      customerId: customerID,
      sportId: selectedSport,
    };

    try {
      const response = await postTurfBooking(data);
      console.log('Booking response:', response.data);
      setErrorMessage('');
      Alert.alert(
        'Your Booking request is successful',
        'Owner will contact you',
      );
      navigation.navigate('Home');
    } catch (error) {
      console.log('Error in sending booking request:', error);
      setErrorMessage(
        'There was an issue with your booking request. Please try again.',
      );
    }
  };

  const calculatePrice = () => {
    const turfPricePerHead = totalPrice / numPeople;
    return turfPricePerHead;
  };

  return (
    <>
      <View style={styles.BG}>
        <TurfSwiper images={images} />

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            margin: 8,
            padding: 5,
          }}>
          <View style={styles.addresscontainer}>
            <Text style={{fontSize: 18, color: '#010048', fontWeight: '900'}}>
              {turfData.name}
            </Text>
            <View style={[styles.addresscontainer, {left: 184}]}>
              <Icon
                name="star"
                size={18}
                color="gold"
                style={styles.addressicon}
              />
              <Text style={styles.addressText}>3.9</Text>
            </View>
          </View>

          <View
            style={[
              styles.addresscontainer,
              {justifyContent: 'space-between'},
            ]}>
            <View style={styles.addresscontainer}>
              <TouchableOpacity
                onPress={() => Linking.openURL(item.location)}
                style={styles.icon}>
                <Ionicons
                  name="location-outline"
                  size={17}
                  color="green"
                  style={styles.addressicon}
                />
              </TouchableOpacity>
              <Text style={styles.addressText}>{route.params.address}</Text>
            </View>
            <View style={styles.addresscontainer}>
              <Image
                style={{
                  width: 16,
                  height: 16,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
                source={require('../User/rupee-symbol.png')}
              />

              <Text style={styles.addressText}>{route.params.price} </Text>
            </View>
          </View>
          <View style={styles.addresscontainer}>
            <Icon
              name="file-document"
              size={16}
              color="green"
              style={styles.addressicon}
            />
            <Text style={styles.addressText}>{turfData.description}</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={styles.BGlowA}>
          <View style={styles.header}>
            <MaterialIcons name="sports-handball" color={'black'} size={20} />
            <Text style={styles.title}>Facilities provided</Text>
          </View>
          {/* <View style={styles.facilityContainer}> */}

          <View style={styles.facilityRow}>
            <FontAwesome
              name="coffee"
              size={15}
              color="green"
              style={styles.icons}
            />
            <Text style={styles.facilityText}>Cafe</Text>
          </View>
          <View style={styles.facilityRow}>
            <Entypo name="clock" size={16} color="green" style={styles.icons} />
            <Text style={styles.facilityText}>24 Hours Open</Text>
          </View>
          <View style={styles.facilityRow}>
            <MaterialCommunityIcons
              name="hand-wash-outline"
              size={16}
              color="green"
              style={styles.icons}
            />
            <Text style={styles.facilityText}>Washroom</Text>
          </View>
          <View style={styles.facilityRow}>
            <MaterialCommunityIcons
              name="home-variant-outline"
              size={18}
              color="green"
              style={styles.icons}
            />
            <Text style={styles.facilityText}>Shed</Text>
          </View>
        </View>

        <View style={styles.BGlowA}>
          <View style={styles.header}>
            <MaterialIcons name="sports" color={'black'} size={20} />
            <Text style={styles.title}>Select Sports</Text>
          </View>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              items={turfData.sportlist.map(item => ({
                label: item.sportsName,
                value: item.id, // Use the id as the value
                key: item.id.toString(),
              }))}
              style={{
                fontSize: 16,
                paddingHorizontal: 10,
                color: 'black',
              }}
              placeholder={{label: 'Select Sport', value: null}}
              useNativeAndroidPickerStyle={false}
              onValueChange={itemValue => {
                setselectedSport(itemValue); // Set the selected id in Formik
              }}
            />
            <AntDesign name="down" size={15} style={styles.icon} />
          </View>
          <Text style={styles.Text3}>Selected Sports is: {selectedSport}</Text>
        </View>

        <View style={styles.BGlowA}>
          <View style={styles.header}>
            <FontAwesome5 name="calendar" color={'black'} size={16} />
            <Text style={styles.title}>Pick a date</Text>
          </View>

          <View style={styles.Input1}>
            <FontAwesome5 name="clock" color={'green'} size={15} />
            <TouchableOpacity onPress={() => showDatePicker()}>
              <TextInput
                style={styles.input}
                value={moment.utc(SelectedDate).format('DD/MM/YYYY')}
                placeholder="Selected Date"
                editable={false}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={date => handleDateConfirm(date)}
              onCancel={hideDatePicker}
            />
          </View>
          {errorMessage ? (
            <Text style={styles.errorMsg}>{errorMessage}</Text>
          ) : null}
        </View>
        <View style={styles.BGlowA}>
          <View style={styles.header}>
            <FontAwesome5 name="clock" color={'#000'} size={17} />
            <Text style={styles.title}>Pick a Time</Text>
          </View>
          {/* <View
            style={{
              marginVertical: 1,
              // paddingHorizontal: 5,
            }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {availableSlots.map((time, index) => (
                <Pressable
                  onPress={() => {
                    setStartTime(
                      moment.utc(time.startTime).format('DD/MM/YYYY hh:mm'),
                    );
                    setEndTime(
                      moment.utc(time.endTime).format('DD/MM/YYYY hh:mm'),
                    );
                    setStatus(time.status);
                  }}
                  key={index}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    backgroundColor: '#ED6B05',
                    borderRadius: 6,
                    marginBottom: 9,
                    margin: 3,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 6,
                  }}>
                  <Text
                    style={{fontSize: 16, color: 'white', fontWeight: '500'}}>
                    {moment.utc(time.startTime).format('h:mm a')}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            {errorMessage ? (
              <Text style={styles.errorMsg}>{errorMessage}</Text>
            ) : null}
            <Text style={styles.Text3}>Date & Start Time : {startTime}</Text>
            <Text style={styles.Text3}>Date & End Time : {endTime}</Text>
            <Text style={styles.Text3}>status : {status}</Text> */}

          {/* For Booking Slot Availble or not */}
          {/* <BookingSlot /> */}
          {/* For Booking Slot Availble or not */}
          {/* </View> */}
          <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {availableSlots.map((time, index) => (
                <Pressable
                  onPress={() => {
                    setStartTime(
                      moment.utc(time.startTime).format('DD/MM/YYYY hh:mm'),
                    );
                    setEndTime(
                      moment.utc(time.endTime).format('DD/MM/YYYY hh:mm'),
                    );
                    setStartT(moment.utc(time.startTime).format('hh:mm A'));
                    setEndT(moment.utc(time.endTime).format('hh:mm A'));
                    setDate(moment.utc(time.endTime).format('DD/MM/YYYY'));
                    setStatus(time.status);
                    setShowDetails(true); // Show details when a slot is clicked
                  }}
                  key={index}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    backgroundColor: '#ED6B05',
                    borderRadius: 6,
                    marginBottom: 9,
                    margin: 3,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 6,
                  }}>
                  <Text
                    style={{fontSize: 16, color: 'white', fontWeight: '500'}}>
                    {moment.utc(time.startTime).format('h:mm a')}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Display error message if exists */}
            {errorMessage ? (
              <Text style={styles.errorMsg}>{errorMessage}</Text>
            ) : null}

            {/* Display selected slot details only if a slot is clicked */}
            {showDetails && (
              <View
                style={[
                  styles.slot,
                  status === 'Available'
                    ? styles.availableSlot
                    : styles.bookedSlot,
                  {borderColor: status === 'Available' ? 'green' : 'red'},
                  {
                    backgroundColor:
                      status === 'Available' ? '#e7f9e7' : '#f9e7e7',
                  },
                ]}>
                <Icon
                  name={
                    status === 'Available' ? 'check-circle' : 'times-circle'
                  }
                  size={20}
                  color={status === 'Available' ? 'green' : 'red'}
                  style={styles.slotIcon}
                />
                <Text
                  style={[
                    styles.title1,
                    {color: status === 'Available' ? 'green' : 'red'},
                  ]}>
                  {status}
                </Text>
                <Text
                  style={[
                    styles.Text3,
                    {color: status === 'Available' ? 'green' : 'red'},
                  ]}>
                  {date}
                </Text>
                <Text
                  style={[
                    styles.Text3,
                    {color: status === 'Available' ? 'green' : 'red'},
                  ]}>
                  {startT}-{endT} {/* Use startT and endT for formatted time */}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.BGlowA}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateGames', {
                sportlist: turfData.sportlist,
                turfId: turfId,
              });
            }}>
            <View style={[styles.headerA, {margin: 20, alignItems: 'center'}]}>
              <MaterialCommunityIcons
                name="sitemap-outline"
                color={'black'}
                size={18}
                style={{marginLeft: 2, bottom: 10}}
              />
              <Text style={[styles.title, {bottom: 10}]}>Create Game</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.BGlowA}>
          <View style={styles.headerA}>
            <MaterialIcons name="sports-kabaddi" color={'black'} size={18} />
            <Text style={styles.title}>Select Number Of People</Text>
          </View>
          <Text style={styles.Text3}>
            Turf price per head: {calculatePrice()}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.Input1}>
              <TextInput
                keyboardType="numeric"
                value={numPeople.toString()}
                style={{fontSize: 12, color: 'black'}}
                onChangeText={text => setNumPeople(parseInt(text) || 0)}
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  `Total Price: ${totalPrice} ₹ \nPrice Per Head: ${calculatePrice()} ₹ `,
                )
              }
              style={{
                backgroundColor: '#ED6B05',
                top: 15,
                width: 70,
                height: 28,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Add Member">
              <Text style={{fontSize: 10, color: 'white'}}>Add Member</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.Text3}>Number of People: {numPeople}</Text>
          <Text style={styles.Text3}>Total Price: {totalPrice}</Text>
        </View>

        <View style={[styles.BGlowA, {alignItems: 'flex-start'}]}>
          <View style={styles.headerA}>
            <MaterialIcons name="currency-rupee" color={'black'} size={18} />
            <Text style={styles.title}>Booking Review</Text>
          </View>

          <View style={styles.addresscontainer}>
            <Text style={styles.Text3}>Slot Price :{'             '}</Text>
            <MaterialIcons
              name="currency-rupee"
              color={'black'}
              size={14}
              style={{left: 80}}
            />
            <Text style={styles.Text3}>1200.00</Text>
          </View>

          <View style={styles.addresscontainer}>
            <Text style={styles.Text3}>Final Amount :{'       '}</Text>
            <MaterialIcons
              name="currency-rupee"
              color={'black'}
              size={14}
              style={{left: 80}}
            />
            <Text style={styles.Text3}>1200.00</Text>
          </View>

          <View style={styles.addresscontainer}>
            <Text style={styles.Text3}>Advance Amount : </Text>
            <MaterialIcons
              name="currency-rupee"
              color={'black'}
              size={14}
              style={{left: 80}}
            />
            <Text style={styles.Text3}>300.00</Text>
          </View>

          <View style={styles.addresscontainer}>
            <Text style={styles.Text3}>Payable at Turf:{'     '}</Text>
            <View style={styles.addresscontainer}>
              <MaterialIcons
                name="currency-rupee"
                color={'black'}
                size={14}
                style={{left: 80}}
              />
              <Text style={styles.Text3}>1200.00</Text>
            </View>
          </View>

          <Text style={{fontSize: 15, color: 'black'}}>
            ----------------------------------------------------------------------------------
          </Text>

          <View style={styles.addresscontainer}>
            <Text
              style={{
                fontSize: 15,
                color: 'green',
                fontWeight: 'bold',
                left: 10,
              }}>
              Total Pay :{'                     '}
            </Text>
            <View style={styles.addresscontainer}>
              <MaterialIcons
                name="currency-rupee"
                color={'green'}
                size={14}
                style={{left: 40}}
              />
              <Text style={{fontSize: 15, color: 'green', fontWeight: 'bold'}}>
                {totalPrice}
              </Text>
            </View>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  width: '92%',
                  height: '80%',
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{position: 'absolute', top: 10, right: 10}}
                  onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    top: -50,
                  }}>
                  {turfData.name}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    textAlign: 'center',
                    top: -30,
                  }}>
                  Payment QR Code
                </Text>
                <View style={styles.qrCodeContainer}>
                  <ViewShot
                    ref={qrCodeRef}
                    options={{format: 'png', quality: 1.0}}>
                    <QRCode
                      value={totalPrice.toString()} // Use totalPrice as the QR code value
                      size={width * 0.6}
                    />
                  </ViewShot>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    textAlign: 'center',
                    top: 40,
                  }}>
                  Amount: {totalPrice}
                </Text>
                <TouchableOpacity
                  onPress={() => handleBooking()}
                  style={{
                    backgroundColor: 'green',
                    width: width / 1.5,
                    height: height / 22,
                    borderRadius: 10,
                    margin: 10,
                    marginHorizontal: 12,
                    bottom: 5,

                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    top: 50,
                  }}
                  title="Signup">
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    Book Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <View style={{flexDirection: 'row', gap: 0, marginTop: 6}}></View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.payBtn}
        title="Signup">
        <Text
          style={{
            fontSize: 15,
            color: 'white',
            fontWeight: 'bold',
          }}>
          Payment
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerA: {
    flex: 1,
    padding: 20,
  },
  headerA: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 8,
  },
  BG: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 2,
    backgroundColor: 'white',
    height: '40%',
  },
  BGlow: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 0,
    padding: 5,
    shadowColor: '#38Acec',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 27,
    backgroundColor: 'white',
  },

  BGlowA: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    margin: 6,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 10,
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    // width: 118,
    width: '48%',
    justifyContent: 'center',
  },
  optionText: {
    // marginLeft: 10,
    marginLeft: 5,
    fontSize: 10,
    color: '#010048',
    justifyContent: 'flex-start',
  },
  activeTab: {
    backgroundColor: '#ED6B05',
    // justifyContent:"flex-start"
    justifyContent: 'center',
  },
  activeText: {
    color: '#fff',
    fontSize: 10,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  card: {
    top: 10,
    backgroundColor: '#fff',
    padding: 1,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: 'green',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderBlockColor: '010048',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  cardSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#010048',
    fontWeight: '600',
  },

  facilityContainer: {
    marginBottom: 20,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  facilityText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 1,
    margin: 3,
    fontWeight: '700',
  },
  icons: {
    marginRight: 10,
  },
  priceListContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  priceLabel: {
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',

    fontWeight: 'bold',
    flex: 1,
  },
  priceValue: {
    fontSize: 16,
    color: '#0039a6',
    marginLeft: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  detailsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addresscontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressicon: {
    marginRight: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 1,
    margin: 3,
    fontWeight: '700',
  },
  aline: {
    flexDirection: 'row',
    margin: 10,
  },

  flatListContainerStyle: {
    height: 70,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 20,
  },

  Text3: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: '#010048',
    fontWeight: '700',
    // bottom: 20,
    marginHorizontal: 10,
  },

  Input: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width / 1.6,
    borderWidth: 1.5,
    borderColor: 'green',
    // borderRadius: 30,
    borderRadius: 10,
    height: height / 18,
    marginLeft: 10,
    margin: 5,
  },
  input: {
    width: '96%',
    justifyContent: 'center',
    padding: 3,
    fontSize: 14,
    marginLeft: 3,
    color: '#000',
  },
  Input1: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: 20,
    margin: 10,
    width: width / 2.6,
    borderWidth: 1.5,
    borderColor: 'green',
    borderRadius: 12,
    height: height / 21,
  },
  image: {
    height: height / 3,
    width: width / 1.5,
    margin: 15,
    marginLeft: 15,
  },
  textrate: {
    fontSize: 10,
    color: 'black',
    fontWeight: '500',
    margin: 5,
    marginVertical: 3,
  },
  textpay: {
    fontSize: 11,
    color: 'black',
    marginVertical: 2,
    marginHorizontal: 50,
    margin: 5,
  },
  payBtn: {
    backgroundColor: 'green',
    width: width / 1.1,
    height: height / 22,
    borderRadius: 10,
    margin: 10,
    marginHorizontal: 12,
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  payBtnA: {
    backgroundColor: '#e9e7e7',
    width: width / 2.9,
    height: height / 15,
    borderRadius: 8,
    margin: 4,
    marginHorizontal: 12,
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonA: {
    backgroundColor: '#010048',
    borderRadius: 30,
    width: '18%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    top: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonTextA: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#010048',
    margin: 5,
  },
  title1: {
    fontSize: 17,
    fontWeight: 'bold',
    margin: 5,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width / 2.5,
    borderWidth: 1.5,
    borderColor: 'green',
    borderRadius: 12,
    height: height / 21,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 8,
  },
  icon: {
    color: 'black',
    marginTop: 1,
  },
  errorMsg: {color: 'red', marginBottom: 5, marginLeft: 10, fontSize: 13},
  swiper: {
    height: height * 0.6,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slot: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 3,
    borderWidth: 1.5,
    borderRadius: 12,
    position: 'relative',
    marginTop: 10,
    width: '50%',
  },
  slotIcon: {
    position: 'absolute',
    top: -10,
    right: -5,
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 5,
  },
});
const pickerStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    color: '#010048',
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: '#010048',
  },
  iconContainer: {
    top: 15,
    right: 10,
  },

  imagesize: {
    width: '100%',
    height: 10,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  container: {
    padding: 20,
  },
  slotCont: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: 10,
    margin: 10,
    width: width / 2.6,
    borderWidth: 1.5,
    borderColor: 'green',
    borderRadius: 12,
    height: height / 21,
  },
  slotDetails: {
    flex: 1,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slotStatus: {
    fontSize: 14,
    color: 'gray',
  },
  availableSlot: {
    backgroundColor: '#e7f9e7',
    borderColor: 'green',
  },
  bookedSlot: {
    backgroundColor: '#f9e7e7',
    borderColor: 'red',
  },
  hook: {
    position: 'absolute',
    top: -30, // Adjusted to position the hook above the sign
    alignItems: 'center',
  },
  hookCircle: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'black',
    marginBottom: -5, // Adjusted to connect the circle with the stem
  },
  hookStem: {
    width: 2, // Narrow stem for the hook
    height: 20, // Height to extend the hook downwards
    backgroundColor: 'black',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  amountText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBlockColor: '#000',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BookNow;
