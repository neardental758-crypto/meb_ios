import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, PermissionsAndroid, Pressable, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export const manager = new BleManager();

const requestPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: "Request for Location Permission",
      message: "Bluetooth Scanner requires access to Fine Location Permission",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    }
  );
  return (granted === PermissionsAndroid.RESULTS.GRANTED);
}

// BlueetoothScanner does:
// - access/enable bluetooth module
// - scan bluetooth devices in the area
// - list the scanned devices
const BluetoothScanner = () => {
  const [logData, setLogData] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [scannedDevices, setScannedDevices] = useState({});
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    manager.onStateChange((state) => {
      const subscription = manager.onStateChange(async (state) => {
        console.log(state);
        const newLogData = logData;
        newLogData.push(state);
        await setLogCount(newLogData.length);
        await setLogData(newLogData);
        subscription.remove();
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);

  /*const reset_lock = (id) => {
    manager.startDeviceScan(null, null, async (error, device) => {
        // error handling
        if (error) {
          console.log(error);
          return
        }
        // found a bluetooth device
        if (device.id === id) {
          console.log('reset este candado', id);
          Alert.alert('reset este candado', id);
          const resetCommand = [0x01, 0x02, 0x03]; // Ejemplo de comando de reset
          device.writeCharacteristicWithoutResponse(serviceUUID, characteristicUUID, Buffer.from(resetCommand));
          BleManager.disconnectDevice(device);   
        }
    });
    setTimeout(() => {
        manager.stopDeviceScan();
    }, 5000);
  }*/

  const reset_lock = async (id) => {
    let isDeviceFound = false;


    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (device.id === id) {
        isDeviceFound = true;
        console.log('Resetting lock', id);
        Alert.alert('Resetting lock', id);
        
        // Genera el timestamp actual o el requerido para el desbloqueo
        const timestamp = Math.floor(Date.now() / 1000); // Ejemplo: timestamp en segundos
        const command = new Uint8Array([0x01, 0x02, 0x03, ...new Uint8Array(new Uint32Array([timestamp]).buffer)]); // Asume que el candado espera un comando seguido por un timestamp
        
        try {
          // Asegúrate de estar conectado al dispositivo antes de intentar escribir en la característica
          await manager.connectToDevice(id);
          await manager.discoverAllServicesAndCharacteristicsForDevice(id);
          await device.writeCharacteristicWithoutResponse(serviceUUID, characteristicUUID, command);
          console.log('Command sent successfully');

          const services = await device.discoverAllServicesAndCharacteristics();
          const unlockCommand = [0x01, 0x02, 0x03]; // Ejemplo: comando para abrir el candado
          const characteristic = services.find(service => service.uuid === serviceUUID)
          .characteristics.find(characteristic => characteristic.uuid === characteristicUUID);
          // Envía el comando para abrir el candado a la característica
          await characteristic.writeWithoutResponse(Buffer.from(unlockCommand));

        } catch (err) {
          console.error('Failed to send command', err);
        } finally {
          await manager.cancelDeviceConnection(id);
          manager.stopDeviceScan();
        }
      }else {
        Alert.alert('otro dispositivo', id);
      }
    });
  
    setTimeout(() => {
      if (!isDeviceFound) {
        console.log('Device not found, stopping scan');
        manager.stopDeviceScan();
      }
    }, 10000); // Detiene el escaneo después de 10 segundos si no se encuentra el dispositivo
  };

  return (
    <View style={{flex:1, padding:10}}>
      <View style={{flex:1, padding:10}}>
        <Text style={{fontWeight: "bold"}}>Bluetooth Log ({logCount})</Text>
        <FlatList
          data={logData}
          renderItem={({item}) => {
            return (<Text>{item}</Text>)
          }}
        />
        <Button
          title="Activar Bluetooth"
          style={{backgroundColor: '#f60'}}
          onPress={async () => {
            const btState = await manager.state()
            // test is bluetooth is supported
            if (btState==="Unsupported") {
              alert("Bluetooth is not supported");
              return (false);
            }
            // enable if it is not powered on
            if (btState!=="PoweredOn") {
              await manager.enable();
            } else {
              await manager.disable();
            }
            return (true);
          }}
        />
      </View>

      <View style={{flex:2, padding:10}}>
        <Text style={{fontWeight: "bold"}}>Dispositivos escaneados ({deviceCount})</Text>
        <FlatList
            
          data={Object.values(scannedDevices)}
          renderItem={({item}) => {
            return (
            <Pressable 
                onPress={()  => reset_lock(item.id)}
                style={{ 
                  backgroundColor: '#f60',
                  marginTop: 5,
                  padding: 5 
                }}
            >
                <Text>{`${item.name} (${item.id})`}</Text>
            </Pressable> 
            )
          }}
        />
        <Button
          title="escanear dispositivos"
          onPress={async () => {
            const btState = await manager.state()
            // test if bluetooth is powered on
            if (btState!=="PoweredOn") {
              alert("Bluetooth is not powered on");
              return (false);
            }
            // explicitly ask for user's permission
            const permission = await requestPermission();
            if (permission) {
              manager.startDeviceScan(null, null, async (error, device) => {
                  // error handling
                  if (error) {
                    console.log(error);
                    return
                  }
                  // found a bluetooth device
                  if (device) {
                    console.log(`${device.name} (${device.id})}`);
                    const newScannedDevices = scannedDevices;
                    newScannedDevices[device.id] = device;
                       
                    await setDeviceCount(Object.keys(newScannedDevices).length);
                    await setScannedDevices(scannedDevices);
                  }
              });
            }
            return (true);
          }}
        />
      </View>
    </View>
  );
};

export default BluetoothScanner;