
import * as React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
//import { createAppContainer, createSwitchNavigator } from '@react-navigation/native';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  Image
} from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerContentScrollView, createDrawerNavigator } from '@react-navigation/drawer';
import Colors from './Themes/Colors';
import Images from './Themes/Images';
import Fonts from './Themes/Fonts';
import othersReducer from './reducers/othersReducer';
import { horizontalScale, moderateScale, verticalScale } from './Themes/Metrics';
import { AuthContext } from './AuthContext';
import { Dimensions } from 'react-native';
import { Estrellas } from './Components/carpooling/Estrellas'
import { connect, useDispatch } from 'react-redux';
import { getempresa, getDesafios, getLogros, getLogrosProgreso, getDesafiosProgreso } from './actions/actionPerfil'
import {
  entrando_modulo
} from './actions/actions3g';
import { save_token_msn, ask_practice, ask_theoretical } from './actions/actionCarpooling';
import { conectividad, validate_qr } from './actions/actionParqueadero';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
//screen 5G
import ForgotPasswordScreen from './Containers/Screens/ForgotPasswordScreen';
import TripScreen from './Containers/Screens/TripScreen';
import FinishingScreen from './Containers/Screens/FinishingScreen';
import VerificationsScreent from './Containers/Screens/VerificationsScreent';
import { RestorePasswordScreen } from './Containers/Screens/RestorePasswordScreen';
import ProfileScreen from './Containers/Screens/ProfileScreen';
import LegalScreen from './Containers/Screens/LegalScreen';
import TutorialScreen from './Containers/Screens/TutorialScreen';
import TripEndScreen from './Containers/Screens/TripEndScreen';
import NewTicketScreen from './Containers/Screens/NewTicketScreen';
import SettingsScreen from './Containers/Screens/SettingsScreen';
import SupportScreen from './Containers/Screens/SupportScreen';

import LoginScreen from './Containers/Screens/LoginScreen';
import PhotoScreen from './Containers/Screens/PhotoScreen';
import PhoneScreen from './Containers/Screens/PhoneScreen';
import RegisterScreen from './Containers/Screens/RegisterScreen';
import TermsScreen from './Containers/Screens/TermsScreen';
import HomeScreen from './Containers/Screens/HomeScreen';
import QrCodeScreen from "./Containers/Screens/QrCodeScreen";
import BluetoothScreen from "./Containers/Screens/BluetoothScreen";
import DrawerHomeScreen from './Containers/Screens/DrawerHomeScreen';
import travelExperienceScreen from './Containers/Screens/travelExperienceScreen';
import IsLoginScreen from './Containers/Screens/IsLoginScreen';
import ButtonSignOffComponent from './Components/ButtonSignOffComponent';
import FaqScreen from './Containers/Screens/FaqScreen';
// Screen integracion 3G
//import Reservas3GScreen from './Containers/Screens/Reservas3GScreen';
import InfoPersonalScreen from './Containers/Reservas3G/InfoPersonalScreen';
import Reservar3GScreen from './Containers/Reservas3G/Reservar3GScreen';
import Rentar3GScreen from './Containers/Reservas3G/Rentar3GScreen';
import RentarActivaScreen from './Containers/Reservas3G/RentarActivaScreen';
//import Finalizar3GScreen from './Containers/Reservas3G/Finalizar3GScreen';
import Ayuda3GScreen from './Containers/Reservas3G/Ayuda3GScreen';
import Home3G from './Containers/Reservas3G/Home3G';

// Registro extendido
import RegisterUI from './Containers/RegisterExt/RegisterUI';
import RegisterViewScreen_1 from './Containers/RegisterExt/RegisterViewScreen_1';
import RegisterViewScreen_2 from './Containers/RegisterExt/RegisterViewScreen_2';
import RegisterViewScreen_3 from './Containers/RegisterExt/RegisterViewScreen_3';
import RegisterViewScreen_4 from './Containers/RegisterExt/RegisterViewScreen_4';
import RegisterViewScreen_5 from './Containers/RegisterExt/RegisterViewScreen_5';
import RegisterViewScreen_6 from './Containers/RegisterExt/RegisterViewScreen_6';

