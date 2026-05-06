import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    Modal,
    Dimensions,
    Button,
    Pressable
} from 'react-native';
//Layout
import Images from '../../Themes/Images';
//Components
import React, { useState, useEffect, useContext, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    validateHorarios,
    rentActive,
    validateUser3g,
    cambiarEstadoPrestamo,
    cambiarEstadoPrestamo_2,
    saveHistorialClaves,
    saveComentario,
    savePuntos,
    changeClave,
    reset_renta,
    saliendo_modulo,
    cancelar__,
    indicadores_trip,
    finalizarViaje3g
} from '../../actions/actions3g';
import { changeProgreso, getLogrosProgreso, changeProgresoEstado, saveProgresoLogro, changeProgresoEstadoDesafio, changeProgresoDesafio } from '../../actions/actionPerfil';
import { saveDocumentUser } from '../../actions/actions';
import { fetch } from '../../Services/refresh.service';
import Fonts from '../../Themes/Fonts';
import estilos from './styles/finalizar.style';
import { ButtonComponent } from '../../Components/ButtonComponent';
import Colors from '../../Themes/Colors';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { Estrellas } from './Estrellas';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Env } from "../../Utils/enviroments";
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useSelector } from "react-redux";
const { LocationServiceModule } = NativeModules; //Solo android
const { SharedPreferencesModule } = NativeModules; //Solo android

const { ForegroundServiceModule } = NativeModules; //Solo ios
const varCorreo = '@urosario.edu.co';

