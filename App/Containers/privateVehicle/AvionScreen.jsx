import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { saveDocumentUser } from '../../actions/actions';
import { saveFotoTicket } from '../../actions/actions3g';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import estilos from './styles/avion.style';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                saveImgStorage(response);
            }
        });
    }

    const showPhotoPickerGallery = () => {
        launchImageLibrary(options, (response) => { // Use launchImageLibrary to open image gallery
            console.log(response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error || response.errorCode) {
                console.log('ImagePicker Error: ', response);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log("selecciona", response)
                dispatch(saveFotoTicket(response)); 
                saveImgStorage(response);
            }
        });
    }
    const saveImgStorage = (response) => {
        AsyncStorage.setItem('fotoVP', JSON.stringify(response));
    }

    useEffect(() => {    
        //showPhotoPickerCamera()
    },[])

   
    return (  
    <View style={styles.generales}>
        <ScrollView>
            <View style={styles.contenedor}>                
                <Text style={styles.Title}>¡Ingresa tu pasabordo!</Text>
                <Text style={styles.subTitle}>Indicanos que viajes realizaras</Text>
                {
                    props.dataRent.ticketUser.assets && props.dataRent.ticketUser.assets.length > 0
                    ?
                    <Image 
                        source={{ uri: props.dataRent.ticketUser?.assets[0]?.uri }}
                        style={styles.cajaFoto} 
                    />                                    
                    :
                    <View style={styles.cajaFoto}>
                        <Image source={Images.vpaddimg} style={styles.iconAddimg}/> 
                    </View>
                }
                    
                <View style={styles.row_}>
                    <View style={styles.column_}>
                        <Pressable  
                            onPress={() => { permissions()}}
                            style={styles.btn_camara}
                        >
                            <Image source={Images.vpcamara} style={styles.iconCamara}/>     
                        </Pressable>
                        <Text style={styles.textBtnNext}>Cámara</Text>
                    </View>
                    <View style={styles.column_}>
                        <Pressable  
                            onPress={() => { showPhotoPickerGallery()}}
                            style={styles.btn_camara}
                        >
                            <Image source={Images.vpgaleria} style={styles.iconCamara}/>     
                        </Pressable>
                        <Text style={styles.textBtnNext}>Galeria</Text>
                    </View>
                </View>

                <Pressable  onPress={() => { atras() }}
                    style={ styles.btnAtras }>
                    <View>
                    <Image source={Images.atras_Icon} style={[styles.iconBici, {tintColor : 'black'}]}/> 
                    </View>
                </Pressable>

                {
                    props.dataRent.ticketUser.assets && props.dataRent.ticketUser.assets.length > 0
                    ?
                    <View style={styles.boxBtns}> 
                    <Pressable onPress={() => irAviaje() } 
                        style={{    
                        textAlign: "center",
                        alignItems: "center",
                        padding  : 5,
                        margin : 20,
                        backgroundColor : Colors.$primario,
                        borderRadius : 50}}> 
                            <Text 
                            style={[styles.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Iniciar Viaje</Text>
                    </Pressable>
                    </View>
                    :
                    <></>
                }

                
            </View>
            
        </ScrollView>
    </View>
    ); 
}

const styles = StyleSheet.create({
    generales: {
        flex: 1,
        width: '100%',
        alignItems: 'center', 
        justifyContent: 'center',
    },
    boxBtns: {
        width: Dimensions.get("window").width, 
        height: 100,
        alignItems: "center", 
        justifyContent: "space-around", 
        flexDirection: "column",
        backgroundColor: Colors.$blanco,
    },
    cajaFoto: {
        width: Dimensions.get('window').width*.9, 
        height: Dimensions.get('window').height*.55,
        marginBottom: 20,
        backgroundColor: Colors.$texto,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row_: {
        flexDirection: 'row',
        width: Dimensions.get('window').width*.8,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    column_: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_camara: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.$texto,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconCamara: {
        width: 40,
        height: 40,
    },
    contenedor:{
        flex: 1,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    cajavpmas:{
        position: 'absolute',
        zIndex: 0,
        width: "100%",
        height: "100%",
    },
    btnAtras:{
        position: 'absolute',
        top: 10, 
        left: 10,
        width: 50,
        height: 50,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        shadowColor: Colors.$texto,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7
    },
    
    btnBack: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center',
        width: 40, 
        height: 30, 
        borderRadius: 10,
        zIndex: 10,
    },
    contentTitle: { 
        flex: 1, 
        width: '100%',
    },
    title:{
        width: Dimensions.get('window').width*.7,
        fontFamily: Fonts.$sizeSubtitle,
        fontSize: 26, 
        textAlign: 'center', 
        marginBottom: 30,
        zIndex: 1,
    },
    boxPrincipalItems: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*.8, 
        marginTop: 30,
        textAlign: 'center',
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "row",
        flexWrap: "wrap",
        paddingTop: 30,
        paddingBottom: 30,
        /*shadowColor: Colors.$texto,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginBottom: 30,*/
    },
    btnVehiculos: {
        width: horizontalScale(120),
        height: verticalScale(120),
        backgroundColor: Colors.$primario,
        margin: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    iconBici: {
        width: 30,
        height: 30,
    },
    btnVehiculos2: {
        width: '90%', 
        height: 50,
        backgroundColor: Colors.$primario,
        marginBottom: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    btnVehiculosSelect: {
        width: 70, 
        height: 70,
        backgroundColor: '#40CC9A',
        margin: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    cajaTextVehiuclos: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textVehiculo: {
        fontSize: 18,
        color: Colors.$texto,
    },
    cajaImgVP: {
        position: 'absolute',
        right: -5,
        width: 90,
        height: 90,
        borderWidth: 4,
        borderColor: Colors.$blanco,
        borderRadius: 45,
        backgroundColor: Colors.$primario,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgVP: {
        width: 90,
        height: 90,
    },
    btnReg: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$primario,
        width: 300, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        zIndex: 100,
    },
    textBtnNext: {
        color: Colors.$texto,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular
    },
    Title: { 
        fontSize: 24, 
        textAlign: 'center', 
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsmedium,
    },
    subTitle: { 
        fontSize: 20, 
        textAlign: 'center', 
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsmedium,
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
})

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        documentUser: state.userReducer.documentUser,
    }
}

export default connect(mapStateToProps)(AvionScreen);