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
    ScrollView,
    PermissionsAndroid
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
    cancelar__,
    resetBicicletaYaPrestada,
    validateBikeAvailability
} from '../../actions/actions3g';
import { saveFormPreoperacional } from '../../actions/actionPerfil';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import URL_mysql from './functions/url';
import { apimysql } from './functions/funciones'
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
import { Tarjeta } from './Tarjeta';
import BackgroundActions from 'react-native-background-actions';
import { NativeModules } from 'react-native';
const { Notificacion2HorasModule } = NativeModules;

const keyMap = Env.key_map_google;
const options = {
    taskName: 'Viaje con movilidad 3G',
    taskTitle: 'Viaje 3G',
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

function Rentar3GScreen(props) {
    const dispatch = useDispatch();
    const { logout } = useContext(AuthContext);
    const [state, setState] = useState({
        organizacion: '',
        fecha: new Date(),
        fechaVence: '',
        dia: new Date().toUTCString().substr(0, 3),
        resDia: null,
        horaValida: false,
        minutos: new Date().getMinutes(),
        horas: new Date().getHours(),
        ticket: null, //vehículo select
        dataVehiculo: [],
        vehiculo: false,
        estacionSelect: '',
        horarioSelect: 24,
        diasR: 10,
        horasR: 10,
        minutosR: 10,
        segundosR: 10,
        intervalo: '',
        reservaVencida: false,
        prestamoVencido: false,
        registroFinalizado: false,
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

    const { infoUser } = useContext(AuthContext)

    const [latEstacionState, setLatEstacionState] = useState(props.dataRent.latEstacion);
    const [lngEstacionState, setLngEstacionState] = useState(props.dataRent.lngEstacion);
    const [latActual, setLatActual] = useState('');
    const [lngActual, setLngActual] = useState('');
    const [claveRenta, setClaveRenta] = useState('');
    const [estacionPrestamo, setEstacionPrestamo] = useState('');
    const [vehiculoReserva, setVehiculoReserva] = useState('');
    const [vehiculoPrestamo, setVehiculoPrestamo] = useState('');
    const [distanciaMaxRenta, setDistanciaMaxRenta] = useState('');
    const [segundos, setSegundos] = useState(props.dataRent.segundosResta);
    const [minutos, setMinutos] = useState(props.dataRent.minutosResta);
    const [horas, setHoras] = useState(props.dataRent.horasResta);
    const [diaRestante, setDiaRestante] = useState(props.dataRent.diaResta);
    const [claveGenerada, setClaveGenerada] = useState(props.dataRent.clave);
    const [isModalCancelVisible, setIsModalCancelVisible] = useState(false);
    const [touchRentar, setTouchRentar] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalTest, setModalTest] = useState(false);
    const [casco, setCasco] = useState(false);
    const [sobrio, setSobrio] = useState(false);
    const [funcional, setFuncional] = useState('');
    const [fechaVencimiento, setfechaVencimiento] = useState('');

    const goHome3G = () => { RootNavigation.navigate('Home3G') }
    const Home = () => { RootNavigation.navigate('Home') }

    useEffect(() => {
        setTouchRentar(false);
    }, [])

    useEffect(() => {
        setSegundos(props.dataRent.segundosResta);
        setMinutos(props.dataRent.minutosResta);
        setHoras(props.dataRent.horasResta);
        setDiaRestante(props.dataRent.diaResta);
        setClaveGenerada(props.dataRent.clave);
    }, [props.dataRent.segundosResta])

    useEffect(() => {
        const timer = setInterval(() => {
            if (segundos > 0) {
                setSegundos(segundos - 1);
            } else if (segundos == 0 && minutos > 0) {
                setMinutos(minutos - 1);
                setSegundos(59);
            } else if (segundos == 0 && minutos == 0 && horas > 0) {
                setHoras(horas - 1);
                setMinutos(59);
                setMinutos(59);
            } else if (segundos == 0 && minutos == 0 && horas == 0 && diaRestante > 0) {
                setDiaRestante(diaRestante - 1);
                setHoras(23);
                setMinutos(59);
                setMinutos(59);
            } else {
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [segundos])

    ///////////// modal ///////////////
    const displayBackgroundInfoModal = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal: value })
    }
    const stateModalCancelRent = (value) => {
        setIsModalCancelVisible(value);
    }

    const openModalError = () => {
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
                        <View style={{ flex: 3, borderRadius: 20, marginVertical: 200, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 20 }}>

                            <Text style={{
                                textAlign: "center",
                                color: Colors.$texto80,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >Vehículo no disponible</Text>

                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: 200,
                                minHeight: 200,
                            }}>
                                {
                                    Env.modo === 'tablet' ?
                                        <Text style={{
                                            fontSize: 25,
                                            color: Colors.$texto,
                                            textAlign: 'center',
                                            fontFamily: Fonts.$poppinsregular
                                        }}>Error</Text>
                                        :
                                        <LottieView source={require('../../Resources/Lotties/bicy_error.json')} autoPlay loop
                                            style={{
                                                width: 150,
                                                height: 150
                                            }} />
                                }
                            </View>

                            <Pressable
                                onPress={() => {
                                    setModalError(false)
                                }}
                                style={estilos.btnCenter}>
                                <View style={[estilos.btnSaveOK, {
                                    backgroundColor: Colors.$secundario,
                                    width: 300
                                }]}>
                                    <Text style={[estilos.textBtnNext, {
                                        color: Colors.$texto, fontSize: 18, fontFamily: Fonts.$poppinsregular
                                    }]}>Aceptar</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        )
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
                        <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                            <Image style={{
                                width: 60,
                                height: 60,
                            }} source={Images.logo} />

                            <Text style={{ textAlign: "center", color: "#818181", fontSize: moderateScale(18), marginTop: 20 }}>No manipular la guaya</Text>
                            <View style={estilos.cajaImgGuaya}>
                                <Image style={estilos.imgGuaya} source={Images.manipularGuaya} />
                            </View>

                            <Text style={{ textAlign: "center", color: "#818181", fontSize: moderateScale(14), fontWeight: "200", marginTop: 20 }}>No manipular la guaya</Text>
                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Pressable
                                        onPress={() => { displayBackgroundInfoModal(false) }}
                                        style={{ backgroundColor: Colors.$primario, borderRadius: 18 }}>
                                        <Text style={[estilos.btnSaveColor2, { padding: verticalScale(10) }]}>ACEPTAR</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>



                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
    }

    const [respuestas, setRespuestas] = useState({});
    const [comentarios, setComentarios] = useState("");
    const [aceptado, setAceptado] = useState(false);
    const [preoperacinalOK, setPreoperacionalOK] = useState(false)

    const preguntas = [
        { texto: "¿Te comprometes a conducir de manera responsable, respetando todas las normas de tránsito, manteniendo una velocidad inferior a 25 km/h en todo momento, sin utilizar audífonos y con total concentración en la vía?", comentario: false },
        { texto: "¿Estás en condiciones de salud y descanso para usar la bicicleta sin malestar, mareos, fiebre, sueño u otros síntomas?", comentario: false },
        { texto: "¿Llevas los elementos de protección requeridos: casco para ciclista? y si vas a realizar un recorrido después de las 6 p.m o antes de las 6 a.m valida si llevas una prenda reflectiva.", comentario: false },
        { texto: "¿Existen condiciones óptimas en los componentes mecánicos?: Marco, Manubrio, llantas, reflectores, asiento, pedales, frenos, cambios, plato, cadenilla, tenedor, campana, y manillares, entre otros?", comentario: false },
        { texto: "Las llantas cuentan con un labrado y sin desgastes, se encuentren sin protuberancias, cortes, fisuras o deformaciones?", comentario: false },
        { texto: "¿Existen condiciones óptimas en los componentes eléctricos?: Batería, motor, controlador, display, luces delantera y trasera, pedaleo asistido y cableado, entre otros?", comentario: false },
        { texto: "¿Hay alguna situación o elemento de los descritos a continuación que esté presentado un riesgo y pueda llegar a causar un accidente? : Vías internas deterioradas, iluminación deficiente, ausencia de señalización en los parqueaderos, conexiones eléctricas peligrosas, elementos eléctricos deteriorados, rampas de acceso muy empinadas o resbalosas, comportamientos riesgosos de otros actores viales en estos espacios, entre otros.", comentario: false },
        { texto: "Si dentro de la respuesta anterior algún elemento NO cumple: detalla aquí lo que encontraste. (Opcional)", comentario: true },
    ];


    const handleRespuesta = (index, valor) => {
        setRespuestas({ ...respuestas, [index]: valor });
    };

    const validarFormulario = () => {
        // Verificar todas las preguntas menos la de comentario (comentario: true)
        for (let i = 0; i < preguntas.length; i++) {
            if (!preguntas[i].comentario && !respuestas[i]) {
                Alert.alert("Formulario incompleto", "Debes responder todas las preguntas obligatorias antes de continuar.");
                return;
            }
        }

        // Validar respuestas obligatorias
        for (let i = 0; i < preguntas.length; i++) {
            const esComentario = preguntas[i].comentario;
            const esRiesgo = preguntas[i].texto.includes("¿Hay alguna situación o elemento de los descritos"); // la pregunta de riesgos

            if (!esComentario && !esRiesgo && respuestas[i] !== "SI") {
                Alert.alert(
                    "Respuestas inválidas",
                    "Si notas algún problema en este vehículo, te sugerimos rentar otro que esté en perfecto estado para tu seguridad."
                );
                return;
            }

            if (esRiesgo) {
                if (respuestas[i] !== "NO") {
                    // Si respondió "SI", comentario obligatorio
                    if (!comentarios || comentarios.trim() === "") {
                        Alert.alert(
                            "Comentario requerido",
                            "Si reportaste un riesgo, debes detallar la situación en el comentario."
                        );
                        return;
                    }
                }
            }
        }

        if (!aceptado) {
            Alert.alert("Aceptación requerida", "Debes aceptar la declaración antes de continuar.");
            return;
        }

        // Si todo es válido
        console.log('Respuestas del formulario', respuestas)
        console.log('comentario', comentarios)
        const formulario = {
            "respuestas": respuestas,
            "comentario": comentarios !== "" ? comentarios : 'sincomentario'
        }
        console.log('Datos formularios unidos', formulario);
        dispatch(saveFormPreoperacional(formulario));
    };

    useEffect(() => {
        if (props.perfil.form_preoperacional_estado) {
            //Alert.alert("Formulario Preoperacional se guardo en el estado exitosamente");
            console.log('STATE en reducer', props.perfil.form_preoperacional)
            setModalTest(false)
            setPreoperacionalOK(true)
        }
    }, [props.perfil.form_preoperacional_estado])

    const openModalTest = () => {
        return (
            <>
                <Modal transparent={false} animationType="slide">
                    <ScrollView style={stylesForm.container}>
                        <View style={{
                            width: Dimensions.get('window').width,
                            height: 'auto',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={stylesForm.titulo}>Cuestionario Preoperacional</Text>
                            <LottieView source={require('../../Resources/Lotties/bicy_feliz_viaje.json')} autoPlay loop
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: Dimensions.get('window').width,
                                }} />
                        </View>

                        <View style={{
                            width: Dimensions.get('window').width,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: 50
                        }}>
                            {preguntas.map((pregunta, index) => (
                                <View key={index} style={stylesForm.preguntaContainer}>
                                    <Text style={stylesForm.pregunta}>{pregunta.texto}</Text>

                                    {/* Campo de texto solo en la pregunta de comentario */}
                                    {index === 7 ? (
                                        <TextInput
                                            style={[stylesForm.input, { height: 100 }]} // altura aproximada para 4 líneas
                                            placeholder="Escribe tu comentario..."
                                            value={comentarios}
                                            onChangeText={setComentarios}
                                            multiline
                                            numberOfLines={4}
                                        />
                                    ) : (
                                        <View style={stylesForm.botones}>
                                            <Pressable
                                                style={[
                                                    stylesForm.boton,
                                                    respuestas[index] === "SI" && stylesForm.botonSeleccionado,
                                                ]}
                                                onPress={() => handleRespuesta(index, "SI")}
                                            >
                                                <Text
                                                    style={[
                                                        stylesForm.botonTexto,
                                                        respuestas[index] === "SI" && stylesForm.textoSeleccionado,
                                                    ]}
                                                >
                                                    SI
                                                </Text>
                                            </Pressable>

                                            <Pressable
                                                style={[
                                                    stylesForm.boton,
                                                    respuestas[index] === "NO" && stylesForm.botonSeleccionado,
                                                ]}
                                                onPress={() => handleRespuesta(index, "NO")}
                                            >
                                                <Text
                                                    style={[
                                                        stylesForm.botonTexto,
                                                        respuestas[index] === "NO" && stylesForm.textoSeleccionado,
                                                    ]}
                                                >
                                                    NO
                                                </Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            ))}

                            {/* Checkbox de aceptación */}
                            <Pressable
                                style={stylesForm.checkboxContainer}
                                onPress={() => setAceptado(!aceptado)}
                            >
                                <View style={[stylesForm.checkbox, aceptado && stylesForm.checkboxMarcado]} />
                                <Text style={stylesForm.textoCheckbox}>
                                    Declaro que he realizado la inspección preoperacional de la bicicleta asignada, y soy consciente del estado en el que se encuentra. En caso de haber identificado fallas, las he registrado en este formato y notificado al BC Amigo de la estación
                                </Text>
                            </Pressable>

                            {/* Botón de Aceptar */}
                            <Pressable style={stylesForm.botonAceptar} onPress={validarFormulario}>
                                <Text style={stylesForm.botonAceptarTexto}>Aceptar</Text>
                            </Pressable>

                        </View>

                    </ScrollView>
                </Modal>
            </>
        )
    }

    const openBackgroundInfoModalCancel = () => {
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
                        <View style={{ flex: 3, borderRadius: 20, marginVertical: 200, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 20 }}>

                            <Text style={{
                                textAlign: "center",
                                color: Colors.$texto80,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >La reserva ha sido cancelada</Text>

                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: 200,
                                minHeight: 200,
                            }}>
                                {
                                    Env.modo === 'tablet' ?
                                        <Text style={{
                                            fontSize: 25,
                                            color: Colors.$texto,
                                            textAlign: 'center',
                                            fontFamily: Fonts.$poppinsregular
                                        }}>Reserva cancelada</Text>
                                        :
                                        <LottieView source={require('../../Resources/Lotties/bicy_error.json')} autoPlay loop
                                            style={{
                                                width: 150,
                                                height: 150
                                            }} />
                                }
                            </View>

                            <Pressable
                                onPress={() => {
                                    Home()
                                }}
                                style={estilos.btnCenter}>
                                <View style={[estilos.btnSaveOK, {
                                    backgroundColor: Colors.$secundario,
                                    width: 300
                                }]}>
                                    <Text style={[estilos.textBtnNext, {
                                        color: Colors.$texto, fontSize: 18, fontFamily: Fonts.$poppinsregular
                                    }]}>Aceptar</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
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
                    <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={estilos.textCargando}>Cargando datos para la renta</Text>
                            <LottieView source={require('../../Resources/Lotties/bicycle.json')} autoPlay loop style={{ width: '100%', height: '100%' }} />
                        </View>
                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
    }
    ///////////////////////////////////

    ///// OBTENIENDO LA POSSCION //////
    const getPosition = () => {
        Geolocation.getCurrentPosition(
            geoSuccess,
            geoFailed,
            geoSetup
        );
        //calcularDistancia();
    }

    const geoSuccess = (positionActual) => {
        let { latitude, longitude } = positionActual.coords
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
    const irFInRenta = () => {
        RootNavigation.navigate('FinalizarViaje')
    }

    const cambiarEstadoPrestamo = () => {
        const data = {
            "pre_id": props.dataRent.prestamo.data[0].pre_id,
            "estado": 'VENCIDA'
        }
        let vehiculo = props.dataRent.prestamo.data[0].pre_bicicleta;
        props.cambiarEstadoPrestamo(data, vehiculo, 'DISPONIBLE');
    }

    const crearPenalizacion = async () => {
        const data = {
            "pen_id": "0",
            "pen_tipo_penalizacion": "1",
            "pen_novedad": "por vencimiento",
            "pen_usuario": infoUser.DataUser.idNumber,
            "pen_fecha_creacion": state.fecha.toUTCString().substr(0, 10),
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

    const vehiculoseleccionado = async (data) => {
        console.log('data', data);
        console.log('estado', data.bic_estado);
        if (touchRentar) {
            Alert.alert('Se está procesando un préstamo');
            return;
        }

        if (data.bic_estado === 'DISPONIBLE') {
            // Validar disponibilidad de la bicicleta antes de seleccionarla
            dispatch(validateBikeAvailability(data.bic_id));
            setState({ ...state, ticket: data.bic_id, numVehiculo: data.bic_numero })
            dispatch(saveStateBicicletero(data.bc_bicicletero.bro_id));
        } else {
            setModalError(true);
        }
    }

    const viewBicycle = async (value) => {
        console.log('en viewBicycle', value)
        console.log('en viewBicycle la estacion', value.est_estacion)
        setState({
            ...state,
            estacionSelect: value.est_estacion,
            horarioSelect: Number(value.est_last_conect),
        })
        if (value.est_estacion !== '') {
            await props.viewVehiculo(value.est_estacion);
        }
        console.log('en viewBicycle el STATE', state);
    }

    const cancelarReserva = async () => {
        let vehiculo = props.dataRent.reservas.data[0].res_bicicleta;
        const data = { "res_id": props.dataRent.reservas.data[0].res_id, "estado": 'CANCELADA' }
        await resetState();
        await dispatch(cambiarEstadoReserva(data, vehiculo));
    }

    const resetState = async () => {
        await setLatActual('');
        await setLngActual('');
        await setClaveRenta('');
        await setEstacionPrestamo('');
        await setVehiculoReserva('');
        await setVehiculoPrestamo('');
        await setDistanciaMaxRenta('');
        await setIsModalCancelVisible(false);
        await setModalError(false);
        await setModalTest(false);
        await setCasco(false);
        await setSobrio(false);
        await setFuncional('');
        //await setTouchRentar(false);
        setState({
            ...state,
            organizacion: '',
            fecha: new Date(),
            fechaVence: '',
            dia: new Date().toUTCString().substr(0, 3),
            resDia: null,
            horaValida: false,
            minutos: new Date().getMinutes(),
            horas: new Date().getHours(),
            ticket: null, //vehículo select
            dataVehiculo: [],
            vehiculo: false,
            estacionSelect: '',
            horarioSelect: 24,
            diasR: 10,
            horasR: 10,
            minutosR: 10,
            segundosR: 10,
            intervalo: '',
            reservaVencida: false,
            prestamoVencido: false,
            registroFinalizado: false,
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
        })
    }

    const guardarPrestamo = async () => {
        let vehiculoPrestamo = '';
        let estacionPrestamo = '';
        let bicicletero = '';
        let reservaId = '';
        let hoy = new Date();
        let dia = state.dia;
        let fechaVence = '';
        const fechaRetiro = new Date(hoy);
        fechaRetiro.setHours(fechaRetiro.getHours() - 5);

        if (props.dataRent.reservas === 0) {
            vehiculoPrestamo = state.ticket;
            estacionPrestamo = state.estacionSelect;
            bicicletero = props.dataRent.idBicicletero;
            reservaId = 'sinreserva';

            const horario = Number(state.horarioSelect);
            let daysToAdd = !isNaN(horario) ? (horario / 24) : 1; // Fallback to 1 day
            if (dia === 'Sat') daysToAdd += 1;

            fechaVence = new Date(fechaRetiro);
            fechaVence.setDate(fechaVence.getDate() + Math.floor(daysToAdd));

        } else {
            vehiculoPrestamo = props.dataRent.reservas.data[0].res_bicicleta;
            estacionPrestamo = props.dataRent.reservas.data[0].res_estacion;
            bicicletero = props.dataRent.dataVehiculoReserva.bc_bicicletero.bro_id;
            reservaId = props.dataRent.reservas.data[0].res_id;

            const tiempo = Number(props.dataRent.tiempoRestante);
            let daysToAdd = !isNaN(tiempo) ? (tiempo / 24) : 1; // Fallback to 1 day
            if (dia === 'Sat') daysToAdd += 1;

            fechaVence = new Date(fechaRetiro);
            fechaVence.setDate(fechaVence.getDate() + Math.floor(daysToAdd));

        }

        // Safety check for valid date before .toJSON()
        const fechaVenceISO = (fechaVence instanceof Date && !isNaN(fechaVence))
            ? fechaVence.toJSON()
            : new Date().toJSON();

        const ahora = new Date();
        ahora.setHours(ahora.getHours() - 5);

        const timeString = ahora.toLocaleTimeString('en-GB', { hour12: false });

        const data = {
            "pre_id": "0",
            "pre_hora_server": state.fecha.toJSON(),
            "pre_usuario": infoUser.DataUser.idNumber,
            "pre_bicicleta": vehiculoPrestamo,
            "pre_retiro_estacion": estacionPrestamo,
            "pre_retiro_bicicletero": bicicletero,
            "pre_retiro_fecha": ahora.toJSON(),
            "pre_retiro_hora": timeString,
            "pre_devolucion_estacion": estacionPrestamo,
            "pre_devolucion_bicicletero": bicicletero,
            "pre_devolucion_fecha": fechaVenceISO,
            "pre_devolucion_hora": timeString,
            "pre_duracion": "null",
            "pre_dispositivo": Platform.OS + '-' + 'RIDE',
            "pre_estado": "ACTIVA",
            "pre_modulo": "3g"
        }
        console.log('data crear renta con reserva ', data)
        const resRenta = await dispatch(savePrestamo(data, vehiculoPrestamo, reservaId, estacionPrestamo, fechaVenceISO));

        console.log('la respuesta al rentar:::::::', resRenta)
        if (Env.modo === 'movil') {
            const vencimiento = (fechaVence instanceof Date && !isNaN(fechaVence))
                ? fechaVence.getTime()
                : new Date().getTime();
            setfechaVencimiento(vencimiento);
            //await programarNotificacion(vencimiento) // descomentar luego de probar la funcion
        }
        await resetState()
    }

    const programarNotificacion = async () => {
        console.log('entrando para activar notificacion de 2 horas antes')
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        //const fechaEvento = new Date("2025-08-20T18:20:00"); // ejemplo
        await Notificacion2HorasModule.programarNotificacion2Horas(fechaVencimiento);
        await RootNavigation.navigate('ViajeActivo');
    };

    const cerrandoSesion = async () => {
        console.log('cerrando la sesion estamos en tablet');
        await dispatch(cancelar__());
        await logout();
    }
    useEffect(() => {
        if (props.dataRent.prestamoSave) {
            if (Env.modo === 'tablet') {
                console.log('ESTAMOS EN TABLET VAMOS A CERRAR SESION 3G');
                cerrandoSesion();
            } else {
                programarNotificacion();
            }
        }
    }, [props.dataRent.prestamoSave])

    useEffect(() => {
        if (props.dataRent.bicicletaYaPrestada) {
            setTouchRentar(false)
            Alert.alert(
                'Bicicleta no disponible',
                'Esta bicicleta ya tiene un préstamo activo. Por favor selecciona otra.'
            );
            // Limpiar el vehículo seleccionado
            setState({ ...state, ticket: null, numVehiculo: '' });
            // Reset the flag so user can select another bike
            dispatch(resetBicicletaYaPrestada());
        }
    }, [props.dataRent.bicicletaYaPrestada])

    const rentar = async () => {
        await setTouchRentar(true)
        await guardarPrestamo();
    }

    const cambiarVehiculoReserva = async (data) => {
        await props.changeVehicleReserva(data, infoUser.DataUser.idNumber, state.vehiculoNuevo);
    }

    const cambiarEstadoBici = async (estado, vehiculo) => {
        const data = { "bic_id": vehiculo, "bic_estado": estado }
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
            setState({ ...state, vehiculoEstadoOK: estado });
        } else if (estado === 'falla') {
            setState({ ...state, vehiculoEstadoOK: estado });
        } else {
            setState({ ...state, vehiculoEstadoOK: estado });
            viewBicycle(state.estacionSelect)
        }

    }

    const estadoCasco = (estado) => { setState({ ...state, casco: estado }); }
    const estadoSobrio = (estado) => { setState({ ...state, sobrio: estado }); }

    const otroVehiculo = () => {
        let id = props.dataRent.reservas.data[0].res_bicicleta;
        cambiarEstadoBici('FALLA MECANICA', id);
    }

    const addPropsCoord = () => {
        setLatEstacionState(props.dataRent.latEstacion);
        setLngEstacionState(props.dataRent.lngEstacion);
    }

    const calcularDistancia = async () => {

        let coordenadas = {
            "lat1": latActual,
            "lng1": lngActual,
            "lat2": latEstacionState,
            "lng2": lngEstacionState,
        }

        if (latEstacionState !== '' && lngEstacionState !== '' && latActual !== '' && lngActual !== '') {

            await props.calcularDistancia(coordenadas)
        } else {
            console.log('NO han cargado las coor de la estacion', coordenadas)
            addPropsCoord();
        }

    }


    const cargarIDbicicletero = () => {
        props.saveStateBicicletero(props.dataRent.reservas.data[0].res_bicicleta, props.dataRent.reservas.data[0].res_estacion);
        verState();
    }

    const traerEstaciones = async (empresa) => {
        await props.viewEstacion(empresa)
    }

    useEffect(() => {
        if (props.perfil.empresa !== null) {
            traerEstaciones(props.perfil.empresa);
            validarHor(props.perfil.empresa);
        }
    }, [props.perfil.empresa])


    useEffect(() => {
        //console.log('dispositivo ', Platform.OS)
        //console.log('la distancia esSSSSSSSSSSSSS ::', props.dataRent.distanciaMt)
        getPosition();
        //userActivo(infoUser.DataUser.idNumber);
        verFallas();
        prestamoActivo(infoUser.DataUser.idNumber);
        reservasActivas(infoUser.DataUser.idNumber);
        //verPenalizaciones(infoUser.DataUser.idNumber);
        //cronometroVRenta();
        //validarHor(state.organizacion);
        //traerEstaciones(state.organizacion);
        //calcularDistancia();
    }, [])

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
            vehiculoEstadoOK: ''
        })
        props.reseteoCambioVehiculo();
    }, [props.dataRent.cambioVehiculo === true])

    useEffect(() => {
        calcularDistancia(); //descomentó
        addPropsCoord();
        getPosition();
    }, [latEstacionState !== '' && lngEstacionState !== ''])

    const cargarClave = () => {
        setClaveRenta(props.dataRent.clave);
        setEstacionPrestamo(props.dataRent.estacionPrestamo);
        setVehiculoPrestamo(props.dataRent.vehiculoPrestamo);
    }

    useEffect(() => {
        cargarClave()
    }, [props.dataRent.clave !== null])

    useEffect(() => {
        cargarClave();
    }, [claveRenta === ''])

    //effect para distancia con la estación
    useEffect(() => {
        const correo = infoUser.DataUser.email;
        const busqueda_tuempresa = "@tuempresa.com";
        const indice_tuempresa = correo.indexOf(busqueda_tuempresa);

        if (indice_tuempresa !== -1) {
            console.log('para la distancia con tuempresa');
            setDistanciaMaxRenta(10000000);
        } else {
            setDistanciaMaxRenta(props.dataRent.distanciaRenta);
        }

    }, [props.dataRent.distanciaRenta !== distanciaMaxRenta])

    useEffect(() => {
        setVehiculoReserva(props.dataRent.vehiculoReserva);
    }, [vehiculoReserva !== ''])


    //////////////// CRONOMETRO ///////////////////
    //const [segundosV, setSegundosV] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.segundos : 0);
    //const [minutosV, setMinutosV] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos ? props.dataRent.CronometroStorageVP.CronometroStorageVP.minutos : 0);
    //const [horasV, setHorasV] = useState(props.dataRent.CronometroStorageVP.CronometroStorageVP.horas ? props.dataRent.CronometroStorageVP.CronometroStorageVP.horas : 0);
    const [segundosV, setSegundosV] = useState(props.dataRent.segundosRentaTrans);
    const [minutosV, setMinutosV] = useState(props.dataRent.minutosRentaTrans);
    const [horasV, setHorasV] = useState(props.dataRent.horasRentaTrans);
    const [activoV, setActivoV] = useState(false);
    const [intervaloV, setIntervaloV] = useState(null);

    useEffect(() => {
        setSegundosV(props.dataRent.segundosRentaTrans);
        setMinutosV(props.dataRent.minutosRentaTrans);
        setHorasV(props.dataRent.horasRentaTrans);
    }, [props.dataRent.segundosRentaTrans])


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

    /*const pausarViaje = () =>{
        cronometroVRenta();
        //setState({ ...state,  pausa: true })
        //setActivo(true);
    }

    const reanudarViaje = () =>{
        //setState({ ...state,  pausa: false })
        cronometroVRenta();
        //setActivo(false);
    }*/

    const incrementarMin = () => {
        console.log('otro minuto');
        setSegundosV(0);
        setMinutosV(minutosV + 1);
        if (activoV) {
            //getPosition();
            //guardarsegundosCronometroStorageVP(); 
        } else {
            console.log('viaje pausado')
        }
    }

    const remove = (str, word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const result = str.replace(regex, '');
        return result.trim().replace(/\s\s+/g, ' ');
    }

    {
        useEffect(() => {
            const time2 = setInterval(() => {
                //console.log('actualizando posicion y prestamo es ', props.dataRent.prestamoActivo)
                getPosition();
            }, 5000);
        }, [props.dataRent.latEstacion !== '' &&
            props.dataRent.lngEstacion !== '' &&
            latActual !== '' &&
            lngActual !== ''
        ])
    }

    useEffect(() => {
        if (props.dataRent.estacionesCargadas) {
            console.log('estaciones cargadas INFO', props.dataRent.estacionex.data)

        }
    }, [props.dataRent.estacionesCargadas])

    const getVehicleStyle = (estado) => {
        switch (estado) {
            case 'DISPONIBLE':
                return styles.cajaTextVehiuclosDisponible;
            case 'RESERVADA':
                return styles.cajaTextVehiuclosReservada;
            case 'PRESTADA':
                return styles.cajaTextVehiuclosPrestada;
            case 'INACTIVA':
                return styles.cajaTextVehiuclosInactiva;
            case 'EN TALLER':
                return styles.cajaTextVehiuclosTaller;
            default:
                return styles.cajaTextVehiuclosPrestada;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {(isModalCancelVisible) ? openBackgroundInfoModalCancel() : <></>}
            {modalError ? openModalError() : <></>}
            {modalTest ? openModalTest() : <></>}

            <ScrollView>
                {
                    //valor ini <= si la distacia con la estación es menor a 300 metros
                    (props.dataRent.distanciaMt <= distanciaMaxRenta)
                        ?
                        <>
                            {
                                (props.dataRent.reservas !== 0) ?
                                    <>
                                        {
                                            (props.dataRent.reservaVencida === false) ?
                                                <>
                                                    {
                                                        (props.dataRent.horarios.dia === state.dia) &&
                                                            (props.dataRent.horarios.hora === true) ?
                                                            <View style={styles.contentMsn}>
                                                                <View style={styles.cajaCabeza}>
                                                                    <Pressable
                                                                        onPress={() => { goBack() }}
                                                                        style={styles.btnAtras}>
                                                                        <View>
                                                                            <Image source={Images.menu_icon} style={[styles.iconMenu]} />
                                                                        </View>
                                                                    </Pressable>
                                                                    <Text style={styles.title}>Reserva Activa</Text>
                                                                </View>

                                                                <View style={styles.fichaReserva}>

                                                                    <Tarjeta
                                                                        icono={Images.vpini}
                                                                        titulo={'Estación'}
                                                                        texto1={remove(props.dataRent.reservas.data[0].res_estacion, 'Estacion')}
                                                                        texto2={''}
                                                                        elcolor={Colors.$adicional}
                                                                    />

                                                                    <Tarjeta
                                                                        icono={Images.vpbici}
                                                                        titulo={'Vehiculo'}
                                                                        texto1={vehiculoReserva !== '' ? vehiculoReserva : props.dataRent.vehiculoReserva}
                                                                        texto2={''}
                                                                        elcolor={Colors.$texto}
                                                                    />

                                                                    <Tarjeta
                                                                        icono={Images.vpFecha}
                                                                        titulo={'Fecha'}
                                                                        texto1={props.dataRent.reservas.data[0].res_fecha_inicio}
                                                                        texto2={''}
                                                                        elcolor={Colors.$primario}
                                                                    />

                                                                </View>

                                                                <View style={styles.cajaCuentaRegresiva}>
                                                                    <View style={styles.subcajaCuentaRegresiva}>
                                                                        <Text style={styles.numeroCuentaRegrasiva}>
                                                                            {(diaRestante < 10) ? '0' + diaRestante : diaRestante}
                                                                        </Text>
                                                                        <Text style={styles.subtextoCuentaR}>dias</Text>
                                                                    </View>
                                                                    <Text>:</Text>
                                                                    <View style={styles.subcajaCuentaRegresiva}>
                                                                        <Text style={styles.numeroCuentaRegrasiva}>
                                                                            {(horas < 10) ? '0' + horas : horas}
                                                                        </Text>
                                                                        <Text style={styles.subtextoCuentaR}>horas</Text>
                                                                    </View>
                                                                    <Text>:</Text>
                                                                    <View style={styles.subcajaCuentaRegresiva}>
                                                                        <Text style={styles.numeroCuentaRegrasiva}>
                                                                            {(minutos < 10) ? '0' + minutos : minutos}
                                                                        </Text>
                                                                        <Text style={styles.subtextoCuentaR}>minutos</Text>
                                                                    </View>
                                                                    <Text>:</Text>
                                                                    <View style={styles.subcajaCuentaRegresiva}>
                                                                        <Text style={styles.numeroCuentaRegrasiva}>
                                                                            {(segundos < 10) ? '0' + segundos : segundos}
                                                                        </Text>
                                                                        <Text style={styles.subtextoCuentaR}>segundos</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={{
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    width: Dimensions.get('window').width,
                                                                    height: 'auto',
                                                                }}>
                                                                    <LottieView source={require('../../Resources/Lotties/bicy_lock.json')} autoPlay loop
                                                                        style={{
                                                                            width: Dimensions.get('window').width,
                                                                            height: Dimensions.get('window').width * .4,
                                                                        }} />
                                                                </View>

                                                                <View style={styles.cajaBtnRentar}>
                                                                    {
                                                                        preoperacinalOK ?
                                                                            <>
                                                                                {
                                                                                    !touchRentar ?
                                                                                        <View style={styles.centrar_}>
                                                                                            {!touchRentar ? <Pressable
                                                                                                onPress={() => rentar()}
                                                                                                style={estilos.btnSaveColor}>
                                                                                                <View style={estilos.btnSaveOK}>
                                                                                                    <Text style={estilos.btnSaveColor}>Rentar</Text>
                                                                                                </View>
                                                                                            </Pressable> : null}
                                                                                        </View>
                                                                                        :
                                                                                        <View style={{
                                                                                            justifyContent: "center",
                                                                                            alignItems: "center",
                                                                                            width: 200,
                                                                                            height: 'auto',
                                                                                        }}>
                                                                                            <LottieView source={require('../../Resources/Lotties/bicy_loader.json')} autoPlay loop
                                                                                                style={{
                                                                                                    width: 200,
                                                                                                    height: 150,
                                                                                                }} />
                                                                                        </View>
                                                                                }
                                                                            </>
                                                                            :
                                                                            <Pressable
                                                                                onPress={() => {
                                                                                    setModalTest(true)
                                                                                }}
                                                                                style={[styles.btnCenter, { backgroundColor: Colors.$texto50 }]}>
                                                                                <Text style={styles.textBtns}>Validar renta</Text>
                                                                            </Pressable>
                                                                    }

                                                                    <Pressable
                                                                        onPress={() => {
                                                                            stateModalCancelRent(true),
                                                                                cancelarReserva()
                                                                        }}
                                                                        style={[styles.btnCenter, { backgroundColor: Colors.$primario }]}>
                                                                        <Text style={styles.textBtns}>Cancelar reserva</Text>
                                                                    </Pressable>

                                                                </View>

                                                            </View>
                                                            :
                                                            <View style={estilos.cajaMns}>

                                                                {(props.dataRent.horarios.dia === state.dia) ? <></> : <Text style={estilos.denegado}>Dia No habil </Text>}
                                                                {(props.dataRent.horarios.hora === true) ? <></> : <Text style={estilos.denegado}>Horario fuera de servicio </Text>}

                                                                <Pressable
                                                                    onPress={() => { home() }}
                                                                    style={estilos.btnCenter}>
                                                                    <View style={estilos.btnCancelar}>
                                                                        <Text style={[estilos.btnSaveColor2, { margin: 15 }]}>Home</Text>
                                                                    </View>
                                                                </Pressable>

                                                            </View>
                                                    }
                                                </>
                                                :
                                                <View style={estilos.contenedorReservaVencio}>
                                                    <Text>La reserva se venció</Text>
                                                    <Pressable
                                                        onPress={() => { home() }}
                                                        style={estilos.btnCenter}>
                                                        <View style={estilos.btnBlack}>
                                                            <Text style={[estilos.btnSaveColor2, { margin: moderateScale(15) }]}>Home</Text>
                                                        </View>
                                                    </Pressable>
                                                </View>
                                        }
                                    </>
                                    :
                                    <>
                                        {
                                            (props.dataRent.horarios.dia === state.dia) &&
                                                (props.dataRent.horarios.hora === true) ?
                                                <>
                                                    {
                                                        (props.dataRent.estacionesCargadas === true) ?
                                                            <View style={{
                                                                width: Dimensions.get('window').width,
                                                                minHeight: Dimensions.get('window').height,
                                                                position: 'relative'
                                                            }}>
                                                                <View style={styles.cajaCabeza}>
                                                                    <Pressable
                                                                        onPress={() => { goHome3G() }}
                                                                        style={styles.btnAtras}>
                                                                        <View>
                                                                            <Image source={Images.menu_icon} style={[styles.iconMenu]} />
                                                                        </View>
                                                                    </Pressable>
                                                                    <Text style={estilos.titleSelect}>Disponibilidad</Text>
                                                                </View>

                                                                <View style={estilos.stationStyle}>
                                                                    <RNPickerSelect
                                                                        style={pickerSelectStyles}
                                                                        placeholder={{ label: 'Elige tu estación', value: '' }}
                                                                        useNativeAndroidPickerStyle={false}
                                                                        value={state.estaciones}
                                                                        onValueChange={
                                                                            (value) => {
                                                                                viewBicycle(value)
                                                                            }
                                                                        }
                                                                        items={props.dataRent.estacionex.data.map((data) =>
                                                                            ({ label: data.est_estacion, value: data }))
                                                                        }

                                                                        Icon={() => {
                                                                            return (
                                                                                <Image source={Images.iconPickerYellow} style={{ tintColor: 'black', top: 25, right: 50, height: 25, width: 25, resizeMode: 'contain' }} />
                                                                            );
                                                                        }}
                                                                    />
                                                                    <GuiaEstados />
                                                                </View>
                                                                <View style={styles.cajaBtnReservar}>
                                                                    {
                                                                        preoperacinalOK ?
                                                                            <>
                                                                                {
                                                                                    touchRentar ?
                                                                                        <View style={styles.centrar_}>
                                                                                            <View style={{
                                                                                                justifyContent: "center",
                                                                                                alignItems: "center",
                                                                                                width: Dimensions.get('window').width,
                                                                                                height: 'auto',
                                                                                            }}>
                                                                                                <LottieView source={require('../../Resources/Lotties/bicy_loader.json')} autoPlay loop
                                                                                                    style={{
                                                                                                        width: Dimensions.get('window').width,
                                                                                                        height: 150,
                                                                                                    }} />
                                                                                            </View>
                                                                                        </View>
                                                                                        :
                                                                                        <View style={styles.centrar_}>
                                                                                            {!touchRentar ? <Pressable
                                                                                                onPress={() => rentar()}
                                                                                                style={estilos.btnSaveColor}>
                                                                                                <View style={estilos.btnSaveOK}>
                                                                                                    <Text style={estilos.btnSaveColor}>Rentar</Text>
                                                                                                </View>
                                                                                            </Pressable> : null}
                                                                                        </View>
                                                                                }
                                                                            </>
                                                                            :
                                                                            <>
                                                                                {
                                                                                    (state.ticket !== null) ?
                                                                                        <View style={estilos.btnSelect__}>
                                                                                            <Text style={estilos.titleSelect4}>Vehículo seleccionado {state.numVehiculo}</Text>
                                                                                            <Pressable
                                                                                                onPress={() => setModalTest(true)}
                                                                                                style={estilos.btnSaveColor}
                                                                                            >
                                                                                                <View style={estilos.btnSaveOK}>
                                                                                                    <Text style={estilos.btnSaveColor}>Validar rentar</Text>
                                                                                                </View>
                                                                                            </Pressable>
                                                                                        </View>
                                                                                        :
                                                                                        <></>
                                                                                }
                                                                            </>

                                                                    }
                                                                </View>
                                                                {
                                                                    (props.dataRent.bicicletasCargadas === true) ?
                                                                        <View style={estilos.boxPrincipalItems}>
                                                                            {
                                                                                state.ticket === null ?
                                                                                    <View style={{
                                                                                        justifyContent: "center",
                                                                                        alignItems: "center",
                                                                                        width: Dimensions.get('window').width,
                                                                                        height: 'auto',
                                                                                    }}>
                                                                                        {
                                                                                            Env.modo === 'tablet' ?
                                                                                                <Text style={{
                                                                                                    fontSize: 25,
                                                                                                    color: Colors.$texto,
                                                                                                    textAlign: 'center',
                                                                                                    fontFamily: Fonts.$poppinsregular
                                                                                                }}>Selecciona un vehículo</Text>
                                                                                                :
                                                                                                <LottieView source={require('../../Resources/Lotties/bicy_onOff.json')} autoPlay loop
                                                                                                    style={{
                                                                                                        width: Dimensions.get('window').width,
                                                                                                        height: Dimensions.get('window').width * .5,
                                                                                                    }} />
                                                                                        }
                                                                                    </View> :
                                                                                    <></>
                                                                            }

                                                                            {
                                                                                props.dataRent.bicicletas.data.map((data) =>
                                                                                    <Pressable
                                                                                        onPress={() => {
                                                                                            vehiculoseleccionado(data)
                                                                                        }}
                                                                                        key={data.bic_id}
                                                                                        style={
                                                                                            (state.numVehiculo !== data.bic_numero) ?
                                                                                                styles.btnVehiculos
                                                                                                :
                                                                                                styles.btnVehiculosSelect
                                                                                        }>

                                                                                        <View style={getVehicleStyle(data.bic_estado)}>
                                                                                            {
                                                                                                data.bic_nombre === 'electrica'
                                                                                                    ?
                                                                                                    <Image source={Images.bicycle_Icon} style={[estilos.iconBici, { tintColor: 'black' }]} />
                                                                                                    :
                                                                                                    <></>
                                                                                            }
                                                                                            {
                                                                                                data.bic_nombre === 'patineta'
                                                                                                    ?
                                                                                                    <Image source={Images.patin_Icon} style={[estilos.iconBici, { tintColor: 'black' }]} />
                                                                                                    :
                                                                                                    <></>
                                                                                            }
                                                                                            {
                                                                                                data.bic_nombre === 'mecanica'
                                                                                                    ?
                                                                                                    <Image source={Images.cycle_Icon} style={[estilos.iconBici, { tintColor: 'black' }]} />
                                                                                                    :
                                                                                                    <></>
                                                                                            }
                                                                                            <Text style={estilos.textVehiculo}>{data.bic_numero}</Text>
                                                                                        </View>
                                                                                    </Pressable>
                                                                                )
                                                                            }

                                                                        </View>
                                                                        :
                                                                        <View style={estilos.boxPrincipalItemsReserva}>
                                                                            <View style={{
                                                                                justifyContent: "center",
                                                                                alignItems: "center",
                                                                                width: 250,
                                                                                minHeight: 250,
                                                                            }}>
                                                                                {
                                                                                    Env.modo === 'tablet' ?
                                                                                        <Text style={{
                                                                                            fontSize: moderateScale(25),
                                                                                            color: Colors.$texto,
                                                                                            textAlign: 'center',
                                                                                            fontFamily: Fonts.$poppinsregular
                                                                                        }}>Selecciona una estación</Text>
                                                                                        :
                                                                                        <LottieView source={require('../../Resources/Lotties/bicy_04.json')} autoPlay loop
                                                                                            style={{
                                                                                                width: Dimensions.get('window').width,
                                                                                                height: Dimensions.get('window').width
                                                                                            }} />
                                                                                }
                                                                            </View>
                                                                        </View>
                                                                }
                                                            </View>
                                                            :
                                                            <></>
                                                    }


                                                </>
                                                :
                                                <>
                                                    <View style={estilos.cajaMns}>
                                                        {(props.dataRent.usuarioValido === true) ? <></> : <Text style={estilos.denegado}>Usuario NO habilitado </Text>}
                                                        {(props.dataRent.horarios.dia === state.dia) ? <></> : <Text style={estilos.denegado}>Dia No habil </Text>}
                                                        {(props.dataRent.horarios.hora === true) ? <></> : <Text style={estilos.denegado}>Horario fuera de servicio </Text>}
                                                        {(props.dataRent.penalizaciones === 0) ? <></> : <Text style={estilos.denegado}>Tiene penalizaciones </Text>}

                                                        <Pressable
                                                            onPress={() => { home() }}
                                                            style={estilos.btnCenter}
                                                        >
                                                            <View style={estilos.btnBlack}>
                                                                <Text style={[estilos.btnSaveColor2, { margin: 10 }]}>Home</Text>
                                                            </View>
                                                        </Pressable>

                                                    </View>
                                                </>
                                        }
                                    </>
                            }
                        </>
                        :
                        <>
                            <View style={estilos.contentCenter}>
                                <Text style={estilos.denegado3}>La distancia en metros con la estación es: </Text>
                                <Text style={estilos.denegado4}>{props.dataRent.distanciaMt}</Text>
                                <Text style={estilos.denegado2}>Estás fuera de los límites para hacer una renta.</Text>
                                <Pressable onPress={() => {
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

const stylesModal = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    subContenedor: {
        flex: 1,
        backgroundColor: "rgba(52, 52, 52, 0.9)",
        flexDirection: "column"
    },
    caja1: {
        flex: 1,
        borderRadius: 6,
        marginVertical: 0,
        marginHorizontal: 0,
        backgroundColor: Colors.$blanco,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 30
    },
    titulo: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 24,
        color: Colors.$texto80
    },
    cajaPregunta: {
        width: Dimensions.get('window').width * .9,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10
    },
    textoPregunta: {
        width: Dimensions.get('window').width * .4,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto80,
        paddingLeft: 10
    },
    cajaSiNo: {
        width: Dimensions.get('window').width * .5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    btnPregunta: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnSI: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$adicional,
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    btnNO: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$texto50,
    },
    textoOpcion: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$blanco,
    }
})

const styles = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * .1,
    },
    title: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 24,
        textAlign: 'center',
        color: Colors.$texto,
        marginBottom: 0,
    },
    btnCenter: {
        width: Dimensions.get('window').width * .45,
        padding: 10,
        borderRadius: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: Colors.$primario
    },
    textBtns: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$blanco
    },
    cajaBtnRentar: {
        width: "100%",
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: Colors.$blanco
    },
    titulo: {
        width: "100%",
        fontSize: 24,
        fontFamily: Fonts.$poppinsmedium,
        textAlign: "center",
        colors: Colors.$texto80
    },
    contentMsn: {
        width: Dimensions.get("window").width,
        minHeight: Dimensions.get("window").height,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.$blanco,
    },
    fichaReserva: {
        width: Dimensions.get("window").width,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.$blanco,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 20,
        paddingBottom: 20
    },
    btnAtras: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        zIndex: 1000
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
    cajaCuentaRegresiva: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    subcajaCuentaRegresiva: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Colors.$texto,
        margin: 2,
        borderRadius: 10,
        width: 70,
    },
    numeroCuentaRegrasiva: {
        fontSize: 20,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsmedium,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
    },
    subtextoCuentaR: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: Fonts.$poppinslight,
        color: Colors.$blanco,
    },
    cajaBtnReservar: {
        width: Dimensions.get('window').width,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnSelect__: {
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$blanco,
        padding: 5,
    },
    btnVehiculos: {
        width: 95,
        height: 95,
        backgroundColor: Colors.$blanco,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
    },
    btnVehiculosSelect: {
        width: 95,
        height: 95,
        backgroundColor: Colors.$adicional,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    centrar_: {
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height * .15,
        alignItems: 'center',
        justifyContent: 'center',
    }
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
        width: Dimensions.get('window').width * .9,
        paddingLeft: 20,
        fontFamily: Fonts.$poppinsregular,
        textAlign: 'center',
    },
    placeholder: {
        color: Colors.$texto,
    },
    registerTitleContainer: {
        color: '#f60',
    },
    accountTitle: {
        marginBottom: 1,
    },
});

