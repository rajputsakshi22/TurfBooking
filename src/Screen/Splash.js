/* eslint-disable prettier/prettier */
import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Welcome');
    }, 1000);
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: '900',
          fontFamily: 'Poppins-Bold',
          color: '#1F41BB',
        }}>
        Turf
      </Text>
      <Text
        style={{
          fontSize: 30,
          fontWeight: '900',
          fontFamily: 'Poppins-Bold',
          color: '#1F41BB',
        }}>
        {'  '}in City
      </Text>
      <ActivityIndicator size="large" color="#1F41BB" style={{marginTop: 20}} />
    </View>
  );
};

export default Splash;
