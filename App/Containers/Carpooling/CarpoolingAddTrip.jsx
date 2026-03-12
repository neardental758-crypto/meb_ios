import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Text, View, Pressable, StyleSheet, Image, SafeAreaView,
  Dimensions, ScrollView, Alert, Animated, Modal, ImageBackground, TextInput, FlatList,
  Keyboard,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import { connect, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../Themes/Colors';
import { moderateScale } from '../../Themes/Metrics';
import { AuthContext } from '../../AuthContext';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Env } from "../../../keys";
import * as RootNavigation from '../../RootNavigation';
import { calcularDistanciaEntreDosPuntos } from '../../Services/calculateRoute';
import { sendTrip, getVehicles_carpooling, limpiarEstadoViaje, change_carpooling_drawer, ask_roles, sites_user, patch_vehiculos_carpooling } from '../../actions/actionCarpooling';
import DatePicker from 'react-native-date-picker';
import DrawerComponent from './CarpoolingDrawer';
import CarpooolingTYCDriver from './CarpoolingTYCDriver';
import CarpoolingRegisterVeh from './CarpoolingRegisterVeh';
import { Asientos } from '../../Components/carpooling/Asientos';
import { MetodoPago } from '../../Components/carpooling/MetodoPago';
import { MsnCreadoVehiculo } from '../../Components/carpooling/MsnCreadoVehiculo';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import { fetchRoutesFromGoogle } from './services/mapsService';
import { validateTripFields, buildTripObject } from './helpers/tripHelpers';

const keyMap = Env.key_map_google;

