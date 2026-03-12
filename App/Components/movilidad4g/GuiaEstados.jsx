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
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

export function GuiaEstados(props){
    const { } = props;
    return (
    <View style={styles.cajaEstados}>
        <View style={styles.row}>
          <Text style={[styles.circulo, {backgroundColor: Colors.$disponible}]}></Text>
          <Text style={styles.texto1}>Disponible</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.circulo, {backgroundColor: Colors.$reservada}]}></Text>
          <Text style={styles.texto1}>Reservada</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.circulo, {backgroundColor: Colors.$prestada}]}></Text>
          <Text style={styles.texto1}>En préstamo</Text>
        </View>   
        <View style={styles.row}>
          <Text style={[styles.circulo, {backgroundColor: Colors.$taller}]}></Text>
          <Text style={styles.texto1}>Fuera de servicio</Text>
        </View>          
    </View> 
    )
}

const styles = StyleSheet.create({
    cajaEstados: {
        width: Dimensions.get('window').width*.8,
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$blanco,
        marginTop: 10,
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    row: {
        width: "50%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    texto1: {
        fontSize: 14,
        color: Colors.$texto80,
        fontFamily: Fonts.$poppinsregular
    },
    circulo: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 5,
    },
})