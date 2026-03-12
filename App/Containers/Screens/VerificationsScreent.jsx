import { Content } from 'native-base';
import React from 'react';
import {
    Image, View, Text,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Alert,
    ScrollView,
    Pressable,
    StyleSheet,
    Dimensions
} from 'react-native';
//import { NavigationInjectedProps } from 'react-navigation';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { validateForgotPassword } from '../../Utils/validation';
import styles from './Styles/VerificationsScreent.style';
import { appActions } from '../../actions/actions';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { 
    appRideActions, 
    checkLocationPermissions, 
    getActiveTripChecklist, 
    setButtonStartValidation 
} from '../../actions/rideActions';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
//import LottieView from 'lottie-react-native';

class VerificationsScreent extends React.Component{
    valorTest = true;
    /*     endTripValidation = {
            userInRange: "no",
            lockIsClosed: "yes",
            lockInRange: "loading"
        }; */
    bluetooth: BleManager;
    listener;
    enabled;
    constructor(props) {
        super(props);
        this.state = {
            enabled: true,
        },
            this.listener = null;
        this.bluetooth = new BleManager();
        this.enabled = true;
    }

    
    componentDidMount() {
        this.props.getActiveTripChecklist(); 
        this.endTrip();
    }

    verifyBluetoothState() {
        console.log('verificando el statdo del bluethooth desde screen verificando')
        this.listener = this.bluetooth.onStateChange((state) => {
            console.log("state", state)
            if (state === 'PoweredOn') {
                console.log('estado del bluethooth poweron', state)
                console.log("encendido")
                this.setState({ enabled: true });
                this.props.setBluetoothState(true);
            } else {
                console.log('estado del bluethooth', state)
                if (this.enabled) {
                    //Alert.alert("Advertencia", "Para poder utilizar el servicio de QR, el bluetooth debe estar encendido, asi podemos abrir tu candado.")
                };
                this.setState({ enabled: false });
                this.props.setBluetoothState(false);
                console.log("apagado")
                console.log(this.enabled);
            }
        }, true);        
    }

    /*navigateTravelExperienceScreen = () => {
        this.props.navigation.navigate('travelExperienceScreen')
    }*/

    //funcion sin validaciones
    endTrip(){
        console.log("endTrip VerificationsScreent", this.props);
        //let actualTrip = this.props.tripReducer.newTrip[0];
        //console.log('finalizando ', actualTrip);
        //console.log('finalizando trip actualTrip new trip', actualTrip.id);
        //console.log('finalizando trip actualTrip new estacion', actualTrip.startStationId);
        if(this.props.tripReducer.newTrip[0]){
            console.log('es con []')
            let actualTrip = this.props.tripReducer.newTrip[0];
            //Alert.alert("Error", "es con []");
            console.log('finalizando ', actualTrip);
            console.log('finalizando trip actualTrip new trip', actualTrip.id);
            console.log('finalizando trip actualTrip new estacion', actualTrip.startStationId);
            this.props.endTrip(actualTrip, actualTrip.startStationId);
        }else if(this.props.tripReducer.newTrip){
            console.log('es sin []')
            let actualTrip = this.props.tripReducer.newTrip;
            //Alert.alert("Error", "es sin []");
            console.log('finalizando ', actualTrip);
            console.log('finalizando trip actualTrip new trip', actualTrip.id);
            console.log('finalizando trip actualTrip new estacion', actualTrip.startStationId);
            this.props.endTrip(actualTrip, actualTrip.startStationId);
        }else {
            Alert.alert("Error", "Error terminando viaje, contacta soporte");
        }
    }

    /*endTrip(){
        console.log("endTrip VerificationsScreent", this.props);
        let actualTrip = this.props.actualTrip;
        let checklistlocation = this.props.checklistlocation;
        console.log('finalizando trip actualTrip', actualTrip);
        console.log('finalizando trip checklistlocation', checklistlocation);
        if(actualTrip.id && checklistlocation.closestStationId){
            this.props.endTrip(actualTrip, checklistlocation.closestStationId);
        }else {
            Alert.alert("Error", "Error terminando viaje, contacta soporte");
            //this.props.endTrip(actualTrip, checklistlocation.closestStationId);
        }
    }*/