//Vehículo partícular
import CargarDataUserVPScreen from './Containers/privateVehicle/CargarDataUserVPScreen';
import MyVehiclesScreen from './Containers/privateVehicle/MyVehiclesScreen';
import RegisterVehicleScreen from './Containers/privateVehicle/RegisterVehicleScreen';
import TransPublicScreen from './Containers/privateVehicle/TransPublicScreen';
import AvionScreen from './Containers/privateVehicle/AvionScreen';
import StartTripScreen from './Containers/privateVehicle/StartTripScreen';
import TestExperienceScreen from './Containers/privateVehicle/TestExperienceScreen';
import ValidarQrScreen from './Containers/privateVehicle/ValidarQrScreen';
//Historial
import HistorialScreen from './Containers/Perfil/HistorialScreen';
//carpooling
import CarpoolingHome from './Containers/Carpooling/CarpoolingHome';
import CarpoolingDriverTrips from './Containers/Carpooling/CarpoolingItinerario';
import CarpoolingAddTrip from './Containers/Carpooling/CarpoolingAddTrip';
import CarpoolingEditTrip from './Containers/Carpooling/CarpoolingEditTrip';
import CarpoolingMapView from './Containers/Carpooling/CarpoolingMapView';
import CarpoolingRegisterVeh from './Containers/Carpooling/CarpoolingRegisterVeh';
import CarpoolingTripRider from './Containers/Carpooling/CarpoolingTripRider';
import CarpoolingApplication from './Containers/Carpooling/CarpoolingApplication';
import CarpoolingTripInProcess from './Containers/Carpooling/CarpoolingTripInProcess';
import CarpoolingTripInProcessPasajero from './Containers/Carpooling/CarpoolingTripInProcessPasajero';
import CarpoolingDetallesTrip from './Containers/Carpooling/CarpoolingDetallesTrip';
import CarpoolingExperience from './Containers/Carpooling/CarpoolingExperience';
import CarpoolingExperienceRide from './Containers/Carpooling/CarpoolingExperienceRide';
import CarpoolingEndRide from './Containers/Carpooling/CarpoolingEndRide';
import CarpoolingSolicitudesRider from './Containers/Carpooling/CarpoolingHistorial';
import CarpoolingChat from './Containers/Carpooling/CarpoolingChat';
import CarpoolingPush from './Containers/Carpooling/CarpoolingPush';
import CarpoolingIndications from './Containers/Carpooling/CarpoolingIndications';
import CarpoolingSolicitudesViaje from './Containers/Carpooling/CarpoolingSolicitudesViaje';
import CarpoolingSupport from './Containers/Carpooling/CarpoolingSupport';
import TheoreticalTest from './Containers/Tests/TheoreticalTest';
import TestResult from './Containers/Tests/TestResult';
import ScheduleTest from './Containers/Tests/ScheduleTest';
//electrohub
import Home_electrohub from './Containers/ElectroHub/Home_electrohub';
import MyVEL from './Containers/ElectroHub/MyVEL';
import Horas from './Containers/ElectroHub/Horas';
import RegisterVEL from './Containers/ElectroHub/RegisterVEL';
import ParqueoActivo from './Containers/ElectroHub/ParqueoActivo';
import Reservar_parqueo from './Containers/ElectroHub/Reservar_parqueo';
import Rentar_parqueo from './Containers/ElectroHub/Rentar_parqueo';
import Calificar_parqueo from './Containers/ElectroHub/Calificar_parqueo';

