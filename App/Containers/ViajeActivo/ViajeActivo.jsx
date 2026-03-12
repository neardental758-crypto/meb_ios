import {
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    TextInput,
    Platform,
    Modal,
    Dimensions,
    ScrollView 
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';
import Geolocation from 'react-native-geolocation-service';
import { 
    rentActive,
    getFallas,
    validateUser3g,
    validateHorarios,
    reserveActive,
    viewPenalizaciones,
    calcularDistancia,
    changeVehiculo,
    changeVehicleReserva,
    savePrestamo,
    cambiarEstadoReserva,
    viewVehiculo,
    viewEstacion,
    savePenalization,
    cambiarEstadoPrestamo,
    reseteoCambioVehiculo,
    saveStateBicicletero,
    indicadores_trip,
} from '../../actions/actions3g';
import RNPickerSelect from  '@nejlyg/react-native-picker-select';
//import URL_mysql from './functions/url';
//import { apimysql } from './functions/funciones'
import estilos from './styles/rentas.style';
//import MapScreen from './Map';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { Env } from "../../Utils/enviroments"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { GuiaEstados } from '../../Components/movilidad4g/GuiaEstados';
import { Mapa } from '../../Components/carpooling/Mapa';
import { Tarjeta } from './Tarjeta';
import { BackgroundTask } from './BackgroundTask';
import { PermissionsAndroid } from 'react-native';
import { NativeModules } from 'react-native';
const { Notificacion2HorasModule } = NativeModules;

function ViajeActivo (props) {
    const dispatch = useDispatch();
    const [ state , setState ] = useState({
        organizacion: '',
        fecha: new Date(),
        fechaVence: '',
        dia: new Date().toUTCString().substr(0,3),
        resDia: null,
        horaValida: false,
        minutos: new Date().getMinutes(),
        horas: new Date().getHours(),
        ticket: null, //vehículo select
        dataVehiculo: [],
        vehiculo: false,
        estacionSelect: '',
        diasR: 10,
        horasR: 10,
        minutosR: 10,
        segundosR: 10,
        intervalo: '',
        reservaVencida: false,
        prestamoVencido: false,
        registroFinalizado : false,
        quieroRentar: false,
        vehiculoEstadoOK: '',
        casco: '',
        sobrio: '',
        fallaSelect: '',
        vehiculoNuevo: '',
        vehiculoNuevoNumero: '',
        isOpenBackgroundInfoModal: false,
        isOpenBackgroundTestRentaModal: false,
        isOpenBackgroundTestReservaModal: false,
    });
    
    const { infoUser } = useContext( AuthContext )

    const [latEstacionState, setLatEstacionState] = useState(props.dataRent.latEstacion);
    const [lngEstacionState, setLngEstacionState] = useState(props.dataRent.lngEstacion);
    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    const [claveRenta, setClaveRenta] = useState('');
    const [estacionPrestamo, setEstacionPrestamo] = useState('');
    const [vehiculoReserva, setVehiculoReserva] = useState('');
    const [vehiculoPrestamo, setVehiculoPrestamo] = useState('');
    const [distanciaMaxRenta, setDistanciaMaxRenta] = useState('');
    const [coordenadas, setCoordinadas] = useState([]);
    const [segundos, setSegundos] = useState(props.dataRent.segundosResta);
    const [minutos, setMinutos] = useState(props.dataRent.minutosResta);
    const [horas, setHoras] = useState(props.dataRent.horasResta);
    const [diaRestante, setDiaRestante] = useState(props.dataRent.diaResta); 
    const [claveGenerada, setClaveGenerada] = useState(props.dataRent.clave); 
    const [isModalCancelVisible, setIsModalCancelVisible] = useState(false);
    const [touchRentar, setTouchRentar] = useState(false);
    const [position1, setPosition1 ] = useState({lat: '',lng: ''});
    const [position2, setPosition2 ] = useState({lat: '',lng: ''});
    const [cargaPosicion, setCargaPosicion] = useState(false);
    const [indicadoresTrip, setIndicadoresTrip] = useState(null);

    const goHome3G = () => { RootNavigation.navigate('Home3G') }
    
    useEffect(()=>{
        setSegundos(props.dataRent.segundosResta);
        setMinutos(props.dataRent.minutosResta);
        setHoras(props.dataRent.horasResta);
        setDiaRestante(props.dataRent.diaResta); 
        setClaveGenerada(props.dataRent.clave);
    },[props.dataRent.segundosResta])

    useEffect(()=>{
        const timer = setInterval(() => {
            if (segundos > 0) {
                setSegundos(segundos + 1);
                }else if(segundos == 0 && minutos > 0){
                setMinutos(minutos + 1);
                setSegundos(59);
                }else if(segundos == 0 && minutos == 0 && horas > 0){
                setHoras(horas + 1);
                setMinutos(59);
                setMinutos(59);
                }else if(segundos == 0 && minutos == 0 && horas == 0 && diaRestante > 0){
                setDiaRestante(diaRestante + 1);
                setHoras(23);
                setMinutos(59);
                setMinutos(59);
                }else{
                }
        }, 1000);
        return () => clearInterval(timer);
    },[segundos])

    ///////////// modal ///////////////
    const displayBackgroundInfoModal = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal: value })
    }
    const stateModalCancelRent = (value) => {
        setIsModalCancelVisible(value);
    }
    
    const modalCargandoDataRenta = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
                height: 20,
            }}>
                <Modal transparent={true}>
                    <View style={{ backgroundColor: Colors.$blanco, flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                        <LottieView source={require('../../Resources/Lotties/bicy_03.json')} autoPlay loop style={{width: '100%',height: '100%'}}/>
                        </View>
                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
    }

    const [modalInfo, setModalInfo ] = useState(true);

    const openModalInfo = () => {
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
                        <View style={{ flex: 1, borderRadius: 20, marginVertical: 150, marginHorizontal: 30, justifyContent: "center", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 10 }}>
                            
                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto,
                                fontFamily: Fonts.$poppinsmedium,
                                fontSize: 22,
                                zIndex: 100
                            }}
                            >¡Feliz Viaje!</Text>   

                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center",
                                position: "absolute",
                                top: 0
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop 
                                style={{
                                  width: Dimensions.get('window').width,
                                  height: Dimensions.get('window').width,              
                                }}/>
                            </View>    
                        
                            <View style={{
                                width: Dimensions.get('window').width*.8,
                                height: 'auto',
                                paddingTop: 30,
                                marginBottom: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexWrap: 'wrap',
                            }}>    

                                {
                                    estacionPrestamo !== '' ?
                                    <Tarjeta 
                                        icono={Images.vpini}
                                        titulo={'Estación'}
                                        texto1={estacionPrestamo}
                                        texto2={''}
                                        elcolor={Colors.$adicional}
                                    />
                                    :
                                    <></>
                                }
                                

                                <Tarjeta 
                                    icono={Images.cycle_Icon}
                                    titulo={'Vehículo'}
                                    texto1={vehiculoPrestamo}
                                    texto2={''}
                                    elcolor={Colors.$texto}
                                />

                                {
                                    digitosClave === 4 && digitosClave !== ''?
                                    <Tarjeta 
                                        icono={Images.cycle_key}
                                        titulo={'Clave'}
                                        texto1={(claveRenta !== '') ? claveRenta : 'Generando clave ...'}
                                        texto2={''}
                                        elcolor={Colors.$texto}
                                    />  
                                    :
                                    <></>
                                }
                                      
                                
                            </View>


                            <Pressable  
                                onPress={() => { 
                                    setModalInfo(false);
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
    ///// OBTENIENDO LA POSSCION //////
    const getPosition = () =>{
        Geolocation.getCurrentPosition(
            geoSuccess,
            geoFailed,
            geoSetup
        );
        calcularDistancia();
    }

    const geoSuccess = (positionActual) => {
        let { latitude, longitude } = positionActual.coords
        setLatActual(latitude);
        setLngActual(longitude);
        setPosition1({ lat: latitude, lng: longitude })
        setPosition1({ lat: latitude, lng: longitude });
        setCargaPosicion(true);
    }

    const geoFailed = (error) => {
        console.log("error de ubicación", error)
    }

    geoSetup = Platform.OS == "android" ? {
        enableHighAccuracy: true,
        timeout: 100000
    } : {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 3600000
    }
    
    ///////////////////////////////////
    const verState = () => { 
        console.log('EL STATE ACT::::: ', state)
        console.log('PROPS::::', props.dataRent)
        console.log('la distancia max para renta', distanciaMaxRenta)
        console.log('la latitud estacion', latEstacionState)
        console.log('la longitud estacion', lngEstacionState)
        console.log('la longitud actual', latActual)
        console.log('la longitud actual', lngActual)
    }
    const verState2 = () => { 
        console.log('EL STATE PROPS ACT::::: ', props.dataRent.prestamo.data[0].pre_devolucion_fecha) 
    }
    const verState3 = () => { 
        console.log('EL STATE PROPS ACT::::: ', props.dataUser) 
    }
    const goBack = () => { 
        props.navigation.goBack() 
    }
    const home = () => { 
        RootNavigation.navigate('Home');
    }
    const irFInRenta = async () => {
        //await dispatch(indicadores_trip(indicadoresTrip));
        await RootNavigation.navigate('FinalizarViaje')
    }

    const cambiarEstadoPrestamo = () => {
        const data = {
            "pre_id": props.dataRent.prestamo.data[0].pre_id,	
            "estado": 'VENCIDA'
        }
        let vehiculo = props.dataRent.prestamo.data[0].pre_bicicleta;
        props.cambiarEstadoPrestamo(data, vehiculo, 'DISPONIBLE');
    }

    /*const crearPenalizacion = async() => {
        const data = {
            "pen_id": "0",
            "pen_tipo_penalizacion": "1",
            "pen_novedad": "por vencimiento",
            "pen_usuario": infoUser.DataUser.idNumber,
            "pen_fecha_creacion":  state.fecha.toUTCString().substr(0,10),
            "pen_fecha_tiempo_ok": state.dia,
            "pen_fecha_dinero_ok": "dinero",
            "pen_estado": "ACTIVA",
            "pen_fecha_apelado": "sin fecha",
            "pen_motivo_apelado": "sin motivo"
        }
        let vehiculo = props.dataRent.reservas.data[0].res_bicicleta;
        let reservaId = props.dataRent.reservas.data[0].res_id;
        props.savePenalization(data, vehiculo, reservaId);
    }

    const penal = async () => {
        crearPenalizacion();
    }*/

    const vehiculoseleccionado = async(data) => {
        console.log('data', data);
        if (data.bic_estado === 'DISPONIBLE') {
            setState({ ...state, ticket: data.bic_id, numVehiculo: data.bic_numero })
            dispatch(saveStateBicicletero(data.bic_id, data.bic_estacion));
        }else {
            Alert.alert('Vehículo ', data.bic_estado)
        }
    }

    const viewBicycle = async (estacion) => {
        if(estacion !== ''){
            await props.viewVehiculo(estacion);
        }
    }

    const cancelarReserva = async () => {
        let vehiculo = props.dataRent.reservas.data[0].res_bicicleta;
        const data = {"res_id": props.dataRent.reservas.data[0].res_id,	"estado": 'CANCELADA'}
        props.cambiarEstadoReserva(data, vehiculo);
    }

    const cambiarVehiculoReserva = async (data) => {
        await props.changeVehicleReserva(data, infoUser.DataUser.idNumber, state.vehiculoNuevo);
    }

    const cambiarEstadoBici = async (estado, vehiculo) => {
        const data = {"bic_id": vehiculo, "bic_estado": estado}
        props.changeVehiculo(data)
        const data2 = {
            "res_id": props.dataRent.reservas.data[0].res_id,
            "res_bicicleta": state.vehiculoNuevo
        }
        cambiarVehiculoReserva(data2)
    }

    const userActivo = async (cc) => {
        props.validateUser3g(cc);
    }

    const validarHor = async (empresa) => {
        await props.validateHorarios(empresa);
    }

    const verPenalizaciones = async (cc) => {
        props.viewPenalizaciones(cc);
    }

    const reservasActivas = async (cc) => {
        await props.reserveActive(cc);
    }

    const prestamoActivo = async (cc) => {
        await props.rentActive(cc)
    }

    const verFallas = async () => {
        props.getFallas();
    }
    
    ////////// CHECHLIST rentar /////////////////
    const vehiculoEstado = (estado) => {
        if (estado === 'SI') {
            setState({ ...state, vehiculoEstadoOK : estado}); 
        }else if(estado === 'falla'){
            setState({ ...state, vehiculoEstadoOK : estado});
        }else{
            setState({ ...state, vehiculoEstadoOK : estado});
            viewBicycle(state.estacionSelect)
        }
        
    }
    
    const estadoCasco = (estado) => {setState({ ...state, casco : estado});}
    const estadoSobrio = (estado) => {setState({ ...state, sobrio : estado});}
    const quieroRentar = () => {
        cargarIDbicicletero();
        setState({ ...state, quieroRentar : true})
    }
    const quieroRentar2 = () => {setState({ ...state, isOpenBackgroundTestRentaModal: true})}
    
    const otroVehiculo = () => {
        let id = props.dataRent.reservas.data[0].res_bicicleta;
        cambiarEstadoBici('FALLA MECANICA', id);
    }
    
    const addPropsCoord = () => {
        setLatEstacionState(props.dataRent.latEstacion);
        setLngEstacionState(props.dataRent.lngEstacion);
    }

    const calcularDistancia = async () =>{

        let coordenadas = {
            "lat1": latActual, 
            "lng1": lngActual,
            "lat2": latEstacionState,
            "lng2": lngEstacionState,
        }
        
        if (latEstacionState !== '' && lngEstacionState !== '' && latActual !== '' && lngActual !== '') {
            
            await props.calcularDistancia(coordenadas)
        }else{
            console.log('NO han cargado las coor de la estacion', coordenadas)
            addPropsCoord();
        }
        
    }


    const cargarIDbicicletero = () => {
        props.saveStateBicicletero(props.dataRent.reservas.data[0].res_bicicleta, props.dataRent.reservas.data[0].res_estacion);
        verState();
    }

    // función que programa la notificación si no está activa
    /*const programarNotificacion = async (fecha) => {
    try {
        console.log('Verificando si ya hay notificación activa...');

        // revisamos en el storage si ya está activa
        const activa = await AsyncStorage.getItem('notificacion2HorasActiva');

        if (activa === 'true') {
        console.log('⚠️ Ya existe una notificación activa, no se vuelve a programar.');
        return;
        }

        // pedimos permiso (solo una vez es suficiente)
        await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        console.log('⏰ Programando notificación de 2 horas antes...');
        Notificacion2HorasModule.programarNotificacion2Horas(fecha);

        // guardamos bandera en storage
        await AsyncStorage.setItem('notificacion2HorasActiva', 'true');
        console.log('✅ Notificación marcada como activa en AsyncStorage');
    } catch (error) {
        console.error('Error programando notificación:', error);
    }
    };

    useEffect(() => {
    if (props.dataRent.fechaVecimiento) {
        const fechaString = props.dataRent.fechaVecimiento;
        console.log('FECHA DE VENCIMIENTO (string)', fechaString);

        // ✅ Convertimos string → Date
        const fecha = new Date(fechaString);

        // ✅ Obtenemos timestamp en milisegundos
        const fechaMillis = fecha.getTime();

        console.log('FECHA DE VENCIMIENTO (Date)', fecha);
        console.log('FECHA DE VENCIMIENTO (millis)', fechaMillis);

        programarNotificacion(fechaMillis);
    }
    }, [props.dataRent.fechaVecimiento]);*/ //DESCOMENTAR PARA NOTIFICACIONES  HORAS

    useEffect(() => {
        if (props.perfil.empresa !== null) {
            console.log('la empresa ES:',props.perfil.empresa)
           dispatch(viewEstacion(props.perfil.empresa))
           validarHor(props.perfil.empresa); 
        }              
    },[props.perfil.empresa])
    
    
    useEffect(() => {
        //console.log('dispositivo ', Platform.OS)
        //console.log('la distancia esSSSSSSSSSSSSS ::', props.dataRent.distanciaMt)
        getPosition();
        userActivo(infoUser.DataUser.idNumber);
        verFallas();
        prestamoActivo(infoUser.DataUser.idNumber);
        console.log('EEEEEEEEEE ',props.dataRent)
        //console.log('props.dataRent.prestamo.data[0].pre_devolucion_fech', props.dataRent.prestamo.data[0].pre_devolucion_fecha)
        //reservasActivas(infoUser.DataUser.idNumber);
        //verPenalizaciones(infoUser.DataUser.idNumber);
        //cronometroVRenta();
        //validarHor(state.organizacion);
        //calcularDistancia();
    },[])

    useFocusEffect( 
        React.useCallback(() => {
            prestamoActivo(infoUser.DataUser.idNumber);
            getPosition();
        }, [])
    );


    useEffect(() => {
        if (touchRentar) {
            prestamoActivo(infoUser.DataUser.idNumber);
        }
    }, [touchRentar])

    useEffect(() => {
        reservasActivas(infoUser.DataUser.idNumber);
        setState({ 
            ...state, 
            vehiculoEstadoOK : ''
        })
        props.reseteoCambioVehiculo();
    },[props.dataRent.cambioVehiculo === true])

   
    
    useEffect(() => {
        calcularDistancia(); //descomentó
        addPropsCoord();
        getPosition();
    },[latEstacionState !== '' && lngEstacionState !== ''])

    const [digitosClave, setDigitosClave] = useState('')

    const cargarClave = () =>{
        setClaveRenta(props.dataRent.clave);
        setEstacionPrestamo(props.dataRent.estacionPrestamo);
        setVehiculoPrestamo(props.dataRent.vehiculoPrestamo);
        if(props.dataRent.clave !== null){
            let clave = props.dataRent.clave;
            let digitos = clave.toString().length;
            setDigitosClave(digitos);
        }
    }

    useEffect(() => {
        if(props.dataRent.clave !== null){
            cargarClave()
        }        
    },[props.dataRent.clave !== null])

    useEffect(() => {
        cargarClave();
    },[claveRenta === ''])

    //effect para distancia con la estación
    useEffect(() => {
        const correo = infoUser.DataUser.email;
        const busqueda_tuempresa = "@tuempresa.com";
        const indice_tuempresa = correo.indexOf(busqueda_tuempresa);

        if (indice_tuempresa !== -1) {
            console.log('para la distancia con tuempresa');
            setDistanciaMaxRenta(10000000);
        }else {
            setDistanciaMaxRenta(props.dataRent.distanciaRenta);
        }
        
    },[props.dataRent.distanciaRenta !== distanciaMaxRenta])

    useEffect(() => {
        setVehiculoReserva(props.dataRent.vehiculoReserva);
    },[vehiculoReserva !== ''])


    //////////////// CRONOMETRO ///////////////////
    //const [segundosV, setSegundosV] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos : 0);
    //const [minutosV, setMinutosV] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos : 0);
    //const [horasV, setHorasV] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.horas ? props.dataRent.CronometroStorageVP.CronometroStorageVP.horas : 0);
    const [segundosV, setSegundosV] = useState(props.dataRent.segundosRentaTrans);
    const [minutosV, setMinutosV] = useState(props.dataRent.minutosRentaTrans);
    const [horasV, setHorasV] = useState(props.dataRent.horasRentaTrans);
    const [activoV, setActivoV] = useState(false);
    const [intervaloV, setIntervaloV] = useState(null);

        useEffect(()=>{
            setSegundosV(props.dataRent.segundosRentaTrans);
            setMinutosV(props.dataRent.minutosRentaTrans);
            setHorasV(props.dataRent.horasRentaTrans);
        },[props.dataRent.segundosRentaTrans])


    const cronometroVRenta = () => {   
        console.log('iniciando cronómetro')
        if (activoV) {
          console.log('viaje pausadooooo')
          clearInterval(intervaloV);
          setActivoV(false);
        } else {
          console.log('iniciando activo')
          const idIntervaloV = setInterval(() => {
            setSegundosV(prevSegundosV => prevSegundosV + 1);
          }, 1000);
          setIntervaloV(idIntervaloV);
          setActivoV(true);
        }
    };
    
    useEffect(() => {
        return () => clearInterval(intervaloV);
    }, [intervaloV]);

    const incrementarMin = () => {
        console.log('otro minuto');
        setSegundosV(0);
        setMinutosV(minutosV + 1);
        if (activoV) {
            getPosition();
            //guardarsegundosCronometroStorageVP(); 
        }else{
            console.log('viaje pausado')
        }   
    }

    /*const remove = (str, word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const result = str.replace(regex, '');
        return result.trim().replace(/\s\s+/g, ' ');
    }*/

    /*{useEffect(() => {
        const time2 = setInterval(() => {
            console.log('actualizando posicion y prestamo es ', props.dataRent.prestamoActivo)
            getPosition(); 
        }, 5000);  
    },[ props.dataRent.latEstacion !== '' && 
        props.dataRent.lngEstacion !== '' && 
        latActual !== '' && 
        lngActual !== ''
        ])}*/
    {useEffect(() => {
        if (props.dataRent.distanciaMt === '') {
          getPosition();  
        }
    },[props.dataRent.distanciaMt === ''])}

    const [viajeTerminado, setViajeTerminado] = useState(false)

    const terminadoTrip = (valor) => {
        setViajeTerminado(valor);
    }

    const indicadores = (valor) => {
        setIndicadoresTrip(valor);
    }
    
    return (
    <SafeAreaView  style={{ flex: 1 }}>  
        {modalInfo ? openModalInfo() : <></>} 
        <ScrollView  style={estilos.contenedor}>
        {   
            ( props.dataRent.distanciaMt <= distanciaMaxRenta )  //valor ini <= si la distacia con la estación es menor a 300 metros
            ? 
            <>
            {
                (props.dataRent.prestamoActivo ) ? 
                <>
                    { 
                    (props.dataRent.distanciaMt <= distanciaMaxRenta ) ? 
                    <>
                        {
                        (props.dataRent.horarios.dia === state.dia) && 
                        (props.dataRent.horarios.hora === true) && 
                        (props.dataRent.usuarioValido === true) ?
                        <SafeAreaView style={estilos.contentCenter}>
    
                            <View style={estilos.cajaCod2}>

                                <BackgroundTask 
                                    terminadoTrip={terminadoTrip} 
                                    estacionPrestamo={estacionPrestamo}
                                    time={'null'}
                                    minutes={'null'}
                                    iniciar={true}
                                    indicadores={indicadores}
                                    modo={Env.modo}
                                />

                                {
                                    viajeTerminado ?
                                    <Pressable  
                                        onPress={() => { irFInRenta()}}
                                        style={estilos.btnCenter1}>
                                        <View style={estilos.btnSaveOK2}>
                                            <Text style={estilos.btnSaveColor}>Terminar</Text>
                                        </View>
                                    </Pressable>
                                    :
                                    <></>
                                }

                                <Pressable  
                                    onPress={() => { setModalInfo(true)}}
                                    style={{
                                        width: Dimensions.get('window').width,
                                        textAlign: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: Colors.$texto50,
                                        fontFamily: Fonts.$poppinsregular
                                    }}>
                                        Clave
                                    </Text>
                                </Pressable>
                                
                            </View>                                
                        </SafeAreaView>
                        :
                        <View style={estilos.cajaMns}>
                        {(props.dataRent.usuarioValido === true) ? <></> : <Text style={estilos.denegado}>Usuario NO habilitado </Text>}
                        {(props.dataRent.horarios.dia  === state.dia) ? <></>: <Text style={estilos.denegado}>Día No hábil </Text>}
                        {(props.dataRent.horarios.hora === true) ? <></> : <Text style={estilos.denegado}>Horario fuera de servicio </Text>}
                        {/*(props.dataRent.penalizaciones === 0) ? <></> : <Text style={estilos.denegado}>Tiene penalizaciones </Text>*/}
                        </View>
                        }    
                    </>
                    :
                    <>
                        {   
                        (props.dataRent.clave === null) ?
                        <View style={estilos.contentCenter}>
                            <Text style={estilos.denegado2}>La distancia es { props.dataRent.distanciaMt } metros, está fuera de los límites para hacer la renta</Text>
                            <Pressable  onPress={()=>{ 
                                calcularDistancia() 
                            }} style={estilos.btnCenter}>
                                <View style={estilos.btnSaveOK}>
                                    <Text style={estilos.btnSaveColor}>Volver a calcular distancia</Text>
                                </View>
                            </Pressable>
                        </View>
                        :
                        <View style={estilos.cajaDatosViaje}>

                                <View style={estilos.contentMsn2}>
                                    <Text style={estilos.textVehiculo}>Renta en Progreso</Text>
                                    <Text style={estilos.textVehiculo2}>Renta vence:</Text>
                                </View> 

                                <View style={estilos.contentMsn2}>
                                    <Text style={estilos.textVehiculo2}>Distancia con la estación</Text>
                                    <Text style={estilos.textClave}>
                                        { latActual !== '' && lngActual !== '' ?
                                        props.dataRent.distanciaMt 
                                        :
                                        'calculando...'
                                        } 
                                        <Text style={estilos.textVehiculo2}> metros</Text>
                                    </Text> 
                                </View>
                                
                                <View style={estilos.cajaSubIn}>
                                    <Text style={estilos.textVehiculo2}>TIEMPO</Text>
                                    <View style={estilos.subIndicadores}>
                                        <Text style={estilos.textsubIndicadures}>
                                        { (horasV < 10 ) ? "0" + horasV:"" + horasV} :  
                                        { (minutosV < 10) ? " 0" + minutosV:"" + minutosV} : 
                                        { (segundosV < 10) ? " 0" + segundosV:"" + segundosV}

                                        { (segundosV === 60) ? incrementarMin() : <></>}
                                        </Text>
                                    </View>
                                </View>  
                                
                                <View>
                                    <Pressable  onPress={()=>{ 
                                        calcularDistancia() 
                                    }} style={estilos.btnCenter}>
                                        <View style={estilos.btnSaveOK}>
                                            <Text style={estilos.btnSaveColor}>Devolver vehículo</Text>
                                        </View>
                                    </Pressable>
                                    
                                    <Pressable  onPress={()=>{ 
                                        RootNavigation.navigate('Ayuda3GScreen') 
                                        }} style={estilos.btnCenter}>
                                            <View style={estilos.btnSaveOK}>
                                                <Text style={estilos.btnSaveColor3}>AYUDA</Text>
                                            </View>
                                    </Pressable> 

                                    
                                </View>
                                    
                        </View>
                        }
                    </> 
                    }
                </>
                :
                <>
                </>
            } 
            </>
            :
            <>
            <View style={estilos.contentCenter}>
                <Text style={estilos.denegado3}>La distancia en metros con la estación es: </Text>
                <Text style={estilos.denegado4}>{ props.dataRent.distanciaMt }</Text>
                <Text style={estilos.denegado2}>Estás fuera de los límites para hacer una renta.</Text>
                <Pressable  onPress={()=>{ 
                    home() 
                }} style={estilos.btnCenter}>
                    <View style={estilos.btnSaveOK}>
                        <Text style={estilos.btnSaveColor}>Home</Text>
                    </View>
                </Pressable>
            </View>
            </>
        }                                                 
        </ScrollView >

    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$primario,
        justifyContent: 'space-around',
        alignItems: 'center', 
        borderRadius: 1,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0
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
    iconMenu: {
        width: 50,
        height: 50,
    },
    cajaTextVehiuclosDisponible: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$disponible
    },
    cajaTextVehiuclosReservada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$reservada
    },
    cajaTextVehiuclosPrestada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$prestada
    },
    cajaTextVehiuclosInactiva: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$inactiva
    },
    cajaTextVehiuclosTaller: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$taller
    },
    cajaTextVehiuclosSinEstado: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'white'
    },
})

