import { AppRegistry, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import React from 'react';
import { Provider } from 'react-redux';
import configure from './App/Services/configure';
import * as RootNavigation from './App/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para obtener el token
const initializeFirebaseMessaging = async () => {
  try {
    // Registrar el dispositivo para mensajes remotos
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
      console.log('Dispositivo registrado para mensajes remotos');
    }

    // Obtener el token
    const token = await messaging().getToken();
    console.log('Token FCM:', token);

    // Guardar el token
    const tokenJson = { "token": token };
    await AsyncStorage.setItem('tokenMSN', JSON.stringify(tokenJson));

    return token;
  } catch (error) {
    console.log('Error al inicializar Firebase Messaging:', error);
  }
};

// Inicializar Firebase Messaging
initializeFirebaseMessaging();

// Handler para mensajes en segundo plano
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Handler para mensajes en primer plano
messaging().onMessage(async remoteMessage => {
  console.log('🔔 [index.js] Nueva notificación en FOREGROUND recibida:');
  console.log(JSON.stringify(remoteMessage, null, 2));

  const messageType = remoteMessage.data?.messageType;
  console.log('📂 [index.js] MessageType detectado:', messageType);

  if (messageType === 'push-in-app' || messageType === 'email-push' || messageType === 'all') {
    console.log('👉 [index.js] Flujo: showPushNotification + showInAppNotification');
    showPushNotification(remoteMessage);
    if (messageType === 'push-in-app' || messageType === 'all') {
      showInAppNotification(remoteMessage);
    }
  } else if (messageType === 'in-app' || messageType === 'email-in-app') {
    console.log('👉 [index.js] Flujo: Solo showInAppNotification');
    showInAppNotification(remoteMessage);
  } else {
    console.log('👉 [index.js] Flujo: Default showPushNotification');
    showPushNotification(remoteMessage);
  }
});

// Handler cuando la app se abre desde una notificación
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('App abierta desde notificación:', remoteMessage);
});

// Handler para cuando la app se abre desde estado cerrado
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('App abierta desde notificación (cerrada):', remoteMessage);
    }
  });

const showInAppNotification = (remoteMessage) => {
  console.log('📢 [index.js] Mostrando alerta IN-APP (Alert.alert)');
  Alert.alert(
    `[IN-APP] ${remoteMessage.notification?.title || 'Notificación'}`,
    remoteMessage.notification?.body || 'Mensaje',
    [
      { text: 'OK', style: 'default' }
    ]
  );
};

const showPushNotification = (remoteMessage) => {
  console.log('📢 [index.js] Mostrando alerta PUSH (Alert.alert)');
  Alert.alert(
    remoteMessage.notification?.title || 'Notificación',
    remoteMessage.notification?.body || 'Mensaje',
    [
      { text: 'OK', style: 'default' }
    ]
  );
};

const RNRedux = () => (
  <Provider store={configure}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);