import React from 'react';
import { View, Button } from 'react-native';
import { NativeModules } from 'react-native';

const { LocationServiceModule } = NativeModules;

export function LocationTrackingComponent(props) {
  const startLocationService = () => {
    if (Platform.OS === 'android') {
      LocationServiceModule.startService(false);
    }
  };

  const stopLocationService = () => {
    if (Platform.OS === 'android') {
      LocationServiceModule.stopService();
    }
  };

  return (
    <View>
      <Button title="Iniciar Rastreo" onPress={startLocationService} />
      <Button title="Detener Rastreo" onPress={stopLocationService} />
    </View>
  );
};

