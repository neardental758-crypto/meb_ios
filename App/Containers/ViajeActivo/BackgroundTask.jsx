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
    Modal,
    AppState,
    Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { Env } from "../../../keys";
import { TimeComponent } from './TimeComponent';
import { NativeModules } from 'react-native';

const { LocationServiceModule } = NativeModules;
const { SharedPreferencesModule } = NativeModules;
const mapRef = React.createRef();
const keyMap = Env.key_map_google;

export function BackgroundTask(props) {
    const { size = 25, terminadoTrip, estacionPrestamo, time, minutes, iniciar, indicadores, modo } = props;
    const [isRunning, setIsRunning] = useState(false);
    const [segundos, setSegundos] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [horas, setHoras] = useState(0);
    const [coordinatesNative, setCoordinatesNative] = useState([]);
    const [distanceNative, setDistanceNative] = useState(null);
    const [tiempoViaje, setTiempoViaje] = useState(0);
    const [posicionInit, setPosicionInit] = useState([]);
    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    const [iniciando, setIniciando] = useState(false);
    const [viajeActivo, setViajeActivo] = useState(false);
    const [deteniendo, setDeteniendo] = useState(false);
    const [savingTrip, setSavingTrip] = useState(false);
    const [caloriasTrip, setCaloriasTrip] = useState(0);
    const [dirLlegada, setDirLlegada] = useState(false);
    const [enMovimiento, setEnMovimiento] = useState(false);
    const [modalDetener, setModalDetener] = useState(false);
    const [viajeDetenido, setViajeDetenido] = useState(false);
    const [state, setState] = useState({});
    const [appState, setAppState] = useState(AppState.currentState);

    const startLocationService = () => {
        if (LocationServiceModule) {
            LocationServiceModule.startService(false);
        }
    };
    const stopLocationService = () => {
        if (LocationServiceModule) {
            LocationServiceModule.stopService();
        }
    };

    const syncCoordinatesDistance = async () => {
        try {
            // SharedPreferencesModule works on both Android and iOS (reads from UserDefaults on iOS)
            if (!SharedPreferencesModule) {
                return;
            }
            const storedCoordinates = await SharedPreferencesModule.getCoordinates();
            const storedDistance = await SharedPreferencesModule.getDistance();

            // Validar que se obtengan datos válidos
            if (!storedCoordinates || storedDistance === undefined) {
                //console.warn('No se encontraron coordenadas o distancia almacenada.');
                return;
            }

            try {
                // En iOS el bridge suele retornar el objeto directamente, en Android lo retorna como string JSON.
                let parsedCoordinates;
                if (typeof storedCoordinates === 'string') {
                    parsedCoordinates = JSON.parse(storedCoordinates);
                } else {
                    parsedCoordinates = storedCoordinates;
                }

                // Validar que las coordenadas sean un array
                if (!Array.isArray(parsedCoordinates)) {
                    console.error('Las coordenadas no están en el formato correcto.');
                    return;
                }

                // Transformar las coordenadas al formato requerido por Polyline
                const transformedCoordinates = parsedCoordinates.map(coordinate => ({
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                }));

                // Convertir la distancia en número si es necesario
                const parsedDistance = parseFloat(storedDistance);
                if (isNaN(parsedDistance)) {
                    console.error('La distancia no es un número válido.');
                    return;
                }

                // Actualizar el estado con las coordenadas transformadas y la distancia
                setCoordinatesNative(transformedCoordinates);
                setDistanceNative(parsedDistance);

            } catch (error) {
                console.error('Error al procesar las coordenadas o la distancia:', error);
            }

        } catch (error) {
            console.error('Error al sincronizar las coordenadas y la distancia:', error);
        }
    };

    const sincronizarDatosNativos = () => {
        const intervaloDatos = setInterval(() => {
            syncCoordinatesDistance(); // Llama a la función que sincroniza las coordenadas y la distancia
            getPosition();
        }, 5000); // Cada 5 segundos

        return () => clearInterval(intervaloDatos); // Limpia el intervalo al desmontar el componente
    };

    /*const permisosSP = async () => {
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
    }*/


    const permisosSP_1 = async () => {
        try {
            // Verificar que estamos en Android y en la API 33 o superior
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                if (
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('All location and notification permissions granted');
                } else {
                    console.log('Permissions denied');
                }
            } else {
                // Para versiones anteriores o plataformas distintas de Android
                console.log('No additional permissions needed');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const permisosSP_2 = async () => {
        try {
            // Verificar que estamos en Android y en la API 33 o superior
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                ]);

                if (
                    granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.POST_NOTIFICATIONS'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('All location and notification permissions granted');
                } else {
                    console.log('Permissions denied');
                }
            } else {
                // Para versiones anteriores o plataformas distintas de Android
                console.log('No additional permissions needed');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        console.log('entrando al efecto para ver si estamos en primer o segundo plano')
        const handleAppStateChange = async (nextAppState) => {
            // Verificar el estado del rastreo en AsyncStorage
            const isTrackingActive = await AsyncStorage.getItem('isTrackingActive');
            const trackingActive = isTrackingActive === 'true'; // Convertir el valor a booleano
            console.log('que viene el el isTrackingActive', isTrackingActive)
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                console.log('La aplicación ha pasado al primer plano');
                // Recuperar datos solo si el rastreo está activo

                if (trackingActive) {
                    console.log('el el trackingActive active', trackingActive)
                    await setViajeActivo(true);
                    await setIsRunning(true);
                }
            } else if (nextAppState === 'background') {
                console.log('La aplicación se está moviendo a segundo plano o cerrando');
            }
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [appState]);

    const verifyTripActive = async () => {
        const isTrackingActive = await AsyncStorage.getItem('isTrackingActive');

        if (isTrackingActive) {
            console.log('el el trackingActive active', isTrackingActive)
            await setViajeActivo(true);
            await setIsRunning(true);
        }
    }

    useEffect(() => {
        verifyTripActive();
    }, []);

    useEffect(() => {
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
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (mapRef.current && latActual && lngActual) {
                mapRef.current.animateToRegion(
                    {
                        latitude: latActual,
                        longitude: lngActual,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    },
                    1000 // Duración de la animación en ms
                );
            }
        }, [latActual, lngActual])
    );

    useEffect(() => {
        // Centrarse en la posición actual cada vez que se actualicen latActual o lngActual
        if (mapRef.current && latActual && lngActual) {
            mapRef.current.animateToRegion(
                {
                    latitude: latActual,
                    longitude: lngActual,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                },
                1000 // Duración de la animación en ms
            );
        }
    }, [latActual, lngActual]);

    const guardarposicionInicial = async () => {
        try {
            const posicionInicialGuardada = await AsyncStorage.getItem('posicionInicial');
            if (!posicionInicialGuardada) {  // Solo guarda si no existe
                const position = await getPositionParam(); // Await strictly

                const datosPI = {
                    lat: position.latitude,
                    lng: position.longitude,
                    dir: await getAddressFromCoordinates(position.latitude, position.longitude)
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

    const guardarTiempo = async () => {
        try {
            const tiempoGuardado = await AsyncStorage.getItem('startTime'); // Cambiado a 'startTime' para mayor claridad
            if (!tiempoGuardado) {  // Solo guarda si no existe
                const tiempo = Date.now(); // Tiempo actual en milisegundos
                await AsyncStorage.setItem('startTime', JSON.stringify(tiempo)); // Guardar tiempo en milisegundos
            } else {
                console.log('El tiempo ya fue guardado en el storage');
            }
        } catch (error) {
            console.log('Error al guardar el tiempo de inicio:', error);
        }
    };

    const iniciarCronometro = async () => {
        try {
            const tiempoGuardado = await AsyncStorage.getItem('startTime');
            if (tiempoGuardado) {
                const startTime = JSON.parse(tiempoGuardado); // Convertir de string a número
                const intervalo = setInterval(() => {
                    const tiempoActual = Date.now();
                    const tiempoTranscurrido = Math.floor((tiempoActual - startTime) / 1000); // En segundos

                    const lasHoras = Math.floor(tiempoTranscurrido / 3600); // Calcula las horas
                    const losMinutos = Math.floor((tiempoTranscurrido % 3600) / 60); // Calcula los minutos
                    const losSegundos = tiempoTranscurrido % 60; // Calcula los segundos

                    // Formatear con ceros iniciales si el valor es menor a 10
                    const formatoHoras = lasHoras < 10 ? `0${lasHoras}` : lasHoras;
                    const formatoMinutos = losMinutos < 10 ? `0${losMinutos}` : losMinutos;
                    const formatoSegundos = losSegundos < 10 ? `0${losSegundos}` : losSegundos;

                    // Actualizar el cronómetro con formato hh:mm:ss
                    setTiempoViaje(`${formatoHoras}:${formatoMinutos}:${formatoSegundos}`);
                    setMinutos(losMinutos); // Puedes eliminar esto si ya no necesitas guardar solo los minutos
                    setHoras(lasHoras);
                }, 1000); // Actualiza cada segundo

                return () => clearInterval(intervalo); // Limpia el intervalo al desmontar el componente
            }
        } catch (error) {
            console.log('Error al recuperar el tiempo de inicio:', error);
        }
    };

    useEffect(() => {
        if (viajeActivo) {
            iniciarCronometro(); // Inicia el cronómetro si el viaje está activo
            sincronizarDatosNativos(); // Inicia la sincronización de datos nativos 5 seg
        }
    }, [viajeActivo]);

    const startTracking = async () => {
        try {
            console.log('iniciando rastreo nativo')
            await setIsRunning(true)
            await guardarposicionInicial();
            await guardarTiempo();
            await setViajeActivo(true);
            await startLocationService();
            await AsyncStorage.setItem('isTrackingActive', 'true'); // Marcar que el rastreo está activo
        } catch (err) {
            console.log('Error al iniciar el rastreo:', err);
        }
    };

    const clearTrackingData = async () => {
        try {
            await AsyncStorage.multiRemove([
                'rutaCoordinates',
                'vehiculoVP',
                'distanciaRecorrida',
                'isTrackingActive',
                'posicionInicial',
                'startTime'
            ])
            if (SharedPreferencesModule) {
                await SharedPreferencesModule.clearCoordinates();
            }
            console.log('Datos de rastreo eliminados');
        } catch (err) {
            console.log('Error al limpiar los datos de rastreo:', err);
        }
    };

    const convertirATotalMinutos = (tiempo) => {
        const [horas, minutos, segundos] = tiempo.split(':').map(Number);
        return horas * 60 + minutos;
    }

    const stopTracking = async () => {
        console.log('deteniendo el rastreo nativo ____')
        if (modo === 'movil') {
            let tiempo___ = 0;
            if (time === 'null') {
                tiempo___ = convertirATotalMinutos(tiempoViaje)
            } else {
                tiempo___ = convertirATotalMinutos(time)
            }
            const indicadores_ = {
                "distancia": distanceNative ?? 0,  // Asegurarte de que no sea undefined
                "calorias": Number((tiempo___ * 3.3).toFixed(2)),  // Limitar decimales
                "duracion": tiempo___ ?? 0,  // Evitar valores undefined
                "co2": Number(((distanceNative / 1000) * 1.84).toFixed(2))  // Limitar decimales
            };

            console.log('indicadores__', indicadores_);

            try {
                await AsyncStorage.setItem('indicadores', JSON.stringify(indicadores_));
                // Verifica que el valor se ha guardado correctamente
                const storedIndicadores = await AsyncStorage.getItem('indicadores');
                console.log('Stored indicadores:', storedIndicadores);
            } catch (error) {
                console.error("Error storing indicadores:", error);
            }

            //await indicadores(indicadores_);
        }

        try {
            console.log('deteniendo rastreo');
            await terminadoTrip(true)
            await setViajeDetenido(true)
            //await setModalDetener(false)
            await setIsRunning(false);
            await setDirLlegada(getAddressFromCoordinates(latActual, lngActual));
            //await setDeteniendo(true)
            await stopLocationService();
            await AsyncStorage.setItem('isTrackingActive', 'false');
            //await clearTrackingData()
        } catch (err) {
            console.log('Error al detener el rastreo:', err);
        }
    };

    const pauseTracking = async () => {
        try {
            if (isRunning) {
                await stopLocationService();
                setIsRunning(false);
            }
        } catch (err) {
            console.log('Error al pausar el rastreo:', err);
        }
    };

    useEffect(() => {
        if (iniciar) {
            startTracking();
        }
    }, [iniciar])

    useEffect(() => {
        if (modo === 'movil') {
            permisosSP_1();
            permisosSP_2();
            getPosition();
        }
    }, [])



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
    const calculateDistance = (start, end) => {
        const { latitude: lat1, longitude: lon1 } = start;
        const { latitude: lat2, longitude: lon2 } = end;
        // Fórmula de Haversine para calcular la distancia en kilómetros
        const R = 6371; // Radio de la Tierra en km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000; // Convertir a metros
        return distance;
    };

    const getPositionParam = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (positionActual) => {
                    let { latitude, longitude } = positionActual.coords;
                    setLatActual(latitude);
                    setLngActual(longitude);
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.log("error de ubicación", error)
                    reject(error);
                },
                geoSetup
            );
        });
    }

    const getPosition = () => {
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
            <View style={styles.cajaMapa}>
                <MapView
                    ref={mapRef}
                    loadingEnabled={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    showsScale={true}
                    showsUserLocation={true}
                    provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                    style={styles.mapa}
                    region={{
                        latitude: latActual ? latActual : 0,
                        longitude: lngActual ? lngActual : 0,
                        latitudeDelta: 0.0323,
                        longitudeDelta: 0.0321,
                    }}
                    onMapReady={() => {
                        setState({ ...state, paddingTop: 5 })
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

                    {coordinatesNative.length > 0 && (
                        <Polyline
                            coordinates={coordinatesNative}
                            strokeColor={Colors.$primario} // color de la línea
                            strokeWidth={10}    // ancho de la línea
                        />
                    )}

                </MapView>
            </View>

            <View style={[styles.cajaCabeza, { top: 0, marginTop: -20 }]}>
                <Text style={styles.title}>
                    {
                        isRunning ? 'Viaje Activo' : 'Viaje Pausado'
                    }
                </Text>
            </View>

            <View style={{
                width: Dimensions.get('window').width * .9,
                marginBottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                marginTop: 10,
            }}>

                {<View style={[styles.subcajaIndicadoress, { height: 'auto', minHeight: 140, paddingVertical: 15 }]}>
                    <View style={styles.row_}>
                        <View style={styles.barraCaja}>
                            <Image source={Images.vpini} style={[styles.iconBici2]} />
                        </View>
                        <Text style={styles.textCaja}>Salida</Text>
                    </View>
                    <View style={styles.cajaInfo}>
                        <View style={[styles.cajaInternaInfo]}>
                            <Text style={[styles.textos, {
                                width: 140,
                                height: 30,
                                fontSize: 12,
                                textAlign: 'center',
                                fontFamily: Fonts.$poppinslight
                            }]}>{posicionInit.dir ? posicionInit.dir : estacionPrestamo}</Text>
                        </View>
                    </View>

                    <View style={[styles.row_, { marginTop: 10 }]}>
                        <View style={styles.barraCaja}>
                            <Image source={Images.vpllegada} style={[styles.iconBici2]} />
                        </View>
                        <Text style={styles.textCaja}>Llegada</Text>
                    </View>
                    <View style={styles.cajaInfo}>
                        <View style={[styles.cajaInternaInfo]}>
                            <Text style={[styles.textos, {
                                width: 140,
                                height: 30,
                                fontSize: 12,
                                textAlign: 'center',
                                fontFamily: Fonts.$poppinslight
                            }]}>{dirLlegada ? dirLlegada : '- - -'}</Text>
                        </View>
                    </View>
                </View>}

                {
                    minutes === 'null' ?
                        <Tarjeta
                            icono={Images.vpCalorias}
                            titulo={'Calorías (kcal)'}
                            texto1={minutos ? ((minutos + (horas * 60)) * 3.3).toFixed(2) : 0}
                            texto2={'Kcal'}
                            elcolor={Colors.$primario}
                        />
                        :
                        <Tarjeta
                            icono={Images.vpCalorias}
                            titulo={'Calorías (kcal)'}
                            texto1={(minutes * 6.8).toFixed(2)}
                            texto2={'Kcal'}
                            elcolor={Colors.$primario}
                        />
                }


                {
                    time === 'null' ?
                        <Tarjeta
                            icono={Images.vpTiempo}
                            titulo={'Tiempo (h:m:s)'}
                            texto1={tiempoViaje ? tiempoViaje : 0}
                            texto2={'Min'}
                            elcolor={Colors.$adicional}
                        />
                        :
                        <Tarjeta
                            icono={Images.vpTiempo}
                            titulo={'Tiempo (Min)'}
                            texto1={time}
                            texto2={''}
                            elcolor={Colors.$disponible}
                        />
                }

                <Tarjeta
                    icono={Images.distancia_}
                    titulo={'Distancia (Kms)'}
                    texto1={distanceNative !== null ? (distanceNative / 1000).toFixed(2) : '00'}
                    texto2={''}
                    elcolor={Colors.$adicional}
                />
                <TimeComponent />

                <Tarjeta
                    icono={Images.vpCo2}
                    titulo={'Co2 (Grs)'}
                    texto1={Number((distanceNative / 1000) * 1.84).toFixed(2)}
                    texto2={'Co2'}
                    elcolor={Colors.$primario}
                />
            </View>

            {
                !viajeDetenido ?
                    <>
                        {
                            isRunning ?
                                <Pressable
                                    onPress={() => { pauseTracking() }}
                                    style={styles.btnCenter1}>
                                    <View style={[styles.btnSaveOK2, { backgroundColor: Colors.$texto }]}>
                                        <Text style={styles.btnSaveColor}>Pausar</Text>
                                    </View>
                                </Pressable>
                                :
                                <View style={styles.row_center}>
                                    <Pressable
                                        onPress={() => { startTracking() }}
                                        style={styles.btn_}>
                                        <Text style={styles.btnSaveColor}>Reanudar</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => { stopTracking() }}
                                        style={styles.btn_}>
                                        <Text style={styles.btnSaveColor}>Detener</Text>
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
    btnCenter1: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    btnSaveOK: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$primario,
        width: 350,
        height: 'auto',
        borderRadius: 25,
        padding: 10,
    },
    btnCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    btnSaveColor: {
        color: Colors.$blanco,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: Fonts.$poppinsregular
    },
    btnSaveOK2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$primario,
        width: 350,
        height: 'auto',
        borderRadius: 25,
        padding: 10,
    },
    contenedor: {
        width: Dimensions.get("window").width,
        alignItems: "center",
        backgroundColor: Colors.$blanco
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
    btnAtras: {
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
        height: Dimensions.get("window").height * .55,
    },
    mapa: {
        flex: 1,
        width: '100%',
        height: '100%',
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
    row_: {
        width: "100%",
        height: 'auto',
        backgroundColor: Colors.$secundario50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 20
    },
    row_center: {
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
        fontSize: 22,
        fontFamily: Fonts.$poppinsmedium,
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
        width: Dimensions.get('window').width * .4,
        backgroundColor: Colors.$primario,
        borderRadius: 30,
        padding: 10
    }
})




