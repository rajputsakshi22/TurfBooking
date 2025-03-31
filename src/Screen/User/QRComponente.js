// import React, {useEffect, useState} from 'react';
// import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
// import {Camera, useCameraDevices} from 'react-native-vision-camera';

// const QRComponente = () => {
//   const [permissionsStatus, setPermissionsStatus] = useState('loading');
//   const devices = useCameraDevices();
//   const device = devices.back;

//   useEffect(() => {
//     (async () => {
//       const cameraPermission = await Camera.requestCameraPermission();
//       const microphonePermission = await Camera.requestMicrophonePermission();

//       if (
//         cameraPermission === 'authorized' &&
//         microphonePermission === 'authorized'
//       ) {
//         setPermissionsStatus('granted');
//       } else {
//         setPermissionsStatus('denied');
//       }
//     })();
//   }, []);

//   if (permissionsStatus === 'loading') {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Checking permissions...</Text>
//       </View>
//     );
//   }

//   if (!permissionsStatus === 'denied') {
//     return (
//       <View style={styles.container}>
//         <Text>
//           Permissions denied. Please enable camera and microphone access in your
//           device settings.
//         </Text>
//       </View>
//     );
//   }

//   if (device == null) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading camera...</Text>
//       </View>
//     );
//   }

//   return (
//     <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default QRComponente;
