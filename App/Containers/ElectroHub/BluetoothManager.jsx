import React, { useEffect, useState } from 'react';
import { View, Button, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
//import RNBluetoothClassic from 'react-native-bluetooth-classic';

const BluetoothManager = () => {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  useEffect(() => {
    const requestPermissionsAndCheckBluetooth = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);

          const allGranted = Object.values(granted).every(value => value === PermissionsAndroid.RESULTS.GRANTED);
          if (!allGranted) {
            Alert.alert('Permissions denied', 'You need to grant all permissions to use this feature.');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }

      RNBluetoothClassic.isBluetoothEnabled()
        .then(enabled => {
          setBluetoothEnabled(enabled);
          if (!enabled) {
            Alert.alert(
              'Bluetooth not enabled',
              'Please enable Bluetooth to connect to HC-05',
              [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Enable Bluetooth', onPress: () => RNBluetoothClassic.requestBluetoothEnabled() }
              ],
              { cancelable: false }
            );
          }
        })
        .catch(err => console.error('Error checking Bluetooth status:', err));
    };

    requestPermissionsAndCheckBluetooth();

    RNBluetoothClassic.getBondedDevices()
      .then(devices => {
        const hc05 = devices.find(d => d.name === 'HC-05' || d.name === 'HC-06');
        if (hc05) {
          setDevice(hc05);
        } else {
          console.log('No HC-05 device found');
        }
      })
      .catch(err => console.error(err));
  }, []);

  const connectToDevice = () => {
    if (device) {
      RNBluetoothClassic.connectToDevice(device.address)
        .then(() => {
          console.log('Connected to', device.name);
          setConnected(true);
        })
        .catch(err => console.error(err));
    }
  };

  const sendMessage = (message) => {
    if (connected) {
      RNBluetoothClassic.writeToDevice(device.address, message)
        .then(() => {
          console.log('Successfully wrote to device');
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {!bluetoothEnabled && (
        <View>
          <Text>Bluetooth is not enabled. Please enable Bluetooth to continue.</Text>
          <Button title="Enable Bluetooth" onPress={() => {
            RNBluetoothClassic.requestBluetoothEnabled()
              .then(result => setBluetoothEnabled(result))
              .catch(err => {
                console.error('Error enabling Bluetooth:', err);
                Alert.alert(
                  'Bluetooth not enabled',
                  'You need to enable Bluetooth to use this feature.',
                  [{ text: 'OK' }],
                  { cancelable: false }
                );
              });
          }} />
        </View>
      )}
      {bluetoothEnabled && (
        <>
          <Button title="Connect to HC-05" onPress={connectToDevice} />
          {connected && (
            <>
              <Text>Connected to: {device.name}</Text>
              <Button title="Send Message" onPress={() => sendMessage('Hello HC-05')} />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default BluetoothManager;
