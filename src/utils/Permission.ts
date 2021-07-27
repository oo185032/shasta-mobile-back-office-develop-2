import {PermissionsAndroid} from 'react-native';

export async function requestCameraPermission(callback: () => any) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission to use Camera',
          message: 'We need your permission to use your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        callback()
      } else {
        console.warn('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };