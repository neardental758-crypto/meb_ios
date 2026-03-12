import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
const DEVICE_ID = '00:22:05:00:27:64'; // Dirección MAC de tu HC-05
const password = '1234'; // Reemplaza "1234" con tu contraseña actual

const Bluetooth = () => {
    const [connectedDevice, setConnectedDevice] = useState(DEVICE_ID);
    const [d, setD] = useState(null);

    async function conectar() {
        try {
            RNBluetoothClassic.connectToDevice(DEVICE_ID).then(device => {
                console.log('Conexión exitosa!');
                setConnectedDevice(device.id);
                console.log('connectedDEvice:  ', connectedDevice);
                console.log('id:  ', device.addres);
                console.log('addres:  ', device.id);
            }).catch(error => {
                console.error('Error en connectToDevice', error);
            });
        } catch (error) {
            // Handle error accordingly
            console.log('Error al conectar: ', error);
        }
    }

    async function sendMessage(message) {
        try {
            await RNBluetoothClassic.writeToDevice(connectedDevice, message).then(() => {
                console.log(`Mensaje ${message} enviado correctamente`);
            }).catch(error => {
                console.log('Error al enviar el mensaje:', error);
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    // Función para encender el LED
    async function turnOnLed() {
        try {
        await sendMessage('1'); // Envía el mensaje '0' al Arduino Due
            } catch (error) {
        console.log('turn on led', error);
            }
    }
        
    // Función para apagar el LED
    async function turnOffLed() {
        try {
        await sendMessage('0'); // Envía el mensaje '0' al Arduino Due
            } catch (error) {
        console.log('turn off led', error);
            }
    }

    async function habilitarDis() {
        RNBluetoothClassic.requestBluetoothEnabled()
            .then(enabled => {
        if (enabled) {
        // Bluetooth está habilitado en el dispositivo
        console.log('fierro');
                } else {
        // Bluetooth no está habilitado en el dispositivo
        console.log('fierro else');
                }
            })
            .catch(error => {
        console.log(error);
        });
    }

return (
    <View style={styles.container}>
        <Text>Comunicación Bluetooth HC-05</Text>
        <Button
        title="Request Enabled"
        onPress={() => {
        habilitarDis();
                }}
        disabled={false}
        />
    <Button
    title="Connect"
    onPress={() => {
    conectar();
            }}
    disabled={false}
    />
    <Button
    title="ENVIAR"
    onPress={() => {
    turnOnLed();
            }}
    disabled={false}
    />
    
    </View>
);
}

const styles = StyleSheet.create({
container: {
width: '100%',
height: '100%',
backgroundColor: 'white',
  },
});

export default Bluetooth;
