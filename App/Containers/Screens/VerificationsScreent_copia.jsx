import { Content } from 'native-base';
import React from 'react';
import {
    Image, View, Text,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Alert,
    ScrollView
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
        console.log('vefiricando por aca en verificationsScreen')
        this.verifyBluetoothState();
        this.props.getActiveTripChecklist(); 
        /*this.props.navigation.addListener('willFocus', () => {
            console.log('bbbbbbbbbbbbbbbbbbbbbb aca estamos')
            this.props.getActiveTripChecklist();          
        });*/
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
    navigateTravelExperienceScreen = () => {
        this.props.navigation.navigate('travelExperienceScreen')
    }

    endTrip(){
        console.log("endTrip VerificationsScreent", this.props);
        let actualTrip = this.props.actualTrip;
        let checklistlocation = this.props.checklistlocation;
        if(actualTrip.id && checklistlocation.closestStationId){
            this.props.endTrip(actualTrip, checklistlocation.closestStationId);
        }else {
            Alert.alert("Error", "Error terminando viaje, contacta soporte");
            //this.props.endTrip(actualTrip, checklistlocation.closestStationId);
        }
    }

    renderEndLoading() {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: 'Aldo-SemiBold' }}>Estamos finalizando tu viaje...</Text>
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
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.5)', margin: 30 }}>
                    <ScrollView style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', width: 100, height: 70, borderRadius: 15 }}>
                                {/* Image of boy on bicycle */}
                                <Image style={{ width: 65, height: 60 }} source={Images.finishing2} />
                            </View>
                            <Text style={{
                                fontSize: 25, fontFamily: Fonts.$poppinsregular,
                                fontWeight: 'normal', color: '#a4a4a4'
                            }}>Finalizando viaje</Text>
                            <View style={styles.greenBar} />

                            {/* validation message */}
                            <Text style={styles.textCenter}>Asegura la bici al bicicletero con la guaya y cierra el candado. Estamos comprobando que todo esté en orden para realizar la entrega.</Text>

                            {/* First validation message */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                <Text style={styles.textNumber}>1. </Text>
                                <Text style={styles.textValidation}>Tú estás en el perímetro de la bicicleta.</Text>
                                {
                                    /* Validation to set one of the icon states */
                                    this.props.endTripValidation?.userInRange == "yes" ?
                                        <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconOk}></Image> :
                                        this.props.endTripValidation?.userInRange == "no" ?
                                            <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconBad}></Image> :
                                            this.props.endTripValidation?.userInRange == "loading" ?
                                                <ActivityIndicator style={{ width: 50, height: 50, marginRight: 20 }} size="large" /> : <></>
                                    
                                }
                            </View>

                            {/* Second validation message */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                <Text style={styles.textNumber}>2. </Text>
                                <Text style={styles.textValidation}>La bicicleta está en el perímetro de la estación.</Text>
                                {
                                    /* Validation to set one of the icon states */
                                    this.props.endTripValidation?.lockInRange == "yes" ?
                                        <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconOk}></Image> :
                                        this.props.endTripValidation?.lockInRange == "no" ?
                                            <Image style={{ resizeMode: "contain", width: 50, height: 50, marginRight: 20 }} source={Images.iconBad}></Image> :
                                            this.props.endTripValidation?.lockInRange == "loading" ?
                                                <ActivityIndicator style={{ width: 50, height: 50, marginRight: 20 }} size="large" /> : <></>
                                }
                            </View>

                            {/* Third validation message */}
                           
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, width: 290 }}>
                                <Text style={styles.textNumber}>3. </Text>
                                <Text style={styles.textValidation}>El candado de la bicicleta está cerrado.</Text>
                                {
                                    /* Validation to set one of the icon states */
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

                            {/* Alert message in red */}
                            <Text style={[styles.textCenter, styles.colorRed]}>Asegúrate de cumplir con todos los requisitos antes de realizar la entrega.</Text>

                            {/* End trip button or revalidate */}
                            <View style={{ width: 320, height: 60, alignSelf: 'center' }}>
                                {   
                                    this.props.endTripValidation?.userInRange == "yes" &&
                                    this.props.endTripValidation?.lockInRange == "yes" &&
                                    this.props.endTripValidation?.lockIsClosed == "yes" ?
                                    <TouchableOpacity   
                                        onPress={() => { this.endTrip() }} 
                                        style={styles.btnFinishing}>
                                        <Text style={styles.btnTextFiniahing}>Finalizar viaje</Text>
                                    </TouchableOpacity> : <></>
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

                                { /*  
                                    this.props.buttonStartValidation ? 
                                    <TouchableOpacity   
                                        onPress={() => { this.endTrip() }} 
                                        style={styles.btnFinishing}>
                                        <Text style={styles.btnTextFiniahing}>Finalizar viaje</Text>
                                    </TouchableOpacity> : <></>
                                 */}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
            </>
            );
        }
        
    }
}
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
