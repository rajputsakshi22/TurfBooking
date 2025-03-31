import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import postAdminSignup from '../../Service/AdminAPI/postAdminSignup';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const {width, height} = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  phoneNumber: Yup.string()
    .max(10, 'Too Long!')
    .required('Phone number is required')
    .matches(/^(?=.*?[0-9]).{10,}$/, 'Must be digits only'),
  address: Yup.string().required('Address is required'),
  cityName: Yup.string().required('City name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.string().required('Price is required'),
  username: Yup.string().required('Username is required'),
  location: Yup.string().required('location link is required'),
});

const Signup = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [selectedOpeningTime, setSelectedOpeningTime] = useState('');
  const [selectedClosingTime, setSelectedClosingTime] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [timePickerType, setTimePickerType] = useState(null);
  const [images, setImages] = useState([]);

  const showTimePicker = type => {
    setTimePickerType(type);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
    setTimePickerType(null);
  };

  // Function to handle image selection
  const handleSelectImages = setFieldValue => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can only select up to 5 images.');
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5 - images.length, // Limit remaining images
        includeBase64: true, // Enable base64
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const selectedImages = response.assets.map(asset => {
            // Add proper format for the base64 string to send to the server
            const imageFormat = asset.type === 'image/png' ? 'png' : 'jpeg';
            return `data:image/${imageFormat};base64,${asset.base64}`;
          });

          const updatedImages = [...images, ...selectedImages];
          setImages(updatedImages);
          setFieldValue('images', updatedImages); // Update Formik field with base64 images in proper format
        }
      },
    );
  };

  const renderImages = () => {
    return images.map((image, index) => (
      <Image
        key={index}
        source={{uri: image}} // Display properly formatted base64 image
        style={{width: 100, height: 100, marginRight: 10}}
      />
    ));
  };

  const handleConfirm = (time, type) => {
    const formattedTime = time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    if (type === 'opening') {
      setSelectedOpeningTime(formattedTime);
    } else if (type === 'closing') {
      setSelectedClosingTime(formattedTime);
    }

    hideTimePicker();
  };

  const handleCancel = resetForm => {
    Alert.alert(
      'Are you sure?',
      'This will clear all the entered information.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            setImages([]);
            setSelectedOpeningTime('');
            setSelectedClosingTime('');
          },
        },
      ],
    );
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        cityName: '',
        description: '',
        images: [],
        price: '',
        username: '',
        role: 'turfowner',
        openingTime: '',
        closingTime: '',
        location: '',
        latitude: '',
        longitude: '',
        amenities: [],
      }}
      validationSchema={validationSchema}
      onSubmit={async values => {
        const amenitiesString = values.amenities.join(', ');
        const data = {
          name: values.name,
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          city: values.cityName,
          address: values.address,
          description: values.description,
          images: values.images,
          price: values.price,
          username: values.username,
          role: values.role,
          openingTime: selectedOpeningTime,
          closingTime: selectedClosingTime,
          location: values.location,
          latitude: values.latitude,
          longitude: values.longitude,
          amenities: amenitiesString,
        };

        console.log('data:', data);

        postAdminSignup(data)
          .then(result => {
            navigation.navigate('AdminSignin');
            Alert.alert('Signup Successfully...');
          })
          .catch(error => {
            console.log('postAdminSignup error:', error);
            Alert.alert(
              'Signup Failed!',
              'Please Check Your Information and Try Again.',
            );
          });
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        isValid,
        errors,
        touched,
        resetForm,
      }) => (
        <ScrollView>
          <View style={styles.Container}>
            <View style={styles.BGBox}>
              <Text style={styles.Text}>Create Account</Text>
              <Text style={styles.Text2}>Add Your Truf Details</Text>

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <SimpleLineIcons name="user" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Turf Name"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                </View>
              </View>
              {touched.name && errors.name && (
                <Text style={styles.errortext}>{errors.name}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <MaterialCommunityIcons
                    name="email-edit-outline"
                    color={'#0039a6'}
                    size={15}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Email Id"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                </View>
              </View>
              {touched.email && errors.email && (
                <Text style={styles.errortext}>{errors.email}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <Feather name="phone" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Phone No"
                    keyboardType="numeric"
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    value={values.phoneNumber}
                  />
                </View>
              </View>
              {touched.phoneNumber && errors.phoneNumber && (
                <Text style={styles.errortext}>{errors.phoneNumber}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <MaterialCommunityIcons
                    name="city"
                    color={'#0039a6'}
                    size={15}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter City Name"
                    // keyboardType="numeric"
                    onChangeText={handleChange('cityName')}
                    onBlur={handleBlur('cityName')}
                    value={values.cityName}
                  />
                </View>
              </View>
              {touched.cityName && errors.cityName && (
                <Text style={styles.errortext}>{errors.cityName}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <FontAwesome5
                    name="address-card"
                    color={'#0039a6'}
                    size={15}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Address"
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    value={values.address}
                  />
                </View>
              </View>
              {touched.address && errors.address && (
                <Text style={styles.errortext}>{errors.address}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <SimpleLineIcons name="user" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Turf location link"
                    onChangeText={handleChange('location')}
                    onBlur={handleBlur('location')}
                    value={values.location}
                  />
                </View>
              </View>
              {touched.location && errors.location && (
                <Text style={styles.errortext}>{errors.location}</Text>
              )}

              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 15,
                    alignItems: 'center',
                    fontWeight: 'bold',
                    justifyContent: 'flex-start',
                    paddingRight: 10,
                    color: '#010048',
                    width: '48%',
                    backgroundColor: '#e8ecf8',
                    height: height / 18,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter latitude"
                    onChangeText={handleChange('latitude')}
                    onBlur={handleBlur('latitude')}
                    value={values.latitude}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: 'row',
                    paddingLeft: 15,
                    alignItems: 'center',
                    fontWeight: 'bold',
                    justifyContent: 'flex-start',
                    paddingRight: 10,
                    color: '#010048',
                    width: '48%',
                    backgroundColor: '#e8ecf8',
                    height: height / 18,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter longitude"
                    onChangeText={handleChange('longitude')}
                    onBlur={handleBlur('longitude')}
                    value={values.longitude}
                  />
                </View>
              </View>

              {/* <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <FontAwesome5 name="image" color={'#0039a6'} size={15} />
                  <View style={styles.input}>
                    <TouchableOpacity
                      style={[
                        styles.SubmitButton,
                        {backgroundColor: isValid ? '#1F41BB' : '#a5b3e3', marginTop: 120},
                      ]}
                      onPress={() => handleSelectImages(setFieldValue)}>
                      <Text style={styles.SubmitText}>Select Images</Text>
                      
                    </TouchableOpacity>

                    {images.length > 0 && (
                      <ScrollView horizontal style={{marginTop: 20}}>
                        {renderImages()}
                      </ScrollView>
                    )}

                    {errors.images && touched.images && (
                      <Text style={{color: 'red', marginTop: 10}}>
                        {errors.images}
                      </Text>
                    )}

                    <Text style={{marginTop: 0}}>
                      {images.length} / 5 images selected
                    </Text>
                  </View>
                </View>
              </View> */}
              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <FontAwesome5 name="image" color={'#0039a6'} size={15} />
                  <View
                    style={[
                      styles.input,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ]}>
                    <TouchableOpacity
                      style={[
                        styles.SubmitButton,
                        {backgroundColor: isValid ? '#1F41BB' : '#a5b3e3', marginTop: 25},
                      ]}
                      onPress={() => handleSelectImages(setFieldValue)}>
                      <Text style={styles.SubmitText}>Select Images</Text>
                    </TouchableOpacity>

                    {/* Placeholder beside button */}
                    <Text style={{marginLeft: 10}}>
                      {images.length}/5 image select
                    </Text>
                  </View>
                </View>

                {images.length > 0 && (
                  <ScrollView horizontal style={{marginTop: 20}}>
                    {renderImages()}
                  </ScrollView>
                )}

                {errors.images && touched.images && (
                  <Text style={{color: 'red', marginTop: 10}}>
                    {errors.images}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <MaterialCommunityIcons
                    name="book-information-variant"
                    color={'#0039a6'}
                    size={15}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Description"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                </View>
              </View>
              {touched.description && errors.description && (
                <Text style={styles.errortext}>{errors.description}</Text>
              )}
              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <MaterialCommunityIcons
                    name="city"
                    color={'#0039a6'}
                    size={15}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Amenities (comma separated)"
                    onChangeText={text =>
                      setFieldValue(
                        'amenities',
                        text.split(',').map(item => item.trim()),
                      )
                    }
                    onBlur={handleBlur('amenities')}
                    value={values.amenities.join(', ')}
                  />
                </View>
              </View>
              {touched.amenities && errors.amenities && (
                <Text style={styles.errortext}>{errors.amenities}</Text>
              )}

              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 15,
                    alignItems: 'center',
                    fontWeight: 'bold',
                    justifyContent: 'flex-start',
                    paddingRight: 10,
                    color: '#010048',
                    width: '48%',
                    backgroundColor: '#e8ecf8',
                    height: height / 18,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}>
                  <FontAwesome5 name="rupee-sign" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Price"
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price}
                  />
                </View>

                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: 'row',
                    paddingLeft: 15,
                    alignItems: 'center',
                    fontWeight: 'bold',
                    justifyContent: 'flex-start',
                    paddingRight: 10,
                    color: '#010048',
                    width: '48%',
                    backgroundColor: '#e8ecf8',
                    height: height / 18,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}>
                  <FontAwesome5 name="user" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    value="turfowner"
                    editable={false} // Makes the field non-editable
                  />
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 15,
                    alignItems: 'center',
                    fontWeight: 'bold',
                    justifyContent: 'flex-start',
                    paddingRight: 10,
                    color: '#010048',
                    width: '48%',
                    backgroundColor: '#e8ecf8',
                    height: height / 18,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}>
                  <FontAwesome5 name="clock" color={'#0039a6'} size={15} />
                  <TouchableOpacity onPress={() => showTimePicker('opening')}>
                    <TextInput
                      style={styles.input}
                      value={selectedOpeningTime}
                      placeholder="Openning Time"
                      editable={false}
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={
                      isTimePickerVisible && timePickerType === 'opening'
                    }
                    mode="time"
                    onConfirm={time => handleConfirm(time, 'opening')}
                    onCancel={hideTimePicker}
                  />
                </View>

                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: 'row',
                    paddingLeft: 15,
                    alignItems: 'center',
                    fontWeight: 'bold',
                    justifyContent: 'flex-start',
                    paddingRight: 10,
                    color: '#010048',
                    width: '48%',
                    backgroundColor: '#e8ecf8',
                    height: height / 18,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}>
                  <FontAwesome5 name="clock" color={'#0039a6'} size={15} />

                  <TouchableOpacity onPress={() => showTimePicker('closing')}>
                    <TextInput
                      style={styles.input}
                      value={selectedClosingTime}
                      placeholder="Closing Time"
                      editable={false}
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={
                      isTimePickerVisible && timePickerType === 'closing'
                    }
                    mode="time"
                    onConfirm={time => handleConfirm(time, 'closing')}
                    onCancel={hideTimePicker}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <SimpleLineIcons name="user" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                  />
                </View>
              </View>
              {touched.username && errors.username && (
                <Text style={styles.errortext}>{errors.username}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input11}>
                  <Feather name="lock" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={showPassword}
                  />
                  <View style={styles.iconContainer}>
                    <Icon
                      size={20}
                      style={styles.icon}
                      onPress={() => setShowPassword(!showPassword)}
                      name={showPassword ? 'eye-off' : 'eye-outline'}
                    />
                  </View>
                </View>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errortext}>{errors.password}</Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: height / 100,
                }}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isValid}
                  style={[
                    styles.SubmitButton,
                    {backgroundColor: isValid ? '#1F41BB' : '#a5b3e3'},
                  ]}
                  title="Login">
                  <Text style={styles.SubmitText}>Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCancel(resetForm)}
                  style={[
                    styles.SubmitButton,
                    {backgroundColor: isValid ? '#1F41BB' : '#a5b3e3'},
                  ]}
                  title="Cancel">
                  <Text style={styles.SubmitText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.Text5}>Already have an account{'  '}</Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('AdminSignin')}
                  title="Signin">
                  <Text style={styles.Text6}>Sign in </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default Signup;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
  },
  BGBox: {
    flex: 1,
    marginTop: 10,
    width: width / 1.05,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOpacity: 2,
    elevation: 10,
    padding: 25,
    alignItems: '',
  },

  iconContainer: {
    padding: 4,
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
    height: height / 18,
    borderRadius: 5,
    marginBottom: 10,
  },
  Input11: {
    flexDirection: 'row',
    paddingLeft: 15,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 10,
    color: '#010048',
    width: '91%',
    backgroundColor: '#e8ecf8',
    height: height / 18,
    borderRadius: 5,
  },

  SubmitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: height / 24,
    width: width / 3,
    margin: 10,
    marginTop: 20,
    marginBottom: 25,
  },
  SubmitText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: 'white',
    fontWeight: '900',
  },
  SubmitText1: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#0039a6',
  },
  Text: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#0039a6',
    bottom: 20,
  },
  Text1: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: 'black',
    fontWeight: '900',
    top: 10,
  },
  Text2: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#0039a6',
    fontWeight: '900',
    top: -10,
  },
  Text3: {
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    color: '#0039a6',
    fontWeight: '900',
  },

  Text4: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color: 'black',
    fontWeight: '700',
  },
  Text5: {
    marginVertical: -5,
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    color: 'black',
    fontWeight: '900',
  },
  Text6: {
    marginVertical: -5,
    fontSize: 15,
    color: '#0039a6',
    fontWeight: '900',
    // fontWeight: 'bold',
  },
  Input: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width / 1.5,
    backgroundColor: '#e8ecf8',
    height: height / 17,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  InputDate: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: height / 22,
    width: width / 3,
    margin: 10,
  },
  Inputicon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width / 12,
    backgroundColor: '#e8ecf8',
    height: height / 17,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    // padding:1,
  },

  errortext: {
    fontFamily: 'Roboto-Bold',
    marginBottom: 1,
    fontSize: 12,
    color: 'red',
  },
  errortext1: {
    fontFamily: 'Roboto-Bold',
    marginTop: 1,
    fontSize: 12,
    color: 'red',
  },
  pickerInput: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    fontWeight: '600',
    color: '#899499',
  },

  button: {
    backgroundColor: '#007BFF',
    padding: 2,
    borderRadius: 5,
    alignItems: 'flex-start',
    width: '20%',
    marginLeft: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 8,
  },
  imageName: {
    marginLeft: 10,
    color: '#000',
    flexShrink: 1,
    fontSize: 8,
  },
  DropdownText: {
    marginVertical: 6,
    marginTop: 7,
    marginLeft: 3,
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color: '#010048',
  },
  selectInput: {
    marginBottom: 5,
    heading: 10,
    border: null,
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: '#02060c',
    shadowOpacity: 10,
    elevation: 20,
    height: 40,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 3,
    fontFamily: 'Roboto-Regular',
  },
});
