import {
  Alert,
  BackHandler,
  Button,
  Dimensions,
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
  //recordCoordinate,
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
import React from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { api } from '../../api/api.service';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Overlay from 'react-native-modal-overlay';
import styles from './Styles/GeneralBase.styles';
import ModalConfirmLock from '../../Components/ModalConfirmLock';
import ModalLoaderBluetooth from '../../Components/ModalLoaderBluetooth';
import LottieView from 'lottie-react-native';
import * as RootNavigation from '../../RootNavigation';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundTask } from '../ViajeActivo/BackgroundTask';
import { Env } from "../../Utils/enviroments"; 

class TripScreen extends React.Component {
  _mapView;
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      position: {
        lat: 4.66597713,
        lng: -74.05369725,
      },
      outOfScreen: false,
      animateTime: new Date(),
      isOpenBackgroundInfoModal: false,
      modalVisible: false,
      abrirCandado: false,
      bikeInformation: null,
      terminando: false,
      iniciarRastreo: false,
    };
    this._mapView = React.createRef();
  }

  cargarinfo = async () => {
    try {
      const storedData = await AsyncStorage.getItem('bikeInfo');
      console.log('Stored Data:', storedData); // Log the raw data
      if (storedData) {
        const bicycleInfo = JSON.parse(storedData); // Parse the stored JSON string directly
        console.log('Bicycle Info:', bicycleInfo); // Log the parsed data
        this.setState({ bikeInformation: bicycleInfo });
        console.log('bike Info:', this.state.bikeInformation); //
      }
    } catch (error) {
      console.error('Error fetching bicycle data:', error);
      this.setState({ error: error.toString() });
    }
  }
  

  backAction = (): any => {
    //this.props.recordCoordinate(false);
    this.props.endCalculateTime();
    this.setState({ outOfScreen: true });
  };

  async componentDidMount() {

    console.log('componentWillUnmount desde tripScreen', this.props);
    console.log('el new trip ::', this.props.tripReducer.newTrip)
    console.log('estus lock en triScreen ', this.props.rideReducer.lock.lockStatus);
    console.log('loading bluetooth ', this.props.loadingBluetooth);
    console.log('lock Open 2 :: ', this.props.tripReducer.lockOpen);
    /*if (Env.modo === 'movil') {
      this.setState({ iniciarRastreo: true });
    }*/
    let dateLocation = new Date();
    setItem('lastLocationDate', dateLocation);
    setItem('appStateTrip', 'foreground');
      if (Platform.OS === 'android') {
        console.log('Permisos background android')
        //this.requestAndroidPermissions();
      }
      this.props.startCalculateTime();
      this.props.getPermissions();
      this.props.getActiveTrip();
      this.props.validatePenalty();
      this.props.getStations(this.props.tripReducer.newTrip.organizacionId);
      this.setState({ outOfScreen: false });
      //this.props.socketConection(this.props);
      this.getPosition();
      //this.props.recordCoordinate(true);
      setTimeout(() => {
        this.props.calculateTripTime();
      }, 1000);
    /*RootNavigation.navigate.addListener('focus', () => {
      console.log('plataform', Platform.Version);
      if (Platform.OS === 'android') {
        console.log('Permisos background android')
        this.requestAndroidPermissions();
      }
      this.props.startCalculateTime();
      this.props.getPermissions();
      this.props.getActiveTrip();
      this.props.validatePenalty();
      this.props.getStations(this.props.tripReducer.newTrip.organizacionId);
      this.setState({ outOfScreen: false });
      //this.props.socketConection(this.props);
      this.getPosition();
      this.props.recordCoordinate(true);
      setTimeout(() => {
        this.props.calculateTripTime();
      }, 1000);
    });*/
    const watchId = Geolocation.watchPosition(
      (pos) => {
        this.changeRegion(pos.coords.latitude, pos.coords.longitude);
      },
      (e) => console.log('watch poistion error', e),
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
        distanceFilter: 1,
      },
    );
  }

  displayBackgroundInfoModal(value) {
    this.setState({ isOpenBackgroundInfoModal: value })
  }

  //Esto es lo que tiene que llamar el boton "Permitir del modal"
  async requestAndroidPermissions() {
    this.displayBackgroundInfoModal(false);
    let version = Platform.Version;
    const backgroundgranted =
      await this.permissionsLocationBackgroundAndroid(version);
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
              await this.permissionsLocationBackgroundAndroid(version),
          },
        ],
      );
    }
  }

  openBackgroundInfoModal() {
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

                  <Text style={{ textAlign: "center", color: "#818181", fontSize: 18, fontWeight: "700", marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Acceso a tu ubicación</Text>
                  <Text style={{ textAlign: "center", color: "#818181", fontSize: 14, fontWeight: "200", marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Bicycle Capital quiere acceder a tu ubicación, incluso cuando la aplicación no está en uso</Text>
                  <Text style={{ textAlign: "center", color: "#818181", fontSize: 14, fontWeight: "200", marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Necesitamos acceso todo el tiempo a tu ubicación para poder registrar tu ruta con la bicicleta mientras tienes el dispositivo en tu bolsillo, y luego poder calcular los indicadores de tu viaje</Text>
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
                        onPress={() => { this.displayBackgroundInfoModal(false) }}
                      />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                      <Button
                        title="Aprobar"
                        color="#FFC300"
                        onPress={() => { this.props.getPermissions(), this.displayBackgroundInfoModal(false) }}
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



  async permissionsLocationBackgroundAndroid(version) {
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

  async postBackgroundLocation(location) {
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
        console.log('this.props.actualTrip', this.props.actualTrip);
        if (this.props.actualTrip) {
          let filter = {
            where: {
              userId: this.props.actualTrip.userId,
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
              userId: this.props.actualTrip.userId,
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

  componentWillUnmount() {
    //this.props.recordCoordinate(false);
    this.props.endCalculateTime();
    this.setState({ outOfScreen: true });
  }

  getPosition() {
    console.log('Try to get position');
    Geolocation.getCurrentPosition(
      this.geoSuccess,
      this.geoFailed,
      this.geoSetup,
    );
  }

  changeRegion(lat, lng) {
    if (!this.state.outOfScreen) {
      console.log(lat, lng);
      let location = {
        latitude: lat,
        longitude: lng,
      };
      if (Platform.OS == 'android') {
        this.postBackgroundLocation(location);
      }
      /*if (this._mapView) {
        let currentTime = new Date();
        let diffAnimate = currentTime - this.state.animateTime;
        console.log('diffAnimate', diffAnimate);
        if ((diffAnimate) >= 10000) {
          this.setState({ animateTime: currentTime });
          this._mapView.animateToCoordinate(
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
  geoSuccess = (positionActual) => {
    let { latitude, longitude } = positionActual.coords;
    // updating state
    this.setState({
      position: {
        lat: latitude,
        lng: longitude,
      },
    });
  };

  // When get geo position fail
  geoFailed = (error) => {
    //Alert.alert('Error al obtener ubicación')
    this.props.getPermissions();
  };

  routingSupport = () => {
    //BackgroundGeolocation.stop();

    //BackgroundGeolocation.removeAllListeners();
    this.setState({ outOfScreen: true });
    //this.props.navigation.navigate('SupportScreen');
    RootNavigation.navigate("Soporte")
  };

  closeModal = () => {
    console.log("Close Modal felipeee");
    this.setState({ modalVisible: false });
  };

  openLockBluetooth = () => {
    console.log("Abrir candado openLockBluetooth", this.props.rideReducer.lock);
    //this.props.openBluetoothTrip(this.props.statusLock);
    this.props.openBluetoothTrip(this.props.rideReducer.lock);
  }

  modoDispositivo = (value) => {
    if (value === 'movil') {
      this.setState({ iniciarRastreo: true });
    }
  } 

  openModal = () => {
    console.log("OpenModal");
    this.setState({ modalVisible: true });
  }

  renderBluetoothLoading() {
    return (
      <Modal transparent={true}>
        <View
          style={{
            backgroundColor: Colors.$blanco,
            flexDirection: 'column',
            flex: 1,
          }}>
          <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text
              style={{
                width: '60%',
                textAlign: 'center',
                color: Colors.$texto,
                fontSize: 20,
                marginTop: 20,
                fontFamily: Fonts.$poppinsregular,
                marginHorizontal: 20,
              }}>
              Abriendo tu candado por bluetooth...
            </Text>
            <LottieView
              style={{ 
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width,                
                marginTop: 20 }}
              source={require('../../Resources/Lotties/bicy_bluetooth.json')}
              autoPlay
              loop
            />
          </View>
        </View>
      </Modal>
    );
  }


  terminadoTrip = (valor) => {
    this.setState({ terminando: true });
    if(valor){
      this.backAction();
      RootNavigation.navigate("VerificationsScreent")
    }
  }

  render() {
    //let lock = this.props.statusLock['lockStatus'];
    let lock = this.props.rideReducer.lock.lockStatus;
    let lock2 = this.props.tripReducer.lockOpen;
    let showModalConfirm = (lock == "closed") ? true : false;
    let showModalLoaderBluetooth = this.props.loadingBluetooth;
    if (showModalConfirm && showModalLoaderBluetooth) {
      showModalConfirm = false;
    }
    if (lock2) {
      showModalConfirm = false;
    }
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: Colors.$gray }]}>

        {/*<MapView
          ref={(mapView) => {
            this._mapView = mapView;
          }}
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
            latitude: Number(this.state.position.lat),
            longitude: Number(this.state.position.lng),
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          }}
          onMapReady={() => {
            this.setState({ paddingTop: 5 });
          }}>
          {this.props.stations.map((station) => {
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
        </MapView>*/}
        <ScrollView>
        <BackgroundTask 
          terminadoTrip={this.terminadoTrip} 
          time={this.props.actualTripTime} 
          minutes={this.props.actualTripMinutes}
          iniciar={this.state.iniciarRastreo}
          modo={Env.modo}
        />

        {
          this.state.terminando ?
          <TouchableOpacity
            onPress={() => {
              this.backAction();
              
              //this.props.navigation.navigate('TripEndScreen');
              RootNavigation.navigate("TripEndScreen")
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              position: 'relative',
              alignSelf: 'center',
              padding: 10
            }}>
            <Image
              style={{ resizeMode: 'cover', width: '100%', height: '100%', borderRadius: 50, padding: 5 }}
              source={require('../../Resources/Images/end.png')}></Image>
          </TouchableOpacity>
          :
          <></>
        }
        
        <View
          style={{
            width: '100%',
            height: 100,
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
          }}>
          {/*<View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                margin: 30,
                backgroundColor: Colors.$reservada,
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
              <Text style={{ flex: 1, color: 'black' }}>
                {this.props.actualTripTime}
              </Text>
            </TouchableOpacity>
          </View>*/}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                this.routingSupport();
              }}
              style={{
                height: 'auto',
                width: 140,
                flexDirection: 'row',
                margin: 10,
                backgroundColor: Colors.$texto,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                padding: 5
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
              <Text style={{ 
                flex: 1,                 
                color: 'white',
                fontFamily: Fonts.$poppinsregular
              }}>Soporte</Text>
            </TouchableOpacity>
           {/* <TouchableOpacity
            onPress={() => {
              //this.setState({ abrirCandado: true })
              console.log('props rideruducer', this.cargarinfo() );
            }}
            >
              <Text>lock</Text>
            </TouchableOpacity>*/}
            
          </View>
          <Overlay
            containerStyle={styles.overlay}
            visible={showModalConfirm}
            childrenWrapperStyle={styles.modalsContainer}
          >
            <ModalConfirmLock onOpenLock={this.openLockBluetooth} modo={this.modoDispositivo}/>
          </Overlay>
          
          {/** para intentar volver abrir el candado por bluetooth */}
          <Overlay
            containerStyle={styles.overlay}
            visible={this.state.abrirCandado}
            childrenWrapperStyle={styles.modalsContainer}
          >
            <ModalConfirmLock onOpenLock={this.openLockBluetooth} />
          </Overlay>
          {/* <Overlay
            containerStyle={styles.overlay}
            visible={showModalLoaderBluetooth}
            childrenWrapperStyle={styles.modalsContainer}
          >
            <ModalLoaderBluetooth onClosePress={this.closeModal} />
          </Overlay> */}
          {this.props.loadingBluetooth && this.renderBluetoothLoading()}
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    stations: state.mapReducer.stations,
    penalty: state.mapReducer.penalty,
    actualTrip: state.userReducer.actualTrip,
    actualTripTime: state.userReducer.actualTripTime,
    actualTripMinutes: state.userReducer.actualTripMinutes,
    statusLock: state.tripReducer.statusLock,
    loadingBluetooth: state.rideReducer.loadingBluetooth,
    rideReducer: state.rideReducer,
    tripReducer: state.tripReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStations: (orgId) => dispatch(getStations(orgId)),
    validatePenalty: () => dispatch(validatePenalty()),
    getActiveTrip: () => dispatch(getActiveTrip()),
    calculateTripTime: () => dispatch(calculateTripTime()),
    endCalculateTime: () => dispatch(endCalculateTime()),
    startCalculateTime: () => dispatch(startCalculateTime()),
    getPermissions: () => dispatch(getPermissions()),
    //recordCoordinate: (start) => dispatch(recordCoordinate(start)),
    //socketConection: (props) => dispatch(socketConection(props)),
    verifyLockResume: () => dispatch(verifyLockResume()),
    verifyLockStatusTrip: () => dispatch(verifyLockStatusTrip()),
    setStatusLock: (statusLock) => dispatch(setStatusLock(statusLock)),
    openBluetoothTrip: (lock) => dispatch(appRideActions.openBluetoothTrip(lock)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripScreen);
