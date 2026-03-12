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

export function WeatherComponent(props){   
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchWeather = async () => {
          try {
            const apiKey = 'e2775e8b77e1a6489704ce9db6581a3e'; // Reemplaza con tu clave de API
            const url = `https://api.openweathermap.org/data/2.5/weather?q=Bogota&appid=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json(); // Convierte la respuesta en JSON
            console.log('data', data);
            setWeather(data);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        };
    
        fetchWeather();
    }, []);

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (!weather) {
        return <Text>Error al cargar los datos del clima.</Text>;
    }

    return (
        <View style={styles.subcajaIndicadoress}>
            <View style={styles.row_}> 
                <Text style={styles.textCaja}>
                    Clima { weather.name }
                </Text>                               
            </View>
            <View style={styles.cajaInfo}>
                <View style={[styles.cajaInternaInfo]}
                >
                    <Image source={Images.vpClima} style={[styles.iconBici2, {tintColor: Colors.$adicional}]}/>
                    <Text style={styles.textos}>{Math.round(weather.main.temp - 273.15)}°C</Text>
                    <Text style={styles.textos}>{weather.weather[0].description}</Text>
                </View>
            </View>
        </View> 
    );
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
        fontSize: 14,
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
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular,
    }
})