import React, { useEffect, useState } from 'react';
import { Button, View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

const BluetoothComponent = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [message, setMessage] = useState('');

  const HC05_MAC_ADDRESS = '00:22:05:00:27:64';

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        requestPermissions().then((granted) => {
          if (granted) {
            scanAndConnect();
          } else {
            setMessage('Permissions not granted');
          }
        });
      } else {
        console.log(`Bluetooth State: ${state}`);
      }
    }, true);

    return () => subscription.remove();
  }, [manager]);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        return granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
               granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
               granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
               granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const statuses = await requestMultiple([
          PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]);

        return statuses[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] === RESULTS.GRANTED &&
               statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED;
      }
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const scanAndConnect = () => {
    setMessage('Buscando dispositivos...');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        setMessage(`Scan error: ${error.message}`);
        return;
      }

      console.log('Dispositivo encontrado:', device.name, device.id, device.address);

      setDevices(prevDevices => {
        if (!prevDevices.find(d => d.id === device.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });

      // Filtrar dispositivos por dirección MAC
      if (device.id === HC05_MAC_ADDRESS) {
        manager.stopDeviceScan();
        connectToDevice(device);
      }
    });
  };

  const connectToDevice = (device) => {
    setMessage(`Conectado a ${device.name}...`);
    device.connect()
      .then((device) => {
        setConnectedDevice(device);
        setMessage(`Connected to ${device.name}`);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        console.log('Connected to:', device.name);
      })
      .catch((error) => {
        console.log('Connection error:', error);
        setMessage('La conexión falló');
      });
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity onPress={() => connectToDevice(item)}>
      <Text>{item.name ? item.name : 'Dispositivo sin nombre'} - {item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Button title="Buscar dispositivos" onPress={scanAndConnect} />
      {message ? <Text>{message}</Text> : null}
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={renderDevice}
      />
      {connectedDevice && (
        <Text>Connected to {connectedDevice.name}</Text>
      )}
    </View>
  );
};

export default BluetoothComponent;
