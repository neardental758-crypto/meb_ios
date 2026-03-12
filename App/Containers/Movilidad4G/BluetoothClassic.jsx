import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
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
import { connect, useDispatch } from 'react-redux';
import { AuthContext } from '../../AuthContext';
//import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import LottieView from 'lottie-react-native';
import { Env } from "../../Utils/enviroments"; 
//const DEVICE_ID = '00:22:05:00:27:64'; // Dirección MAC de tu HC-05
//const password = '1234'; // Reemplaza "1234" con tu contraseña actual

const BluetoothClassic = (props) => {
    
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
    row_ : {
        width: Dimensions.get('window').width*.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 30
    },
    column_: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height: Dimensions.get('window').height*.4,
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
        width: Dimensions.get('window').width*.8,
        textAlign: 'center'
    }
});

function mapStateToProps(state) {
    return {
      dataUser: state.userReducer,
      dataRent: state.reducer3G,
    }
}

export default BluetoothClassic;
