import {
    View,
    Text,
    TextInput,
    Modal,
    ActivityIndicator,
    Image,
    BackHandler,
    Alert,
    StyleSheet,
    Dimensions,
    Pressable,
    ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import { movilidad5gActions } from '../../actions/movilidad5gActions';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BleManager } from 'react-native-ble-plx';
import { routingIfHasTrip2 } from '../../actions/actions';
import { saveFormPreoperacional } from '../../actions/actionPerfil';
import LottieView from 'lottie-react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Camera, CameraType } from 'react-native-camera-kit';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import Fonts from '../../Themes/Fonts';
import { useDispatch } from 'react-redux';
import { styles } from "./styles/QrCodeScreen.style";
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { Env } from "../../Utils/enviroments";
import Images from '../../Themes/Images';
import { bluetooth as bluetoothService } from '../../Services/bluetooth.service2';

function QrScanScreen(props) {
    const dispatch = useDispatch();

    let scanner = React.createRef();
    const bluetooth = bluetoothService.manager;
    let listener = null;
    let enabled = true;

    const [isScanning, setIsScanning] = useState(true);
    const onReadCode = (event) => {
        const qrValue = event?.nativeEvent?.codeStringValue;
        setIsScanning(false);
        Alert.alert('Código QR detectado', qrValue, [
            {
                text: 'Escanear de nuevo',
                onPress: () => setIsScanning(true),
            },
        ]);
    };

    const { infoUser } = useContext(AuthContext)
    const [modalTest, setModalTest] = useState(true);
    const [casco, setCasco] = useState(false);
    const [sobrio, setSobrio] = useState(false);
    const [funcional, setFuncional] = useState('');
    const [enviado, setEnviado] = useState(false);

    const [state, setState] = useState({
        torchState: false,
        modalState: false,
        inputQr: "",
        enabled: true,
        readed: false,
    })
    const goBack = () => {
        RootNavigation.navigate('Home')
    }

    useEffect(() => {
        if (!props.loading && props.loadingLock) {
            setState(prev => ({ ...prev, modalState: false, inputQr: "" }));
            setEnviado(false);
        }
    }, [props.loading, props.loadingLock]);

    useEffect(() => {
        if (props.modalQrStatus) {
            setState(prev => ({ ...prev, modalState: false, inputQr: "" }));
            setEnviado(false);
            setIsScanning(true);
        }
    }, [props.modalQrStatus]);

    useEffect(() => {
        console.log('probando useEffect en QRCODE :::::::::::::G::::::::::', infoUser)
        console.log('PROPS desde QRscreen :::::::::::::PROP::::::::::', props)
        console.log('props.modalQrStatus :::::::', props.modalQrStatus)
        /*backHandler = BackHandler.addEventListener(
            "hardwareBackPress", () => RootNavigation.navigate("Home")
        );*/
        //props.verifyCameraPermissions();
        //dispatch(verifyCameraPermissions());
        verifyBluetoothState();
        return () => {
            //backHandler.remove();
            bluetooth.stopDeviceScan();
        }
    }, []);

    const abriendoModal = () => {
        if (Env.modo === 'tablet') {
            setState({ ...state, modalState: true })
        } else {
            verifyBluetoothState();
        }
    }

    const verifyBluetoothState = () => {
        listener = bluetooth.onStateChange((state) => {
            if (state === 'PoweredOn') {
                setState({ ...state, enabled: true });
            } else {
                if (enabled) {
                    Alert.alert("Advertencia", "Para poder utilizar el servicio de QR, el bluetooth debe estar encendido, asi podemos abrir tu candado.")
                };
                setState({ ...state, enabled: false });
            }
        }, true);
    }

    /**
     *Switch the actual state of the torch 
    */
    const switchTorchState = () => {
        console.log('encendiendo linterna')
        setState({ ...state, torchState: !state.torchState });
        scanner.reactivate();
    }

    /**
     *Deletes the input value of the modal and close the modal itself. 
    */
    const setModalVisible = (visible) => {
        setState({ ...state, inputQr: "" })
        setState({ ...state, modalState: visible });
    }
    /**
     *Render a modal for manual input of the qr code. 
    */
    const enviando = () => {
        setEnviado(true);
        dispatch(movilidad5gActions.validateQrCode(state.inputQr, infoUser.DataUser.organizationId, infoUser.DataUser.id, props.perfil.empresa))
    }

    const renderQrModal = () => {

        if (state.modalState && !props.modalQrStatus) {
            return (
                <Modal visible={state.modalState} transparent={true} onRequestClose={() => {
                    setModalVisible(!state.modalState);
                }}>
                    <View style={{ backgroundColor: Colors.$texto80, flexDirection: "column", flex: 1 }}>
                        <KeyboardAwareScrollView>
                            <View style={styles.modalStyle}>
                                <Pressable
                                    onPress={() => setModalVisible(!state.modalState)}
                                    style={[styles.buttonClose]}>
                                    <Text style={{
                                        fontSize: 20,
                                        fontFamily: Fonts.$poppinsregular
                                    }}>X</Text>
                                </Pressable>
                                <Image source={Images.qr_} style={[estilos.iconModal]} />
                                <TextInput
                                    style={{
                                        color: Colors.$texto, borderWidth: 1, borderColor: Colors.$texto50, borderRadius: 30, fontFamily: Fonts.$poppinsregular, textAlign: 'center', marginBottom: 20, paddingBottom: 10, paddingTop: 10, paddingRight: 20, paddingLeft: 20, width: "50%"
                                    }}
                                    placeholderTextColor={Colors.$texto80}
                                    value={state.inputQr}
                                    onChangeText={(data) => { setState({ ...state, inputQr: data }); }}
                                    keyboardType="phone-pad"
                                    numberOfLines={1}
                                    placeholder="Código QR"></TextInput>
                                <View style={{ flex: 0.3 }}></View>

                                {
                                    !enviado ?
                                        <Pressable
                                            onPress={() => {
                                                state.enabled ?
                                                    enviando()
                                                    :
                                                    Alert.alert("Advertencia", "Enciende el bluetooth para poder abrir el candado.")
                                            }}
                                            style={{
                                                textAlign: "center",
                                                padding: 10,
                                                margin: 20,
                                                backgroundColor: Colors.$primario,
                                                borderRadius: 50
                                            }}>
                                            <Text style={[estilos.textButton, { width: 250, color: 'white', fontFamily: Fonts.$poppinsregular }]}>Enviar</Text>
                                        </Pressable>
                                        :
                                        <Pressable
                                            onPress={() => {
                                                state.enabled ?
                                                    Alert.alert("Advertencia", "Ya se está validando el QR.")
                                                    :
                                                    Alert.alert("Advertencia", "Enciende el bluetooth para poder abrir el candado.")
                                            }}
                                            style={{
                                                textAlign: "center",
                                                padding: 10,
                                                margin: 20,
                                                backgroundColor: Colors.$secundario,
                                                borderRadius: 50
                                            }}>
                                            <Text style={[estilos.textButton, { width: 250, color: 'white', fontFamily: Fonts.$poppinsregular }]}>Enviar</Text>
                                        </Pressable>
                                }


                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </Modal>

            )
        } else if (props.modalQrStatus) {

            return (
                <>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 20, width: "100%" }}>
                        <View style={{ backgroundColor: Colors.$primario, paddingHorizontal: 20, paddingVertical: 50 }}>
                            <Text style={{ textAlign: "center", color: "black", fontSize: 25, marginTop: 20, marginBottom: 20, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20 }}>
                                {props.qrError || "Presiona aceptar para intentarlo de nuevo"}
                            </Text>
                            <View style={{ marginHorizontal: 90 }}>
                                <Pressable onPress={() => dispatch(movilidad5gActions.setModalQrErrorStatus(false))} style={styles.buttonTouchable2}>
                                    <Text style={styles.buttonText2}>Aceptar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </>
            )
        }
    }

    /**
     *Render a loading screen while the trip its validated
    */
    const renderLoading = () => {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: 'Aldo-SemiBold' }}>Validando tu código QR...</Text>

                    </View>
                </View>
            </Modal>
        )
    }

    /**
     *Render a loading screen while the qr code is validated. 
    */
    const renderLockLoading = () => {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20 }}>Validando que tu candado haya abierto...</Text>

                    </View>
                </View>
            </Modal>
        )
    }

    const renderBluetoothLoading = () => {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20 }}>Abriendo tu candado por bluetooth...</Text>

                    </View>
                </View>
            </Modal>
        )
    }

    const qrError = () => {
        return (
            <Modal transparent={true} animationType="slide">
                <View style={{ justifyContent: "space-around", alignItems: "center", flex: 1, backgroundColor: Colors.$texto50, paddingHorizontal: 20, paddingVertical: 200 }}>
                    <View style={{ flex: 1, justifyContent: "space-around", alignItems: "center", backgroundColor: Colors.$blanco, borderRadius: 30 }}>
                        <Text style={{ textAlign: "center", color: Colors.$texto, fontSize: 20, marginTop: 20, marginBottom: 10, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20, fontFamily: Fonts.$poppinsregular }}>
                            {props.qrError || "Presiona aceptar para intentarlo de nuevo"}
                        </Text>

                        <View style={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <LottieView
                                style={{
                                    width: 150,
                                    height: 200
                                }}
                                source={require('../../Resources/Lotties/bicy_error.json')}
                                autoPlay loop />
                        </View>

                        <View style={{ marginHorizontal: 10 }}>
                            <Pressable onPress={() => dispatch(movilidad5gActions.setModalQrErrorStatus(false))} style={[styles.buttonTouchable2, { width: 200, backgroundColor: Colors.$texto }]}>
                                <Text style={[styles.buttonText2, { color: Colors.$blanco }]}>Aceptar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    /**
     *Render the marker for the qr code scanner. 
    */
    const markerRender = () => {
        return (
            <View style={styles.rectangleContainer}>
                <View
                    style={[
                        styles.rectangle
                    ]}
                />
            </View>
        )
    }

    const [bluetoothOn, setBluetoothOn] = useState(true); //valor inicial false

    /*async function habilitarDis() {
        try {
            const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
            if (enabled) {
                console.log('Bluetooth habilitado');
                setBluetoothOn(true)
            } else {
                console.log('Bluetooth no habilitado');
                Alert.alert('habilitar bluetooth')
            }
        } catch (error) {
            console.log('Error al habilitar Bluetooth', error);
        }
    }*/

    useEffect(() => {
        if (props.perfil.form_preoperacional_estado) {
            //Alert.alert("Formulario Preoperacional se guardo en el estado exitosamente");
            console.log('STATE en reducer', props.perfil.form_preoperacional)
            setModalTest(false)
        }
    }, [props.perfil.form_preoperacional_estado])

    //formulario preoperacional
    const [respuestas, setRespuestas] = useState({});
    const [comentarios, setComentarios] = useState("");
    const [aceptado, setAceptado] = useState(false);

    const preguntas = [
        { texto: "¿Te comprometes a conducir de manera responsable, respetando todas las normas de tránsito, manteniendo una velocidad inferior a 25 km/h en todo momento, sin utilizar audífonos y con total concentración en la vía?", comentario: false },
        { texto: "¿Estás en condiciones de salud y descanso para usar la bicicleta sin malestar, mareos, fiebre, sueño u otros síntomas?", comentario: false },
        { texto: "¿Llevas los elementos de protección requeridos: casco para ciclista? y si vas a realizar un recorrido después de las 6 p.m o antes de las 6 a.m valida si llevas una prenda reflectiva.", comentario: false },
        { texto: "¿Existen condiciones óptimas en los componentes mecánicos?: Marco, Manubrio, llantas, reflectores, asiento, pedales, frenos, cambios, plato, cadenilla, tenedor, campana, y manillares, entre otros?", comentario: false },
        { texto: "Las llantas cuentan con un labrado y sin desgastes, se encuentren sin protuberancias, cortes, fisuras o deformaciones?", comentario: false },
        { texto: "¿Existen condiciones óptimas en los componentes eléctricos?: Batería, motor, controlador, display, luces delantera y trasera, pedaleo asistido y cableado, entre otros?", comentario: false },
        { texto: "¿Hay alguna situación o elemento de los descritos a continuación que esté presentado un riesgo y pueda llegar a causar un accidente? : Vías internas deterioradas, iluminación deficiente, ausencia de señalización en los parqueaderos, conexiones eléctricas peligrosas, elementos eléctricos deteriorados, rampas de acceso muy empinadas o resbalosas, comportamientos riesgosos de otros actores viales en estos espacios, entre otros.", comentario: false },
        { texto: "Si dentro de la respuesta anterior algún elemento NO cumple: detalla aquí lo que encontraste.(Opcional)", comentario: true },
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
                            "Si encontraste un riesgo, debes detallar la situación en el comentario."
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

    if (modalTest && infoUser) {
        return (
            <>
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
                        <Pressable
                            onPress={() => { goBack() }}
                            style={styles.btnAtras}>
                            <View>
                                <Image source={Images.menu_icon} style={[styles.iconMenu]} />
                            </View>
                        </Pressable>
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
            </>
        )
    } else {
        return (
            <>
                {modalTest ? openModalTest() : <></>}
                {props.loading && !props.loadingLock ? renderLoading() :
                    <KeyboardAwareScrollView>
                        <View style={{
                            flex: 1,
                            position: 'relative',
                            height: Dimensions.get('window').height,
                            width: Dimensions.get('window').width,
                            backgroundColor: Colors.$blanco
                        }}>
                            {
                                props.modalQrStatus
                                    ?
                                    <></>
                                    :
                                    <View style={{
                                        width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').height * .9,
                                        backgroundColor: Colors.$blanco,
                                        justifyContent: 'space-between'
                                    }}>

                                        <View style={estilos.cajaCabeza}>
                                            <Pressable
                                                onPress={() => { goBack() }}
                                                style={styles.btnAtras}>
                                                <View>
                                                    <Image source={Images.menu_icon} style={[styles.iconMenu]} />
                                                </View>
                                            </Pressable>
                                            <Text style={styles.textRectangle}>
                                                Ubica el código QR que deseas
                                                escanear en el recuadro
                                            </Text>
                                        </View>

                                        <View style={{
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height * .6,
                                            overflow: 'hidden',
                                        }}>

                                            {/*
                        //bluetoothOn && Env.modo === 'movil'? 
                        Env.modo === 'movil'? 
                        <QRCodeScanner
                            showMarker
                            ref={(node) => { scanner = node }}
                            reactivate={false}
                            customMarker={markerRender()}
                            onRead={(data) => {
                                if(state.enabled){
                                    dispatch(movilidad5gActions.validateQrCode(data.data, infoUser.DataUser.organizationId, infoUser.DataUser.id));
                                }else{
                                    dispatch(movilidad5gActions.setModalQrErrorStatus(true));
                                    setTimeout(() => { 
                                        Alert.alert("Advertencia", "Activa el bluetooth para abrir tu candado.");
                                    }, 100);
                                }
                            }}
                            flashMode={!state.torchState ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch}
                        />
                        :
                        <></>
                    */}

                                            {<View style={stylesQR.container}>
                                                {isScanning ? (
                                                    <View style={{ flex: 1 }}>
                                                        <Camera
                                                            style={{ flex: 1 }}
                                                            ref={(ref) => (scanner = ref)}
                                                            cameraType="back"
                                                            flashMode="auto"
                                                            scanBarcode={true}
                                                            onReadCode={(event) => {
                                                                if (!event?.nativeEvent?.codeStringValue) return;
                                                                const qrValue = event.nativeEvent.codeStringValue;
                                                                if (state.enabled) {
                                                                    dispatch(movilidad5gActions.validateQrCode(qrValue, infoUser.DataUser.organizationId, infoUser.DataUser.id, props.perfil.empresa));
                                                                } else {
                                                                    dispatch(movilidad5gActions.setModalQrErrorStatus(true));
                                                                    setTimeout(() => {
                                                                        Alert.alert("Advertencia", "Activa el bluetooth para abrir tu candado.");
                                                                    }, 100);
                                                                }
                                                            }}
                                                            showFrame={false}
                                                            laserColor="red"
                                                            frameColor="white"
                                                        // 👇 Ajusta el tamaño del frame
                                                        />
                                                        <View style={{
                                                            position: 'absolute',
                                                            top: '25%',
                                                            left: '10%',
                                                            width: '80%',
                                                            height: 300,
                                                            borderWidth: 2,
                                                            borderColor: 'green',
                                                            borderRadius: 10
                                                        }} />
                                                    </View>
                                                ) : (
                                                    <Text style={styles.text}>Escaneo detenido temporalmente</Text>
                                                )}
                                            </View>}
                                        </View>

                                        <View style={{
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height * .2,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-around'
                                        }}>
                                            {/*<Pressable 
                            onPress={() => switchTorchState() } 
                            style={{  
                                width: Dimensions.get('window').width*.4,  
                                paddingTop: 10,
                                paddingBottom: 10,
                                textAlign: "center",
                                backgroundColor : Colors.$primario,
                                borderRadius : 50,
                            }}> 
                            <View style={estilos.center_}>
                                
                                <Text style={[estilos.textButton, {color : Colors.$blanco, fontFamily: Fonts.$poppinsregular}]}>Linterna</Text> 
                            </View>
                            
                        </Pressable>*/}


                                            <Pressable
                                                onPress={() => setState({ ...state, modalState: true })}
                                                style={{
                                                    width: Dimensions.get('window').width * .4,
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                    textAlign: "center",
                                                    backgroundColor: Colors.$primario,
                                                    borderRadius: 50,
                                                }}>
                                                <View style={estilos.center_}>
                                                    {/*<Image source={Images.qr_} style={[estilos.iconBtns]}/>*/}
                                                    <Text style={[estilos.textButton, { color: Colors.$blanco, fontFamily: Fonts.$poppinsregular }]}>Qr manual</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>

                            }
                        </View>
                    </KeyboardAwareScrollView>
                }

                {/*props.loadingBluetooth && renderBluetoothLoading()*/}
                {!props.loading && props.loadingLock && renderLockLoading()}
                {props.modalQrStatus ? qrError() : <></>}
                {renderQrModal()}
            </>
        )
    }
}
const stylesQR = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});

const stylesModal = StyleSheet.create({
    btnSaveColor2: {
        color: Colors.$blanco,
        fontSize: 20,
    },
    contenedor: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: "center",
        alignItems: "center",
    },
    subContenedor: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: Colors.$blanco,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    caja1: {
        flex: 1,
        width: Dimensions.get('window').width * .8,
        height: Dimensions.get('window').height,
        borderRadius: 6,
        marginVertical: 0,
        marginHorizontal: 0,
        backgroundColor: Colors.$blanco,
        justifyContent: "center",
        alignItems: "center",
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

const estilos = StyleSheet.create({
    cajaCabeza: {
        felx: 1,
        backgroundColor: Colors.$blanco,
        width: Dimensions.get('window').width,
        height: 150
    },
    row_: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    center_: {
        alignItems: 'center',
        justifyContent: 'center'
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
    iconMenu: {
        width: 50,
        height: 50,
    },
    iconBtns: {
        width: 30,
        height: 30,
        tintColor: Colors.$texto,
        marginLeft: 20,
        marginRight: 10,
    },
    iconModal: {
        width: 120,
        height: 120,
        tintColor: Colors.$texto,
        marginBottom: 20,
    },
    textButton: {
        fontFamily: Fonts.$poppinsregular,
        textAlign: "center",
        fontSize: 18,
        paddingTop: 'auto',
        paddingBottom: 'auto',
        color: 'white',
        color: Colors.$blanco,
        alignSelf: "center",
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
        perfil: state.reducerPerfil,
        loading: state.movilidad5gReducer.loading,
        loadingLock: state.movilidad5gReducer.loadingLock,
        modalQrStatus: state.movilidad5gReducer.modalQrStatus,
        lockInformation: state.movilidad5gReducer.lock,
        qrError: state.movilidad5gReducer.qrError,
    }
}

export default connect(
    mapStateToProps
)(QrScanScreen);
