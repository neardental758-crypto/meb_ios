import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Pressable
} from 'react-native';
import {
    horas_parqueo
} from '../../actions/actionParqueadero';
import Images from '../../Themes/Images';
import {Dimensions} from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';

function Horas(props){

    const { infoUser } = useContext( AuthContext );
    const dispatch = useDispatch();
    const [isChecked, setIsChecked] = useState('');
    const [horaSelect, setHoraSelect] = useState('');

    const toggleCheck = (id) => {
        setIsChecked(id);
    };
    
    const atras = async () => {
        await RootNavigation.navigate('Home_electrohub');
    }

    const continuar  = () => {
        console.log('horas seleccionadas', horaSelect)
        dispatch(horas_parqueo(horaSelect));
    } 

     useEffect(() => {
        if (props.dataParqueo.horasSeleccionadasParqueo) {
            RootNavigation.navigate('Rentar_parqueo');
        }
    },[props.dataParqueo.horasSeleccionadasParqueo])
   
    return (        
    <View style={styles.generales}>
        <ScrollView>
        <View style={styles.cajaCabeza}>
            <Pressable  
                onPress={() => { atras() }}
                style={ styles.btnAtras }>
                <View>
                <Image source={Images.IconoAtrasParqueo} style={[styles.iconMenu]}/> 
                </View>
            </Pressable>
            <View style={ styles.cajaTitle}>
                <Text style={styles.title}>Horas
                </Text>
                <Text style={styles.subtitle}>Seleccione las horas que va a ocupar el parqueadero</Text>
            </View>               
        </View>

        <View style={styles.safeArea}>
            <View style={styles.contenedor}>
                <View
                style={{
                    width: Dimensions.get('window').width,
                    alignItems: 'center'
                }}>

                {[1,2,3,4,5,6].map((hora) => (
                    <View key={hora} style={styles.btnVehiculos}>
                    <View style={styles.cajaTextVehiuclos}>
                        <View style={{ 
                        width: '60%',
                        height: '100%',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        }}>
                        <Text style={styles.textVehiculo}>{hora} hora{hora > 1 ? 's' : ''}</Text>
                        </View>   
                        <View style={styles.CajaHorCenter}>
                        { isChecked === hora ?
                            <Pressable
                            onPress={() => {
                                toggleCheck('');
                                setHoraSelect('');
                            }}
                            style={styles.btnCheckOK}
                            />
                            :
                            <Pressable
                            onPress={() => {
                                toggleCheck(hora);
                                setHoraSelect(hora);
                            }}
                            style={styles.btnCheck}
                            />
                        }
                        </View>      
                    </View>
                    </View>
                ))}

                </View>
            </View>

            {
                isChecked !== '' && horaSelect !== '' ?
                <View style={styles.boxBtns}>   
                <Pressable onPress={() => continuar() } 
                    style={{    
                    textAlign: "center",
                    padding: 10,
                    margin: 20,
                    backgroundColor: Colors.$parqueo_color_primario,
                    borderRadius: 50
                    }}> 
                    <Text style={[styles.textButton, {width: 250, color: Colors.$blanco, fontFamily: Fonts.$poppinsregular}]}>Continuar</Text>
                </Pressable>
                </View>  
                :
                <View style={styles.boxBtns}>   
                <Pressable onPress={() => console.log('continuar') } 
                    style={{    
                    textAlign: "center",
                    padding: 10,
                    margin: 20,
                    backgroundColor: Colors.$secundario,
                    borderRadius: 50
                    }}> 
                    <Text style={[styles.textButton, {width: 250, color: Colors.$texto, fontFamily: Fonts.$poppinsregular}]}>Continuar</Text>
                </Pressable>
                </View>
            }
        </View>


        </ScrollView>
    </View>
    );
    
}

const styles = StyleSheet.create({
    generales: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: Colors.$negro
    },
    contenedor:{
        flex: 1,
        paddingTop: 30,
        width: Dimensions.get('window').width,
        backgroundColor: Colors.$negro
    },
    
    
    safeArea: {
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height*.75,
        alignItems: 'center',
        backgroundColor: Colors.$negro
    },
    
    btnCheckOK: {
        width: 20,
        height: 20,
        borderWidth : 1,
        borderColor : Colors.$blanco,
        borderRadius : 100,
        backgroundColor: Colors.$parqueo_color_adicional,
        marginRight: 5,
    },
    btnCheck: {
        width: 20,
        height: 20,
        borderWidth : 1,
        borderColor : Colors.$blanco,
        backgroundColor: Colors.$texto20,
        borderRadius : 100,
        marginRight: 5,
    },
    CajaHorCenter:{
        flexDirection: 'row',
        alignItems:'right',
        marginTop:5,
    },
    cajaCabeza: {
        backgroundColor: Colors.$negro,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height*.2,
        width: Dimensions.get('window').width,
        position: 'relative',
        zIndex: 100,
    },
    cajaTitle: {
        width: Dimensions.get('window').width*.8,
        position: 'absolute',
        bottom: 0,
    },
    title: {
        width: Dimensions.get('window').width*.8,
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 22,
        textAlign: 'left',
        color: Colors.$parqueo_color_texto,
    },
    subtitle: {
        fontFamily: Fonts.$poppinsregular,
        width: Dimensions.get('window').width*.7,
        fontSize: 16,
        textAlign: 'left',
        color: Colors.$parqueo_color_texto_80,
    },
    btnAtras:{
        position: 'absolute',
        top: 20, 
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    
    btnVehiculos: {
        width: Dimensions.get('window').width*.8,
        height: 60,
        backgroundColor: Colors.$negro,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        shadowColor: Colors.$texto,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 1.29,
        shadowRadius: 1.65,
        elevation: 2,
    },
    cajaTextVehiuclos: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 40,
    },
    
    textVehiculo: {
        fontSize: 20,
        color: Colors.$parqueo_color_texto,
        textAlign: 'center',
        fontFamily: Fonts.$poppinsregular,
    },
    boxBtns: {
        width: Dimensions.get("window").width, 
        alignItems: "center", 
        justifyContent: "space-around", 
        flexDirection: "column",
    },
    textButton : {
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        fontSize: 20, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'white',
        color: Colors.$blanco,
        alignSelf: "center",
    },
})

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        dataParqueo: state.reducerParqueadero,
        documentUser: state.userReducer.documentUser,
    }
}

export default connect(mapStateToProps)(Horas);