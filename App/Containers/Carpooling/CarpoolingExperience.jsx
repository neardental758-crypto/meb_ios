import {
    Image,
    SafeAreaView,
    Text,
    Pressable,
    View,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
    Dimensions,
    Keyboard,
} from 'react-native';
import { 
    end_trip_carpooling, 
    guardar_comentario,
    patch_estado_pago,
    get_pagos_trip,
    reset_patch_pago_ok,
    change_carpooling_drawer
} from '../../actions/actionCarpooling';
import { 
    savePuntos
} from '../../actions/actions3g';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { Estrellascalificar } from '../../Components/carpooling/EstrellasCalificar';
import LottieView from 'lottie-react-native';

function CarpoolingExperience(props){

    const { infoUser, endTtripVP } = useContext( AuthContext );
    const dispatch = useDispatch();

    const [ state , setState ] = useState({
        user: '',
        beneficios: '',
        comentario: 'Sin comentario',
        isOpenBackgroundInfoModal: false
    });

    const [isChecked, setIsChecked] = useState('');
    const [calificaciones, setCalificaciones] = useState({});

    const actualizarCalificacion = (id, calificacion) => {
      setCalificaciones((prevState) => ({
        ...prevState,
        [id]: calificacion,
      }));
    };

    const toggleCheckBox = (id) => {
      setIsChecked(id);
    };
    const dismissKeyboard = () => {
        Keyboard.dismiss(); // Oculta el teclado
      };

    const displayBackgroundInfoModal = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal: value })
    }
    
    const openBackgroundInfoModal = () => {
          return (
              <View style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 22,
                  height: 20,
              }}>
                  <Modal transparent={true} animationType="slide">
                      <View style={{ backgroundColor: "rgba(52, 52, 52, 0.9)", flexDirection: "column", flex: 1 }}>
                        <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop 
                        style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').width,        
                        position: "absolute",
                        zIndex: 0,     
                        }}/>
                          <View style={{ 
                            flex: 1, 
                            borderRadius: 20, 
                            marginVertical: Dimensions.get('window').height*.25, 
                            marginHorizontal: Dimensions.get('window').width*.1, 
                            backgroundColor: Colors.$blanco, 
                            justifyContent: "center", 
                            alignItems: "center", 
                            paddingHorizontal: 25,
                            position: "relative",
                        }}>
                              <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto80,
                                fontSize: 22, 
                                fontWeight: "700", 
                                marginTop: 20 }}
                              >Viaje finalizado con éxito</Text>
                            <Image 
                                source={require('../../Resources/gif/Acepted.gif')} 
                                style={{
                                    width: "100%",
                                    height: "50%",
                            }}/>
                              <View style={{
                                  marginTop: 40,
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                              }}>
                                  <View>
                                      <Pressable 
                                        onPress={() => {
                                            displayBackgroundInfoModal(false) 
                                            finalizar()
                                        }}
                                        style={{
                                            width: 150,
                                            height: 40,
                                            borderRadius: 10,
                                            backgroundColor: Colors.$primario,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                      >
                                        <Text style={{ 
                                            color: Colors.$blanco,
                                            fontSize: 20
                                        }}>Aceptar</Text>
                                      </Pressable>
                                  </View>
                              </View>
                          </View>
    
                          
    
                      </View>
                  </Modal>
              </View>
          )
          //Abrir el modal de backgrund info
    }

    const finalizar = async () => {
        //let totalPointsDriver = props.kmToSendPoints*2; // 2 puntos por km
        let totalPointsDriver = 10; //10 puntos por viaje
        if(props.dataCarpooling.pagosViaje?.length > 0){ 
            totalPointsDriver += (2*props.dataCarpooling.pagosViaje?.length)
        }
        const data = {
            "pun_id": uuidv4(),
            "pun_usuario": props.dataCarpooling.dataTripSelect.conductor,
            "pun_modulo": 'Carpooling',
            "pun_fecha": new Date().toISOString(),
            "pun_puntos": totalPointsDriver,
            "pun_motivo": `Conductor carpooling pasajeros: ${props.dataCarpooling.pagosViaje?.length} km: ${props.kmToSendPoints}`
        }
        await dispatch(savePuntos(data));
        let estado = {"estado": "FINALIZADA"}
        await dispatch(end_trip_carpooling(props.dataCarpooling.dataTripSelect._id, estado));
        dispatch(change_carpooling_drawer('Compartir'));
        RootNavigation.navigate('CarpoolingAddTrip');
    }

    const confirmarPago = async (id) => {
        const calificacion = calificaciones[id._id] || 5;
        let comentario = {
            "_id": uuidv4(),
            "idEnvio": id.idConductor,
            "idRecibido": id.idPasajero,
            "relacion": "Conductor a pasajero",
            "calificacion": calificacion,
            "comentario": state.comentario,
            "idViaje": id.idViaje,
        }
        await dispatch(guardar_comentario(comentario));
        if (isChecked === id._id) {
            await estadoPago(id._id, 'APROBADO')
        }else{
            await estadoPago(id._id, id.estado)
        }
        
        console.log(props.kmToSendPoints);
    }

    const estadoPago = async (id, estado) => {
        let data = { 
          "estado": estado + " + COMENTARIO"
        }
        await dispatch(patch_estado_pago(id, data));
    }

    const resetPago = async () => {
        await dispatch(reset_patch_pago_ok());
        await dispatch(get_pagos_trip(props.dataCarpooling.dataTripSelect._id));    
    }
    
    useEffect(() => {
        if (props.dataCarpooling.patch_pago_ok) {
          resetPago()
        }
    },[props.dataCarpooling.patch_pago_ok])
   
    return (
        
    <View style={estilos.generales}>
    {(state.isOpenBackgroundInfoModal) ? openBackgroundInfoModal() : <></>}
    <SafeAreaView>
    <ScrollView>
        <View style={estilos.contenedor}>
            <View style={estilos.contentTop}>
                <Text style={estilos.title}>Califica tú experiencia</Text>                            
            </View>
        </View>

        <View style={estilos.contenerod2}>
        {
        <>
        {
        props.dataCarpooling.pagosViajeCargada ?
        <View style={estilos.boxPasajeros}>                              
        {props.dataCarpooling.pagosViaje?.length > 0 ? 
            props.dataCarpooling.pagosViaje.map((data) => {
            const imagenUrl = data.bc_usuario.usu_img;
            const imagenDefault = Images.userCar; // Imagen por defecto
            const urlFinal = (imagenUrl && imagenUrl !== 'sin imagen' && imagenUrl !== null) ? imagenUrl : imagenDefault;
            const calificacion = calificaciones[data._id] || 5;
        return (
            <View style={estilos.cajaPasajeros} key={data._id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={{ uri: urlFinal }} style={{ width: 80, height: 80, borderRadius : 40 }} />
                    <Text style={estilos.textSolicitud}>{data.bc_usuario.usu_nombre}</Text>
                </View>

                {/* Estrellas de calificación */}
                <Estrellascalificar 
                    calificacion={calificacion}
                    setCalificacion={(nuevaCalificacion) => actualizarCalificacion(data._id, nuevaCalificacion)}
                 />

                {/* Campo de comentario */}
                <View style={estilos.cajaInput}>
                <TextInput
                    numberOfLines={2}
                    placeholder='Escribe una reseña'
                    placeholderTextColor={'#878787'}
                    style={estilos.inputBeneficios}
                    onChangeText={text => setState({ ...state, comentario: text })}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard} // Eliminamos los paréntesis para pasar la referencia
                    underlineColorAndroid="transparent"
                />
                </View>

                {/* Sección de pago y estado */}
                {   
                    props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ?
                    <>
                    {
                    data.estado === 'PENDIENTE' ?
                    <View style={estilos.cajaCheck}>
                    {isChecked === data._id ?
                        <Pressable onPress={() => toggleCheckBox('')} style={estilos.btnCheckOK} /> :
                        <Pressable onPress={() => toggleCheckBox(data._id)} style={estilos.btnCheck} />
                    }
                    <Text>Pago recibido</Text>
                    </View>
                    :
                    <View style={estilos.cajaCheck}>
                    <Text style={estilos.solicitudAprobada}>{data.estado}</Text>
                    {
                        data.metodo === 'EFECTIVO' ?
                        <Image source={Images.iconobillete} style={{ width: 25, height: 25 }} /> :
                        <Image source={Images.logodaviplata} style={{ width: 25, height: 25 }} />
                    }
                    </View>
                    }
                    </>:null
                }

                {/* Comentario guardado o confirmación de pago */}
                {
                data.estado === 'APROBADO + COMENTARIO' || data.estado === 'PENDIENTE + COMENTARIO' ?
                    <Text style={{ backgroundColor: Colors.$secundario, padding: 5, borderRadius: 5 }}>
                    Comentario guardado
                    </Text>
                    :
                    <Pressable onPress={() => confirmarPago(data)} style={estilos.btnCenter}>
                    <Text style={estilos.btnSaveColor}>Enviar comentario</Text>
                    </Pressable>
                }

            </View>
            );
        })
        : 
            <Text style={estilos.notFoundText}>No hay pasajeros para calificar 😞</Text>
        }
        </View>
        :
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height*.8,
            backgroundColor: 'yellow'
        }}>
            <Image source={require('../../Resources/gif/loadingCar.gif')} style={{width: 250, height: 250}} />
        </View>                  
        }
        </>
        }

        <Pressable  
            onPress={() => {displayBackgroundInfoModal(true)}} 
            style={estilos.btnFinalizar}>
                <Text style={estilos.btnSaveColor}>Finalizar</Text>                                
        </Pressable>

        </View>
    </ScrollView>
    </SafeAreaView>
    </View>
    );
    
}

