import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
  Modal,
  TextInput,
  PermissionsAndroid, 
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LottieView from 'lottie-react-native';
import Fonts from '../../Themes/Fonts';
import { 
  reset_tyc,
  save_token_msn,
} from '../../actions/actionCarpooling';
import {
  validateUser3g,
  get_vehycle_id,
} from '../../actions/actions3g';
import {
  validate_tyc,
  accept_tyc,
  validate_qr,
  reset_error_parqueo,
  sin_cupo,
  reset_qr,
  buscar_parqueo_activo_parqueadero,
  horas_parqueo,
  savePrestamo
} from '../../actions/actionParqueadero';
import { connect, useDispatch } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Camera, CameraType } from 'react-native-camera-kit';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import estilos from './styles/reservas';
import { AuthContext } from '../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import * as RootNavigation from '../../RootNavigation';
import { v4 as uuidv4 } from 'uuid';
import { Env } from "../../Utils/enviroments";
import { TYC } from "./TyC";
import { NativeModules } from 'react-native';
const { NotificacionModule } = NativeModules;

function Rentar_parqueadero(props) {

  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const bleActivo = true; // O pasar por props/context
  const { infoUser, logout } = useContext( AuthContext );
  const [isChecked, setIsChecked] = useState(true);
  const [abrirModalQR, setAbrirModalQR] = useState(false);
  const [abrirModalError, setAbrirModalError] = useState(false)
  const [tyc, setTyC] = useState(false); //valor inicial false
  const [preload, setPreload] = useState(true); //valor inicial true
  const [inputQr, setInputQr] = useState(''); //valor inicial
  const [vel__, SetVel__] = useState({});
  const [escaneando, SetEscaneando] = useState(false);//valor inicial false
  
  const onReadCode = (event) => {
      const qrValue = event?.nativeEvent?.codeStringValue;
      setIsScanning(false);
      Alert.alert('Código QR detectado', qrValue, [
          {
          text: 'Escanear de nuevo',
          onPress: () => setIsScanning(true),
          },
      ]);
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const goBack = async() => { 
    await dispatch(horas_parqueo(4, false));
    await RootNavigation.navigate('Home_parqueadero');
  }

  const ir_vel = async() => {
    await dispatch(reset_error_parqueo());
    await RootNavigation.navigate('MyVEL');
  }

  const validarQR = async () => {
    console.log('vamos a validar el qr,', inputQr);
    SetEscaneando(true);

    setTimeout(async function () {
      const payload = {
        qr: inputQr,
        tipo: 'manual',
        modo: 'normal',
        timestamp: Date.now(),
      };

      if (props.dataParqueo.conectividad_net) {
        // 🔹 Conectado a internet, enviamos directamente al backend
        dispatch(validate_qr(inputQr, 'manual', props.dataParqueo.reservaSave ? 'conreserva' : 'normal'));
      } else {
        // 🔹 Sin conexión, guardar en AsyncStorage para sincronizar luego
        try {
          const pendientes = JSON.parse(await AsyncStorage.getItem('qr_pendientes')) || [];
          pendientes.push(payload);
          await AsyncStorage.setItem('qr_pendientes', JSON.stringify(pendientes));

          console.log('QR guardado offline para sincronizar después:', payload);

          // 🔹 Mostrar alert al usuario
          Alert.alert(
            'Modo Offline',
            'El parqueo ha sido registrado localmente. Se enviará al servidor cuando vuelva la conexión.'
          );
        } catch (error) {
          console.log('Error guardando QR offline:', error);
          Alert.alert('Error', 'No se pudo guardar la acción offline.');
        }
      }
    }, 2000);
  };

  const cerrar_modal = () => {
    dispatch(reset_qr());
    setAbrirModalQR(false);
    SetEscaneando(false);
  }

  const iniciarSeguimientoParqueo = async () => {
      console.log('iniciar reserva en seg plano')
      NotificacionModule.iniciarNotificaciones('parqueo');
  };

  const guardarRecordatorioStorage = async () => {
     try {
            const payload = {
                qr: 'qr',
                tipo: 'manual',
                modo: 'normal',
                timestamp: Date.now(),
                lugar: 'lugar',
                numero: 'numero',
                notificacion: 'Parqueo'
            };
            const pendientes = JSON.parse(await AsyncStorage.getItem('qr_pendientes')) || [];
            pendientes.push(payload);
            await AsyncStorage.setItem('qr_pendientes', JSON.stringify(pendientes));
            await iniciarSeguimientoParqueo();
            console.log('QR guardado offline para sincronizar después:', payload);

            // 🔹 Mostrar alert al usuario
            Alert.alert(
                'Validar Parqueo ',
                'El parqueo ha sido registrada localmente.'
            );
        } catch (error) {
          console.log('Error guardando QR offline:', error);
          Alert.alert('Error', 'No se pudo guardar la acción offline.');
        }
  }

  const guardarPrestamo = async () => {
    let hoy = new Date(); // Fecha local
    let hoy_5 = new Date(hoy.getTime() - 5 * 60 * 60 * 1000);
    const formatoHora = (date) => {
        return date.toLocaleTimeString('es-CO', { hour12: false }); // Hora local HH:mm:ss
    };

    let inicio = new Date(); // Hora actual local
    let fin = new Date(inicio.getTime() + props.dataParqueo.horasSeleccionadas * 60 * 60 * 1000); // Sumar n horas
    //await eliminarReservaStorage();  
    await detenerNotificaciones();
    const data = {
        id: uuidv4(),
        usuario: infoUser.DataUser.idNumber,
        parqueadero: props.dataParqueo.lugar_parqueo.parqueadero, 
        lugar_parqueo: props.dataParqueo.lugar_parqueo.id, 
        vehiculo: props.dataRent.vel_select.data.vus_id,
        fecha: hoy_5.toJSON(),   // Si quieres ISO UTC completa, si prefieres local usa hoy.toLocaleString()
        inicio: formatoHora(inicio),
        fin: formatoHora(fin),
        duracion: "duracion",
        dispositivo: Platform.OS,
        estado: "ACTIVA",
    };

    console.log('Data para el préstamo parqueaderouuuuuuu:', data);
    await dispatch(savePrestamo(data, props.dataRent.vel_select.data.vus_id, props.dataParqueo.lugar_parqueo, props.dataParqueo.horasSeleccionadas, props.dataParqueo.dataTyC.saldo)); 
    await iniciarSeguimientoParqueo();
    await setBtnSeRento(true);
     
}

// Detener servicio
const detenerNotificaciones = () => {
    NotificacionModule.detenerNotificaciones();
};

const eliminarReservaStorage = async () => {
  try {
    const pendientes = JSON.parse(await AsyncStorage.getItem('qr_pendientes')) || [];

    if (pendientes.length === 0) {
      Alert.alert('Modo Offline', 'No tiene ninguna reserva pendiente en storage');
      return;
    }

    Alert.alert(
      "Eliminar reserva",
      "¿Confirma que desea eliminar la reserva del storage?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: async () => {
            // Limpiamos la lista de pendientes
            pendientes.shift(); 
            await AsyncStorage.setItem('qr_pendientes', JSON.stringify(pendientes));
            Alert.alert('Éxito', 'Reserva eliminada del storage');
          } 
        }
      ]
    );

  } catch (error) {
    console.log('Error eliminando reserva de storage:', error);
  }
};


const rentar = async () => {
    console.log('entrando a rentar')
    await guardarPrestamo();    
}

  const openModalQR = () => {
    return (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Modal transparent={true} animationType="slide">
            <View style={{ backgroundColor: Colors.$parqueo_color_secundario_50, flexDirection: "column", flex: 1 }}>
                <View style={styles_qr.modalStyle}>
                    <Pressable 
                        onPress={() => cerrar_modal()} 
                        style={[styles_qr.buttonClose]}>
                        <Text style={{
                            fontSize:24,
                            fontFamily: Fonts.$poppinsregular,
                            color: Colors.$parqueo_color_texto,
                            marginTop: 2
                        }}>X</Text>
                    </Pressable>
                    
                    {
                      props.dataParqueo.validate_Qr ?
                      <>
                      <Text style={styles.subtitle}>Se valido el qr</Text>
                      <Pressable
                          onPress={() => rentar()}
                          style={styles.btnSI}
                      >
                          <View style={{
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}>
                              <Text style={styles.textLiberar2}>Parquear</Text>   
                          </View>                        
                      </Pressable>
                      </>
                      
                      :
                      <>
                      {
                        escaneando ? 
                        <LottieView source={require('../../Resources/Lotties/bicy_qr.json')}     autoPlay loop 
                          style={{
                            width: 180,
                            height: 180          
                        }}/>
                        :
                        <Image source={Images.qr_} style={{width: 100, height: 100, marginTop: 40, marginBottom: 40}}/> 
                      }  

                      
                      <TextInput
                          style={{ 
                              color: Colors.$texto, borderRadius: 30, fontFamily: Fonts.$poppinsregular, textAlign: 'center', marginBottom: 20, paddingBottom: 10, paddingTop: 10, paddingRight: 20, paddingLeft: 20, width: "60%", backgroundColor: Colors.$parqueo_color_texto }}
                          placeholderTextColor={Colors.$parqueo_color_fondo}
                          value={inputQr}
                          onChangeText={(data) => { setInputQr({data}) }}
                          keyboardType="phone-pad"
                          numberOfLines={1}
                          fontSize={18}
                          placeholder="Código QR"></TextInput>
                      <View style={{ flex: 0.3 }}></View>  

                      {
                        escaneando ?
                        <Pressable 
                            onPress={() => console.log('escanenado')} 
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$secundario,
                            borderRadius : 50}}> 
                            <Text style={{width: 200, color: 'white', fontFamily: Fonts.$poppinsregular, textAlign: 'center', fontSize: 18}}>Enviar</Text>
                        </Pressable>
                        :
                        <Pressable 
                            onPress={() => { 
                                validarQR()
                            }} 
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$parqueo_color_primario,
                            borderRadius : 50}}> 
                            <Text style={{width: 200, color: 'white', fontFamily: Fonts.$poppinsregular, textAlign: 'center', fontSize: 18}}>Enviar</Text>
                        </Pressable>
                      }                    
                      </>
                    }   
                </View>
            </View>
        </Modal>
    </View>
    )
  }

  const reseteandoError = async () => {
    console.log('Reseteando')
    SetEscaneando(false);
    dispatch(reset_error_parqueo());
  }

  const openModalError = () => {
    return (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Modal transparent={true} animationType="slide">
            <View style={{ backgroundColor: Colors.$texto80, flexDirection: "column", flex: 1 }}>
                <View style={styles_qr.modalStyle}>
                    <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$parqueo_color_texto,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 18,
                                margin: 40,
                                zIndex: 100
                            }}
                            >{props.dataParqueo.mensage_qr}</Text>   
   
                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 120,
                                height: 120,                                
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_error.json')} autoPlay loop 
                                style={{
                                  width: 100,
                                  height: 100            
                                }}/>
                            </View>           
                                         

                    <Pressable 
                        onPress={() => { 
                          reseteandoError();
                        }} 
                        style={{    
                        textAlign: "center",
                        padding  : 10,
                        margin : 20,
                        backgroundColor : Colors.$parqueo_color_primario,
                        borderRadius : 50}}> 
                        <Text style={{width: 200, color: 'white', fontFamily: Fonts.$poppinsregular, textAlign: 'center', fontSize: 18}}>Aceptar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </View>
    )
  }

  const aceptTyC = async() => {
    if (isChecked) {
      await dispatch(accept_tyc());
      await setLoadedTrips(true);
      setTimeout(function(){
        setLoadedTrips(false);
      }, 1000);
    }
    if (!isChecked) {
      Alert.alert('Debe aceptar términos y condiciones.')
    }
  }

  useFocusEffect( 
    React.useCallback(() => { 
      dispatch(validate_tyc());
    },[])
  );

  useEffect(() => {
    dispatch(validate_tyc());
  },[])

  useEffect(() =>{
    if (props.dataParqueo.reservaSave) {
      setIsScanning(true);
      /*Alert.alert(
          "Confirmar",
          "Tienes reserva activa con qr: " + props.dataParqueo.qrReservado,
          [
              {
                  text: "Cancelar",
                  style: "cancel"
              },
              {
                  text: "OK",
                  //onPress: () => dispatch(validate_qr(props.dataParqueo.qrReservado, 'scaner', 'conreserva'))
                  onPress: () => setIsScanning(true)
              }
          ]
      );*/
    }
  },[props.dataParqueo.reservaSave])

  useEffect(() => {
    if (props.dataParqueo.verify_tyc) {
      setTyC(true);  
      if (props.dataParqueo.ultimo_vehiculo === 'sin vehiculo') {
        console.log('no tiene un vehiculo asignado', props.dataParqueo.ultimo_vehiculo)
        RootNavigation.navigate('MyVEL');
      }else {
        console.log('si tenemos id ultimo vehiculo es:',props.dataParqueo.ultimo_vehiculo)
        dispatch(get_vehycle_id(props.dataParqueo.ultimo_vehiculo))
      }
    }
  },[props.dataParqueo.verify_tyc])

  useEffect(() => {
    if (props.dataRent.vel_select_cargado) {
      console.log('VEL por id es : ', props.dataRent.vel_select)
      SetVel__(props.dataRent.vel_select);
    }
  },[props.dataRent.vel_select_cargado])

  useEffect(() => {
    if (props.dataParqueo.save_tyc) {
      RootNavigation.navigate('MyVEL');
      setTyC(true);
    }
  },[props.dataParqueo.save_tyc])


  //validando los errores
  useEffect(() =>{
    if (props.dataParqueo.validate_Qr) {
      console.log('Se validó el qr y ya puedes utlizar el parqueo');
      setAbrirModalQR(true)
    }
  },[props.dataParqueo.validate_Qr])

  useEffect(() => {
    if (props.dataParqueo.seParqueo) {
        console.log('se parqueo correctamente, ir a vista parqueo'); 
        dispatch(buscar_parqueo_activo_parqueadero());
    }
  }, [props.dataParqueo.seParqueo])  

  // Solicitar permisos de cámara
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'Necesitas habilitar el acceso a la cámara para escanear códigos QR',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No puedes escanear sin habilitar la cámara.');
        }
      }
    };

    requestPermission();
  }, []);

  const handleReadCode = (event) => {
    const qrValue = event?.nativeEvent?.codeStringValue || event?.codeStringValue;
    if (!qrValue) {
      Alert.alert("QR no válido", "No se pudo leer el código QR.");
      return;
    }
    //const qrValue = event?.nativeEvent?.codeStringValue;
    if (!qrValue) return;

    console.log('Código QR leído:', qrValue);
    setIsScanning(false); // evitar dobles lecturas
    dispatch(validate_qr(qrValue, 'scaner', 'normal'));
    
  };

  useEffect(() => {
      dispatch(validateUser3g(infoUser.DataUser.idNumber))
  },[])
  
  if (!tyc) {
    return (
      <ImageBackground source={Images.fondoMapa} style={{        
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        }}>
        <View style={styles_tyc.cajaTyC}>
          <View  style={styles_tyc.cajaTituloCerrar}>
            <Text style={styles_tyc.textTitleTyC}>Reglas de uso - T&C</Text>
            <Pressable 
              onPress={() => goBack()}
              style={{
                zIndex: 1000,
              }}>
                <Image source={Images.x_icon} style={[styles_tyc.iconBici]}/>   
            </Pressable>                       
          </View>
          
          <View style={styles_tyc.LineaHorizontal }></View>
          <ScrollView style={styles_tyc.cajaScrool}>
            <TYC />
          </ScrollView>

          <View  style={styles_tyc.cajaAceptarContinuar}>
            <View style={styles_tyc.CajaHorCenter}>
              
              { isChecked ?
                <Pressable
                  onPress={() => toggleCheckBox()}
                  style={styles_tyc.btnCheckOK}
                />:
                <Pressable
                  onPress={() => toggleCheckBox()}
                  style={styles_tyc.btnCheck}
                />
              }
              
              <Text style={{fontFamily: Fonts.$poppinsregular}}>Aceptar téminos y condiciones</Text>
            </View>
            
            <View style={styles_tyc.cajaContinuar}> 
              <Text></Text>
              <Pressable 
                onPress={() => { aceptTyC() }} 
                style={styles_tyc.buttonTyC}>
                <Text style={styles_tyc.textoTyC}>Continuar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }else {
    return (
      <View style={styles.imgFondo}>
        { abrirModalQR ? openModalQR() : <></>}
        { props.dataParqueo.mensaje_error ? openModalError() : <></>}
        <KeyboardAwareScrollView>
        <View style={{        
            flex: 1,
            width: '100%', 
            justifyContent: 'center',
            }}>
          <View style={styles.contenedor}>

            <View style={styles.cajaCabeza}>
                <Pressable  
                    onPress={() => { goBack() }}
                    style={ styles.btnAtras }>
                    <View>
                    <Image source={Images.menu_icon} style={[styles.iconMenu]}/> 
                    </View>
                </Pressable>
                <View style={{
                  flexDirection: 'column',
                  width: '70%',
                  padding: 10,
                }}>
                  <Text style={styles.titulo}>Scanner QR</Text>
                  {
                    props.perfil.dataempresa[0]._parqueadero === 'ACTIVO+SALDO' ?
                    <>
                    <Text style={styles.subtitle}>Horas seleccionadas {props.dataParqueo.horasSeleccionadas}</Text>
                    <Text style={styles.subtitle}>saldo {props.dataParqueo.dataTyC.saldo}</Text>
                    </>:null 
                  }
                  <Text style={props.dataParqueo.conectividad_net ? styles.statusOn : styles.statusOff}>
                      { props.dataParqueo.conectividad_net ? 'Conectado' : 'Sin conexión'}
                  </Text>

                  {
                    props.dataParqueo.reservaSave ? 
                    <Text style={styles.subtitle}>Tienes una reserva activa con qr {props.dataParqueo.qrReservado}</Text>:null
                  }
                </View>
                
            </View>

            {
              
              <>
              <View>
                <View style={{
                      width: Dimensions.get('window').width,
                      height: 'auto',
                      backgroundColor: Colors.$blanco,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                }}>

                    <View style={{
                      width: Dimensions.get('window').width,
                      height: 'auto',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      backgroundColor: Colors.$parqueo_color_fondo
                    }}>
                        <Text style={{
                          fontFamily: Fonts.$poppinsregular,
                          color: Colors.$parqueo_color_texto_50,
                          fontSize: 18,
                          width: Dimensions.get('window').width*.8,
                          textAlign: 'center',
                        }}>
                          { props.dataParqueo.conectividad_net ?
                          ' Ubica el código QR que deseas escanear en el recuadro' 
                          :
                          'No tienes conexión a internet, no puedes escanear el QR. Ingresa el código de forma manual'}
                        </Text>
                    </View>

                    <View style={{
                        height: Dimensions.get('window').width,
                        width: Dimensions.get('window').width,
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: Colors.$parqueo_color_fondo
                    }}>
                      

                      {
                        <View style={stylesQR.container}>
                              {isScanning ? (
                              <View style={{ flex: 1}}>
                                {
                                  props.dataParqueo.conectividad_net ?
                                    <Camera
                                    ref={cameraRef}
                                    style={{ flex: 1 }}
                                    cameraType={CameraType.Back}
                                    flashMode="auto"
                                    scanBarcode={true}
                                    onReadCode={handleReadCode}
                                    showFrame={false}
                                    laserColor="red"
                                    frameColor="white"
                                  />:null
                                }
                                {/* Marco verde de ayuda visual */}
                                <View style={{
                                  position: 'absolute',
                                  top: '10%',
                                  left: '10%',
                                  width: '80%',
                                  height: '80%',
                                  borderWidth: 4,
                                  borderRadius: 10,
                                  borderColor: Colors.$parqueo_color_primario
                                }} />
                              </View>
                            ) : (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.$parqueo_color_fondo}}>
                                
                                <Pressable
                                  onPress={() => setIsScanning(true) } 
                                  style={{
                                    width: "60%",
                                    height: "10%",
                                    borderRadius: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: Colors.$parqueo_color_secundario,
                                    marginBottom: 10
                                  }}
                                > 
                                  <Text style={{ 
                                    fontFamily: Fonts.$poppinsregular, 
                                    color: Colors.$parqueo_color_fondo, 
                                    fontSize: 18,
                                    textAlign: 'center',

                                    }}>Scanear nuevamente</Text>
                                </Pressable>
                              </View>
                            )}
                        </View>
                      }

                    </View>
                </View>

                <View style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height*.1,
                  backgroundColor: Colors.$parqueo_color_fondo,
                  marginBottom: 20,
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  marginTop: 20,
                  marginBottom: 20
                }}>
      
                  <Pressable
                    onPress={() => setAbrirModalQR(true) } 
                    style={{
                      width: "60%",
                      height: "80%",
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center"

                    }}
                  > 
                    <Text style={{ 
                      fontFamily: Fonts.$poppinsregular, 
                      color: Colors.$parqueo_color_texto_50, 
                      fontSize: 20}}>Ingresa QR Manual</Text>
                  </Pressable>
                </View>

              </View> 
              </>
              
            }      
             
            
          </View>
        </View>
        </KeyboardAwareScrollView>
      </View>
    );  
  }
}

const stylesQR = StyleSheet.create({
  container: {
    flex:1
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

const styles_tyc = StyleSheet.create({
  cajaTyC: {
    backgroundColor: Colors.$blanco,
    width: Dimensions.get('window').width*.9,
    height: Dimensions.get('window').height*.8,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  cajaTituloCerrar: {
    width: Dimensions.get('window').width*.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textTitleTyC: {
    width: Dimensions.get('window').width*.5,
    textAlign: 'center', 
    fontSize : 18, 
    fontFamily : Fonts.$poppinsmedium,
    alignItems: "center",
    color: Colors.$texto,
  },
  iconBici: {
    width: 50,
    height: 50,
    zIndex: 100
  },
  LineaHorizontal: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.$texto,
    marginTop: 10,
    marginBottom: 10
  },
  cajaScrool:{
    width: "100%",
    height: "60%",
  },
  cajaAceptarContinuar:{
    width: "90%",  
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20
  },
  CajaHorCenter:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  cajaContinuar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  btnCheck: {
    width: 20,
    height: 20,
    borderWidth : 3,
    borderColor : Colors.$texto,
    borderRadius : 1,
    marginRight: 5
  },
  btnCheckOK: {
    width: 20,
    height: 20,
    borderWidth : 3,
    borderColor : Colors.$texto,
    borderRadius : 1,
    backgroundColor: Colors.$adicional,
    marginRight: 5
  },
  buttonTyC: {
    width: "60%",
    height: 30,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    zIndex: 100,
    borderRadius: 15,
  },
  textoTyC: {
    fontFamily: Fonts.$poppinsregular, 
    textAlign: "center", 
    justifyContent: "center",
    fontSize: 20, 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: Colors.$blanco,
  },
});

const styles = StyleSheet.create({
    statusOff: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsmedium,
        marginBottom: 10,
        color: Colors.$parqueo_color_primario,
    },
    statusOn: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsmedium,
        marginBottom: 10,
        color: Colors.$parqueo_color_adicional_50,
    },
    contenedor: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      alignItems: "center",
      justifyContent: "space-around",
      position: 'relative',
      backgroundColor: Colors.$parqueo_color_fondo,
    },
    cajaAnimacion: {
      width: Dimensions.get('window').width,
      height: 250,
    },
    imgFondo: {
      flex: 1,
      width: '100%', 
      justifyContent: 'center',
    },
    gif: {
      width: Dimensions.get('window').width,
      height: 250, 
    },
    cajaCabeza: {
      justifyContent: 'center',
      alignItems: 'flex-end', 
      borderRadius: 1,
      width: Dimensions.get('window').width,
      height: 140,
      zIndex: 10000,
      flexDirection: 'row',
      position: 'relative',
      top: 0,
      backgroundColor: Colors.$parqueo_color_fondo
    },
    titulo: {
      fontFamily: Fonts.$poppinsmedium, 
      fontSize: 24, 
      color: Colors.$parqueo_color_texto,
      alignItems: 'center',
      textAlign: 'flex-start',
      justifyContent: 'center',
      width: '80%',
    },
    subtitle: {
        fontFamily: Fonts.$poppinsregular,
        width: Dimensions.get('window').width*.7,
        fontSize: 16,
        textAlign: 'left',
        color: Colors.$parqueo_color_texto_80,
    },
    logoGif: {
      width: 120,
      height: 120,
      zIndex: 100
    },
    textTitle: {
      marginTop: 20, 
      marginBottom: 20, 
      fontSize : 25, 
      fontFamily : Fonts.$poppinsmedium,      
      alignSelf: "center",
      color: 'white',
    },
    btnAtras:{
      position: 'absolute',
      top: 20, 
      left: 10,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      zIndex: 100
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    containerButtons : {
      marginTop: 15, 
      marginBottom: 15, 
      alignSelf: 'center',
    },
    
    button : { 
      width: Dimensions.get('window').width*.5,
      textAlignVertical : 'bottom',
      padding  : 8,
      backgroundColor : Colors.$primario,
      borderRadius : 50,
      shadowColor: "#000",
      shadowOffset: {
        width: 5,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 8,
    },
    
    textButton : {
      fontFamily: Fonts.$poppinsmedium, 
      fontSize: 20, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: 'white',
      color: Colors.$blanco,
      alignSelf: "center",
      width: '80%',
      textAlign: 'center',
    },
    textLiberar2: {
        fontSize: 20,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
    },
    btnSI: {
        width: 200,
        height: 50,
        borderRadius: 40,
        padding: 5,
        backgroundColor: Colors.$parqueo_color_primario,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
});

const styles_qr = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    fontFamily: Fonts.$poppinsregular
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  textBold: {
    color: '#000',
    fontFamily: Fonts.$poppinsregular
  },
  buttonText: {
    fontSize: 13,
    color: '#fff',
    textAlign: "center",
    fontFamily: Fonts.$poppinsregular
  },
  buttonTouchable: {
    flex: 0.3,
    padding: 14,
    backgroundColor: Colors.$primario,
    borderRadius: 30,
    justifyContent: "center",
  },
  buttonTouchable2: {
    padding: 14,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    justifyContent: "center",
  },
  buttonText2: {
    fontSize: 18,
    color: '#000',
    textAlign: "center",
    fontFamily: Fonts.$poppinsregular
  },
  fixToText: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topContainer: {
    marginHorizontal: 10,
    flexDirection: "row",
    zIndex: 1000
  },
  buttonBack: {
    flex: 0.15,
    padding: 10,
    backgroundColor: Colors.$primario,
    borderRadius: 30,
    fontFamily: Fonts.$poppinsregular
  },
  buttonQr: {
    flex: 0.3,
    padding: 15,
    backgroundColor: Colors.$primario,
    borderRadius: 30,
    marginTop: 30,
    justifyContent: 'center',
    fontFamily: Fonts.$poppinsregular
  },
  buttonQr2: {
    flex: 0.3,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 30,
    marginTop: 30,
    justifyContent: 'center',
    fontFamily: Fonts.$poppinsregular
  },
  modalStyle: {
    borderRadius: 20, 
    marginVertical: 200, 
    marginHorizontal: 25, 
    justifyContent: "space-around", 
    alignItems: "center", 
    position: "relative", 
    backgroundColor: Colors.$parqueo_color_fondo, 
    height: 'auto', 
    width: 'auto',
    padding:20
  },
  buttonClose: {
    flex: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderRadius: 25,
    right: 10,
    top: 10,
    zIndex: 100,
    backgroundColor: Colors.$parqueo_color_fondo
  },
  mainContainer: {
    flex: 1,
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: Dimensions.get('window').width*.8,
    width: Dimensions.get('window').width*.8,
    borderColor: Colors.$primario,
    backgroundColor: 'transparent',
    borderRadius: 15,
    borderWidth: 5
  },
  textRectangle: {
    flex: 1,
    height: 50,
    color: Colors.$Texto,
    fontSize: 20,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: Fonts.$poppinsregular
  }
});


function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    dataParqueo: state.reducerParqueadero,
    perfil: state.reducerPerfil
  }
}
export default connect(mapStateToProps)(Rentar_parqueadero);
