import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    TextInput,
    Modal, 
    Button,
    ScrollView,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import { connect, useDispatch } from 'react-redux';
import { asientoSelect, clearAsiento } from '../../actions/actionCarpooling'
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

export function Tarjeta(props){   
    
    const { icono, titulo, texto1, texto2, elcolor  } = props;

    return (
        <View style={styles.subcajaIndicadoress}>
            <View style={styles.row_}> 
                <Text style={styles.textCaja}>{titulo}</Text>                               
            </View>
            <View style={styles.cajaInfo}>
                <View style={[styles.cajaInternaInfo]}
                >
                    <Image source={icono} style={[styles.iconBici2, {tintColor: elcolor}]}/>
                    <Text style={styles.textos}>{texto1}</Text>
                </View>
            </View>
        </View> 
    )
}

const styles = StyleSheet.create({
    subcajaIndicadoress: {
        width: 140,
        height: 140,
        backgroundColor: Colors.$blanco,
        marginBottom: 30,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 7,
        borderColor: Colors.$secundario50,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    row_:{
        width: "100%",
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    barraCaja: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    textCaja: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto50,
    },
    iconBici2: {
        width: 60,
        height: 60,
    },
    cajaInfo: {        
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',    
    },
    cajaInternaInfo: { 
        width: 120,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textos: {
        color: Colors.$texto,
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular,
    }
})