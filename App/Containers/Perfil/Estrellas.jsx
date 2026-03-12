import React from 'react';
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
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

export function Estrellas(props){
    const { calificacion } = props;
    return (
    <View style={estilos.cajaStarts}>
        <Image source={ calificacion >= 1 ? Images.vpcal1 : Images.vpcal2} style={estilos.estrella}/>
        <Image source={ calificacion >= 2 ? Images.vpcal1 : Images.vpcal2} style={estilos.estrella}/>
        <Image source={ calificacion >= 3 ? Images.vpcal1 : Images.vpcal2} style={estilos.estrella}/>
        <Image source={ calificacion >= 4 ? Images.vpcal1 : Images.vpcal2} style={estilos.estrella}/>
        <Image source={ calificacion == 5 ? Images.vpcal1 : Images.vpcal2} style={estilos.estrella}/>
    </View>
    )
}

const estilos = StyleSheet.create({
    cajaStarts: {
        width: 120,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 10,
    },
    estrella: {
        width: 40,
        height: 40,
    }
})