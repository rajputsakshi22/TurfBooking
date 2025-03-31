/* eslint-disable prettier/prettier */
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
import React, {useState, useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import postAddSport from '../../Service/AdminAPI/postAddSport';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const {height, width} = Dimensions.get('window');
const validationSchema = Yup.object().shape({
  sportsName: Yup.string().required('required'),
});

const Sports = ({navigation}) => {
  const [ownerturfID, setOwnerTurfID] = useState('');
  const [addedSports, setAddedSports] = useState([]); // State to store all added sports

  const handleCancel = resetForm => {
    navigation.navigate('Module1');
    resetForm();
  };

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

  return (
    <Formik
      initialValues={{sportsName: ''}}
      validationSchema={validationSchema}
      onSubmit={async (values, {resetForm}) => {
        const turfID = await AsyncStorage.getItem('turfID');
        setOwnerTurfID(turfID);

        const data = {
          turfId: turfID,
          sportsName: values.sportsName,
        };

        postAddSport(data)
          .then(() => {
            Alert.alert(`Successfully added sport: ${values.sportsName}.`);
            setAddedSports(prevSports => [...prevSports, values.sportsName]); // Add the sport to the list
            resetForm();
          })
          .catch(error => {
            console.log('Error in postAddSport:', error);
            Alert.alert('Error! Could not add sport. Please check again.');
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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Add Sports to Your Turf</Text>
          </View>

          <View style={styles.formBox}>
            <Text style={styles.label}>Owner ID</Text>
            <TextInput
              placeholder="Owner Turf ID"
              style={styles.input}
              value={ownerturfID}
              editable={false}
            />

            <Text style={styles.label}>Enter Sport to Add</Text>
            <TextInput
              placeholder="Enter sport"
              style={styles.input}
              onChangeText={handleChange('sportsName')}
              onBlur={handleBlur('sportsName')}
              value={values.sportsName}
            />
            {touched.sportsName && errors.sportsName && (
              <Text style={styles.errorText}>{errors.sportsName}</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleCancel(resetForm)}
                style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid}
                style={[
                  styles.button,
                  {backgroundColor: isValid ? '#ff6600' : '#a5b3e3'},
                ]}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {addedSports.length > 0 && (
            <View style={styles.addedSportsContainer}>
              <Text style={styles.addedSportHead}>List of sports added</Text>
              {addedSports.map((sport, index) => (
                <View key={index} style={styles.addedSportItem}>
                  <Icon name="soccer-ball-o" size={13} color="#0039a6" />
                  <Text style={styles.addedSportText}>{sport}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </Formik>
  );
};

export default Sports;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0039a6',
  },
  formBox: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#0039a6',
    shadowOpacity: 2,
    elevation: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    height: 40,
    backgroundColor: '#e8ecf8',
    borderRadius: 5,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: width / 2.7,
    height: 30,
  },
  cancelButton: {
    backgroundColor: '#0039a6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addedSportsContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#0039a6',
    shadowOpacity: 2,
    elevation: 10,
    marginTop: 20,
  },
  addedSportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  addedSportText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0039a6',
    marginLeft: 10,
  },
  addedSportHead: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
});
