import React, { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    Button, 
    Alert,
    PermissionsAndroid,
    StyleSheet,
    Dimensions,
    Pressable,
    Image,
    Modal
} from 'react-native';
import LottieView from 'lottie-react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { Tarjeta } from './Tarjeta';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import * as RootNavigation from '../../RootNavigation';
import BackgroundActions from 'react-native-background-actions'; // Asegúrate de que esté correctamente instalado
import { Env } from "../../../keys";
import estilos2 from './styles/rentas.style';
import estilos from './styles/reservas.style';
import { WeatherComponent } from './WeatherComponent';

const mapRef = React.createRef();
const keyMap = Env.key_map_google;
const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const options = {
    taskName: 'RIDE',
    taskTitle: 'Viaje activo',
    taskDesc: 'Rastreando tu ubicación en segundo plano',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
      delay: 5000, // Intervalo de 5 segundos
    },
    foregroundService: true,
  };

export function BackgroundTaskManager (props) {
    const { size = 25, terminadoTrip, estacionPrestamo } = props;
    const [isRunning, setIsRunning] = useState(false);
    const [distance, setDistance] = useState(0);
    const [coordinates, setCoordinates] = useState([]);
    const [posicionInit, setPosicionInit] = useState([]);
    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0); //tiempo transcurrido
    const [iniciando, setIniciando] = useState(false);
    const [viajeActivo, setViajeActivo] = useState(false);
    const [deteniendo, setDeteniendo] = useState(false);
    const [savingTrip, setSavingTrip] = useState(false);
    const [caloriasTrip, setCaloriasTrip] = useState(0);
    const [dirLlegada, setDirLlegada] = useState(false);
    const [enMovimiento, setEnMovimiento] = useState(false);
    const [modalDetener, setModalDetener] = useState(false);
    const [viajeDetenido, setViajeDetenido] = useState(false);
    const [ state , setState ] = useState({});

    const openModalDetener = () => {
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
                        <View style={{ flex: 3, borderRadius: 20, marginVertical: 150, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 20 }}>                            

                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto80,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >Finalizar el viaje y devolver el vehículo</Text>   

                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 200,
                                minHeight: 200,
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_meta2.json')} autoPlay loop 
                                style={{
                                  width: Dimensions.get('window').width,
                                  height: Dimensions.get('window').width*.7              
                                }}/>
                            </View>   
                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 200,
                                minHeight: 200,
                                position: 'absolute'
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop 
                                style={{
                                  width: Dimensions.get('window').width,
                                  height: Dimensions.get('window').width            
                                }}/>
                            </View>                    

                            <Pressable  
                                onPress={() => { 
                                    stopTracking()
                                }}
                                style={estilos.btnCenter}>
                                <View style={[estilos.btnSaveOK, {
                                    backgroundColor: Colors.$adicional,
                                    width: 300
                                }]}>
                                    <Text style={[estilos.textBtnNext, {
                                        color: Colors.$blanco, fontSize: 18, fontFamily: Fonts.$poppinsregular
                                    }]}>Aceptar</Text>
                                </View>
                            </Pressable>                             
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    const permisosSP = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            ]);
        
            if (
              granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
              granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
              granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
            ) {
              console.log('All location permissions granted');
            } else {
              console.log('Location permissions denied');
            }
          } catch (err) {
            console.warn(err);
          }
    }
    useEffect(()=> {
        permisosSP();
        getPosition();
    },[])


    const guardarposicionInicial = async () => {
        try {
            const posicionInicialGuardada = await AsyncStorage.getItem('posicionInicial');
            if (!posicionInicialGuardada) {  // Solo guarda si no existe
                await getPosition();
    
                const datosPI = {
                    lat: latActual,
                    lng: lngActual,
                    dir: await getAddressFromCoordinates(latActual, lngActual)
                };
                console.log('Guardando posición inicial :::::', datosPI);
                
                await AsyncStorage.setItem('posicionInicial', JSON.stringify(datosPI));
                setPosicionInit(datosPI); // Establecer en el estado
            } else {
                console.log('Posición inicial ya guardada, no se guarda nuevamente.');
                setPosicionInit(JSON.parse(posicionInicialGuardada)); // Cargar al estado si ya existe
            }
        } catch (error) {
            console.log('Error al guardar la posición inicial:', error);
        }
    };

    //funcion para obtener dirección a partir de latitud, longitud
    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {
          const apiKey = keyMap; // Reemplaza con tu clave de API
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            console.log('la direccion inicial es: ', data.results[0].formatted_address)
            return data.results[0].formatted_address;
            //setDireccionInicial(data.results[0].formatted_address);
            
          } else {
            console.log('No se encontró ninguna dirección para las coordenadas proporcionadas.');
            return null;
          }
        } catch (error) {
          console.log('Error al obtener la dirección:', error);
          return null;
        }
    };
  
    // Función para calcular la distancia entre dos puntos de coordenadas
    const calculateDistance = (coord1, coord2) => {
        const lat1 = coord1.latitude;
        const lon1 = coord1.longitude;
        const lat2 = coord2.latitude;
        const lon2 = coord2.longitude;

        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        // Solo retorno si la distancia calculada es válida
        //return distance > 1000 ? 0 : distance;
        return distance;
    };

    // Tarea en segundo plano sin campoaras distancia
    const backgroundTask = async (taskData) => {
        const { delay } = taskData;
        const startTime = new Date().getTime(); // Tiempo de inicio
    
        await new Promise(async (resolve) => {
            let initialCoordinates = null;
            let totalDistance = distance; // Usamos una variable local para asegurar la acumulación de distancia
    
            while (BackgroundActions.isRunning()) {
                const currentTime = new Date().getTime();
                const timeDiff = Math.floor((currentTime - startTime) / 60000); // Diferencia en minutos
                setElapsedTime(timeDiff);
    
                Geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const newCoordinates = { latitude, longitude };
    
                        if (!initialCoordinates) {
                            // Almacenar las coordenadas iniciales si es la primera vez
                            initialCoordinates = newCoordinates;
                        } else {
                            // Calcular la distancia desde las coordenadas iniciales hasta las nuevas
                            const distanceToAdd = calculateDistance(initialCoordinates, newCoordinates);
                            
                            if (distanceToAdd > 0) { // Asegurar que haya un cambio en la distancia
                                totalDistance += distanceToAdd; // Acumular la distancia en la variable local
                                setDistance(totalDistance); // Actualizar el estado de la distancia
                                
                                console.log('Distancia acumulada:', totalDistance);
    
                                // Actualización del estado basada en el estado anterior
                                await setCoordinates((prevCoordinates) => {
                                    const updatedCoordinates = [...prevCoordinates, newCoordinates];
                                    
                                    // Guardar en AsyncStorage
                                    AsyncStorage.setItem('rutaCoordinates', JSON.stringify(updatedCoordinates));
                                    AsyncStorage.setItem('distanciaRecorrida', JSON.stringify(totalDistance));
                                    AsyncStorage.setItem('elapsedTime', JSON.stringify(timeDiff)); // Guardar tiempo transcurrido
                                    
                                    return updatedCoordinates;
                                });
    
                                // Actualizar las coordenadas iniciales
                                initialCoordinates = newCoordinates;
                                onUpdateCoordinates(newCoordinates); // Notificar la actualización de coordenadas
                            }
                        }
                    },
                    (error) => {
                        console.log('Error obteniendo ubicación:', error);
                    },
                    { enableHighAccuracy: true }
                );
    
                await sleep(delay);
            }
    
            resolve();
        });
    };

    // Iniciar la tarea en segundo plano
    const startTracking = async () => {
        const isRunning = await BackgroundActions.isRunning();
        if (isRunning) {
          console.log('El rastreo ya está activo.');
          return; // Evita iniciar una nueva tarea si ya está corriendo
        }
      
        console.log('Iniciando Rastreo');
        try {
          await setIsRunning(true)  
          await guardarposicionInicial();
          await setViajeActivo(true);
          await recuperarCoordenadasSP()
          await BackgroundActions.start(backgroundTask, options);
          await AsyncStorage.setItem('isTrackingActive', 'true'); // Marcar que el rastreo está activo
        } catch (err) {
          console.log('Error al iniciar el rastreo:', err);
        }
    };
      

    // Detener la tarea en segundo plano 
    const stopTracking = async () => {
    try {
        // Detener la tarea en segundo plano si está en ejecución
        const isRunning = await BackgroundActions.isRunning();
        if (isRunning) {
        await BackgroundActions.stop();
        }

        // Borrar los datos almacenados en AsyncStorage
        /*await AsyncStorage.multiRemove([
        'rutaCoordinates',
        'distanciaRecorrida',
        'elapsedTime',
        'isTrackingActive'
        ]);*/

        // Actualizar el estado local
        //await setCoordinates([]);
        //await setDistance(0);
        //setElapsedTime(0);
        //setIsRunning(false);
        console.log('Rastreo detenido y datos borrados.');
        terminadoTrip(true)
        setViajeDetenido(true)
        setModalDetener(false)
    } catch (err) {
        console.log('Error al detener el rastreo o borrar los datos:', err);
    }
    }; 

    const pauseTracking = async () => {
        console.log('pausando el viaje', isRunning)
        try {
          // Verificar si la tarea en segundo plano está en ejecución
          //const isRunning = await BackgroundActions.isRunning();
          if (isRunning) {
            // Detener la tarea en segundo plano
            console.log('entrando a el try para pausar')
            await BackgroundActions.stop();
            await AsyncStorage.setItem('isTrackingActive', 'false'); // Marcar que el rastreo está pausado
            setIsRunning(false); // Actualizar el estado local
            console.log('Rastreo pausado.');
          }
        } catch (err) {
          console.log('Error al pausar el rastreo:', err);
        }
    };
      

    const recuperarCoordenadasSP = async () => {
        console.log('recuperandoasdasdasdas coordenadas');
        const storedCoordinates = await AsyncStorage.getItem('rutaCoordinates');
        const storedDistance = await AsyncStorage.getItem('distanciaRecorrida');
        const storedElapsedTime = await AsyncStorage.getItem('elapsedTime');
        const wasTracking = await AsyncStorage.getItem('isTrackingActive');
        
        if (storedCoordinates) setCoordinates(JSON.parse(storedCoordinates));
        if (storedDistance) setDistance(JSON.parse(storedDistance));
        if (storedElapsedTime) setElapsedTime(JSON.parse(storedElapsedTime));
    }
    
    //Cargar los datos almacenados al montar el componente.
    useEffect(() => {
        const loadStoredData = async () => {
          const storedCoordinates = await AsyncStorage.getItem('rutaCoordinates');
          const storedDistance = await AsyncStorage.getItem('distanciaRecorrida');
          const storedElapsedTime = await AsyncStorage.getItem('elapsedTime');
          const wasTracking = await AsyncStorage.getItem('isTrackingActive'); // Verifica si estaba activo antes
    
          console.log('storedCoordinates', storedCoordinates);
          console.log('storedDistance', storedDistance);
          console.log('storedElapsedTime', storedElapsedTime);
          console.log('wasTracking', wasTracking);
    
          // Recuperar los datos almacenados
          if (storedCoordinates) setCoordinates(JSON.parse(storedCoordinates));
          if (storedDistance) setDistance(JSON.parse(storedDistance));
          if (storedElapsedTime) setElapsedTime(JSON.parse(storedElapsedTime));
    
          // Verifica si la tarea de rastreo estaba activa antes
          if (wasTracking === 'true') {
            setIsRunning(true); // Actualiza el estado para reflejar que estaba en ejecución
            console.log('El rastreo ya estaba activo.');
          } else {
            console.log('El rastreo no estaba activo. Iniciando rastreo...');
            startTracking(); // Inicia el rastreo solo si no estaba en ejecución
          }
        };
    
        loadStoredData();
    }, []);
    

    {/*useEffect(() => {
        const cargarPosicionInicial = async () => {
            try {
                const posicionInicialGuardada = await AsyncStorage.getItem('posicionInicial');
                if (posicionInicialGuardada) {
                    console.log('Cargando posición inicial desde AsyncStorage');
                    setPosicionInit(JSON.parse(posicionInicialGuardada));
                }
            } catch (error) {
                console.log('Error al cargar la posición inicial:', error);
            }
        };
        cargarPosicionInicial();
    }, []);*/}

    const getPosition = () =>{
        Geolocation.getCurrentPosition(
            geoSuccess,
            geoFailed,
            geoSetup
        );
    }

    const geoSuccess = (positionActual) => {
        let { latitude, longitude } = positionActual.coords
        setLatActual(latitude);
        setLngActual(longitude);
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

  return (
    <View style={styles.contenedor}>
        {modalDetener ? openModalDetener() : <></>}
        <View style={styles.cajaMapa}>
            <MapView
                ref={mapRef}
                loadingEnabled={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                showsUserLocation={true}
                provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                style={ styles.mapa }
                region={{
                    latitude: latActual ? latActual : 0,
                    longitude: lngActual ? lngActual : 0,
                    latitudeDelta: 0.0323,
                    longitudeDelta: 0.0321,
                }}
                onMapReady={() => {
                    setState({ ...state,  paddingTop: 5 })
                }}
            > 
            
            {/*posicionInit.length > 1 && (
                <Marker
                key='1'
                coordinate={{
                    latitude: Number(posicionInit.lat),
                    longitude: Number(posicionInit.lng),
                }}
                description={"Posicion inicial"}
                style={{ height: 40, width: 40, resizeMode: "contain" }} 
            />
            )*/}  
            
            {/*<Marker
                key='1'
                coordinate={{
                    latitude: Number(latActual),
                    longitude: Number(lngActual),
                }}
                description={"Posicion Final"}
                style={{ height: 40, width: 40, resizeMode: "contain" }} 
            />*/}

            {coordinates.length > 1 && (
                <Polyline
                    coordinates={coordinates}
                    strokeColor={Colors.$adicional} // color de la línea
                    strokeWidth={10}    // ancho de la línea
                />
            )}

            </MapView>
        </View>

        <View style={styles.cajaCabeza}>
            <Text style={styles.title}>Viaje Activo</Text>
            {/*<View style={enMovimiento ? styles.cajaMovimiento : styles.cajaSinMovimiento}>
            {
                enMovimiento ?
                <Text style={{
                    width: Dimensions.get('window').windth,
                    backgroundColor: Colors.$disponible,
                    color: Colors.$blanco,
                    textAlign: 'center'
                }}>En movimiento</Text>
                :
                <Text style={{
                    width: Dimensions.get('window').windth,
                    backgroundColor: Colors.$prestada,
                    color: Colors.$blanco,
                    textAlign: 'center'
                }}>Sin movimiento</Text>
            }
            </View> */}         
        </View> 

        <View style={{
            width: Dimensions.get('window').width*.8,
            minHeight: Dimensions.get('window').height*.2,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            top: -20
        }}>

            {<View style={styles.subcajaIndicadoress}>
                <View style={styles.row_}>
                    <View style={styles.barraCaja}>
                        <Image source={Images.vpini} style={[styles.iconBici2]}/>
                    </View> 
                    <Text style={styles.textCaja}>Salida</Text>                               
                </View>
                <View style={styles.cajaInfo}>
                    <View style={[styles.cajaInternaInfo]}
                    >
                        <Text style={[styles.textos, {
                            width: 140,
                            height: 30,
                            fontSize: 12,
                            textAlign: 'center',
                            fontFamily: Fonts.$poppinslight
                        }]}>{posicionInit.dir ? posicionInit.dir : estacionPrestamo}</Text>
                    </View>
                </View>
                <View style={styles.row_}>
                    <View style={styles.barraCaja}>
                        <Image source={Images.vpllegada} style={[styles.iconBici2]}/>
                    </View> 
                    <Text style={styles.textCaja}>Llegada</Text>                               
                </View>
                <View style={styles.cajaInfo}>
                    <View style={[styles.cajaInternaInfo]}
                    >
                        <Text style={[styles.textos, {
                            width: 140,
                            height: 30,
                            fontSize: 12,
                            fontFamily: Fonts.$poppinslight
                        }]}>{dirLlegada}</Text>
                    </View>
                </View>
            </View>} 

            <Tarjeta 
                icono={Images.distancia_}
                titulo={'Distancia'}
                texto1={distance.toFixed(2)}
                texto2={''}
                elcolor={Colors.$adicional}
            />
            <Tarjeta 
                icono={Images.vpTiempo}
                titulo={'Minutos'}
                texto1={elapsedTime}
                texto2={''}
                elcolor={Colors.$disponible}
            />
            <Tarjeta 
                icono={Images.vpCalorias}
                titulo={'Calorías'}
                texto1={(elapsedTime*6.8).toFixed(2)}
                texto2={'Kcal'}
                elcolor={Colors.$primario}
            />
            <Tarjeta 
                icono={Images.vpCo2}
                titulo={'Co2'}
                texto1={Number(distance * 1.84).toFixed(2)}
                texto2={'Co2'}
                elcolor={Colors.$primario}
            />

            <WeatherComponent />
        </View>
        
            {
                !viajeDetenido ? 
                <>
                {
                    isRunning ?
                    <Pressable  
                        onPress={() => { pauseTracking()}}
                        style={estilos2.btnCenter1}>
                        <View style={[estilos2.btnSaveOK2, {backgroundColor: Colors.$texto}]}>
                            <Text style={estilos2.btnSaveColor}>Pausar</Text>
                        </View>
                    </Pressable>
                    :
                    <View style={styles.row_center}>
                        <Pressable  
                            onPress={() => { startTracking()}}
                            style={styles.btn_}>
                            <Text style={estilos2.btnSaveColor}>Reanudar</Text>                        
                        </Pressable> 
                        <Pressable  
                            onPress={() => { setModalDetener(true)}}
                            style={styles.btn_}>
                            <Text style={estilos2.btnSaveColor}>Detener</Text>                        
                        </Pressable>
                    </View>  
                } 
                </>
                :
                <></>
            }
                       
    </View>
  );
};
const styles = StyleSheet.create({
    contenedor: {
        width:Dimensions.get("window").width,
        alignItems: "center"
    },
    cajaMovimiento: {
        width: Dimensions.get('window').width,
        alignItems: "center",
        backgroundColor: Colors.$disponible
    },
    cajaSinMovimiento: {
        width: Dimensions.get('window').width,
        alignItems: "center",
        backgroundColor: Colors.$prestada
    },
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: 80,
        borderRadius: 30,
        position: 'relative',
        top: -20
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
    title: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 24,
        textAlign: 'center',
        color: Colors.$texto,
        marginBottom: 5,
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    cajaMapa: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*.7,
    },
    mapa: {
        flex: 1,
        width: Dimensions.get("window").width,
        height:  Dimensions.get("window").height,
    },
    subcajaIndicadoress: {
        width: 140,
        height: 140,
        backgroundColor: Colors.$blanco,
        marginBottom: 30,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 7,
        borderColor: Colors.$secundario50,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row_:{
        width: "100%",
        height: 'auto',
        backgroundColor: Colors.$secundario50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 20
    },
    row_center:{
        width: Dimensions.get("window").width,
        height: 'auto',
        backgroundColor: Colors.$blanco,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 20,
        marginBottom: 50
    },
    barraCaja: {
        width: 30, 
        height: 20, 
        borderRadius: 15, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$blanco
    },
    cajaInfo: {        
        width: 100,
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',  
          
    },
    textCaja: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto,
        paddingLeft: 5
    },
    textTitle: {
        marginTop: 30, 
        marginBottom: 20, 
        textAlign: 'center', 
        fontSize : 22, 
        fontFamily : Fonts.$poppinsmedium,
        alignSelf: "center",
        color: Colors.$texto80
    },
    iconBici: {
        width: 25,
        height: 25,
    },
    iconBici2: {
        width: 30,
        height: 30,
    },
    btn_: {
        width: Dimensions.get('window').width*.4,
        backgroundColor: Colors.$primario,
        borderRadius: 30,
        padding: 10
    }
})