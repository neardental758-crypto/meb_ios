import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    TextInput,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    Modal,
    Button,
    Dimensions,
    PermissionsAndroid
} from 'react-native';
import {
    savePrestamo,
    cancelar__
} from '../../actions/actions3g';
import { saveFormPreoperacional } from '../../actions/actionPerfil';
import { connect, useDispatch } from 'react-redux';
import { AuthContext } from '../../AuthContext';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import LottieView from 'lottie-react-native';
import { Env } from "../../Utils/enviroments";
//const DEVICE_ID = '00:22:05:00:27:64'; // Dirección MAC de tu HC-05
//const password = '1234'; // Reemplaza "1234" con tu contraseña actual

const BluetoothClassic = (props) => {
    const dispatch = useDispatch();
    const { infoUser, logout } = useContext(AuthContext)
    const { mac, macCargado, claveHC05, claveHC05Cargada, estaciones, numVehiculo, dataVehiculo } = props;
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [connectionMessage, setConnectionMessage] = useState('');
    const [devices, setDevices] = useState([]);
    const [conectado, setConectado] = useState(false); // valor inicial false
    const [bluetoothOn, setBluetoothOn] = useState(false); //valor inicial false
    const [touchRentar, setTouchRentar] = useState(false); //valor inicial false
    const [prestamoHecho, setPrestamoHecho] = useState(false); //valor inicial false
    const [stateConect, setStateConect] = useState('conectando');
    const [modalTest, setModalTest] = useState(false);
    const [casco, setCasco] = useState(false);
    const [sobrio, setSobrio] = useState(false);
    const [funcional, setFuncional] = useState('');
    const [btnSeRento, setBtnSeRento] = useState(false);

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
                <View style={stylesModal.contenedor}>
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
                </View>
            </>
        )
    }

    async function conectar() {
        try {
            const device = await RNBluetoothClassic.connectToDevice(mac);
            console.log('Conexión exitosa!', mac);
            setConnectedDevice(device);
            setConnectionMessage(`Conectado a ${device.name} (${device.address})`);
            setConectado(true);

            // Desconectar después de 20 segundos
            setTimeout(async () => {
                try {
                    await device.disconnect();
                    console.log('Dispositivo desconectado');
                    setConnectionMessage('Desconectado');
                    //setConectado(false);
                } catch (error) {
                    console.error('Error al desconectar: ', error);
                    setConnectionMessage('Error al desconectar');
                }
            }, 300000); // 60 segundos

        } catch (error) {
            console.error('Error al conectar: ', error);
            setConnectionMessage('Error al conectar ' + mac);
            setStateConect('error');
        }
    }

    async function sendMessage(message) {
        try {
            await RNBluetoothClassic.writeToDevice(connectedDevice.id, message);
            console.log(`Mensaje ${message} enviado correctamente`);
        } catch (error) {
            console.log('Error al enviar el mensaje:', error);
        }
    }

    const guardarPrestamo = async () => {
        let vehiculoPrestamo = '';
        let estacionPrestamo = '';
        let bicicletero = '';
        let reservaId = 'sinreserva';
        let hoy = new Date();
        let dia = new Date().toUTCString().substr(0, 3);
        let fechaVence = '';

        const fechaRetiro = new Date(hoy);
        fechaRetiro.setHours(fechaRetiro.getHours() - 5);

        if (props.dataRent.reservas === 0) {
            vehiculoPrestamo = dataVehiculo.bic_id;
            estacionPrestamo = dataVehiculo.bic_estacion;
            bicicletero = dataVehiculo.bc_bicicletero.bro_id;
            reservaId = 'sinreserva';

        } else {
            vehiculoPrestamo = props.dataRent.reservas.data[0].res_bicicleta;
            estacionPrestamo = props.dataRent.reservas.data[0].res_estacion;
            bicicletero = props.dataRent.dataVehiculoReserva.bc_bicicletero.bro_id;
            reservaId = props.dataRent.reservas.data[0].res_id;
        }

        fechaVence = new Date(fechaRetiro.setDate(fechaRetiro.getDate() + Number((props.dataRent.tiempoRestante / 24) + (dia === 'Sat' ? 1 : 0))))

        const ahora = new Date();
        ahora.setHours(ahora.getHours() - 5);

        const data = {
            "pre_id": "0",
            "pre_hora_server": new Date().toJSON(),
            "pre_usuario": infoUser.DataUser.idNumber,
            "pre_bicicleta": vehiculoPrestamo,
            "pre_retiro_estacion": estacionPrestamo,
            "pre_retiro_bicicletero": bicicletero,
            "pre_retiro_fecha": ahora.toJSON(),
            "pre_retiro_hora": new Date().getHours(),
            "pre_devolucion_estacion": estacionPrestamo,
            "pre_devolucion_bicicletero": bicicletero,
            "pre_devolucion_fecha": fechaVence.toJSON(),
            "pre_devolucion_hora": new Date().getHours(),
            "pre_duracion": "null",
            "pre_dispositivo": Platform.OS,
            "pre_estado": "ACTIVA",
            "pre_modulo": "4g"
        }
        console.log('data para el prestamo: ', data)
        await dispatch(savePrestamo(data, vehiculoPrestamo, reservaId, estacionPrestamo, fechaVence.toJSON()));
        setConectado(false);
    }


    const rentar = async () => {

        setBtnSeRento(true);
        await guardarPrestamo();

    }

    async function abrirSolenoide() {

        try {
            //await rentar();
            await sendMessage(claveHC05);
            await setTouchRentar(true);
        } catch (error) {
            console.log('Error al abrir el solenoide', error);
        }
    }

    async function turnOffLed() {
        try {
            await sendMessage('0'); // Envía el mensaje '0' al Arduino
        } catch (error) {
            console.log('Error al apagar el LED', error);
        }
    }

    async function habilitarDis() {
        try {
            const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
            if (enabled) {
                console.log('Bluetooth habilitado');
                setBluetoothOn(true)
            } else {
                console.log('Bluetooth no habilitado');
                /*Alert.alert(
                    "Bluetooth no habilitado",
                    ":)",
                    [
                        { text: "Habilitar", onPress: () => console.log('ok') }
                    ]
                );*/
                Alert.alert('habilitar bluetooth')
            }
        } catch (error) {
            console.log('Error al habilitar Bluetooth', error);
        }
    }

    async function buscarDispositivos() {
        try {
            const availableDevices = await RNBluetoothClassic.list();
            setDevices(availableDevices);
        } catch (error) {
            console.log('Error al buscar dispositivos', error);
        }
    }

    useEffect(() => {
        if (macCargado) {
            console.log('infoUser.DataUser.organizationId', infoUser.DataUser.organizationId)
            console.log('la mac', mac)
            console.log('la macCargago', macCargado)
            //console.log('la respuesta', respuestaArduino)
            buscarDispositivos();
            conectar();
            habilitarDis();
        }
    }, [macCargado])



    return (
        <View style={conectado ? styles.container : styles.sinConexion}>
            {modalTest ? openModalTest() : <></>}
            {/*<Text style={styles.textos}>{connectionMessage}</Text>*/}

            {
                conectado ?
                    <></>
                    :
                    <View style={styles.column_}>

                        {
                            bluetoothOn ?
                                <></>
                                :
                                <Pressable
                                    onPress={() => { habilitarDis() }}
                                    style={styles.btnActBluetooth}
                                >
                                    <Image source={Images.bluetoothRefresh} style={{ width: 60, height: 60 }} />
                                </Pressable>
                        }
                        <Text style={styles.textos}>{stateConect === 'conectando' ? 'Conectando...' : 'No se pudo conectar.'}</Text>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: Dimensions.get('window').width,
                            height: 'auto',
                            marginTop: 20,
                            marginBottom: 20
                        }}>
                            {
                                Env.modo === 'tablet' ?
                                    <Text style={{
                                        fontSize: 25,
                                        color: Colors.$texto,
                                        textAlign: 'center',
                                        fontFamily: Fonts.$poppinsregular
                                    }}>Conectando..</Text>
                                    :
                                    <LottieView source={require('../../Resources/Lotties/bicy_bluetooth.json')} autoPlay loop
                                        style={{
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').width
                                        }} />
                            }
                        </View>

                        {
                            stateConect === 'error' ?
                                <View style={styles.row_}>
                                    <Pressable
                                        onPress={() => { conectar() }}
                                        style={styles.btnConect}
                                    >
                                        <Text style={styles.textLiberar2}>Conectar</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => { buscarDispositivos() }}
                                        style={styles.btnConect}
                                    >
                                        <Text style={styles.textLiberar2}>Buscar</Text>
                                    </Pressable>
                                </View>
                                :
                                <></>
                        }

                    </View>
            }

            {
                claveHC05Cargada && conectado && !touchRentar ?
                    <>
                        {
                            (casco && sobrio && funcional) || preoperacinalOK ?
                                <Pressable
                                    onPress={() => { abrirSolenoide() }}
                                    style={styles.btnEnviar}
                                >
                                    <View style={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={styles.textLiberar1}>{numVehiculo}</Text>
                                        <Image source={Images.patin_Icon} style={{ width: 50, height: 50, tintColor: 'black' }} />
                                        <Text style={styles.textLiberar2}>Liberar</Text>
                                    </View>
                                </Pressable>
                                :
                                <Pressable
                                    onPress={() => {
                                        console.log('abriendo modal'),
                                            setModalTest(true)
                                    }}
                                    style={styles.btnEnviar}
                                >
                                    <View style={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={styles.textLiberar1}>{numVehiculo}</Text>
                                        <Image source={Images.patin_Icon} style={{ width: 50, height: 50, tintColor: 'black' }} />
                                        <Text style={styles.textLiberar2}>Validar</Text>
                                    </View>
                                </Pressable>
                        }
                    </>

                    :
                    <></>
            }

            {
                touchRentar && conectado ?
                    <View style={styles.column_}>
                        <Text style={{ fontSize: 20, fontFamily: Fonts.$poppinsregular, color: Colors.$texto }}>
                            {
                                !btnSeRento ?
                                    '¿Se liberó el vehículo?'
                                    :
                                    'Feliz viaje'
                            }

                        </Text>
                        <View style={styles.row_}>
                            {
                                !btnSeRento ?
                                    <>
                                        <Pressable
                                            onPress={() => rentar()}
                                            //onPress={() => console.log(dataVehiculo)}
                                            style={styles.btnSI}
                                        >
                                            <View style={{
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={styles.textLiberar2}>SI</Text>
                                            </View>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => { setTouchRentar(false) }}
                                            style={[styles.btnSI, { backgroundColor: Colors.$taller }]}
                                        >
                                            <View style={{
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={styles.textLiberar2}>NO</Text>
                                            </View>
                                        </Pressable>
                                    </>
                                    :
                                    <></>
                            }


                        </View>
                    </View>
                    :
                    <></>
            }
            <View>

                {devices.map(device => (
                    <Text key={device.id}>dispositivo : {device.name} ({device.address})</Text>
                ))}
            </View>
        </View>
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
    btnSaveColor2: {
        color: Colors.$blanco,
        fontSize: 20,
        padding: 10
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
    container: {
        width: '100%',
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    sinConexion: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        top: 0,
        zIndex: 1000,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row_: {
        width: Dimensions.get('window').width * .8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 30
    },
    column_: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height: Dimensions.get('window').height * .4,
        width: Dimensions.get('window').width
    },
    btnConect: {
        width: 150,
        height: 'auto',
        padding: 10,
        borderRadius: 30,
        backgroundColor: Colors.$texto,
        alignItems: 'center',
    },
    btnActBluetooth: {
        width: 100,
        height: 100,
        padding: 5,
        borderRadius: 10,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnEnviar: {
        width: 120,
        height: 120,
        borderRadius: 20,
        padding: 5,
        backgroundColor: Colors.$adicional,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    btnSI: {
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 5,
        backgroundColor: Colors.$adicional,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    textLiberar1: {
        fontSize: 26,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
    },
    textLiberar2: {
        fontSize: 16,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
    },
    textos: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 20,
        color: Colors.$texto80,
        width: Dimensions.get('window').width * .8,
        textAlign: 'center'
    }
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
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        perfil: state.reducerPerfil,
    }
}

//export default BluetoothClassic;

export default connect(
    mapStateToProps
)(BluetoothClassic);