const estilos_ = StyleSheet.create({
    cajaTarjeta: {
        width: Dimensions.get('window').width*.3,
        height: 140,
        backgroundColor: Colors.$blanco,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
    },
    row_:{
        width: "90%",
        height: 'auto',
        backgroundColor: Colors.$secundario50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
        borderRadius: 20
    },
    cajaInfo_: {
        width: 100,
        height: 100,
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
        width : 250,
    },
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center', 
        borderWidth : 1,
        borderColor : Colors.$blanco,
        borderRadius: 25,
        width: Dimensions.get('window').width,
        position: 'relative',
        marginTop: -30,
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
    btnAtras:{
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: moderateScale(13),
      paddingVertical: 8,
      borderBottomWidth: 1,
      backgroundColor: "transparent",
      paddingLeft: moderateScale(15),
      marginLeft: moderateScale(20),
      marginRight: moderateScale(20),
      borderColor: '#8ac43f',
      borderWidth: 2,
      borderRadius: 25,
      marginTop: 15,
      color: 'white',
      marginBottom: 30,
    },
    inputAndroid: {
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 2,
        borderRadius: 25,
        marginBottom: 30,
        fontSize: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        marginTop: 10,
        paddingBottom: 10,
        color: Colors.$texto,
        backgroundColor: Colors.$blanco,
        borderColor: Colors.$texto20,
        width: Dimensions.get('window').width*0.7,
        paddingLeft: 20,
        fontFamily: Fonts.$poppinsregular,
    },
    placeholder: {
        color: Colors.$texto,
    },
    registerTitleContainer:{
        color: '#f60',
    },
    accountTitle:{
        marginBottom: 1,
    },
});

