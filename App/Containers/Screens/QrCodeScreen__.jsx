import { 
    View, 
    Text, 
    Pressable, 
    TextInput, 
    Modal, 
    ActivityIndicator, 
    Image, 
    BackHandler, 
    Alert,
    StyleSheet,
    Dimensions
} from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import { 
    modalQrStatus, 
    validateQr, 
    verifyCameraPermissions
} from "../../actions/rideActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BleManager } from 'react-native-ble-plx';
import { routingIfHasTrip2 } from '../../actions/actions'; 
//import LottieView from 'lottie-react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { styles } from "./Styles/QrCodeScreen.style";
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';

function QrCodeScreen (props){
    const dispatch = useDispatch();
    scanner = React.createRef();
    bluetooth = new BleManager(); //descomentar
    listener = null; //descomentar
    enabled = true;  

    const { infoUser } = useContext( AuthContext )

    const [ state , setState ] = useState({
        torchState: false,
        modalState: false,
        inputQr: "",
        enabled: true,
        readed: false,
    })

    useEffect(() =>{
        console.log('probando useEffect en QRCODE :::::::::::::G::::::::::', infoUser)
        console.log('PROPS desde QRscreen :::::::::::::PROP::::::::::', props)
        console.log('props.modalQrStatus :::::::', props.modalQrStatus)
        /*backHandler = BackHandler.addEventListener(
            "hardwareBackPress", () => RootNavigation.navigate("Home")
        );*/
        //props.verifyCameraPermissions();
        dispatch(verifyCameraPermissions());
        //verifyBluetoothState(); //descomentar
        return () => {
            //backHandler.remove();
            bluetooth.stopDeviceScan(); //descomentar
        }
    },[]);

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
    const renderQrModal= () => {

        if (state.modalState && !props.modalQrStatus) {
            return (
                <Modal visible={state.modalState} transparent={true} onRequestClose={() => {
                    setModalVisible(!state.modalState);
                }}>
                    <KeyboardAwareScrollView>
                        <View style={styles.modalStyle}>
                            <Pressable onPress={() => setModalVisible(!state.modalState)} style={[styles.buttonClose]}>
                                <Text>X</Text>
                            </Pressable>
                            <TextInput
                                style={{ color: "#000", borderWidth: 1, borderColor: "#ababab", borderRadius: 30, fontFamily: 'Aldo-SemiBold', textAlign: 'center', marginBottom: 20, paddingBottom: 10, paddingTop: 10, paddingRight: 20, paddingLeft: 20, width: "50%" }}
                                placeholderTextColor="#ebebeb"
                                value={state.inputQr}
                                onChangeText={(data) => { setState({ ...state, inputQr: data }); }}
                                keyboardType="phone-pad"
                                numberOfLines={1}
                                placeholder="Código QR"></TextInput>
                            <View style={{ flex: 0.3 }}></View>
                            <Pressable 
                                onPress={() => { 
                                state.enabled ? 
                                //props.validateQr(state.inputQr, infoUser.DataUser.id, infoUser.DataUser.organizationId) 
                                dispatch(validateQr(state.inputQr, infoUser.DataUser.id, infoUser.DataUser.organizationId))
                                : 
                                Alert.alert("Advertencia", "Enciende el bluetooth para poder abrir el candado."); }} 
                                style={[styles.buttonTouchable, { paddingHorizontal: 30 }]}
                            >
                                    <Text style={[styles.buttonText]}>Enviar</Text>
                            </Pressable>
                        </View>
                    </KeyboardAwareScrollView>
                </Modal>
            )
        }else if(props.modalQrStatus){

            return (
                <>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 20, width:"100%" }}>
                        <View style={{ backgroundColor: Colors.$primario, paddingHorizontal: 20, paddingVertical: 50 }}>
                            <Text style={{ textAlign: "center", color: "black", fontSize: 25, marginTop: 20, marginBottom: 20, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20 }}>Presiona aceptar para intentarlo de nuevo</Text>
                            <View style={{ marginHorizontal: 90 }}>
                                <Pressable onPress={() => dispatch(modalQrStatus(false))} style={styles.buttonTouchable2}>
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
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20 }}>Validando la información del candado y del usuario para iniciar viaje...</Text>
                      
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
                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <View style={{ backgroundColor: Colors.$primario, paddingHorizontal: 20, paddingVertical: 50 }}>
                        <Text style={{ textAlign: "center", color: "black", fontSize: 25, marginTop: 20, marginBottom: 20, fontFamily: 'Aldo-SemiBold', marginHorizontal: 20 }}>Presiona aceptar para intentarlo de nuevo</Text>
                        <View style={{ marginHorizontal: 90 }}>
                            <Pressable onPress={() => dispatch(modalQrStatus(false))} style={styles.buttonTouchable2}>
                                <Text style={styles.buttonText2}>Aceptar</Text>
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
                <Text style={styles.textRectangle}>
                    Ubica el código QR que deseas
                    escanear en el recuadro
                </Text>
                <View
                    style={[
                        styles.rectangle
                    ]}
                />
            </View>
        )
    }

    return (
    <>
        {props.loading && !props.loadingLock ? renderLoading() :
            <View style={{ flex: 1 }}>
                {
                props.modalQrStatus 
                ? 
                dispatch(modalQrStatus(true))
                :
                <>
                    {
                    <QRCodeScanner
                    showMarker
                    ref={(node) => { scanner = node }}
                    reactivate={false}
                    customMarker={markerRender()}
                    onRead={(data) => {
                        if(state.enabled){
                            dispatch(modalQrStatus(true));
                            console.log(data.data)
                            //props.validateQr(data.data, infoUser.DataUser.id, infoUser.DataUser.organizationId);
                            //dispatch(validateQr(data.data, infoUser.DataUser.id, infoUser.DataUser.organizationId));
                        }else{
                            dispatch(modalQrStatus(true));
                            setTimeout(() => { 
                                Alert.alert("Advertencia", "Activa el bluetooth para abrir tu candado.");
                            }, 100);
                        }
                    }}
                    flashMode={!state.torchState ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch}
                    topContent={
                        <View style={styles.topContainer}>
                            <Pressable 
                                onPress={() => RootNavigation.navigate("Home")} 
                                style={styles.buttonBack}>
                                <Text style={styles.buttonText}>Atrás</Text>
                            </Pressable>
                            <View style={{ flex: 0.24 }}></View>
                            <View style={{ flex: 0.4 }}></View>
                        </View>
                    }
                    bottomContent={
                    <View>
                        <Pressable onPress={() => switchTorchState()} style={styles.buttonTouchable}>
                            <Text style={styles.buttonText}>Encender Linterna</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => setState({ ...state, modalState: true })} style={styles.buttonQr}>
                            <Text style={[styles.buttonText, { fontFamily: 'Aldo-SemiBold' }]}>Ingresar QR manualmente</Text>
                        </Pressable>
                    </View>
                    }
                />

                    }                    
                </>
                  
                }
                {/*<Pressable 
                    onPress={() => setState({ ...state, modalState: true })} style={styles.buttonTouchable}>
                    <Text style={[styles.buttonText, { fontFamily: 'Aldo-SemiBold' }]}>Ingresar QR manualmente</Text>
                </Pressable>*/}

            </View>
        }
        
        {props.loadingBluetooth && renderBluetoothLoading()}                
        {!props.loading && props.loadingLock && renderLockLoading()}
        {props.modalQrStatus? qrError() : <></>}
        {renderQrModal()}
    </>
    )

}

const estilos = StyleSheet.create({
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777'
    },
    textBold: {
      fontWeight: '500',
      color: '#000'
    },
    buttonText: {
      fontSize: 21,
      color: '#f60'
    },
    buttonTouchable: {
      padding: 16,
      width: Dimensions.get('window').width*.5,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
    }
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