function FinalizarViaje(props) {
    const distanciaProgreso = useSelector((state) => state.distance?.distanceNative);
    const getDistance = async () => {
        try {
            const value = await AsyncStorage.getItem('distanciaRecorrida');
            return value != null ? JSON.parse(value) : 0; // Convierte la cadena a un número
        } catch (error) {
            console.error('Error al obtener la distancia:', error);
            return 0; // Retorna un valor predeterminado en caso de error
        }
    };

    const fetchDistance = async () => {
        const distance = await getDistance();
        console.log('Distancia recuperada en finalizar viaje:', distance); // Debería ser un número
    };

    // Este hook se ejecutará cada vez que `distanciaProgreso` cambie
    useEffect(() => {
        console.log("Distancia actualizada:");
        fetchDistance();
    }, []);
    const dispatch = useDispatch();

    const [state, setState] = useState({
        fecha: new Date(),
        dia: new Date().toUTCString().substr(0, 3),
        resDia: null,
        horas: new Date().getHours(),
        horaValida: false,
        minutos: new Date().getMinutes(),
        clave: null,
        claveNueva: null,
        estacionarVehiculo: false,
        candadoCerrado: false,
        tomarFoto: false,
        urifoto: null,
        comentario: '',
        isOpenBackgroundInfoModal: false,
    })

    const { infoUser, logout } = useContext(AuthContext)
    const [calificacion, setCalificacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [devolviendo, setDevolviendo] = useState(false)
    const isSubmitting = useRef(false);

    useEffect(() => {
        //dispatch(getLogrosProgreso(infoUser.idNumber));
        if (props.perfil.dataLogros && props.perfil.dataProgresoLogros) {
            // Si los datos están disponibles, puedes realizar la actualización
            console.log("Los datos han sido cargados correctamente");
            console.log(props.perfil.dataProgresoLogros)
        }
    }, []);

    // Dentro de tu función donde se guarda
    const onSaveButtonClick = () => {
        if (!props.perfil.dataLogros || !props.perfil.dataProgresoLogros) {
            console.log("Aún no hay datos disponibles para actualizar.");
            return; // Puedes agregar un mensaje de espera si los datos no están listos
        }
        actualizarProgreso(); // Llamas a la función de actualización
    };

    const home = async () => {
        await dispatch(saliendo_modulo());
        if (Env.modo === 'tablet') {
            console.log('ESTAMOS EN TABLET VAMOS A CERRAR SESION');
            await dispatch(cancelar__());
            logout();
            return
        }
        RootNavigation.navigate('Home')
    }

    const clearTrackingData = async () => {
        try {
            await AsyncStorage.multiRemove([
                'rutaCoordinates',
                'vehiculoVP',
                'isTrackingActive',
                'posicionInicial',
                'distanciaRecorrida',
                'elapsedTime',
                'startTime',
                'indicadores'
            ])
            await SharedPreferencesModule.clearCoordinates();
            await ForegroundServiceModule.clearStoredData();
            //Alert.alert("Coordenadas nativas eliminadas exitosamente");
            console.log('Datos de rastreo eliminados');
        } catch (err) {
            console.log('Error al limpiar los datos de rastreo:', err);
        }
    };

    useEffect(() => {
        if (props.dataRent.DevolucionExitosa) {
            setDevolviendo(false);
            setModalEnd(true);
        }
    }, [props.dataRent.DevolucionExitosa]);

    const openModalEnd = () => {
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
                        <View style={{ flex: 3, borderRadius: 20, marginVertical: 150, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 20, }}>

                            <Text style={{
                                textAlign: "center",
                                color: Colors.$texto80,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >Un viaje exitoso más</Text>

                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: 200,
                                minHeight: 200,
                            }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_feliz_viaje.json')} autoPlay loop
                                    style={{
                                        width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').width * .7
                                    }} />
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
                                    }} />
                            </View>

                            <Pressable
                                onPress={() => {
                                    setModalEnd(false);
                                    // 1. Navegar primero a Home
                                    RootNavigation.navigate('Home');
                                    // 2. Limpiar estado con retraso para asegurar que la navegación sea visible
                                    setTimeout(() => {
                                        dispatch(reset_renta());
                                        dispatch(cancelar__());
                                        // dispatch(resetApp()); // Removido para evitar borrado de sesión
                                        dispatch(saliendo_modulo());
                                    }, 2000);
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

    const devolverVehiculo = async () => {

        if (estacionIntercambiable && newStation === '') {
            Alert.alert('Debes Seleccionar una estación de devolución');
            return;
        }

        if (isSubmitting.current) return;
        isSubmitting.current = true;
        setDevolviendo(true);

        const fechaFin = new Date();
        const storedIndicadores = await AsyncStorage.getItem('indicadores');

        // Determinar estado del vehículo y modulo
        let estadoV = '';
        let modulo__ = '';
        const clave = props.dataRent.clave;
        const digitos = clave.toString().length;

        if (digitos === 4) {
            if (props.dataRent.descripcionVehiculo !== 'microsistema') {
                estadoV = 'CAMBIAR CLAVE';
                modulo__ = '3G';
            } else {
                estadoV = 'DISPONIBLE';
                modulo__ = '3G';
            }
        } else {
            estadoV = 'DISPONIBLE';
            modulo__ = '4G';
        }

        // Preparar indicadores si existen
        if (storedIndicadores) {
            await dispatch(indicadores_trip(modulo__, props.dataRent.prestamo.data[0].pre_id, storedIndicadores));
        }

        const prestamoData = props.dataRent.prestamo.data[0];

        // Preparar data para el proceso atómico
        const finalizationData = {
            pre_id: prestamoData.pre_id,
            pre_devolucion_fecha: fechaFin.toJSON(),
            vehiculo: prestamoData.pre_bicicleta,
            estadoV: estadoV,
            historialClaves: null,
            comentario: {
                "com_id": "0",
                "com_usuario": prestamoData.pre_usuario,
                "com_prestamo": prestamoData.pre_id,
                "com_fecha": state.fecha.toJSON(),
                "com_comentario": comentario === '' ? 'sin_comentario' : comentario,
                "com_estado": "ACTIVA",
                "com_calificacion": calificacion
            },
            puntos: {
                "pun_id": uuidv4(),
                "pun_usuario": prestamoData.pre_usuario,
                "pun_modulo": modulo__,
                "pun_fecha": state.fecha.toJSON(),
                "pun_puntos": "10",
                "pun_motivo": "Devolucion exitosa"
            },
            claveData: null,
            nuevaEstacion: estacionIntercambiable ? newStation : prestamoData.pre_retiro_estacion
        };

        // Historial de claves (solo 3G)
        if (digitos === 4 && props.dataRent.descripcionVehiculo !== 'microsistema') {
            finalizationData.historialClaves = {
                "his_id": "0",
                "his_usuario": prestamoData.pre_usuario,
                "his_estacion": estacionIntercambiable ? newStation : prestamoData.pre_retiro_estacion,
                "his_bicicleta": prestamoData.pre_bicicleta,
                "his_fecha": state.fecha.toJSON(),
                "his_clave_old": props.dataRent.clave,
                "his_clave_new": state.claveNueva,
                "his_estado": "CAMBIAR CLAVE"
            };

            finalizationData.claveData = {
                "bic_id": prestamoData.pre_bicicleta,
                "bic_clave": state.claveNueva
            };
        }

        // Ejecutar proceso atómico
        await dispatch(finalizarViaje3g(finalizationData));

        await clearTrackingData();
    }

    const generarClave = () => {
        let valor = new Date().getTime();
        let valor2 = valor.toString().substr(-4);
        setState({ ...state, claveNueva: valor2 });
    }

    /*const prestamoActivo = async (cc) => {
        await dispatch(rentActive(cc))
    }*/

    const userActivo = async (cc) => {
        await dispach(validateUser3g(cc));
    }

    useEffect(() => {
        generarClave();
    }, [])

    const calificacionSelect = (valor) => {
        setCalificacion(valor);

        // Verificar si dataLogros y dataProgresoLogros están disponibles
        if (!props.perfil?.dataLogros || !props.perfil?.dataProgresoLogros) {
            console.warn("Datos de logros o progreso no disponibles.");
            return;
        }

        // Validar y recorrer los logros

    };
    const obtenerProgreso = (usuarioId, logroId) => {
        if (props.perfil && Array.isArray(props.perfil.dataProgresoLogros)) {
            // Recorrer los logros
            props.perfil.dataLogros.forEach((logro) => {
                // Verificar si el logro tiene "criterios" y su "tipo" es "general"
                if (logro.criterios.tipo === "general") {
                    console.log("valor del logro id y criterios");
                    console.log(logro.id_logro);
                    console.log(logro.criterios.tipo);

                    // Verificar si ya existe un progreso para ese logro
                    const progresoExistente = props.perfil.dataProgresoLogros.find(
                        (progreso) => progreso.usuario_id === infoUser.DataUser.idNumber && progreso.logro_id === logro.id_logro
                    );

                    if (progresoExistente) {
                        // Si existe, actualiza el progreso
                        progresoLogro(infoUser.DataUser.idNumber, logro.id_logro, progresoExistente.progreso);
                    } else {
                        // Si no existe, puedes decidir qué hacer (crear uno nuevo, etc.)
                        console.log("No existe progreso para este logro, creando uno nuevo");
                    }
                }
            });
        } else {
            console.error("Los datos de progreso no están definidos o no son un arreglo");
        }
    };

    const guardarProgresoLogros = async (id_logro, progreso) => {
        try {
            console.log("Iniciando la asignación de logros al usuario...");

            const dataProgresoLogros = {
                id: uuidv4(), // Genera un ID único si es necesario
                usuario_id: infoUser.DataUser.idNumber,
                logro_id: id_logro,
                progreso: progreso,
                estado: "INCOMPLETO",
                ultima_actualizacion: new Date().toISOString(),
            };

            console.log("Guardando progreso para el logro:", dataProgresoLogros);

            // Llama a la acción de Redux para guardar cada progreso
            await dispatch(saveProgresoLogro(dataProgresoLogros));


            console.log("Todos los logros activos han sido asignados al usuario.");
        } catch (error) {
            console.error("Error al asignar logros al usuario:", error);
        }
    };
    const actualizarProgreso = () => {
        actualizarProgresoDesafio();
        if ((props.perfil.dataLogros)) { // Verificar que 'dataLogros' sea un arreglo válido
            // Recorrer los logros
            props.perfil.dataLogros.forEach((logro) => {
                if (logro.criterios.tipo === "general") {
                    console.log("valor del logro id y criterios");
                    console.log(logro.id_logro);
                    console.log(logro.criterios.tipo);
                    //console.log("dataProgresoLogros")
                    //console.log(props.perfil.dataProgresoLogros);
                    // Verificar que 'dataProgresoLogros' sea un arreglo antes de hacer el 'find'
                    if ((props.perfil.dataProgresoLogros)) {
                        // Buscar progreso existente
                        const progresoExistente = props.perfil.dataProgresoLogros.find(
                            (progreso) =>
                                progreso.usuario_id === infoUser.DataUser.idNumber &&
                                progreso.logro_id === logro.id_logro
                        );

                        if (progresoExistente && progresoExistente.progreso < logro.criterios.meta) {
                            console.log("Progreso existente:", progresoExistente);

                            // Validar que `progresoExistente.progreso` no sea `undefined`
                            const progresoActual = progresoExistente.progreso || 0;

                            progresoLogro(
                                progresoExistente.id,
                                infoUser.DataUser.idNumber,
                                logro.id_logro,
                                progresoActual
                            );

                            if (progresoActual || progresoExistente.progreso <= logro.criterios.meta) {
                                console.log("entro al condicional para actualizar el estado")
                                actualizarEstadoProgresoLogro(
                                    progresoExistente.id,
                                    infoUser.DataUser.idNumber,
                                    logro.id_logro
                                );
                            }
                        } else {
                            console.log("ya completo el logro");
                            actualizarEstadoProgresoLogro(
                                progresoExistente.id,
                                infoUser.DataUser.idNumber,
                                logro.id_logro
                            );

                            //guardarProgresoLogros(logro.id_logro, 0); // Crear progreso inicial
                        }
                    }
                } else if (logro.criterios.tipo === "distancia") {
                    console.log("valor del logro id y criterios");
                    console.log(logro.id_logro);
                    console.log(logro.criterios.tipo);

                    // Verificar que 'dataProgresoLogros' sea un arreglo antes de hacer el 'find'
                    if (Array.isArray(props.perfil.dataProgresoLogros)) {
                        // Buscar progreso existente
                        const progresoExistente = props.perfil.dataProgresoLogros.find(
                            (progreso) =>
                                progreso.usuario_id === infoUser.DataUser.idNumber &&
                                progreso.logro_id === logro.id_logro
                        );

                        if (progresoExistente && progresoExistente.progreso < logro.criterios.meta) {
                            console.log("Progreso existente:", progresoExistente);
                            // Validar que `progresoExistente.progreso` no sea `undefined`
                            const progresoActual = progresoExistente.progreso || 0;

                            progresoLogroDistancia(
                                progresoExistente.id,
                                infoUser.DataUser.idNumber,
                                logro.id_logro,
                                progresoActual
                            );

                            if (progresoExistente.progreso >= logro.criterios.meta) {
                                console.log("ya se completo el logro");
                                actualizarEstadoProgresoLogro(
                                    progresoExistente.id,
                                    infoUser.DataUser.idNumber,
                                    logro.id_logro
                                );
                            }
                        } else {
                            console.log("No hay progreso existente, creando uno nuevo...2");
                            guardarProgresoLogros(logro.id_logro, 0);
                        }
                    } else {
                        console.error("dataProgresoLogros no es un arreglo válido");
                        guardarProgresoLogros(logro.id_logro, 0);
                    }
                }
            });
        }
    };

    const progresoLogroDistancia = async (id, idUsuario, idLogro, progreso) => {

        console.log("entrando a la funcion progreso logro distancia")
        const distance = await getDistance();

        const progresoNumerico = Number(progreso);
        const distanciaNumerica = Number(distance);
        Alert.alert("distancia recorride: " + distanciaNumerica);
        const progresoActualizado = progresoNumerico + distanciaNumerica;

        console.log("valor de la distancia en el progreso")
        const dataProgresoLogros = {
            id: id,
            usuario_id: idUsuario,
            logro_id: idLogro,
            progreso: progresoActualizado,
        };
        console.log("Validando JSON antes del dispatch");
        try {
            JSON.stringify(dataProgresoLogros);
        } catch (error) {
            console.error("Error al serializar JSON:", error);
        }
        console.log("datos a actualizar")
        console.log(dataProgresoLogros);
        dispatch(changeProgreso(dataProgresoLogros));
        // Incrementa antes de asignar

    }
    const progresoDesafioDistancia = async (id, idUsuario, idDesafio, progreso) => {

        console.log("entrando a la funcion progreso desafio distancia")
        const distance = await getDistance();

        const progresoNumerico = Number(progreso);
        const distanciaNumerica = Number(distance);
        const progresoActualizado = progresoNumerico + distanciaNumerica;
        console.log("valor de la distancia en el progreso")
        console.log(progresoActualizado)
        const dataProgresoDesafios = {
            id: id,
            usuario_id: idUsuario,
            desafio_id: idDesafio,
            progreso: progresoActualizado,
        };
        console.log("Validando JSON antes del dispatch");
        try {
            JSON.stringify(dataProgresoDesafios);
        } catch (error) {
            console.error("Error al serializar JSON:", error);
        }
        console.log("datos a actualizar en desafios")
        console.log(dataProgresoDesafios);
        dispatch(changeProgresoDesafio(dataProgresoDesafios));
        // Incrementa antes de asignar

    }
    const actualizarEstadoDesafio = (idDesafio) => {
        console.log("entrando a la funcion actualizar estado progreso logro")

        const dataDesafio = {
            id_desafio: idDesafio,
            estado: "COMPLETO",
        };
        console.log("Validando JSON antes del dispatch");
        try {
            JSON.stringify(dataDesafio);
        } catch (error) {
            console.error("Error al serializar JSON:", error);
        }
        console.log("datos a actualizar")
        console.log(dataDesafio);
        dispatch(changeEstadoDesafio(dataDesafio));

    }
    const actualizarProgresoDesafio = () => {
        console.log("en la funcion de actualizar progreso desafio");
        if (props.perfil && Array.isArray(props.perfil.dataDesafios)) { // Verificar que 'dataLogros' sea un arreglo válido
            // Recorrer los logros
            props.perfil.dataDesafios.forEach((desafio) => {
                if (desafio.criterios.tipo === "general") {
                    console.log("valor del desafio id y criterios");
                    console.log(desafio.id_desafio);
                    console.log(desafio.criterios.tipo);

                    // Verificar que 'dataProgresoLogros' sea un arreglo antes de hacer el 'find'
                    if (Array.isArray(props.perfil.dataProgresoDesafios)) {
                        // Buscar progreso existente
                        const progresoExistente = props.perfil.dataProgresoDesafios.find(
                            (progreso) =>
                                progreso.usuario_id === infoUser.DataUser.idNumber &&
                                progreso.desafio_id === desafio.id_desafio
                        );

                        if (progresoExistente) {
                            console.log("Progreso existente:", progresoExistente);

                            // Validar que `progresoExistente.progreso` no sea `undefined`
                            const progresoActual = progresoExistente.progreso || 0;
                            if (progresoActual === desafio.criterios.meta) {
                                actualizarEstadoProgresoDesafio(
                                    progresoExistente.id,
                                    infoUser.DataUser.idNumber,
                                    desafio.id_desafio
                                );
                                console.log("actualizando el estado del progreso del desafio");
                                actualizarEstadoDesafio(desafio.id_desafio)
                            }
                        } else {
                            console.log("No hay progreso desafio existente, creando uno nuevo... 1");
                            guardarProgresoDesafios(desafio.id_logro, 0); // Crear progreso inicial
                        }
                    } else {
                        console.error("dataProgresoLogros no es un arreglo válido");
                        guardarProgresoDesafios(desafio.id_desafio, 0);
                    }
                } else if (desafio.criterios.tipo === "distancia") {
                    console.log("en la funcion de actualizar progreso desafio condicional distancia");
                    console.log(desafio.id_desafio);
                    console.log(desafio.criterios.tipo);
                    //console.log(props.perfil.dataProgresoDesafios);
                    //console.log(props.perfil.dataDesafios)
                    // Verificar que 'dataProgresoLogros' sea un arreglo antes de hacer el 'find'
                    if (Array.isArray(props.perfil.dataProgresoDesafios)) {
                        // Buscar progreso existente
                        const progresoExistente = props.perfil.dataProgresoDesafios.find(
                            (progreso) =>
                                progreso.usuario_id === infoUser.DataUser.idNumber &&
                                progreso.desafio_id === desafio.id_desafio
                        );

                        if (progresoExistente) {
                            console.log("Progreso existente:", progresoExistente);

                            // Validar que `progresoExistente.progreso` no sea `undefined`
                            const progresoActual = progresoExistente.progreso || 0;

                            console.log("progreso ya existe actualizando progreso del desafio")
                            progresoDesafioDistancia(
                                progresoExistente.id,
                                infoUser.DataUser.idNumber,
                                desafio.id_desafio,
                                progresoActual
                            );

                            if (progresoActual === desafio.criterios.meta) {
                                console.log("entro al condicional progresActual = a metas")
                                actualizarEstadoProgresoDesafio(
                                    progresoExistente.id,
                                    infoUser.DataUser.idNumber,
                                    desafio.id_logro
                                );
                                actualizarEstadoDesafio(desafio.id_desafio)
                            }
                        } else {
                            console.log("No hay progreso existente, creando uno nuevo...2");
                            guardarProgresoDesafios(desafio.id_desafio, 0);
                        }
                    } else {
                        console.error("dataProgresoDesafios no es un arreglo válido");
                        guardarProgresoDesafios(desafio.id_desafio, 0);
                    }
                } else {
                    console.log("no hay ningu=in tipo de desafio valido")
                }
            });
        } else {
            console.error("Los datos de perfil o dataDesafios no están definidos o no son un arreglo válido");
        }
    };
    const actualizarEstadoProgresoDesafio = (id, idUsuario, idDesafio) => {
        console.log("entrando a la funcion actualizar estado progreso logro")

        const dataProgresoDesafios = {
            id: id,
            usuario_id: idUsuario,
            desafio_id: idDesafio,
            estado: "COMPLETO",
        };
        console.log("Validando JSON antes del dispatch");
        try {
            JSON.stringify(dataProgresoLogros);
        } catch (error) {
            console.error("Error al serializar JSON:", error);
        }
        console.log("datos a actualizar")
        console.log(dataProgresoDesafios);
        dispatch(changeProgresoEstadoDesafio(dataProgresoDesafios));

    }

    const guardarProgresoDesafios = async () => {
        try {
            console.log("Iniciando la asignación de desafios al usuario...");

            // Obtén los logros activos (puedes filtrar por estado si es necesario)
            const desafiosActivos = props.perfil.dataDesafios.filter(desafio => desafio.estado === "ACTIVO");

            if (desafiosActivos.length === 0) {
                console.log("No hay logros activos para asignar.");
                return;
            }

            // Itera sobre los logros activos y crea una entrada de progreso para cada uno
            for (const desafio of desafiosActivos) {
                const dataProgresoDesafios = {
                    id: uuidv4(), // Genera un ID único si es necesario
                    usuario_id: infoUser.DataUser.idNumber,
                    desafio_id: desafio.id_desafio,
                    progreso: 0,
                    estado: "INCOMPLETO",
                    fecha: new Date().toISOString(),
                };

                console.log("Guardando progreso para el desafio:", dataProgresoDesafios);
                // Llama a la acción de Redux para guardar cada progreso
                await dispatch(saveProgresoDesafio(dataProgresoDesafios));
            }

            console.log("Todos los desafios activos han sido asignados al usuario.");
        } catch (error) {
            console.error("Error al asignar logros al usuario:", error);
        }
    };




    const progresoLogro = (id, idUsuario, idLogro, progreso) => {
        console.log("entrando a la funcion progreso logro")
        const progresoActualizado = ++progreso; // Incrementa antes de asignar
        const dataProgresoLogros = {
            id: id,
            usuario_id: idUsuario,
            logro_id: idLogro,
            progreso: progresoActualizado,
        };
        console.log("Validando JSON antes del dispatch");
        try {
            JSON.stringify(dataProgresoLogros);
        } catch (error) {
            console.error("Error al serializar JSON:", error);
        }
        console.log("datos a actualizar")
        console.log(dataProgresoLogros);
        dispatch(changeProgreso(dataProgresoLogros));

    }
    const actualizarEstadoProgresoLogro = (id, idUsuario, idLogro) => {
        console.log("entrando a la funcion actualizar estado progreso logro")

        const dataProgresoLogros = {
            id: id,
            usuario_id: idUsuario,
            logro_id: idLogro,
            estado: "COMPLETO",
        };
        console.log("Validando JSON antes del dispatch");
        try {
            JSON.stringify(dataProgresoLogros);
        } catch (error) {
            console.error("Error al serializar JSON:", error);
        }
        console.log("datos a actualizar")
        console.log(dataProgresoLogros);
        dispatch(changeProgresoEstado(dataProgresoLogros));

    }

    const [isChecked, setIsChecked] = useState('');

    const toggleCheckBox = (value) => {
        setIsChecked(value);
    };

    const [newStation, setNewStation] = useState('');
    const [estacionIntercambiable, setEstacionIntercambiable] = useState(false);

    useEffect(() => {
        if (infoUser.DataUser.organizationId === '6165f3ae39fa4929e0fd4b7d' || infoUser.DataUser.organizationId === '651d72b809e814033e3e3546') {
            setEstacionIntercambiable(true)
        }
    }, [infoUser])

    const viewBicycle = async (value) => {
        console.log('en viewBicycle', value)
        console.log('en viewBicycle la estacion', value.est_estacion)
        setNewStation(value.est_estacion);
    }

    const [modalEnd, setModalEnd] = useState(false);
    return (
        <ScrollView>
            {modalEnd ? openModalEnd() : <></>}
            <View style={stylesModal.contenedor}>
                <Text style={stylesModal.titulo}>¡Felicitaciones!</Text>
                <Text style={stylesModal.texto}>¡Sumaste 10 puntos más! Sigue viajando y puedes canjearlos por increíbles recompensas.</Text>
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
                        placeholder=''
                        placeholderTextColor={'black'}
                        style={stylesModal.input}
                        onChangeText={text => setComentario(text)}
                        underlineColorAndroid="transparent"
                    />
                </View>

                {
                    estacionIntercambiable ?
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
                        :
                        <></>
                }

                <View style={stylesModal.row_}>
                    <View style={stylesModal.cajaCheck}>
                        {isChecked ?
                            <Pressable
                                onPress={() => {
                                    toggleCheckBox(false)
                                }}
                                style={stylesModal.btnCheckOK}
                            /> :
                            <Pressable
                                onPress={() => {
                                    toggleCheckBox(true)
                                }}
                                style={stylesModal.btnCheck}
                            />
                        }
                    </View>
                    <Text style={stylesModal.textoCheck}>He asegurado el vehículo correctamente</Text>
                </View>

                {
                    !devolviendo ?
                        <>
                            {
                                isChecked && calificacion !== 0 ?
                                    <Pressable
                                        onPress={() => { devolverVehiculo() }}
                                        style={{
                                            textAlign: "center",
                                            padding: 5,
                                            margin: 20,
                                            backgroundColor: Colors.$primario,
                                            borderRadius: 50
                                        }}>
                                        <Text style={stylesModal.btnInit}>Guardar</Text>
                                    </Pressable>
                                    :
                                    <Pressable onPress={() => console.log('check de vehículo asegurado')}
                                        style={{
                                            textAlign: "center",
                                            padding: 5,
                                            margin: 20,
                                            backgroundColor: Colors.$secundario,
                                            borderRadius: 50
                                        }}>
                                        <Text style={[stylesModal.btnInit, { color: Colors.$texto }]}>Guardar</Text>
                                    </Pressable>
                            }
                        </>

                        :
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: 100,
                            height: 'auto',
                        }}>
                            <LottieView source={require('../../Resources/Lotties/bicy_loader.json')} autoPlay loop
                                style={{
                                    width: 100,
                                    height: 100
                                }} />
                        </View>
                }

            </View>
        </ScrollView>
    );
}

const stylesModal = StyleSheet.create({
    row_: {
        width: Dimensions.get('window').width,
        height: 'auto',
        backgroundColor: Colors.$blanco,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        paddingLeft: 20,
        marginTop: 30
    },
    textoCheck: {
        width: '70%',
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto
    },
    contenedor: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: Colors.$blanco,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: 20,
        position: 'relative'
    },
    imagen: {
        width: Dimensions.get('window').width * .8,
        height: 'auto',
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
    cajaCheck: {
        width: "10%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnCheck: {
        width: 20,
        height: 20,
        borderWidth: 3,
        borderColor: Colors.$texto,
        borderRadius: 10,
        marginRight: 5
    },
    btnCheckOK: {
        width: 20,
        height: 20,
        borderWidth: 3,
        borderColor: Colors.$texto,
        borderRadius: 10,
        backgroundColor: Colors.$adicional,
        marginRight: 5
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: moderateScale(13),
        paddingVertical: 8,
        borderBottomWidth: 1,
        backgroundColor: "transparent",
        paddingLeft: moderateScale(15),
        marginLeft: moderateScale(20),
        marginRight: moderateScale(20),
        borderColor: Colors.$secundario,
        borderWidth: 2,
        borderRadius: 25,
        marginTop: 15,
        color: Colors.$texto,
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

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        documentUser: state.userReducer.documentUser,
        currentTrip: state.othersReducer.currentTrip,
        perfil: state.reducerPerfil,
    }
}

export default connect(mapStateToProps)(FinalizarViaje);


