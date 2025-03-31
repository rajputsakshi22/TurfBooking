/* eslint-disable prettier/prettier */
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');

const Welcome = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../Images/plays.jpg')} style={styles.logo} />
      <Text
        style={{
          bottom: 50,
          fontSize: 30,
          fontWeight: '900',
          fontWeight: 'bold',
          color: '#1F41BB',
          marginBottom: 20,
        }}>
        Hello, Welcome !
      </Text>
      <Text style={styles.Text}>Explore Turf in your city</Text>

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminSignin')}
          style={styles.SubmitButton}
          title="AdminSignin">
          <Text style={styles.SubmitText}>Add My Turf</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signin')}
          style={styles.SubmitButton}
          title="Signin">
          <Text style={styles.SubmitText}>Explore Turf</Text>
        </TouchableOpacity>
      </View>
      {/* <Image
    source={require("../Image/androidicon1.png")}
    style={styles.footerImage}
  /> */}
      <View
        style={{
          width: '50%',
          height: 85,
          marginBottom: 12,
          marginLeft: 'auto',
          marginRight: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 60,
        }}>
        <Image
          style={{
            width: '50%',
            height: '100%',
            resizeMode: 'contain',
          }}
          source={require('../Images/download_prev_ui.png')}
        />
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: width / 1.6,
    height: height / 2.5,
    resizeMode: 'contain',
    bottom: -30,
  },
  Text: {
    bottom: 80,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: 'black',
    fontWeight: '900',
  },
  SubmitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#666699',
    height: height / 24,
    width: width / 2.9,
    bottom: 80,
    margin: 10,
    // marginBottom: 10,
  },
  footerImage: {
    height: height * 0.1,
    width: width * 0.3,
    marginTop: 1,
    marginBottom: 50,
    resizeMode: 'contain',
  },
  SubmitText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: 'white',
    fontWeight: '900',
    
  },
});
