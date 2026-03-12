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
} from 'react-native';
import { 
    savePrestamo,
} from '../../actions/actions3g';
import { connect, useDispatch } from 'react-redux';
import { AuthContext } from '../../AuthContext';
//import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
const DEVICE_ID = '00:22:05:00:27:64'; // Dirección MAC de tu HC-05
//const password = '1234'; // Reemplaza "1234" con tu contraseña actual

const BluetoothClassic = (props) => {
    
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row_ : {
        width: Dimensions.get('window').width*.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    column_: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height: Dimensions.get('window').height*.3,
        width: Dimensions.get('window').width
    },
    btnConect: {
        width: 120,
        height: 'auto',
        padding: 10,
        borderRadius: 20,
        backgroundColor: Colors.$adicional,
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
        fontSize: 18,
        color: Colors.$texto80,
        width: Dimensions.get('window').width*.6,
        textAlign: 'center'
    }
});

function mapStateToProps(state) {
    return {
      dataUser: state.userReducer,
      dataRent: state.reducer3G,
    }
}
export default connect(mapStateToProps)(BluetoothClassic);

