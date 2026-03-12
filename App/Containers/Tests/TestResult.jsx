import {
    Text,
    View,
    StyleSheet,
    Pressable,
    Image,
    ScrollView,
    Modal,
    Dimensions,
    Button
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import Colors from '../../Themes/Colors';
  import Fonts from '../../Themes/Fonts';
  import Images from '../../Themes/Images';
  import LottieView from 'lottie-react-native';
  import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
  import * as RootNavigation from '../../RootNavigation';

  const TestResult = ({ visible, result, sendTo }) => {
      
    const goBack = () => {
        RootNavigation.navigate("TheoreticalTest");
    }
    const goSchedule = () => {
        RootNavigation.navigate("ScheduleTest");
    }
    return (
        <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
      >
        <View style={estilos.container}>
            {result ? (
                <ScrollView contentContainerStyle={estilos.scrollView}>
                        <View style={{ flex: 3, borderRadius: 20, marginVertical: 150, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 20 }}>                            

                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto80,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >Felicitaciones prueba teórica aprobada exitosamente</Text>   

                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 200,
                                minHeight: 200,
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_cong.json')} autoPlay loop 
                                style={{
                                  width: Dimensions.get('window').width,
                                  height: Dimensions.get('window').width*.7              
                                }}/>
                            </View>   
                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 200,
                                minHeight: 200,
                                position: 'absolute'
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop 
                                style={{
                                  width: Dimensions.get('window').width,
                                  height: Dimensions.get('window').width            
                                }}/>
                            </View>   
                            <Pressable 
                                onPress={sendTo}
                                style={ estilos.botonItem }
                                >
                                <Text style={ estilos.textBoton }>Continuar</Text>
                            </Pressable>                                           
                        </View>
                </ScrollView>
            ) : (
                <View style={estilos.noPassContainer}>
                    <LottieView 
                        style={estilos.image} 
                        source={require('../../Resources/Lotties/bicy_error.json')} 
                        autoPlay loop />
                    <Text style={estilos.textHead}>Prueba no aprobada</Text>
                    <Text style={estilos.text}>No has pasado la prueba. Por favor, inténtalo de nuevo para acceder a los servicios.</Text>
                    <Pressable 
                        onPress={sendTo}
                        style={ estilos.botonItem }
                        >
                        <Text style={ estilos.textBoton }>Reintentar</Text>
                    </Pressable>
                </View>
            )}
        </View>     
    </Modal>
    );
  }
  const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: moderateScale(30),
    },
    image: {
        width: moderateScale(250),
        height: moderateScale(250),
        alignSelf: 'center',
    },
    textHead : {
        fontSize : moderateScale(24),
        fontWeight : 'bold'
    },
    textSuccess: {
        textAlign: 'center',
        marginBottom: moderateScale(10),
        fontSize : moderateScale(20),
        width : '75%',
        marginVertical : 30,
        paddingBottom : 30
    },
    text: {
        textAlign: 'center',
        marginBottom: moderateScale(10),
        fontSize : moderateScale(20),
        width : '85%',
        marginVertical : 30,
        paddingBottom : 30
    },
    noPassContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBoton: {
        fontSize: moderateScale(20),
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
      },
      botonItem: {
        backgroundColor: Colors.$primario,
        width: 300,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderRadius: 30,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 16,
      },
  })
  export default TestResult;