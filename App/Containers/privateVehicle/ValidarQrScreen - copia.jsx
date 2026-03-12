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
    restartTrip,
    tripEnd,
} from '../../actions/actions3g';
import styles from '../Screens/Styles/FaqScreen.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Colors from '../../Themes/Colors';
import Geolocation from 'react-native-geolocation-service';
import Cronometro from './Cronometro';
import estilos from './styles/estilos.style';
import estilosQr from './styles/qr.style';

const mapRef: any = React.createRef();

function ValidarQrScreen (props) {
    
    const [ state , setState ] = useState({
        user: props.dataRent.DataUser.DataUser.idNumber,
        idVehiculo: props.dataRent.myVehicleSelect,
        codigo: ''
    });

    const home = () => {props.navigationProp.navigate('DrawerHomeScreen');}
    const goBack = () => {props.navigation.goBack();}

    const verState = () => {
        console.log('EL STATE:::', state)
        console.log('LAS PROPS:::', props.dataRent.tripActiveOK)
    }

    const validarCodigo = async () =>{
        //props.validateVehicleSinMysql();
        /*if (state.codigo === '') {
            console.log('Por favor ingrese el codigo')  
            Alert.alert("Sin codigo para validar",":)",
                [{ text: "OK", onPress: () => {
                    console.log("OK");
                }}]
            );          
        }else if(state.codigo === '0000'){
            //sin conexion a mysql
            props.validateVehicleSinMysql();
        }else{
            const data = {
                "vus_id": state.codigo, 
                "vus_usuario": state.user
            }
            let cod = state.codigo;
            let user = state.user;
            props.validateVehicle(cod, user);
        }*/
        props.navigationProp.navigate('StartTripScreen');
    }
    
    const onSuccess = (e) => {
        Linking.openURL(e.data).catch(err =>
          console.error('An error occured', err)
        );
    };

    useEffect(() => {
        
    },[])
  
    return (

        <ImageBackground source={Images.grayBackground} style={styles.settingBackground}>
            <SafeAreaView style={estilos.safeArea}>
                <Content>
                    <View style={estilos.contenedor}>
                        <View style={estilosQr.contentTop}>
                            
                            <TouchableOpacity 
                                onPress={() => { goBack() }} 
                                style={estilosQr.btnFlechaBack}>
                                <View style={estilos.btnBack}>
                                    <Image source={Images.goBackWhite} />
                                </View>
                            </TouchableOpacity>
                            
                            <View style={estilos.contentTitle}>
                                <Text style={estilos.title}>QR</Text>
                            </View> 
                    
                        </View>

                        <View style={estilosQr.contenedor}>
                            
                            {/*** lector de QR */}
                            <View style={estilosQr.contenedorQR}>
                                
                                {<QRCodeScanner
                                    style={estilosQr.cajaQR}
                                    onRead={onSuccess}
                                    flashMode={RNCamera.Constants.FlashMode.torch}
                                    topContent={
                                    <Text style={estilosQr.centerText}>
                                        
                                    </Text>
                                    }
                                    bottomContent={
                                    <TouchableOpacity  onPress={() => { console.log('scaneando...') }} style={estilos.btnCenter}>
                                        <View style={estilosQr.buttonTouchable}>
                                            <Text style={estilos.btnSaveColor3}>Scanear</Text>
                                        </View>
                                    </TouchableOpacity>
                                    }
                                />}
                            </View>
                            
                            {/**fin lector QR */}

                            <View style={estilosQr.divInput}>
                                <TextInput
                                    style={[estilosQr.input]}
                                    type="number"
                                    value={state.codigo}
                                    placeholder= 'Código'
                                    placeholderTextColor="#000000"
                                    onChangeText={objectName => setState({ ...state, codigo: objectName })}
                                />
                            </View>

                            <TouchableOpacity  
                                onPress={() => { validarCodigo() }} 
                                style={estilosQr.buttonTouchable}>
                                    <View style={estilosQr.buttonNext}>
                                        <Text style={estilos.btnSaveColor}>Continuar</Text>
                                    </View>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                </Content>
            </SafeAreaView>
        </ImageBackground>
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
        restartTrip: () => dispatch(restartTrip()),
        tripEnd: (data) => dispatch(tripEnd(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ValidarQrScreen);


