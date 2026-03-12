import {
    ScrollView, 
    ActivityIndicator, 
    Image, 
    ImageBackground, 
    Modal, 
    SafeAreaView, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    PermissionsAndroid,
    Platform, 
    Keyboard, 
    KeyboardAvoidingView, 
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { launchCamera } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { ButtonComponent } from '../../Components/ButtonComponent';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
//import styles from './Styles/TravelExperienceScreen.style';
import { appActions, getActiveFinishingTrips, saveDocumentUser, setFeedback, validateInfoUserExperience, reset_img_experience, clearActualTrip } from '../../actions/actions';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import LottieView from 'lottie-react-native';
import { AuthContext } from '../../AuthContext';
import { Env } from "../../Utils/enviroments";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
import { changeProgreso, getLogrosProgreso, changeProgresoEstado, saveProgresoLogro} from '../../actions/actionPerfil';

const { LocationServiceModule } = NativeModules; //Solo android
const { SharedPreferencesModule } = NativeModules; //Solo android
const getDistance = async () => {
    try {
      const value = await AsyncStorage.getItem('distanciaRecorrida');
      return value != null ? JSON.parse(value) : 0; // Convierte la cadena a un número
    } catch (error) {
      console.error('Error al obtener la distancia:', error);
      return 0; // Retorna un valor predeterminado en caso de error
    }
  };
  const fetchDistance = async () => {
    const distance = await getDistance();
    console.log('Distancia recuperada en finalizar viaje:', distance);
    //Alert.alert("distancia acumulada ", distance) // Debería ser un número
  };

  
const options = {
    title: 'Selecciona una imagen',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quiality: 0.4

};
function travelExperienceScreen (props){
    const [state , setState ] = useState ({
            type: "endTrip",
            comment: "",
            rating: "",
            actualTrip: props.actualTrip.id,
            isChecked: false
        })
    const { infoUser, logout } = useContext( AuthContext )
    useEffect( () => {
        setState({ 
            ...state, 
            document : props.npm, 
        });
        props.saveDocumentUser({ assets: [] });
        props.onSelectPhoto("");
        //props.getActiveFinishingTrips();
    },[])
    useEffect(() => {
        console.log("Distancia actualizada:");
        fetchDistance();
      }, []);

    const verState = () => {
        console.log("las props en calificar experiencia", props.currentTrip.userId)
    }

    const clearTrackingData = async () => {
        try {
            await AsyncStorage.multiRemove([
                'rutaCoordinates',
                'vehiculoVP',
                'distanciaRecorrida',
                'isTrackingActive',
                'posicionInicial'
            ])
            await SharedPreferencesModule.clearCoordinates(); //Solo android
            Alert.alert("Coordenadas nativas eliminadas exitosamente");
            console.log('Datos de rastreo eliminados');
            if (Env.modo === 'tablet') {
                console.log('ESTAMOS EN TABLET ; VAMOS A CERRAR SESION');
                await logout(); 
                return
            }
            //RootNavigation.navigate('Home');
        } catch (err) {
            console.log('Error al limpiar los datos de rastreo:', err);
        }
    };

    const guardarProgresoLogros = async (id_logro, progreso) => {
        try {
          console.log("Iniciando la asignación de logros al usuario...");
      
            const dataProgresoLogros = {
              id: uuidv4(), // Genera un ID único si es necesario
              usuario_id: infoUser.DataUser.idNumber,
              logro_id: id_logro,
              progreso: progreso,
              estado: "INCOMPLETO",
              ultima_actualizacion: new Date().toISOString(),
            };
      
            console.log("Guardando progreso para el logro:", dataProgresoLogros);
      
            // Llama a la acción de Redux para guardar cada progreso
            await dispatch(saveProgresoLogro(dataProgresoLogros));
          
      
          console.log("Todos los logros activos han sido asignados al usuario.");
        } catch (error) {
          console.error("Error al asignar logros al usuario:", error);
        }
      };
      const actualizarProgreso = () => {
        if (props.perfil && Array.isArray(props.perfil.dataLogros)) { // Verificar que 'dataLogros' sea un arreglo válido
            // Recorrer los logros
            props.perfil.dataLogros.forEach((logro) => {
                if (logro.criterios.tipo === "general") {
                    console.log("valor del logro id y criterios");
                    console.log(logro.id_logro);
                    console.log(logro.criterios.tipo);
    
                    // Verificar que 'dataProgresoLogros' sea un arreglo antes de hacer el 'find'
                    if (Array.isArray(props.perfil.dataProgresoLogros)) {
                        // Buscar progreso existente
                        const progresoExistente = props.perfil.dataProgresoLogros.find(
                            (progreso) =>
                                progreso.usuario_id === infoUser.DataUser.idNumber &&
                                progreso.logro_id === logro.id_logro
                        );
    
                      
                            console.log("Progreso existente:", progresoExistente);
    
                            // Validar que `progresoExistente.progreso` no sea `undefined`
                            const progresoActual = progresoExistente.progreso || 0;
    
                            progresoLogro(
                                progresoExistente.id,
                                infoUser.DataUser.idNumber,
                                logro.id_logro,
                                progresoActual
                            );
    
                            if (progresoActual === logro.valor) {
                                actualizarEstadoProgresoLogro(
                                    progresoExistente.id,
                                    infoUser.DataUser.idNumber,
                                    logro.id_logro
                                );
                            }
                        
                    } else {
                        console.error("dataProgresoLogros no es un arreglo válido");
                        guardarProgresoLogros(logro.id_logro, 0);
                    }
                } else if (logro.criterios.tipo === "distancia") {
                    console.log("valor del logro id y criterios");
                    console.log(logro.id_logro);
                    console.log(logro.criterios.tipo);
    
                    // Verificar que 'dataProgresoLogros' sea un arreglo antes de hacer el 'find'
                    if (Array.isArray(props.perfil.dataProgresoLogros)) {
                        // Buscar progreso existente
                        const progresoExistente = props.perfil.dataProgresoLogros.find(
                            (progreso) =>
                                progreso.usuario_id === infoUser.DataUser.idNumber &&
                                progreso.logro_id === logro.id_logro
                        );
    
                        if (progresoExistente) {
                            console.log("Progreso existente:", progresoExistente);
    
                            // Validar que `progresoExistente.progreso` no sea `undefined`
                            const progresoActual = progresoExistente.progreso || 0;
    
                            progresoLogroDistancia(
                                progresoExistente.id,
                                infoUser.DataUser.idNumber,
                                logro.id_logro,
                                progresoActual
                            );
    
                            if (progresoActual === logro.criterios.meta) {
                                actualizarEstadoProgresoLogro(
                                    progresoExistente.id,
                                    infoUser.DataUser.idNumber,
                                    logro.id_logro
                                );
                            }
                        } else {
                            console.log("No hay progreso existente, creando uno nuevo...2");
                            guardarProgresoLogros(logro.id_logro, 0);
                        }
                    } else {
                        console.error("dataProgresoLogros no es un arreglo válido");
                        guardarProgresoLogros(logro.id_logro, 0);
                    }
                }
            });
        } else {
            console.error("Los datos de perfil o dataLogros no están definidos o no son un arreglo válido");
        }
    };
    
    const progresoLogroDistancia = async (id, idUsuario,idLogro, progreso) => {
       
        console.log("entrando a la funcion progreso logro distancia")
        const distance = await getDistance();
       
        const progresoNumerico = Number(progreso);
        const distanciaNumerica = Number(distance); 
        Alert.alert("distancia recorride: " + distanciaNumerica);
        const progresoActualizado = progresoNumerico + distanciaNumerica;

        console.log("valor de la distancia en el progreso")
        const dataProgresoLogros = {
            id: id,
            usuario_id: idUsuario,
            logro_id: idLogro,
            progreso: progresoActualizado,
          };
          console.log("Validando JSON antes del dispatch");
try {
  JSON.stringify(dataProgresoLogros);
} catch (error) {
  console.error("Error al serializar JSON:", error);
}
          console.log("datos a actualizar")
          console.log(dataProgresoLogros);
          dispatch(changeProgreso(dataProgresoLogros));
        // Incrementa antes de asignar
       
    }   
    
    const progresoLogro = (id,idUsuario,idLogro, progreso) => {
        console.log("entrando a la funcion progreso logro")
        const progresoActualizado = ++progreso; // Incrementa antes de asignar
        const dataProgresoLogros = {
            id: id,
            usuario_id: idUsuario,
            logro_id: idLogro,
            progreso: progresoActualizado,
          };
          console.log("Validando JSON antes del dispatch");
try {
  JSON.stringify(dataProgresoLogros);
} catch (error) {
  console.error("Error al serializar JSON:", error);
}
          console.log("datos a actualizar")
          console.log(dataProgresoLogros);
          dispatch(changeProgreso(dataProgresoLogros));
       
    }
    const actualizarEstadoProgresoLogro = (id,idUsuario,idLogro) => {
        console.log("entrando a la funcion actualizar estado progreso logro")
      
        const dataProgresoLogros = {
            id: id,
            usuario_id: idUsuario,
            logro_id: idLogro,
            estado: "COMPLETO",
          };
          console.log("Validando JSON antes del dispatch");
try {
  JSON.stringify(dataProgresoLogros);
} catch (error) {
  console.error("Error al serializar JSON:", error);
}
          console.log("datos a actualizar")
          console.log(dataProgresoLogros);
          dispatch(changeProgresoEstado(dataProgresoLogros));
       
    } 

    /*const submit = async () => {
        if(props.documentUser.assets && props.documentUser.assets.length > 0){
            if (state.rating !== "") {
                if (state.comment !== "") {
                    console.log('finalizando trip desde travelExperience', props.actualTrip.id)
                    await setState({ 
                        ...state,
                        document : props.currentTrip.userId,
                        actualTrip: props.currentTrip.id  
                    });
                    await props.setFeedback(state);
                    await props.validateInfoUserExperience();
                    await props.clearActualTrip();
                    await clearTrackingData();
                }else {
                    Alert.alert('Falta comentario', 'Cuéntanos como te fue');
                } 
            }else {
                Alert.alert('Falta calificar', 'Falta calificar el viaje');
            }            
        }else{
            Alert.alert('Tomar foto', 'Por favor tomar una foto del vehículo en la estación');
        }
    }*/

    const submit = async () => {
        console.log('el modo es :', Env.modo)
        progresoLogro();
        // Función para validar la calificación y el comentario
        const validateFeedback = () => {
            if (!state.rating) {
                Alert.alert('Falta calificar', 'Falta calificar el viaje');
                return false;
            }
            if (!state.comment) {
                Alert.alert('Falta comentario', 'Cuéntanos como te fue');
                return false;
            }
            // Validación inicial para modo tablet o requerir foto
            if (Env.modo === 'movil') {
                console.log('entrando a validara foto por que movil')
                if(props.documentUser.assets && props.documentUser.assets.length === undefined){
                    Alert.alert('Tomar foto', 'Por favor tomar una foto del vehículo en la estación');
                    return false;
                }
            }
            return true;
        };
    
        // Validar calificación y comentario
        if (!validateFeedback()) return;
    
        console.log('finalizando trip desde travelExperience', props.actualTrip.id);
        
        // Configuración de los datos de viaje y envío de retroalimentación

        await setState({
            ...state,
            document: props.currentTrip.userId,
            actualTrip: props.currentTrip.id,
        });
        await props.setFeedback(state);
        await props.validateInfoUserExperience();
        await props.clearActualTrip();
        await clearTrackingData();
        
    };

    const ratingCompleted = (rating) => {
        Keyboard.dismiss();
        setState({...state ,  rating })
        props.setFeedback(state);
    }

    const permissions = async () => {
        if (Platform.OS == 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                    showPhotoPickerCamera();
                } else {
                    setTimeout(function () {
                        Alert.alert("Alerta", "por favor acepte permisos para tomar la foto")
                    }, 100)
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            showPhotoPickerCamera();
        }
    }

    const showPhotoPickerCamera = () => {
        launchCamera(options, (response) => { // Use launchImageLibrary to open image gallery

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error || response.errorCode) {
                console.log('ImagePicker Error: ', response);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log("selecciona", response)
                props.onSelectPhoto("ok");
                handleCloseButtonPress();
                props.saveDocumentUser(response);
            }
        });
    }
    const handleCloseButtonPress = () => {
        const { onClosePress } = props;
        if (onClosePress) {
            onClosePress();
        }
    }

    useFocusEffect( 
        React.useCallback(() => { 
          console.log('Reseteando img')
          props.reset_img_experience()
        }, [])
      );

    const renderEndLoading = () => {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: Colors.$blanco, flexDirection: "column", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
                        <View style={{
                            justifyContent: "center", 
                            alignItems: "center", 
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').width,
                        }}>
                          
                        </View>
                        <Text style={{ textAlign: "center", color: "#000", fontSize: 20, marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Estamos finalizando tu viaje...</Text>
                        
                    </View>
                </View>
            </Modal>
        )
    }

        if (props.loadingEnd) {
            return renderEndLoading();
        } else {
            return (
            <>   
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.$blanco, margin: 0, paddingTop: 30 }}>
                
                <ScrollView style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>

                <Text style={stylesModal.titulo}>¡Felicitaciones!</Text>
                <Text style={stylesModal.texto}>¡Sumaste 10 puntos más! Sigue viajando y puedes canjearlos por increíbles recompensas.</Text>

                <View style={{
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: Dimensions.get('window').width,
                        height: 'auto', 
                        position: 'absolute',
                        top: 0
                    }}>
                       
                    </View> 
                    
                </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width }}>
                        
                            <View style={{ marginHorizontal: 20, justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width }}>

                                {   
                                    props.documentUser.assets && props.documentUser.assets.length > 0 ?
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ marginTop: 15 }}>
                                            <Image source={{ uri: props.documentUser?.assets[0]?.uri }}
                                                style={{ height: 100, width: 100, borderRadius: 50 }} />
                                        </View>
                                    </View> 
                                    : 
                                    <>
                                    {
                                        Env.modo === 'tablet' ?
                                        <></>
                                        :
                                        <View style={{ 
                                            flex: 1,
                                            height: 'auto', 
                                            width: "80%",
                                            marginTop: 50, 
                                            marginBottom: 50, 
                                            }}>                                          

                                            <Pressable 
                                                onPress={() => { permissions() }}
                                                style={{    
                                                textAlign: "center",
                                                padding  : 10,
                                                margin : 20,
                                                backgroundColor : Colors.$texto,
                                                borderRadius : 50}}> 
                                                <Text style={[estilos.textButton, {width : 150, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Subir foto</Text>
                                            </Pressable>
                                        </View>
                                    }
                                    </>
                                    
                                }

                    <View style={stylesModal.cajaCalificacion}>
                        <Text style={stylesModal.titulo}>Califica la experiencia</Text>
                        
                        <Rating
                            type="custom"
                            ratingImage={Images.borderStar}
                            ratingColor={Colors.$reservada}
                            ratingBackgroundColor={Colors.$blanco}
                            ratingCount={5}
                            imageSize={50}
                            startingValue={0}
                            onFinishRating={ratingCompleted}
                            showRating={false}
                            style={{ paddingVertical: 10 }}
                        />

                        <Text style={[stylesModal.texto, {color: Colors.$texto50}]}>Deja tu comentario</Text>  
                        <TextInput
                            multiline={true}
                            numberOfLines={2}
                            placeholder=''
                            placeholderTextColor={'black'}
                            style={ stylesModal.input }
                            onChangeText={comment => setState({ ...state, comment })}
                            underlineColorAndroid="transparent"
                        /> 
                    </View>

                    <View style={ stylesModal.row_}>
                        <View style={stylesModal.cajaCheck}>
                            { state.isChecked ?
                                <Pressable
                                    onPress={() => {
                                        setState({...state,  isChecked: false })
                                    }}
                                    style={stylesModal.btnCheckOK}
                                />:
                                <Pressable
                                    onPress={() => {
                                        setState({...state,  isChecked: true })
                                    }}
                                    style={stylesModal.btnCheck}
                                />
                            }
                        </View>
                        <Text style={stylesModal.textoCheck}>He asegurado el vehículo correctamente</Text>
                    </View>

                                
                                
                                
                                <View style={{ flexDirection: 'row', height: 'auto', top: 10, marginBottom: 40, alignSelf: 'center' }}>
                                    {
                                        state.isChecked ? 
                                        <Pressable 
                                            onPress={() => { submit() }}
                                            style={{    
                                            textAlign: "center",
                                            padding  : 10,
                                            margin : 20,
                                            backgroundColor : Colors.$primario,
                                            borderRadius : 50}}> 
                                            <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Finalizar viaje</Text>
                                        </Pressable>
                                        :
                                        <Pressable 
                                            onPress={() => { console.log('falta') }}
                                            style={{    
                                            textAlign: "center",
                                            padding  : 10,
                                            margin : 20,
                                            backgroundColor : Colors.$secundario,
                                            borderRadius : 50}}> 
                                            <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Finalizar viaje</Text>
                                        </Pressable>
                                    }
                                    
                                </View>


                               

                            </View>
                        
                    </View>
                </ScrollView>
            </SafeAreaView>                
            </>
            );
        }
    }
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
            backgroundColor: Colors.$blanco, 
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
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
            color: Colors.$blanco,
            alignSelf: "center",
            width : 250,
        },
        cajaCalificacion: {
            width: Dimensions.get('window').width*.8,
            backgroundColor: Colors.$blanco,
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
            color: Colors.$texto,
            fontSize: 24
        },
        subtitulo: {
            fontSize: 18,
            fontFamily: Fonts.$poppinsmedium,
            color: Colors.$texto
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
            marginBottom: 10
        },
        input: {
            marginLeft: 20,
            marginRight: 20,
            borderWidth: 2,
            borderRadius: 25,
            marginBottom: 30,
            fontSize: 16,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            marginTop: 10,
            paddingBottom: 10,
            color: Colors.$texto,
            backgroundColor: Colors.$secundario50,
            borderColor: Colors.$blanco,
            fontFamily: Fonts.$poppinsregular,
            width: 250,
            paddingLeft: 20
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

    const estilos = StyleSheet.create({
        cajaCabeza: {
            backgroundColor: Colors.$primario,
            justifyContent: 'space-around',
            alignItems: 'center', 
            borderRadius: 1,
            width: Dimensions.get('window').width,
            position: 'absolute',
            top: 10
        },
        btnAtras:{
            position: 'absolute',
            top: 10, 
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
        textButton : {
            fontFamily: Fonts.$poppinsregular, 
            textAlign: "center", 
            fontSize: 18, 
            paddingTop: 'auto', 
            paddingBottom: 'auto', 
            color: 'white',
            color: Colors.$blanco,
            alignSelf: "center",
        },
    });

const styles = StyleSheet.create({
    settingBackground: {
		flex: 1,
	},
	MainContainer:
	{
		flex: 1,
		justifyContent: 'center',
		paddingTop: (Platform.OS === 'ios') ? 20 : 0
	},
	inputBorder: {
	    marginTop: 2,
	    paddingLeft: 20,
	    width: '85%',
	    height:170,
	    color: Colors.$texto,
	    fontFamily: Fonts.$poppinsregular,
	    fontSize: 20,
	},

	childView:
	{
		justifyContent: 'center',
		flexDirection: 'row',
	},

	StarImage:
	{
		width: 40,
		height: 40,
		resizeMode: 'cover'
	},

	textStyle:
	{
		textAlign: 'center',
		fontSize: 23,
		color: '#000',
		marginTop: 15
	},
	inputWithIcon: {
		marginTop: 5,
		backgroundColor: Colors.$secundario20,
		borderRadius: 15,
		marginHorizontal: 20
	},
	endTripInput:{
		fontFamily: Fonts.$poppinsregular, 
		textAlign: "center", 
		color: Colors.$texto, 
		fontSize: 20, 
		paddingTop: 'auto', 
		paddingBottom: 'auto', 
		fontWeight: '800'
	},
	touchableEndTrip: {
		flex: 1, 
		borderRadius: 25, 
		justifyContent: "center", 
		backgroundColor: Colors.$primario, 
	}
});

function mapStateToProps(state) {
    return {
        loadingEnd: state.rideReducer.loadingEnd,
        currentTrip: state.othersReducer.currentTrip,
        documentUser: state.userReducer.documentUser,
        actualTrip: state.userReducer.actualTrip,  
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveDocumentUser: (document) => dispatch(saveDocumentUser(document)),
        onSelectPhoto: (state) => dispatch(appActions.onSelectPhoto(state)),
        //getActiveFinishingTrips: () => dispatch(getActiveFinishingTrips()),
        setFeedback: (feedback) => dispatch(setFeedback(feedback)),
        clearActualTrip: () => dispatch(clearActualTrip()),
        validateInfoUserExperience: () => dispatch(validateInfoUserExperience()),
        reset_img_experience: () => dispatch(reset_img_experience()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(travelExperienceScreen);
