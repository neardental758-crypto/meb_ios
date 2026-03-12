import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    Modal,
    Dimensions,
} from 'react-native';
import { 
    rentActive,
    getFallas,
    validateUser3g,
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
    decrementarSeg,
    saveStateBicicletero,
} from '../../actions/actions3g';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from  '@nejlyg/react-native-picker-select';
import estilos from './styles/reservas4g';
import Colors from '../../Themes/Colors';
import { moderateScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { GuiaEstados } from '../../Components/movilidad4g/GuiaEstados';
import LottieView from 'lottie-react-native';

function Reservar4G(props){
    const [ state , setState ] = useState({
        dataCargada: false,
        fecha: new Date(),
        dia: new Date().toUTCString().substr(0,3),
        horas: new Date().getHours(),
        horaExtraida: new Date().toUTCString().substr(17,8),
        estaciones: '',
        ticket: null, 
        numVehiculo: null,
    });
    const { infoUser } = useContext( AuthContext )
    const dispatch = useDispatch();
    const [estacionData , setEstacionData] = useState('');
    const [bicicletaData , setBicicletaData] = useState('');
    const [resInicio , setResInicio] = useState('');
    const [reservando, setReservando] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalReservaExitosa, setModalReservaExitosa] = useState(false);
    const [minutosReserva, setMinutosReserva] = useState('');

    const goBack = () => { RootNavigation.navigate('Home3G') }

    const openBackgroundInfoModal = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
                height: 20,
            }}>
                <Modal transparent={true} animationType="slide">
                    <View style={{ backgroundColor: Colors.$texto80, flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 1, borderRadius: 20, marginVertical: 200, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 10 }}>
                            
                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto,
                                fontFamily: Fonts.$poppinsmedium,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >¡Reserva Exitosa!</Text>   

                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 250,
                                minHeight: 250,
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_01.json')} autoPlay loop 
                                style={{
                                  width: 250,
                                  height: 250              
                                }}/>
                            </View>                      

                            <Pressable  
                                onPress={() => { 
                                    guardar_reserva()
                                }}
                                style={estilos.btnCenter}>
                                <View style={[estilos.btnSaveOK, {
                                    backgroundColor: Colors.$primario,
                                    width: 300
                                }]}>
                                    <Text style={[estilos.textBtnNext, {
                                        color: Colors.$blanco, fontSize: 18, fontFamily: Fonts.$poppinsregular
                                    }]}>OK</Text>
                                </View>
                            </Pressable>                             
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    const openModalError = () => {
        return (
            <Modal transparent={true} animationType="slide">
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: 'rgba(0, 0, 0, 0.5)' // si usas transparent={true}
                }}>
                    <View style={{
                        borderRadius: 20,
                        width: '80%',
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 25,
                        backgroundColor: Colors.$blanco
                    }}>
                        <Text style={{
                            textAlign: "center",
                            color: Colors.$texto80,
                            fontFamily: Fonts.$poppinsregular,
                            fontSize: 22,
                            margin: 10,
                        }}>
                            Vehículo no disponible
                        </Text>

                        <LottieView source={require('../../Resources/Lotties/bicy_error.json')} autoPlay loop
                            style={{ width: 150, height: 150 }} />

                        <Pressable
                            onPress={() => setModalError(false)}
                            style={{
                                backgroundColor: Colors.$primario,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                marginTop: 20
                            }}>
                            <Text style={{
                                color: Colors.$blanco,
                                fontSize: 18,
                                fontFamily: Fonts.$poppinsregular
                            }}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        );
    };

    const guardar_reserva = async () => {
        console.log('Guardando la reserva');

        const ahora = new Date();
        ahora.setHours(ahora.getHours() - 5);
        const hora = ahora.getHours();

        // Validar si está fuera del horario permitido (entre 7 PM y 6 AM)
        /*if (hora >= 19 || hora < 6) {
            Alert.alert(
                "Horario no permitido",
                "Las reservas solo se pueden realizar entre las 6:00 a.m. y 7:00 p.m."
            );
            return;
        }*/

        // Obtenemos duración de la reserva en minutos desde la DB
        const duracionMinutos = minutosReserva || 60;

        const horaFin = new Date(ahora.getTime() + duracionMinutos * 60000); // sumamos minutos

        const data = {
            res_id: "0",
            res_estacion: state.estaciones.est_estacion,
            res_usuario: props.dataRent.docUsuario,
            res_bicicleta: state.ticket,
            res_fecha_inicio: ahora.toISOString().substring(0, 10), // YYYY-MM-DD
            res_hora_inicio: ahora.toTimeString().substring(0, 8),  // HH:MM:SS
            res_fecha_fin: horaFin.toISOString().substring(0, 10),
            res_hora_fin: horaFin.toTimeString().substring(0, 8),
            res_estado: "ACTIVA"
        };

        console.log('data save reserva', data);

        await dispatch(saveReserva(data, horaFin.toISOString().substring(0, 10), duracionMinutos, state.ticket));
        await resetState();
        await setModalReservaExitosa(false);

    };



    const resetState = async () => {
        await setState({ 
            ...state,
            dataCargada: false,
            ticket: null, 
            numVehiculo: null,
        })
        await setEstacionData('');
        await setBicicletaData('');
        await setResInicio('');
        await setReservando(false);
        await setModalError(false);
    }

    const vehiculoseleccionado = async(data) => {
        console.log('data', data);
        console.log('data bicicletero', data.bc_bicicletero.bro_id);
        console.log('la estacion para bicicletero', state.estaciones)
        console.log('Los minutos para la reserva', minutosReserva);

        if (data.bic_estado === 'DISPONIBLE') {
            setState({ ...state, ticket: data.bic_id, numVehiculo: data.bic_numero })
            dispatch(saveStateBicicletero(data.bc_bicicletero.bro_id));
        }else {
            setModalError(true);
        }
    }
    
    const viewBicycle = async (data) => {
        console.log('la estacion seleccionada es:', data)
        console.log('El horario de la estacion seleccionada es:', data.est_horario);
        setMinutosReserva(data.est_horario);
        if(data !== ''){
            await dispatch(viewVehiculo(data.est_estacion));
        }
    }

    const traerEstaciones = async(empresa) => {
        console.log('entrnado a lassssss estaciones ', empresa)
        await dispatch(viewEstacion(empresa));
    }

    const reservasActivas = async (cc) => {
        const res = await dispatch(reserveActive(cc));
    }

    const getVehicleStyle = (estado) => {
        switch (estado) {
          case 'DISPONIBLE':
            return styles.cajaTextVehiuclosDisponible;
          case 'RESERVADA':
            return styles.cajaTextVehiuclosReservada;
          case 'PRESTADA':
            return styles.cajaTextVehiuclosPrestada;
          case 'INACTIVA':
            return styles.cajaTextVehiuclosInactiva;
          case 'EN TALLER':
            return styles.cajaTextVehiuclosTaller;
          case 'CAMBIAR CLAVE':
            return styles.cajaTextVehiuclosPrestada;
          default:
            return styles.cajaTextVehiuclosSinEstado;
        }
    };

    useEffect(()=>{
        if(typeof props.dataRent.reservas.data != 'undefined'){
            setEstacionData(props.dataRent.reservas.data[0].res_estacion);
            setBicicletaData(props.dataRent.reservas.data[0].res_bicicleta);
            setResInicio(props.dataRent.reservas.data[0].res_fecha_inicio);
        }
    },[props.dataRent.reservas.data])

    useEffect(() => {
        if (props.perfil.empresa !== null) {
            console.log('la empresa es hhdhhdhdhdhdhdhhdhd ', props.perfil.empresa)
            traerEstaciones(props.perfil.empresa);  
        }              
    },[props.perfil.empresa])

    useEffect(() => {
        if (props.dataRent.reservaSave) {
            RootNavigation.navigate('Home4G')
        }
    },[props.dataRent.reservaSave])

    useEffect(()=>{
        if (!props.dataRent.estacionesCargadas) {
            if (props.perfil.empresa !== null) {
                traerEstaciones(props.perfil.empresa);  
             }   
        }

        if (props.dataRent.estacionesCargadas) {
            console.log('data estacion ', props.dataRent.estacionex)
        }
    },[props.dataRent.estacionesCargadas])

    useEffect(() => {
        dispatch(validateUser3g(infoUser.DataUser.idNumber))
        dispatch(viewPenalizaciones(infoUser.DataUser.idNumber));
        dispatch(validateRegister(infoUser.DataUser.idNumber));
    },[])
    
    return (    
    <>   
    {modalReservaExitosa ? openBackgroundInfoModal() : <></>}  
    {modalError ? openModalError() : <></>}  
    <SafeAreaView style={estilos.safeArea}>
        <ScrollView>
        <View style={styles.cajaCabeza}>
          <Pressable  
              onPress={() => { goBack() }}
              style={ styles.btnAtras }>
              <View>
              <Image source={Images.menu_icon} style={[styles.iconMenu]}/> 
              </View>
          </Pressable>
          <Text style={estilos.title}>Disponibilidad</Text>
        </View>    
    
        {
            (props.dataRent.registroFinalizado === true) &&
            (props.dataRent.usuarioValido == true) &&
            (props.dataRent.penalizaciones === 0) &&
            (props.dataRent.usuarioValido == true)
            ?
            <>
            <View style={estilos.contenedor}>
                {
                    (props.dataRent.estacionesCargadas === true) ?
                    <>
                        {<RNPickerSelect
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Elige tu estación', value: '' }}
                            useNativeAndroidPickerStyle={false}
                            value={state.estaciones}
                            onValueChange={
                                (value) => { 
                                    setState({ ...state, estaciones: value }), 
                                    viewBicycle(value)
                                }
                            }
                            items={props.dataRent.estacionex.data.map((data) =>
                                ({ label: data.est_estacion, value: data }))
                            }

                            Icon={() => {
                                return (
                                <Image source={Images.iconPickerYellow} style={{tintColor: 'black', top: 25, right: 50, height: 25, width: 25, resizeMode: 'contain' }} />
                                );
                            }}
                        />
                        
                        }<GuiaEstados />
                        
                    </>:
                    <><Text style={{textAlign: 'center', fontSize: moderateScale(25)}}>...cargando las estaciones...</Text></>
                }
                
            </View>                       
            
            {
                state.ticket !== null ?
                <View style={estilos.cajaBtnReservar}>
                    <Text style={estilos.titleSelect4}>Seleccionaste el vehículo: {state.numVehiculo}</Text>

                    {
                        reservando ? 
                        <View style={{
                            justifyContent: "center", 
                            alignItems: "center", 
                            width: Dimensions.get('window').width,
                            height: 'auto', 
                            }}>
                            <LottieView source={require('../../Resources/Lotties/bicy_loader.json')} autoPlay loop 
                            style={{
                                width: Dimensions.get('window').width,
                                height: 150,             
                            }}/>
                        </View>
                        :
                        <Pressable  
                            onPress={() => { 
                                setReservando(true),
                                setModalReservaExitosa(true)
                            }} 
                            style={estilos.btnCenter}>
                            <View style={estilos.btnRed}>
                                <Text style={estilos.btnTextColorBlack}>Reservar</Text>
                            </View>
                        </Pressable>
                    }
                    
                </View>
                :
                <></>
            }

            <View style={estilos.boxPrincipalItemsReserva}>
                {
                    state.ticket === null && props.dataRent.bicicletasCargadas?
                    <View style={{
                            justifyContent: "center", 
                            alignItems: "center", 
                            width: Dimensions.get('window').width,
                            height: 'auto', 
                            }}>
                            <LottieView source={require('../../Resources/Lotties/bicy_onOff.json')} autoPlay loop 
                            style={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').width*.5,             
                            }}/>
                        </View>
                        :
                        <></>
                }
                        
                {props.dataRent.bicicletasCargadas === true ? 
                <>
                {
                    props.dataRent.bicicletas.data.map((data) => 
                        <Pressable 
                            key={data.bic_numero}
                            onPress={() => { 
                                vehiculoseleccionado(data)
                            }} 
                            style={
                                (state.numVehiculo !== data.bic_numero) ?
                                estilos.btnVehiculos
                                :
                                estilos.btnVehiculosSelect
                            }>
                            <View style={getVehicleStyle(data.bic_estado)}>
                            {
                                data.bic_nombre === 'electrica' 
                                ? 
                                <Image source={Images.bicycle_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                :
                                <></>
                            }
                            {
                                data.bic_nombre === 'patineta' 
                                ? 
                                <Image source={Images.patin_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                :
                                <></>
                            }
                            {
                                data.bic_nombre === 'mecanica' 
                                ? 
                                <Image source={Images.cycle_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                :
                                <></>
                            }
                            
                                <Text style={estilos.textVehiculo}>{data.bic_numero}</Text> 
                            </View>
                        </Pressable>
                    )
                }
                
                </>
                :
                <View style={{
                    justifyContent: "center", 
                    alignItems: "center", 
                    width: Dimensions.get('window').width,
                    minHeight: Dimensions.get('window').height*.5,
                    }}>
                    <LottieView source={require('../../Resources/Lotties/bicy_04.json')} autoPlay loop 
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').width              
                    }}/>
                </View>  
                }
            </View>

            
            </>
            :
            <>
            <View style={estilos.contentMsn}>
                {(props.dataRent.usuarioValido === true) ? <></>: <Text style={estilos.denegado}>Usuario NO habilitado</Text>}
                {(props.dataRent.penalizaciones === 0) ? <></> : <Text style={estilos.denegado}>Tiene penalizaciones {props.dataRent.penalizaciones}</Text>}
                {(props.dataRent.registroFinalizado === true) ? <></> : <Text style={estilos.denegado}>No ha finalizado el registro {props.dataRent.registroFinalizado}</Text>}   
            </View>
            </>
        }            
                
        </ScrollView>
        
    </SafeAreaView>
    </>
    );
    
}

const styles = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: 100,
        position: 'relative',
    },
    btnAtras:{
        position: 'absolute',
        top: 10, 
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    cajaTextVehiuclosDisponible: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$disponible
    },
    cajaTextVehiuclosReservada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$reservada
    },
    cajaTextVehiuclosPrestada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$prestada
    },
    cajaTextVehiuclosInactiva: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$inactiva
    },
    cajaTextVehiuclosTaller: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$taller
    },
    cajaTextVehiuclosSinEstado: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'white'
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: moderateScale(13),
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
      color: Colors.$texto,
      backgroundColor: Colors.$blanco,
      borderColor: Colors.$texto20,
      width: Dimensions.get('window').width*0.9,
      paddingLeft: 20,
      fontFamily: Fonts.$poppinsregular,
      textAlign: 'center',
    },
    placeholder: {
      color: Colors.$texto,
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
        perfil: state.reducerPerfil,
        dataRent: state.reducer3G,
    }
}

export default connect(mapStateToProps)(Reservar4G);