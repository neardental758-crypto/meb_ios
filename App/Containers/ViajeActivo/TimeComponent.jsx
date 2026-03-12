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
import LottieView from 'lottie-react-native';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';

export function TimeComponent(props){   
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);   
    const [modal, setModal] = useState(false);   

    const modalClima = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
                height: 20,
            }}>
                <Modal transparent={true} animationType="slide">
                    <View style={{ backgroundColor: Colors.$texto80, flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 3, borderRadius: 20, marginVertical: 150, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 20 }}>                            

                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto80,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 22,
                                margin: 5,
                                zIndex: 100
                            }}
                            >Clima { weather.name }</Text>

                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_clima.json')} autoPlay loop 
                                style={{
                                  width: Dimensions.get('window').width,
                                  height: Dimensions.get('window').width*.5              
                                }}/>
                            </View>  
                            <Text style={styles.textos2}>
                                {Math.round(weather.main.temp - 273.15)}°C
                            </Text>
                            <View style={{
                                width: Dimensions.get('window').width*.6,
                                alignItems: 'flex-start'
                            }}>
                                
                                <Text style={styles.textos3}>Humedad {Math.round(weather.main.humidity)} %</Text>
                                <Text style={styles.textos3}>Nubes {Math.round(weather.clouds.all)} %</Text>
                                <Text style={styles.textos3}>Visibilidad {Math.round(weather.visibility/1000)} Kms</Text>
                                <Text style={styles.textos3}>{weather.weather[0].description}</Text>
                            </View>                   

                            <Pressable  
                                onPress={() => { setModal(false)}}
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    backgroundColor: Colors.$secundario20,
                                }}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Image 
                                        source={Images.x_icon} 
                                        style={{
                                            width: 50,
                                            height: 50,
                                        }}
                                    />
                                </View>
                            </Pressable>                             
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

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
            { modal ? modalClima() : <></>}
            <View style={styles.row_}> 
                <Text style={styles.textCaja}>
                    Clima { weather.name }
                </Text>                               
            </View>
            <Pressable
                onPress={() => setModal(true)}
            >
            <View style={styles.cajaInfo}>
                <View style={[styles.cajaInternaInfo]}
                >
                    <Image source={Images.vpClima} style={[styles.iconBici2, {tintColor: Colors.$adicional}]}/>
                    <Text style={styles.textos}>{Math.round(weather.main.temp - 273.15)}°C</Text>
                    {/*<Text style={styles.textos}>{weather.weather[0].description}</Text>*/}
                </View>
            </View>
            </Pressable>
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
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular,
    },
    textos2: {
        color: Colors.$texto,
        fontSize: 30,
        fontFamily: Fonts.$poppinsmedium,
    },
    textos3: {
        color: Colors.$texto,
        fontSize: 20,
        fontFamily: Fonts.$poppinsregular,
    }
})