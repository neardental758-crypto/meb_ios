import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  Image
} from 'react-native';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import LottieView from 'lottie-react-native';
import { connect, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { save_reg_pp, savePuntos, reset_pp, validateUser3g } from '../../actions/actions3g';
import { getPuntos, reset_preoperacional } from '../../actions/actionPerfil';
import * as RootNavigation from '../../RootNavigation';
import { useFocusEffect } from '@react-navigation/native';
import FormularioPreoperacional from './FormularioPreoperacional';
import { AuthContext } from '../../AuthContext';

function PrestamoPersonalizado(props)  {
  const dispatch = useDispatch();
  const { infoUser } = useContext( AuthContext );
  const [ modalSave, setModalSave ] = useState(false)
  const [ mostrarFormulario, setMostrarFormulario ] = useState(false)
  

  const ahora = new Date();
    ahora.setHours(ahora.getHours() - 5);

    const fechaCreacion = ahora.toISOString().slice(0, 19).replace('T', ' ');

  // Mostrar formulario al cargar el componente
  useFocusEffect(
    React.useCallback(() => {
      console.log('Componente enfocado - mostrando formulario');
      dispatch(getPuntos());
    }, [])
  );

  useEffect(() => {
    if (props.prestamos.usuarioRecorrido !== '') {
      console.log('El recorrodo del susuario es: ', props.prestamos.usuarioRecorrido)
    }
  },[props.prestamos.usuarioRecorrido !== ''])

  useEffect(() => {
    dispatch(validateUser3g(infoUser.DataUser.idNumber));
  },[])

  const resetForm = () => {
    if (props.perfil.form_preoperacional_estado) {
      dispatch(reset_preoperacional());
    }
  }

  const guardarPuntos = async () => {
      const data = {
          "pun_id": uuidv4(),
          "pun_usuario": props.prestamos.prestamo.data[0].pre_usuario,
          "pun_modulo": 'PP',
          "pun_fecha": fechaCreacion,
          "pun_puntos": "10",
          "pun_motivo": "Registro viaje PP"
      }
      await dispatch(savePuntos(data));
  }

  const handleRegisterTrip = () => {
    //console.log('guardar reg pp', props.prestamos.prestamo.data[0])
    if (!mostrarFormulario) {
        console.log('abriendo form');
        setMostrarFormulario(true);
        return;
    }
      
    let data = {
      id: uuidv4(),
      usuario: props.prestamos.prestamo.data[0].pre_usuario,
      idViaje: props.prestamos.prestamo.data[0].pre_id,
      fecha: fechaCreacion,
      vehiculo: props.prestamos.prestamo.data[0].pre_bicicleta,
      distancia: props.prestamos.usuarioRecorrido !== '' ? props.prestamos.usuarioRecorrido : '10',
      respuestas: props.perfil.form_preoperacional.respuestas,
      comentario: props.perfil.form_preoperacional.comentario
    }
    dispatch(save_reg_pp(data));
    guardarPuntos();
    dispatch(getPuntos());
    setModalSave(true);
  };

  const irInicio = async () => {
    await setModalSave(false);
    await dispatch(reset_pp());
    dispatch(getPuntos());
    resetForm();
    setMostrarFormulario(false);
    await RootNavigation.navigate('Home');
  }

  const modal = () => {
    return (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Modal transparent={true} animationType="slide">
            <View style={{ backgroundColor: Colors.$texto80, flexDirection: "column", flex: 1 }}>
                <View style={styles_qr.modalStyle}>
                    <Text style={{ 
                        textAlign: "center", 
                        color: Colors.$texto,
                        fontFamily: Fonts.$poppinsregular,
                        fontSize: 18,
                        margin: 40,
                        zIndex: 100
                    }}
                    >El registro se guardó correctamente</Text>   

                    <View style={{
                      width: 100,
                      height: 100,
                      backgroundColor: Colors.$primario,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: 40,
                        fontFamily: Fonts.$poppinsmedium,
                        color: Colors.$blanco,
                        paddingTop: 6
                      }}>{
                        props.perfil.puntosCargados ?
                        props.perfil.puntos : '...'}</Text>
                    </View>
                    <Text style={{
                      fontSize: 16,
                      fontFamily: Fonts.$poppinsregular,
                      marginBottom: 20,
                    }}>Mis puntos acumulados</Text>

                    <View style={{
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: 150,
                        height: 150,   
                        position: 'absolute',
                        top: 20                             
                      }}>
                        <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop 
                        style={{
                          width: 250,
                          height: 250,
                        }}/>
                    </View>           
                                          

                    <Pressable 
                        onPress={() => { 
                          irInicio()
                        }} 
                        style={{    
                        textAlign: "center",
                        padding  : 10,
                        margin : 20,
                        backgroundColor : Colors.$primario,
                        borderRadius : 50}}> 
                        <Text style={{width: 200, color: 'white', fontFamily: Fonts.$poppinsregular, textAlign: 'center', fontSize: 18}}>Aceptar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </View>
    )
  }


  return (
    <View style={styles.container}>
      { modalSave ? modal() : <></>}

      <FormularioPreoperacional 
        modalVisible={mostrarFormulario} 
        onClose={() => setMostrarFormulario(false)}
      />
      <View style={[styles.bikeCard, { backgroundColor: Colors.$blanco, borderColor: Colors.$primario + '20' }]}>
        <View style={styles.cardContent}>
          {/*Logo davienbici*/}
          {
            props.prestamos.empresaUsuario === 'davivienda' ?
            <Image
            style={{
              width: 250,
              height: 200
            }}
            source={Images.logodavibici}
            />:null
          }

          {/* Icono de bicicleta */}
          <View style={[styles.iconContainer, { backgroundColor: Colors.$blanco }]}>
             <LottieView source={require('../../Resources/Lotties/bicy_03.json')} autoPlay loop 
            style={{
                width: Dimensions.get('window').width*.7,
                height: Dimensions.get('window').width*.7           
            }}/>
          </View>

          {/* Título */}
          <Text style={[styles.mainText, { color: Colors.$texto }]}>
            Registra tus viajes
          </Text>
          
          {/* Descripción */}
          <Text style={[styles.subtitleText, { color: Colors.$texto50 }]}>
            Cada viaje te acerca a recompensas exclusivas
          </Text>

          {/* Sección de puntos */}
          <View style={styles.pointsSection}>
            <View style={[styles.pointsBox, { backgroundColor: Colors.$primario10 }]}>
              <Text style={[styles.pointsNumber, { color: Colors.$primario }]}>
                +10
              </Text>
              <Text style={[styles.pointsLabel, { color: Colors.$primario }]}>
                puntos por viaje
              </Text>
            </View>
          </View>

          {/* Botón de registro */}
          <Pressable 
            onPress={handleRegisterTrip}
            style={styles.button}>
            <Text style={styles.textButton}>
              { mostrarFormulario ? 'Comenzar' : 'Registrar'}
            </Text>
          </Pressable>

          {/* Texto informativo al pie */}
          <Text style={[styles.footerText, { color: Colors.$texto70 }]}>
            { mostrarFormulario ? 'Guarda tu viaje y sigue disfrutando del recorrido.' : 'Completa un corto cuestionario.'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles_qr = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    fontFamily: Fonts.$poppinsregular
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  textBold: {
    color: '#000',
    fontFamily: Fonts.$poppinsregular
  },
  buttonText: {
    fontSize: 13,
    color: '#fff',
    textAlign: "center",
    fontFamily: Fonts.$poppinsregular
  },
  buttonTouchable: {
    flex: 0.3,
    padding: 14,
    backgroundColor: Colors.$primario,
    borderRadius: 30,
    justifyContent: "center",
  },
  buttonTouchable2: {
    padding: 14,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    justifyContent: "center",
  },
  buttonText2: {
    fontSize: 18,
    color: '#000',
    textAlign: "center",
    fontFamily: Fonts.$poppinsregular
  },
  fixToText: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topContainer: {
    marginHorizontal: 10,
    flexDirection: "row",
    zIndex: 1000
  },
  buttonBack: {
    flex: 0.15,
    padding: 10,
    backgroundColor: Colors.$primario,
    borderRadius: 30,
    fontFamily: Fonts.$poppinsregular
  },
  buttonQr: {
    flex: 0.3,
    padding: 15,
    backgroundColor: Colors.$primario,
    borderRadius: 30,
    marginTop: 30,
    justifyContent: 'center',
    fontFamily: Fonts.$poppinsregular
  },
  buttonQr2: {
    flex: 0.3,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 30,
    marginTop: 30,
    justifyContent: 'center',
    fontFamily: Fonts.$poppinsregular
  },
  modalStyle: {
    borderRadius: 20, 
    marginVertical: 200, 
    marginHorizontal: 25, 
    justifyContent: "space-around", 
    alignItems: "center", 
    position: "relative", 
    backgroundColor: Colors.$blanco, 
    height: 'auto', 
    width: 'auto',
    padding:20
  },
  buttonClose: {
    flex: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderRadius: 25,
    right: 10,
    top: 10,
    zIndex: 100,
    backgroundColor: Colors.$parqueo_color_fondo
  },
  mainContainer: {
    flex: 1,
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: Dimensions.get('window').width*.8,
    width: Dimensions.get('window').width*.8,
    borderColor: Colors.$primario,
    backgroundColor: 'transparent',
    borderRadius: 15,
    borderWidth: 5
  },
  textRectangle: {
    flex: 1,
    height: 50,
    color: Colors.$Texto,
    fontSize: 20,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: Fonts.$poppinsregular
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 12,
    marginHorizontal: 0,
  },
  bikeCard: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bikeIcon: {
    fontSize: 40,
  },
  mainText: {
    fontSize: 22,
    fontFamily: Fonts.$poppinsregular,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: Fonts.$poppinsregular,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  divider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    marginVertical: 16,
  },
  pointsSection: {
    marginBottom: 20,
    width: '100%',
  },
  pointsBox: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Fonts.$poppinsregular,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    fontFamily: Fonts.$poppinsregular,
  },
  registerButton: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: Colors.$adicional
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.$blanco,
    fontFamily: Fonts.$poppinsregular,
  },
  button : { 
    width: Dimensions.get('window').width*.8,
    textAlignVertical : 'bottom',
    padding  : 8,
    backgroundColor : Colors.$primario,
    borderRadius : 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  textButton : {
    fontFamily: Fonts.$poppinsmedium, 
    fontSize: 20, 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: 'white',
    color: Colors.$blanco,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: Fonts.$poppinsregular,
    lineHeight: 16,
  },
});

function mapStateToProps(state) {
    return {
        perfil: state.reducerPerfil,
        prestamos: state.reducer3G,
    };
}

export default connect(mapStateToProps)(PrestamoPersonalizado);