    renderEndLoading() {
        return (
            <Modal transparent={true}>
                <View style={{ width: '100%', height: '100%',backgroundColor: Colors.$blanco, flexDirection: "column", flex: 1 }}>
                    <View style={{ width: '100%', height: '100%', justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
                        <Text style={{ textAlign: "center", color: Colors.$texto, fontSize: 20, marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Estamos finalizando tu viaje...</Text>
                        <View style={{
                            justifyContent: "center", 
                            alignItems: "center", 
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').width,
                        }}>
                          
                        </View> 
                    </View>
                </View>
            </Modal>
        )
    }


    render() {
        console.log("render VerificationsScreent", this.props);
        console.log('veficando si o no ', this.props.endTripValidation?.userInRange)
        if (this.props.loadingEnd) {
            return this.renderEndLoading();
        }else{
            return (
            <>
            <ImageBackground source={Images.grayBackground} style={styles.settingBackground}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
                    <ScrollView>

                   

                    <View style={ styles.cajaScroll }>
                    
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', width: 150, height: 150, borderRadius: 15, marginTop: 20, marginBottom: 20}}>
                                {/* Image of boy on bicycle */}
                                <Image style={{ width: 150, height: 160 }} source={Images.finishing2} />
                            </View>
                            <Text style={{
                                fontSize: 25, fontFamily: Fonts.$poppinsmedium,
                                fontWeight: 'normal', color: Colors.$texto80
                            }}>Finalizando viaje</Text>
                            

                            {/* validation message */}
                            <Text style={styles.textCenter}>Asegura la bici al bicicletero con la guaya y cierra el candado. Estamos comprobando que todo esté en orden para realizar la entrega.</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                <Text style={styles.textValidation}>Tú cumples con los requisitos.</Text>
                                <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconOk}></Image>
                            </View>

                            {/* First validation message */}
                            {/*
                                this.props.actualTrip.organizationId === '651d72b809e814033e3e3546' ? 
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                    <Text style={styles.textValidation}>Tú cumples con los requisitos.</Text>
                                    <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconOk}></Image>
                                </View>
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                
                                <Text style={styles.textValidation}>Tú cumples con los requisitos.</Text>
                                {
                                    
                                    this.props.endTripValidation?.userInRange == "yes" ?
                                        <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconOk}></Image> :
                                        this.props.endTripValidation?.userInRange == "no" ?
                                            <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconBad}></Image> :
                                            this.props.endTripValidation?.userInRange == "loading" ?
                                                <ActivityIndicator style={{ width: 50, height: 50, marginRight: 20 }} size="large" /> : <></>
                                    
                                }
                            </View>
                            */}

                            {/* Second validation message 
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                <Text style={styles.textNumber}>2. </Text>
                                <Text style={styles.textValidation}>La bicicleta está en el perímetro de la estación.</Text>
                                {
                                     Validation to set one of the icon states 
                                    this.props.endTripValidation?.lockInRange == "yes" ?
                                        <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconOk}></Image> :
                                        this.props.endTripValidation?.lockInRange == "no" ?
                                            <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconBad}></Image> :
                                            this.props.endTripValidation?.lockInRange == "loading" ?
                                                <ActivityIndicator style={{ width: 50, height: 50, marginRight: 20 }} size="large" /> : <></>
                                }
                            </View>
                            */}
                            {/* Third validation message 
                           
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                <Text style={styles.textNumber}>2. </Text>
                                <Text style={styles.textValidation}>El candado de la bicicleta está cerrado.</Text>
                                {
                                    
                                    this.props.endTripValidation?.lockIsClosed == "yes" 
                                    ?
                                    <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconOk}></Image> 
                                    :
                                        this.props.endTripValidation?.lockIsClosed == "no" 
                                        ?
                                        
                                        <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconBad}></Image> 
                                        :
                                            this.props.endTripValidation?.lockIsClosed == "loading" 
                                            ?
                                            <ActivityIndicator style={{ width: 50, height: 50, marginRight: 20 }} size="large" /> 
                                            :
                                            <></>
                                }
                            </View>
*/}
                            {/* Alert message in red */}
                            <Text style={[styles.textCenter, styles.colorRed]}>Asegúrate de cumplir con todos los requisitos antes de realizar la entrega.</Text>

                            {/* hacemos una validacion si la empresa es la de prueba 
                                no tenga georeferenciacion
                            */}
                            {/*
                                this.props.actualTrip.organizationId === '651d72b809e814033e3e3546' ? 
                                <View style={{ width: 320, height: 60, alignSelf: 'center' }}>
                                <TouchableOpacity   
                                    onPress={() => { this.endTrip() }} 
                                    style={styles.btnFinishing}>
                                    <Text style={styles.btnTextFiniahing}>Finalizar viaje</Text>
                                </TouchableOpacity> 
                                </View>
                                :
                                <View style={{ width: 'auto', height: 'auto', alignSelf: 'center' }}>
                                {   
                                    this.props.endTripValidation?.userInRange == "yes" //&&
                                    //this.props.endTripValidation?.lockInRange == "yes" &&
                                    //this.props.endTripValidation?.lockIsClosed == "yes" 
                                    ?
                                    <TouchableOpacity   
                                        onPress={() => { this.endTrip() }} 
                                        style={styles.btnFinishing}>
                                        <Text style={styles.btnTextFiniahing}>Finalizar viaje</Text>
                                    </TouchableOpacity> 
                                    : 
                                    <></>
                                }

                                {   
                                    this.props.buttonStartValidation ? 
                                    <TouchableOpacity 
                                        onPress={() => { 
                                            this.props.setButtonStartValidation(false), 
                                            this.props.checkLocationPermissions() 
                                        }} 
                                        style={styles.btnFinishing}>
                                        <Text style={styles.btnTextFiniahing}>Volver a validar</Text>
                                    </TouchableOpacity> : <></>
                                }

                                { 
                                    this.props.buttonStartValidation ? 
                                    <TouchableOpacity   
                                        onPress={() => { this.endTrip() }} 
                                        style={styles.btnFinishing}>
                                        <Text style={styles.btnTextFiniahing}>Finalizarrr viaje</Text>
                                    </TouchableOpacity> : <></>
                                }
                                 
                                </View>
                            */}
                            
                        </View>
                         

                        <Pressable 
                            onPress={() => { this.endTrip() }}
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$primario,
                            borderRadius : 50}}> 
                            <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Finalizar viaje</Text>
                        </Pressable>
                        
                    </View>

                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
            </>
            );
        }
        
    }
}

const estilos = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$primario,
        justifyContent: 'space-around',
        alignItems: 'center', 
        borderRadius: 1,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 10
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
        checklistlocation: state.rideReducer.checklistlocation,
        loadingEnd: state.rideReducer.loadingEnd,
        endTripValidation: state.rideReducer.endTripValidation,
        buttonStartValidation: state.rideReducer.buttonStartValidation,
        actualTrip: state.userReducer.actualTrip,  
        tripReducer: state.tripReducer,      
    }
}

function mapDispatchtoProps(dispatch) {
    return {
        setBluetoothState: (state) => dispatch(appRideActions.setBluetoothState(state)),
        setButtonStartValidation: (state) => dispatch(setButtonStartValidation(state)),
        getActiveTripChecklist: () => dispatch(getActiveTripChecklist()),
        endTrip: (trip, endStationId) => dispatch(appActions.endTrip(trip, endStationId)),
        checkLocationPermissions: () => dispatch(checkLocationPermissions()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchtoProps
)(VerificationsScreent);
