import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    TextInput,
    Modal, 
    Button,
    ScrollView,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import { 
    end_trip_carpooling, 
    guardar_comentario,
    patch_estado_pago,
    get_pagos_trip,
    reset_patch_pago_ok
} from '../../actions/actionCarpooling';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import Colors from '../../Themes/Colors';
import { Estrellas } from '../../Components/carpooling/Estrellas'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import RootContainer from '../../RootContainer';
import { inMemoryPersistence } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import LottieView from 'lottie-react-native';


function CarpoolingEndRide(props){

    const { infoUser, endTtripVP } = useContext( AuthContext );
    const dispatch = useDispatch();
    
    const [ loadedTrips, setLoadedTrips ] = useState(false);
    
    const pagar = async () => {
        RootNavigation.navigate('CarpoolingTripInProcessPasajero');
    }
    const finalizarViaje = async () => {
        try {
            // Eliminar el viaje del AsyncStorage
            await AsyncStorage.removeItem('viajePasajero');
        } catch (error) {
            console.error('Error al finalizar viaje:', error);
        }
    };

    const finalizar = async () => {
        await setLoadedTrips(true);
        setTimeout(function(){
            setLoadedTrips(false);
            finalizarViaje();
            RootNavigation.navigate('CarpoolingDriverTrips');
        }, 1000);   
    }

if(loadedTrips){
    return (
        <Modal transparent={true}>
        <View style={{ backgroundColor: Colors.$primer, flexDirection: "column", flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <LottieView
                source={require('../../Resources/Lotties/loading_carpooling.json')} autoPlay loop
                style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: Colors.$blanco
                }}
            />
            </View>
        </View>
        </Modal>
    )
}else{
    return (
    <ImageBackground source={Images.fondoMapa} style={{        
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height
    }}>

    <View style={{
        flex: 1,
        width: "100%", 
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    }}>        
        <View style={{
            height: "50%",
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.$blanco,
            borderRadius: 20,
            padding: 10
        }}>
            <View style={estilos.contenedor}>
                <Image source={Images.iconoalerta} style={{width: 50, height: 50}}/>
                <Text style={estilos.title}>¡Estás a punto de finalizar el viaje!</Text>                            
            </View>

            {/*<Text style={{
                fontSize: 16, 
                marginBottom: 20, 
                marginTop: 20,
                width: '70%',
                textAlign: 'center'
            }}>Por favor, realiza el pago para poder realizar otro viaje.</Text>*/}

            <View style={estilos.contenerod2}>                     
                <Pressable  
                    onPress={() => { finalizar() }} 
                    style={estilos.btnCenter}>
                    <Text style={estilos.btnSaveColor}>Finalizar</Text>                                            
                </Pressable>  

                {/*<Pressable  
                    onPress={() => { pagar() }} 
                    style={estilos.btnCenter}>
                    <Text style={estilos.btnSaveColor}>Pagar</Text>                                            
                </Pressable>*/}                        
            </View>
        </View>
    </View>
    </ImageBackground>
    );
}
    
}

const estilos = StyleSheet.create({
    contenedor:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
        marginTop: 20
    },
    title:{
        fontFamily: Fonts.$sizeSubtitle, 
        fontSize: 25, 
        textAlign: 'center', 
        color: Colors.$texto, 
        marginBottom: 5,
        width: 250,
        
    },
    contenerod2: {
        width: "100%", 
        alignItems: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    cajaInput: {
        width: "100%",
        alignItems: 'center',
    },
    inputBeneficios: {
        width: '80%',
        height: 40,
        justifyContent: "flex-start",
        fontSize: 18,
        paddingVertical: 8,
        backgroundColor: Colors.$secundario,
        paddingLeft: 15,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 20,
        marginTop: 15,
        color: Colors.$texto,
        marginBottom: 20,
    },
    btnCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$primario,
        width: 150,
        height: 40,
        padding: 2,
        borderRadius: 25
    },
    btnSaveColor: {
        color: Colors.$blanco,
        fontSize: 16,
    },
    cajaComentario: {
        width: Dimensions.get('window').width*.8,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius : 10,
    },
    textSolicitud: {
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 26,
        color: Colors.$texto,
        
    },
})

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        dataCarpooling: state.reducerCarpooling
    }
}

export default connect(mapStateToProps)(CarpoolingEndRide);