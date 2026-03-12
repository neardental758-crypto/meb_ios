import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Modal, 
  Button,
  ScrollView,
  Pressable
} from 'react-native';
import Images from '../../Themes/Images';
import {
    buscarPuntos,
    misViajes
} from '../../actions/actions3g';
import React, { useState, useEffect } from 'react';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { connect } from 'react-redux';
import estilos from './styles/historial.style';
import Colors from '../../Themes/Colors';
import {Dimensions} from 'react-native';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';
import { refreshToken } from '../../Services/refresh.service';

function HistorialScreen (props) {

    const dispatch = useDispatch();
    const [verViajes, setVerViajes] = useState(false);
    const [vehiculoparticular, setVehiculoparticular] = useState(false);
    const [viajes3g, setViajes3g] = useState(false);
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);

    const home = () => {
        RootNavigation.navigate('Home')
    }

    const verState = () => {
        console.log('ver state actualizado', props.dataRent)
    }
    const animacion = (h, o, est, tipo) => {
        height.value = withSpring(h);
        opacity.value = withSpring(o);
        setVerViajes(est)

        if (tipo === 'vp') {
            setVehiculoparticular(true);
            setViajes3g(false);
        }else if (tipo === '3g'){
            setVehiculoparticular(false);
            setViajes3g(true);
        }else if (tipo === 'ninguno'){
            setVehiculoparticular(false);
            setViajes3g(false);
        }

    }

    useEffect(() => {
        refreshToken();
        //dispatch(buscarPuntos())
        //dispatch(misViajes())
    },[])

    return (
        <View>
            <View style={estilos.boxBtns}>
                <Pressable  
                    onPress={() => { home() }}
                    style={ estilos.btnAtras }>
                    <View style={estilos.cajaTextVehiuclos}>
                        <Image source={Images.home} style={[estilos.iconBici2, {tintColor : 'white'}]}/> 
                    </View>
                </Pressable>
            </View>

            

            <View style={estilos.contenedor}> 
            <Text style={{
                textAlign: 'center',
                fontSize: 24,
                marginBottom: 20,
                position: 'absolute',
                top: 0,
                backgroundColor: Colors.$primario,
                color: Colors.$blanco,
                width: '100%',
                height: 100,
                justifyContent: 'center',
                flex: 1,
                paddingTop: 30
            }}>Historial</Text>
                <View style={estilos.cajaInfo}> 

                    <View style={estilos.subCajaInfo}>
                        <Text style={estilos.texto1}>Viajes</Text>
                        {/*<Text style={estilos.texto2}>{Number(props.dataRent.viajesTotalVP + props.dataRent.viajesTotal3G)}</Text>*/}
                        <Text style={estilos.texto2}>12</Text> 
                        <View style={estilos.cajaBtnTransition}>
                        <Pressable
                            onPress={()=>{  
                                animacion(500, 1, true, 'vp')
                            }}
                            style={ estilos.btnver }
                        >   
                            <Text style={ estilos.textoBtnVer}>
                                Conductor = {Number(7)}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={()=>{  
                                animacion(500, 1, true, '3g')
                            }}
                            style={ estilos.btnver }
                        >   
                            <Text style={ estilos.textoBtnVer}>
                                Pasajero = {Number(5)}
                            </Text>
                        </Pressable>
                        </View>
                    </View>
                </View>

            
                <Animated.View 
                    style={{ 
                        ...estilos.cajaViajes,
                        height,
                        opacity
                    }}
                >
                    
                    <ScrollView>
                    {/*
                        props.dataRent.viajesVpcargados && props.dataRent.viajes3Gcargados ? 
                        <>
                        {
                            verViajes ?
                            <>
                            <Pressable
                                onPress={()=>{  
                                    animacion(0, 0, false, 'ninguno')
                                }}
                                style={ estilos.btnCerrar }
                            >   
                                <Text style={ estilos.textoBtnVer}>❌</Text>
                            </Pressable>
                            {
                                vehiculoparticular ? 
                                <>
                                {
                                    props.dataRent.viajesVP.map((data) => 
                                        <View style={estilos.cajaItemViaje}>
                                            <View style={estilos.tituloItem}>
                                                <Text style={estilos.tituloItemText}>{data.via_hora_inicio}</Text> 
                                            </View>
                                            <View style={estilos.cajaItemViajeRow}>
                                                <View style={estilos.cajaSubItem}>
                                                    <Text>Transporte:</Text> 
                                                    <Text>{data.via_vehiculo}</Text>   
                                                </View>
                                                <View style={estilos.cajaSubItem}>
                                                    <Text>Duración</Text>   
                                                    <Text>{data.via_duracion} min</Text>   
                                                </View>
                                                <View style={estilos.cajaSubItem}>
                                                    <Text>Distancia</Text>   
                                                    <Text>{data.via_kilometros} kms</Text>   
                                                </View>  
                                            </View>
                                        </View>
                                    ) 
                                }
                                </>
                                :
                                <></>
                            }

                            {
                                viajes3g ? 
                                <>
                                {
                                    props.dataRent.viajes3G.map((data) => 
                                        <View style={estilos.cajaItemViaje}>
                                            <View style={estilos.tituloItem}>
                                                <Text style={estilos.tituloItemText}>{data.pre_devolucion_fecha}</Text> 
                                            </View>
                                            <View style={estilos.cajaItemViajeRow}>
                                                <View style={estilos.cajaSubItem}>
                                                    <Text>Transporte:</Text> 
                                                    <Text>{data.pre_bicicleta}</Text>   
                                                </View>
                                                <View style={estilos.cajaSubItem}>
                                                    <Text>Duración</Text>   
                                                    <Text>{data.pre_duracion} min</Text>   
                                                </View>
                                                <View style={estilos.cajaSubItem}>
                                                    <Text>Estación</Text>   
                                                    <Text>{data.pre_retiro_estacion}</Text>   
                                                </View>  
                                            </View>
                                        </View>
                                    ) 
                                }
                                </>
                                :
                                <></>
                            }
                            </>
                            :
                            <></>
                        }
                        
                        </>
                        :
                        <Text></Text>
                    
                    */}

                    </ScrollView>
                </Animated.View>
                
                

                <View style={estilos.cajaInfo}> 
                    <View style={estilos.subCajaInfo}>
                        <Text style={estilos.texto1}>Puntos</Text>
                        <Text style={estilos.texto2}>24</Text> 
                    </View>
                </View>

                <View style={estilos.cajaInfo}> 
                    <View style={estilos.subCajaInfo}>
                        <Text style={estilos.texto1}>Kilometros</Text>
                        <Text style={estilos.texto2}>225.6</Text> 
                    </View>
                </View>

                <View style={estilos.cajaInfo}> 
                    <View style={estilos.subCajaInfo}>
                        <Text style={estilos.texto1}>Actividades</Text>
                        <Text style={estilos.texto2}>12</Text> 
                    </View>
                </View>

                
                
            </View>    
            
        </View>
    );
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
    }
}

export default connect(mapStateToProps)(HistorialScreen);


