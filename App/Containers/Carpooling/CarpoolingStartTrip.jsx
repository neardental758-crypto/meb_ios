import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Platform,
    Linking,
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
} from '../../actions/actions3g';
import styles from '../Screens/Styles/FaqScreen.style';
//import { fetch } from '../../Services/refresh.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Colors from '../../Themes/Colors';
import estilos from '../VehiculoCompartido/Styles/estilos.style';
import estilosStartTrip from '../VehiculoCompartido/Styles/qr.style';

const mapRef: any = React.createRef();
function CarpoolingStartTrip (props) {
    const [ state , setState ] = useState({
        showRider : false,
        user: '1111',
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
    });

    const [segundos, setSegundos] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [horas, setHoras] = useState(0);
    
    const showRiders = () => {
        setState({...state, showRider : !state.showRider})
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
                console.log('mostando position denuevo');
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
    const incrementa = () =>{
        console.log('incrementando')
        if (segundos === 10) {
            console.log('llego a 10')
            setMinutos( minutos => minutos + 1)
            setSegundos(segundos => 0)
        }

        if (minutos == 2) {
            setHoras( horas => horas + 1)
            setMinutos( minutos => 0)
        }

    }

    const incrementarMin = () => {
        console.log('llego a 10 los seg');
        setSegundos(0);
        setMinutos(minutos => minutos + 1);
    }

    const iniciarCronometro = () =>{
        const intervalo = setInterval(() => {
            setSegundos(segundos => segundos + 1);
        }, 1000);
        return () => clearInterval(intervalo);
    }

    const iniciarViaje = () =>{
        console.log('iniciando Viaje');
        iniciarCronometro();
        //const intervalo = setInterval(iniciarCronometro, 1000);  
        setState({ ...state, cronometro: true, inicioviaje: true })
        /*let fecha = new Date(); //comentado desde aca sin conexion mysql
        const dataTrip = { 
            "via_id" : fecha.getTime(),
            "via_usuario" : state.user,
            "via_vehiculo" : '80637777',
            "via_fecha_inicio" : fecha,
            "via_hora_inicio" : fecha.getUTCHours(),
            "via_fecha_fin" : 'sin definir',
            "via_hora_fin" : 'sin definir',
            "via_duracion" : 'sin definir',
            "via_kilometros" : 'sin definir',
            "via_estado" : 'ACTIVA',
        }
        props.startTrip(dataTrip);*/
    }
    
    const terminarViaje = () =>{
        setState({ 
            ...state,  
            terminarviaje: true 
        })
    }

    const endTrip = () => {
        console.log('finalizando viaje y mostrando test experiencia')
        props.navigationProp.navigate('TestExperienceScreen');
    }

    const irSoporte = () => {
        props.navigationProp.navigate('SupportScreen');
    }

    const noTerminarViaje = () => {
        console.log('Queiro seguir en el viaje');
        setState({ ...state,  terminarviaje: false, pausa: false  })
        //iniciarCronometro();
    }

    const guardarViaje = () => {
        console.log('GUARDANDO VIAJE...');
    }

    const pausarViaje = () =>{
        console.log('Pausar viaje')
        clearInterval(state.intervalo);
        setState({ ...state,  pausa: true })
    }

    const reanudarViaje = () =>{
        //iniciarCronometro();
        setState({ ...state,  pausa: false })
        console.log(state.intervalo)
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
        //setState({ ...state,  terminarviaje: false })
        //props.validateVehicleSinMysql();
        inicioMap();
    },[])

    

    /**
     *Switch para encender Linterna
  
     switchTorchState() {
        setState({ ...state,  torchState: !state.torchState });
        console.log("scanner",scanner);
        console.log("enabled",enabled);
        console.log("state.enabled",state.enabled);
        scanner.reactivate();
    }
     */
   
    return (
                <Content>
                    <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
                            <View >
                            <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
                            </View>
                        </TouchableOpacity>
                    <View style={estilos.contenedor}>
                        <View style={estilosStartTrip.contentTop}>
                            
                            
                            {/*<TouchableOpacity 
                                onPress={() => { 
                                    console.log('state con mi ubicacion',state ) 
                                    console.log('state con mi ubicacion',props ) 
                                }}>
                                <Text>Ver statee</Text>
                            </TouchableOpacity>*/}
                        </View>

                        <View>
                            { 
                                /**
                                 * codigoQR = true 
                                 * mostramos formulario si no tiene registros que
                                 * o iniciar viaje mostrando mapa si ya realizó el registro
                                 */
                                <>
                                { 
                                state.terminarviaje ?
                                <>
                                <View>
                                    <View style={estilosStartTrip.cajalogo}>
                                        <Image source={Images.bicycleicon} style={estilosStartTrip.logocolor}/>
                                        <Image source={Images.resumen} style={estilosStartTrip.resumen}/>
                                        <Text style={estilosStartTrip.letraResumen}>Resumen</Text>
                                    </View>
                                    <View style={estilosStartTrip.cajaDatosResumen}>
                                        <View style={estilosStartTrip.cajaDatosItem}>
                                            <Image source={Images.vpkm} style={estilosStartTrip.vpkm}/>
                                            <Text style={estilosStartTrip.letraOscura}>Km</Text>
                                        </View>
                                        <View style={estilosStartTrip.cajaDatosItem}>
                                            <Image source={Images.vpmin} style={estilosStartTrip.vpkm}/>
                                            <Text style={estilosStartTrip.letraOscura}>Minutos</Text>
                                        </View>
                                        <View style={estilosStartTrip.cajaDatosItem}>
                                            <Image source={Images.vppts} style={estilosStartTrip.vpkm}/>
                                            <Text style={estilosStartTrip.letraOscura}>Puntos</Text>
                                        </View>
                                    </View>

                                    <View style={estilosStartTrip.cajalogo}>
                                        <Image source={Images.historico} style={estilosStartTrip.resumen}/>
                                        <Text style={estilosStartTrip.letraResumen}>Histórico</Text>
                                    </View>
                                    <View style={estilosStartTrip.cajaDatosResumen}>
                                        <View style={estilosStartTrip.cajaDatosItem}>
                                            <Image source={Images.vpkm} style={estilosStartTrip.vpkm}/>
                                            <Text style={estilosStartTrip.letraOscura}>Km</Text>
                                        </View>
                                        <View style={estilosStartTrip.cajaDatosItem}>
                                            <Image source={Images.vpmin} style={estilosStartTrip.vpkm}/>
                                            <Text style={estilosStartTrip.letraOscura}>Minutos</Text>
                                        </View>
                                        <View style={estilosStartTrip.cajaDatosItem}>
                                            <Image source={Images.vppts} style={estilosStartTrip.vpkm}/>
                                            <Text style={estilosStartTrip.letraOscura}>Puntos</Text>
                                        </View>
                                    </View>

                                    <View style={estilosStartTrip.cajaSoporte}>
                                        <Image source={Images.vpsoporte} style={estilosStartTrip.vpsoporte}/>
                                        <TouchableOpacity 
                                            onPress={() => { irSoporte() }} 
                                            style={estilosStartTrip.btnSoporte}>
                                            <Text style={estilosStartTrip.letraOscura}>Soporte</Text>                                            
                                        </TouchableOpacity>

                                        <TouchableOpacity 
                                            onPress={() => { noTerminarViaje() }} 
                                            style={estilosStartTrip.btnSoporte}>
                                            <Text style={estilosStartTrip.letraOscura}>Volver</Text>                                            
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => { endTrip() }} 
                                            style={estilosStartTrip.btnSoporte}>
                                            <Text style={estilosStartTrip.letraOscura}>Terminar</Text>                                            
                                        </TouchableOpacity>
                                    </View>
                                   
                                </View>
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
                                    <View style={ estilosStartTrip.cajainformacion }>
                                        <View style={ estilosStartTrip.cajabotones }>
                                            
                                            { (state.cronometro === true) ?
                                            <>
                                                {
                                                (state.pausa === true) ? 
                                                <>
                                                    <TouchableOpacity 
                                                        onPress={() => { reanudarViaje() }}
                                                        style={estilosStartTrip.botonIniciarViaje}>
                                                        <Text style={estilosStartTrip.btnTextoPausarViaje}>Reanudar</Text>
                                                    </TouchableOpacity> 
                                                </>
                                                : 
                                                <>
                                                    <TouchableOpacity 
                                                        onPress={() => { pausarViaje() }}
                                                        style={estilosStartTrip.botonIniciarViaje}>
                                                        <Text style={estilosStartTrip.btnTextoPausarViaje}>Pausar</Text>
                                                    </TouchableOpacity>  
                                                </>
                                                
                                                }
                                            </>
                                            : 
                                            <View>
                                            <TouchableOpacity 
                                                onPress={() => { iniciarViaje() }}
                                                style={estilosStartTrip.botonIniciarViaje}>
                                                <Text style={estilosStartTrip.btnTextoIniciarViaje}>Iniciar viaje</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={() => { showRiders() }}
                                                style={[estilosStartTrip.botonIniciarViaje, {bottom : 40}]}>
                                                <View style={{flexDirection : 'row'}}>
                                                    <Text style={[estilosStartTrip.btnTextoIniciarViaje, {fontSize : 15}]}>Confirmar acompañante   </Text>
                                                    <Image source={Images.iconPickerWhite} style={{width : 15, height : 15, transform: [{ rotate: '180deg' }]}} />
                                                </View>
                                            </TouchableOpacity>
                                            {state.showRider &&
                                            <TouchableOpacity 
                                                onPress={() => { showRiders() }}
                                                style={[estilosStartTrip.botonIniciarViaje, {bottom : 40}]}>
                                                    <View style={{flexDirection : 'row', marginBottom : 5}}>
                                                        <Text style={[estilosStartTrip.btnTextoIniciarViaje]}>Acompañante 1</Text>
                                                        <TouchableOpacity><Image source={Images.whiteCheck} style={{width : 15, height : 15, margin : 5}} /></TouchableOpacity>
                                                        <TouchableOpacity><Image source={Images.closeBlack} style={{width : 15, height : 15, margin : 5}} /></TouchableOpacity>
                                                    </View>
                                                    <View style={{flexDirection : 'row', marginBottom : 5}}>
                                                        <Text style={[estilosStartTrip.btnTextoIniciarViaje]}>Acompañante 2</Text>
                                                        <TouchableOpacity><Image source={Images.whiteCheck} style={{width : 15, height : 15, margin : 5}} /></TouchableOpacity>
                                                        <TouchableOpacity><Image source={Images.closeBlack} style={{width : 15, height : 15, margin : 5}} /></TouchableOpacity>
                                                    </View>
                                                    <View style={{flexDirection : 'row', marginBottom : 5}}>
                                                        <Text style={[estilosStartTrip.btnTextoIniciarViaje]}>Acompañante 3</Text>
                                                        <TouchableOpacity><Image source={Images.whiteCheck} style={{width : 15, height : 15, margin : 5}} /></TouchableOpacity>
                                                        <TouchableOpacity><Image source={Images.closeBlack} style={{width : 15, height : 15, margin : 5}} /></TouchableOpacity>
                                                    </View>
                                            </TouchableOpacity>
                                            }
                                            </View>
                                            }

                                        </View>
                                        
                                        <View style={ props.dataRent.inicioviaje === false ? estilosStartTrip.cajaIndicadores : estilosStartTrip.cajaIndicadoresTrip}>

                                            
                                            
                                            <View style={estilosStartTrip.cajaSubIn}>
                                                {props.dataRent.inicioviaje === false ? <></> : <Text style={ estilosStartTrip.textClima }>Tiempo</Text>}
                                                <View style={estilosStartTrip.subIndicadores}>
                                                    <Text style={estilosStartTrip.textsubIndicadures}>
                                                    { (horas < 10 ) ? "0" + horas:"" + horas} :  
                                                    { (minutos < 10) ? " 0" + minutos:"" + minutos} : 
                                                    { (segundos < 10) ? " 0" + segundos:"" + segundos}

                                                    { (segundos === 60) ? incrementarMin() : <></>}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            <View style={estilosStartTrip.cajaSubIn}>
                                                {props.dataRent.inicioviaje === false ? <></> : <Text style={ estilosStartTrip.textClima }>Kilometros</Text>}
                                                <View style={estilosStartTrip.subIndicadores}>
                                                    <Text style={estilosStartTrip.textsubIndicadures}>
                                                    0.0 kms
                                                    </Text>
                                                </View>
                                            </View>
                                            {
                                                (props.dataRent.inicioviaje === true) ?
                                                <View style={estilosStartTrip.cajaSubIn}>
                                                    <Text style={ estilosStartTrip.textClima }>Puntos</Text>
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
                                                    {/**Quitar es para sin conexion mysql */}
                                                    <TouchableOpacity 
                                                        onPress={() => { terminarViaje() }} 
                                                        style={estilosStartTrip.btnSoporte}>
                                                        <Text style={estilosStartTrip.letraOscura}>Finalizar viaje</Text>                                            
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            :
                                            <>
                                            <View style={estilosStartTrip.cajaBtnTerminar}>
                                                    <TouchableOpacity 
                                                        onPress={() => { terminarViaje() }}
                                                        style={estilosStartTrip.botonTerminarViaje}>
                                                        <Text style={estilosStartTrip.btnTextoTerminarViaje}>Finalizar</Text>
                                                    </TouchableOpacity> 
                                            </View>
                                            </>
                                        }
                                    </View>
                                </>      
                                }   
                                </>
                                
                            }
                        </View>
                </View>
                </Content>
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CarpoolingStartTrip);