const estilos = StyleSheet.create({
    spinner: {
        width: 50,
        height: 50,
        borderColor: '#333',
        borderWidth: 3,
        borderRadius: 25,
        borderTopWidth: 0,
        textAlign: 'center',
    },
    solicitudAprobada: {
        backgroundColor: Colors.$adicional80,
        color: Colors.$blanco,
        padding: 5,
        borderRadius: 5,
    },
    generales: {
        flex: 1,
        width: Dimensions.get('window').width,
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: Colors.$blanco
    },
    cajaCheck: {
        width: "80%",
        padding: 10,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
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
    LineaHorizontal: {
        width: "60%",
        height: 4,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: Colors.$texto,
      },
    safeArea: {
        flex: 1, 
        width: Dimensions.get('window').width,
        backgroundColor: '#ffffff',
        margin: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    contenedor:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentTop: {
        height: 150,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    btnFlechaBack: {
        width: 40, 
        margin: 4,
        position: 'absolute',
        left: 0,
        zIndex: 10,
    },
    btnBack: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center',
        width: 40, 
        height: 30, 
        borderRadius: 10,
        zIndex: 10,
    },
    title:{
        fontFamily: Fonts.$sizeSubtitle, 
        fontSize: 25, 
        textAlign: 'center', 
        color: Colors.$texto, 
        marginBottom: 5,
        zIndex: 1,
    },
    subRaya: {
        height: 2, 
        width: 410, 
        backgroundColor: Colors.$primario, 
        alignSelf: 'center',
    },
    contenerod2: {
        width: Dimensions.get('window').width, 
        height: "100%",
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    imgtest: {
        width: 90,
        height: 90,
    },
    cajaStarts: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    cajaInput: {
        width: "100%",
        alignItems: 'center',

    },
    inputBeneficios: {
        width: '80%',
        height: 40,
        justifyContent: "flex-start",
        fontSize: 18,
        paddingVertical: 8,
        backgroundColor: Colors.$secundario,
        paddingLeft: 15,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 20,
        marginTop: 15,
        color: Colors.$texto,
        marginBottom: 10,
        textAlignVertical: 'top', 
    },
    btnCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$primario,
        width: "70%",
        padding: 2,
        borderRadius: 15
    },
    btnFinalizar: {
        width: Dimensions.get('window').width*.9,
        height: 40,
        backgroundColor: Colors.$primario,
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    },
    buttonNext: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$primario,
        width: 180, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnSaveColor: {
        color: Colors.$blanco,
        fontSize: 16,
        padding: 5,
    },
    boxPasajeros:{
        width: Dimensions.get('window').width,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cajaPasajeros: {
        width: Dimensions.get('window').width*.8,
        padding: 10,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginBottom: 20,
        borderWidth : 1,
        borderColor : Colors.$secundario,
        borderRadius : 10,
    },
    textSolicitud: {
        width: '50%',
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 20,
        color: Colors.$texto,
        marginLeft: 10,
    },
    notFoundText : { 
        marginBottom : 50, 
        textAlign : 'center', 
        fontSize : 22, 
        color : 'gray' 
    },
})

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        dataCarpooling: state.reducerCarpooling,
        kmToSendPoints: state.reducerCarpooling.kmToSavePoints,
        perfil: state.reducerPerfil
    }
}

export default connect(mapStateToProps)(CarpoolingExperience);