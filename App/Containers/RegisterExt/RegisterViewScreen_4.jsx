import {
    Image,
    Platform,
    SafeAreaView,
    Pressable,
    View,
    Text,
    Alert,
    StyleSheet,
    Dimensions,
    TextInput,
    FlatList,
    Keyboard,
} from 'react-native';
import { Env } from "../../../keys";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { routing  } from '../../actions/actions';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import Colors from '../../Themes/Colors';
import MapViewDirections from 'react-native-maps-directions';
import React, { useState, useEffect, useRef } from 'react'; // Importa useRef
import Images from '../../Themes/Images';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import Fonts from '../../Themes/Fonts';
import { connect, useDispatch } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { getPermissions, updateForm } from '../../actions/actions'; 

const mapRef = React.createRef();
const keyMap = Env.key_map_google

function RegisterViewScreen_4 (props) {
  const { canContinue, setCanContinue } = props;
  const dispatch = useDispatch();
  const valorInicialDireccionCasa = props.formState.formRegister && props.formState.formRegister.usu_dir_casa ? props.formState.formRegister.usu_dir_casa : '';
  const valorInicialDireccionTrabajo = props.formState.formRegister && props.formState.formRegister.usu_dir_trabajo ? props.formState.formRegister.usu_dir_trabajo : '';
  const valorInicialCoorCasa = !!props.formState.formRegister.coorCasa ? props.formState.formRegister.coorCasa 
    : {
       latitude: 4.668007,
        longitude: -74.066859,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      };
  const valorInicialCoorTrabajo = !!props.formState.formRegister.coorCasa ? props.formState.formRegister.coorTrabajo 
      : {
          latitude: 4.668007,
          longitude: -74.066859,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        };
  const valorInicialNombreTrabajo = props.formState.formRegister && props.formState.formRegister.nombreEstacion ? props.formState.formRegister.nombreEstacion : '';

  const [ coordenadasCasa, setCoordenadasCasa ] = useState(valorInicialCoorCasa);
  const [ coordenadasTrabajo, setCoordenadasTrabajo ] = useState(valorInicialCoorTrabajo);
  const [ recorrido, setRecorrido ] = useState(0);

  // Estados para el autocompletado
  const [searchText, setSearchText] = useState(valorInicialDireccionCasa);
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);

  // Estado para otros datos
  const [state, setState] = useState({
    dirCasa: valorInicialDireccionCasa,
    dirTrabajo: valorInicialDireccionTrabajo,
    nombreEstacion: valorInicialNombreTrabajo,
  });
  const [ viewLocationMap, setViewLocationMap ] = useState(valorInicialCoorCasa);

  // Ref para el TextInput de búsqueda
  const searchInputRef = useRef(null);

  useEffect(() => {
    setCanContinue(false);
  }, []);

  useEffect(() => {
    if(state.dirCasa !== '' && state.dirTrabajo !== ''){
      setCanContinue(true);
    }
  }, [state.dirCasa, state.dirTrabajo ]);

    useEffect(() => {
      const actuallyForm = props.formState.formRegister;
       const updatedUser = {
        ...actuallyForm,
        "usu_dir_trabajo": state.dirTrabajo,
        "usu_dir_casa": state.dirCasa,
        "usu_recorrido": recorrido,
        "nombreEstacion" : state.nombreEstacion,
        "coorCasa": coordenadasCasa,
        "coorTrabajo": coordenadasTrabajo,
       };
       dispatch(updateForm(updatedUser));
     },[ state.dirTrabajo, state.dirCasa, state.nombreEstacion, coordenadasCasa, coordenadasTrabajo ])


    useEffect(() => {
        dispatch(getPermissions());
    },[]);

    // Efecto para buscar predicciones
    useEffect(() => {
      if (searchText.length > 2) {
        fetchPredictions(searchText);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, [searchText]);

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

    const fetchPlaceDetails = async (placeId, description) => { // Agrega description como parámetro
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
            setCoordenadasCasa({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0421,
            });
            
            setViewLocationMap({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0421,
            });

            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
              }, 1000);
            }

            // Aquí actualiza el searchText y dirCasa.
            // Es crucial que dirCasa se actualice con la dirección real obtenida de los detalles,
            // que podría ser diferente a la descripción de la predicción.
            setSearchText(description); // Establece el texto de búsqueda con la descripción completa
            setState(prevState => ({
              ...prevState,
              dirCasa: formatted_address || name || description // Usa formatted_address si está disponible
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };

    const handleSelectPrediction = (prediction) => {
      // Oculta las predicciones y desactiva la visibilidad
      setShowPredictions(false);
      setPredictions([]);
      Keyboard.dismiss(); // Oculta el teclado
      
      // Actualiza el texto de búsqueda inmediatamente
      setSearchText(prediction.description); 
      
      // Llama a fetchPlaceDetails con el place_id y la descripción de la predicción
      fetchPlaceDetails(prediction.place_id, prediction.description);
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

    const getPosition = () =>{
        Geolocation.getCurrentPosition(
            geoSuccess,
            geoFailed,
            geoSetup
        );
      }
    
      const geoSuccess = (positionActual) => {
          let { latitude, longitude } = positionActual.coords
          setViewLocationMap({
            ...viewLocationMap,
            latitude: latitude ,
            longitude: longitude ,
          })
      }
    
      const geoFailed = (error) => {
          console.log("error de ubicación", error)
      }
    
      geoSetup = Platform.OS == "android" ?
      {
          enableHighAccuracy: true,
          timeout: 100000
      } : 
      {
          enableHighAccuracy: true,
          timeout: 100000,
          maximumAge: 3600000
      }

      useEffect(() => {
        getPosition();
      },[])

      const handleFindCurrentLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setViewLocationMap({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0421,
            });
    
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
              }, 1000);
            }
          },
          (error) => {
            Alert.alert("Error", "Unable to get current location");
            console.error(error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      };

  const handleClick = async (event) => {
    const latitude = event.nativeEvent.coordinate.latitude;
    const longitude = event.nativeEvent.coordinate.longitude;
    setCoordenadasCasa({ latitude, longitude });
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${keyMap}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const placeName = data.results[0].formatted_address;
            setSearchText(placeName); // Actualiza el TextInput
            setState(prevState => ({
                ...prevState,
                dirCasa: placeName // Actualiza el estado dirCasa
            }));
            // Oculta las predicciones si hubieran estado visibles
            setPredictions([]);
            setShowPredictions(false);
            Keyboard.dismiss(); // Cierra el teclado
        } else {
            console.error('No se encontró la dirección');
        }
    } catch (error) {
        console.error('Error en la geocodificación:', error);
    }
  };

  const settingWorkPlace = (value) => {
    const selectedStation = props.stations.find(station => station.est_estacion === value);
    if (selectedStation) {
      setState({
        ...state,
        dirTrabajo: selectedStation.est_direccion,
        nombreEstacion: selectedStation.est_estacion
      });
      setCoordenadasTrabajo({
        latitude: selectedStation.est_latitud,
        longitude: selectedStation.est_longitud
      });
    }
  };

    return (
    <>
    <SafeAreaView style={{
        flex : 1,
        flexDirection: 'column',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: Colors.$blanco,
        position : 'relative', 
        top : -30
    }}>
    <View style={{flexDirection : 'row', paddingLeft : '8%', width : '80%'}}>
      <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: 10, color: Colors.$secundario }}>
        🏠
      </Text>
      <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: 10, color: 'black' }}>
        Ubique en el mapa su <Text style={{ fontWeight: 'bold' }}>lugar de residencia</Text> o ingrese la dirección correspondiente
      </Text>
    </View>
    
    <View style={estilos.searchContainer}>
      <TextInput
        ref={searchInputRef} // Asigna la ref al TextInput
        style={estilos.searchInput}
        placeholder="Ingresa tu punto de partida"
        placeholderTextColor={Colors.$secundario}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        onFocus={() => {
          if (predictions.length > 0) {
            setShowPredictions(true);
          }
        }}
        // Se puede añadir un onBlur para ocultar las predicciones cuando el TextInput pierde el foco
        // Pero hay que tener cuidado de no ocultarlas antes de que el onPress de la predicción se dispare.
        // Por ahora, lo mantenemos como está ya que handleSelectPrediction gestiona esto.
      />
      
      {searchText.length > 0 && (
        <Pressable
          style={estilos.clearButton}
          onPress={() => {
            setSearchText('');
            setPredictions([]);
            setShowPredictions(false);
            setState(prevState => ({
              ...prevState,
              dirCasa: ''
            }));
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

    <View style={{flexDirection : 'row', paddingLeft : '8%', marginTop : 20, width : '80%'}}>
      <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: 10, color: Colors.$secundario }}>
        🏢
      </Text>
      <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: 10, color: 'black' }}>
        Ubique en el mapa su <Text style={{ fontWeight: 'bold' }}>lugar de trabajo</Text> o ingrese la dirección correspondiente
      </Text>
    </View>
    <View>
    <RNPickerSelect
      style={pickerSelectStyles}
      placeholder={{ label: 'Ingresa tu punto de llegada', value: '' }}
      useNativeAndroidPickerStyle={false}
      value={state.nombreEstacion}
      onValueChange={(value) => { 
        settingWorkPlace(value);
      }}
      items={props.stations.map(data => ({
        label: data.est_estacion,
        value: data.est_estacion
      }))}
      Icon={() => (
        <Image 
          source={Images.iconPickerYellow} 
          style={{ top: 16, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} 
        />
      )}
    />
    </View>
    <View style={{flexDirection : 'row', justifyContent : 'center'}}>
    <Pressable 
        onPress={handleFindCurrentLocation} 
        style={{backgroundColor: Colors.$blanco, borderRadius : moderateScale(30), flexDirection : 'row', alignItems : 'center', justifyContent : 'center', borderColor : 'black', borderWidth : .8, width : '80%' }}>
        <Image source={Images.gps} style={{ width: 18, height: 25, backgroundColor : 'white', tintColor : '#4A4D6D' }} />
        <Text style={{fontSize: moderateScale(16), color: '#4A4D6D', padding : moderateScale(10) }}>Busca tu ubicación</Text>
    </Pressable> 
    </View>
    <View style={estilos.containerMap}>
     <MapView
        ref={mapRef}
        onPress={handleClick}
        loadingEnabled={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsUserLocation={true}
        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={estilos.map}
        region={viewLocationMap}
        onMapReady={() => {
        setState({ ...state,  paddingTop: 5 })
        }}
     >
     <Marker
        draggable
        key='1'
        coordinate={{
            latitude: coordenadasCasa.latitude,
            longitude: coordenadasCasa.longitude,
          }}
        description={"casa"}
      />
      <MapViewDirections
          origin={{
              latitude: Number(coordenadasCasa.latitude),
              longitude: Number(coordenadasCasa.longitude),
          }}
          destination={{
              latitude: Number(coordenadasTrabajo.latitude),
              longitude: Number(coordenadasTrabajo.longitude),
          }}
          apikey={keyMap}
          strokeColor={Colors.$primario}
          strokeWidth={6}
          onReady={(result) => {
            setRecorrido(result.distance);
          }}
      />  

        </MapView> 
    </View>  
    </SafeAreaView>
    </>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: moderateScale(18),
      borderBottomWidth: 2,
      backgroundColor: "transparent",
      paddingLeft: 15,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      borderColor: Colors.$secundario,
      borderRadius: 5,
      marginTop: 15,
      color: Colors.$secundario,
    },
    placeholder: {
      color: Colors.$secundario,
      fontSize: moderateScale(18),
    },
    inputAndroid: {
      fontSize: moderateScale(18),
      marginLeft: moderateScale(25),
      marginRight: moderateScale(25),
      borderColor: 'black',
      borderWidth: .8,
      borderRadius: moderateScale(5),
      marginBottom: moderateScale(20),
      marginTop: moderateScale(2),
      width: 'auto',
      color: 'black',
      paddingHorizontal: moderateScale(10),
    },
    textBoton1: {
      fontSize: moderateScale(16),
      color: Colors.$texto,
      fontFamily: Fonts.$poppinsregular,
    },
    shadowContainer: {
      flexDirection : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: horizontalScale(80),
      height: verticalScale(80),
      borderRadius: horizontalScale(40),
      backgroundColor: 'transparent',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
  });

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
      borderColor: 'black',
      borderRadius: moderateScale(5),
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(12),
      fontSize: 18,
      color: 'black',
    },
    clearButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      padding: 5,
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
        width: Dimensions.get("window").width*.5,
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
        flex : 1,
        justifyContent: 'center', 
        alignItems: 'center',  
        marginVertical : 15
    },
    map: {
        flex: 1,
        width: '90%', 
        height: '100%',
    },
})

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        perfil: state.reducerPerfil,
        stations : state.userReducer.stationsFromOrganization,
        formState: state.userReducer.formRegister,
    }
}

function mapDispatchToProps(dispatch) {
    return {
       routing: (component) => dispatch(routing(component)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterViewScreen_4);