import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import { 
    rentActive,
    getFallas,
    validateUser,
    validateHorarios,
    reserveActive,
    viewPenalizaciones,
    calcularDistancia,
    viewEstacion,
    viewVehiculo,
    saveReserva,
    changeVehiculo,
    validateRegister,
    savePenalization,
    cambiarEstadoReserva,
} from '../../actions/actions3g';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
//import URL_mysql from './url';
import estilos from './Styles/estilos.style';
import { apimysql } from '../Reservas3G/functions/funciones';
// PUSH notification
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';




function Reservar3GScreen(props){
    const [ state , setState ] = useState({
        documentoUser: '1111',
        fecha: new Date(),
        fechaVence: '',
        dia: new Date().toUTCString().substr(0,3),
        horas: new Date().getHours(),
        horaExtraida: new Date().toUTCString().substr(17,8),
        estaciones: [],
        penalizaciones: null,
        ticket: null, 
        numVehiculo: null,
        prestamoActivo: true,
        diasR: 10,
        horasR: 10,
        minutosR: 10,
        segundosR: 10,
        intervalo: '',
        reservaVencida: false,
        registroFinalizado : false,
        reservaActiva: ''
    });

    const verState = () => { 
        console.log('EL STATE ACT::::: ', state )
    }

    const verState2 = () => { 
        console.log('EL STATE ACT::::: ', props) 
    }
    
    const goBack = () => {
        props.navigation.goBack();
    }
    const home = () => {
        props.navigationProp.navigate('DrawerHomeScreen');
    }
    const irRentar = () => {
        props.navigationProp.navigate('Rentar3GScreen')
    }






    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    /*const cuentaRegresiva = () => {
        if (props.dataRent.reservaSave === true) {
            let fechaVencimiento = props.dataRent.reservas.data[0].res_fecha_fin
            console.log('la fecha de vencimiento es ::::', fechaVencimiento)
            const fechaLimite = new Date(fechaVencimiento).getTime();

            const now = new Date().getTime();
            const tiempo = Math.floor(fechaLimite - now);
            const days = Math.floor(tiempo / (24*60*60*1000));
            const hours = Math.floor((tiempo % (24*60*60*1000)) / (1000*60*60));
            const minutes = Math.floor((tiempo % (60*60*1000)) / (1000*60));
            const seconds = Math.floor((tiempo % (60*1000)) / (1000));

            if(tiempo < 0){
                console.log('Se vencio el tiempo para la reserva')
                setState({ ...state, reservaVencida: true})
                cambiarEstadoReserva('VENCIDA', props.dataRent.reservas.data[0].res_id);
                penal()
                // notificacion push inicio
                /////////////////////////
                messaging().registerForRemoteNotifications();

                // Comprobar si hay una notificación inicial disponible
                messaging().getInitialNotification()
                .then((notificationOpen) => {
                    if (notificationOpen) {
                    // La aplicación fue abierta por una notificación
                    // Obtener la acción desencadenada por la notificación que se abre
                    const action = notificationOpen.action;
                    // Obtener información sobre la notificación que se abrió
                    const notification = notificationOpen.notification;
                    }
                });

                // Obtener el token del dispositivo
                messaging().getToken()
                .then((token) => {
                    console.log('Device token:', token);
                });

                // Escuchar notificaciones
                messaging().onNotification((notification) => {
                console.log('Notification received:', notification);
                });
                // notificacion push fin
                /////////////////////////
            }else{
                console.log('corriendo cuenta regresiva')
                setState({
                    ...state,
                    diasR: days,
                    horasR: hours,
                    minutosR: minutes,
                    segundosR: seconds,
                })
            }
        }else{
            console.log('la cuenta regresiva no se ha activado');
        } 
    }*/

    const crearPenalizacion = async() => {
        const data = {
            "pen_id": "0",
            "pen_tipo_penalizacion": "1",
            "pen_novedad": "por vencimiento de reserva",
            "pen_usuario": state.documentoUser,
            "pen_fecha_creacion":  state.fecha.toUTCString().substr(0,10),
            "pen_fecha_tiempo_ok": state.dia,
            "pen_fecha_dinero_ok": "dinero",
            "pen_estado": "ACTIVA",
            "pen_fecha_apelado": "sin fecha",
            "pen_motivo_apelado": "sin motivo"
        }
        let vehiculo = props.dataRent.reservas.data[0].res_bicicleta;
        let reservaId = props.dataRent.reservas.data[0].res_id;
        props.savePenalization(data, vehiculo, reservaId);
    }

    const registroFinalizado = async (cc) => {
        props.validateRegister(cc);
    }

    const verPenalizaciones = async (cc) => {
        await props.viewPenalizaciones(cc)
    }

    const prestamoActivo = async (cc) => {
        await props.rentActive(cc); 
    }

    const guardarReserva = async() => {
        let hoy = new Date();
        let dia = state.dia;
        let fechaVence = '';
        if (dia === 'Sat') {
            fechaVence = new Date( hoy.setDate(hoy.getDate() + 2 ))
        }else{
            fechaVence = new Date( hoy.setDate(hoy.getDate() + 1 ))
        }
        const data = {
            "res_id": "0",
            "res_estacion": state.estaciones,
            "res_usuario": props.dataRent.docUsuario,
            "res_bicicleta": state.ticket,
            "res_fecha_inicio": state.fecha.toUTCString().substr(0,10),
            "res_hora_inicio": new Date().toUTCString().substr(17,8),
            "res_fecha_fin": fechaVence,
            "res_hora_fin": state.horas,
            "res_estado": "ACTIVA"
        }
        const respSaveReserva = props.saveReserva(data, fechaVence);
    }

    const vehiculoseleccionado = (id, numVehiculo) => {
        setState({ ...state, ticket: id, numVehiculo: numVehiculo })
        //diaVence(state.dia)
    }
    
    const viewBicycle = async (estacion) => {
        await props.viewVehiculo(estacion);
    }

    const traerEstaciones = async(empresa) => {
        await props.viewEstacion(empresa)
    }

    const reservasActivas = async (cc) => {
        const res = await props.reserveActive(cc);
        console.log('ENTRANDO A VERIFICAR RESERVAS ACTIVAS', res);
        //setTimeout(delayedFunction, 1000)
        //cuentaRegresiva();
    }

    const userActivo = async (cc) => {
        await props.validateUser(cc);
    }

    const penal = async () => {
        crearPenalizacion();
    }

    useEffect(() => {
        userActivo(state.documentoUser);
        reservasActivas(state.documentoUser);
        prestamoActivo(state.documentoUser);
        verPenalizaciones(state.documentoUser);
        registroFinalizado(state.documentoUser);
        traerEstaciones('movistar');
    },[])

   
    return (
        
        <ImageBackground source={Images.grayBackground} style={estilos.generales}>
            <SafeAreaView style={estilos.safeArea}>
                <Content style={estilos.contenedor}>
                    <View style={estilos.contentTop}>
                        <TouchableOpacity onPress={() => { home() }} style={{ width: 100, margin: 4}}>
                            <View style={estilos.btnBack}>
                                <Image source={Images.goBackRed} />
                            </View>
                        </TouchableOpacity>

                        <View style={estilos.contentTitle}>
                            <Text style={estilos.title}>
                            Reservar screen
                            </Text>
                            <View style={{ height: 4, width: 400, backgroundColor: '#fff', alignSelf: 'center', borderRadius: 10 }} />
                        </View> 
                    </View>
                    
                    
                    <View style={estilos.contentMsn}>
                        {(props.dataRent.reservaSave === true) ? <Text style={estilos.aceptado}>Reserva activa </Text>: <></>}
                        {(props.dataRent.usuarioValido === true) ? <></>: <Text style={estilos.denegado}>Usuario NO habilitado </Text>}
                        {(props.dataRent.penalizaciones === 0) ? <></> : <Text style={estilos.denegado}>Tiene penalizaciones </Text>}
                        {(props.dataRent.registroFinalizado === true) ? <></> : <Text style={estilos.denegado}>No ha finalizado el registro </Text>}    
                    </View>


                    { 
                    /**
                     * VALIDACIONES
                            * 1. Usuario habilitado
                            * 2. Día habilitado
                            * 3. Hora habilitada
                            * 4. Penalizaciones
                    */
                    (props.dataRent.prestamoActivo === false) && 
                    (props.dataRent.reservaSave === false) &&
                    (props.dataRent.registroFinalizado === true) &&
                    (props.dataRent.usuarioValido === true) &&
                    (props.dataRent.penalizaciones === 0) ?
                    <>
                    <View style={estilos.contenedor}>
                        <Text style={estilos.titleSelect}>Estaciones</Text>
                        {
                            (props.dataRent.estacionesCargadas === true) ?
                            <>
                                <RNPickerSelect
                                    style={pickerSelectStyles}
                                    placeholder={{ label: 'Estaciones', value: '' }}
                                    useNativeAndroidPickerStyle={false}
                                    value={state.estaciones}
                                    onValueChange={
                                        (value) => { 
                                            setState({ ...state, estaciones: value }), 
                                            viewBicycle(value)
                                        }
                                    }
                                    items={props.dataRent.estacionex.data.map((data) =>
                                        ({ label: data.est_estacion, value: data.est_estacion }))
                                    }

                                    Icon={() => {
                                        return (
                                        <Image source={Images.iconPickerGreen} style={{ top: 25, right: 25, height: 25, width: 25, resizeMode: 'contain' }} />
                                        );
                                    }}
                                />
                            </>:
                            <><Text>No se han cargado la estaciones</Text></>
                        }
                        
                    </View>
                    <TouchableOpacity  onPress={() => { verState() }}>
                            <Text>ver state</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => { verState2() }}>
                            <Text>ver state props</Text>
                    </TouchableOpacity>
                    <Text style={estilos.titleSelect}>¡Vehículos Disponibles!</Text>
                    <View style={estilos.boxPrincipalItems}>
                        {props.dataRent.bicicletasCargadas === true ? 
                        <>
                            <>
                            {
                                props.dataRent.bicicletas.data.map((data) => 
                                    <TouchableOpacity 
                                        onPress={() => { 
                                            vehiculoseleccionado(data.bic_id, data.bic_numero)
                                            
                                        }} 
                                        style={
                                            (state.numVehiculo !== data.bic_numero) ?
                                            estilos.btnVehiculos
                                            :
                                            estilos.btnVehiculosSelect
                                        }>
                                        <View style={estilos.cajaTextVehiuclos}>
                                            <Image source={Images.bicycleIcon} />
                                            <Text style={estilos.textVehiculo}>{data.bic_numero}</Text> 
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            </>
                        </>
                        :
                        <></>
                        }
                    </View>
                    {
                        state.ticket !== null ?
                        <>
                            <Text style={estilos.titleSelect}>Seleccionaste el vehículo: {state.numVehiculo}</Text>
                            <TouchableOpacity  onPress={() => { guardarReserva() /*diaVence(state.dia)*/ }} style={estilos.btnCenter}>
                                <View style={estilos.btnSave}>
                                    <Text style={estilos.btnSaveColor}>Reservar1</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        
                        :
                        <>
                        <View style={estilos.cajaImgReserva}>
                                <Image style={estilos.imgReserva} source={Images.reservaVehiculo} />
                        </View>
                        </>

                    }
                    {/*<TouchableOpacity  onPress={() => { verState() }}>
                            <Text>{state.fecha.toUTCString()}</Text>
                    </TouchableOpacity>*/}
                    </>
                    :
                    <>
                    <View style={estilos.contenedor}>
                        {
                        (props.dataRent.prestamoActivo === true) ? 
                        <View >
                            <Text style={estilos.aceptado}>Préstamo activo </Text>
                            <TouchableOpacity  
                                onPress={() => { props.navigationProp.navigate('Rentar3GScreen');}}
                                style={estilos.btnCenter}>
                                <View style={estilos.btnSave}>
                                    <Text style={estilos.btnSaveColor}>Rentar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        : 
                        <></>
                        }
                        
                        {
                            (props.dataRent.reservaSave === true) ?
                            <>  
                            {
                                
                                (props.dataRent.reservaVencida === false) ?
                                <>
                                {/*<TimeComponent />*/}
                                <Text style={estilos.titleSelect}>La reserva vence en:</Text>
                                <View style={estilos.cajaCuentaRegresiva}>  
                                    <View style={estilos.subcajaCuentaRegresiva}>
                                        <Text style={estilos.numeroCuentaRegrasiva}>
                                            {(props.dataRent.diaResta < 10) ? '0'+props.dataRent.diaResta: props.dataRent.diaResta}
                                        </Text>
                                        <Text style={estilos.subtextoCuentaR}>dias</Text>
                                    </View>
                                    <Text>:</Text>
                                    <View style={estilos.subcajaCuentaRegresiva}>
                                        <Text style={estilos.numeroCuentaRegrasiva}>
                                            {(props.dataRent.horasResta < 10) ? '0'+props.dataRent.horasResta: props.dataRent.horasResta}
                                        </Text>
                                        <Text style={estilos.subtextoCuentaR}>horas</Text>
                                    </View>
                                    <Text>:</Text>
                                    <View style={estilos.subcajaCuentaRegresiva}>
                                        <Text style={estilos.numeroCuentaRegrasiva}>
                                            {(props.dataRent.minutosResta < 10) ? '0'+props.dataRent.minutosResta: props.dataRent.minutosResta}
                                        </Text>
                                        <Text style={estilos.subtextoCuentaR}>minutos</Text>
                                    </View>
                                    <Text>:</Text>
                                    <View style={estilos.subcajaCuentaRegresiva}>
                                        <Text style={estilos.numeroCuentaRegrasiva}>
                                            {(props.dataRent.segundosResta < 10) ? '0'+props.dataRent.segundosResta: props.dataRent.segundosResta}
                                        </Text>
                                        <Text style={estilos.subtextoCuentaR}>segundos</Text>
                                    </View>
                                </View>
                                
                                    
                                <TouchableOpacity  
                                    onPress={() => { irRentar() }}
                                    style={estilos.btnCenter}>
                                    <View style={estilos.btnSave}>
                                        <Text style={estilos.btnSaveColor}>Rentar</Text>
                                    </View>
                                </TouchableOpacity>
                                </>
                                :
                                <>
                                <Text>La reserva se venció</Text>
                                <TouchableOpacity  onPress={() => { verState() }} style={estilos.btnCenter}>
                                        <Text>ver state</Text>
                                </TouchableOpacity>
                                </>
                            }
                                
                            </>
                            :
                            <></>
                        }
                    </View>
                    </>
                    //FIN VALIDACION 
                    }
                    <TouchableOpacity  onPress={() => { verState() }}>
                            <Text>ver state </Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => { verState2() }}>
                            <Text>ver state props 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => { penal() }}>
                            <Text>crear penalizacion</Text>
                    </TouchableOpacity>
                </Content>
            </SafeAreaView>
        </ImageBackground>
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
      borderColor: '#CCCCCC',
      borderWidth: 2,
      borderRadius: 25,
      marginBottom: 30,
      fontSize: 20,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      marginTop: 10,
      paddingBottom: 10,
      color: '#878787',
      backgroundColor: "#CCCCCC",
      height: 50,
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
        navigationProp: state.globalReducer.nav._navigation,
        dataRent: state.reducer3G,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        supportRequest: (requestSupport) => dispatch(supportRequest(requestSupport)),
        validateUser: (cc) => dispatch(validateUser(cc)),
        reserveActive: (cc) => dispatch(reserveActive(cc)),
        viewEstacion: (empresa) => dispatch(viewEstacion(empresa)),
        viewVehiculo: (estacion) => dispatch(viewVehiculo(estacion)),
        saveReserva: (reserva, fecha) => dispatch(saveReserva(reserva, fecha)),
        changeVehiculo: (data) => dispatch(changeVehiculo(data)),
        rentActive: (cc) => dispatch(rentActive(cc)),
        viewPenalizaciones: (cc) => dispatch(viewPenalizaciones(cc)),
        validateRegister: (cc) => dispatch(validateRegister(cc)),
        savePenalization: (data, vehiculo, reservaId) => dispatch(savePenalization(data, vehiculo, reservaId)),
        cambiarEstadoReserva: (data, vehiculo) => dispatch(cambiarEstadoReserva(data, vehiculo)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Reservar3GScreen);