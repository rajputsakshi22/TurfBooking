import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilePicker from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';

const File = ({style, fileData, setFileData, setFieldValue, imageIndex}) => {
  const [base64Image, setBase64Image] = useState('');

  const handleFilePicker = async () => {
    try {
      const response = await FilePicker.pick({
        type: [FilePicker.types.images],
        allowMultiSelection: false,
      });

      if (response && response.length > 0) {
        const fileUri = response[0].uri;
        const filePath =
          Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri;
        const base64String = await RNFS.readFile(filePath, 'base64'); // Convert to base64

        setBase64Image(base64String); // Save base64 string

        const updatedFileData = {
          ...response[0],
          base64: base64String, // Include base64 in the file data
        };

        setFileData(prevData => {
          const newData = [...prevData];
          newData[imageIndex] = updatedFileData;
          return newData;
        });

        setFieldValue(`image${imageIndex + 1}`, base64String); // Set Formik value
        Alert.alert('Success', `File ${imageIndex + 1} selected successfully`);
      }
    } catch (err) {
      if (FilePicker.isCancel(err)) {
        Alert.alert('Cancelled', 'File selection was canceled');
      } else {
        console.error('File Picker Error:', err);
        Alert.alert('Error', 'An error occurred while selecting the file');
      }
    }
  };

  return (
    <View
      style={[{flexDirection: 'row', alignItems: 'center', gap: 10}, style]}>
      {fileData[imageIndex] ? (
        <>
          <Image
            source={{
              uri: `data:image/jpeg;base64,${fileData[imageIndex].base64}`,
            }} // Display base64 image
            style={{width: 35, height: 35, margin: 5}}
          />
          <Text style={{marginLeft: 10}}>{fileData[imageIndex].name}</Text>
          <TouchableOpacity
            onPress={() =>
              setFileData(prevData => {
                const newData = [...prevData];
                newData[imageIndex] = null;
                setFieldValue(`image${imageIndex + 1}`, ''); // Clear Formik value
                return newData;
              })
            }>
            <AntDesign name="delete" color={'red'} size={18} />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handleFilePicker}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
            <FontAwesome
              name="file-photo-o"
              color={'black'}
              size={15}
              style={{marginLeft: 10}}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 14,
                color: '#444444',
              }}>
              Select File {imageIndex + 1}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default File;
