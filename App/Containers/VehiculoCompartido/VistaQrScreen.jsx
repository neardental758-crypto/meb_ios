import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Content } from 'native-base';
//Layout
import Images from '../../Themes/Images';
//Components
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
  validateVehicle,
  startTrip,
  validateVehicleSinMysql,
} from '../../actions/actions3g';
import styles from '../Screens/Styles/FaqScreen.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Colors from '../../Themes/Colors';
import Geolocation from 'react-native-geolocation-service';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import estilos from './Styles/estilos.style';
import estilosStartTrip from './Styles/qr.style';


function StartTripScreen (props) {
  const [ state , setState ] = useState({
    codigo : '',
  });

  const home = () => {
      props.navigationProp.navigate('DrawerHomeScreen');
  }

  const goBack = () => {
      props.navigation.goBack();
  }
  //HOOK componentDidMount se ejecuta despues del primer renderizado
 
  const next = () => {
    props.navigationProp.navigate('VistaTripScreen')
  }   

  const onSuccess = (e) => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );
};


  useEffect(() => {
    console.log('ingresando codigo', state.codigo)
    if (state.codigo !== '' && state.codigo === '0000') {
      props.navigationProp.navigate('VistaTripScreen')
    }
  },[state.codigo])

  

  /**
   *Switch para encender Linterna

   switchTorchState() {
      setState({ ...state,  torchState: !state.torchState });
      console.log("scanner",scanner);
      console.log("enabled",enabled);
      console.log("state.enabled",state.enabled);
      scanner.reactivate();
  }
   */
 
  return (
    <SafeAreaView style={estilos.safeArea}>
      <Content>
        
            <View style={estilosStartTrip.contentTop}>
                    
              <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 10, backgroundColor : Colors.$primario}}>
                  <View >
                      <Image style={{marginLeft: moderateScale(10), width : horizontalScale(350), height : verticalScale(55)}} source={Images.flechaAtras} />
                  </View>
              </TouchableOpacity>
                    
            </View>  

            <View style={estilosStartTrip.contenedor}>

                <Text style={estilosStartTrip.titulo}>Ubica el código QR que deseas escanear en el recuadro </Text>
                      
                {/*** lector de QR */}
                <View style={estilosStartTrip.contenedorQR}>
                    
                    <QRCodeScanner
                        style={estilosStartTrip.cajaQR}
                        onRead={onSuccess}
                        flashMode={RNCamera.Constants.FlashMode.torch}
                        topContent={
                        <Text style={estilosStartTrip.centerText}>
                            
                        </Text>
                        }
                        
                      />
                </View>
                
                {/**fin lector QR */}
                <View style={estilosStartTrip.divInput}>
                    <TextInput
                        style={[estilosStartTrip.input]}
                        type="number"
                        value={state.codigo}
                        placeholder= 'Ingresa el QR'
                        placeholderTextColor="#878787"
                        onChangeText={objectName => setState({ ...state, codigo: objectName })}
                    />
                </View>
                
            </View>

        
      </Content>
    </SafeAreaView>
      
  );
}

function mapStateToProps(state) {
  return {
      dataUser: state.userReducer,
      navigationProp: state.globalReducer.nav._navigation,
      dataRent: state.reducer3G,
  }
}

function mapDispatchToProps(dispatch) {
  return {
      validateVehicle: (cod, user) => dispatch(validateVehicle(cod, user)),
      startTrip: (data) => dispatch(startTrip(data)),
      validateVehicleSinMysql: () =>dispatch(validateVehicleSinMysql()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StartTripScreen);


