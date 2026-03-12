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
    Dimensions
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import LottieView from 'lottie-react-native';
import Images from '../../Themes/Images';
import { 
    validateVehicle,
    startTrip,
    validateVehicleSinMysql,
    restartTrip,
    tripEnd,
    savePuntos,
} from '../../actions/actions3g';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Colors from '../../Themes/Colors';
import Geolocation from 'react-native-geolocation-service';
import Cronometro from './Cronometro';
import estilos from './styles/estilos.style';
import estilosStartTrip from './styles/starttrip.style';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import BackgroundService from 'react-native-background-actions';
import { Env } from "../../../keys";
import { v4 as uuidv4 } from 'uuid';
import { refreshToken } from '../../Services/refresh.service';

const mapRef = React.createRef();
const keyMap = Env.key_map_google

function StartTripScreen (props) {
    const dispatch = useDispatch();
    const { 
        infoUser, 
        posicionInicial, 
        endTtripVP, 
        cargarDataposicionInicial, 
        tiempoSegundoPlanoVP, 
        cargarDataTiempoVP } = useContext( AuthContext );
    
    const [ state , setState ] = useState({
        user: '',
        idVehiculo: props.dataRent.myVehicleSelect,
        codigo : '',
        socket: null,
        position1: {
            lat: 37.410000,
            lng: -122.084,
        },
        position2: {
            lat: 37.410000,
            lng: -121.084,
        },
        miPosition: {},
        isOpenBackgroundInfoModal: false,
        isOpenBackgroundInfoModal2: false,
        terminarviaje: false,
        pausa: false,
        cronometro : false,
        torchState: false,
        crono:[],
        duracionViaje: 0
    });

    const [FinalizarViaje, setFinalizarViaje] = useState(false);
    const [FinalizandoViaje, setFinalizandoViaje] = useState(false);
    const [duracionViaje, setDuracionViaje] = useState(false);
    const [segundos, setSegundos] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [horas, setHoras] = useState(0);
    const [activo, setActivo] = useState(false);
    const [intervalo, setIntervalo] = useState(null);
    const [puntosIntermedios, setPuntosIntermedios] = useState(null);
    const [posicionInit, setPosicionInit] = useState(null);
    const [cargaIntermediosAleatorio, setCargaIntermediosAleatorio] = useState(false);
    const [puntosIntermediosAleatorio, setPuntosIntermediosAleatorio] = useState(null);
    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    const [distance, setDistance ] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const [iniciando, setIniciando] = useState(false);

    const displayBackgroundInfoModal = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal: value })
    }

    const displayBackgroundInfoModal2 = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal2: value })
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
                    <View style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: Colors.$primario, justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                            <Image style={{
                                justifySelf: 'center', width: 200,
                                height: 100,
                            }} source={Images.logoHome} />

                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$secundario,
                                fontSize: 22, 
                                fontWeight: "700", 
                                marginTop: 20 }}
                            >Feliz viaje 🥳🚀</Text>
                            
                            
                            
                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Button
                                        title="Aceptar"
                                        color={Colors.$texto}
                                        onPress={() => { displayBackgroundInfoModal(false) }}
                                    />
                                </View>
                            </View>
                        </View>

                        

                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
    }

    const openBackgroundInfoModal2 = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
                height: 20,
            }}>
                <Modal transparent={true} animationType="slide">
                    <View style={{ backgroundColor: "rgba(0, 0, 0, 0.9)", flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: Colors.$primario, justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                            <Image style={{
                                justifySelf: 'center', width: 200,
                                height: 100,
                            }} source={Images.logoHome} />

                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$secundario,
                                fontSize: 22, 
                                fontWeight: "700", 
                                marginTop: 20 }}
                            >Finalizando el viaje 🛞 🚦 🏁</Text>
                            
                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Button
                                        title="Cerrar"
                                        color={Colors.$texto}
                                        onPress={() => { 
                                            displayBackgroundInfoModal2(false)
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
    }

    const cronometroVP = () => {   
        console.log('iniciando cronómetro')
        if (activo) {
          console.log('viaje pausadooooo');
          clearInterval(intervalo);
          setActivo(false);
        } else {
          console.log('iniciando activo')
          const idIntervalo = setInterval(() => {
            setSegundos(prevSegundos => prevSegundos + 1);
          }, 1000);
          setIntervalo(idIntervalo);
          setActivo(true);
        }
    };
    
    useEffect(() => {
        return () => clearInterval(intervalo);
    }, [intervalo]);

    /*const cargarPuntosIntermedios = () => {
        AsyncStorage.getItem('miPosicionVP').then((res) => {
            if (res !== null) {
                setPuntosIntermedios({ 
                    puntosI: JSON.parse(res) 
                });
                obtenerPosicionesAleatorias(puntosIntermedios.puntosI, 10);
            }
        })

        AsyncStorage.getItem('posicionInicial').then((res) => {
            if (res !== null) {
                setPosicionInit({ 
                    inicial: JSON.parse(res) 
                });
            }
        })
    }*/

    function limpiarObjeto(objeto) {
        const objetoLimpio = {};
    
        for (const clave in objeto) {
            const valor = objeto[clave];
            if (valor !== null && valor !== "") {
                objetoLimpio[clave] = valor;
            }
        }
    
        return objetoLimpio;
    }

    /*function obtenerPosicionesAleatorias(objeto, cantidad) {

        // Limpiar el objeto de valores nulos o vacíos
        const objetoLimpio = limpiarObjeto(objeto);

        // Obtener las claves del objeto
        const claves = Object.keys(objetoLimpio);
      
        // Verificar si la cantidad solicitada es mayor que la longitud del objeto
        if (cantidad > claves.length) {
            console.error("La cantidad solicitada es mayor que la longitud del objeto");
            setPuntosIntermediosAleatorio(objeto);
            setCargaIntermediosAleatorio(true);
            return;
        }
      
        // Almacenar las posiciones aleatorias seleccionadas
        const posicionesAleatorias = [];
      
        // Función para generar un número aleatorio en un rango
        function generarNumeroAleatorio(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
      
        // Seleccionar posiciones aleatorias
        while (posicionesAleatorias.length < cantidad) {
          const indiceAleatorio = generarNumeroAleatorio(0, claves.length - 1);
          const posicionAleatoria = claves[indiceAleatorio];
      
          // Evitar duplicados
          if (!posicionesAleatorias.includes(posicionAleatoria)) {
            posicionesAleatorias.push(posicionAleatoria);
          }
        }
      
        // Crear un nuevo objeto con las posiciones aleatorias seleccionadas
        const resultado = {};
        posicionesAleatorias.forEach(posicion => {
          resultado[posicion] = objeto[posicion];
        });
      
        //return resultado;
        setPuntosIntermediosAleatorio(resultado);
        setCargaIntermediosAleatorio(true);
        console.log('se guardo en la variable setPuntosIntermediosAleatorio position aleatoria', resultado);
    }*/

    const incrementarMin = () => {
        console.log('otro minuto');
        setSegundos(0);
        setMinutos(prevMinutos => prevMinutos + 1);
        if (activo) {
            console.log('viaje activo');
        }else{
            console.log('viaje pausado');
        }   
    }

    const guardarposicionInicial = async () => {
        console.log('guardando tiempo en storage :::::');
        await getPosition();
        const datosPI = {
            latInicial: latActual,
            lngInicial: lngActual
        }
        console.log('mostrando cronometro :::::', datosPI);
        try {
            AsyncStorage.mergeItem('posicionInicial', JSON.stringify(datosPI))
            AsyncStorage.getItem('posicionInicial').then((res) => {
                if (res !== null) {
                    console.log( 'objeto posicion inicial VP',{res: JSON.parse(res) } );
                }
            })
        } catch (error) {
           console.log(error);
        }
    }

    const segundoPlano = async () => {
        const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

        const veryIntensiveTask = async (taskDataArguments) => {
            console.log('entrado en funcion de seg plano a veryIntensive Task');
            const { delay } = taskDataArguments;
            await new Promise( async (resolve) => {
                for (let i = 0; BackgroundService.isRunning(); i++) {
                    console.log('segundo plano minuto = ',i);
                    console.log('la distancia desde el segundo plano ', distance)
                    const tiempoSP = {
                        minutos: i,
                    }
                    try {
                        AsyncStorage.setItem('rutaCoordinates', JSON.stringify(coordinates));
                        AsyncStorage.setItem('distanciaRecorrida', JSON.stringify(distance));
                        AsyncStorage.mergeItem('tiempoSegundoPlanoVP', JSON.stringify(tiempoSP))
                        AsyncStorage.getItem('tiempoSegundoPlanoVP').then((res) => {
                            if (res !== null) {
                                console.log( 'objeto tiempo segundo plano VP',{res: JSON.parse(res) } );
                            }
                        })
                    } catch (error) { console.log(error) }
                    
                    await sleep(delay);
                }
            });
        };

        const options = {
            taskName: 'RIDE',
            taskTitle: 'Viaje activo',
            taskDesc: 'Tienes un viaje con vehiculo particular',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#FFDF00',
            linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
            parameters: {
                delay: 10000,
            },
        };
        await BackgroundService.start(veryIntensiveTask, options);
    }

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

    /*const inicioMap = () => {
        //if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
            (position) => {
            console.log('mostando position de nuevo::::::::');
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            setState({ 
                ...state, 
                miPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
            })
            },
            (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        //}
    }*/

    const iniciarViaje = async () =>{
        refreshToken();
        let fecha = new Date(); 
        fecha.setUTCHours(fecha.getUTCHours() - 5);
        let opcionesDeFormato = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric', 
            timeZoneName: 'short' 
        };
        let formatoFecha = new Intl.DateTimeFormat('es-CO', opcionesDeFormato);
        let fechaFormateada = formatoFecha.format(fecha);

        const dataTrip = { 
            "via_id" : uuidv4(),
            "via_usuario" : infoUser.DataUser.idNumber,
            "via_vehiculo" : state.idVehiculo,
            "via_fecha_inicio" : fecha.toJSON(),
            "via_hora_inicio" : fechaFormateada, 
            "via_fecha_fin" : 'sin definir',
            "via_hora_fin" : 'sin definir',
            "via_duracion" : 'sin definir',
            "via_kilometros" : 'sin definir',
            "via_estado" : 'ACTIVA',
        }

        await setIniciando(true);
        //await dispatch(startTrip(dataTrip));
        await cronometroVP();
        await guardarposicionInicial(); 
        //await segundoPlano();

        setTimeout(function(){
            
            //guardamos datos del viaje en la caché del dispositivo 
            try {
                AsyncStorage.mergeItem('viajeVPactivo', JSON.stringify(dataTrip))
                AsyncStorage.getItem('viajeVPactivo').then((res) => {
                    if (res !== null) {
                        console.log( 'se guardo objeto con viaje activo',{res: JSON.parse(res) } );
                        displayBackgroundInfoModal(true)
                    }
                })
            } catch (error) {
            console.log(error);
            }
        }, 1000);
    }
    
    const terminarViaje = () =>{
        let hor = Math.floor(horas / 60);
        let dur = Math.floor(minutos + hor);
        setFinalizarViaje(true);
        setDuracionViaje(dur);
        displayBackgroundInfoModal2(true);
    }

    const detenerSP = async () => {
        console.log('deteniendo tarea en segundo plano');
        await BackgroundService.stop();
    }

    const endTrip = async () => {
        refreshToken();
        let idTrip = '';

        if (props.dataRent.codViajeVP !== '') {
            console.log('codViajeVP si estaba')
            idTrip = props.dataRent.codViajeVP;
        }else{
            console.log('codViajeVP no estaba')
            idTrip = props.dataRent.tripActive.data[0].via_id;
            console.log('PROPS:::: ', props.dataRent.tripActive.data[0].via_id)
        }

        let hor = Math.floor(horas / 60);
        let dur = Math.floor(minutos + hor);

        let fecha = new Date();
        const dataTripend = {
            "via_id" : idTrip,
            "via_fecha_fin" : fecha.toJSON(),
            "via_hora_fin" : fecha.getUTCHours(),
            "via_duracion" : dur,
            "via_kilometros" : distance.toFixed(4),
            "via_estado" : 'FINALIZADA',
        }

        if(dur > 30) {
            durr = 1;
        }else{
            durr = 0;
        }
        let punto = Math.round(distance + 1 + durr) 

        const dataP = {
            "pun_id": "0",
            "pun_usuario": infoUser.DataUser.idNumber,
            "pun_prestamo": idTrip,
            "pun_fecha": fecha.toJSON(),
            "pun_puntos": Number(punto),
            "pun_motivo": "viaje vehiculo particular",
            "pun_estado": "ACTIVA"
        }
        setTimeout(function(){
            detenerSP();
            setIniciando(false);
            setFinalizarViaje(false);
            setFinalizandoViaje(true);
            dispatch(savePuntos(dataP));
            dispatch(tripEnd(dataTripend));
        }, 1000); 
    }

    const irSoporte = () => {
        console.log('ir a soporte ahora')
        props.navigationProp.navigate('SupportScreen');
    }

    const calculateDistance = (coord1, coord2) => {
        //console.log('en la funcion de calcularDistancia coord1', coord1);
        //console.log('en la funcion de calcularDistancia coord2', coord2);
        const lat1 = coord1.latActual;
        const lon1 = coord1.lngActual;
        const lat2 = coord2.latitude;
        const lon2 = coord2.longitude;
        
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        //console.log('caculando distacia lo que esta en A', a);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        //console.log('caculando distacia lo que esta en C', a);
        const distance = R * c;
        //console.log('caculando distacia distancia =', distance);
        if (distance > 1000) {
            return 0;
        }else{
           return distance;
        }
    };


    useEffect(() => {
        getPosition();
    },[])

    

    /*useEffect(() => {
        getPosition();
            console.log('ENTRANDO AL EFECTO PARA OBSEVAR LA POSICION')
            let initialCoordinates = { latActual, lngActual };
            console.log('LA POSICION INICIAL ES :::::: initielCoordinates', initialCoordinates);
            // Obtener ubicación en tiempo real
            const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newCoordinates = { latitude, longitude };
                //console.log('las newCoordinates', newCoordinates);
                //console.log('las cordenadas', coordinates);
                setCoordinates([...coordinates, newCoordinates]);
                //console.log('las cordenadasdespues de actualizar', coordinates);
                // Calcular distancia en tiempo real
                if (initialCoordinates) {
                    const newDistance = distance + calculateDistance(initialCoordinates, newCoordinates);
                    //console.log('::::: New DISTANCE :::::', newDistance);
                    setDistance(newDistance);
                    AsyncStorage.setItem('rutaCoordinates', JSON.stringify(coordinates));
                    AsyncStorage.setItem('distanciaRecorrida', JSON.stringify(distance));
                }
            },
            (error) => {
                console.log(error);
            },
            { enableHighAccuracy: true, distanceFilter: 10 }
            ); 
            return () => {
            // Detener la observación cuando el componente se desmonta
            Geolocation.clearWatch(watchId);
            };
    }, [coordinates, distance]);*/

    useEffect(() => {
        getPosition();
        console.log('ENTRANDO AL EFECTO PARA OBSERVAR LA POSICIÓN');
        let initialCoordinates = { latActual, lngActual };
        console.log('LA POSICIÓN INICIAL ES :::::: initialCoordinates', initialCoordinates);
    
        // Configurar el intervalo para actualizar cada 5 segundos (5000 ms)
        const intervalId = setInterval(() => {
            // Obtener la ubicación en tiempo real
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newCoordinates = { latitude, longitude };
                    setCoordinates((prevCoords) => [...prevCoords, newCoordinates]);
    
                    // Calcular distancia en tiempo real
                    if (initialCoordinates) {
                        const newDistance = distance + calculateDistance(initialCoordinates, newCoordinates);
                        setDistance(newDistance);
                        AsyncStorage.setItem('rutaCoordinates', JSON.stringify([...coordinates, newCoordinates]));
                        AsyncStorage.setItem('distanciaRecorrida', JSON.stringify(newDistance));
                    }
                },
                (error) => {
                    console.log(error);
                },
                { enableHighAccuracy: true }
            );
        }, 5000);
    
        return () => {
            // Limpiar el intervalo cuando el componente se desmonta
            clearInterval(intervalId);
        };
    }, [coordinates, distance]);

    const cargarCordenadasSP = () => {
        AsyncStorage.getItem('miPosicionVP').then((res) => {
            if (res !== null) {
                setCoordinates({ 
                    puntosI: JSON.parse(res) 
                });
            }
        })

        AsyncStorage.getItem('posicionInicial').then((res) => {
            if (res !== null) {
                setPosicionInit({ 
                    inicial: JSON.parse(res) 
                });
            }
        })
    }

    const recuperarCoordenadasSP = async () => {
        // Para recuperar datos
        const storedCoordinates = await AsyncStorage.getItem('rutaCoordinates');
        const storedDistance = await AsyncStorage.getItem('distanciaRecorrida');

        if (storedCoordinates) {
        setCoordinates(JSON.parse(storedCoordinates));
        }

        if (storedDistance) {
        setDistance(JSON.parse(storedDistance));
        }

    }

    useEffect(() => {
        if (props.dataRent.tripActiveOK === true) {
            cargarDataposicionInicial()
            cargarDataTiempoVP()
            setMinutos(tiempoSegundoPlanoVP.tiempoVP.minutos);
            console.log('viaje activo entro ::: DATOS DEL tiempo segundo planoVP:::', tiempoSegundoPlanoVP)
            console.log('viaje activo entro ::: DATOS DEL posicion inicial VP:::', posicionInicial)
            //setCoordinates([...coordinates, newCoordinates]);
            cronometroVP();
            //cargarCordenadasSP();
            recuperarCoordenadasSP();
            dispatch(restartTrip());
        }
    },[props.dataRent.tripActiveOK === true])

    const reiniciandoDatos = () => {
        setFinalizandoViaje(false);
        setTimeout(function(){
            RootNavigation.navigate('TestExperienceScreen');
        }, 2000); 
    }

    if(FinalizandoViaje){
        return (
          <Modal transparent={true}>
            {(props.dataRent.tripEnd === true) ? 
                reiniciandoDatos()
                : 
                <></>
            }
            <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LottieView source={require('../../Resources/Lotties/bicycle.json')} autoPlay loop style={{width: '100%',height: '100%'}}/>
                </View>
            </View>
          </Modal>
        )
    }else{
        return (
        <ImageBackground source={Images.grayBackground}>
            {(props.dataRent.tripEnd === true) ? RootNavigation.navigate('TestExperienceScreen') : <></>}
            {(state.isOpenBackgroundInfoModal) ? openBackgroundInfoModal() : <></>}
            {(state.isOpenBackgroundInfoModal2) ? openBackgroundInfoModal2() : <></>}
        
        <SafeAreaView>
            <ScrollView>
                <View style={estilosStartTrip.contenedor}>  
                    <View style={estilosStartTrip.cajaMapa}>

                    <View style={estilosStartTrip.cajaDatosItemHome}>
                        <Pressable 
                            onPress={() => { RootNavigation.navigate('Home'); }} >
                            <View>
                            <Image source={Images.home} style={estilosStartTrip.vpkm2}/>
                            </View>                                           
                        </Pressable>
                    </View>

                    <MapView
                        ref={mapRef}
                        loadingEnabled={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        showsScale={true}
                        showsUserLocation={true}
                        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                        style={ estilosStartTrip.map2 }
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
                    
                    {<Marker
                        key='1'
                        coordinate={{
                            latitude: Number(latActual),
                            longitude: Number(lngActual),
                        }}
                        description={"Posicion Final"}
                        image={require('../../Resources/Images/icon_map.png')}
                        style={{ height: 40, width: 40, resizeMode: "contain" }} 
                    />}

                    <Polyline coordinates={coordinates} strokeWidth={5} />

                    </MapView>
                    {/*<View style={ estilosStartTrip.cajaIndicadoresClima }>
                        <View style={ estilosStartTrip.cajaclima }>
                            <View style={ estilosStartTrip.itemClima }>
                                <Text style={ estilosStartTrip.textClima }>Bogotá</Text>
                            </View>
                            <View style={ estilosStartTrip.itemClima }>
                                <Text style={ estilosStartTrip.textClima2 }>20°</Text>
                            </View>
                            <View style={ estilosStartTrip.itemClima }>
                                <Image source={Images.nublado_Icon} style={ estilosStartTrip.imgClima } />
                                <Text style={ estilosStartTrip.textClima }>nublado</Text>
                            </View>
                        </View>
                    </View>*/}

                    </View> 

                    <View style={estilosStartTrip.cajaFuncionalidad}>
                        { 
                        (FinalizarViaje) ?
                        <>
                        
                        <View style={estilosStartTrip.cajaDatosResumen}>
                            <View style={estilosStartTrip.cajaDatosItem}>
                                <Image source={Images.co2_Icon} style={estilosStartTrip.vpkm}/>
                                <Text style={estilosStartTrip.letranegra}>{(249 * distance).toFixed(4) }</Text>
                            </View>
                            <View style={estilosStartTrip.cajaDatosItem}>
                                <Image source={Images.clock_Icon} style={estilosStartTrip.vpkm}/>
                                <Text style={estilosStartTrip.letranegra}>{ duracionViaje }</Text>
                            </View>
                            <View style={estilosStartTrip.cajaDatosItem}>
                                <Image source={Images.km_Icon} style={estilosStartTrip.vpkm}/>
                                <Text style={estilosStartTrip.letranegra}>
                                    { distance.toFixed(4) }</Text>
                            </View>                                    
                        </View>                            

                        

                        <View style={estilosStartTrip.cajaBtnTerminar}>
                            <Pressable 
                                onPress={() => { endTrip() }} 
                                style={estilosStartTrip.btnSoporte}>
                                <Text style={estilosStartTrip.letrablanca}>TERMINAR</Text>                                            
                            </Pressable>
                        </View>   

                        </>
                        :
                        <>  
                        <View style={ estilosStartTrip.cajainformacion }>

                        <View style={ props.dataRent.inicioviaje === false ? estilosStartTrip.cajaIndicadores : estilosStartTrip.cajaIndicadoresTrip}>                                    
                            
                            <View style={estilosStartTrip.cajaSubIn}>
                                {
                                props.dataRent.inicioviaje === false ? 
                                <></> 
                                : 
                                <>
                                <Text style={ estilosStartTrip.textClima }>
                                    TIEMPO
                                </Text>
                                <View style={estilosStartTrip.subIndicadores}>
                                    <Text style={estilosStartTrip.textsubIndicadures}>
                                    
                                    { (minutos < 10) ? " 0" + minutos:"" + minutos} : 
                                    { (segundos < 10) ? " 0" + segundos:"" + segundos}

                                    { (segundos === 60) ? incrementarMin() : <></>}
                                    </Text>
                                </View>
                                </>
                                
                                }
                                
                            </View>
                                
                            <View style={estilosStartTrip.cajaSubIn}>
                                {
                                props.dataRent.inicioviaje === false ? 
                                <></> 
                                : 
                                <>
                                <Text style={ estilosStartTrip.textClima }>
                                    DISTANCIA km
                                </Text>
                                <View style={estilosStartTrip.subIndicadores}>
                                    <Text style={estilosStartTrip.textsubIndicadures}>
                                    { distance.toFixed(4) } 
                                    </Text>
                                </View>
                                </>
                                }
                                
                            </View>

                        </View>
                            <View style={ props.dataRent.inicioviaje === true ? estilosStartTrip.cajabotones : estilosStartTrip.cajabotones2 }>
                                { (activo) ? //estado inicial false
                                <>
                                    { 
                                    props.dataRent.cargandoFinalizar === true ?
                                    <View style={ estilosStartTrip.estamosFinalizando}>
                                        <Text>Estamos finalizando ....</Text>
                                    </View>
                                    :
                                    <>
                                    <Pressable 
                                        onPress={() => { 
                                            cronometroVP()
                                        }}
                                        style={estilosStartTrip.botonIniciarViaje3}>
                                        <Text style={estilosStartTrip.btnTextoPausarViaje}>DETENER</Text>
                                    </Pressable>   
                        
                                    </>
                                    }
                                    
                                </>
                                : 
                                <>                                    
                                
                                {
                                    (props.dataRent.inicioviaje === true) ?
                                    <>


                                    <Pressable 
                                        onPress={() => { cronometroVP() }}
                                        style={estilosStartTrip.botonReanudar}>
                                        <Text style={estilosStartTrip.btnTextoPausarViaje}>REANUDAR</Text>
                                    </Pressable>  
                                    <Pressable 
                                        onPress={() => { terminarViaje() }}
                                        style={estilosStartTrip.botonFinalizar}>
                                        <Text style={estilosStartTrip.btnTextoPausarViaje}>FINALIZAR</Text>
                                    </Pressable>          
                                    </>
                                    :
                                    <>
                                    {
                                        iniciando ?
                                        <Pressable 
                                            onPress={() => { 
                                                console.log('iniciando el viaje');
                                            }}
                                            style={estilosStartTrip.botonIniciarViaje4}>
                                            <Text style={estilosStartTrip.btnTextoIniciarViaje}>Iniciando..</Text>
                                        </Pressable>
                                        :
                                        <Pressable 
                                            onPress={() => { 
                                                iniciarViaje()
                                            }}
                                            style={estilosStartTrip.botonIniciarViaje4}>
                                            <Text style={estilosStartTrip.btnTextoIniciarViaje}>Iniciar</Text>
                                        </Pressable>
                                    }
                                    
                                    </>
                                }                                    
                                </>
                                }
                            </View>
                            
                            
                            
                            
                        </View>
                        </>      
                        }   
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        </ImageBackground>
        );    
    }
   
    
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
    }
}

export default connect(mapStateToProps)(StartTripScreen);