function CarpoolingAddTrip(props) {
  const dispatch = useDispatch();
  const { infoUser } = useContext(AuthContext);
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [position1, setPosition1] = useState(null);
  const [position2, setPosition2] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [outHour, setOutHour] = useState(new Date());
  const [isCheckedCarro, setIsCheckedCarro] = useState(true);
  const [isCheckedMoto, setIsCheckedMoto] = useState(false);
  const [travelIn, setTravelIn] = useState('Carro');
  const [isChecked, setIsChecked] = useState('');
  const [asientos, setAsientos] = useState('');
  const [vehiculoSelect, setvehiculoSelect] = useState('');
  const [checkDaviPlata, setCheckDaviPlata] = useState(true);
  const [checkCash, setCheckCash] = useState(true);
  const [checkNequi, setCheckNequi] = useState(true);
  const [modalEditPago, setModalEditPago] = useState(false);
  const [alturaMapa] = useState(new Animated.Value(Dimensions.get("window").height * 0.09));
  const [alturaCambiada, setAlturaCambiada] = useState(true);
  const [modalTYCDriver, setModalTYCDriver] = useState(props.canDrive);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryDestiny, setSearchQueryDestiny] = useState('');
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(50);
  const [btnpuntoPC, setbtnpuntoPC] = useState(false);
  const [btnpuntoPO, setbtnpuntoPO] = useState(false);
  const [tripCost, setTripCost] = useState(0);
  const [region, setRegion] = useState({ latitude: 4.7016, longitude: -74.1469, latitudeDelta: 0.04, longitudeDelta: 0.04 });
  const [loadingScreen, setLoadingScreen] = useState(true);

  // Estados para el autocompletado
  const [searchText, setSearchText] = useState('');
  const [searchTextDestiny, setSearchTextDestiny] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  // NUEVO ESTADO: Para saber qué input está activo
  const [activeInput, setActiveInput] = useState(null); // 'origin' o 'destination'

  let currentDate = new Date();
  currentDate.setHours(currentDate.getHours());

  const fetchRoutes = async () => {
    const routesData = await fetchRoutesFromGoogle(position1, position2, keyMap);
    setRoutes(routesData);
  };

  const alternarAltura = () => {
    const nuevaAltura = alturaCambiada
      ? Dimensions.get("window").height * 0.58 : Dimensions.get("window").height * 0.09;
    Animated.timing(alturaMapa, {
      toValue: nuevaAltura,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setAlturaCambiada(!alturaCambiada);
    scrollToTop();
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(ask_roles());
      dispatch(getVehicles_carpooling());
      dispatch(sites_user());
      limpiarEstados();
    }, [])
  );

  const goBack = async () => { await RootNavigation.navigate('Home') }

  const { region: currentLocation, error: geoError } = useCurrentLocation(region);

  useEffect(() => {
    if (currentLocation) setRegion(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    fetchRoutes();
  }, [position1, position2]);

  useEffect(() => {
    setModalTYCDriver(props.canDrive);
  }, [props.canDrive]);

  useEffect(() => {
    if (isCheckedCarro) {
      setTravelIn('Carro');
      setAsientos('');
    } else {
      setTravelIn('Moto');
      setAsientos(1);
    }
  }, [isCheckedCarro]);

  useEffect(() => {
    dispatch(getVehicles_carpooling());
  }, [props.dataCarpooling.registerCPU_save]);

  useEffect(() => {
    if (!searchQuery && !searchQueryDestiny) {
      console.log("Consulta vacía, no se realiza ninguna búsqueda.");
    }
  }, [searchQuery, searchQueryDestiny]);

  // MODIFICADO: useEffect para el botón "Desde Oficina"
  useEffect(() => {
    setKey1(prev => prev + 1);
    console.log('props.dataCarpooling.directionUser', props.dataCarpooling.directionUser)
    const directionUser = props.dataCarpooling.directionUser;
    const directionNameUser = props.dataCarpooling.directionNameUser;
    if (btnpuntoPC === true) {
      if (!directionUser) {
        // El usuario no tiene dirección de trabajo configurada
        Alert.alert('Sin dirección', 'No tienes dirección de trabajo configurada en tu perfil.');
        setbtnpuntoPC(false);
        return;
      }
      setSearchQuery(directionNameUser);
      setSearchText(directionNameUser);
      setPosition1({ lat: directionUser.latitude, lng: directionUser.longitude });
    } else {
      setSearchQuery('');
      setSearchText('');
      setPosition1(null);
    }
  }, [btnpuntoPC, props.dataCarpooling.directionUser, props.dataCarpooling.directionNameUser]);

  // MODIFICADO: useEffect para el botón "Hacia Oficina"
  useEffect(() => {
    setKey2(prev => prev + 1);
    const directionUser = props.dataCarpooling.directionUser;
    const directionNameUser = props.dataCarpooling.directionNameUser;
    if (btnpuntoPO === true) {
      if (!directionUser) {
        Alert.alert('Sin dirección', 'No tienes dirección de trabajo configurada en tu perfil.');
        setbtnpuntoPO(false);
        return;
      }
      setSearchQueryDestiny(directionNameUser);
      setSearchTextDestiny(directionNameUser);
      setPosition2({ lat: directionUser.latitude, lng: directionUser.longitude });
    } else {
      setSearchQueryDestiny('');
      setSearchTextDestiny('');
      setPosition2(null);
    }
  }, [btnpuntoPO, props.dataCarpooling.directionUser, props.dataCarpooling.directionNameUser]);

  useEffect(() => {
    const ubicacionLista = region.latitude !== 4.7016 && region.longitude !== -74.1469;
    const vehiculosListos = props.dataCarpooling.myVehiclesCPCargados;

    // directionUser (coorTrabajo) es OPCIONAL — si el usuario no tiene dirección de trabajo cargada
    // el loading no debe quedarse bloqueado. Los botones "Desde/Hacia Oficina" simplemente no harán nada.
    if (ubicacionLista && vehiculosListos) {
      const delay = setTimeout(() => setLoadingScreen(false), 800);
      return () => clearTimeout(delay);
    }
  }, [
    region,
    routes,
    props.dataCarpooling.myVehiclesCPCargados,
  ]);

  // Timeout de seguridad: si en 8 segundos no se cargó, quitar el loading de todas formas
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingScreen(false);
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index);
  };

  const limpiarEstados = async () => {
    setSearchQuery('');
    setSearchQueryDestiny('');
    setSearchText(''); // AGREGADO
    setSearchTextDestiny(''); // AGREGADO
    setKey1(0);
    setKey2(50);
    setPosition1(null);
    setPosition2(null);
    setAsientos('');
    setRoutes([]);
    setOutHour(currentDate);
    setbtnpuntoPC(false);
    setbtnpuntoPO(false);
    scrollToTop();
    setActiveInput(null); // AGREGADO: Limpiar activeInput
    await dispatch(limpiarEstadoViaje());
  };

  const irViajesActivos = async () => {
    setSearchQuery('');
    setSearchQueryDestiny('');
    setPosition1(null);
    setPosition2(null);
    setAsientos('');
    await dispatch(limpiarEstadoViaje());
    await dispatch(change_carpooling_drawer('Itinerario'));
    await RootNavigation.navigate('CarpoolingDriverTrips');
  }


  const saveTrip = async () => {
    const errorMessage = validateTripFields({ vehiculoSelect, travelIn, position1, position2, asientos, checkDaviPlata, checkCash, checkNequi, tripCost, empresa: props.empresa, parametroPagos: props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ? 'conpagos' : 'sinpagos' });
    if (errorMessage) {
      Alert.alert('Campos incompletos', errorMessage);
      return;
    }
    try {
      const directionUser = props.dataCarpooling.directionNameUser;
      const trip = await buildTripObject({ infoUser, searchQuery, searchQueryDestiny, directionUser, outHour, vehiculoSelect, asientos, routes, selectedRouteIndex, position1, position2, tripCost, checkDaviPlata, checkCash, checkNequi, parametroPagos: props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ? 'conpagos' : 'sinpagos', calcularDistanciaEntreDosPuntos });
      dispatch(sendTrip(trip));
    } catch (error) {
      console.error('Error al construir el viaje:', error);
    }
  };

  const vehSelect = (id, veh) => {
    setvehiculoSelect(id),
      setTravelIn(veh)
  }

  const toggleCheckBox = (idCarro) => {
    setIsChecked(idCarro);
  };

  const toggleCheckBoxVehicle = (Vehiculo) => {
    setIsCheckedMoto(!isCheckedMoto);
    setIsCheckedCarro(!isCheckedCarro);
    toggleCheckBox('');
    vehSelect('', Vehiculo);
  };

  const toggleCheckBoxVehicleTrue = (tipo) => {
    if (tipo == 'Moto') {
      setIsCheckedMoto(true);
      setIsCheckedCarro(false);
    } else {
      setIsCheckedMoto(false);
      setIsCheckedCarro(true);
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const modalActivo = (valor) => {
    setModalEditPago(valor)
  }

  const modalPagosEdit = () => {
    return (
      <View style={styles.contenedorModal}>
        <Modal transparent={true} animationType="slide">
          <View style={styles.cajaModal}>
            <View style={styles.cajaModal2}>
              <MetodoPago
                modalActivo={modalActivo}
                checkCash={checkCash}
                setCheckCash={setCheckCash}
                checkDaviPlata={checkDaviPlata}
                setCheckDaviPlata={setCheckDaviPlata}
                checkNequi={checkNequi}
                setCheckNequi={setCheckNequi}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  // MODIFICADO: Separar useEffect para cada input de búsqueda
  // Efecto para buscar predicciones del input de Salida
  useEffect(() => {
    if (activeInput === 'origin' && searchText.length > 2) {
      fetchPredictions(searchText);
    } else if (activeInput === 'origin') { // Borrar predicciones si el texto es muy corto o se ha borrado
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [searchText, activeInput]); // Solo escucha cambios en searchText si activeInput es 'origin'

  // Efecto para buscar predicciones del input de Destino
  useEffect(() => {
    if (activeInput === 'destination' && searchTextDestiny.length > 2) {
      fetchPredictions(searchTextDestiny);
    } else if (activeInput === 'destination') { // Borrar predicciones si el texto es muy corto o se ha borrado
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [searchTextDestiny, activeInput]); // Solo escucha cambios en searchTextDestiny si activeInput es 'destination'


  const fetchPredictions = async (input) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${keyMap}&components=country:co&language=es`
      );
      const json = await response.json();

      if (json.status === 'OK' && json.predictions) {
        setPredictions(json.predictions);
        setShowPredictions(true);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  // MODIFICADO: fetchPlaceDetails para usar `inputType`
  const fetchPlaceDetails = async (placeId, inputType) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${keyMap}&fields=geometry,name,formatted_address&language=es`
      );
      const json = await response.json();

      if (json.status === 'OK' && json.result) {
        const { geometry, name, formatted_address } = json.result;
        const { lat, lng } = geometry.location;

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (!isNaN(latitude) && !isNaN(longitude)) {

          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0421,
            }, 1000);
          }

          // Usa inputType para decidir qué estado actualizar
          if (inputType === 'origin') {
            setPosition1({
              lat: latitude,
              lng: longitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0421,
            });
            setSearchQuery(formatted_address); // Actualiza el placeholder
            setSearchText(formatted_address); // Actualiza el valor del TextInput
          } else if (inputType === 'destination') {
            setPosition2({
              lat: latitude,
              lng: longitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0421,
            });
            setSearchQueryDestiny(formatted_address); // Actualiza el placeholder
            setSearchTextDestiny(formatted_address); // Actualiza el valor del TextInput
          }
          setActiveInput(null); // Resetear el input activo después de seleccionar una dirección
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // MODIFICADO: handleSelectPrediction para pasar `activeInput`
  const handleSelectPrediction = (prediction) => {
    // setSearchText(prediction.description); // Ya no es necesario aquí, se hará en fetchPlaceDetails
    setShowPredictions(false);
    setPredictions([]);
    Keyboard.dismiss();
    fetchPlaceDetails(prediction.place_id, activeInput); // Pasa el input activo
  };

  const renderPrediction = ({ item }) => (
    <Pressable
      style={estilos.predictionItem}
      onPress={() => handleSelectPrediction(item)}
      activeOpacity={0.7}
    >
      <View>
        <Text style={estilos.predictionMain}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        {item.structured_formatting?.secondary_text && (
          <Text style={estilos.predictionSecondary}>
            {item.structured_formatting.secondary_text}
          </Text>
        )}
      </View>
    </Pressable>
  );

  const inactivarVehiculo = (id, tipo) => {
    console.log('inactivar el vehiculo ', id)
    let dataVeh = {
      "_id": id,
      "tipo": tipo + "DEL"
    }
    Alert.alert(
      "Confirmar",
      "Quiere eliminar este vehiculo ",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => dispatch(patch_vehiculos_carpooling(dataVeh))
        }
      ]
    );
  }

  useEffect(() => {
    if (props.dataCarpooling.vehiculoUpdateCarpooling) {
      console.log('refrescando los vehiculos carpooling')
      dispatch(getVehicles_carpooling());
    }
  }, [props.dataCarpooling.vehiculoUpdateCarpooling])

  if (loadingScreen) {
    return (
      <Modal transparent={true}>
        <View style={{ backgroundColor: Colors.$secundario80, flexDirection: "column", flex: 1 }}>
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
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {(modalTYCDriver) ? <View style={{
        position: 'absolute',
        top: 0,
        zIndex: 6
      }}>
        <CarpooolingTYCDriver navigation={props.navigation} closeModal={() => setModalTYCDriver(false)} />
      </View> : null}
      {(modalEditPago) ? modalPagosEdit() : <></>}
      <View style={{
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '10%',
        bottom: 0,
        alignItems: 'center',
        backgroundColor: Colors.$texto50,
        zIndex: 6
      }}>
        <DrawerComponent navigation={props.navigation} />
      </View>
      {(props.dataCarpooling.saveTripCarpooling) ?
        <ImageBackground source={Images.fondoMapa} style={{
          position: 'absolute',
          zIndex: 10,
          top: 0,
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={[styles.contentViajeSave]}>
            <Text style={[styles.textViajeSave]}>¡Viaje creado exitosamente!</Text>
            <View style={{
              width: "100%",
              height: 'auto',
            }}>
              <LottieView
                source={require('../../Resources/Lotties/trip_carpooling_ok.json')} autoPlay loop
                style={{
                  width: 350,
                  height: 350
                }}
              />
            </View>
            <View style={[styles.cajaBtnsViajeSave]}>
              <Pressable
                onPress={() => limpiarEstados()}
                style={styles.btnPrimarioViajeSave}>
                <View>
                  <Text style={[styles.textButtonModalSuccess, { color: Colors.$blanco, fontFamily: Fonts.$poppinsregular }]}>Crear más viajes</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => irViajesActivos()}
                style={[styles.btnPrimarioViajeSave, { backgroundColor: Colors.$secundario }]}>
                <View>
                  <Text style={[styles.textButtonModalSuccess, { color: Colors.$texto }]}>Ir a viajes activos</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
        : null}
      <View style={styles.startPositionsButtons}>
        <Pressable
          onPress={() => {
            setbtnpuntoPC(!btnpuntoPC);
          }}
          style={btnpuntoPC ? [styles.btnPrimario, { marginRight: 10 }] : [styles.btnSecundario, { marginRight: 10 }]}
        >
          <Text style={styles.textButton}>Desde Oficina</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setbtnpuntoPO(!btnpuntoPO);
          }}
          style={btnpuntoPO ? styles.btnPrimario : styles.btnSecundario}
        >
          <View>
            <Text style={styles.textButton}>Hacia Oficina</Text>
          </View>
        </Pressable>
      </View>

      <View style={{
        flex: 1,
        position: 'absolute',
        top: 100,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <View style={estilos.searchContainer}>
          <TextInput
            style={estilos.searchInput}
            placeholder={searchQuery === '' ? 'Salida' : searchQuery}
            placeholderTextColor={Colors.$texto}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setActiveInput('origin'); // AGREGADO: Establecer el input activo
            }}
            onFocus={() => {
              setActiveInput('origin'); // AGREGADO: Establecer el input activo al enfocar
              if (predictions.length > 0) {
                setShowPredictions(true);
              }
            }}
          />
          {/* AGREGADO: Botón para limpiar el input de Salida */}
          {searchText.length > 0 && (
            <Pressable
              style={[estilos.clearButton, { top: 10 }]} // Ajusta la posición si es necesario
              onPress={() => {
                setSearchText('');
                setSearchQuery('');
                setPosition1(null);
                setPredictions([]);
                setShowPredictions(false);
                setActiveInput(null); // AGREGADO: Resetear activeInput
              }}
            >
              <Text style={estilos.clearButtonText}>✕</Text>
            </Pressable>
          )}

          <TextInput
            style={[estilos.searchInput, { marginTop: 10 }]} // Ajusta el margen superior para el segundo input
            placeholder={searchQueryDestiny === '' ? 'Destino' : searchQueryDestiny}
            placeholderTextColor={Colors.$texto}
            value={searchTextDestiny}
            onChangeText={(text) => {
              setSearchTextDestiny(text);
              setActiveInput('destination'); // AGREGADO: Establecer el input activo
            }}
            onFocus={() => {
              setActiveInput('destination'); // AGREGADO: Establecer el input activo al enfocar
              if (predictions.length > 0) {
                setShowPredictions(true);
              }
            }}
          />
          {/* AGREGADO: Botón para limpiar el input de Destino */}
          {searchTextDestiny.length > 0 && (
            <Pressable
              style={[estilos.clearButton, { top: 70 }]} // Ajusta la posición según la altura del primer input
              onPress={() => {
                setSearchTextDestiny('');
                setSearchQueryDestiny('');
                setPosition2(null);
                setPredictions([]);
                setShowPredictions(false);
                setActiveInput(null); // AGREGADO: Resetear activeInput
              }}
            >
              <Text style={estilos.clearButtonText}>✕</Text>
            </Pressable>
          )}

        </View>

        {showPredictions && predictions.length > 0 && (
          <View style={estilos.predictionsContainer}>
            <FlatList
              data={predictions}
              renderItem={renderPrediction}
              keyExtractor={(item, index) => `${item.place_id}-${index}`}
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={true}
              scrollEnabled={true}
            />
          </View>
        )}
      </View>

      {routes.length > 0 && (
        <View horizontal style={styles.routeSelector}>
          <View style={{ maxWidth: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
            {routes.map((route, index) => (
              <Pressable key={index} style={[
                styles.routeButton,
                selectedRouteIndex === index && styles.selectedButton
              ]} onPress={() => handleSelectRoute(index)}>
                <Text style={styles.routeText}>Ruta {index + 1}: {'\n'}{route.legs[0].duration.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        loadingEnabled={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsUserLocation={true}
        region={position1 ? {
          latitude: position1.lat,
          longitude: position1.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        } : region}
      >
        {position1 && <Marker coordinate={{ latitude: position1.lat, longitude: position1.lng }} title="Salida" />}
        {position2 && <Marker coordinate={{ latitude: position2.lat, longitude: position2.lng }} title="Destino" />}

        {routes.map((route, index) => (
          <Polyline
            key={index}
            coordinates={route.coordinates}
            strokeWidth={index === selectedRouteIndex ? 6 : 4}
            strokeColor={index === selectedRouteIndex ? Colors.$primario : Colors.$secundario}
          />
        ))}
      </MapView>

      <Animated.View style={[styles.formContainer, { height: alturaMapa }]}>
        <View style={styles.cajaCabeza}>
          <Text style={styles.textTitle}>Crear viaje</Text>
          <Pressable
            onPress={() => { goBack() }}
            style={styles.btnAtras}>
            <View>
              <Image source={Images.home} style={[styles.iconBici, { tintColor: 'black' }]} />
            </View>
          </Pressable>
          <Pressable
            onPress={alternarAltura}
            style={styles.btnArriba}>
            <View>
              <Image source={Images.atras_Icon} style={[styles.iconBici, { tintColor: 'black', transform: [{ rotate: alturaCambiada ? '90deg' : '270deg' }] }]} />
            </View>
          </Pressable>
        </View>

        <ScrollView ref={scrollViewRef} style={{ marginTop: 45 }}>
          <Text style={[styles.textH2, { marginLeft: 30, marginBottom: 15 }]}>Calendario</Text>
          <Text style={[styles.textH2, { textAlign: 'center', marginBottom: 15 }]}>¿Cuando quieres viajar?</Text>
          <View style={[styles.datePickerBox, { borderColor: Colors.$blanco }]}>
            <View style={styles.startPositions}>
              <Text style={styles.textFecha}>Fecha</Text>
              <Text style={styles.textHora}>Hora</Text>
            </View>
            <DatePicker
              theme='light'
              backgroundColor={Colors.$tercer}
              textColor={Colors.$texto}
              fontFamily={Fonts.$poppinsregular}
              mode='datetime'
              date={outHour}
              onDateChange={setOutHour}
              locale={'es-CO'}
              minimumDate={new Date()}
            />
          </View>
          <View style={styles.boxV}>
            <Text style={[styles.textH2, { marginLeft: 30, marginBottom: 15 }]}>Vehículo</Text>
            <Text style={[styles.textH2, { textAlign: 'center', marginBottom: 15 }]}>¿En qué vas a viajar?</Text>
            <View style={styles.containerchecks}>
              {props.empresa[0].emp_carro_compartido === true &&
                <View style={styles.checkvehicle}>
                  <Text style={{ width: 100, fontSize: 18, marginTop: 2, fontFamily: Fonts.$poppinsregular }}>Carro</Text>
                  {isCheckedCarro ?
                    <Pressable
                      onPress={() => toggleCheckBoxVehicle('Carro')}
                      style={styles.btnCheckOK}
                    /> :
                    <Pressable
                      onPress={() => toggleCheckBoxVehicle('Carro')}
                      style={styles.btnCheck}
                    />
                  }
                </View>
              }
              {props.empresa[0].emp_moto_compartido === true &&
                <View style={styles.checkvehicle}>
                  <Text style={{ width: 100, fontSize: 18, marginTop: 2, fontFamily: Fonts.$poppinsregular }}>Moto</Text>
                  {isCheckedMoto ?
                    <Pressable
                      onPress={() => toggleCheckBoxVehicle('Moto')}
                      style={styles.btnCheckOK}
                    /> :
                    <Pressable
                      onPress={() => toggleCheckBoxVehicle('Moto')}
                      style={styles.btnCheck}
                    />
                  }
                </View>
              }
            </View>
            <View style={styles.cajaRegistrarV}>
              {
                !props.dataCarpooling.registerCPU_save ?
                  <CarpoolingRegisterVeh imagenVehicle={travelIn} />
                  :
                  <MsnCreadoVehiculo />
              }
            </View>
            <View style={[styles.cajaVehiculos]}>
              {
                props.dataCarpooling.myVehiclesCPCargados && props.dataCarpooling.myVehiclesCP ?
                  <>
                    {props.dataCarpooling.myVehiclesCP.data.length > 0 ?
                      <>
                        {
                          props.dataCarpooling.myVehiclesCP.data
                            .filter((data) => !data.tipo.includes('DEL'))
                            .map((data) =>
                              <View
                                key={data._id}
                                style={styles.vehiculeTouch}
                              >
                                <View style={[styles.cajaRow]}>
                                  <View style={styles.cajaPartidaImg}>
                                    {data.tipo == 'Carro' ? <Image source={Images.carrorojo2} style={styles.imgCarro} /> : <Image source={Images.moto} style={styles.imgMoto} />}
                                  </View>

                                  <View style={{ width: '50%', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                      <Text style={{ textAlign: 'right', color: 'black', fontFamily: Fonts.$poppinsregular }}>{data.marca} - {data.modelo}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                      <Text style={{ textAlign: 'right', color: 'black', fontFamily: Fonts.$poppinsregular }}>{data.placa} - {data.color}</Text>
                                    </View>
                                  </View>

                                  <View style={styles.cajaCheck}>
                                    {isChecked === data._id ?
                                      <Pressable
                                        onPress={() => {
                                          toggleCheckBox('')
                                          vehSelect('', 'Carro')
                                        }}
                                        style={styles.btnCheckOK}
                                      /> :
                                      <Pressable
                                        onPress={() => {
                                          toggleCheckBox(data._id)
                                          vehSelect(data._id, data.tipo)
                                          setTravelIn(data.tipo)
                                          toggleCheckBoxVehicleTrue(data.tipo)
                                        }}
                                        style={styles.btnCheck}
                                      />
                                    }
                                  </View>
                                  <Pressable
                                    onPress={() => {
                                      inactivarVehiculo(data._id, data.tipo)
                                    }}
                                    style={{ marginLeft: 10 }}
                                  >
                                    <Image
                                      source={Images.d_icon}
                                      style={{ marginRight: 15, width: 30, height: 30, marginLeft: 10 }} />
                                  </Pressable>
                                </View>

                              </View>
                            )
                        }
                      </>
                      :
                      <Text style={styles.rulesTextTitulo}>No se encontraron vehículos registrados</Text>
                    }

                  </>
                  :
                  <></>
              }
            </View>
          </View>
          {
            travelIn == 'Carro' ?
              <View style={styles.box}>
                <View style={styles.boxRow90}>
                  <Text style={styles.textH2}>Asientos</Text>
                  <Asientos nPuestoSelect={setAsientos} asientos={asientos} />
                </View>
              </View>
              :
              <></>
          }

          {
            props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ?
              <>
                <View style={styles.box}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={styles.textH2}>Pago</Text>
                    <Text style={{ fontSize: 16, fontFamily: Fonts.$poppinsregular }}>(Opcional)</Text>
                    <TextInput
                      placeholder='Aporte voluntario'
                      autoCompleteType={'number'}
                      style={styles.costInput}
                      value={tripCost}
                      keyboardType={'number-pad'}
                      onChangeText={setTripCost}
                    />
                  </View>
                </View>
                <View style={[styles.box3, { backgroundColor: Colors.$blanco, justifyContent: 'space-around' }]}>
                  <Text style={{ fontSize: 20, fontFamily: Fonts.$poppinsregular }}>Método de pago</Text>
                  <View style={styles.cajaRow2}>
                    {checkDaviPlata ? <Image source={Images.logodaviplata} style={styles.imgPago} /> : <></>}
                    {checkCash ? <Image source={Images.iconobillete} style={styles.imgPago} /> : <></>}
                    {checkNequi ? <Image source={Images.logonequi} resizeMode='contain' style={styles.imgPago} /> : <></>}
                  </View>
                  <Pressable
                    onPress={() => { setModalEditPago(true) }}
                  >
                    <Image source={Images.e_icon} style={{ width: 40, height: 40 }} />
                  </Pressable>
                </View>
              </>
              : null
          }

          <View style={[styles.box3, { backgroundColor: Colors.$blanco }]}>
            <Pressable onPress={() => saveTrip()}
              style={{
                textAlign: "center",
                padding: 10,
                margin: 20,
                backgroundColor: Colors.$primario,
                borderRadius: 50
              }}>
              <Text style={[styles.textButton, { width: 250, color: 'white', fontFamily: Fonts.$poppinsregular }]}>Agregar viaje</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  searchContainer: {
    marginHorizontal: moderateScale(25),
    marginTop: moderateScale(10),
    marginBottom: 0,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: Colors.$blanco,
    borderWidth: 0.8,
    borderColor: Colors.$secundario,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    fontSize: 18,
    color: 'black',
    width: Dimensions.get('window').width * .9
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
    zIndex: 2, // Asegura que el botón esté por encima del TextInput
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
  predictionsContainer: {
    marginHorizontal: moderateScale(25),
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: moderateScale(5),
    maxHeight: 200,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 4
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  predictionMain: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  predictionSecondary: {
    fontSize: 13,
    color: '#666',
  },
  inputDirCasa: {
    width: Dimensions.get("window").width,
    backgroundColor: Colors.$blanco,
    fontSize: 20,
    paddingLeft: 20,
    color: Colors.$texto,
  },
  btnCenter: {
    width: Dimensions.get("window").width * .5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.$primario,
    height: 50,
    marginTop: 20
  },
  btnSaveColor: {
    color: '#fff',
    fontSize: 20,
  },
  contenedor: {
    flex: 1,
    minHeight: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cajaBtnVerRuta: {
    flex: 1,
    minHeight: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  cajaCargando: {
    color: Colors.$blanco,
    width: Dimensions.get("window").width,
    textAlign: 'center',
  },
  containerMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15
  },
  map: {
    flex: 1,
    width: '90%',
    height: '100%',
  },
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  routeSelector: { position: 'absolute', top: 230, left: 0, right: 0, padding: 10, zIndex: 3 },
  routeButton: { marginHorizontal: 5, padding: 10, backgroundColor: Colors.$secundario, borderRadius: 5, width: '30%' },
  routeText: { color: Colors.$blanco, fontSize: 12 },
  formContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', paddingTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginBottom: '10%' },
  input: { borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, borderRadius: 5 },
  saveButton: { backgroundColor: Colors.$primario, padding: 15, alignItems: 'center', borderRadius: 5 },
  saveText: { color: Colors.$blanco, fontSize: 18, fontWeight: 'bold' },
  cajaCabeza: { backgroundColor: Colors.$blanco, flex: 1, justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: Colors.$blanco, borderRadius: 25, width: Dimensions.get('window').width, position: 'absolute', marginTop: -10, },
  textTitle: { marginTop: 20, marginBottom: 20, textAlign: 'center', fontSize: 22, fontFamily: Fonts.$poppinsregular, alignSelf: "center", color: 'black' },
  btnAtras: { position: 'absolute', top: 15, left: 15, width: 50, height: 50, backgroundColor: Colors.$blanco, alignItems: 'center', justifyContent: 'center', borderRadius: 25, shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 5, elevation: 8, },
  iconBici: { width: 25, height: 25 },
  btnArriba: { position: 'absolute', top: 15, right: 15, width: 50, height: 50, backgroundColor: Colors.$blanco, alignItems: 'center', justifyContent: 'center', borderRadius: 25, shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 5, elevation: 8, },
  selectedButton: { backgroundColor: Colors.$primario },
  btnPrimario: { alignItems: "center", justifyContent: "center", backgroundColor: Colors.$primario, borderRadius: 20, width: 150, height: 40 },
  btnSecundario: { alignItems: "center", justifyContent: "center", backgroundColor: Colors.$secundario, borderRadius: 20, width: 150, height: 40 },
  startPositions: { width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: 10 },
  startPositionsButtons: { position: 'absolute', zIndex: 1, flexDirection: 'row', top: 40, width: Dimensions.get('window').width, padding: 10, alignItems: 'center', justifyContent: 'center' },
  textButton: { fontFamily: Fonts.$poppinsregular, textAlign: "center", fontSize: 18, paddingTop: 'auto', paddingBottom: 'auto', color: 'white', color: Colors.$blanco, alignSelf: "center" },
  datePickerBox: { backgroundColor: 'white', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width, position: 'relative', marginTop: 10, marginBottom: 10, },
  textFecha: { width: Dimensions.get('window').width * .4, textAlign: 'right', fontSize: 20, fontFamily: Fonts.$poppinsregular, color: Colors.$texto, marginRight: 40 },
  textHora: { width: Dimensions.get('window').width * .4, textAlign: 'left', fontSize: 20, fontFamily: Fonts.$poppinsregular, color: Colors.$texto, marginLeft: 40 },
  boxV: { flex: 1, width: Dimensions.get('window').width, marginTop: 5, marginBottom: 5, },
  textH2: { fontSize: 22, fontFamily: Fonts.$poppinsregular },
  containerchecks: { flexDirection: 'row', justifyContent: 'center', margin: 20, marginBottom: 0 },
  checkvehicle: { flexDirection: 'row', justifyContent: 'center', width: '50%' },
  btnCheckOK: { width: 20, height: 20, borderWidth: 3, borderColor: Colors.$texto, borderRadius: 100, backgroundColor: Colors.$adicional, marginRight: 5, },
  btnCheck: { width: 20, height: 20, borderWidth: 3, borderColor: Colors.$texto, borderRadius: 100, marginRight: 5, },
  cajaRegistrarV: { width: Dimensions.get('window').width, paddingVertical: 0, },
  cajaVehiculos: { alignItems: "center", },
  vehiculeTouch: { width: Dimensions.get('window').width * .65, borderBottomColor: Colors.$primario, borderWidth: 1, borderColor: Colors.$secundario, borderRadius: 20, margin: 15 },
  cajaRow: { width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: 'center' },
  cajaPartidaImg: { width: "40%", alignItems: 'center', justifyContent: 'center' },
  imgCarro: { width: 80, height: 80, },
  imgMoto: { width: 80, height: 50, marginTop: 15, marginBottom: 15 },
  imgPago: { width: 40, height: 40, borderRadius: 10 },
  cajaCheck: { width: "10%", alignItems: 'center', justifyContent: 'center', },
  box: { flex: 1, width: Dimensions.get('window').width, marginTop: 5, marginBottom: 5, },
  boxRow90: { flex: 1, width: Dimensions.get('window').width * .9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Colors.$blanco, marginBottom: 25 },
  box3: { width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 },
  cajaRow2: { width: 150, flexDirection: "row", justifyContent: "space-around", },
  contenedorModal: { flex: 1, justifyContent: "space-between", alignItems: "center", marginTop: 20, },
  cajaModal: { backgroundColor: "rgba(52, 52, 52, 0.9)", flexDirection: "column", flex: 1, height: Dimensions.get('window').width * .5 },
  cajaModal2: { flex: 1, height: "100%", borderRadius: 6, marginVertical: 1, justifyContent: "space-around", alignItems: "center", },
  rulesTextTitulo: { marginBottom: 25, textAlign: 'center', fontSize: 22, color: 'gray' },
  contentViajeSave: { width: Dimensions.get('window').width * .8, height: Dimensions.get('window').height * .6, backgroundColor: Colors.$blanco, alignItems: 'center', justifyContent: 'space-around', borderRadius: 25, shadowColor: "#000", shadowOffset: { width: 5, height: 5, }, shadowOpacity: 1, shadowRadius: 5, elevation: 8, },
  logoViajeSave: { width: 200, height: 100, },
  textViajeSave: { width: Dimensions.get('window').width * .5, textAlign: 'center', alignSelf: "center", borderRadius: 10, fontSize: 20, color: Colors.$texto80, marginTop: 10, fontFamily: Fonts.$poppinsmedium },
  cajaBtnsViajeSave: { flexDirection: 'column', width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'space-around', },
  btnPrimarioViajeSave: { alignItems: "center", justifyContent: "center", backgroundColor: Colors.$primario, width: '60%', borderRadius: 50, marginBottom: 10 },
  textButtonModalSuccess: { width: '100%', fontFamily: Fonts.$poppinsregular, textAlign: "center", fontSize: 18, margin: 4, color: 'white', color: Colors.$blanco, alignSelf: "center", },
  costInput: { backgroundColor: Colors.$secundario50, color: Colors.$texto, height: 30, width: "40%", marginBottom: 10, borderBottomColor: 'white', fontSize: 14, textDecorationLine: 'none', borderRadius: 15, padding: 1, paddingLeft: 10, fontFamily: Fonts.$poppinsregular }
});

function mapStateToProps(state) {
  return {
    dataVehicule: state.reducerCarpooling,
    dataMySQL: state.reducer3G,
    dataCarpooling: state.reducerCarpooling,
    canDrive: state.reducerCarpooling.carpoolingCanDrive,
    empresa: state.reducerPerfil.dataempresa,
    perfil: state.reducerPerfil
  }
}

export default connect(mapStateToProps)(CarpoolingAddTrip);