import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { useDispatch } from 'react-redux';
import { validate_qr } from '../../actions/actionParqueadero';
import Colors from '../../Themes/Colors';

export default function ScannerQR() {
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const bleActivo = true; // O pasar por props/context

  // Solicitar permisos de cámara
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'Necesitas habilitar el acceso a la cámara para escanear códigos QR',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No puedes escanear sin habilitar la cámara.');
        }
      }
    };

    requestPermission();
  }, []);

  const handleReadCode = (event) => {
    const qrValue = event?.nativeEvent?.codeStringValue;
    if (!qrValue) return;

    console.log('Código QR leído:', qrValue);
    setIsScanning(false); // evitar dobles lecturas

    if (bleActivo) {
      dispatch(validate_qr(qrValue));
    } else {
      Alert.alert('Bluetooth apagado', 'Activa el Bluetooth para abrir el candado.');
    }

    // Reiniciar escaneo tras 3 segundos
    setTimeout(() => {
      setIsScanning(true);
    }, 3000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.$parqueo_color_fondo }}>
      {isScanning ? (
        <View style={{ flex: 1 }}>
          <Camera
            ref={cameraRef}
            style={{ flex: 1 }}
            cameraType={CameraType.Back}
            flashMode="auto"
            scanBarcode={true}
            onReadCode={handleReadCode}
            showFrame={true}
            laserColor="red"
            frameColor="white"
          />
          {/* Marco verde de ayuda visual */}
          <View style={{
            position: 'absolute',
            top: '25%',
            left: '10%',
            width: '80%',
            height: 300,
            borderWidth: 2,
            borderColor: 'green',
            borderRadius: 10
          }} />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: Colors.$parqueo_color_texto_50 }}>
            Esperando para reactivar escaneo...
          </Text>
        </View>
      )}
    </View>
  );
}