function mapStateToProps(state) {
    return {
        //dataUser: state.userReducer,
        dataRent: state.reducer3G,
        perfil: state.reducerPerfil,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        rentActive: (cc) => dispatch(rentActive(cc)),
        getFallas: () => dispatch(getFallas()),
        validateUser3g: (cc) => dispatch(validateUser3g(cc)),
        validateHorarios: (empresa) => dispatch(validateHorarios(empresa)),
        reserveActive: (cc) => dispatch(reserveActive(cc)),
        viewPenalizaciones: (cc) => dispatch(viewPenalizaciones(cc)),
        calcularDistancia: (coordenadas) => dispatch(calcularDistancia(coordenadas)),
        changeVehiculo: (data) => dispatch(changeVehiculo(data)),
        changeVehicleReserva: (data, doc, veh) => dispatch(changeVehicleReserva(data, doc, veh)),
        savePrestamo: (data, vehiculo, reservaId, estacion) => dispatch(savePrestamo(data, vehiculo, reservaId, estacion)),
        cambiarEstadoReserva: (data, vehiculo) => dispatch(cambiarEstadoReserva(data, vehiculo)),
        viewVehiculo: (estacion) => dispatch(viewVehiculo(estacion)),
        viewEstacion: (empresa) => dispatch(viewEstacion(empresa)),
        savePenalization: (data, vehiculo, reservaId) => dispatch(savePenalization(data, vehiculo, reservaId)),
        cambiarEstadoPrestamo: (data, vehiculo, estadoV) => dispatch(cambiarEstadoPrestamo(data, vehiculo, estadoV)),
        reseteoCambioVehiculo: () => dispatch(reseteoCambioVehiculo()),
        saveStateBicicletero: (veh, estacion) => dispatch(saveStateBicicletero(veh, estacion))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ViajeActivo);