const stylesForm = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 10,
    },
    titulo: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 24,
        color: Colors.$texto80,
        width: Dimensions.get('window').width * .6,
        textAlign: 'center',
        marginTop: 20
    },
    preguntaContainer: {
        marginBottom: 20,
        width: Dimensions.get('window').width * .9,
        backgroundColor: Colors.$parqueo_color_secundario_20,
        padding: 20,
        borderRadius: 20
    },
    pregunta: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        marginBottom: 20,
        color: Colors.$texto,
        textAlign: 'justify',

    },
    botones: {
        flexDirection: "row",
        gap: 10,
    },
    boton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: Colors.$parqueo_color_secundario_50,
        borderRadius: 8,
        alignItems: "center",
    },
    botonSeleccionado: {
        backgroundColor: Colors.$primario,
    },
    botonTexto: {
        fontSize: 16,
        color: "#333",
    },
    textoSeleccionado: {
        color: "#fff",
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        backgroundColor: "#f9f9f9",
        minHeight: 60,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#555",
        marginRight: 10,
        borderRadius: 4,
    },
    checkboxMarcado: {
        backgroundColor: "#007bff",
    },
    textoCheckbox: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        fontFamily: Fonts.$poppinsregular,
        textAlign: 'justify'
    },
    botonAceptar: {
        width: Dimensions.get('window').width * .8,
        backgroundColor: Colors.$primario,
        paddingVertical: 10,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 40,
        marginTop: 30
    },
    botonAceptarTexto: {
        color: "#fff",
        fontSize: 18,
        fontFamily: Fonts.$poppinsmedium
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
        //savePrestamo: (data, vehiculo, reservaId, estacion) => dispatch(savePrestamo(data, vehiculo, reservaId, estacion)),
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
)(Rentar3GScreen);


