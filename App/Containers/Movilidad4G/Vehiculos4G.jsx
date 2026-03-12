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
  Button,
  Dimensions,
  PermissionsAndroid
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
  savePrestamo,
  cancelar__
} from '../../actions/actions3g';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import React, { useState, useEffect, useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import RNPickerSelect from  '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import estilos from './styles/reservas4g';
import { apimysql } from './functions/funciones';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import Colors from '../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { getItem, setItem } from '../../Services/storage.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Env } from "../../Utils/enviroments"; 
import { TimeComponent } from './missingtTimeScreen';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { GuiaEstados } from '../../Components/movilidad4g/GuiaEstados';
import Bluetooth from './BluetoothClassic';
import LottieView from 'lottie-react-native';
import { NativeModules } from 'react-native';

function Vehiculos4G(props){
  const [ state , setState ] = useState({
      dataCargada: false,
      documentoUser: '',
      organizacion: '',
      fecha: new Date(),
      fechaVence: '',
      dia: new Date().toUTCString().substr(0,3),
      horas: new Date().getHours(),
      horaExtraida: new Date().toUTCString().substr(17,8),
      estaciones: '',
      penalizaciones: null,
      ticket: null, 
      numVehiculo: null,
      prestamoActivo: true,
      reservaVencida: false,
      registroFinalizado : false,
      reservaActiva: '',
      isOpenBackgroundInfoModal: false,
  });
  const { infoUser, logout } = useContext( AuthContext );
  const dispatch = useDispatch();
  const [estacionData , setEstacionData] = useState('');
  const [bicicletaData , setBicicletaData] = useState('');
  const [resInicio , setResInicio] = useState();
  const [reservando, setReservando] = useState(false);
  const [estaciones, setEstaciones ] = useState('');
  const [ticket, setTicket ] = useState(null);
  const [numVehiculo, setNumVehiculo ] = useState('');
  const [mac, setMac ] = useState(null);
  const [macCargado, setMacCargado ] = useState(false);
  const [resArduino, setResArduino] = useState(null);
  const [claveHC05, setclaveHC05] = useState(null);
  const [claveHC05Cargada, setclaveHC05Cargada] = useState(false);
  const [dataVehiculo, setDataVehiculo] = useState('');
  const [modalError, setModalError] = useState(false);

  const displayBackgroundInfoModal = (value) => {
  setState({ ...state, isOpenBackgroundInfoModal: value })
  }

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
                  <View style={{ 
                    backgroundColor: Colors.$primario, 
                    flexDirection: "column", 
                    flex: 1 }}>
                      <View style={{ 
                        flex: 3, 
                        justifyContent: "center",
                        alignItems: "center", 
                        position: "relative" }}>                          

                          <Text style={{ 
                              textAlign: "center", 
                              color: Colors.$texto,
                              fontSize: 24,
                              fontFamily: Fonts.$poppinsregular,
                              zIndex: 100
                          }}
                          >Reserva exitosa</Text>
                          
                          <View style={{marginTop: 40}}>                             
                                <Pressable style={{backgroundColor: Colors.$texto, borderRadius: 10}} onPress={() => { guardarReserva() }}>
                                    <Text style={{color : Colors.$blanco, fontFamily: Fonts.$poppinsregular, padding: moderateScale(15), fontSize: 20}}>Aceptar</Text>
                                </Pressable>
                          </View>
                      </View>
                  </View>
              </Modal>
          </View>
      )
  }

  const home = () => {RootNavigation.navigate('Home4G')}
  const irRentar = () => {RootNavigation.navigate('Vehiculos4G')}

  const crearPenalizacion = async() => {
      const data = {
          "pen_id": "0",
          "pen_tipo_penalizacion": "1",
          "pen_novedad": "por vencimiento de reserva",
          "pen_usuario": props.dataRent.DataUser.DataUser.idNumber,
          "pen_fecha_creacion":  state.fecha.toUTCString().substr(0,10),
          "pen_fecha_tiempo_ok": state.dia,
          "pen_fecha_dinero_ok": "dinero",
          "pen_estado": "ACTIVA",
          "pen_fecha_apelado": "sin fecha",
          "pen_motivo_apelado": "sin motivo"
      }
      let vehiculo = props.dataRent.reservas.data[0].res_bicicleta;
      let reservaId = props.dataRent.reservas.data[0].res_id;
      dispatch(savePenalization(data, vehiculo, reservaId));
  }

  const registroFinalizado = async (cc) => {
      await dispatch(validateRegister(cc));
  }

  const verPenalizaciones = async (cc) => {
      await dispatch(viewPenalizaciones(cc));
  }

  const prestamoActivo = async (cc) => {
      await dispatch(rentActive(cc))
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
          "res_estacion": estaciones,
          "res_usuario": infoUser.DataUser.idNumber,
          "res_bicicleta": ticket,
          "res_fecha_inicio": state.fecha.toUTCString().substr(0,10),
          "res_hora_inicio": new Date().toUTCString().substr(17,8),
          "res_fecha_fin": fechaVence.toJSON(),
          "res_hora_fin": state.horas,
          "res_estado": "ACTIVA"
      }
      console.log('data', data)
      await dispatch(saveReserva(data, fechaVence.toJSON()));
      displayBackgroundInfoModal(false); 
  }

  const vehiculoseleccionado = async(data) => {
    //data.bic_id, data.bic_numero, data.bic_estado
    console.log('la data del veh selec', data)
    console.log('clave del veh selec', data.bc_bicicletero.bro_clave)
    if (data.bic_estado === 'DISPONIBLE') {
      await conectarArduino(data.bc_bicicletero.bro_bluetooth);
      setTicket(data.bic_id);
      setNumVehiculo(data.bic_numero);
      setclaveHC05Cargada(true);
      setclaveHC05(data.bc_bicicletero.bro_clave);
      setDataVehiculo(data)
      //dispatch(saveStateBicicletero(id, state.estaciones));
    }else {
      setModalError(true);
    }
  }

  const openModalError = () => {
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
                    <View style={{ flex: 3, borderRadius: 20, marginVertical: 200, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 20 }}>                            

                        <Text style={{ 
                            textAlign: "center", 
                            color: Colors.$texto80,
                            fontFamily: Fonts.$poppinsregular,
                            fontSize: 22,
                            margin: 10,
                            zIndex: 100
                        }}
                        >Vehículo no disponible</Text>   

                        <View style={{
                            justifyContent: "center", 
                            alignItems: "center", 
                            width: 200,
                            minHeight: 200,
                          }}>
                            <LottieView source={require('../../Resources/Lotties/bicy_error.json')} autoPlay loop 
                            style={{
                              width: 150,
                              height: 150              
                            }}/>
                        </View>                      

                        <Pressable  
                            onPress={() => { 
                                setModalError(false)
                            }}
                            style={estilos.btnCenter}>
                            <View style={[estilos.btnSaveOK, {
                                backgroundColor: Colors.$secundario,
                                width: 300
                            }]}>
                                <Text style={[estilos.textBtnNext, {
                                    color: Colors.$texto, fontSize: 18, fontFamily: Fonts.$poppinsregular
                                }]}>Aceptar</Text>
                            </View>
                        </Pressable>                             
                    </View>
                </View>
            </Modal>
        </View>
    )
  }

  const conectarArduino = async (mac) => {
    if(mac !== 'sin mac'){
      setMacCargado(true);
      setMac(mac)
    }
  }

  const getVehiculos = async (estacion) => {
    if(estacion !== ''){
        await dispatch(viewVehiculo(estacion));
    }
  } 

  const traerVehiculo = async (data) => {
    await getVehiculos(data.est_estacion);
  }
  
  const conectarEstacion = async (data) => {
    await conectarArduino(data.est_mac);
  }

  const traerEstaciones = async(empresa) => {
      console.log('entrnado a lassssss estaciones ', empresa)
      await dispatch(viewEstacion(empresa));
  }

  const reservasActivas = async (cc) => {
      const res = await dispatch(reserveActive(cc));
      console.log('QUE RESERVA HAYYYYYYYYYYYYYY', res);
  }

  const userActivo = async (cc) => {
      console.log('mirando si usuario activo', cc);
      await dispatch(validateUser3g(cc));
  }

  const penal = async () => {
      crearPenalizacion();
  }

  useEffect(() => {
      if (props.perfil.empresa !== null) {
         traerEstaciones(props.perfil.empresa);  
      }              
  },[props.perfil.empresa])
  
  useEffect(() => {
      console.log('La cedula desde infoUser.DataUser.idNumber :',infoUser.DataUser.idNumber )  
      console.log('El correo desde infoUser.DataUser.email :',infoUser.DataUser.email )  
      //prestamoActivo(infoUser.DataUser.idNumber);
      userActivo(infoUser.DataUser.idNumber);
      reservasActivas(infoUser.DataUser.idNumber);
      verPenalizaciones(infoUser.DataUser.idNumber);
      registroFinalizado(infoUser.DataUser.idNumber);  
  },[])

  useEffect(() => {
    if (props.dataRent.vehiculoReservaCargada) {
       console.log('vehiculo en reserva ', props.dataRent.dataVehiculoReserva) 
    }              
  },[props.dataRent.vehiculoReservaCargada])

  useEffect(() => {
    if (props.dataRent.bicicletasCargadas) {
       console.log('vehiculos', props.dataRent.bicicletas.data) 
       
    }              
  },[props.dataRent.bicicletasCargadas])

  const cerrarApp = () => {
    if (Platform.OS === 'android') {
      NativeModules.AppExit.exitApplication();
    }
  };

  const cerrandoSesion = async() => {
      console.log('cerrando la sesion estamos en tablet');
      await dispatch(cancelar__());
      await logout(); 
      await cerrarApp();
  }

  useEffect(() => {
    if (props.dataRent.prestamoSave) {
        if (Env.modo === 'tablet') {
            console.log('ESTAMOS EN TABLET VAMOS A CERRAR SESION 4G');
            cerrandoSesion();
        }else{
            RootNavigation.navigate('ViajeActivo')
        }
    }else{
      console.log('ACACA props.dataRent.prestamoSave', props.dataRent.prestamoSave)
    }
},[props.dataRent.prestamoSave])

  useEffect(() => {
    if (props.dataRent.estacionesCargadas) {
       console.log('estaciones', props.dataRent.estacionex.data) 
    }              
  },[props.dataRent.estacionesCargadas])

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
  
  const liberar = () => {
    console.log('liberando este vehiculo con ble HC-05')
  }

  const respuestaArduino = (res) => {
    console.log('res arduino', res);
    setResArduino(res);
  }

  async function requestBluetoothPermissions() {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        if (
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log('Permisos de Bluetooth concedidos 4g');
        } else {
            console.log('Permisos de Bluetooth denegados');
        }
    } catch (err) {
        console.warn(err);
    }
  }

  useEffect(() => {
    console.log('dando permisos para classic 4g')
    requestBluetoothPermissions();
}, []);

  return (        
  <SafeAreaView style={estilos.safeArea}>
      {modalError ? openModalError() : <></>}  
      {(state.isOpenBackgroundInfoModal) ? openBackgroundInfoModal() : <></>}
      
      <View style={styles.cajaCabeza}>
        <Pressable  
          onPress={() => { home() }}
          style={styles.btnAtras}>
          <View>
            <Image source={Images.menu_icon} style={styles.iconMenu}/> 
          </View>
        </Pressable>
        
        <Text style={styles.titulo}>Disponibilidad</Text>
      </View> 

      { 
        macCargado ? 
        <Bluetooth 
          mac={mac}
          macCargado={macCargado}
          claveHC05={claveHC05}
          claveHC05Cargada={claveHC05Cargada}
          numVehiculo={numVehiculo}
          dataVehiculo={dataVehiculo}
          //respuestaArduino={respuestaArduino}
        /> 
        : 
        <></> 
      }
      
      <ScrollView>
          {
              (props.dataRent.prestamoActivo === false) ? 
              <>
              { 
                  (props.dataRent.reservaSave === false) ? 
                  <>
                  {
                      (props.dataRent.registroFinalizado === true) &&
                      (props.dataRent.usuarioValido == true) &&
                      (props.dataRent.penalizaciones === 0) &&
                      (props.dataRent.usuarioValido == true)
                      ?
                      <>
                      <View style={styles.contenedor}>
                          {
                              (props.dataRent.estacionesCargadas === true) ?
                              <>
                                  {<RNPickerSelect
                                      style={pickerSelectStyles}
                                      placeholder={{ label: 'Elige tu estación', value: '' }}
                                      useNativeAndroidPickerStyle={false}
                                      value={estaciones}
                                      onValueChange={
                                          (value) => { 
                                              setEstaciones(value),
                                              traerVehiculo(value)
                                          }
                                      }
                                      items={props.dataRent.estacionex.data.map((data) =>
                                          ({ label: data.est_estacion, value: data }))
                                      }

                                      Icon={() => {
                                          return (
                                          <Image source={Images.iconPickerYellow} style={{tintColor: Colors.$adicional, top: 25, right: 50, height: 25, width: 25, resizeMode: 'contain' }} />
                                          );
                                      }}
                                  />}
                                  <GuiaEstados />
                                  
                              </>:
                              <><Text style={{textAlign: 'center', fontSize: moderateScale(25)}}>...cargando las estaciones...</Text></>
                          }
                          
                      </View>
                      
                      
                      {
                          ticket !== null ?
                          <View style={estilos.cajaBtnReservar}>
                              <Text style={estilos.titleSelect4}>Vehículo seleccionado: {numVehiculo}</Text>

                              {
                                  reservando ? 
                                  <Pressable  
                                      onPress={() => { console.log('reservando...') }} 
                                      style={estilos.btnCenter}>
                                      <View style={estilos.btnRed}>
                                          <Text style={estilos.btnTextColorBlack}>Reservando</Text>
                                      </View>
                                  </Pressable>
                                  :
                                  <></>
                              }
                              
                          </View>
                          :
                          <>
                          {
                            props.dataRent.bicicletasCargadas ? 
                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: Dimensions.get('window').width,
                                height: 'auto', 
                                }}>
                                {
                                  Env.modo === 'tablet' ?
                                  <Text style={{
                                      fontSize: moderateScale(25),
                                      color: Colors.$texto,
                                      textAlign: 'center',  
                                      fontFamily: Fonts.$poppinsregular
                                  }}>Selecciona un vehículo</Text>
                                  :
                                  <LottieView source={require('../../Resources/Lotties/bicy_onOff.json')} autoPlay loop 
                                  style={{
                                      width: Dimensions.get('window').width,
                                      height: Dimensions.get('window').width*.5,             
                                  }}/>
                                }
                            </View>
                            :
                            <></>
                          }
                          </>
                          
                      }

                    <View style={estilos.boxPrincipalItemsReserva}>
                        
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
                                    (numVehiculo !== data.bic_numero) ?
                                    estilos.btnVehiculos
                                    :                          
                                    estilos.btnVehiculosSelect
                                }
                                >
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
                        <>
                          {/*<Image source={Images.reserva01} style={estilos.imgReserva01}/>*/}
                          <View style={{
                              justifyContent: "center", 
                              alignItems: "center", 
                              width: Dimensions.get('window').width,
                              height: 'auto', 
                              }}>
                              {
                                Env.modo === 'tablet' ?
                                <Text style={{
                                    fontSize: moderateScale(25),
                                    color: Colors.$texto,
                                    textAlign: 'center',  
                                    fontFamily: Fonts.$poppinsregular
                                }}>Selecciona una estación</Text>
                                :
                                <LottieView source={require('../../Resources/Lotties/bicy_04.json')} autoPlay loop 
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: Dimensions.get('window').width,             
                                }}/>
                              }  
                              
                          </View>
                        </>
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
                  </>
                  :
                  <></>
              }
              </>
              :
              <View>
                  <Text style={estilos.aceptado3}>Préstamo activo </Text>
                  <Pressable  
                      onPress={() => { irRentar() }}
                      style={estilos.btnCenter}>
                      <View style={estilos.btnSaveOK}>
                          <Text style={estilos.btnSaveColor}>Ir a rentar</Text>
                      </View>
                  </Pressable>
              </View>
          }
      </ScrollView>
      
  </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.$blanco,
  },
  cajaCabeza: {
    backgroundColor: Colors.$blanco,
    justifyContent: 'space-between',
    alignItems: 'center', 
    borderRadius: 1,
    width: Dimensions.get('window').width,
    height: 80,
    position: 'relative',
    top: 0,
    flexDirection: 'row',
    zIndex: 100,
    paddingTop: 20
  },
  titulo: {
    fontFamily: Fonts.$poppinsmedium, 
    fontSize: 22, 
    color: Colors.$texto,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnAtras: {
    position: 'absolute',
    top: 20, 
    left: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    zIndex: 1000
  },
  iconMenu: {
    width: 50,
    height: 50,
  },
  textButton: {
    fontFamily: Fonts.$poppinsmedium, 
    fontSize: 20, 
    color: Colors.$texto,
    alignSelf: "center",
    marginVertical: 20,
  },
  picker: {
    height: 50,
    width: 200,
  },
  selectedStationView: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedStationText: {
    fontSize: 18,
    color: Colors.$texto,
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
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
    marginBottom: 10,
    fontSize: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    marginTop: 10,
    paddingBottom: 10,
    color: Colors.$texto,
    backgroundColor: Colors.$blanco,
    borderColor: Colors.$secundario50,
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

export default connect(mapStateToProps)(Vehiculos4G);