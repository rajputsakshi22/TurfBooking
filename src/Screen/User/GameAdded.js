import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import postCreateGame from '../../Service/UserAPI/postCreateGame';

const {height, width} = Dimensions.get('window');

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  sportName: Yup.string().required('Sport name is required'),
  noOfPlayers: Yup.number()
    .required('Number of players is required')
    .positive('Must be a positive number')
    .integer('Must be an integer'),
  date: Yup.string().required('Date is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
});

const GameAdded = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const route = useRoute();
  const sportlist = route.params.sportlist;
  const turfId = route.params.turfId;
  const [customerID, setCustomerID] = useState(null);

  useEffect(() => {
    const fetchCustomerID = async () => {
      try {
        const storedCustomerID = await AsyncStorage.getItem('customerID');
        if (storedCustomerID) {
          setCustomerID(storedCustomerID);
        }
      } catch (error) {
        console.log('Error fetching customerID:', error);
      }
    };

    fetchCustomerID();
  }, []);

  // Helper function to format date as DD/MM/YYYY
  const formatDate = date => {
    return date.toLocaleDateString('en-GB'); // This will format date as DD/MM/YYYY
  };

  // Helper function to format time as HH:MM (24-hour format)
  const formatTime = time => {
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // This ensures 24-hour format
    });
  };

  const handleConfirmDate = (date, setFieldValue) => {
    const formattedDate = formatDate(date); // Format: DD/MM/YYYY
    setSelectedDate(formattedDate);
    setFieldValue('date', formattedDate);
    setDatePickerVisibility(false);
  };

  const handleConfirmStartTime = (time, setFieldValue) => {
    const formattedTime = formatTime(time); // Format: HH:MM (24-hour format)
    setSelectedStartTime(formattedTime);
    setFieldValue('startTime', formattedTime);
    setStartTimePickerVisibility(false);
  };

  const handleConfirmEndTime = (time, setFieldValue) => {
    const formattedTime = formatTime(time); // Format: HH:MM (24-hour format)
    setSelectedEndTime(formattedTime);
    setFieldValue('endTime', formattedTime);
    setEndTimePickerVisibility(false);
  };

  return (
    <Formik
      initialValues={{
        sportName: '',
        noOfPlayers: '',
        date: '',
        startTime: '',
        endTime: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async values => {
        const dataToSend = {
          turfId,
          startTime: `${values.date} ${values.startTime}`,
          endTime: `${values.date} ${values.endTime}`,
          customerId: customerID,
          bookedBy: 'admin',
          noOfPlayer: values.noOfPlayers,
          sportId: values.sportName,
        };

        try {
          const response = await postCreateGame(dataToSend);
          console.log('post create response:', response);
          setErrorMessage('');
          Alert.alert('Game created successfully!');
        } catch (error) {
          console.log('Error in sending booking request:', error);
          setErrorMessage(
            'There was an issue with your booking request. Please try again.',
          );
        }
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          {/* Sports Picker */}
          <View style={styles.BGlowA}>
            <View style={styles.header}>
              <MaterialIcons name="sports" color={'black'} size={20} />
              <Text style={styles.title}>Select Sports</Text>
            </View>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                items={sportlist.map(item => ({
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
                  setFieldValue('sportName', itemValue);
                }}
              />
              <AntDesign name="down" size={15} style={styles.icon} />
            </View>
            {touched.sportName && errors.sportName && (
              <Text style={styles.errorText}>{errors.sportName}</Text>
            )}
          </View>

          {/* Number of Players */}
          <View style={styles.BGlowA}>
            <View style={styles.header}>
              <MaterialIcons name="sports-kabaddi" color={'black'} size={18} />
              <Text style={styles.title}>Number of Players</Text>
            </View>
            <View style={styles.pickerContainer}>
              <TextInput
                keyboardType="numeric"
                onChangeText={handleChange('noOfPlayers')}
                onBlur={handleBlur('noOfPlayers')}
                value={values.noOfPlayers}
                placeholder="Enter number of players"
              />
            </View>
          </View>

          {touched.noOfPlayers && errors.noOfPlayers && (
            <Text style={styles.errorText}>{errors.noOfPlayers}</Text>
          )}

          {/* Date Picker */}
          <View style={styles.BGlowA}>
            <View style={styles.header}>
              <FontAwesome5 name="calendar" color={'black'} size={16} />
              <Text style={styles.title}>Date</Text>
            </View>
            <View style={styles.pickerContainer}>
              <TextInput
                value={values.date}
                placeholder="Select date"
                onFocus={() => setDatePickerVisibility(true)}
              />
            </View>
          </View>

          {touched.date && errors.date && (
            <Text style={styles.errorText}>{errors.date}</Text>
          )}

          {/* Start Time Picker */}
          <View style={styles.BGlowA}>
            <View style={styles.header}>
              <FontAwesome5 name="clock" color={'#000'} size={17} />
              <Text style={styles.title}>Start Time</Text>
            </View>
            <View style={styles.pickerContainer}>
              <TextInput
                value={values.startTime}
                placeholder="Select start time"
                onFocus={() => setStartTimePickerVisibility(true)}
              />
            </View>
          </View>

          {touched.startTime && errors.startTime && (
            <Text style={styles.errorText}>{errors.startTime}</Text>
          )}

          {/* End Time Picker */}
          <View style={styles.BGlowA}>
            <View style={styles.header}>
              <FontAwesome5 name="clock" color={'#000'} size={17} />
              <Text style={styles.title}>End Time</Text>
            </View>
            <View style={styles.pickerContainer}>
              <TextInput
                value={values.endTime}
                placeholder="Select end time"
                onFocus={() => setEndTimePickerVisibility(true)}
              />
            </View>
          </View>

          {touched.endTime && errors.endTime && (
            <Text style={styles.errorText}>{errors.endTime}</Text>
          )}

          {/* DateTime Picker Modals */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={date => handleConfirmDate(date, setFieldValue)}
            onCancel={() => setDatePickerVisibility(false)}
          />
          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={time => handleConfirmStartTime(time, setFieldValue)}
            onCancel={() => setStartTimePickerVisibility(false)}
          />
          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={time => handleConfirmEndTime(time, setFieldValue)}
            onCancel={() => setEndTimePickerVisibility(false)}
          />

          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.SubmitBtn}>
              <Text style={styles.buttonText}>Create Game</Text>
            </View>
          </TouchableOpacity>
          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width / 1.2,
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
  SubmitBtn: {
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameAdded;
