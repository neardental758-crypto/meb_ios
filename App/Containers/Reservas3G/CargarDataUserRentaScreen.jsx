import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import { saveDataUser, saveDataCrono } from '../../actions/actions3g';
//import { Content } from 'native-base';
import Images from '../../Themes/Images';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import estilos from './styles/reservas.style';
// PUSH notification
import Colors from '../../Themes/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

import { TimeComponent } from './missingtTimeScreen';
import * as RootNavigation from '../../RootNavigation';

function CargarDataUserRentaScreen(props){
    const [ state , setState ] = useState({
        dataCargada: false,
    });

    const [ crono , setCrono ] = useState({
        dataCronoCargada: false,
        CronometroStorageVP: {
            segundos: 0,
            minutos: 0,
            horas : 0,
            latAct: 0,
            lngActual: 0
        }
    });

    const goBack = () => {
        props.navigation.goBack();
    }

    const verState = () => { 
        console.log('EL STATE ACT::::: ', state)
    }

    const verProps = () => { 
        console.log('LAS PROPS::::: ', props.dataRent)
    }

    const irRenta = () => { 
        RootNavigation.navigate('Rentar3GScreen')
    }
    
    const cargarDataUsuario = () => { 
        AsyncStorage.getItem('user').then((res) => {
            if (res !== null) {
                console.log( 'objeto userRegistro',{res: JSON.parse(res) } );
                setState({ 
                    ...state,
                    dataCargada: true,  
                    DataUser: JSON.parse(res) 
                });
            }
        })
    }
    
    useEffect(() => {
        cargarDataUsuario()
    },[])

    useEffect(() => {
        console.log('el estado de la carga de data es true')
        props.saveDataUser(state)
    }, [state.dataCargada === true]); // Solo se vuelve a suscribir si la propiedad state.dataCargada cambia a true

    useEffect(() => {
        console.log('cargando la data del cronometro')
        props.saveDataCrono(crono)
    }, [crono.dataCronoCargada === true]);
    /*useEffect(() => {
        console.log('USER DATA::::::', props.dataRent.DataUser)
        props.navigationProp.navigate('Reservar3GScreen')
    }, [props.dataRent.DataUser.dataCargada === true]); // Solo se vuelve a suscribir si la propiedad state.dataCargada cambia a true
    */

    return (
    <SafeAreaView style={estilos.safeArea}>
        <ScrollView style={estilos.contenedor}>
            
            { (state.dataCargada) ? 
                <View style={estilos.contentTop2}>
                <View style={estilos.titleSelect2}>
                    <Text style={estilos.titleSelect2}>HOLA {state.DataUser.name.toUpperCase()} {state.DataUser.firstLastname.toUpperCase()}</Text> 
                    <Text style={estilos.titleSelect2}></Text>   
                </View>

                <View style={estilos.cajaImgVP}>
                    <Image source={Images.fondoRenta} style={estilos.imgVP}/>
                </View>
                
                <View style={estilos.titleSelect2}>
                    
                    <Text style={estilos.titleSelect3}>Necesitas estar a menos de 150 metros de distancia de la estación para realizar la renta</Text> 
                    <TouchableOpacity  
                        onPress={() => { irRenta(), console.log(state.DataUser) }}
                        style={estilos.btnCenter}>
                        <View style={estilos.btnSaveOK2}>
                            <Text style={estilos.btnSaveColor}>Siguiente</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  
                        onPress={() => { goBack()}}
                        style={estilos.btnCenter}>
                        <View style={estilos.btnSaveOK3}>
                            <Text style={estilos.btnSaveColor2}>Volver</Text>
                        </View>
                    </TouchableOpacity>   
                </View>
                
            </View>
                :
                <Text>Cargando Datos del usuario.....</Text>
            }
        </ScrollView>
    </SafeAreaView>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 13,
      paddingVertical: 8,
      borderBottomWidth: 1,
      backgroundColor: "transparent",
      paddingLeft: 15,
      marginLeft: 20,
      marginRight: 20,
      borderColor: '#8ac43f',
      borderWidth: 2,
      borderRadius: 25,
      marginTop: 15,
      color: '#878787',
      height: 40,
      marginBottom: 30,
    },
    inputAndroid: {
      marginLeft: 20,
      marginRight: 20,
      borderWidth: 2,
      borderRadius: 25,
      marginBottom: 30,
      fontSize: 20,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      marginTop: 10,
      paddingBottom: 10,
      color: Colors.$blanco,
      backgroundColor: Colors.$texto,
      borderColor: Colors.$blanco,
      width: 300,
      height: 50,
      paddingLeft: 20
    },
    placeholder: {
        color: Colors.$blanco,
    },
    registerTitleContainer:{
      color: '#f60',
    },
    accountTitle:{
      marginBottom: 1,
    },
});

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        //navigationProp: state.globalReducer.nav._navigation,
        dataRent: state.reducer3G,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveDataUser: (data) => dispatch(saveDataUser(data)),
        saveDataCrono: (data) => dispatch(saveDataCrono(data)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CargarDataUserRentaScreen);