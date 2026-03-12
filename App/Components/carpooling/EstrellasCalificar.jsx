import React, { useState } from 'react';
import { Image, View, StyleSheet, Pressable, Text } from 'react-native';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';


export function Estrellascalificar({ calificacion, setCalificacion }) {
    const handlePress = (valor) => {
        setCalificacion(valor);
    };
    return (
        <View style={estilos.contenedor}>
            <View style={estilos.cajaStarts}>
                {[1, 2, 3, 4, 5].map((valor) => (
                    <Pressable key={valor} onPress={() => handlePress(valor)}>
                        <Image
                            source={calificacion >= valor ? Images.vpcal1 : Images.vpcal2}
                            style={estilos.estrella}
                        />
                    </Pressable>
                ))}
            </View>
            <Text style={estilos.textoCalificacion}>
                {calificacion > 0
                    ? `¡Has seleccionado ${calificacion} ${calificacion === 1 ? 'estrella' : 'estrellas'}!`
                    : 'Selecciona una calificación'}
            </Text>
        </View>
    );
}
const estilos = StyleSheet.create({
    contenedor: {
        alignItems: 'center',
        marginTop: 20,
    },
    cajaStarts: {
        width: 150,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    estrella: {
        width: 30,
        height: 30,
        marginHorizontal: 2,
    },
    textoCalificacion: {
        fontSize: 17,
        color: Colors.$texto,
        marginTop: 10,
        fontFamily: Fonts.$poppinsregular,
    },
});