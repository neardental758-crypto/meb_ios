import React, { useEffect } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import { 
  reset_tyc,
  save_token_msn
} from '../../actions/actionCarpooling'
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from '../../RootNavigation';
const HOST = 'fcm.googleapis.com';

function CarpoolingPush(props) {

    const sendPushNotification = async () => {
        try {
          // Obtener el token del dispositivo actual
          const token = 'dy_ViGt-T32qVO1lPSh8nb:APA91bFZFTqx0AFll7mg6IYm0Os1NYvAUSWfdVCzujOhcj_ZPcpJlOl1XJtmRLXExPg_nB_eC-AFe1KZyP938dQnejAPqY0JPAHT94ejzmnwExCRPX_AdT3OLYJdS3bYv3YPL92uvjnl';
      
          // Crear el cuerpo de la notificación
          const notification = {
            to: token,
            notification: {
                title: 'Push Ride',
                body: 'Enviando notificación push desde la APP',
            },
          };
      
          // Enviar la notificación a través de la API de FCM
          const SERVER_KEY = 'AAAANzxerqM:APA91bFWk7MwfrayHIaj-qY3KCViHja29cuzfMtkWQVWUv1P1d4T2c-7-GOWS0SqyJ_dHxvhJOjHltdaE3DlPBYmfwcd4pFMGX0mXXrCLvACq9E8NP77CJKUGl4MY-3ebHJeZJS2cp82';
          const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            hostname: HOST,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + SERVER_KEY,
            },
            body: JSON.stringify(notification),
          });
      
          console.log('Notificación enviada correctamente:', response);
        } catch (error) {
          console.error('Error al enviar la notificación:', error);
        }
    }; 
    
    return (
        <View style={styles.contenedor}>
            <Text>Probando el envío de push dessde la app</Text>
            <Pressable 
            onPress={() => { sendPushNotification() }} 
            style={styles.buttonTouchableGray}>
            <Text style={styles.textButton}>Enviar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: Colors.$primario,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },

});

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
  }
}

export default connect(mapStateToProps)(CarpoolingPush);
