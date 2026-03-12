
import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TextInput,
    Pressable,
    View,
    StyleSheet,
    Platform,
    Linking,
    Alert,
    ScrollView,
    Modal,
    Button,
    Dimensions,
    PermissionsAndroid,
    AppState
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import LottieView from 'lottie-react-native';
import Images from '../../Themes/Images';
import {
    validateVehicle,
    startTrip,
    startTrip_avion,
    validateVehicleSinMysql,
    restartTrip,
    tripEnd,
    savePuntos,
    saveComentarioVP,
    clearStateVp
} from '../../actions/actions3g';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Geolocation from 'react-native-geolocation-service';
import Cronometro from './Cronometro';
import estilos from './styles/estilos.style';
import estilosStartTrip from './styles/starttrip.style';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import BackgroundActions from 'react-native-background-actions';
import { Env } from "../../../keys";
import { v4 as uuidv4 } from 'uuid';
import { refreshToken } from '../../Services/refresh.service';
import { Tarjeta } from './Tarjeta';
import { WeatherComponent } from './WeatherComponent';
import { Estrellas } from './Estrellas';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { NativeEventEmitter, NativeModules } from 'react-native';
//import polyline from '@mapbox/polyline';

const { LocationServiceModule } = NativeModules;
const { SharedPreferencesModule } = NativeModules;
const mapRef = React.createRef();
const keyMap = Env.key_map_google;
//const locationEmitter = new NativeEventEmitter(LocationServiceModule);

// Función auxiliar para verificar si un string es JSON válido
const isValidJSON = (string) => {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
};

