import {
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    TextInput,
    Platform,
    Modal,
    Dimensions
} from 'react-native';
//Layout
import Images from '../../Themes/Images';
//Components
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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
} from '../../actions/actions3g';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import URL_mysql from './functions/url';
import { apimysql } from './functions/funciones'
import estilos from './styles/rentas.style';

import Colors from '../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

function ViajeActivoScreen (props) {
    const [ state , setState ] = useState({
        documentoUser: props.dataRent.DataUser.DataUser.idNumber,
        //organizacion: props.dataRent.DataUser.DataUser.organizationId,
        organizacion: 'claro',
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
    });
    const [latEstacionState, setLatEstacionState] = useState(props.dataRent.latEstacion);
    const [lngEstacionState, setLngEstacionState] = useState(props.dataRent.lngEstacion);
    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    const [claveRenta, setClaveRenta] = useState('');
    const [estacionPrestamo, setEstacionPrestamo] = useState('');
    const [vehiculoReserva, setVehiculoReserva] = useState('');
    const [vehiculoPrestamo, setVehiculoPrestamo] = useState('');
    const [distanciaMaxRenta, setDistanciaMaxRenta] = useState(props.dataRent.distanciaRenta);

    const [segundos, setSegundos] = useState(props.dataRent.segundosResta);
    const [minutos, setMinutos] = useState(props.dataRent.minutosResta);
    const [horas, setHoras] = useState(props.dataRent.horasResta);
    const [diaRestante, setDiaRestante] = useState(props.dataRent.diaResta); 
    const [claveGenerada, setClaveGenerada] = useState(props.dataRent.clave); 


    const [isModalInfo, setIsModalInfo] = useState(false);
    
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
                    setSegundos(segundos - 1);
                  }else if(segundos == 0 && minutos > 0){
                    setMinutos(minutos - 1);
                    setSegundos(59);
                  }else if(segundos == 0 && minutos == 0 && horas > 0){
                    setHoras(horas - 1);
                    setMinutos(59);
                    setMinutos(59);
                  }else if(segundos == 0 && minutos == 0 && horas == 0 && diaRestante > 0){
                    setDiaRestante(diaRestante - 1);
                    setHoras(23);
                    setMinutos(59);
                    setMinutos(59);
                  }else{
                  }
            }, 1000);
            return () => clearInterval(timer);
        },[segundos])

    ///// OBTENIENDO LA POSSCION //////
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
        // updating state 
        console.log(latitude, longitude)
        /*setState({ ...state, 
            latActual: latitude,
            lngActual: longitude
        })*/
        setLatActual(latitude);
        setLngActual(longitude);
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
    const displayBackgroundInfoModal = (value) => {
        setIsModalInfo(value)
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
                    <View style={{ backgroundColor: "rgba(52, 52, 52, 0.9)", flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: Colors.$primario, justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                            <Image style={{
                                width: 250,
                                height: 90,
                            }} source={Images.logoHome} />
  
                            <Text style={{ 
                              textAlign: "center", 
                              color: Colors.$cuarto,
                              fontSize: 22, 
                              fontWeight: "700", 
                              marginTop: 20 }}
                            >Para devolver el vehículo debes estar en la estación</Text>
                            
                            
                            
                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Button
                                        title="ACEPTAR"
                                        color={Colors.$primario}
                                        onPress={() => { 
                                          displayBackgroundInfoModal(false) 
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
        props.navigationProp.navigate('DrawerHomeScreen');
    }
    const irFInRenta = () => {
        calcularDistancia();
        //props.navigationProp.navigate('Renta3GScreen')
    }

    const cambiarEstadoPrestamo = () => {
        const data = {
            "pre_id": props.dataRent.prestamo.data[0].pre_id,	
            "estado": 'VENCIDA'
        }
        let vehiculo = props.dataRent.prestamo.data[0].pre_bicicleta;
        props.cambiarEstadoPrestamo(data, vehiculo, 'DISPONIBLE');
    }

    const crearPenalizacion = async() => {
        const data = {
            "pen_id": "0",
            "pen_tipo_penalizacion": "1",
            "pen_novedad": "por vencimiento",
            "pen_usuario": state.documentoUser,
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
    }

    const vehiculoseleccionado = async(id, numVehiculo) => {
        setState({ ...state, ticket: id, numVehiculo: numVehiculo })
        await props.saveStateBicicletero(id, state.estacionSelect)
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

    const guardarPrestamo = async () => {
        let vehiculoPrestamo = '';
        let estacionPrestamo = '';
        let bicicletero = '';
        let reservaId = '';
        let hoy = new Date();
        let dia = state.dia;
        let fechaVence = '';

        if (dia === 'Sat') {
            fechaVence = new Date( hoy.setDate(hoy.getDate() + 2 ))
        }else{
            fechaVence = new Date( hoy.setDate(hoy.getDate() + 1 ))
        }

        
        if (props.dataRent.reservas === 0) {
            vehiculoPrestamo = state.ticket;
            estacionPrestamo = state.estacionSelect;
            bicicletero = props.dataRent.idBicicletero;
            reservaId = 'sinreserva';
        }else{
            vehiculoPrestamo = props.dataRent.reservas.data[0].res_bicicleta;
            estacionPrestamo = props.dataRent.reservas.data[0].res_estacion;
            bicicletero = props.dataRent.idBicicletero;
            reservaId = props.dataRent.reservas.data[0].res_id;
        }
        
        const data = {
            "pre_id": "0",
            "pre_hora_server": state.fecha,
            "pre_usuario": state.documentoUser,
            "pre_bicicleta": vehiculoPrestamo,
            "pre_retiro_estacion": estacionPrestamo,
            "pre_retiro_bicicletero": props.dataRent.idBicicletero,
            "pre_retiro_fecha": state.fecha,
            "pre_retiro_hora": state.horas,
            "pre_devolucion_estacion": estacionPrestamo,
            "pre_devolucion_bicicletero": props.dataRent.idBicicletero, //traer este dato dinámico
            "pre_devolucion_fecha": fechaVence,
            "pre_devolucion_hora": state.horas,
            "pre_duracion": "123",
            "pre_dispositivo": "android",
            "pre_estado": "ACTIVA"
        }
        
        await props.savePrestamo(data, vehiculoPrestamo, reservaId, estacionPrestamo ); 
        props.navigationProp.navigate('Rentar3GScreen')
    }

    const rentar = () => {
        cronometroVRenta('activo');
        guardarPrestamo();
    }

    const cambiarVehiculoReserva = async (data) => {
        await props.changeVehicleReserva(data, state.documentoUser, state.vehiculoNuevo);
    }

    const cambiarEstadoBici = async (estado, vehiculo) => {
        console.log('cambio de vehiculo por falla');
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
    
    const traerEstaciones = async(empresa) => {
        await props.viewEstacion(empresa)
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
        //let lat1 = state.latActual
        //let lng1 = state.lngActual
        //"lat2": props.dataRent.latEstacion,
        //"lng2": props.dataRent.lngEstacion,
        

        let coordenadas = {
            //coordenadas ubicacion
            //"lat1": 4.614051, //latitud estática
            //"lng1": -74.150902, //longitud estática
            "lat1": latActual, 
            "lng1": lngActual,
            //coordenadas estacion 
            //"lat2": 7.382479,
            //"lng2": -72.651799,
            "lat2": latEstacionState,
            "lng2": lngEstacionState,
        }
        
        if (latEstacionState !== '' && lngEstacionState !== '') {
            console.log('ESTAS SON LAS COOOOORDENADAS :::::::', coordenadas)
            await props.calcularDistancia(coordenadas)
        }else{
            console.log('NO han cargado las coordenadas de la estacion', coordenadas)
            addPropsCoord();
        }
        
    }


    const cargarIDbicicletero = () => {
        console.log('SAVE ID DEL BICICLETERO EN STATE GLOBAL');
        props.saveStateBicicletero(props.dataRent.reservas.data[0].res_bicicleta, props.dataRent.reservas.data[0].res_estacion);
        verState();
    }
    //HOOK componentDidMount se ejecuta después del primer renderizado
    
    /**/useEffect(() => {
        getPosition();
        userActivo(state.documentoUser);
        verFallas();
        prestamoActivo(state.documentoUser);
        reservasActivas(state.documentoUser);
        validarHor(state.organizacion);
        verPenalizaciones(state.documentoUser);
        traerEstaciones(state.organizacion);
        calcularDistancia();
    },[])

    useEffect(() => {
        reservasActivas(state.documentoUser);
        setState({ 
            ...state, 
            vehiculoEstadoOK : ''
        })
        props.reseteoCambioVehiculo();
    },[props.dataRent.cambioVehiculo === true])

   
    
    useEffect(() => {
        calcularDistancia(); //descomentó
        addPropsCoord();
    },[latEstacionState !== '' && lngEstacionState !== ''])

    const cargarClave = () =>{
        setClaveRenta(props.dataRent.clave);
        setEstacionPrestamo(props.dataRent.estacionPrestamo);
        setVehiculoPrestamo(props.dataRent.vehiculoPrestamo);
    }

    useEffect(() => {
        cargarClave()
    },[props.dataRent.clave !== null])

    useEffect(() => {
        cargarClave();
    },[claveRenta === ''])

    //effect para distancia con la estación
    useEffect(() => {
        setDistanciaMaxRenta(props.dataRent.distanciaRenta);
    },[props.dataRent.distanciaRenta !== distanciaMaxRenta])

    useEffect(() => {
        setVehiculoReserva(props.dataRent.vehiculoReserva);
    },[vehiculoReserva !== ''])

    



    //////////////// CRONOMETRO ///////////////////
    //const [segundos, setSegundos] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos : 0);
    //const [minutos, setMinutos] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos : 0);
    //const [horas, setHoras] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.horas ? props.dataRent.CronometroStorageVP.CronometroStorageVP.horas : 0);
    const [segundosV, setSegundosV] = useState(0);
    const [minutosV, setMinutosV] = useState(0);
    const [horasV, setHorasV] = useState(0);
    const [activoV, setActivoV] = useState(false);
    const [intervaloV, setIntervaloV] = useState(null);

    const cronometroVRenta = () => {   
        console.log('iniciando cronómetro')
        if (activoV) {
          console.log('viaje pausadooooo')
          clearInterval(intervaloV);
          setActivoV(false);
        } else {
          console.log('iniciando activo')
          const idIntervaloV = setIntervaloV(() => {
            setSegundosV(prevSegundosV => prevSegundosV + 1);
          }, 1000);
          setIntervaloV(idIntervaloV);
          setActivoV(true);
        }
    };
    
    useEffect(() => {
        return () => clearInterval(intervaloV);
    }, [intervaloV]);

    const pausarViaje = () =>{
        cronometroVRenta();
        //setState({ ...state,  pausa: true })
        //setActivo(true);
    }

    const reanudarViaje = () =>{
        //setState({ ...state,  pausa: false })
        cronometroVRenta();
        //setActivo(false);
    }

    const incrementarMin = () => {
        console.log('otro minuto');
        setSegundosV(0);
        setMinutosV(minutosV + 1);
        if (activo) {
            getPosition();
            guardarsegundosCronometroStorageVP(); 
        }else{
            console.log('viaje pausado')
        }   
    }

    const guardarsegundosCronometroStorageVP = () => {
        const datosVR = {
          segundos: segundosV,
          minutos: minutosV,
          horas : horasV,
          latAct: latActual,
          lngActual: lngActual
        }
        try {
          AsyncStorage.mergeItem('cronometroVRenta', JSON.stringify(datosVR))
          AsyncStorage.getItem('cronometroVRenta').then((res) => {
            if (res !== null) {
                console.log( 'objeto cronometro VP',{res: JSON.parse(res) } );
            }
        })
        } catch (error) {
          console.log(error);
        }
    }
    /////////////// END CRONOMETRO ///////////////////

    useEffect(()=>{
        setState({ 
            ...state, 
            distanciaDispositivoEstacion : props.dataRent.distanciaMt
        })
    },[props.dataRent.distanciaMt !== state.distanciaDispositivoEstacion])
/*
    useEffect(()=>{
        const timer = setInterval(() => {
            console.log('calculando distancia desde el efecto cada 10 seg');
            getPosition();
            calcularDistancia();
        }, 10000);
        return () => clearInterval(timer);
    },[])

    useEffect(() => {
        calcularDistancia();
        cronometroVRenta();
        displayBackgroundInfoModal(true)
    },[props.dataRent.latEstacion !== '' && 
        props.dataRent.lngEstacion !== '' && latActual !== '' && lngActual !== ''])*/

        useEffect(() => {
            getPosition();
            calcularDistancia();
            cronometroVRenta();
            traerEstaciones(state.organizacion);
            console.log('la distacia max de la renta: ', distanciaMaxRenta);
            console.log('la distacia con la estacion: ', props.dataRent.distanciaMt);
            //displayBackgroundInfoModal(true)
        },[])
    
    return (
    <SafeAreaView>  
        {(isModalInfo) ? openBackgroundInfoModal() : <></>}  
        {(props.dataRent.distanciaMt >= distanciaMaxRenta  ) ? props.navigationProp.navigate('Renta3GScreen') :openBackgroundInfoModal()}  
        <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 10, backgroundColor : Colors.$primario}}>
            <View >
                <Image style={{marginLeft: moderateScale(10), width : horizontalScale(350), height : verticalScale(55)}} source={Images.flechaAtras} />
            </View>
        </TouchableOpacity>
            <View style={estilos.contenedor}>
                <View style={estilos.cajaDatosViaje}>

                <View style={estilos.contentMsn}>
                    <Text style={estilos.textVehiculo}>Viaje en progresooooo</Text>
                    <Text style={estilos.textVehiculo2}>Renta vence:</Text>
                    <Text style={estilos.textVehiculo2}>
                        {(props.dataRent.prestamoActivo === true) ?
                        props.dataRent.prestamo.data[0].pre_devolucion_fecha :
                        'No se ha cargado la fecha'}
                    </Text> 
                </View> 

                <View style={estilos.contentMsn}>
                    <Text style={estilos.textVehiculo2}>Distancia con la estación</Text>
                    <Text style={estilos.textClave}>
                        { /*props.dataRent.latEstacion !== '' && props.dataRent.lngEstacion !== '' ?
                        props.dataRent.distanciaMt 
                        :
                        'calculando...'
                        */} 
                        { latActual !== '' && lngActual !== '' ?
                        props.dataRent.distanciaMt 
                        :
                        'calculando...'
                        } 
                        <Text style={estilos.textVehiculo2}> metros</Text>
                    </Text> 
                </View>

                {/*<TouchableOpacity  onPress={() => { verState()}}>
                    <View style={estilos.btnSaveOKdevolver}>
                        <Text style={estilos.btnSaveColor}>ver state</Text>
                    </View>
                </TouchableOpacity>*/}

               

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
                    <TouchableOpacity  onPress={()=>{ 
                        irFInRenta() 
                    }} style={estilos.btnCenter}>
                        <View style={estilos.btnSaveOK}>
                            <Text style={estilos.btnSaveColor}>Devolver vehículo</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity  onPress={()=>{ 
                        props.navigationProp.navigate('Ayuda3GScreen') 
                        }} style={estilos.btnCenter}>
                            <View style={estilos.btnSaveOK}>
                                <Text style={estilos.btnSaveColor3}>AYUDA</Text>
                            </View>
                    </TouchableOpacity> 

                    
                    {<TouchableOpacity  onPress={() => { verState()}}>
                                            <View style={estilos.btnSaveOKdevolver}>
                                                <Text style={estilos.btnSaveColor}>ver state</Text>
                                            </View>
                                        </TouchableOpacity>}
                </View>
                
                </View>                                                  
            </View>
    </SafeAreaView>
    );
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
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
)(ViajeActivoScreen);


