import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    TextInput
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    saveComentarioParqeuo,
    resetParqueo,
    horas_parqueo
} from '../../actions/actionParqueadero';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';
import LottieView from 'lottie-react-native';
import { Estrellas } from './Estrellas';
import { v4 as uuidv4 } from 'uuid';

function Calificar_parqueadero(props) {
    const dispatch = useDispatch();
    const { infoUser } = useContext(AuthContext);
    const [tiempoRestante, setTiempoRestante] = useState(null);
    const [vencido, setVencido] = useState(false);
    const dataParqueo = props.dataParqueo.parqueo_activo[0];
    const fechaInicio = new Date(dataParqueo.fecha); 
    const fechaVencimiento = new Date(fechaInicio.getTime() + 4 * 60 * 60 * 1000); // Sumamos 4 horas
    const [calificacion, setCalificacion] = useState(0);
    const [comentario, setComentario] = useState('Sin comentario');

    const calificacionSelect = (valor) => {
        setCalificacion(valor);
    };

    const toggleCheckBox = (value) => {
        setIsChecked(value);
    };

    const guardarComentario = async () => {
        console.log("la calificacion es :", calificacion)
        console.log('data parqueo en calificacion', dataParqueo)
        
        const dataComentario= {
            "id": uuidv4(),
            "usuario": dataParqueo.usuario,
            "renta_parqueo": dataParqueo.id,
            "fecha": new Date().toJSON(),
            "comentario": comentario,
            "calificacion": calificacion
        }
        console.log('la data para guardar comentario :', dataComentario);
        await dispatch(saveComentarioParqeuo(dataComentario));
        await dispatch(horas_parqueo(4, false));
    }

    const inicioParqueo = async () => { 
        await setCalificacion(0);
        await setComentario('');
        await RootNavigation.navigate('Home');
        await dispatch(resetParqueo());
    }

    useEffect(() =>{
        console.log('entrando al efecto para reset parqueo antes del if', props.dataParqueo.okComentarioParqueo)
        if (props.dataParqueo.okComentarioParqueo) {
            console.log('entrando al efecto para reset parqueo')
            inicioParqueo();
        }
    },[props.dataParqueo.okComentarioParqueo])

    return (
        <SafeAreaView style={styles.contenedor}>
            <ScrollView>
                 
            <View style={stylesModal.contenedor}>
                <Text style={stylesModal.titulo}>¡Felicitaciones!</Text>
                <Text style={stylesModal.texto}>¡Gracias por elegirnos! Estaremos felices de verte de nuevo.</Text>
                    <View style={{
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: Dimensions.get('window').width,
                        height: 'auto', 
                        position: 'relative',
                    }}>
                        <LottieView source={require('../../Resources/Lotties/Confirmed.json')} autoPlay loop 
                        style={{
                        width: 150,
                        height: 150              
                        }}/>
                    </View> 
                    
                    <View style={stylesModal.cajaCalificacion}>
                        <Text style={stylesModal.titulo}>Califica tu experiencia</Text>
                        <Estrellas size={50} calificacionSelect={calificacionSelect}/>
                        <Text style={[stylesModal.texto, {color: Colors.$parqueo_color_texto_50}]}>Deja tu comentario</Text>  
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            placeholder='Tus comentarios son valiosos (opcional)'
                            placeholderTextColor={Colors.$parqueo_color_fondo_50}
                            style={ stylesModal.input }
                            onChangeText={text => setComentario(text)}
                            underlineColorAndroid="transparent"
                        /> 
                    </View>

                    {
                        <>
                        {
                            calificacion !== 0 ?
                            <Pressable 
                                onPress={() => {guardarComentario()}} 
                                style={{    
                                textAlign: "center",
                                padding  : 5,
                                margin : 20,
                                backgroundColor : Colors.$parqueo_color_primario,
                                borderRadius : 50}}> 
                                    <Text style={stylesModal.btnInit}>Guardar</Text>
                            </Pressable>
                            :
                            <Pressable onPress={() => console.log('check de vehículo asegurado') } 
                                style={{    
                                textAlign: "center",
                                padding  : 5,
                                margin : 20,
                                backgroundColor : Colors.$secundario,
                                borderRadius : 50}}> 
                                    <Text style={[stylesModal.btnInit, {color: Colors.$texto}]}>Guardar</Text>
                            </Pressable>
                        }
                        </>    
                    }
            </View>    
                    
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        height: Dimensions.get('window').height*.5,
        backgroundColor: Colors.$parqueo_color_adicional,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    titulo: {
        width: '90%',
        fontSize: 20,
        color: Colors.$parqueo_color_texto,
        fontFamily: Fonts.$poppinsregular,
        textAlign: 'center',
    },
    texto: {
        fontSize: 16,
        color: Colors.$parqueo_color_texto_50,
        marginBottom: 5,
        fontFamily: Fonts.$poppinsregular
    },
    cuentaRegresiva: {
        fontSize: 30,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$parqueo_color_texto,
        marginVertical: 10,
    },
    vencido: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: '#DC3545',
        marginVertical: 10,
    },
    botonFinalizar: {
        width: '80%',
        alignItems: 'center',
        backgroundColor: Colors.$parqueo_color_primario,
        borderRadius: 20,
        padding: 10,
        marginTop: 20,
        fontFamily: Fonts.$poppinsregular
    },
    botonFinalizarText: {
        color: Colors.$blanco,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular
    }
});

const stylesModal = StyleSheet.create({
    row_:{
        width: Dimensions.get('window').width,
        height: 'auto',
        backgroundColor: Colors.$blanco,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding:10,
        paddingLeft: 20,
        marginTop: 30
    },
    textoCheck: {
        width: '70%',
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto
    },
    contenedor: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: Colors.$parqueo_color_fondo, 
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        position: 'relative'
    },
    imagen: {
        width: Dimensions.get('window').width*.8,
        height: 'auto',
    }, 
    btnInit: {
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        fontSize: 18, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'white',
        color: Colors.$parqueo_color_fondo,
        alignSelf: "center",
        width : 250,
    },
    cajaCalificacion: {
        width: Dimensions.get('window').width*.8,
        backgroundColor: Colors.$parqueo_color_fondo,
        alignItems: "center",
        padding: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
    },
    titulo: {
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$parqueo_color_texto,
        fontSize: 24,
        width: '100%',
        textAlign: 'center'
    },
    subtitulo: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$parqueo_color_texto_50
    },
    imagen: {
        width: Dimensions.get('window').width*.8,
        height: 'auto',
    },
    texto: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 18,
        textAlign: 'center',
        width: Dimensions.get('window').width*.7,
        marginTop: 10,
        marginBottom: 10,
        color: Colors.$parqueo_color_texto_50
    },
    input: {
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 2,
        borderRadius: 15,
        marginBottom: 30,
        fontSize: 16,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        marginTop: 10,
        paddingBottom: 10,
        color: Colors.$texto,
        backgroundColor: Colors.$parqueo_color_secundario,
        borderColor: Colors.$parqueo_color_texto_80,
        fontFamily: Fonts.$poppinsregular,
        width: 300,
        height: 150,
        paddingLeft: 20,
        textAlignVertical: 'top'
    },
    cajaCheck: {
        width: "10%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnCheck: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$texto,
        borderRadius : 10,
        marginRight: 5
    },
    btnCheckOK: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$texto,
        borderRadius : 10,
        backgroundColor: Colors.$adicional,
        marginRight: 5
    },
});

function mapStateToProps(state) {
    return {
        dataParqueo: state.reducerParqueadero,
    };
}

export default connect(mapStateToProps)(Calificar_parqueadero);