function StartTripScreen(props) {
    const dispatch = useDispatch();
    const {
        infoUser,
        posicionInicial,
        endTtripVP,
        cargarDataposicionInicial,
        tiempoSegundoPlanoVP,
        cargarDataTiempoVP } = useContext(AuthContext);

    const [state, setState] = useState({
        user: '',
        idVehiculo: props.dataRent.myVehicleSelect,
        isOpenBackgroundInfoModal: false,
        isOpenBackgroundInfoModal2: false,
    });

    const [FinalizandoViaje, setFinalizandoViaje] = useState(false);
    const [segundos, setSegundos] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [horas, setHoras] = useState(0);
    const [iniciando, setIniciando] = useState(false);
    const [intervalo, setIntervalo] = useState(null);
    const [posicionInit, setPosicionInit] = useState({});
    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    const [coordinatesNative, setCoordinatesNative] = useState([]);
    const [distanceNative, setDistanceNative] = useState(null);
    const [tiempoViaje, setTiempoViaje] = useState('00:00:00');
    const [viajeActivo, setViajeActivo] = useState(false);
    const [deteniendo, setDeteniendo] = useState(false);
    const [savingTrip, setSavingTrip] = useState(false);
    const [dirLlegada, setDirLlegada] = useState('');
    const [vehiculoVP, setVehiculoVP] = useState(props.dataRent.myVehicleSelect);
    const [appState, setAppState] = useState(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
    const [saveComent, setSaveComent] = useState(false);
    const [comentario, setComentario] = useState('')
    const [calificacion, setCalificacion] = useState(0);
    const cronoInterval = useRef(null);
    const syncInterval = useRef(null);

    const startLocationService = (reset = false) => {
        if (Platform.OS === 'android') {
            LocationServiceModule.startService(reset);
        }
    };
    const stopLocationService = () => {
        if (Platform.OS === 'android') {
            LocationServiceModule.stopService();
        }
    };
    const goBack = () => { RootNavigation.navigate('MyVehiclesScreen') }

    /*useEffect(() => {
        console.log("entro al efecto coordenas nativas")
        const locationListener = locationEmitter.addListener('onLocationUpdate', (location) => {
          console.log("latituds:", location.latitude, "Longitud:", location.longitude);
        });
         console.log(locationListener);
        // Limpia el listener cuando el componente se desmonte
        return () => {
         console.log(locationListener);
        };
    }, []);*/

    useEffect(() => {
        if (Platform.OS === 'android') {
            // Iniciar el emisor de eventos solo en Android
            const locationEmitter = new NativeEventEmitter(NativeModules.LocationServiceModule);

            const locationListener = locationEmitter.addListener('onLocationUpdate', (location) => {
                console.log("Ubicación desde Android:", location.latitude, location.longitude);
            });

            return () => {
                locationListener.remove();
            };
        } else if (Platform.OS === 'ios') {
            console.log('iOS: no se ejecuta el servicio de ubicación nativo Android');
            // Aquí podrías implementar lógica diferente para iOS si fuese necesario
        }
    }, []);




    const syncCoordinatesDistance = async () => {
        if (Platform.OS === 'android') {
            try {
                const storedCoordinates = await SharedPreferencesModule.getCoordinates();
                console.log("Valor de storedCoordinates:", storedCoordinates); // Verificar el valor devuelto
                const storedDistance = await SharedPreferencesModule.getDistance();
                //Alert.alert( storedCoordinates);
                console.log("Valor de storedDistance:", storedDistance)
                //const prueba = await SharedPreferencesModule.saveTestData();
                //console.log("Valor de la prueba:", prueba)
                // Validar que se obtengan datos válidos
                if (storedCoordinates === null || storedDistance === null) {
                    return;
                }

                try {
                    // Parsear las coordenadas
                    const parsedCoordinates = Array.isArray(storedCoordinates) ? storedCoordinates : JSON.parse(storedCoordinates);
                    console.log("Parseo exitoso de parsedCoordinates");
                    console.log("entro al parsedCoordinates try")
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
                    console.log("parsed distance " + parsedDistance);
                    console.log("distancia nativa " + distanceNative);

                } catch (error) {
                    console.error('Error al procesar las coordenadas o la distancia:', error);
                }

            } catch (error) {
                console.error('Error al sincronizar las coordenadas y la distancia:', error);
            }
        }
    };




    const permisosSP = async () => {
        if (Platform.OS === 'ios') {
            try {
                // Primero, solicitamos el permiso en primer plano
                const fineLocation = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

                if (fineLocation === RESULTS.GRANTED) {
                    // Si el permiso en primer plano está concedido, entonces solicitamos el permiso en segundo plano
                    const backgroundLocation = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

                    if (backgroundLocation === RESULTS.GRANTED) {
                        console.log('All location permissions granted');
                    } else {
                        console.log('Background location permission denied');
                    }
                } else {
                    console.log('Fine location (foreground) permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };


    const home = async () => {
        await setFinalizandoViaje(false);
        await setPosicionInit({});
        await setLatActual('');
        await setLngActual('');
        await setCoordinatesNative([]);
        await setViajeActivo(false);
        await setDeteniendo(false);
        await setSavingTrip(false);
        await setDirLlegada('');
        await clearTrackingData();
        await setTiempoViaje('00:00:00');
        await setMinutos(0);
        await setHoras(0);
        await setCalificacion(0);
        await setSaveComent(false);
        await RootNavigation.navigate('Home')
    }

    const guardarposicionInicial = async (force = false) => {
        try {
            const posicionInicialGuardada = await AsyncStorage.getItem('posicionInicial');
            if (!posicionInicialGuardada || force) {  // Solo guarda si no existe o si se fuerza
                const coords = await getPosition();
                const { latitude, longitude } = coords;

                const address = await getAddressFromCoordinates(latitude, longitude);
                const datosPI = {
                    lat: latitude,
                    lng: longitude,
                    dir: address
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

    const guardarVehiculo = async () => {
        try {
            const saveVehiculo = await AsyncStorage.getItem('vehiculoVP');
            if (!saveVehiculo) {  // Solo guarda si no existe
                await AsyncStorage.setItem('vehiculoVP', props.dataRent.myVehicleSelect);// Establecer en el estado
                setVehiculoVP(props.dataRent.myVehicleSelect)
            } else {
                console.log('El vehiculo ya se guardo en el storage');
                setVehiculoVP(props.dataRent.myVehicleSelect)
            }
        } catch (error) {
            console.log('Error al guardar la posición inicial:', error);
        }
    };

    const guardarTiempo = async (force = false) => {
        try {
            const tiempoGuardado = await AsyncStorage.getItem('startTime'); // Cambiado a 'startTime' para mayor claridad
            if (!tiempoGuardado || force) {  // Solo guarda si no existe o si se fuerza
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

                if (cronoInterval.current) clearInterval(cronoInterval.current);
                cronoInterval.current = intervalo;
            }
        } catch (error) {
            console.log('Error al recuperar el tiempo de inicio:', error);
        }
    };

    const sincronizarDatosNativos = () => {
        const intervaloDatos = setInterval(() => {
            syncCoordinatesDistance(); // Llama a la función que sincroniza las coordenadas y la distancia
            getPosition();
        }, 5000); // Cada 5 segundos

        syncInterval.current = intervaloDatos;
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

    const recuperarDatosDeStorage = async () => {
        try {
            console.log('Recuperando datos de AsyncStorage...');
            const storedVehiculoVP = await AsyncStorage.getItem('vehiculoVP');
            const parsedVehiculoVP = storedVehiculoVP && isValidJSON(storedVehiculoVP) ? JSON.parse(storedVehiculoVP) : null;
            setVehiculoVP(parsedVehiculoVP);
            console.log('Vehículo recuperado:', parsedVehiculoVP);

        } catch (error) {
            console.log('Error al recuperar datos de AsyncStorage:', error);
        }
    };

    const startTracking = async (isNewTrip = false) => {
        try {
            if (isNewTrip) {
                await clearTrackingData();
                await setTiempoViaje('00:00:00');
                await setDistanceNative(0);
            }
            await guardarposicionInicial(isNewTrip);
            await guardarVehiculo();
            await guardarTiempo(isNewTrip);
            await setViajeActivo(true);
            await setDirLlegada('');
            await startLocationService(isNewTrip);
            await AsyncStorage.setItem('isTrackingActive_vp', 'true'); // Marcar que el rastreo está activo
        } catch (err) {
            console.log('Error al iniciar el rastreo:', err);
        }
    };

    const stopTracking = async () => {
        try {
            const direccion = await getAddressFromCoordinates(latActual, lngActual); //se agrego como variable la dirreccion de la llegada
            if (direccion) {
                await setDirLlegada(direccion);
            } else {
                console.log('No se pudo obtener la dirección de llegada.');
            }

            await setDeteniendo(true)
            await recuperarDatosDeStorage();
            await stopLocationService();
            await AsyncStorage.setItem('isTrackingActive_vp', 'false'); // Marcar que el rastreo ha sido detenido
        } catch (err) {
            console.log('Error al detener el rastreo:', err);
        }
    };

    const clearTrackingData = async () => {
        try {
            await AsyncStorage.multiRemove([
                'rutaCoordinates',
                'vehiculoVP',
                'distanciaRecorrida',
                'elapsedTime',
                'isTrackingActive_vp',
                'posicionInicial',
                'lastAppCloseTime',
                'startTime'
            ])
            if (Platform.OS === 'android') {
                await SharedPreferencesModule.clearCoordinates();
            }
            setDistanceNative(0);
            setCoordinatesNative([]);
            console.log('Datos de rastreo eliminados correctamente.');
        } catch (err) {
            console.log('Error al limpiar los datos de rastreo:', err);
        }
    };

    //Función iniciar viaje
    const GuardarViaje = async () => {
        if (savingTrip) return;
        await setSavingTrip(true);

        try {
            getPosition();
            refreshToken();

            const vehiculoGet = await AsyncStorage.getItem('vehiculoVP');
            let fecha = new Date();
            //fecha.setUTCHours(fecha.getUTCHours() - 5);

            let calorias = 0;
            const vehiculoLower = String(vehiculoVP).toLowerCase();

            if (vehiculoLower === 'moto' || vehiculoLower === 'e-moto') {
                calorias = (minutos + (horas * 60)) * 3.3;
            } else if (vehiculoLower === 'peaton' || vehiculoLower === 'caminata') {
                calorias = (minutos + (horas * 60)) * 4.5; // Aproximación para caminata
            } else {
                calorias = (minutos + (horas * 60)) * 6.8;
            }

            const dataTrip = {
                "via_id": uuidv4(),
                "via_usuario": infoUser.DataUser.idNumber,
                "via_vehiculo": vehiculoVP ? vehiculoVP : (vehiculoGet),
                "via_partida": posicionInit.dir,
                "via_llegada": JSON.stringify(dirLlegada),
                "via_fecha_creacion": fecha.toJSON(),
                "via_duracion": (minutos + (horas * 60)),
                "via_kilometros": Number(distanceNative / 1000),
                "via_calorias": calorias,
                "via_co2": Number((distanceNative / 1000) * 1.84),
                "via_img": 'sin img',
                "via_estado": 'FINALIZADA',
            }

            console.log('dataTrip guardando', dataTrip);
            if (props.dataRent.myVehicleSelect === 'avion') {
                const dataAvion = {
                    ...dataTrip,
                    "via_vehiculo": props.dataRent.myVehicleSelect,
                    "via_partida": 'sin definir',
                    "via_llegada": 'sin definir',
                    "via_duracion": 'sin definir',
                    "via_kilometros": 'sin definir',
                    "via_calorias": 'sin definir',
                    "via_co2": 'sin definir',
                    "via_estado": 'PENDIENTE',
                }
                await dispatch(startTrip_avion(dataAvion));
            } else {
                await dispatch(startTrip(dataTrip));
            }

            await save_puntos('Registro de viaje VP');
            setSavingTrip(false); // Resetear estado de carga al finalizar con éxito
        } catch (error) {
            console.log('Error al guardar el viaje:', error);
            setSavingTrip(false);
        }
    }

    const xPuntos = () => {
        let xcometario = 0;
        if (comentario !== '') {
            xcometario = 5;
        }
        const vType = String(vehiculoVP).toLowerCase();
        switch (vType) {
            case 'bicicleta':
            case 'e-bike':
                return (Math.round(distanceNative) * 1) + xcometario;
            case 'carro':
            case 'carro eléctrico':
            case 'moto':
            case 'e-moto':
            case 'taxi':
                return 2;
            case 'e-scooter':
                return Math.round(distanceNative) * 1;
            case 'otros':
                return 1;
            case 'avión':
            case 'avion':
                return 1;
            case 'transporte público':
            case 'transporte':
            case 'bus':
            case 'metro':
            case 'tren':
                return 4;
            case 'caminata':
            case 'peaton':
            case 'peatón':
                return Math.round(distanceNative) * 5;
            default:
                return 1; // Valor por defecto seguro
        }
    };

    const save_puntos = (motivo) => {
        let fecha = new Date();

        const dataP = {
            "pun_id": uuidv4(),
            "pun_usuario": infoUser.DataUser.idNumber,
            "pun_modulo": 'vehiculo_particular',
            "pun_fecha": fecha.toJSON(),
            "pun_puntos": xPuntos(),
            "pun_motivo": motivo
        }
        dispatch(savePuntos(dataP));
    }

    const save_comentario = async () => {
        try {
            await setSaveComent(true);
            console.log('guardando comentarios', props.dataRent.dataTripVP.via_id);

            let fecha = new Date();
            const dataC = {
                "com_id": uuidv4(),
                "com_usuario": infoUser.DataUser.idNumber,
                "com_comentario": comentario || "Sin comentario", // Se enviará solo si tiene valor
                "com_calificacion": calificacion,
                "com_fecha": fecha.toJSON(),
                "com_id_viaje": props.dataRent.dataTripVP.via_id
            };

            console.log('dataC', dataC);
            await dispatch(saveComentarioVP(dataC));
        } catch (error) {
            console.log('Error al guardar el comentario:', error);
            setSaveComent(false); // Resetear estado de carga en caso de error
        }
    };


    const calificacionSelect = (valor) => {
        setCalificacion(valor)
    }

    const indiceCalorias = () => {
        switch (vehiculoVP) {
            case 'Moto':
                return 3.3;
            case 'Carro':
                return 1.3;
            default:
                return 6.8;
        }
    };

    useEffect(() => {
        console.log('entrando al efecto para ver si estamos en primer o segundo plano')
        const handleAppStateChange = async (nextAppState) => {
            // Verificar el estado del rastreo en AsyncStorage
            const isTrackingActive_vp = await AsyncStorage.getItem('isTrackingActive_vp');
            const trackingActive = isTrackingActive_vp === 'true'; // Convertir el valor a booleano
            console.log('que viene el el isTrackingActive_vp', isTrackingActive_vp)
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                console.log('La aplicación ha pasado al primer plano');

                if (isTrackingActive_vp === 'true') {
                    console.log('el el trackingActive active', trackingActive)
                    await recuperarDatosDeStorage();
                    await setViajeActivo(true);
                    //await startTracking();
                }
            } else if (nextAppState === 'background') {
                console.log('La aplicación se está moviendo a segundo plano o cerrando');
                if (isTrackingActive_vp === 'true') {
                    //await startLocationService();  
                }
            }

            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [appState]);

    useEffect(() => {
        const initData = async () => {
            const isTrackingActive_vp = await AsyncStorage.getItem('isTrackingActive_vp');
            if (isTrackingActive_vp === 'true') {
                console.log('Viaje activo detectado al montar, recuperando datos...');
                await recuperarDatosDeStorage();
                await setViajeActivo(true);
                await startLocationService(false); // Iniciar servicio solo si hay viaje activo

                // Cargar posición inicial si existe
                const posicionInicialGuardada = await AsyncStorage.getItem('posicionInicial');
                if (posicionInicialGuardada) {
                    setPosicionInit(JSON.parse(posicionInicialGuardada));
                }
            } else {
                console.log('No hay viaje activo al montar, limpiando datos...');
                await clearTrackingData();
                setTiempoViaje('00:00:00');
                setDistanceNative(0);
                setPosicionInit({});
                setDirLlegada('');
                setCoordinatesNative([]);
                setMinutos(0);
                setHoras(0);
                await recuperarDatosDeStorage();
                await guardarposicionInicial(); // Capturar posición actual para el nuevo viaje
            }
        };

        permisosSP();
        initData();
        getPosition();
    }, [])
    useEffect(() => {
        const handleRequestLocation = () => {
            if (Platform.OS === 'android') {
                LocationServiceModule.requestCurrentLocation();
            }
        };

        const handleGetLastLocation = async () => {
            if (Platform.OS === 'android') {
                try {
                    const location = await LocationServiceModule.getLastKnownLocation();
                    console.log("Latitud:", location.latitude, "Longitud:", location.longitude);
                    //Alert.alert("Latitud:" + location.latitude + " Longitud:" + location.longitude);
                    console.log("Latitud:" + location.latitude + " Longitud:" + location.longitude);
                    console.log("Guardando en UserDefaults las coordenadas");
                    await LocationServiceModule.saveLocationInUserDefaults(location.latitude, location.longitude);
                } catch (error) {
                    console.error("Error al obtener la ubicación:", error);
                }
            }
        };

        // Ejecutar la función inmediatamente
        handleGetLastLocation();

        // Configurar el intervalo para que se ejecute cada minuto (60000 ms)
        const intervalId = setInterval(() => {
            handleGetLastLocation();
        }, 60000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        if (viajeActivo) {
            iniciarCronometro(); // Inicia el cronómetro si el viaje está activo
            sincronizarDatosNativos(); // Inicia la sincronización de datos nativos 5 seg
        }

        return () => {
            if (cronoInterval.current) clearInterval(cronoInterval.current);
            if (syncInterval.current) clearInterval(syncInterval.current);
        };
    }, [viajeActivo]);


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

    //Función para obtener posicionamiento.
    const getPosition = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (positionActual) => {
                    let { latitude, longitude } = positionActual.coords;
                    setLatActual(latitude);
                    setLngActual(longitude);
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.log("error de ubicación", error);
                    reject(error);
                },
                geoSetup
            );
        });
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
        if (props.dataRent.saveTripVP) {
            setFinalizandoViaje(true)
            clearTrackingData()
        }
    }, [props.dataRent.saveTripVP])

    useEffect(() => {
        if (props.dataRent.saveComentariosVp) {
            dispatch(clearStateVp());
            home();
        }
    }, [props.dataRent.saveComentariosVp])


    if (FinalizandoViaje) {
        return (
            <Modal transparent={true}>
                <ScrollView>
                    <View style={stylesModal.contenedor}>
                        <Text style={stylesModal.titulo}>¡Felicitaciones!</Text>
                        {<Image source={Images.trofeo} style={{
                            width: 120,
                            height: 120,
                            marginTop: 10,
                            marginBottom: 10
                        }} />}
                        <Text style={stylesModal.texto}>¡Sumaste 10 puntos más! Sigue viajando y acumulando puntos</Text>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: Dimensions.get('window').width,
                            height: 'auto',
                            position: 'absolute',
                            top: 0
                        }}>
                            <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: Dimensions.get('window').width
                                }} />
                        </View>

                        <View style={stylesModal.cajaCalificacion}>
                            <Text style={stylesModal.titulo}>Califica la experiencia</Text>
                            <Estrellas size={50} calificacionSelect={calificacionSelect} />
                            <Text style={[stylesModal.texto, { color: Colors.$texto50 }]}>Deja tu comentario</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={2}
                                placeholder='Opcional'
                                placeholderTextColor={'black'}
                                style={stylesModal.input}
                                onChangeText={text => setComentario(text)}
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        {
                            props.dataRent.dataTripVP.via_estado === 'PENDIENTE' ?
                                <Text style={stylesModal.texto}>La información se estará validando  en menos de 24 horas</Text>
                                :
                                <></>
                        }
                        {
                            calificacion !== 0 ?
                                <>
                                    {
                                        saveComent ?
                                            <Pressable onPress={() => console.log('save comentario')}
                                                style={{
                                                    textAlign: "center",
                                                    padding: 5,
                                                    margin: 20,
                                                    backgroundColor: Colors.$secundario,
                                                    borderRadius: 50
                                                }}>
                                                <Text style={styles.btnInit}>Guardando...</Text>
                                            </Pressable>
                                            :
                                            <Pressable onPress={() => save_comentario()}
                                                style={{
                                                    textAlign: "center",
                                                    padding: 5,
                                                    margin: 20,
                                                    backgroundColor: Colors.$primario,
                                                    borderRadius: 50
                                                }}>
                                                <Text style={styles.btnInit}>Guardar</Text>
                                            </Pressable>
                                    }
                                </>
                                :
                                <Pressable onPress={() => console.log('guardar', props.dataRent.dataTripVP.via_id)}
                                    style={{
                                        textAlign: "center",
                                        padding: 5,
                                        margin: 20,
                                        backgroundColor: Colors.$secundario,
                                        borderRadius: 50
                                    }}>
                                    <Text style={styles.btnInit}>Guardar</Text>
                                </Pressable>
                        }

                    </View>
                </ScrollView>
            </Modal>
        )
    } else {
        return (
            <View>
                {(props.dataRent.tripEnd === true) ? RootNavigation.navigate('TestExperienceScreen') : <></>}
                {(state.isOpenBackgroundInfoModal) ? openBackgroundInfoModal() : <></>}
                {(state.isOpenBackgroundInfoModal2) ? openBackgroundInfoModal2() : <></>}

                <ScrollView>
                    <View style={estilosStartTrip.contenedor}>
                        <View style={estilosStartTrip.cajaMapa}>
                            <MapView
                                ref={mapRef}
                                loadingEnabled={true}
                                showsMyLocationButton={true}
                                showsCompass={true}
                                showsScale={true}
                                showsUserLocation={true}
                                provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                                style={estilosStartTrip.map2}
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

                                {posicionInit.lat && (
                                    <Marker
                                        key='1'
                                        coordinate={{
                                            latitude: Number(posicionInit.lat),
                                            longitude: Number(posicionInit.lng),
                                        }}
                                        description={"Posicion inicial"}
                                        style={{ height: 40, width: 40, resizeMode: "contain" }}
                                    />
                                )}

                                {<Marker
                                    key='2'
                                    coordinate={{
                                        latitude: Number(latActual),
                                        longitude: Number(lngActual),
                                    }}
                                    description={"Posicion Final"}
                                    style={{ height: 40, width: 40, resizeMode: "contain" }}
                                />}

                                {coordinatesNative.length > 0 && (
                                    <Polyline
                                        coordinates={coordinatesNative}
                                        strokeColor={Colors.$primario} // color de la línea
                                        strokeWidth={10}    // ancho de la línea
                                    />
                                )}

                            </MapView>
                        </View>

                        <View style={styles.cajaCabeza}>

                            <Text style={styles.textTitle}>
                                {
                                    viajeActivo ?
                                        <>
                                            {
                                                deteniendo ?
                                                    'Viaje Pausado'
                                                    :
                                                    'Viaje en Curso'
                                            }
                                        </>
                                        :
                                        'Iniciar Viaje'
                                }
                            </Text>
                            <Pressable
                                onPress={() => { goBack() }}
                                style={styles.btnAtras}>
                                <View>
                                    <Image source={Images.atras_Icon} style={[styles.iconBici, { tintColor: 'black' }]} />
                                </View>
                            </Pressable>
                        </View>

                        <View style={estilosStartTrip.cajaFuncionalidad}>

                            <View style={estilosStartTrip.cajaIndicadoress}>
                                <View style={styles.subcajaIndicadoress}>
                                    <View style={styles.row_}>
                                        <View style={styles.barraCaja}>
                                            <Image source={Images.vpini} style={[styles.iconBici2]} />
                                        </View>
                                        <Text style={styles.textCaja}>Salida</Text>
                                    </View>
                                    <View style={styles.cajaInfo}>
                                        <View style={[styles.cajaInternaInfo]}
                                        >
                                            <Text style={[styles.textos, {
                                                width: 120,
                                                height: 30,
                                                fontSize: 10,
                                                paddingLeft: 10,
                                                fontFamily: Fonts.$poppinslight
                                            }]}>{posicionInit.dir}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.row_}>
                                        <View style={styles.barraCaja}>
                                            <Image source={Images.vpllegada} style={[styles.iconBici2]} />
                                        </View>
                                        <Text style={styles.textCaja}>Llegada</Text>
                                    </View>
                                    <View style={styles.cajaInfo}>
                                        <View style={[styles.cajaInternaInfo]}
                                        >
                                            <Text style={[styles.textos, {
                                                width: 120,
                                                height: 30,
                                                fontSize: 10,
                                                paddingLeft: 10,
                                                fontFamily: Fonts.$poppinslight
                                            }]}>{dirLlegada}</Text>
                                        </View>
                                    </View>
                                </View>


                                <Tarjeta
                                    icono={Images.vpCalorias}
                                    titulo={'Calorías (kcal)'}
                                    texto1={minutos ? ((minutos + (horas * 60)) * indiceCalorias()).toFixed(2) : 0}
                                    texto2={'Kcal'}
                                    elcolor={Colors.$primario}
                                />

                                <Tarjeta
                                    icono={Images.vpTiempo}
                                    titulo={'Tiempo (h:m:s)'}
                                    texto1={tiempoViaje ? tiempoViaje : 0}
                                    texto2={'Min'}
                                    elcolor={Colors.$adicional}
                                />
                                <Tarjeta
                                    icono={Images.distancia_}
                                    titulo={'Distancia (Kms)'}
                                    texto1={distanceNative !== null ? (distanceNative / 1000).toFixed(2) : '00'}
                                    texto2={'Km'}
                                    elcolor={Colors.$adicional}
                                />

                                <WeatherComponent />

                                <Tarjeta
                                    icono={Images.vpCo2}
                                    titulo={'Co2 (Grs)'}
                                    texto1={Number((distanceNative / 1000) * 1.84).toFixed(2)}
                                    texto2={'Co2'}
                                    elcolor={Colors.$primario}
                                />


                            </View>



                            <View style={{
                                width: Dimensions.get("window").width,
                                height: 100,
                                alignItems: "center",
                                justifyContent: "space-around",
                                flexDirection: "column",
                                backgroundColor: Colors.$blanco,

                                bottom: 10,
                            }}>
                                {
                                    viajeActivo ?
                                        <>
                                            {
                                                deteniendo ?
                                                    <View style={{
                                                        flexDirection: "row",
                                                    }}>
                                                        <Pressable onPress={() => startTracking(false)}
                                                            style={{
                                                                textAlign: "center",
                                                                padding: 5,
                                                                margin: 20,
                                                                backgroundColor: Colors.$primario,
                                                                width: Dimensions.get('window').width * .4,
                                                                borderRadius: 50
                                                            }}>
                                                            <Text style={styles.btnInit}>Reanudar</Text>
                                                        </Pressable>
                                                        {
                                                            savingTrip ?
                                                                <View style={{
                                                                    textAlign: "center",
                                                                    justifyContent: "center",
                                                                    padding: 5,
                                                                    margin: 20,
                                                                    backgroundColor: Colors.$secundario50,
                                                                    width: Dimensions.get('window').width * .4,
                                                                    borderRadius: 30
                                                                }}>
                                                                    <Image source={require('../../Resources/gif/loadingbici.gif')} style={{ width: 30, height: 30 }} />
                                                                </View>
                                                                :
                                                                <Pressable onPress={() => GuardarViaje()}
                                                                    style={{
                                                                        textAlign: "center",
                                                                        padding: 5,
                                                                        margin: 20,
                                                                        backgroundColor: Colors.$primario,
                                                                        width: Dimensions.get('window').width * .4,
                                                                        borderRadius: 50
                                                                    }}>
                                                                    <Text style={styles.btnInit}>Finalizar viaje</Text>
                                                                </Pressable>
                                                        }

                                                    </View>
                                                    :
                                                    <Pressable onPress={() => stopTracking()}
                                                        style={{
                                                            textAlign: "center",
                                                            padding: 5,
                                                            margin: 20,
                                                            backgroundColor: Colors.$primario,
                                                            borderRadius: 50
                                                        }}>
                                                        <Text style={styles.btnInit}>Detener viaje</Text>
                                                    </Pressable>
                                            }
                                        </>
                                        :
                                        <Pressable
                                            onPress={() => {
                                                if (props.dataRent.myVehicleSelect === 'avion') {
                                                    GuardarViaje();
                                                } else {
                                                    startTracking(true);
                                                }
                                            }}
                                            style={{
                                                textAlign: "center",
                                                padding: 5,
                                                margin: 20,
                                                backgroundColor: Colors.$primario,
                                                borderRadius: 50
                                            }}>
                                            <Text style={styles.btnInit}>Iniciar Viaje</Text>
                                        </Pressable>
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const stylesModal = StyleSheet.create({
    contenedor: {
        backgroundColor: Colors.$blanco,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        minHeight: Dimensions.get('window').height
    },
    cajaCalificacion: {
        width: Dimensions.get('window').width * .8,
        backgroundColor: Colors.$blanco,
        alignItems: "center",
        padding: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
    },
    titulo: {
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$texto,
        fontSize: 24
    },
    subtitulo: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$texto
    },
    imagen: {
        width: Dimensions.get('window').width * .8,
        height: 'auto',
    },
    texto: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 18,
        textAlign: 'center',
        width: Dimensions.get('window').width * .7,
        marginTop: 10,
        marginBottom: 10
    },
    input: {
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
        backgroundColor: Colors.$secundario50,
        borderColor: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
        width: 250,
        paddingLeft: 20
    },
})


const styles = StyleSheet.create({
    subcajaIndicadoress: {
        width: 140,
        height: 140,
        paddingTop: 10,
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
    btnInit: {
        fontFamily: Fonts.$poppinsregular,
        textAlign: "center",
        fontSize: 18,
        paddingTop: 'auto',
        paddingBottom: 'auto',
        color: 'white',
        color: Colors.$blanco,
        alignSelf: "center",
        width: 250,
    },
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.$blanco,
        borderRadius: 25,
        width: Dimensions.get('window').width,
        position: 'relative',
        marginTop: -30,
    },
    row_: {
        width: "90%",
        height: 'auto',
        backgroundColor: Colors.$secundario50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
        borderRadius: 20
    },
    barraCaja: {
        width: 30,
        height: 30,
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
        marginBottom: 10
    },
    textCaja: {
        fontSize: 12,
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
    btnAtras: {
        position: 'absolute',
        top: 15,
        left: 15,
        width: 50,
        height: 50,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
    },
})

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
    }
}

export default connect(mapStateToProps)(StartTripScreen);

