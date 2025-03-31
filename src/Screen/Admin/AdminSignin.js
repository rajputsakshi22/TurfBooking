import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import postAdminSignin from '../../Service/AdminAPI/postAdminSignin';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
const {height, width} = Dimensions.get('window');

// Create a Yup schema for validation
const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const AdminSignin = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [showconfirmPassword, setShowconfirmPassword] = useState(true);

  // Define handleCancel inside the component and pass navigation
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
          },
        },
      ],
    );
  };

  return (
    <Formik
      initialValues={{username: '', password: '', confirmPassword: ''}}
      validationSchema={validationSchema}
      onSubmit={async values => {
        const data = {
          username: values.username,
          password: values.password,
        };
        console.log('data', data);
        postAdminSignin(data)
          .then(async result => {
            console.log('result', result.data);
            await AsyncStorage.setItem('token', result && result.data.token);

            await AsyncStorage.setItem(
              'turfID',
              result && result.data.clist[0].turfID.toString(),
            );
            await AsyncStorage.setItem(
              'role',
              result && result.data.clist[0].role.toString(),
            );

            // console.log(turfID);
            navigation.navigate('AppDrawerNav');

            // navigation.navigate('AppDrawerNav');
            // navigation.navigate('UploadImage');
            Alert.alert('Login Successfully...');
          })
          .catch(error => {
            console.log('postSignin error :-', error);
            Alert.alert(
              'Login Failed !',
              'Please Check Your Username and Password ',
            );
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
        resetForm,
      }) => (
        <View style={styles.Container}>
          <View style={styles.BGBox}>
            <Text style={styles.Text}>Login</Text>
            <Text style={styles.TextO}>For Turf Owner</Text>
            <Text style={styles.Text1}>Sign in with your account</Text>
            <View style={styles.inputContainer}>
              <View style={styles.Input1}>
                <SimpleLineIcons name="user" color={'#0039a6'} size={16} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderColor="#000000"
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
                  placeholderColor="#000000"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={showPassword}
                />
                <View style={styles.iconContainer}>
                  <Icon
                    size={20}
                    style={styles.icon}
                    name={showPassword ? 'eye-off' : 'eye-outline'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                </View>
              </View>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errortext}>{errors.password}</Text>
            )}
            <View style={styles.inputContainer}>
              <View style={styles.Input11}>
                <SimpleLineIcons name="lock" color={'#0039a6'} size={16} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderColor="#000000"
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={showconfirmPassword}
                />
                <View style={styles.iconContainer}>
                  <Icon
                    size={20}
                    style={styles.icon}
                    name={showconfirmPassword ? 'eye-off' : 'eye-outline'}
                    onPress={() => setShowconfirmPassword(!showconfirmPassword)}
                  />
                </View>
              </View>
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errortext}>{errors.confirmPassword}</Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid}
                style={[
                  styles.SubmitButton,
                  {backgroundColor: isValid ? '#666699' : '#a5b3e3'},
                ]}
                title="Login">
                <Text style={styles.SubmitText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCancel(resetForm)}
                style={[
                  styles.SubmitButton,
                  {backgroundColor: isValid ? '#666699' : '#a5b3e3'},
                ]}
                title="Cancel">
                <Text style={styles.SubmitText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.Text2}>Forget Password ?</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                top: -40,
              }}>
              <Text style={styles.Text3}>If New User{'  '}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AdminSignup')}
                title="AdminSignup">
                <Text style={[styles.Text3, {color: '#0039a6'}]}>
                  Add New Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default AdminSignin;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38Acec',
    shadowOpacity: 2,
    elevation: 10,
  },

  iconContainer: {
    padding: 4,
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
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 10,
    color: '#010048',
    width: '91%',
    backgroundColor: '#e8ecf8',
    height: height / 18,
    borderRadius: 5,
  },

  BGBox: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width / 1.08,
    height: height / 1.4,
    borderRadius: 10,
    backgroundColor: 'white',
    // shadowColor: 'gray',
    shadowColor: '#38Acec',
    shadowOpacity: 2,
    elevation: 10,
    // padding: 75,
    padding: 25,
  },

  SubmitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: height / 24,
    width: width / 3.6,
    margin: 10,
    bottom: 10,
  },
  SubmitText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: 'white',
    fontWeight: '900',
  },
  Text: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#0039a6',
    top: 5,
  },
  Text1: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: 'black',
    fontWeight: '900',
    top: -10,
    marginBottom: -10,
  },
  Text2: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#19B0C6',
    // fontWeight: '900',
    textDecorationLine: 'underline',
    bottom: 30,
    marginBottom: 10, //** */
    marginTop: 10,//** */
  },
  Text3: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    // fontWeight: '900',
    bottom: 5,
  },
  Input: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width / 1.8,
    backgroundColor: '#e8ecf8',
    height: height / 18,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  Inputicon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width / 12,
    backgroundColor: '#e8ecf8',
    height: height / 18,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },

  Text4: {
    fontFamily: 'Roboto-Bold',
    fontSize: 10,
    color: 'black',
  },
  errortext: {
    fontFamily: 'Roboto-Bold',
    marginTop: 0,
    fontSize: 12,
    color: 'red',
  },
});
