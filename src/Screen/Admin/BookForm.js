import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import postBooking from '../../Service/AdminAPI/postBooking';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
const {width, height} = Dimensions.get('window');

const BookingSchema = yup.object().shape({
  customerId: yup.string().required('Customer ID is required'),
});

export default function BookForm({navigation}) {
  const [ownerturfID, setOwnerTurfID] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedOpeningTime, setSelectedOpeningTime] = useState('');
  const [selectedClosingTime, setSelectedClosingTime] = useState('');
  const [timePickerType, setTimePickerType] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const getTurfID = async () => {
      try {
        const turfID = await AsyncStorage.getItem('turfID');
        if (turfID !== null) {
          setOwnerTurfID(turfID);
        }
      } catch (error) {
        console.error('Error fetching turfID', error);
      }
    };

    getTurfID();
  }, []);

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = type => {
    setTimePickerVisibility(true);
    setTimePickerType(type);
  };

  const handleDateConfirm = date => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (time, type) => {
    const formattedTime = moment(time).format('HH:mm');
    if (type === 'opening') {
      setSelectedOpeningTime(formattedTime);
    } else if (type === 'closing') {
      setSelectedClosingTime(formattedTime);
    }
    hideTimePicker();
  };

  const handleCancel = ({resetForm}) => {
    navigation.navigate('Module1');
    resetForm();
  };

  return (
    <Formik
      initialValues={{
        customerId: '',
      }}
      validationSchema={BookingSchema}
      onSubmit={async (values, {resetForm}) => {
        const data = {
          turfId: ownerturfID,
          startTime:
            moment(selectedDate).format('DD/MM/YYYY') +
            ' ' +
            selectedOpeningTime,
          endTime:
            moment(selectedDate).format('DD/MM/YYYY') +
            ' ' +
            selectedClosingTime,
          status: 'request',
          customerId: values.customerId,
          bookedBy: 'turfowner',
        };

        console.log('Booking data:', data);

        try {
          const response = await postBooking(data);
          console.log('Response:', response.data);
          Alert.alert('Booking Successful');
          resetForm();
        } catch (error) {
          console.error('Error in sending booking request:', error);
          Alert.alert('Check date and input fields', error.message);
        }
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        resetForm,
        isValid,
      }) => (
        <View style={styles.container}>
          <View style={styles.BGBox}>
            <Text style={styles.Text}>Enter Booking Details</Text>
            <Text style={styles.label}>Turf Id</Text>
            <View style={styles.Input}>
              <TextInput
                style={styles.readOnlyInput}
                placeholder="Turf ID"
                value={ownerturfID}
                editable={false}
              />
            </View>
            <Text style={styles.label}>Customer Id</Text>
            <View style={styles.Input}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Customer ID"
                onChangeText={handleChange('customerId')}
                onBlur={handleBlur('customerId')}
                value={values.customerId}
              />
            </View>
            {touched.customerId && errors.customerId && (
              <Text style={styles.errorText}>{errors.customerId}</Text>
            )}

            <View style={styles.Input1}>
              <MaterialIcons name="date-range" color={'#0039a6'} size={15} />
              <TouchableOpacity onPress={showDatePicker}>
                <TextInput
                  style={styles.input}
                  value={moment(selectedDate).format('DD/MM/YYYY')}
                  placeholder="Selected Date"
                  editable={false}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </View>

            <View style={styles.Input1}>
              <FontAwesome5 name="clock" color={'#0039a6'} size={15} />
              <TouchableOpacity onPress={() => showTimePicker('opening')}>
                <TextInput
                  style={styles.input}
                  value={selectedOpeningTime}
                  placeholder="Select Opening Time"
                  editable={false}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible && timePickerType === 'opening'}
                mode="time"
                onConfirm={time => handleConfirm(time, 'opening')}
                onCancel={hideTimePicker}
              />
            </View>

            <View style={styles.Input1}>
              <FontAwesome5 name="clock" color={'#0039a6'} size={15} />
              <TouchableOpacity onPress={() => showTimePicker('closing')}>
                <TextInput
                  style={styles.input}
                  value={selectedClosingTime}
                  placeholder="Select Closing Time"
                  editable={false}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible && timePickerType === 'closing'}
                mode="time"
                onConfirm={time => handleConfirm(time, 'closing')}
                onCancel={hideTimePicker}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleCancel({resetForm})}
                style={[styles.SubmitButton, {backgroundColor: '#1F41BB'}]}
                title="Cancel">
                <Text style={styles.SubmitText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid}
                style={[
                  styles.SubmitButton,
                  {backgroundColor: isValid ? '#ff6600' : '#a5b3e3'},
                ]}
                title="Submit">
                <Text style={styles.SubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
}
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   Alert,
//   Dimensions,
//   TouchableOpacity,
//   Text,
// } from 'react-native';
// import {Formik} from 'formik';
// import * as yup from 'yup';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import postBooking from '../../Service/AdminAPI/postBooking';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import moment from 'moment';
// const {width, height} = Dimensions.get('window');

