import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const {width} = Dimensions.get('window');

const QRCodeScreen = () => {
  const [amount, setAmount] = useState('');
  const qrCodeRef = useRef(null);

  const isValidAmount = amount => {
    return !isNaN(amount) && parseFloat(amount) > 0;
  };

  const handleSaveQRCode = async () => {
    if (!isValidAmount(amount)) {
      Alert.alert('Input Error', 'Please enter a valid amount.');
      return;
    }

    try {
      const uri = await qrCodeRef.current.capture();
      const path = `${RNFS.PicturesDirectoryPath}/QRCode-${amount}.png`;

      // Write the captured image to the specified path
      await RNFS.writeFile(path, uri, 'base64');
      Alert.alert('Success', `QR Code has been saved to ${path}`);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the QR code.');
      console.error('Error saving QR code:', error);
    }
  };

  const handleShareQRCode = async () => {
    if (!isValidAmount(amount)) {
      Alert.alert('Input Error', 'Please enter a valid amount.');
      return;
    }

    try {
      const message = `Scan this QR code to receive ${amount || 'amount'}`;
      const result = await Share.share({message});
      if (result.action === Share.sharedAction) {
        Alert.alert('Success', 'QR code shared successfully');
      } else if (result.action === Share.dismissedAction) {
        Alert.alert('Cancelled', 'Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Error sharing QR code');
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Payment QR Code</Text>

      <View style={styles.qrCodeContainer}>
        <ViewShot ref={qrCodeRef} options={{format: 'png', quality: 1.0}}>
          <QRCode value={amount || 'No amount entered'} size={width * 0.6} />
        </ViewShot>
      </View>
      <Text style={styles.amountText}>Amount: {amount || 'Not entered'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  textInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  qrCodeContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    marginBottom: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#e87a28',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeScreen;
