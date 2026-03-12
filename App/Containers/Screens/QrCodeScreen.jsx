import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    Modal, 
    ActivityIndicator, 
    Image, 
    BackHandler, 
    Alert,
    StyleSheet,
    Dimensions,
    Pressable
} from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import { 
    modalQrStatus, 
    validateQr, 
    verifyCameraPermissions,
} from "../../actions/rideActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BleManager } from 'react-native-ble-plx';
import { routingIfHasTrip2 } from '../../actions/actions'; 
import LottieView from 'lottie-react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import Fonts from '../../Themes/Fonts';
import { useDispatch } from 'react-redux';
import { styles } from "./Styles/QrCodeScreen.style";
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
//import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Env } from "../../Utils/enviroments";
import Images from '../../Themes/Images';

function QrCodeScreen (props){
    const dispatch = useDispatch();
    scanner = React.createRef();
    bluetooth = new BleManager(); //descomentar
    listener = null; //descomentar
    enabled = true;  

    const { infoUser } = useContext( AuthContext )
    const [modalTest, setModalTest] = useState(true);
    const [casco, setCasco] = useState(false);
    const [sobrio, setSobrio] = useState(false);
    const [funcional, setFuncional] = useState('');
    const [enviado, setEnviado] = useState(false);

    const [ state , setState ] = useState({
        torchState: false,
        modalState: false,
        inputQr: "",
        enabled: true,
        readed: false,
    })
    const goBack = () => {
        RootNavigation.navigate('Home') 
    }

    useEffect(() =>{
        console.log('probando useEffect en QRCODE :::::::::::::G::::::::::', infoUser)
        console.log('PROPS desde QRscreen :::::::::::::PROP::::::::::', props)
        console.log('props.modalQrStatus :::::::', props.modalQrStatus)
        /*backHandler = BackHandler.addEventListener(
            "hardwareBackPress", () => RootNavigation.navigate("Home")
        );*/
        //props.verifyCameraPermissions();
        //dispatch(verifyCameraPermissions());
        //verifyBluetoothState(); //descomentar
        return () => {
            //backHandler.remove();
            bluetooth.stopDeviceScan(); //descomentar
        }
    },[]);

    const abriendoModal = () => {
        if (Env.modo === 'tablet') {
            setState({ ...state, modalState: true })
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
        setState({ ...state,  torchState: !state.torchState });
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
        dispatch(validateQr(state.inputQr, infoUser.DataUser.id, infoUser.DataUser.organizationId))
    }

    const renderQrModal= () => {

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
                                    fontSize:20,
                                    fontFamily: Fonts.$poppinsregular
                                }}>X</Text>
                            </Pressable>
                            <Image source={Images.qr_} style={[estilos.iconModal]}/> 
                            <TextInput
                                style={{ 
                                    color: Colors.$texto, borderWidth: 1, borderColor: Colors.$texto50, borderRadius: 30, fontFamily: Fonts.$poppinsregular, textAlign: 'center', marginBottom: 20, paddingBottom: 10, paddingTop: 10, paddingRight: 20, paddingLeft: 20, width: "50%" }}
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
                                        //props.validateQr(state.inputQr, infoUser.DataUser.id, infoUser.DataUser.organizationId) 
                                        enviando()
                                        //dispatch(validateQr(state.inputQr, infoUser.DataUser.id, infoUser.DataUser.organizationId))
                                        : 
                                        Alert.alert("Advertencia", "Enciende el bluetooth para poder abrir el candado.")
                                    }} 
                                    style={{    
                                    textAlign: "center",
                                    padding  : 10,
                                    margin : 20,
                                    backgroundColor : Colors.$primario,
                                    borderRadius : 50}}> 
                                    <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Enviar</Text>
                                </Pressable>
                                :
                                <Pressable 
                                    onPress={() => { 
                                        state.enabled ? 
                                        //props.validateQr(state.inputQr, infoUser.DataUser.id, infoUser.DataUser.organizationId) 
                                        //dispatch(validateQr(state.inputQr, infoUser.DataUser.id, infoUser.DataUser.organizationId))
                                        Alert.alert("Advertencia", "Ya se está validando el QR.")
                                        : 
                                        Alert.alert("Advertencia", "Enciende el bluetooth para poder abrir el candado.")
                                    }} 
                                    style={{    
                                    textAlign: "center",
                                    padding  : 10,
                                    margin : 20,
                                    backgroundColor : Colors.$secundario,
                                    borderRadius : 50}}> 
                                    <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Enviar</Text>
                                </Pressable>
                            }                       

                            
                        </View>
                    </KeyboardAwareScrollView>
                    </View>
                </Modal>

            )
        }else if(props.modalQrStatus){

            return (
                <>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 20, width:"100%" }}>
                        <View style={{ backgroundColor: Colors.$primario, paddingHorizontal: 20, paddingVertical: 50 }}>
                            <Text style={{ textAlign: "center", color: "black", fontSize: 25, marginTop: 20, marginBottom: 20, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20 }}>Presiona aceptar para intentarlo de nuevo</Text>
                            <View style={{ marginHorizontal: 90 }}>
                                <TouchableOpacity onPress={() => dispatch(modalQrStatus(false))} style={styles.buttonTouchable2}>
                                    <Text style={styles.buttonText2}>Aceptar</Text>
                                </TouchableOpacity>
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
                <View style={{ justifyContent: "space-around", alignItems: "center", flex: 1, backgroundColor: Colors.$texto50, paddingHorizontal: 20, paddingVertical: 200}}>
                    <View style={{ flex:1, justifyContent: "space-around", alignItems: "center", backgroundColor: Colors.$blanco, borderRadius: 30 }}>
                        <Text style={{ textAlign: "center", color: Colors.$texto, fontSize: 20, marginTop: 20, marginBottom: 10, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20, fontFamily: Fonts.$poppinsregular}}>Presiona aceptar para intentarlo de nuevo</Text>

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
                            <TouchableOpacity onPress={() => dispatch(modalQrStatus(false))} style={[styles.buttonTouchable2, {width: 200, backgroundColor: Colors.$texto}]}>
                                <Text style={[styles.buttonText2, {color: Colors.$blanco}]}>Aceptar</Text>
                            </TouchableOpacity>
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
    }

    useEffect(() => {
        //habilitarDis();    
    },[])*/

    if (modalTest) {
        return (
            <View style={stylesModal.contenedor}>   
                <Modal transparent={true} animationType="slide"> 
                <KeyboardAwareScrollView>
                    <View style={stylesModal.subContenedor}>
                    <View style={stylesModal.caja1}>
                    <Text style={stylesModal.titulo}>
                        ¿List@ para manejar?
                    </Text>
                    <View style={{
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: Dimensions.get('window').width,
                        height: 'auto', 
                        }}>
                        <LottieView source={require('../../Resources/Lotties/bicy_casco.json')} autoPlay loop 
                        style={{
                            width: Dimensions.get('window').width,
                            height: 200,             
                        }}/>
                    </View>
          
                    <View style={stylesModal.cajaPregunta}>
                        <Text style={stylesModal.textoPregunta}>¿Tienes casco?</Text>
                        <View style={stylesModal.cajaSiNo}>
                            <Pressable  
                                onPress={()=>setCasco(true)} 
                                style={stylesModal.btnPregunta}
                            >
                                <View style={casco ? stylesModal.btnSI : stylesModal.btnNO}>
                                    <Text style={stylesModal.textoOpcion}>Si</Text>
                                </View>
                            </Pressable> 
                            <Pressable  onPress={()=>setCasco(false)} style={stylesModal.btnPregunta}>
                                <View style={!casco ? stylesModal.btnSI : stylesModal.btnNO }>
                                    <Text style={stylesModal.textoOpcion}>No</Text>
                                </View>
                            </Pressable>  
                        </View>
                    </View>
        
                    <View style={stylesModal.cajaPregunta}>
                        <Text style={stylesModal.textoPregunta}>Estás Sobri@</Text>
                        <View style={stylesModal.cajaSiNo}>
                            <Pressable  onPress={()=>setSobrio(true)} style={stylesModal.btnPregunta}>
                                <View style={sobrio ? stylesModal.btnSI : stylesModal.btnNO }>
                                    <Text style={stylesModal.textoOpcion}>SI</Text>
                                </View>
                            </Pressable> 
                            <Pressable  onPress={()=>setSobrio(false)} style={stylesModal.btnPregunta}>
                                <View style={!sobrio ? stylesModal.btnSI : stylesModal.btnNO }>
                                    <Text style={stylesModal.textoOpcion}>NO</Text>
                                </View>
                            </Pressable>   
                        </View>
                    </View>
        
                    <View style={stylesModal.cajaPregunta}>
                        <Text style={stylesModal.textoPregunta}>Vehículo funcional</Text>
                        <View style={stylesModal.cajaSiNo}>
                            <Pressable onPress={()=>setFuncional('si')} 
                                style={stylesModal.btnPregunta}>
                                <View style={ funcional === 'si' && funcional !== ''? stylesModal.btnSI : stylesModal.btnNO }>
                                    <Text style={stylesModal.textoOpcion}>SI</Text>
                                </View>
                            </Pressable> 
                            <Pressable  onPress={()=>{ setFuncional('no')}} 
                                style={stylesModal.btnPregunta}>
                                <View style={ funcional === 'no' && funcional !== '' ? stylesModal.btnSI : stylesModal.btnNO }>
                                    <Text style={stylesModal.textoOpcion}>NO</Text>
                                </View>
                            </Pressable>  
                        </View>
                    </View>
        
                    {
                        casco && sobrio && funcional === 'si'?
                        <>
                        {
                            funcional === 'si' ?
                            <View style={{
                                height: 120,
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8, padding : 15 }}>
                                    <Pressable  
                                    onPress={() => { 
                                        setModalTest(false),
                                        abriendoModal() 
                                    }}
                                    style={{
                                        backgroundColor: Colors.$primario, 
                                        borderRadius : 30,
                                        width: 280,
                                        alignItems: "center"
                                    }}>
                                        <Text style={[stylesModal.btnSaveColor2, {padding : 10}]}>Aceptar</Text>
                                    </Pressable>  
                                </View>
                            </View>
                            :
                            <></>
                        }
        
                        {
                            funcional === 'no' ?
                            <View style={{
                                height: 120,
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8, padding : 15 }}>
                                    <Pressable  
                                    onPress={() => { 
                                        Alert.alert('Selecciona otro vehículo.')
                                    }}
                                    style={{
                                        backgroundColor: Colors.$primario, 
                                        borderRadius : 30,
                                        width: 280,
                                        alignItems: "center"
                                    }}>
                                        <Text style={[stylesModal.btnSaveColor2, {padding : 10}]}>Cancelar</Text>
                                    </Pressable>  
                                </View>
                            </View>
                            :
                            <></>
                        }
                        </>               
                        :
                        <View style={{
                            height: 120,
                            marginTop: 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{ marginRight: 8, padding : 15 }}>
                                <Pressable  
                                onPress={() => { console.log('aceptar') }}
                                style={{
                                    backgroundColor: Colors.$secundario, 
                                    borderRadius : 30,
                                    width: 280,
                                    alignItems: "center"
                                }}>
                                    <Text style={[stylesModal.btnSaveColor2, {padding : 10}]}>Aceptar</Text>
                                </Pressable>  
                            </View>
                        </View>
                    }
                        
                    
                    </View>
                    </View>
                </KeyboardAwareScrollView>
                </Modal>
            </View>
        )
    }else{
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
                    height: Dimensions.get('window').height*.9,
                    backgroundColor: Colors.$blanco,
                    justifyContent: 'space-between'
                }}>

                    <View style={estilos.cajaCabeza}>
                        <Pressable  
                            onPress={() => { goBack() }}
                            style={ styles.btnAtras }>
                            <View>
                            <Image source={Images.menu_icon} style={[styles.iconMenu]}/> 
                            </View>
                        </Pressable>
                        <Text style={styles.textRectangle}>
                            Ubica el código QR que deseas
                            escanear en el recuadro
                        </Text>
                    </View>

                    <View style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height*.6,
                        overflow: 'hidden',
                    }}>
                    
                    {
                        //bluetoothOn && Env.modo === 'movil'? 
                        Env.modo === 'movil'? 
                        <QRCodeScanner
                            showMarker
                            ref={(node) => { scanner = node }}
                            reactivate={false}
                            customMarker={markerRender()}
                            onRead={(data) => {
                                if(state.enabled){
                                    dispatch(modalQrStatus(true));
                                    //props.validateQr(data.data, infoUser.DataUser.id, infoUser.DataUser.organizationId);
                                    dispatch(validateQr(data.data, infoUser.DataUser.id, infoUser.DataUser.organizationId));
                                }else{
                                    dispatch(modalQrStatus(true));
                                    setTimeout(() => { 
                                        Alert.alert("Advertencia", "Activa el bluetooth para abrir tu candado.");
                                    }, 100);
                                }
                            }}
                            flashMode={!state.torchState ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch}
                        />
                        :
                        <></>
                    }
                    </View>

                    <View style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height*.2,
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
                            onPress={() => setState({ ...state, modalState: true }) } 
                            style={{    
                                width: Dimensions.get('window').width*.4,
                                paddingTop: 10,
                                paddingBottom: 10,
                                textAlign: "center",
                                backgroundColor : Colors.$primario,
                                borderRadius : 50,
                            }}> 
                            <View style={estilos.center_}>
                                {/*<Image source={Images.qr_} style={[estilos.iconBtns]}/>*/} 
                                <Text style={[estilos.textButton, {color : Colors.$blanco, fontFamily: Fonts.$poppinsregular}]}>Qr manual</Text> 
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
        {props.modalQrStatus? qrError() : <></>}
        {renderQrModal()}
    </>
    )
    }
}


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
        width: Dimensions.get('window').width*.8,
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
        width: Dimensions.get('window').width*.9,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10
    },
    textoPregunta: {
        width: Dimensions.get('window').width*.4,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto80,
        paddingLeft: 10
    },
    cajaSiNo: {
        width: Dimensions.get('window').width*.5,
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
        felx:1,
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
    textButton : {
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

function mapStateToProps(state) {
    return {
        loading: state.rideReducer.loading,
        loadingLock: state.rideReducer.loadingLock,
        modalQrStatus: state.rideReducer.modalQrStatus,
        loadingBluetooth: state.rideReducer.loadingBluetooth
    }
}


function mapDispatchtoProps(dispatch) {
    return {
        //verifyCameraPermissions: () => dispatch(verifyCameraPermissions()),
        //validateQr: (qrNumber, idUser, orgId) => dispatch(validateQr(qrNumber, idUser, orgId)),
        //qrStatus: (toogle) => dispatch(modalQrStatus(toogle)),
        //routingIfHasTrip2: () => dispatch(routingIfHasTrip2())
    }
}

export default connect(
    mapStateToProps
    //mapDispatchtoProps
)(QrCodeScreen);