// const BookingSchema = yup.object().shape({
//   customerId: yup.string().required('Customer ID is required'),
// });

// export default function BookForm({navigation}) {
//   const [ownerturfID, setOwnerTurfID] = useState('');
//   const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
//   const [selectedOpeningTime, setSelectedOpeningTime] = useState('');
//   const [selectedClosingTime, setSelectedClosingTime] = useState('');
//   const [timePickerType, setTimePickerType] = useState('');
//   const [SelectedDate, setSelectedDate] = useState(new Date());
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//   const hideTimePicker = () => {
//     setTimePickerVisibility(false);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const showTimePicker = type => {
//     setTimePickerVisibility(true);
//     setTimePickerType(type);
//   };

//   const handleDateConfirm = date => {
//     setSelectedDate(date);
//     hideDatePicker();
//   };

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const handleConfirm = (time, type) => {
//     // Format the selected time as needed
//     const formattedTime = time.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//     if (type === 'opening') {
//       setSelectedOpeningTime(formattedTime);
//     } else if (type === 'closing') {
//       setSelectedClosingTime(formattedTime);
//     }
//     hideTimePicker();
//   };

//   useEffect(() => {
//     const getTurfID = async () => {
//       try {
//         const turfID = await AsyncStorage.getItem('turfID');
//         if (turfID !== null) {
//           setOwnerTurfID(turfID);
//         }
//       } catch (error) {
//         console.error('Error fetching turfID', error);
//       }
//     };

//     getTurfID();
//   }, []);

//   const handleCancel = ({resetForm}) => {
//     navigation.navigate('Module1');
//     resetForm();
//   };

//   function convertTo24Hour(time12h) {
//     // Split the time string into hours, minutes, and AM/PM
//     const [time, modifier] = time12h.split(' ');
//     // Split the hours and minutes
//     const [hours, minutes] = time.split(':');
//     // Convert hours to 24-hour format
//     let hours24 = parseInt(hours, 10);
//     if (modifier === 'PM' && hours24 < 12) {
//       hours24 += 12;
//     }
//     if (modifier === 'AM' && hours24 === 12) {
//       hours24 = 0;
//     }

//     // Pad single digit values with leading zeros
//     const formattedHours = hours24 < 10 ? `0${hours24}` : hours24;
//     const formattedMinutes = minutes < 10 ? `${minutes}` : minutes;
//     // Return the time in 24-hour format
//     return `${formattedHours}:${formattedMinutes}`;
//   }
//   return (
//     <Formik
//       initialValues={{
//         customerId: '',
//       }}
//       validationSchema={BookingSchema}
//       onSubmit={async (values, {resetForm}) => {
//         const data = {
//           turfId: ownerturfID,
//           startTime:
//             moment.utc(SelectedDate).format('DD/MM/YYYY') +
//             ' ' +
//             convertTo24Hour(selectedOpeningTime),
//           endTime:
//             moment.utc(SelectedDate).format('DD/MM/YYYY') +
//             ' ' +
//             convertTo24Hour(selectedClosingTime),
//           status: 'request',
//           customerId: values.customerId,
//           bookedBy: 'turfowner',
//         };
//         console.log(
//           '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> booking data',
//           data,
//         );
//         try {
//           const response = await postBooking(data);
//           console.log(response.data);
//           Alert.alert('Booking Successful');
//         } catch (error) {
//           console.log(error, 'error in sending booking request');
//           Alert.alert('Check date and input fields');
//         }

//         resetForm();
//       }}>
//       {({
//         handleChange,
//         handleBlur,
//         handleSubmit,
//         values,
//         errors,
//         touched,
//         resetForm, // Destructure resetForm from Formik
//         isValid,
//       }) => (
//         <View style={styles.container}>
//           <View style={styles.BGBox}>
//             <Text style={styles.Text}>Enter Booking Details</Text>
//             <Text style={styles.label}>Turf Id</Text>
//             <View style={styles.Input}>
//               <TextInput
//                 style={{
//                   marginRight: width / 10,
//                   fontSize: 15,
//                   fontWeight: '500',
//                   fontFamily: 'Roboto-Bold',
//                   textAlign: 'center',
//                 }}
//                 placeholder="Turf ID"
//                 onChangeText={handleChange('turfId')}
//                 onBlur={handleBlur('turfId')}
//                 value={ownerturfID}
//                 editable={false} // Make it read-only
//               />
//             </View>
//             <Text style={styles.label}>Customer Id</Text>
//             <View style={styles.Input}>
//               <TextInput
//                 style={styles.input}
//                 keyboardType="numeric"
//                 placeholder="Customer ID"
//                 onChangeText={handleChange('customerId')}
//                 onBlur={handleBlur('customerId')}
//                 value={values.customerId}
//               />
//             </View>
//             {touched.customerId && errors.customerId && (
//               <Text style={styles.errorText}>{errors.customerId}</Text>
//             )}

//             <View style={styles.Input1}>
//               <MaterialIcons name="date-range" color={'#0039a6'} size={15} />
//               <TouchableOpacity onPress={() => showDatePicker()}>
//                 <TextInput
//                   style={styles.input}
//                   value={moment.utc(SelectedDate).format('DD/MM/YYYY')}
//                   placeholder="Selected Date"
//                   editable={false}
//                 />
//               </TouchableOpacity>
//               <DateTimePickerModal
//                 isVisible={isDatePickerVisible}
//                 mode="date"
//                 onConfirm={date => handleDateConfirm(date)}
//                 onCancel={hideDatePicker}
//               />
//             </View>

//             <View style={styles.Input1}>
//               <FontAwesome5 name="clock" color={'#0039a6'} size={15} />
//               <TouchableOpacity onPress={() => showTimePicker('opening')}>
//                 <TextInput
//                   style={styles.input}
//                   value={selectedOpeningTime}
//                   placeholder="Selected Time"
//                   editable={false}
//                 />
//               </TouchableOpacity>
//               <DateTimePickerModal
//                 isVisible={isTimePickerVisible && timePickerType === 'opening'}
//                 mode="time"
//                 onConfirm={time => handleConfirm(time, 'opening')}
//                 onCancel={hideTimePicker}
//               />
//             </View>

//             <View style={styles.Input1}>
//               <FontAwesome5 name="clock" color={'#0039a6'} size={15} />
//               <TouchableOpacity onPress={() => showTimePicker('closing')}>
//                 <TextInput
//                   style={styles.input}
//                   value={selectedClosingTime}
//                   placeholder="Selected Time"
//                   editable={false}
//                 />
//               </TouchableOpacity>
//               <DateTimePickerModal
//                 isVisible={isTimePickerVisible && timePickerType === 'closing'}
//                 mode="time"
//                 onConfirm={time => handleConfirm(time, 'closing')}
//                 onCancel={hideTimePicker}
//               />
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 marginTop: 30,
//                 width: width / 1.8,
//               }}>
//               <TouchableOpacity
//                 onPress={() => handleCancel({resetForm})}
//                 style={[styles.SubmitButton, {backgroundColor: '#1F41BB'}]}
//                 title="Cancel">
//                 <Text style={styles.SubmitText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => handleSubmit()}
//                 disabled={!isValid}
//                 style={[
//                   styles.SubmitButton,
//                   {backgroundColor: isValid ? '#ff6600' : '#a5b3e3'},
//                 ]}
//                 title="Submit">
//                 <Text style={styles.SubmitText}>Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}
//     </Formik>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  BGBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 1.08,
    height: height / 1.6,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#38Acec',
    shadowOpacity: 2,
    elevation: 10,
    padding: 20,
  },
  SubmitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: height / 22,
    width: width / 3,
    margin: 10,
    backgroundColor: '#0039a6',
    marginBottom: 5,
  },
  SubmitText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: 'white',
    fontWeight: '900',
  },
  Text: {
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#0039a6',
    margin: 10,
  },
  label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginTop: 0,
    fontWeight: 'bold',
  },
  Input: {
    flexDirection: 'row',
    paddingLeft: 15,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 10,
    color: '#010048',
    width: '100%',
    backgroundColor: '#e8ecf8',
    height: height / 18,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    width: '96%',
    justifyContent: 'center',
    padding: 3,
    fontSize: 14,
    marginLeft: 3,
  },
  Input1: {
    flexDirection: 'row',
    paddingLeft: 15,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 10,
    color: '#010048',
    width: '100%',
    backgroundColor: '#e8ecf8',
    height: height / 19,
    borderRadius: 2,
    marginBottom: 10,
  },
  InputDate: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: height / 22,
    width: width / 3,
    margin: 10,
  },
  button: {
    backgroundColor: '#7575a3',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContainerStyle: {
    height: 70,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    // width: width / 1.8,
  },
});
