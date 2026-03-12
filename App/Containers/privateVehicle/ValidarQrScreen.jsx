import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    PermissionsAndroid,
    Platform,
    ScrollView,
} from 'react-native';
import { saveDocumentUser } from '../../actions/actions';
import { saveFotoTicket } from '../../actions/actions3g';
import { launchCamera } from 'react-native-image-picker';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import Colors from '../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import estilos from './styles/transPublico.style';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';

const options = {
    title: 'Foto del ticket de viaje',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        mediaType: 'photo',
    },
    quiality: 0.6
};


function AvionScreen(props){

    const { infoUser } = useContext( AuthContext );
    const dispatch = useDispatch();
   
    const verState = () => { 
        console.log('EL STATE ACT::::: ', state )
    }

    const verState2 = () => { 
        console.log('EL STATE ACT::::: ', props) 
        console.log('MY VEHICLES::::: ', props.dataRent.myVehiclesVP) 
    }

    const atras = () => {
        RootNavigation.navigate('VehiculoParticular');
    }

    const irAviaje = () => {
       RootNavigation.navigate('StartTripScreen');
    }

    const permissions = async () => {
        if (Platform.OS == 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                    showPhotoPickerCamera();
                } else {
                    setTimeout(function () {
                        Alert.alert("Alerta", "por favor acepte permisos para tomar la foto")
                    }, 100)
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            showPhotoPickerCamera();
        }
    }

    /*const showPhotoPickerCamera = () => {
        launchCamera(options, (response) => {  
            dispatch(saveFotoTicket(response));  
            console.log('DATA FOTO:::',response);
            console.log('URL DE LA FOTO:::',response.assets[0].uri);
        });
    }*/

    const showPhotoPickerCamera = () => {
        launchCamera(options, (response) => { // Use launchImageLibrary to open image gallery

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error || response.errorCode) {
                console.log('ImagePicker Error: ', response);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log("selecciona", response)
                dispatch(saveFotoTicket(response)); 
                handleCloseButtonPress();
            }
        });
    }
    const handleCloseButtonPress = () => {
        const { onClosePress } = props;
        if (onClosePress) {
            onClosePress();
        }
    }

    
    useEffect(() => {    
        //showPhotoPickerCamera()
    },[])

   
    return (
        
        <ImageBackground source={Images.grayBackground} style={estilos.generales}>
            <SafeAreaView style={estilos.safeArea}>
                <ScrollView>
                    <View style={estilos.contenedor}>
                        <View style={estilos.contentTop}>
                            
                            <TouchableOpacity onPress={() => { atras() }} style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 10, backgroundColor : Colors.$primario}}>
                                <View >
                                    <Image style={{marginLeft: moderateScale(10), width : horizontalScale(350), height : verticalScale(55)}} source={Images.flechaAtras} />
                                </View>
                            </TouchableOpacity>
                        
                        </View>

                        <Text style={estilos.subTitle}>Por favor toma una foto del vehículo</Text>
                        {
                            props.dataRent.ticketUser.assets && props.dataRent.ticketUser.assets.length > 0
                            ?
                            <Image source={{ uri: props.dataRent.ticketUser?.assets[0]?.uri }}
                                    style={{ width: 300, height: 400, borderRadius: 20, marginBottom: 20 }} 
                            />                                    
                            :
                            <View ></View>
                        }
                            

                        <TouchableOpacity  onPress={() => { permissions() }}>
                            <View style={estilos.btnNext}>
                                <Text style={estilos.textBtnNext}>Tomar foto</Text>
                            </View>
                        </TouchableOpacity>

                        {
                            props.dataRent.ticketUser.assets && props.dataRent.ticketUser.assets.length > 0
                            ?
                            <TouchableOpacity  onPress={() => { irAviaje() }}>
                                <View style={estilos.btnNext}>
                                    <Text style={estilos.textBtnNext}>Siguiente</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <></>
                        }

                        
                    </View>
                    
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
    
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        documentUser: state.userReducer.documentUser,
    }
}

export default connect(mapStateToProps)(AvionScreen);