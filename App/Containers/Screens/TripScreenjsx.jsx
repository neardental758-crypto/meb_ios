import {
  Alert,
  BackHandler,
  Button,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import Moment, { relativeTimeThreshold } from 'moment';
import {
  calculateTripTime,
  endCalculateTime,
  getActiveTrip,
  getPermissions,
  getStations,
  recordCoordinate,
  socketConection,
  startCalculateTime,
  validatePenalty,
} from '../../actions/actions';
import { verifyLockStatusTrip, setStatusLock } from '../../actions/tripActions';
import {
  appRideActions,
  verifyLockResume
} from '../../actions/rideActions';
import { getItem, setItem } from '../../Services/storage.service';
import Colors from '../../Themes/Colors';
import Geolocation from 'react-native-geolocation-service';
import { connect, useDispatch } from 'react-redux';
import { api } from '../../api/api.service';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Overlay from 'react-native-modal-overlay';
import styles from './Styles/GeneralBase.styles';
import ModalConfirmLock from '../../Components/ModalConfirmLock';
import ModalLoaderBluetooth from '../../Components/ModalLoaderBluetooth';
//import LottieView from 'lottie-react-native';
import * as RootNavigation from '../../RootNavigation';
import { useFocusEffect } from '@react-navigation/native';

const mapRef = React.createRef();

function TripScreen (props) {
  const dispatch = useDispatch();
  const [ state, setState ] = useState({
      socket: null,
      position: {
        lat: 4.66597713,
        lng: -74.05369725,
      },
      outOfScreen: false,
      animateTime: new Date(),
      isOpenBackgroundInfoModal: false,
      modalVisible: false,
    }) 

  useFocusEffect( 
    React.useCallback(() => { 
      Infocus()
    }, [])
  );

  const Infocus = () => {
    console.log('plataform', Platform.Version);
      if (Platform.OS === 'android') {
        console.log('Permisos background android')
        requestAndroidPermissions();
      }
      dispatch(calculateTripTime());
      dispatch(getPermissions());
      dispatch(getActiveTrip());
      dispatch(validatePenalty());
      dispatch(getStations(props.tripReducer.newTrip.organizacionId));
      setState({ ...state, outOfScreen: false });
      //props.socketConection(props);
      getPosition();
      dispatch(recordCoordinate(true));
      setTimeout(() => {
        dispatch(calculateTripTime());
      }, 1000);
  }

  const backAction = () => {
    dispatch(recordCoordinate(false));
    dispatch(calculateTripTime());
    setState({ ...state, outOfScreen: true });
  };

  useEffect(() => {
    console.log('componentWillUnmount desde tripScreen', props);
    console.log('el new trip ::', props.tripReducer.newTrip)
    console.log('estus lock en triScreen ', props.rideReducer.lock.lockStatus);
    console.log('loading bluetooth ', props.loadingBluetooth);
    console.log('lock Open 2 :: ', props.tripReducer.lockOpen);

    let dateLocation = new Date();
    setItem('lastLocationDate', dateLocation);
    setItem('appStateTrip', 'foreground');
  
    const watchId = Geolocation.watchPosition(
      (pos) => {
        changeRegion(pos.coords.latitude, pos.coords.longitude);
      },
      (e) => console.log('watch poistion error', e),
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
        distanceFilter: 1,
      },
    );
  }, []);

  const displayBackgroundInfoModal = (value) => {
    setState({ ...state, isOpenBackgroundInfoModal: value })
  }

  //Esto es lo que tiene que llamar el boton "Permitir del modal"
  const requestAndroidPermissions = async () => {
    displayBackgroundInfoModal(false);
    let version = Platform.Version;
    const backgroundgranted =
      await permissionsLocationBackgroundAndroid(version);
    console.log(backgroundgranted);
    if (backgroundgranted != PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        'Advertencia',
        'Para que podamos guardar tu ruta mientras no estás en la aplicación, necesitamos acceder a tu ubicación en segundo plano. Por favor, habilita la ubicación en segundo plano en tu dispositivo.',
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: async () =>
              await permissionsLocationBackgroundAndroid(version),
          },
        ],
      );
    }
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
          <View style={{ backgroundColor: "rgba(52, 52, 52, 0.9)", flexDirection: "column", flex: 1 }}>
            <View style={{ flex: 1, borderRadius: 6, marginVertical: '20%', marginHorizontal: 50, backgroundColor: "#fff", paddingHorizontal: 25 }}>
              <ScrollView>
                <View style={{ alignItems: 'center', marginTop: '10%' }}>
                  <Image style={{
                    width: 60,
                    height: 60,
                  }} source={Images.logoRuedaIbague} />

                  <Text style={{ textAlign: "center", color: "#818181", fontSize: 18, fontWeight: "700", marginTop: 20, fontFamily: Fonts.$montserratSemiBold }}>Acceso a tu ubicación</Text>
                  <Text style={{ textAlign: "center", color: "#818181", fontSize: 14, fontWeight: "200", marginTop: 20, fontFamily: Fonts.$montserratLight }}>Bicycle Capital quiere acceder a tu ubicación, incluso cuando la aplicación no está en uso</Text>
                  <Text style={{ textAlign: "center", color: "#818181", fontSize: 14, fontWeight: "200", marginTop: 20, fontFamily: Fonts.$montserratLight }}>Necesitamos acceso todo el tiempo a tu ubicación para poder registrar tu ruta con la bicicleta mientras tienes el dispositivo en tu bolsillo, y luego poder calcular los indicadores de tu viaje</Text>
                  <Image style={{
                    marginTop: 20,
                    width: 200,
                    height: 120,
                  }} source={Images.mapa} />

                  <View style={{
                    marginTop: 40,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}>
                    <View style={{ marginRight: 8 }}>
                      <Button
                        title="Cancelar"
                        color="#FFC300"
                        onPress={() => { displayBackgroundInfoModal(false) }}
                      />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                      <Button
                        title="Aprobar"
                        color="#FFC300"
                        onPress={() => { props.getPermissions(), displayBackgroundInfoModal(false) }}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    )
    //Abrir el modal de backgrund info

  }

  const permissionsLocationBackgroundAndroid = async (version) => {
    if (version >= 29) {
      console.log("version", version);
      const backgroundgranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Permisos de localización en segundo plano',
          message:
            'Para poder guardar los datos de tu ruta ' +
            'en segundo plano necesitamos acceder a tu ubicación siempre.',
          buttonNeutral: 'Pregúntame luego',
          buttonNegative: 'No',
          buttonPositive: 'Aceptar',
        },
      );
      return backgroundgranted;
    } else {
      console.log("version", version);
      const backgroundgranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permisos de localización en segundo plano',
          message:
            'Para poder guardar los datos de tu ruta ' +
            'en segundo plano necesitamos acceder a tu ubicación siempre.',
          buttonNeutral: 'Pregúntame luego',
          buttonNegative: 'No',
          buttonPositive: 'Aceptar',
        },
      );
      return backgroundgranted;
    }
  }

  const postBackgroundLocation = async (location) => {
    let state = await getItem('appStateTrip');
    console.log('state', state);
    if (state == 'background') {
      console.log('location back', location);
      let timeFromLast = 0;
      let dateLocation = new Date();
      let lastLocationDate = await getItem('lastLocationDate');
      lastLocationDate = new Date(lastLocationDate);
      console.log('dateLocation', dateLocation);
      console.log('lastLocationDateAA', lastLocationDate); /*  */
      timeFromLast = dateLocation - lastLocationDate;
      console.log('timeFromLast', timeFromLast);
      if (timeFromLast >= 5000) {
        await setItem('lastLocationDate', dateLocation);
        console.log('props.actualTrip', props.actualTrip);
        if (props.actualTrip) {
          let filter = {
            where: {
              userId: props.actualTrip.userId,
              state: 'active',
            },
          };
          let tripInfo = await api.get('/trips', filter);
          console.log('tripInfo', tripInfo);
          if (tripInfo.length > 0) {
            let data = {
              latitude: location.latitude + '',
              longitude: location.longitude + '',
              date: dateLocation,
              userId: props.actualTrip.userId,
              tripId: tripInfo[0].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            let response = await api.postData('coordinates', data);
            console.log('response', response);
          }
        }
      }
    }
  }

  useEffect (() =>{
    props.recordCoordinate(false);
    props.endCalculateTime();
    setState({ outOfScreen: true });
    getPosition();
  },[])

  const getPosition = () =>{
    console.log('Try to get position');
    Geolocation.getCurrentPosition(
      geoSuccess,
      geoFailed,
      geoSetup,
    );
  }

  const changeRegion = (lat, lng) => {
    if (!state.outOfScreen) {
      console.log(lat, lng);
      let location = {
        latitude: lat,
        longitude: lng,
      };
      if (Platform.OS == 'android') {
        postBackgroundLocation(location);
      }
      /*if (_mapView) {
        let currentTime = new Date();
        let diffAnimate = currentTime - state.animateTime;
        console.log('diffAnimate', diffAnimate);
        if ((diffAnimate) >= 10000) {
          setState({ animateTime: currentTime });
          _mapView.animateToCoordinate(
            {
              latitude: lat,
              longitude: lng,
            },
            1000,
          );
        }
      }*/
    }
  }

  // Get geo position setup
  geoSetup =
    Platform.OS == 'android'
      ? {
        enableHighAccuracy: true,
        timeout: 20000,
      }
      : {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 3600000,
      };

    // When get position is success, update state
    const geoSuccess = (positionActual) => {
      let { latitude, longitude } = positionActual.coords;
      // updating state
      setState({
        ...state,
        position: {
          lat: latitude,
          lng: longitude,
        },
      });
    };

    // When get geo position fail
    const geoFailed = (error) => {
      //Alert.alert('Error al obtener ubicación')
      props.getPermissions();
    };

    const routingSupport = () => {
      //BackgroundGeolocation.stop();

      //BackgroundGeolocation.removeAllListeners();
      setState({ outOfScreen: true });
      props.navigation.navigate('SupportScreen');
    };

    const closeModal = () => {
      console.log("Close Modal felipeee");
      setState({ modalVisible: false });
    };

    const openLockBluetooth = () => {
      console.log("Abrir candado openLockBluetooth", props.rideReducer.lock);
      //props.openBluetoothTrip(props.statusLock);
      //props.openBluetoothTrip(props.rideReducer.lock);
      dispatch(appRideActions.openBluetoothTrip(props.rideReducer.lock))
    }

    const openModal = () => {
      console.log("OpenModal");
      setState({ modalVisible: true });
    }

    const renderBluetoothLoading = () => {
      return (
        <Modal transparent={true}>
          <View
            style={{
              backgroundColor: '#FFC300',
              flexDirection: 'column',
              flex: 1,
            }}>
            <View
              style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 20,
                  marginTop: 20,
                  fontFamily: 'Aldo-SemiBold',
                  marginHorizontal: 20,
                }}>
                Abriendo tu candado por bluetooth...
              </Text>
             
            </View>
          </View>
        </Modal>
      );
    }

    const [ showModalConfirm, setShowModalConfirm] = useState(true);
    
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: Colors.$gray }]}>
        { props.tripReducer.lockOpen ? setShowModalConfirm(false) : <></> }
        { props.loadingBluetooth && props.tripReducer.lockOpen ? setShowModalConfirm(false) : <></> }
        { 
           
          <MapView
          ref={mapRef}
          loadingEnabled={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          showsUserLocation={true}
          provider={
            Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          style={{ flex: 1 }}
          initialRegion={{
            latitude: Number(4.690607565818499),
            longitude: Number(-74.09030915588183),
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          }}
          onMapReady={() => {
            setState({ paddingTop: 5 });
          }}>
          {props.stations.map((station) => {
            return (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: Number(station.latitude),
                  longitude: Number(station.longitude),
                }}
                description={'This is a marker in React Native'}>
                <View style={{ height: 30, width: 30, backgroundColor: station.electricBikes + station.mechanicBikes + station.cargoBikes == 0 ? "red" : "#FFC300", borderRadius: 100, justifyContent: "center" }}>
                  <Text style={{ textAlign: "center", color: station.electricBikes + station.mechanicBikes + station.cargoBikes == 0 ? "white" : "black" }}>{station.electricBikes + station.mechanicBikes + station.cargoBikes}</Text>
                </View>
                <Image
                  style={{ height: 40, width: 40, resizeMode: 'contain' }}
                  source={require('../../Resources/Images/garaje.png')}></Image>
                <Callout tooltip style={{ flex: 1, width: 250, height: 'auto', flexDirection: "column" }}>
                  <View style={{ flex: 1, padding: 10 }}>
                    <View style={{ flex: 0.4, backgroundColor: "#FFC300", borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: "center", paddingVertical: 10 }}>
                      <Text style={{ fontSize: 15, textAlign: "center",  color: "white" }}>{station.name}</Text>
                    </View>
                    <View style={{ flex: 0.7, backgroundColor: "#dfdfdf", paddingHorizontal: 20, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, paddingTop: 10, paddingBottom: 15 }}>
                      <Text style={{ fontSize: 10, textAlign: "left", color: "#282727" }}>Bicicletas disponibles: {station.electricBikes + station.mechanicBikes + station.cargoBikes ? station.cargoBikes : 0}</Text>
                      <Text style={{ fontSize: 10, textAlign: "left", color: "#282727" }}>Eléctricas {station.electricBikes}</Text>
                      <Text style={{ fontSize: 10, textAlign: "left", color: "#282727" }}>Mecánicas {station.mechanicBikes}</Text>
                      <Text style={{ fontSize: 10, textAlign: "left", color: "#282727" }}>De carga {station.cargoBikes ? station.cargoBikes : 0}</Text>
                      <Text style={{ fontSize: 10, textAlign: "left", color: "#282727" }}>Capacidad para {station.bikesCapacity} bicicletas</Text>
                      <Text style={{ fontSize: 10, textAlign: "left", color: "#282727" }}>Apertura: {Moment(station.openingTime).format("HH:mm a")}</Text>
                      <Text style={{ fontSize: 10, textAlign: "left", color: "#282727" }}>Cierre: {Moment(station.closingTime).format("HH:mm a")}</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        
        }
        <TouchableOpacity
          onPress={() => {
            backAction();
            
            //props.navigation.navigate('TripEndScreen');
            RootNavigation.navigate("TripEndScreen")
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            flex: 1,
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
          }}>
          <Image
            style={{ resizeMode: 'cover', width: '100%', height: '100%' }}
            source={require('../../Resources/Images/end.png')}></Image>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 100,
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
          }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                margin: 30,
                backgroundColor: Colors.$yellow,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <View
                style={{
                  flex: 0.4,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{ width: 15, height: 15, resizeMode: 'contain' }}
                  source={require('../../Resources/Images/clock.png')}></Image>
              </View>
              <View>
              <Text style={{ flex: 1, color: 'black' }}>
                {props.actualTripTime}
              </Text></View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                routingSupport();
              }}
              style={{
                flex: 1,
                flexDirection: 'row',
                margin: 30,
                backgroundColor: Colors.$texto,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{ width: 15, height: 15, resizeMode: 'contain' }}
                  source={require('../../Resources/Images/support.png')}></Image>
              </View>
              <View><Text style={{ flex: 1, color: 'white' }}>Soporte</Text></View>
              
            </TouchableOpacity>
          </View>
          <Overlay
            containerStyle={styles.overlay}
            visible={showModalConfirm}
            childrenWrapperStyle={styles.modalsContainer}
          >
            <ModalConfirmLock onOpenLock={openLockBluetooth} />
          </Overlay>
          {/* <Overlay
            containerStyle={styles.overlay}
            visible={showModalLoaderBluetooth}
            childrenWrapperStyle={styles.modalsContainer}
          >
            <ModalLoaderBluetooth onClosePress={closeModal} />
          </Overlay> */}
          {props.loadingBluetooth && renderBluetoothLoading()}
        </View>
      </SafeAreaView>
    );
  
}


function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    stations: state.mapReducer.stations,
    penalty: state.mapReducer.penalty,
    actualTrip: state.userReducer.actualTrip,
    actualTripTime: state.userReducer.actualTripTime,
    statusLock: state.tripReducer.statusLock,
    loadingBluetooth: state.rideReducer.loadingBluetooth,
    rideReducer: state.rideReducer,
    tripReducer: state.tripReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //getStations: (orgId) => dispatch(getStations(orgId)),
    //validatePenalty: () => dispatch(validatePenalty()),
    //getActiveTrip: () => dispatch(getActiveTrip()),
    //calculateTripTime: () => dispatch(calculateTripTime()),
    endCalculateTime: () => dispatch(endCalculateTime()),
    startCalculateTime: () => dispatch(startCalculateTime()),
    //getPermissions: () => dispatch(getPermissions()),
    recordCoordinate: (start) => dispatch(recordCoordinate(start)),
    //socketConection: (props) => dispatch(socketConection(props)),
    verifyLockResume: () => dispatch(verifyLockResume()),
    verifyLockStatusTrip: () => dispatch(verifyLockStatusTrip()),
    //setStatusLock: (statusLock) => dispatch(setStatusLock(statusLock)),
    //openBluetoothTrip: (lock) => dispatch(appRideActions.openBluetoothTrip(lock)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripScreen);
