import { Content } from 'native-base';
import React, { useState, useEffect, useContext } from 'react';
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
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { validateForgotPassword } from '../../Utils/validation';
import styles from './Styles/VerificationsScreent.style';
import { appActions } from '../../actions/actions';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { 
    appRideActions, 
    checkLocationPermissions, 
    getActiveTripChecklist, 
    setButtonStartValidation 
} from '../../actions/rideActions';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { useDispatch } from 'react-redux';

function VerificationsScreent (props){
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    useEffect(() =>{
        console.log("props.tripReducer.newTrip", props.tripReducer.newTrip);
        dispatch(getActiveTripChecklist());
        endTrip__();
        setTimeout(() => {
            setLoading(true);
        }, 10000);
    }, []);

    const endTrip__ = () => {
        if(props.tripReducer.newTrip[0]){
            let actualTrip = props.tripReducer.newTrip[0];
            dispatch(appActions.endTrip(actualTrip, actualTrip.startStationId));
        }else if(props.tripReducer.newTrip){
            let actualTrip = props.tripReducer.newTrip;
            dispatch(appActions.endTrip(actualTrip, actualTrip.startStationId));
        }else {
            Alert.alert("Error", "Error terminando viaje, contacta soporte");
        }
    }

    return (
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
                
                {   
                loading ?
                    <TouchableOpacity   
                        onPress={() => endTrip__() } 
                        style={styles.btnFinishing}>
                        <Text style={styles.btnTextFiniahing}>Continuar</Text>
                    </TouchableOpacity>
                : null
                }
            </View> 
        </View>
    </View>
    )
    
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
        zIndex: 1000,
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

export default connect(mapStateToProps)(VerificationsScreent);

