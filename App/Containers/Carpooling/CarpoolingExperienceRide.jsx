import {
    Image,
    ImageBackground,
    Text,
    Pressable,
    View,
    StyleSheet,
    TextInput,
    Modal, 
    Dimensions,
    Keyboard,
} from 'react-native';
import { 
    guardar_comentario,
    logro_progreso_viaje_compartido_pasajero
} from '../../actions/actionCarpooling';
import { 
    savePuntos
} from '../../actions/actions3g';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Estrellascalificar } from '../../Components/carpooling/EstrellasCalificar'
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { v4 as uuidv4 } from 'uuid';
import LottieView from 'lottie-react-native';

function CarpoolingExperienceRide(props){

    const { infoUser, endTtripVP } = useContext( AuthContext );
    const dispatch = useDispatch();

    const [ state , setState ] = useState({
        user: '',
        beneficios: '',
        isOpenBackgroundInfoModal: false
    });
    const [ estrellas, setEstrellas ] = useState(5);
    const [ loadedTrips, setLoadedTrips ] = useState(false);
    const [ comment, setComment ] = useState('Sin comentario')
    const dismissKeyboard = () => {
        Keyboard.dismiss(); // Oculta el teclado
      };

    const confirmarPago = async () => {
        let comentario = {
            "_id": uuidv4(),
            "idEnvio": infoUser.DataUser.idNumber,
            "idRecibido": props.dataCarpooling.dataTripSelectRide.viajeSolicitado.bc_usuario.usu_documento,
            "relacion": "Pasajero a conductor",
            "calificacion": estrellas,
            "comentario": comment,
            "idViaje": props.dataCarpooling.dataTripSelectRide.idViajeSolicitado,
            "solicitud": props.dataCarpooling.dataTripSelectRide._id,
        }
        //const totalPointsRider = Math.ceil(parseFloat(props.dataCarpooling.dataTripSelectRide.viajeSolicitado.distanciaGoogle));
        const totalPointsRider = 1;
        const data = {
            "pun_id": uuidv4(),
            "pun_usuario": infoUser.DataUser.idNumber,
            "pun_modulo": 'Carpooling',
            "pun_fecha": new Date().toISOString(),
            "pun_puntos": totalPointsRider,
            "pun_motivo": `Pasajero carpooling km: ${totalPointsRider}`
        }
        await dispatch(savePuntos(data));
        await dispatch(guardar_comentario(comentario));
        //await dispatch(logro_progreso_viaje_compartido_pasajero()); Desactivar cuando se palique el logro
        await setLoadedTrips(true);
        setTimeout(function(){
            setLoadedTrips(false);   
            RootNavigation.navigate('CarpoolingEndRide');
        }, 2000);
    }


if(loadedTrips){
    return (
        <Modal transparent={true}>
        <View style={{ backgroundColor: Colors.$primer, flexDirection: "column", flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <LottieView
                source={require('../../Resources/Lotties/loading_carpooling.json')} autoPlay loop
                style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: Colors.$blanco
                }}
            />
            </View>
        </View>
        </Modal>
    )
}else{
    return (
    <ImageBackground source={Images.fondoMapa} style={{        
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height
    }}>
    <View style={{
        flex: 1,
        width: "100%", 
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    }}>        
        <View style={{
            height: "65%",
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.$blanco,
            borderRadius: 20,
            padding: 10
        }}>
            <View style={estilos.contenedor}>
                <Text style={estilos.title}>Califica este viaje</Text>                            
            </View>

            <View style={estilos.contenerod2}>                                          
                <View style={estilos.cajaComentario} >
                    <Estrellascalificar calificacion={estrellas} setCalificacion={setEstrellas}/>
                    <Text style={{ fontSize: 17, marginVertical: 10, color: Colors.$texto, fontFamily : Fonts.$poppinsregular, textAlign : 'center' }}>Tu opinión sobre el servicio es muy importante, ¡compártela con nosotros!</Text>
                    <View style={estilos.cajaInput}> 
                        <TextInput
                            numberOfLines={2}
                            placeholder='Comentario (opcional)'
                            placeholderTextColor={'#878787'}
                            style={ estilos.inputBeneficios }
                            onChangeText={text => setComment(text)}
                            returnKeyType="done"
                            onSubmitEditing={dismissKeyboard} // Aquí eliminas los paréntesis para que se pase la función de referencia
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <Pressable  
                        onPress={() => { confirmarPago() }} 
                        style={estilos.btnCenter}>
                        <Text style={estilos.btnSaveColor}>Confirmar</Text>                                            
                    </Pressable>                              
                </View>
            </View>
        </View>
    </View>
    </ImageBackground>
    );
}
    
}

const estilos = StyleSheet.create({
    contenedor:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        marginTop: 20
    },
    title:{
        fontFamily: Fonts.$sizeSubtitle, 
        fontSize: 25, 
        textAlign: 'center', 
        color: Colors.$texto, 
        marginBottom: 5,
        zIndex: 1,
    },
    contenerod2: {
        width: Dimensions.get('window').width, 
        alignItems: 'center',
    },
    cajaInput: {
        width: "100%",
        alignItems: 'center',

    },
    inputBeneficios: {
        width: '80%',
        height: 100,
        fontSize: 18,
        paddingVertical: 8, // Puedes ajustar este valor si el texto sigue sin alinearse bien.
        backgroundColor: Colors.$secundario,
        paddingHorizontal: 16, // Cambia paddingLeft para paddingHorizontal para consistencia.
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 20,
        marginTop: 15,
        color: Colors.$texto,
        marginBottom: 20,
        textAlignVertical: 'top', // Asegura que el texto comience desde arriba.
    },
    btnCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$primario,
        width: "70%",
        height: 40,
        padding: 2,
        borderRadius: 25
    },
    btnSaveColor: {
        color: Colors.$blanco,
        fontSize: 16,
    },
    cajaComentario: {
        width: Dimensions.get('window').width*.8,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius : 10,
    },
    textSolicitud: {
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 26,
        color: Colors.$texto,
        
    },
})

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
        dataCarpooling: state.reducerCarpooling,
        kmToSendPoints: state.reducerCarpooling.kmToSavePoints,
    }
}

export default connect(mapStateToProps)(CarpoolingExperienceRide);