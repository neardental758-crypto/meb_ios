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
        justifyContent: 'space-between',
    },
    row_:{
        width: "100%",
        height: 'auto',
        backgroundColor: Colors.$secundario50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        borderRadius: 20
    },
    barraCaja: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    textCaja: {
        fontSize: 12,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto,
        paddingLeft: 5
    },
    iconBici2: {
        width: 50,
        height: 50,
    },
    cajaInfo: {        
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$secundario20       
    },
    cajaInternaInfo: { 
        width: 120,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textos: {
        color: Colors.$texto,
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
    }
})