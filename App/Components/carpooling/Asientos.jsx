import React, { useState } from 'react';
import Colors from '../../Themes/Colors';
import { useDispatch } from 'react-redux';
import { asientoSelect, clearAsiento } from '../../actions/actionCarpooling';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export function Asientos(props) {
    const dispatch = useDispatch();
    const { nPuestoSelect, asientos } = props;
    
    const cambiarEstado = async (valor) => {
        if (asientos === valor) return;
        nPuestoSelect(valor);
        await dispatch(clearAsiento());
        await dispatch(asientoSelect(valor));
    }

    const renderButton = (valor, index) => {
        const isSelected = asientos === valor;
        return (
            <Pressable 
                key={index}
                onPress={() => cambiarEstado(valor)} 
                style={isSelected ? styles.btnPrimario : styles.btnSecundario}>
                <Text style={isSelected ? styles.textoPrimario : styles.textoSecundario}>
                    {valor}
                </Text>  
            </Pressable>
        );
    }

    return (
        <View style={styles.boxCenter}>
            {[1, 2, 3, 4].map((valor, index) => renderButton(valor, index))}
        </View>
    );
}

const styles = StyleSheet.create({
    boxCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrimario: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        backgroundColor: Colors.$primario,
    },
    textoPrimario: {
        color: Colors.$blanco,
        fontSize: 20,
    },
    btnSecundario: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        backgroundColor: Colors.$secundario80,
    },
    textoSecundario: {
        color: Colors.$texto,
        fontSize: 20,
    },
});
