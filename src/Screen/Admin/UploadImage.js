import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, Alert} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const UploadImage = () => {
  const [base64Image, setBase64Image] = useState(null);
  const [imageName, setImageName] = useState('');

  // useEffect(() => {
  //   console.log('Base64 Image:', base64Image);
  //   console.log('Image Name:', imageName);
  // }, [base64Image, imageName]);

  const uploadImg = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo', // Specify media type as photo
      quality: 1, // Set quality to 1 (highest)
      includeBase64: true, // Include the base64 string of the image
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to pick an image. Please try again.');
      } else {
        console.log('ImagePicker Response:', response.assets[0].base64); // Log the entire response
        setBase64Image(response.assets[0].base64);
        setImageName(response.assets[0].fileName || 'image.jpg');
        // console.log(base64Image);
        console.log(imageName);
      }
    });
  };

  return (
    <View>
      <Button title="Choose Image" onPress={uploadImg} />
      {base64Image && (
        <View>
          <Image
            source={{uri: `data:image/jpg;base64,${base64Image}`}}
            style={{width: 200, height: 200}}
          />
          <Text>Image Name: {imageName}</Text>
        </View>
      )}
    </View>
  );
};

export default UploadImage;
