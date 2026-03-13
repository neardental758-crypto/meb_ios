import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
//import RNBluetoothClassic from 'react-native-bluetooth-classic';
const DEVICE_ID = '00:22:05:00:27:64'; // Dirección MAC de tu HC-05
const password = '1234'; // Reemplaza "1234" con tu contraseña actual

const Bluetooth = () => {


    return (
        <View style={styles.container}>
            <Text>Comunicación Bluetooth HC-05</Text>


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