//Parqueaderos
import Home_parqueadero from './Containers/Parqueaderos/Home_parqueadero';
import MyVEL_parqueadero from './Containers/Parqueaderos/MyVEL_parqueadero';
import RegisterVEL_parqueadero from './Containers/Parqueaderos/RegisterVEL_parqueadero';
import ParqueoActivo_parqueadero from './Containers/Parqueaderos/ParqueoActivo_parqueadero';
import Reservar_parqueadero from './Containers/Parqueaderos/Reservar_parqueadero';
import Rentar_parqueadero from './Containers/Parqueaderos/Rentar_parqueadero';
import Calificar_parqueadero from './Containers/Parqueaderos/Calificar_parqueadero';
//Perfil
import PerfilHome from './Containers/Perfil/PerfilHome';
import MisViajes from './Containers/Perfil/MisViajes';
import Recompensas from './Containers/Perfil/Recompensas';
import Catalogo from './Containers/Perfil/Catalogo';
import ConfiguracionPerfil from './Containers/Perfil/ConfiguracionPerfil';
import Referidos from './Containers/Perfil/Referidos';
import SupportPerfil from './Containers/Perfil/SupportPerfil';
//4g
import Home4G from './Containers/Movilidad4G/Home4G';
import Reservar4G from './Containers/Movilidad4G/Reservar4G';
import Vehiculos4G from './Containers/Movilidad4G/Vehiculos4G';
import IoT from './Containers/Movilidad4G/IoT';
import RentaActiva from './Containers/Movilidad4G/RentaActiva';
//import Finalizar4G from './Containers/Movilidad4G/Finalizar4G';
//Viaje activo
import ViajeActivo from './Containers/ViajeActivo/ViajeActivo';
import FinalizarViaje from './Containers/ViajeActivo/FinalizarViaje';
import TestAutoComplete from './Containers/Carpooling/TestAutoComplete';

