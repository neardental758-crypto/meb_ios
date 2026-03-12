import {
    Image,
    ImageBackground,
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
    validateUser3g,
    reserveActive,
    saveReserva,
} from '../../actions/actions3g';
import { 
    viewParqueaderos,
    viewLugares,
    saveReservaParqueo
} from '../../actions/actionParqueadero';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from  '@nejlyg/react-native-picker-select';
import estilos from './styles/reservas';
import Colors from '../../Themes/Colors';
import { moderateScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { GuiaEstados } from './GuiaEstados';
import LottieView from 'lottie-react-native';
import { v4 as uuidv4 } from 'uuid';

function Reservar_parqueo(props){
    const [ state , setState ] = useState({
        dataCargada: false,
        fecha: new Date(),
        dia: new Date().toUTCString().substr(0,3),
        horas: new Date().getHours(),
        horaExtraida: new Date().toUTCString().substr(17,8),
        estaciones: '',
        ticket: null, 
        numLugar: null,
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

    const goBack = () => { RootNavigation.navigate('Home_electrohub') }

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
                        <View style={{ flex: 1, borderRadius: 20, marginVertical: 250, marginHorizontal: 25, justifyContent: "space-around", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$parqueo_color_fondo, padding: 10 }}>
                            
                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$parqueo_color_texto,
                                fontFamily: Fonts.$poppinsmedium,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >¡Reserva Exitosa!</Text>   

                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 350,
                                minHeight: 200,
                              }}>
                                <LottieView source={require('../../Resources/Lotties/Confirmed.json')} autoPlay loop 
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
                                    backgroundColor: Colors.$parqueo_color_adicional,
                                    width: 300
                                }]}>
                                    <Text style={[estilos.textBtnNext, {
                                        color: Colors.$negro, fontSize: 18, fontFamily: Fonts.$poppinsregular
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
                    backgroundColor: Colors.$parqueo_color_secundario
                }}>
                    <Text style={{
                        textAlign: "center",
                        color: Colors.$texto80,
                        fontFamily: Fonts.$poppinsregular,
                        fontSize: 22,
                        margin: 10,
                    }}>
                        No disponible
                    </Text>

                    <LottieView source={require('../../Resources/Lotties/bicy_error.json')} autoPlay loop
                        style={{ width: 100, height: 100 }} />

                    <Pressable
                        onPress={() => setModalError(false)}
                        style={{
                            backgroundColor: Colors.$parqueo_color_primario,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 30,
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

    const cerrar_modadl = () => {
        console.log('cerrando modal de error');
        setModalError(false);
    }

    const guardar_reserva = async () => {
        console.log('Guardando la reserva');

        const ahora = new Date();
        const hora = ahora.getHours();

        // Validar si está fuera del horario permitido (entre 7 PM y 6 AM)
        if (hora >= 19 || hora < 6) {
            Alert.alert(
                "Horario no permitido",
                "Las reservas solo se pueden realizar entre las 6:00 a.m. y 7:00 p.m."
            );
            return;
        }

        // Obtenemos duración de la reserva en minutos desde la DB
        const duracionMinutos = minutosReserva || 60;

        const horaFin = new Date(ahora.getTime() + duracionMinutos * 60000); // sumamos minutos

        const data = {
            "id": uuidv4(),
            "usuario": props.dataRent.docUsuario,
            "parqueadero": '1234',
            "lugar_parqueo": state.ticket,
            "fecha": ahora.toISOString().substring(0, 10), // YYYY-MM-DD
            "hora_inicio": ahora.toTimeString().substring(0, 8),  // HH:MM:S
            "hora_fin": horaFin.toTimeString().substring(0, 8),
            "dispositivo": "android",
            "estado": "ACTIVA"
        };

        console.log('data save reserva parqueo', data);

        await dispatch(saveReservaParqueo(data, horaFin.toISOString().substring(0, 10), duracionMinutos, state.ticket));
        await resetState();
        await setModalReservaExitosa(false);

    };

    const resetState = async () => {
        await setState({ 
            ...state,
            dataCargada: false,
            ticket: null, 
            numLugar: null,
        })
        await setEstacionData('');
        await setBicicletaData('');
        await setResInicio('');
        await setReservando(false);
        await setModalError(false);
    }

    const lugarSeleccionado = async(data) => {
        console.log('data', data);
        console.log('Los minutos para la reserva', minutosReserva);

        if (data.estado === 'DISPONIBLE') {
            setState({ ...state, ticket: data.id, numLugar: data.numero })
        }else {
            setModalError(true);
        }
    }
    
    const viewLugar = async (data) => {
        console.log('la PARQUEADERO  seleccionado es:', data)
        console.log('Duracion de la reserva en parqueadero es:', data.duracion_reserva_min);
        console.log('El id del parqueadero es:', data.id);
        if (data.duracion_reserva_min === 0) {
            Alert.alert("Mensaje", "⚠️ Este ElectroHub no tiene reservas activas");
            return
        }

        setMinutosReserva(data.duracion_reserva_min);
        if(data !== ''){
            await dispatch(viewLugares(data.id));
        }
    }

    const traerParqueaderos = async(empresa) => {
        console.log('entrnado a lassssss estaciones ', empresa)
        await dispatch(viewParqueaderos(empresa));
    }

    const reservasActivas = async (cc) => {
        const res = await dispatch(reserveActive(cc));
    }

    const getLugarStyle = (estado) => {
        switch (estado) {
          case 'DISPONIBLE':
            return styles.cajaTextVehiuclosDisponible;
          case 'RESERVADO':
            return styles.cajaTextVehiuclosReservada;
          case 'OCUPADO':
            return styles.cajaTextVehiuclosPrestada;
          case 'INACTIVA':
            return styles.cajaTextVehiuclosInactiva;
          case 'EN TALLER':
            return styles.cajaTextVehiuclosTaller;
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
            console.log('la empresa es ', props.perfil.empresa)
            traerParqueaderos(props.perfil.empresa);  
        }              
    },[props.perfil.empresa])

    useEffect(() => {
        if (props.parqueaderosData.reservaSave) {
            RootNavigation.navigate('Home_electrohub')
        }
    },[props.parqueaderosData.reservaSave])

    useEffect(()=>{
        if (!props.parqueaderosData.parqueaderosCargadas) {
            if (props.perfil.empresa !== null) {
                traerParqueaderos(props.perfil.empresa);  
             }   
        }

        if (props.parqueaderosData.parqueaderosCargadas) {
            console.log('data estacion ', props.parqueaderosData.parqueaderosx)
        }
    },[props.parqueaderosData.parqueaderosCargadas])

    useEffect(() => {
        dispatch(validateUser3g(infoUser.DataUser.idNumber))
        //dispatch(viewPenalizaciones(infoUser.DataUser.idNumber));
        //dispatch(validateRegister(infoUser.DataUser.idNumber));
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
              <Image source={Images.IconoAtrasParqueo} style={[styles.iconMenu]}/> 
              </View>
          </Pressable>
          <Text style={estilos.title}>Reserva tu parqueo</Text>
        </View>    
            
        <View>
            <View style={estilos.contenedor}>
                {
                    (props.parqueaderosData.parqueaderosCargadas === true) ?
                    <>
                        {
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Selecciona un Electrohub', value: '' }}
                            useNativeAndroidPickerStyle={false}
                            value={state.estaciones}
                            onValueChange={
                                (value) => { 
                                    setState({ ...state, estaciones: value }), 
                                    viewLugar(value)
                                }
                            }
                            items={props.parqueaderosData.parqueaderosx.data
                                .filter(valor => valor.estado === 'ELECTROHUB')
                                .map((data) =>
                                ({ label: data.nombre, value: data }))
                            }

                            Icon={() => {
                                return (
                                <Image source={Images.iconPickerYellow} style={{tintColor: 'black', top: 25, right: 50, height: 25, width: 25, resizeMode: 'contain' }} />
                                );
                            }}
                        />
                        }

                        <GuiaEstados />
                        
                    </>:
                    <><Text style={{textAlign: 'center', fontSize: moderateScale(25)}}>...cargando las estaciones...</Text></>
                }
                
            </View>                       
            
            {
                state.ticket !== null ?
                <View style={estilos.cajaBtnReservar}>
                    <Text style={estilos.titleSelect4}>Electrohub Seleccionado</Text>
                    <Text style={estilos.titleSelect4}>{state.numLugar}</Text>

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
                                height: 100,             
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

            <View style={{
                width: Dimensions.get('window').width,
                alignItems: 'center'
            }}>

                <View style={estilos.boxPrincipalItemsReserva}>
                            
                    {props.parqueaderosData.lugaresCargados === true ? 
                    <>
                    {
                        props.parqueaderosData.lugares.data.map((data) => 
                            <Pressable 
                                key={data.id}
                                onPress={() => { 
                                    lugarSeleccionado(data)
                                }} 
                                style={
                                    (state.ticket !== data.id) ?
                                    estilos.btnVehiculos
                                    :
                                    estilos.btnVehiculosSelect
                                }>
                                <View style={getLugarStyle(data.estado)}>
                                    {
                                        data.estado === 'DISPONIBLE' 
                                        ? 
                                        <Image source={Images.bicycle_Icon} style={[estilos.iconBici, {tintColor : Colors.$parqueo_color_texto_50,}]}/> 
                                        :
                                        <></>
                                    }
                                    {
                                        data.estado === 'OCUPADO' 
                                        ? 
                                        <Image source={Images.patin_Icon} style={[estilos.iconBici, {tintColor : Colors.$parqueo_color_texto_50,}]}/> 
                                        :
                                        <></>
                                    }
                                    {
                                        data.estado === 'RESERVADA' 
                                        ? 
                                        <Image source={Images.patin_Icon} style={[estilos.iconBici, {tintColor : Colors.$parqueo_color_texto_50,}]}/> 
                                        :
                                        <></>
                                    }
                                    
                                    <Text style={estilos.textVehiculo}>{data.numero}</Text> 
                                    <Text style={{
                                        color: Colors.$parqueo_color_primario,
                                        position: 'absolute',
                                        bottom: 2,
                                        right: 2
                                    }}>{data.voltaje}V</Text> 
                                    
                                </View>
                            </Pressable>
                        )
                    }
                    
                    </>
                    :

                    <View style={{
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: Dimensions.get('window').width*.8,
                        minHeight: Dimensions.get('window').height*.5,
                        }}>
                            {/*animacion bici esperando a seleccionar parqueadero */}
                        <LottieView source={require('../../Resources/Lotties/lock.json')} autoPlay loop 
                        style={{
                            width: Dimensions.get('window').width*.7,
                            height: Dimensions.get('window').width              
                        }}/>
                    </View>  
                    }
                </View>

            </View>
        </View>           
                
        </ScrollView>
        
    </SafeAreaView>
    </>
    );
    
}

const styles = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$parqueo_color_fondo,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: 150,
        position: 'relative',
    },
    btnAtras:{
        position: 'absolute',
        top: 30, 
        right: 10,
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
        width: 120,
        height: 80,
        borderLeftWidth: 10,
        borderColor: Colors.$disponible
    },
    cajaTextVehiuclosReservada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 80,
        borderLeftWidth: 10,
        borderColor: Colors.$reservada
    },
    cajaTextVehiuclosPrestada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 80,
        borderLeftWidth: 10,
        borderColor: Colors.$prestada
    },
    cajaTextVehiuclosInactiva: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 80,
        borderLeftWidth: 10,
        borderColor: Colors.$inactiva
    },
    cajaTextVehiuclosTaller: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 1200,
        height: 80,
        borderLeftWidth: 10,
        borderColor: Colors.$taller
    },
    cajaTextVehiuclosSinEstado: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'white'
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 18,
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
      fontSize: 16,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      marginTop: 10,
      paddingBottom: 10,
      color: Colors.$texto,
      backgroundColor: Colors.$parqueo_color_secundario,
      borderColor: Colors.$texto20,
      width: Dimensions.get('window').width*0.9,
      paddingLeft: 20,
      fontFamily: Fonts.$poppinsregular,
      textAlign: 'Flex-start',
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
        parqueaderosData: state.reducerParqueadero
    }
}

export default connect(mapStateToProps)(Reservar_parqueo);