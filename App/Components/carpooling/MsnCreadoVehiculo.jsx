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
import { connect, useDispatch } from 'react-redux';
import { crear_mas_veh_car } from '../../actions/actionCarpooling';

export function MsnCreadoVehiculo(){
    const dispatch = useDispatch();
    const crearmas = async () => {
        await dispatch(crear_mas_veh_car());
    }

    return (
    <View style={[styles.contentViajeSave]}>
        <Image style={styles.logoViajeSave} source={Images.carrorojo} />
        <Text style={[styles.textViajeSave]}>Vehículo creado exitosamente</Text>

        <View style={[styles.cajaBtnsViajeSave]}>
          <Pressable
            onPress={ () => crearmas() }
            style={styles.goToMapViajeSave}>
                <Text style={[styles.textButton, {color: Colors.$blanco,}]}>Crear más</Text>                
          </Pressable>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    contentViajeSave: {
        width: Dimensions.get('window').width,
        padding: 15,
        backgroundColor: Colors.$blanco,
        alignItems : 'center',
        justifyContent: 'space-around'
    },
    logoViajeSave: {
        width: 70,
        height: 70,
    },
    textViajeSave: {
        width: Dimensions.get('window').width*.5,
        textAlign: 'center',
        alignSelf: "center",
        borderRadius: 10,
        fontSize : 20,
        color: Colors.$texto,
        marginTop: 15,
        marginBottom: 15,
        fontFamily: Fonts.$poppinsregular
    },
    cajaBtnsViajeSave: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    goToMapViajeSave: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor : Colors.$primario,
        borderRadius : 15,
        width: 150,
        height: 30
    },
    textButton : {
        textAlign: "center", 
        fontSize: 20, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'black',
        fontFamily: Fonts.$poppinsregular
    },
})