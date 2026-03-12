import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

export default function DetallesProducto(){
    return (
        <View style={styles.card}>
            <Image source={{ uri: 'https://bincolombiasas.com/cdn/shop/products/1_9a7dadf6-f6d6-4b59-821e-2d42fe89ae6c.jpg?v=1680291811' }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>Maleta de viaje</Text>
                <View style={styles.row}>
                    <Text style={styles.level}>Nivel 1</Text>
                    <Text style={styles.points}>Puntos 340</Text>
                </View>
                <View style={styles.separator} />
                <Text style={styles.descriptionTitle}>Información</Text>
                <Text style={styles.description}>Linda maleta roja de viaje</Text>
                <Pressable style={styles.button} onPress={console.log('reclamado')}>
                    <Text style={styles.buttonText}>Reclamar</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginHorizontal: 20,
        marginVertical: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    level: {
        fontSize: 14,
        color: '#666',
    },
    points: {
        fontSize: 14,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#DDD',
        marginVertical: 10,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#E30613',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

