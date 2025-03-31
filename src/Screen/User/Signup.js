import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import postSignup from '../../Service/UserAPI/postSignup';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/dist/Feather';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width, height} = Dimensions.get('window');
import DatePicker from '../../components/datePicker';
import RNPickerSelect from 'react-native-picker-select';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  dob: Yup.string().required('dob is required'),
  gender: Yup.string().required('gender is required'),
  presentAddress: Yup.string().required('presentAddress is required'),
  phoneNumber: Yup.string()
    .max(10, 'Too Long!')
    .required('Phone no. is required')
    .matches(/^(?=.*?[0-9]).{10,}$/, 'must be digit only'),
  password: Yup.string().required('Password is required'),
  username: Yup.string().required('username is required'),
  role: Yup.string().required('role is required'),
  email: Yup.string().email('Invalid email').required('email is required'),
});

const genderOptions = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

const role = [{label: 'customer', value: 'customer'}];

const handleCancel = resetForm => {
  resetForm(); // Reset the form values to initial state
};

const Signup = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(true);
  return (
    <Formik
      initialValues={{
        name: '',
        dob: '',
        gender: '',
        presentAddress: '',
        phoneNumber: '',
        password: '',
        username: '',
        role: '',
        email: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async values => {
        const data = {
          name: values.name,
          dob: values.dob,
          gender: values.gender,
          presentAddress: values.presentAddress,
          phoneNumber: values.phoneNumber,
          username: values.username,
          password: values.password,
          role: values.role,
          email: values.email,
        };
        console.log('data', data);
        postSignup(data)
          .then(result => {
            // navigation.navigate('Home');
            Alert.alert('Create Account Successfully...');
          })
          .catch(error => {
            console.log('postSignup error :-', error);
            Alert.alert('Login Failed !');
          });
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        isValid,
        touched,
        resetForm, // Destructure resetForm from Formik
      }) => (
        <ScrollView>
          <View style={styles.Container}>
            <View style={styles.BGBox}>
              <Text style={styles.Text}>Create Account</Text>
              <Text style={styles.Text4}>Fill all necessary details</Text>

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <SimpleLineIcons name="user" color={'#0039a6'} size={16} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your Name"
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
                    placeholder="Enter your Email Id"
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
                  <FontAwesome5
                    name="address-card"
                    color={'#0039a6'}
                    size={14}
                    style={{marginLeft: 1}}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Address"
                    onChangeText={handleChange('presentAddress')}
                    onBlur={handleBlur('presentAddress')}
                    value={values.presentAddress}
                  />
                </View>
              </View>
              {touched.presentAddress && errors.presentAddress && (
                <Text style={styles.errortext}>{errors.presentAddress}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <Feather name="phone" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone No"
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
                  <Fontisto name="date" color={'#0039a6'} size={12} />
                  <View style={styles.input}>
                    <DatePicker
                      date={values.dob}
                      onDateChange={date => handleChange('dob')(date)}
                    />
                  </View>
                </View>
              </View>
              {touched.dob && errors.dob && (
                <Text style={styles.errortext}>{errors.dob}</Text>
              )}

              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    width: width / 2.8,
                    backgroundColor: '#e8ecf8',
                    borderRadius: 5,
                    height: height / 17,
                  }}>
                  <RNPickerSelect
                    items={genderOptions}
                    onValueChange={handleChange('gender')}
                    value={values.gender}
                    placeholder={{label: 'Select gender', value: null}}
                    style={{
                      inputIOS: styles.pickerInput,
                      inputAndroid: styles.pickerInput,
                      iconContainer: styles.pickerIconContainer,
                    }}
                    useNativeAndroidPickerStyle={false}
                  />
                  <AntDesign
                    name={'down'}
                    size={15}
                    style={{
                      color: '#0039a6',
                      marginTop: 1,
                    }}
                  />
                  {touched.gender && errors.gender && (
                    <Text style={styles.errortext}>{errors.gender}</Text>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    width: width / 2.8,
                    backgroundColor: '#e8ecf8',
                    borderRadius: 5,
                    height: height / 17,
                    marginLeft: 12,
                  }}>
                  <RNPickerSelect
                    items={role}
                    onValueChange={handleChange('role')}
                    value={values.role}
                    placeholder={{label: 'Select role', value: null}}
                    style={{
                      inputIOS: styles.pickerInput,
                      inputAndroid: styles.pickerInput,
                      iconContainer: styles.pickerIconContainer,
                    }}
                    useNativeAndroidPickerStyle={false}
                  />
                  <AntDesign
                    name={'down'}
                    size={15}
                    style={{
                      color: '#0039a6',
                      marginTop: 1,
                    }}
                  />
                </View>
              </View>
              {touched.role && errors.role && (
                <Text style={styles.errortext}>{errors.role}</Text>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.Input1}>
                  <SimpleLineIcons name="user" color={'#0039a6'} size={15} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
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
                  <SimpleLineIcons name="lock" color={'#0039a6'} size={16} />
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
                  // onPress={() => navigation.navigate('BottomTab')}
                  disabled={!isValid}
                  style={[
                    styles.SubmitButton,
                    {backgroundColor: isValid ? '#1F41BB' : '#a5b3e3'},
                  ]}
                  title="Login">
                  <Text style={styles.SubmitText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCancel(resetForm)} // Call handleCancel with resetForm function
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
                <Text style={styles.Text1}>Already have an account{'  '}</Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Signin')}
                  title="Signin">
                  <Text style={styles.Text2}>Sign in </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  BGBox: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width / 1.08,
    height: height / 1.02,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOpacity: 2,
    elevation: 10,
    // padding: 40,
    padding: 25,
  },

  SubmitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: height / 22,
    width: width / 3,
    margin: 10,
  },
  SubmitText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: 'white',
    fontWeight: '900',
  },
  Text: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#0039a6',
    marginVertical: -15,
    marginBottom: 3,
  },
  Text1: {
    marginVertical: -10,
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    color: 'black',
    fontWeight: '900',
  },
  Text2: {
    marginVertical: -10,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0039a6',
    // fontWeight: '900',
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

  input: {
    width: '92%',
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
  },

  Input11: {
    flexDirection: 'row',
    paddingLeft: 15,
    alignItems: 'center',
    // marginBottom: 5,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 10,
    color: '#010048',
    width: '91%',
    backgroundColor: '#e8ecf8',
    height: height / 18,
    borderRadius: 5,
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
  },

  Text4: {
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: 'black',
    bottom: -3,
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
});