function RootContainer(props) {

  const dispatch = useDispatch();

  const { isLogin, token, infoUser } = useContext(AuthContext);
  const [_perfil, set_perfil] = useState(false);
  const [_recompensas, set_recompensas] = useState(false);
  const [_3G, set_3G] = useState(false);
  const [_4G, set_4G] = useState(false);
  const [_5G, set_5G] = useState(false);
  const [_parquadero, set_parquadero] = useState(false);
  const [_electrohub, set_electrohub] = useState(false);
  const [_carro_compartido, set_carro_compartido] = useState(false);
  const [_ruta_corporativa, set_ruta_corporativa] = useState(false);
  const [_vehiculo_particular, set_vehiculo_particular] = useState(false);

  const [correoInt, setCorreoInt] = useState('');
  const [logoDoc, setLogoDoc] = useState('');
  const [nombreUser, setNombreUsers] = useState('');
  const [calificacion, setCalificacion] = useState('');


  useEffect(() => {
    if (props.dataCarpooling.promedioCargado) {
      setCalificacion(props.dataCarpooling.calificacionPromedioUser);
    }
  }, [props.dataCarpooling.promedioCargado])

  useEffect(() => {
    if (props.perfil.empresaCargadas) {
      //console.log('la datade la empresa dasdasdasdasdasdasdsadasdasdasd', props.perfil.dataempresa)
      set_perfil(props.perfil.dataempresa[0]._perfil === 'ACTIVO' ? true : false);
      set_recompensas(props.perfil.dataempresa[0]._recompensas === 'ACTIVO' ? true : false);
      set_3G(
        props.perfil.dataempresa[0]._3G === 'ACTIVO' ||
          props.perfil.dataempresa[0]._3G === 'ACTIVO+RESERVAS' ||
          props.perfil.dataempresa[0]._3G === 'ACTIVO-RESERVAS' ?
          true : false
      );
      set_4G(props.perfil.dataempresa[0]._4G === 'ACTIVO' ? true : false);
      set_5G(props.perfil.dataempresa[0]._5G === 'ACTIVO' ? true : false);
      set_electrohub(props.perfil.dataempresa[0]._electrohub === 'ACTIVO' || props.perfil.dataempresa[0]._electrohub === 'ACTIVO+SALDO' ? true : false);
      set_parquadero(props.perfil.dataempresa[0]._parquadero === 'ACTIVO' || props.perfil.dataempresa[0]._parquadero === 'ACTIVO+SALDO' ? true : false);
      set_carro_compartido(
        props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO' ||
          props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO-PAGOS' ||
          props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ? true : false);
      set_ruta_corporativa(props.perfil.dataempresa[0]._ruta_corporativa === 'ACTIVO' ? true : false);
      set_vehiculo_particular(props.perfil.dataempresa[0]._vehiculo_particular === 'ACTIVO' ? true : false);
    }
  }, [props.perfil.empresaCargadas])


  const getIsSignedIn = () => {
    return isLogin;
  };

  const tokenSaved = useRef(false); // 🔒 Evitar múltiples dispatches

  useEffect(() => {
    let checkTokenInterval = null;
    let timeoutId = null;

    const checkAndSaveToken = async () => {
      try {
        // Verificar si ya se guardó
        if (tokenSaved.current) {
          return true;
        }

        const user = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('tokenMSN');

        // Validar que ambos existan y sean válidos
        if (user && token) {
          try {
            const userData = JSON.parse(user);
            const tokenData = JSON.parse(token);

            if (userData.idNumber && tokenData.token) {
              console.log('✅ Token MSN detectado, iniciando guardado en DB...');

              // Marcar como guardado antes de despachar
              tokenSaved.current = true;

              console.log('✈️ Despachando acción save_token_msn()...');
              dispatch(save_token_msn());

              // Detener el intervalo
              if (checkTokenInterval) {
                clearInterval(checkTokenInterval);
              }
              if (timeoutId) {
                clearTimeout(timeoutId);
              }

              return true;
            }
          } catch (parseError) {
            console.error('❌ Error parseando datos:', parseError);
          }
        }

        return false;
      } catch (error) {
        console.error('❌ Error verificando token:', error);
        return false;
      }
    };

    // 🔄 Verificar cada 500ms
    let attempts = 0;
    checkTokenInterval = setInterval(() => {
      attempts++;
      if (attempts % 10 === 0) { // Cada 5 segundos
        console.log(`⏳ Esperando token MSN... (${attempts * 0.5}s)`);
      }
      checkAndSaveToken();
    }, 500);

    // ⏱️ Timeout de seguridad: detener después de 60 segundos
    timeoutId = setTimeout(() => {
      if (checkTokenInterval) {
        clearInterval(checkTokenInterval);
      }

      if (!tokenSaved.current) {
        console.warn('⚠️ Token MSN no encontrado después de 60 segundos');
        console.warn('⚠️ El usuario deberá reiniciar la app o el token se guardará en el próximo inicio');
      }
    }, 60000);

    // 🧹 Cleanup al desmontar
    return () => {
      if (checkTokenInterval) {
        clearInterval(checkTokenInterval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch]);

  const validarUserCorreo = async () => {
    const correo = infoUser.DataUser.email;
    await setCorreoInt(correo);
    await setLogoDoc(infoUser.DataUser.documents);
    await setNombreUsers(infoUser.DataUser.name)
    await dispatch(getempresa(correo));
    await dispatch(ask_practice());
    await dispatch(ask_theoretical());
    //dispatch(save_token_msn());
    //dispatch(conectividad(isConnected));
    //dispatch(getDesafios('ACTIVO'));
    //dispatch(getDesafiosProgreso(infoUser.DataUser.idNumber));
    //dispatch(getLogros('ACTIVO'));
    //dispatch(getLogrosProgreso(infoUser.idNumber));
  }

  const getTests = async (puntoDeEntrada, navigation) => {
    if (!props.didTheory) {
      navigation.navigate('TheoreticalTest');
      return;
    }
    if (!props.didPractice) {
      navigation.navigate('ScheduleTest');
      return;
    }

    if (props.didTheory && props.didPractice) {
      if (puntoDeEntrada === 'Home3G') {
        console.log('entrando al módulo 3g');
        dispatch(entrando_modulo());
      }
      navigation.navigate(puntoDeEntrada);
    }
  }

  /*const sincronizarQRs = async () => {
    const pendientes = JSON.parse(await AsyncStorage.getItem('qr_pendientes')) || [];
    if (pendientes.length === 0) {
      //Alert.alert('Modo Offline','No tiene ningún pendiente para guardar');
      return;
    }

    for (let qr of pendientes) {
      try {
        Alert.alert(
            "Reserva activa",
            "Tienes el lugar" + qr.lugar + " con QR " + qr.qr,
            [
                {
                    text: "",
                    style: "cancel"
                },
                {
                    text: "Confirmar",
                    onPress: () => {}
                }
            ]
        );
        //await dispatch(validate_qr(qr.qr, qr.tipo, qr.modo));
        // Si fue exitoso, elimínalo de la lista
        //pendientes.shift();
        //await AsyncStorage.setItem('qr_pendientes', JSON.stringify(pendientes));
      } catch (error) {
        console.log('Error sincronizando QR:', error);
        break; // Si falla, detenemos para reintentar luego
      }
    }
  };*/

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    if (infoUser) {
      validarUserCorreo();
      //sincronizarQRs();
    }
  }, [infoUser, isConnected])

  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState(null);
  //Validar conexión con internet
  const NetworkStatus = () => {

    useEffect(() => {
      // Suscribirse a los cambios de estado de red
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
        setConnectionType(state.type);
        dispatch(conectividad(state.isConnected));
      });

      // Limpiar la suscripción al desmontar
      return () => unsubscribe();
    }, []);

    return (
      <View style={styles.container}>
        {/*<Text style={styles.status}>
                {isConnected ? 'Conectado' : 'Sin conexión'}
            </Text>*/}
        {/*isConnected && (
                <Text style={styles.type}>
                Tipo de conexión: {connectionType}
                </Text>
            )*/}
      </View>
    );
  };

  // Authentication  
  const Drawer = createDrawerNavigator();
  const isSignedIn = getIsSignedIn();

  const MenuItem = ({ navigation }) => {
    return (
      <DrawerContentScrollView style={estilos.container}>
        {
          isSignedIn
            ?
            <View>
              <View style={estilos.logoBox}>
                <View style={estilos.cajaA}>
                  <Text style={estilos.texto1}>{nombreUser}</Text>
                  {/*<Estrellas calificacion={calificacion}/>*/}

                  {
                    _perfil ?
                      <Pressable
                        onPress={() => navigation.navigate('PerfilHome')}
                        style={estilos.botonVerPerfil}
                      >
                        <Text style={estilos.textPerfil}>Ver perfil</Text>
                      </Pressable> : null
                  }

                </View>
                <View style={estilos.cajaB}>
                  {
                    logoDoc !== '' ?
                      <Image
                        style={estilos.logo}
                        source={{ uri: logoDoc }}
                      />
                      :
                      <></>
                  }
                </View>
              </View >
              <View style={estilos.LineaHorizontal}></View>
              <Pressable
                onPress={() => navigation.navigate('Home')}
                style={estilos.botonItem}
              >
                <Text style={estilos.LineaVer}></Text>
                <Text style={estilos.textBoton}>Inicio</Text>
              </Pressable>

              {/*_5G && props.isValidatedPractise && props.isValidatedTheory ?
            <Pressable 
              onPress={()  => getTests('QrCodeScreen', navigation)}
              style={ estilos.botonItem }
            >
              <Text style={ estilos.textBoton }>Movilidad 5G</Text>
            </Pressable>
            :null
            */}

              {/*_4G && props.isValidatedPractise && props.isValidatedTheory ?
            <Pressable 
              onPress={()  => getTests('Home4G', navigation)}
              style={ estilos.botonItem }
            >
              <Text style={ estilos.textBoton }>Movilidad 4G</Text>
            </Pressable>
            :null
            */}

              {_3G ?
                (props.isValidatedPractise && props.isValidatedTheory ?
                  <Pressable
                    onPress={() => getTests('Home3G', navigation)}
                    style={estilos.botonItem}
                  >
                    <Text style={estilos.textBoton}>Movilidad 3G</Text>
                  </Pressable>
                  :
                  <View style={estilos.botonItem}>
                    <Text style={[estilos.textBoton, { color: 'gray', fontSize: 14 }]}>Movilidad 3G (Verificando...)</Text>
                  </View>
                )
                : null
              }
              {(!props.perfil.empresaCargadas) || ((_3G) && (!props.isValidatedPractise || !props.isValidatedTheory)) ?
                <Pressable
                  onPress={() => validarUserCorreo()}
                  style={[estilos.botonItem, { backgroundColor: '#f0f0f0', marginTop: 10, borderRadius: 10, alignSelf: 'center', width: '90%' }]}
                >
                  <Text style={[estilos.textBoton, { color: Colors.$primario, textAlign: 'center', paddingLeft: 0 }]}>🔄 Recargar módulos</Text>
                </Pressable>
                : null
              }

              {/*_carro_compartido ? 
            <Pressable 
              onPress={()  => navigation.navigate('CarpoolingHome')}
              style={ estilos.botonItem }
            >              
              <Text style={ estilos.textBoton }>Carro compartido {_carro_compartido}</Text>
            </Pressable>
            :
            <></>
            */}

              {/*_vehiculo_particular ?
            <Pressable 
              onPress={()  => navigation.navigate('MyVehiclesScreen')}
              style={ estilos.botonItem }
            >
              
              <Text style={ estilos.textBoton }>Vehículo particular {_vehiculo_particular}</Text>
            </Pressable>  
            :
            <></>
            */}

              {/*_electrohub ?
            <Pressable 
              onPress={()  => navigation.navigate('Home_electrohub')}
              style={ estilos.botonItem }
            >
              <Text style={ estilos.textBoton }>ElectroHub{_electrohub}</Text>
            </Pressable>
            :
            <></>
            */}

              {/*_parquadero ?
            <Pressable 
              onPress={()  => navigation.navigate('Home_parqueadero')}
              style={ estilos.botonItem }
            >
              <Text style={ estilos.textBoton }>Parqueaderos{_parquadero}</Text>
            </Pressable>
            :
            <></>
            */}

              {_perfil ?
                <Pressable
                  onPress={() => navigation.navigate('Referidos')}
                  style={estilos.botonItem}
                >
                  <Text style={estilos.textBoton}>Referidos</Text>
                </Pressable> : null
              }

              <Pressable
                onPress={() => navigation.navigate('Soporte')}
                style={estilos.botonItem}
              >
                <Text style={estilos.textBoton}>Soporte</Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate('Salir')}
                style={estilos.botonItem}
              >
                <Text style={estilos.textBoton}>Salir</Text>
              </Pressable>

              {/*<Pressable 
              onPress={()  => navigation.navigate('TestAutoComplete')}
              style={ estilos.botonItem }
            >              
              <Text style={ estilos.textBoton }>TestAutoComplete</Text>
            </Pressable>*/}

              {/*<NetworkStatus />*/}

            </View>
            :
            <></>
        }
      </DrawerContentScrollView>
    )
  }

  const estilos = StyleSheet.create({
    container: {
      backgroundColor: Colors.$blanco,
      paddingTop: 40,
    },
    logoBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5,
      marginBottom: 10,
    },
    cajaA: {
      width: "40%"
    },
    cajaB: {
      width: "50%",
      alignItems: 'center',
      justifyContent: 'center',
    },
    cajaC: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'orange',
    },
    texto1: {
      fontSize: 18,
      color: Colors.$texto,
      fontFamily: Fonts.$poppinsmedium
    },
    texto2: {
      width: 200,
      fontSize: 16,
      color: Colors.$texto,
      fontFamily: Fonts.$poppinslight
    },
    botonVerPerfil: {
      alignItems: 'flex-start',
      //display: 'none'
    },
    textPerfil: {
      fontSize: 16,
      color: Colors.$texto,
      fontFamily: Fonts.$poppinsregular,
      marginTop: 5
    },
    botonItem: {
      backgroundColor: Colors.$blanco,
      width: "100%",
      textAlign: "center",
      justifyContent: "center",
      padding: 10,
      flexDirection: 'row'
    },
    textBoton: {
      flex: 1,
      fontSize: 18,
      color: Colors.$texto,
      paddingTop: 5,
      paddingLeft: 10,
      fontFamily: Fonts.$poppinsregular
    },
    LineaVer: {
      width: 5,
      height: 40,
      backgroundColor: Colors.$texto
    },
    LineaHorizontal: {
      width: "80%",
      height: 5,
      backgroundColor: Colors.$texto,
      marginLeft: 10,
      marginBottom: 15
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50
    },
  });

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    status: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'black',
    },
    type: {
      fontSize: 14,
      color: 'gray',
    },
  });

  return (
    <Drawer.Navigator
      drawerContent={(props) => < MenuItem {...props} />}
    >
      {isSignedIn ? (
        <>
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerStyle: {
                backgroundColor: Colors.$primario,
              },
              headerTintColor: '#fff',
            }}
          />
          <Drawer.Screen name="QrCodeScreen" component={QrCodeScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="BluetoothScreen" component={BluetoothScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Reservar" component={Reservar3GScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Rentar" component={Rentar3GScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="RentarActiva" component={RentarActivaScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Home3G" component={Home3G} options={{ headerShown: false }} />
          {/*<Drawer.Screen name="Finalizar3GScreen" component={Finalizar3GScreen} options={{ headerShown: false }}/>*/}
          <Drawer.Screen name="Ayuda3GScreen" component={Ayuda3GScreen} options={{ headerShown: false }} />
          {/*<Drawer.Screen name="Ajustes" component={SettingsScreen} />*/}
          <Drawer.Screen name="Soporte" component={SupportScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Salir" component={ButtonSignOffComponent} options={{ headerShown: false }} />
          <Drawer.Screen name="FaqScreen" component={FaqScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="NewTicketScreen" component={NewTicketScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="travelExperienceScreen" component={travelExperienceScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="TripScreen" component={TripScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="TripEndScreen" component={TripEndScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="FinishingScreen" component={FinishingScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="VerificationsScreent" component={VerificationsScreent} options={{ headerShown: false }} />
          <Drawer.Screen name="MyVehiclesScreen" component={MyVehiclesScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterVehicleScreen" component={RegisterVehicleScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="TransPublicScreen" component={TransPublicScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="AvionScreen" component={AvionScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="StartTripScreen" component={StartTripScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="TestExperienceScreen" component={TestExperienceScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="ValidarQrScreen" component={ValidarQrScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="CargarDataUserVPScreen" component={CargarDataUserVPScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="HistorialScreen" component={HistorialScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingHome" component={CarpoolingHome} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingDriverTrips" component={CarpoolingDriverTrips} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingAddTrip" component={CarpoolingAddTrip} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingEditTrip" component={CarpoolingEditTrip} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingMapView" component={CarpoolingMapView} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingRegisterVeh" component={CarpoolingRegisterVeh} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingTripRider" component={CarpoolingTripRider} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingApplication" component={CarpoolingApplication} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingTripInProcess" component={CarpoolingTripInProcess} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingTripInProcessPasajero" component={CarpoolingTripInProcessPasajero} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingDetallesTrip" component={CarpoolingDetallesTrip} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingExperience" component={CarpoolingExperience} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingExperienceRide" component={CarpoolingExperienceRide} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingEndRide" component={CarpoolingEndRide} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingSolicitudesRider" component={CarpoolingSolicitudesRider} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingSolicitudesViaje" component={CarpoolingSolicitudesViaje} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingChat" component={CarpoolingChat} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingPush" component={CarpoolingPush} />
          <Drawer.Screen name="CarpoolingIndications" component={CarpoolingIndications} options={{ headerShown: false }} />
          <Drawer.Screen name="CarpoolingSupport" component={CarpoolingSupport} options={{ headerShown: false }} />
          <Drawer.Screen name="Home_electrohub" component={Home_electrohub} options={{ headerShown: false }} />
          <Drawer.Screen name="ParqueoActivo" component={ParqueoActivo} options={{ headerShown: false }} />
          <Drawer.Screen name="MyVEL" component={MyVEL} options={{ headerShown: false }} />
          <Drawer.Screen name="Horas" component={Horas} options={{ headerShown: false }} />
          <Drawer.Screen name="Reservar_parqueo" component={Reservar_parqueo} options={{ headerShown: false }} />
          <Drawer.Screen name="Rentar_parqueo" component={Rentar_parqueo} options={{ headerShown: false }} />
          <Drawer.Screen name="Calificar_parqueo" component={Calificar_parqueo} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterVEL" component={RegisterVEL} options={{ headerShown: false }} />
          <Drawer.Screen name="PerfilHome" component={PerfilHome} options={{ headerShown: false }} />
          <Drawer.Screen name="SupportPerfil" component={SupportPerfil} options={{ headerShown: false }} />
          <Drawer.Screen name="MisViajes" component={MisViajes} options={{ headerShown: false }} />
          <Drawer.Screen name="Recompensas" component={Recompensas} options={{ headerShown: false }} />
          <Drawer.Screen name="Catalogo" component={Catalogo} options={{ headerShown: false }} />
          <Drawer.Screen name="Referidos" component={Referidos} options={{ headerShown: false }} />
          <Drawer.Screen name="ConfiguracionPerfil" component={ConfiguracionPerfil} options={{ headerShown: false }} />
          <Drawer.Screen name="Home4G" component={Home4G} options={{ headerShown: false }} />
          <Drawer.Screen name="Reservar4G" component={Reservar4G} options={{ headerShown: false }} />
          <Drawer.Screen name="Vehiculos4G" component={Vehiculos4G} options={{ headerShown: false }} />
          <Drawer.Screen name="IoT" component={IoT} options={{ headerShown: false }} />
          <Drawer.Screen name="RentaActiva" component={RentaActiva} options={{ headerShown: false }} />
          {/*<Drawer.Screen name="Finalizar4G" component={Finalizar4G} options={{ headerShown: false }}/>*/}
          <Drawer.Screen name="ViajeActivo" component={ViajeActivo} options={{ headerShown: false }} />
          <Drawer.Screen name="FinalizarViaje" component={FinalizarViaje} options={{ headerShown: false }} />
          <Drawer.Screen name="TheoreticalTest" component={TheoreticalTest} options={{ headerShown: false }} />
          <Drawer.Screen name="ScheduleTest" component={ScheduleTest} options={{ headerShown: false }} />
          <Drawer.Screen name="TestResult" component={TestResult} options={{ headerShown: false }} />
          <Drawer.Screen name="Home_parqueadero" component={Home_parqueadero} options={{ headerShown: false }} />
          <Drawer.Screen name="MyVEL_parqueadero" component={MyVEL_parqueadero} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterVEL_parqueadero" component={RegisterVEL_parqueadero} options={{ headerShown: false }} />
          <Drawer.Screen name="ParqueoActivo_parqueadero" component={ParqueoActivo_parqueadero} options={{ headerShown: false }} />
          <Drawer.Screen name="Reservar_parqueadero" component={Reservar_parqueadero} options={{ headerShown: false }} />
          <Drawer.Screen name="Rentar_parqueadero" component={Rentar_parqueadero} options={{ headerShown: false }} />
          <Drawer.Screen name="Calificar_parqueadero" component={Calificar_parqueadero} options={{ headerShown: false }} />
          <Drawer.Screen name="TestAutoComplete" component={TestAutoComplete} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Drawer.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="PhotoScreen" component={PhotoScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="PhoneScreen" component={PhoneScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Catalogo" component={Catalogo} options={{ headerShown: false }} />
          <Drawer.Screen name="TermsScreen" component={TermsScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="IsLoginScreen" component={IsLoginScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterUI" component={RegisterUI} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterViewScreen_1" component={RegisterViewScreen_1} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterViewScreen_2" component={RegisterViewScreen_2} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterViewScreen_3" component={RegisterViewScreen_3} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterViewScreen_4" component={RegisterViewScreen_4} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterViewScreen_5" component={RegisterViewScreen_5} options={{ headerShown: false }} />
          <Drawer.Screen name="RegisterViewScreen_6" component={RegisterViewScreen_6} options={{ headerShown: false }} />
        </>
      )}
    </Drawer.Navigator>
  );
}

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    othersReducer: state.othersReducer,
    loaderLogin: state.othersReducer.loaderLogin,
    dataCarpooling: state.reducerCarpooling,
    perfil: state.reducerPerfil,
    didPractice: state.reducerCarpooling.userPractise,
    didTheory: state.reducerCarpooling.userTheoretical,
    isValidatedPractise: state.reducerCarpooling.userPractise_isValidated,
    isValidatedTheory: state.reducerCarpooling.userTheoretical_isValidated,
    activeSchedule: state.reducerCarpooling.activeSchedule
  }
}

export default connect(mapStateToProps)(RootContainer);
