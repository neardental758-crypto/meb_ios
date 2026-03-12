import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,
    Linking,
    Alert,
} from 'react-native';
import { Content } from 'native-base';
//Layout
import Images from '../../Themes/Images';
//Components
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    validateVehicle,
    startTrip,
    validateVehicleSinMysql,
    restartTrip,
    tripEnd,
} from '../../actions/actions3g';
import styles from '../Screens/Styles/FaqScreen.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Colors from '../../Themes/Colors';
import Geolocation from 'react-native-geolocation-service';
//import Cronometro from './Cronometro';
import estilos from './Styles/estilos.style';
import estilosStartTrip from './Styles/starttrip.style';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';


const mapRef = React.createRef();

function VistaTripScreen (props) {
    
    const [ state , setState ] = useState({
        user: 'usu_bc',
        //idVehiculo: props.dataRent.myVehicleSelect,// esta es la linea correcta
        idVehiculo: 'trans_publico',
        codigo : '',
        //map
        socket: null,
        position1: {
            lat: 37.410000,
            lng: -122.084,
        },
        position2: {
            lat: 37.410000,
            lng: -121.084,
        },
        //geolocalizacion
        miPosition: {},
        isOpenBackgroundInfoModal: false,
        terminarviaje: false,
        pausa: false,
        cronometro : false,
        torchState: false,
        crono:[]
    });

    //////////////// CRONOMETRO ///////////////////
    //const [segundos, setSegundos] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos : 0);
    //const [minutos, setMinutos] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos : 0);
    //const [horas, setHoras] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.horas ? props.dataRent.CronometroStorageVP.CronometroStorageVP.horas : 0);
    const [segundos, setSegundos] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [horas, setHoras] = useState(0);
    const [activo, setActivo] = useState(false);
    const [intervalo, setIntervalo] = useState(null);

    const cronometroVP = () => {   
        console.log('iniciando cronómetro')
        if (activo) {
          console.log('viaje pausadooooo')
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

    const pausarViaje = () =>{
        cronometroVP();
        //setState({ ...state,  pausa: true })
        //setActivo(true);
    }

    const reanudarViaje = () =>{
        //setState({ ...state,  pausa: false })
        cronometroVP();
        //setActivo(false);
    }

    const incrementarMin = () => {
        console.log('otro minuto');
        setSegundos(0);
        setMinutos(minutos + 1);
        if (activo) {
            getPosition();
            guardarsegundosCronometroStorageVP(); 
        }else{
            console.log('viaje pausado')
        }   
    }

    const guardarsegundosCronometroStorageVP = () => {
        const datos = {
          segundos: segundos,
          minutos: minutos,
          horas : horas,
          latAct: latActual,
          lngActual: lngActual
        }
        try {
          AsyncStorage.mergeItem('cronometroVP', JSON.stringify(datos))
          AsyncStorage.getItem('cronometroVP').then((res) => {
            if (res !== null) {
                console.log( 'objeto cronometro VP',{res: JSON.parse(res) } );
            }
        })
        } catch (error) {
          console.log(error);
        }
    }
    /////////////// END CRONOMETRO ///////////////////


    ////////////// OBTENIENDO LA POSICIÖN ////////////

    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    
    const getPosition = () =>{
        console.log('CALCULANDO LA POSICION')
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
        console.log("UBICACION: ", latitude + "  " + longitude)
        console.log("UBICACION en el state: ", latActual + "  " + lngActual)
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
    ///////////// END OBTENIENDO POSICIÖN ////////////////


    /*const cargarDataposicionInicial = () => { 
        AsyncStorage.getItem('cronometroVP').then((res) => {
            if (res !== null) {
                console.log( 'objeto cronometro VP',{res: JSON.parse(res) } );
                console.log( 'objeto cronometro VP minutos',{res: JSON.parse(res) } );
                setState({ 
                    ...state,
                    crono: JSON.parse(res) 
                });
            }
        })
    }*/

    const home = () => {
        props.navigationProp.navigate('DrawerHomeScreen');
    }

    const verState = () => {
        console.log('EL STATE:::', state)
        console.log('LAS PROPS:::', props.dataRent.tripActiveOK)
    }

    const goBack = () => {
        props.navigation.goBack();
    }
    //HOOK componentDidMount se ejecuta despues del primer renderizado
    const inicioMap = () => {
        /* if (Platform.OS === 'android' && !state.isOpenBackgroundInfoModal) {
            displayBackgroundInfoModal(true)
        } 
        if(Platform.OS == 'ios'){
            props.getPermissions();
        }
        props.validatePenalty();
        props.getStations();
        props.socketConection(props);*/
        //getPosition();
        /*setTimeout(() => {
            //props.routingIfHasTrip();
            console.log('imprimiendo cada 1500ms')
        }, 1500);*/
        console.log('ejecutando el componentDidmount');
       
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
    }
    /**
     * INICIAR VIAJE
     * CRONOMETRO 
     */
    /*const incrementa = () =>{
        console.log('incrementando')
        if (segundos === 10) {
            console.log('llego a 10')
            setMinutos(minutos + 1)
            setSegundos(0)
        }

        if (minutos === 2) {
            setHoras( horas + 1)
            setMinutos(0)
        }

    }*/

    
    

    const iniciarViaje = () =>{
        console.log('iniciando Viaje');
        let fecha = new Date(); //comentado desde aca sin conexion mysql
        const dataTrip = { 
            "via_id" : fecha.getTime(),
            "via_usuario" : state.user,
            "via_vehiculo" : state.idVehiculo,
            "via_fecha_inicio" : fecha,
            "via_hora_inicio" : fecha.getUTCHours(),
            "via_fecha_fin" : 'sin definir',
            "via_hora_fin" : 'sin definir',
            "via_duracion" : 'sin definir',
            "via_kilometros" : 'sin definir',
            "via_estado" : 'ACTIVA',
        }
        props.startTrip(dataTrip);
    }
    
    const terminarViaje = () =>{
        setState({ 
            ...state,  
            terminarviaje: true 
        })
    }

    const endTrip = async () => {
        console.log('finalizando viaje y mostrando test experiencia', props.dataRent.codViajeVP)
        let idTrip = '';

        if (props.dataRent.codViajeVP !== '') {
            console.log('codViajeVP si estaba')
            idTrip = props.dataRent.codViajeVP;
        }else{
            console.log('codViajeVP no estaba')
            idTrip = props.dataRent.tripActive.data[0].via_id;
            console.log('PROPS:::: ', props.dataRent.tripActive.data[0].via_id)
        }

        let fecha = new Date();
        let dataTripend = {
            "via_id" : idTrip,
            "via_fecha_fin" : fecha,
            "via_hora_fin" : fecha.getUTCHours(),
            "via_duracion" : minutos,
            "via_kilometros" : 'km',
            "via_estado" : 'FINALIZADA',
        }
        console.log('LA DATA PARA FINALIZAR',dataTripend)
        await props.tripEnd(dataTripend);
    }

    const irSoporte = () => {
        console.log('ir a soporte ahora')
        props.navigationProp.navigate('SupportScreen');
    }

    const noTerminarViaje = () => {
        console.log('Queiro seguir en el viaje');
        setState({ ...state,  terminarviaje: false, pausa: false  })
        //cronometroVP();
    }

    const guardarViaje = () => {
        console.log('GUARDANDO VIAJE...');
    }

    

    

    const cargarStorage = async () => {
        try {
            await AsyncStorage.getItem('movilidadStorage').then((res) => {
                if (res !== null) {
                    state = JSON.parse(res)
                    console.log('state actualizado', state);
                    console.log('fecha inicio: ', state.fechaInicio);
                    console.log('movilidad: ', state.tipoVehiculo);
                }
            })
        } catch (error) {
          console.log(error);
        }
    }

    const crearStorage = () => {
        const datos = {
          inicio: true,
          fechaInicio: "el dia de hoy siiiii",
          fechaFinal: "",
          horaInicio: "",
          horaFinal: "",
          userId: "",
          ubicacionInicial: "",
          ubicacionfinal: "",
          puntos: "",
          tipoVehiculo: "carro particular",
        }
        try {
            AsyncStorage.getItem('movilidadStorage').then((res) => {
                if (res !== null) {
                    AsyncStorage.mergeItem('movilidadStorage', JSON.stringify(datos))
                    console.log( 'objeto movilidadStorage',{res: JSON.parse(res) } );
                    cargarStorage();
                }else{
                    AsyncStorage.setItem('movilidadStorage',JSON.stringify(datos));
                    console.log('se creo el storage');
                }
            })
        } catch (error) {
          console.log(error);
        }
    }

    const iniciarMovilidad = () =>{  
        setState({ ...state,  inicio: true});
        crearStorage()   
    }

    const finalizarMovilidad = () =>{  
        setState({ ...state,  inicio: false});
    }

    const probandoStorage = () =>{
        iniciarMovilidad();
    }

    const guardarRegistro = () =>{
        console.log('guardando el registro VP')
        if (state.tipo !== '' && state.marca !== '' && state.color !== '') {
            const data = {
            "codigoQR": state.codigo, 
            "tipo": state.tipo, 
            "marca": state.marca, 
            "modelo": state.modelo, 
            "color": state.color,
            "serial": state.serial
            }

            const url = "http://192.168.1.10:3002/api/registroVehiculoParticular/register";
            const request = {
                method: 'POST',
                body: JSON.stringify(data),
            };
            fetch(url, request)
            .then(dato =>{ 
                console.log('Guardando REGISTRO VP');
                console.log('la data', data);
                console.log(dato);
                setState({ ...state,  registroBici: true })
            })
        }else{
            console.log('Los campos estan vacios')
        }
    }

    const validarCodigo = async () =>{
        props.validateVehicleSinMysql();
        /*if (state.codigo === '') {
            console.log('Por favor ingrese el codigo')  
            Alert.alert("Sin codigo para validar",":)",
                [{ text: "OK", onPress: () => {
                    console.log("OK");
                }}]
            );          
        }else if(state.codigo === '0000'){
            //sin conexion a mysql
            props.validateVehicleSinMysql();
        }else{
            const data = {
                "vus_id": state.codigo, 
                "vus_usuario": state.user
            }
            let cod = state.codigo;
            let user = state.user;
            props.validateVehicle(cod, user);
        }*/
    }

    const onSuccess = (e) => {
        Linking.openURL(e.data).catch(err =>
          console.error('An error occured', err)
        );
    };

    useEffect(() => {
        inicioMap();
        getPosition();
    },[])

    useEffect(() => {
        if (props.dataRent.tripActiveOK === true) {
            
            console.log('viaje activo entro')
            cronometroVP();
            props.restartTrip()
        }
    },[props.dataRent.tripActiveOK === true])

    /**
    setSegundos(props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos);
    setMinutos(props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos);
    setHoras(props.dataRent.CronometroStorageVP.CronometroStorageVP.horas);
     */

    /*useEffect(() => {
        setSegundos(state.cronometro.segundos);
        setMinutos(state.cronometro.minutos);
        setHoras(state.cronometro.horas);
    },[state.cronometro])*/

    
    return (

        <ImageBackground source={Images.grayBackground} style={styles.settingBackground}>
            {(props.dataRent.tripEnd === true) ?  props.navigationProp.navigate('TestExperienceScreen') : <></>}
            <SafeAreaView style={estilos.safeArea}>
                <Content>
                    <View style={estilos.contenedor}>
                        <View style={estilosStartTrip.contentTop}>
                            
                        <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 10, backgroundColor : Colors.$primario}}>
                            <View >
                                <Image style={{marginLeft: moderateScale(10), width : horizontalScale(350), height : verticalScale(55)}} source={Images.flechaAtras} />
                            </View>
                        </TouchableOpacity>
                            
                            {/*<View style={estilos.contentTitle}>
                                <Text style={estilos.title}>{activo ? 'Viaje Iniciado': 'Iniciar viaje'}</Text>
                                <View style={estilosStartTrip.subRaya} />
                            </View>*/}
                    
                        </View>

                        <View>       
                        <>
                            { 
                            (state.terminarviaje) ?
                            <>
                            <View>
                                <Image source={Images.fondo2} style={estilosStartTrip.fondo2}/>
                                
                                <View style={estilosStartTrip.cajalogo2}>
                                    <Image source={Images.mapaResumen} style={estilosStartTrip.logocolor}/>
                                </View>

                                {/*<View style={estilosStartTrip.cajalogo}>
                                    <Image source={Images.resumen} style={estilosStartTrip.resumen}/>
                                    <Text style={estilosStartTrip.letraResumen}>Resumenn</Text>
                                 </View>*/}

                                <View style={estilosStartTrip.cajaDatosResumen}>
                                    <View style={estilosStartTrip.cajaDatosItem}>
                                        <Image source={Images.co2} style={estilosStartTrip.vpkm}/>
                                        <Text style={estilosStartTrip.letranegra}>2.345</Text>
                                    </View>
                                    <View style={estilosStartTrip.cajaDatosItem}>
                                        <Image source={Images.reloj} style={estilosStartTrip.vpkm}/>
                                        <Text style={estilosStartTrip.letranegra}>{ minutos } min</Text>
                                    </View>
                                </View>

                                <View style={estilosStartTrip.cajaDatosResumen}>
                                    <View style={estilosStartTrip.cajaDatosItem}>
                                        <Image source={Images.calories} style={estilosStartTrip.vpkm}/>
                                        <Text style={estilosStartTrip.letranegra}>230</Text>
                                    </View>
                                    <View style={estilosStartTrip.cajaDatosItem}>
                                        <Image source={Images.calories} style={estilosStartTrip.vpkm}/>
                                        <Text style={estilosStartTrip.letranegra}>{ minutos } min</Text>
                                    </View>
                                </View>

                                <View style={estilosStartTrip.cajaDatosResumen}>
                                    <View style={estilosStartTrip.cajaDatosItem}>
                                        <Image source={Images.calories} style={estilosStartTrip.vpkm}/>
                                        <Text style={estilosStartTrip.letranegra}>1.3 km</Text>
                                    </View>
                                    <View style={estilosStartTrip.cajaDatosItem}>
                                        <Image source={Images.home} style={estilosStartTrip.vpkm}/>
                                        <Text style={estilosStartTrip.letranegra}>home</Text>
                                    </View>
                                </View>

                                <View style={estilosStartTrip.cajaBtnTerminar}>
                                    <TouchableOpacity 
                                        onPress={() => { endTrip() }} 
                                        style={estilosStartTrip.btnSoporte}>
                                        <Text style={estilosStartTrip.letrablanca}>Terminar</Text>                                            
                                    </TouchableOpacity>
                                </View>
                                

                                {/*<View style={estilosStartTrip.cajaSoporte}>
                                    <Image source={Images.vpsoporte} style={estilosStartTrip.vpsoporte}/>
                                    <TouchableOpacity 
                                        onPress={() => { irSoporte() }} 
                                        style={estilosStartTrip.btnSoporte}>
                                        <Text style={estilosStartTrip.letrablanca}>Soporte</Text>                                            
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        onPress={() => { noTerminarViaje() }} 
                                        style={estilosStartTrip.btnSoporte}>
                                        <Text style={estilosStartTrip.letrablanca}>volver</Text>                                            
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        onPress={() => { endTrip() }} 
                                        style={estilosStartTrip.btnSoporte}>
                                        <Text style={estilosStartTrip.letrablanca}>Terminar</Text>                                            
                                    </TouchableOpacity>
                                </View>*/}
                            
                            </View>
                            </>
                            :
                            <>  
                            <View style={ estilosStartTrip.cajainformacion }>
                                <View style={ estilosStartTrip.cajabotones }>
                                    { (activo) ? //estado inicial false
                                    <>
                                        
                                    
                                        <TouchableOpacity 
                                            onPress={() => { 
                                                pausarViaje()
                                            }}
                                            style={estilosStartTrip.botonIniciarViaje2}>
                                            <Text style={estilosStartTrip.btnTextoPausarViaje}>DETENER</Text>
                                        </TouchableOpacity>    
                                    </>
                                    : 
                                    <>
                                    <MapView
                                        ref={mapRef}
                                        loadingEnabled={true}
                                        showsMyLocationButton={true}
                                        showsCompass={true}
                                        showsScale={true}
                                        showsUserLocation={true}
                                        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                                        style={ estilosStartTrip.map }
                                        region={{
                                            latitude: state.miPosition.lat ? state.miPosition.lat : 0,
                                            longitude: state.miPosition.lng ? state.miPosition.lng : 0,
                                            latitudeDelta: 0.0421,
                                            longitudeDelta: 0.0421,
                                        }}
                                        onMapReady={() => {
                                            setState({ ...state,  paddingTop: 5 })
                                        }}
                                    >
                                        {/*<Marker
                                            //draggable
                                            key='1'
                                            coordinate={{
                                                latitude: Number(state.miPosition.lat),
                                                longitude: Number(state.miPosition.lng),
                                            }}
                                            description={"This is a marker in React Native"}
                                        /> */} 

                                        <Marker
                                            //draggable
                                            key='1'
                                            coordinate={{
                                                latitude: Number(state.position1.lat),
                                                longitude: Number(state.position1.lng),
                                            }}
                                            description={"This is a marker in React Native"}
                                        />
                                
                                    </MapView>
                                    <TouchableOpacity 
                                        onPress={() => { 
                                            iniciarViaje(),
                                            cronometroVP();
                                        }}
                                        style={estilosStartTrip.botonIniciarViaje}>
                                        <Text style={estilosStartTrip.btnTextoIniciarViaje}>Iniciar viaje</Text>
                                    </TouchableOpacity>
                                    {
                                        (props.dataRent.inicioviaje === true) ?
                                        <TouchableOpacity 
                                            onPress={() => { reanudarViaje() }}
                                            style={estilosStartTrip.botonIniciarViaje}>
                                            <Text style={estilosStartTrip.btnTextoPausarViaje}>REANUDAR</Text>
                                        </TouchableOpacity> 
                                        :
                                        <></>
                                    }
                                    
                                    </>
                                    }
                                </View>
                                
                                <View style={ props.dataRent.inicioviaje === false ? estilosStartTrip.cajaIndicadores : estilosStartTrip.cajaIndicadoresTrip}>

                                    
                                    
                                    <View style={estilosStartTrip.cajaSubIn}>
                                        {props.dataRent.inicioviaje === false ? <></> : <Text style={ estilosStartTrip.textClima }>TIEMPO</Text>}
                                        <View style={estilosStartTrip.subIndicadores}>
                                            <Text style={estilosStartTrip.textsubIndicadures}>
                                            { (horas < 10 ) ? "0" + horas:"" + horas} :  
                                            { (minutos < 10) ? " 0" + minutos:"" + minutos} : 
                                            { (segundos < 10) ? " 0" + segundos:"" + segundos}

                                            { (segundos === 60) ? incrementarMin() : <></>}
                                            </Text>
                                        </View>
                                        {/*<Cronometro />*/}
                                    </View>
                                    
                                    <View style={estilosStartTrip.cajaSubIn}>
                                        {props.dataRent.inicioviaje === false ? <></> : <Text style={ estilosStartTrip.textClima }>DISTANCIA</Text>}
                                        <View style={estilosStartTrip.subIndicadores}>
                                            <Text style={estilosStartTrip.textsubIndicadures}>
                                            0.0 kms
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        (props.dataRent.inicioviaje === true) ?
                                        <View style={estilosStartTrip.cajaSubIn}>
                                            <Text style={ estilosStartTrip.textClima }>PUNTOS</Text>
                                            <View style={estilosStartTrip.subIndicadores}>
                                                
                                                <Text style={estilosStartTrip.textsubIndicadures}>
                                                10
                                                </Text>
                                            </View>
                                        </View>
                                        :
                                        <></>
                                    }
                                        
                                        
                                </View>
                                
                                { 
                                    (props.dataRent.inicioviaje === false) ? 
                                    <View style={ estilosStartTrip.cajaIndicadoresClima }>
                                        
                                        <View style={ estilosStartTrip.cajaclima }>
                                            <View style={ estilosStartTrip.itemClima }>
                                                <Text style={ estilosStartTrip.textClima }>11:00</Text>
                                                <Image source={Images.co2} style={ estilosStartTrip.imgClima } />
                                                <Text style={ estilosStartTrip.textClima }>16°</Text>
                                            </View>
                                            <View style={ estilosStartTrip.itemClima }>
                                                <Text style={ estilosStartTrip.textClima }>12:00</Text>
                                                <Image source={Images.co2} style={ estilosStartTrip.imgClima } />
                                                <Text style={ estilosStartTrip.textClima }>16°</Text>
                                            </View>
                                            <View style={ estilosStartTrip.itemClima }>
                                                <Text style={ estilosStartTrip.textClima }>12:30</Text>
                                                <Image source={Images.co2} style={ estilosStartTrip.imgClima } />
                                                <Text style={ estilosStartTrip.textClima }>16°</Text>
                                            </View>
                                            <View style={ estilosStartTrip.itemClima }>
                                                <Text style={ estilosStartTrip.textClima }>14:00</Text>
                                                <Image source={Images.co2} style={ estilosStartTrip.imgClima } />
                                                <Text style={ estilosStartTrip.textClima }>16°</Text>
                                            </View>
                                            <View style={ estilosStartTrip.itemClima }>
                                                <Text style={ estilosStartTrip.textClima }>15:00</Text>
                                                <Image source={Images.co2} style={ estilosStartTrip.imgClima } />
                                                <Text style={ estilosStartTrip.textClima }>16°</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text></Text>
                                            {/**Quitar es para sin conexion mysql 
                                            <TouchableOpacity 
                                                onPress={() => { terminarViaje() }} 
                                                style={estilosStartTrip.btnSoporte}>
                                                <Text style={estilosStartTrip.letrablanca}>Finalizar viaje</Text>                                            
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                onPress={() => { verState() }}
                                                style={estilosStartTrip.botonTerminarViaje}>
                                                <Text style={estilosStartTrip.btnTextoTerminarViaje}>ver state</Text>
                                            </TouchableOpacity> */}
                                        </View>
                                    </View>
                                    :
                                    <>
                                    <View style={estilosStartTrip.cajaBtnTerminar}>
                                        {
                                            (activo) ? 
                                            <></> :
                                            <TouchableOpacity 
                                                onPress={() => { terminarViaje() }}
                                                style={estilosStartTrip.botonIniciarViaje2}>
                                                <Text style={estilosStartTrip.btnTextoPausarViaje}>FINALIZAR</Text>
                                            </TouchableOpacity> 
                                            
                                        }
                                            

                                            {/*<TouchableOpacity 
                                                onPress={() => { verState() }}
                                                style={estilosStartTrip.botonTerminarViaje}>
                                                <Text style={estilosStartTrip.btnTextoTerminarViaje}>ver state</Text>
                                            </TouchableOpacity>*/} 
                                    </View>
                                    </>
                                }
                            </View>
                            </>      
                            }   
                        </>
                        </View>
                </View>
                </Content>
            </SafeAreaView>
        </ImageBackground>
    );
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        navigationProp: state.globalReducer.nav._navigation,
        dataRent: state.reducer3G,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        validateVehicle: (cod, user) => dispatch(validateVehicle(cod, user)),
        startTrip: (data) => dispatch(startTrip(data)),
        validateVehicleSinMysql: () =>dispatch(validateVehicleSinMysql()),
        restartTrip: () => dispatch(restartTrip()),
        tripEnd: (data) => dispatch(tripEnd(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VistaTripScreen);


