import React, { useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LottieView from 'lottie-react-native';
import Fonts from '../../Themes/Fonts';
import { 
  reset_tyc,
  save_token_msn,
} from '../../actions/actionCarpooling';
import {
  validateUser3g,
  get_vehycle_id,
} from '../../actions/actions3g';
import {
  validate_tyc,
  accept_tyc,
  validate_qr,
  reset_error_parqueo,
  sin_cupo,
  reset_qr,
  buscar_parqueo_activo
} from '../../actions/actionParqueadero';
import { connect, useDispatch } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import estilos from './styles/reservas';
import { AuthContext } from '../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import * as RootNavigation from '../../RootNavigation';
//import Bluetooth from './BluetoothClassicHome';
import Bluetooth from './BluetoothClassic';
import { Env } from "../../Utils/enviroments";
import { TYC } from "./TyC"

function Home(props) {

  const dispatch = useDispatch();
  const { infoUser, logout } = useContext( AuthContext );
  const [isChecked, setIsChecked] = useState(true);
  const [abrirModalQR, setAbrirModalQR] = useState(false);
  const [abrirModalError, setAbrirModalError] = useState(false)
  const [tyc, setTyC] = useState(false); //valor inicial false
  const [preload, setPreload] = useState(true); //valor inicial true
  const [inputQr, setInputQr] = useState(''); //valor inicial
  const [vel__, SetVel__] = useState({});
  const [escaneando, SetEscaneando] = useState(false);//valor inicial false

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const goBack = () => { RootNavigation.navigate('Home')}

  const refresh = async () => {
    //await reservasActivas(infoUser.DataUser.idNumber);
    //await prestamoActivo(infoUser.DataUser.idNumber);
  }

  const ir_vel = async() => {
    await dispatch(reset_error_parqueo());
    await RootNavigation.navigate('MyVEL');
  }

  const validarQR = () => {
    console.log('vamos a validar el qr,', inputQr)
    SetEscaneando(true);
    setTimeout(function(){
      dispatch(validate_qr(inputQr));
    }, 2000); 
  }

  const cerrar_modal = () => {
    dispatch(reset_qr());
    setAbrirModalQR(false);
    SetEscaneando(false);
  }

  const openModalQR = () => {
    return (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Modal transparent={true} animationType="slide">
            <View style={{ backgroundColor: Colors.$texto80, flexDirection: "column", flex: 1 }}>
                <View style={styles_qr.modalStyle}>
                    <Pressable 
                        onPress={() => cerrar_modal()} 
                        style={[styles_qr.buttonClose]}>
                        <Text style={{
                            fontSize:20,
                            fontFamily: Fonts.$poppinsregular
                        }}>X</Text>
                    </Pressable>
                    
                    {
                      props.dataParqueo.validate_Qr ?
                      <Bluetooth 
                        mac={props.dataParqueo.lugar_parqueo.bluetooth} 
                        macCargado={props.dataParqueo.validate_Qr}
                        claveHC05={props.dataParqueo.lugar_parqueo.clave}
                        claveHC05Cargada={true}
                        numVehiculo={props.dataParqueo.lugar_parqueo.numero}
                        dataVehiculo={props.dataRent.vel_select.data}
                        dataParqueo={props.dataParqueo.lugar_parqueo}
                        finalizando_con={false}
                      /> 
                      :
                      <>
                      {
                        escaneando ? 
                        <LottieView source={require('../../Resources/Lotties/bicy_qr.json')}     autoPlay loop 
                          style={{
                            width: 180,
                            height: 180,            
                        }}/>
                        :
                        <Image source={Images.qr_} style={{width: 100, height: 100, marginTop: 40, marginBottom: 40}}/> 
                      }  

                      
                      <TextInput
                          style={{ 
                              color: Colors.$texto, borderWidth: 1, borderColor: Colors.$texto50, borderRadius: 30, fontFamily: Fonts.$poppinsregular, textAlign: 'center', marginBottom: 20, paddingBottom: 10, paddingTop: 10, paddingRight: 20, paddingLeft: 20, width: "50%" }}
                          placeholderTextColor={Colors.$texto80}
                          value={inputQr}
                          onChangeText={(data) => { setInputQr({data}) }}
                          keyboardType="phone-pad"
                          numberOfLines={1}
                          placeholder="Código QR"></TextInput>
                      <View style={{ flex: 0.3 }}></View>  

                      {
                        escaneando ?
                        <Pressable 
                            onPress={() => console.log('escanenado')} 
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$secundario,
                            borderRadius : 50}}> 
                            <Text style={{width: 200, color: 'white', fontFamily: Fonts.$poppinsregular, textAlign: 'center', fontSize: 18}}>Enviar</Text>
                        </Pressable>
                        :
                        <Pressable 
                            onPress={() => { 
                                validarQR()
                            }} 
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$primario,
                            borderRadius : 50}}> 
                            <Text style={{width: 200, color: 'white', fontFamily: Fonts.$poppinsregular, textAlign: 'center', fontSize: 18}}>Enviar</Text>
                        </Pressable>
                      }                    
                      </>
                    }   
                </View>
            </View>
        </Modal>
    </View>
    )
  }

  const reseteandoError = async () => {
    console.log('Reseteando')
    SetEscaneando(false);
    dispatch(reset_error_parqueo());
  }

  const openModalError = () => {
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
                                color: Colors.$texto80,
                                fontFamily: Fonts.$poppinsregular,
                                fontSize: 22,
                                margin: 10,
                                zIndex: 100
                            }}
                            >{props.dataParqueo.mensage_qr}</Text>   
   
                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: 120,
                                height: 120,                                
                              }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_error.json')} autoPlay loop 
                                style={{
                                  width: 120,
                                  height: 120            
                                }}/>
                            </View>           
                                         

                    <Pressable 
                        onPress={() => { 
                          reseteandoError();
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

  const aceptTyC = async() => {
    if (isChecked) {
      await dispatch(accept_tyc());
      await setLoadedTrips(true);
      setTimeout(function(){
        setLoadedTrips(false);
      }, 1000);
    }
    if (!isChecked) {
      Alert.alert('Debe aceptar términos y condiciones.')
    }
  }

  const markerRender = () => {
    return (
        <View style={styles_qr.rectangleContainer}>
            <View
                style={[
                    styles_qr.rectangle
                ]}
            />
        </View>
    )
  }

  useEffect(() => {
    refresh();
  },[])

  useFocusEffect( 
    React.useCallback(() => { 
      refresh(); 
      dispatch(validate_tyc());
    },[])
  );

  useEffect(() => {
    dispatch(validate_tyc());
    //dispatch(buscar_parqueo_activo());
  },[])

  useEffect(() => {
    if (props.dataParqueo.verify_tyc) {
      setTyC(true);  
      if (props.dataParqueo.ultimo_vehiculo === 'sin vehiculo') {
        console.log('no tiene un vehiculo asignado', props.dataParqueo.ultimo_vehiculo)
        RootNavigation.navigate('MyVEL');
      }else {
        console.log('si tenemos id ultimo vehiculo es:',props.dataParqueo.ultimo_vehiculo)
        dispatch(get_vehycle_id(props.dataParqueo.ultimo_vehiculo))
      }
    }
  },[props.dataParqueo.verify_tyc])

  useEffect(() => {
    if (props.dataRent.vel_select_cargado) {
      console.log('VEL por id es : ', props.dataRent.vel_select)
      SetVel__(props.dataRent.vel_select);
    }
  },[props.dataRent.vel_select_cargado])

  useEffect(() => {
    if (props.dataParqueo.save_tyc) {
      Alert.alert('Se aceptaron los T&C correctamente');
      RootNavigation.navigate('MyVEL');
      setTyC(true);
    }
  },[props.dataParqueo.save_tyc])

  useEffect(() => {
    setTimeout(function(){
      setPreload(false);
    }, 3000); 
  },[])

  //validando los errores
  useEffect(() =>{
    if (props.dataParqueo.validate_Qr) {
      console.log('Se validó el qr y ya puedes utlizar el parqueo');
    }
  },[props.dataParqueo.validate_Qr])

  useEffect(() => {
    if (props.dataParqueo.seParqueo) {
        console.log('se parqueo correctamente, ir a vista parqueo'); 
        dispatch(buscar_parqueo_activo());
    }
  }, [props.dataParqueo.seParqueo])  

  if (preload) {
    return (
      <View style={styles.contenedor}>
        <LottieView 
          source={require('../../Resources/Lotties/parqueo_loader.json')} autoPlay loop 
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width,             
          }}
        />
      </View>
    );
  }else {
    if (!tyc) {
      return (
        <ImageBackground source={Images.fondoMapa} style={{        
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          justifyContent: 'center',
          alignItems: 'center',
          }}>
          <View style={styles_tyc.cajaTyC}>
            <View  style={styles_tyc.cajaTituloCerrar}>
              <Text style={styles_tyc.textTitleTyC}>Reglas de uso - T&C</Text>
              <Pressable 
                onPress={() => goBack()}
                style={{
                  zIndex: 1000,
                }}>
                  <Image source={Images.x_icon} style={[styles_tyc.iconBici]}/>   
              </Pressable>                       
            </View>
            
            <View style={styles_tyc.LineaHorizontal }></View>
            <ScrollView style={styles_tyc.cajaScrool}>
              <TYC />
            </ScrollView>

            <View  style={styles_tyc.cajaAceptarContinuar}>
              <View style={styles_tyc.CajaHorCenter}>
                
                { isChecked ?
                  <Pressable
                    onPress={() => toggleCheckBox()}
                    style={styles_tyc.btnCheckOK}
                  />:
                  <Pressable
                    onPress={() => toggleCheckBox()}
                    style={styles_tyc.btnCheck}
                  />
                }
                
                <Text style={{fontFamily: Fonts.$poppinsregular}}>Aceptar téminos y condiciones</Text>
              </View>
              
              <View style={styles_tyc.cajaContinuar}> 
                <Text></Text>
                <Pressable 
                  onPress={() => { aceptTyC() }} 
                  style={styles_tyc.buttonTyC}>
                  <Text style={styles_tyc.textoTyC}>Continuar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      );
    }else {
      return (
        <View style={styles.imgFondo}>
          { abrirModalQR ? openModalQR() : <></>}
          { props.dataParqueo.mensaje_error ? openModalError() : <></>}
          <KeyboardAwareScrollView>
          <View style={{        
              flex: 1,
              width: '100%', 
              justifyContent: 'center',
              }}>
            <View style={styles.contenedor}>

              <View style={styles.cajaCabeza}>
                  <Pressable  
                      onPress={() => { goBack() }}
                      style={ styles.btnAtras }>
                      <View>
                      <Image source={Images.menu_icon} style={[styles.iconMenu]}/> 
                      </View>
                  </Pressable>
                  <Text style={styles.titulo}>Parqueaderos</Text>
              </View>

              <Text style={{
                width: Dimensions.get('window').width*.9,
                fontSize: 16,
                fontFamily: Fonts.$poppinsregular,
                color: Colors.$texto50
              }}>{ props.dataRent.vel_select_cargado ? 'Vehículo utilizado en el último parqueo' : 'No se ha cargado el vehículo' }</Text>
              <View style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height*.1,
                backgroundColor: Colors.$blanco,
                marginBottom: 20,
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "row",
              }}>
                {
                  props.dataRent.vel_select_cargado ? 
                  <Pressable
                    onPress={() => ir_vel()}
                    style={{
                      backgroundColor: Colors.$secundario20,
                      width: "90%",
                      height: "100%",
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  > 
                    <View style={{
                      width: "100%",
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}>
                        <Image source={{ uri: props.dataRent.vel_select.data.vus_img }} style={{width: 70,height: 70,borderRadius: 35}}/>
                        <View style={{ 
                            width: '50%',
                            height: '90%',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'start',
                        }}>
                          <Text style={{fontSize: 20,fontSize: 16,color: Colors.$texto,textAlign: 'center',fontFamily: Fonts.$poppinsmedium}}>{props.dataRent.vel_select.data.vus_tipo}</Text> 
                          <Text style={{
                            width: '100%',
                            height: 3,
                            backgroundColor: Colors.$texto
                          }}></Text> 
                          <Text style={{
                            fontSize: 16,
                            color: Colors.$texto50,
                            textAlign: 'center',
                            fontFamily: Fonts.$poppinsmedium}}>{props.dataRent.vel_select.data.vus_serial}</Text>  
                        </View>
                        <View style={{
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Image source={Images.iconoatras} style={{width: 40,height: 40,}}/>
                            <Text style={{fontSize: 14, fontFamily: Fonts.$poppinsregular}}>Cambiar</Text>
                        </View>
                       
                    </View>
                  </Pressable>
                  :
                  <></>
                } 
              </View>      

              <View style={{
                    width: Dimensions.get('window').width,
                    height: 'auto',
                    backgroundColor: Colors.$blanco,
                    justifyContent: 'space-between',
                    alignItems: 'center',
              }}>

                  <View style={{
                    width: Dimensions.get('window').width,
                    height: 'auto',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}>
                      <Text style={{
                        fontFamily: Fonts.$poppinsregular,
                        color: Colors.$texto,
                        fontSize: 20,
                        width: Dimensions.get('window').width*.8,
                        textAlign: 'center',
                      }}>
                          Ubica el código QR que deseas
                          escanear en el recuadro
                      </Text>
                  </View>

                  <View style={{
                      height: Dimensions.get('window').width,
                      width: Dimensions.get('window').width,
                      overflow: 'hidden',
                      position: 'relative',
                  }}>
                    {/*<QRCodeScanner
                        showMarker
                        ref={(node) => { scanner = node }}
                        reactivate={false}
                        customMarker={markerRender()}
                        onRead={(data) => {
                          console.log('qr', data.data)
                        }}
                        flashMode={RNCamera.Constants.FlashMode.torch}
                    />*/}
                    <Pressable 
                        onPress={() => switchTorchState() } 
                        style={{  
                            backgroundColor: Colors.$blanco,
                            width: 60,
                            height: 80,  
                            paddingTop: 10,
                            paddingBottom: 10,
                            textAlign: "center",
                            borderRadius : 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                        }}> 
                        <View style={{
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                            {<Image source={Images.linterna_} style={{width: 50, height: 50, tintColor: Colors.$blanco, borderRadius: 25, backgroundColor:Colors.$texto, padding: 5}}/>}
                            <Text style={{fontSize: 12, fontFamily: Fonts.$poppinsregular, color: Colors.$texto}}>Linterna</Text> 
                        </View>                          
                    </Pressable>

                    <Pressable 
                          onPress={() => setAbrirModalQR(true) } 
                          style={{    
                            backgroundColor: Colors.$blanco,
                            width: 60,
                            height: 80,  
                            paddingTop: 10,
                            paddingBottom: 10,
                            textAlign: "center",
                            borderRadius : 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: 100,
                            right: 10,
                          }}> 
                          <View style={{
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                              
                              {<Image source={Images.qr_} style={{width: 50, height: 50, tintColor: Colors.$blanco, borderRadius: 25, backgroundColor:Colors.$texto, padding: 5}}/>}
                              <Text style={{fontSize: 12, fontFamily: Fonts.$poppinsregular, color: Colors.$texto}}>Manual</Text>
                          </View>
                      </Pressable>
                  </View>

                  {/*<View style={{
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height*.1,
                      flexDirection: 'row',
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'space-around'
                  }}>
                      
                      
                  </View>*/}
              </View>

              <View style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height*.1,
                backgroundColor: Colors.$blanco,
                marginBottom: 20,
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "row",
                marginTop: 20,
                marginBottom: 20
              }}>
                <Pressable
                  onPress={() => dispatch(sin_cupo())}
                  style={{
                    width: "60%",
                    height: "80%",
                    backgroundColor: Colors.$primario,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                > 
                  <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$blanco, fontSize: 20}}>No hay cupo</Text>
                </Pressable>
              </View>
              
            </View>
          </View>
          </KeyboardAwareScrollView>
        </View>
      );  
    }
  }

  
  
}

const styles_tyc = StyleSheet.create({
  cajaTyC: {
    backgroundColor: Colors.$blanco,
    width: Dimensions.get('window').width*.9,
    height: Dimensions.get('window').height*.8,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  cajaTituloCerrar: {
    width: Dimensions.get('window').width*.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textTitleTyC: {
    width: Dimensions.get('window').width*.5,
    textAlign: 'center', 
    fontSize : 18, 
    fontFamily : Fonts.$poppinsmedium,
    alignItems: "center",
    color: Colors.$texto,
  },
  iconBici: {
    width: 50,
    height: 50,
    zIndex: 100
  },
  LineaHorizontal: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.$texto,
    marginTop: 10,
    marginBottom: 10
  },
  cajaScrool:{
    width: "100%",
    height: "60%",
  },
  cajaAceptarContinuar:{
    width: "90%",  
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20
  },
  CajaHorCenter:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  cajaContinuar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  btnCheck: {
    width: 20,
    height: 20,
    borderWidth : 3,
    borderColor : Colors.$texto,
    borderRadius : 1,
    marginRight: 5
  },
  btnCheckOK: {
    width: 20,
    height: 20,
    borderWidth : 3,
    borderColor : Colors.$texto,
    borderRadius : 1,
    backgroundColor: Colors.$adicional,
    marginRight: 5
  },
  buttonTyC: {
    width: "60%",
    height: 30,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    zIndex: 100,
    borderRadius: 15,
  },
  textoTyC: {
    fontFamily: Fonts.$poppinsregular, 
    textAlign: "center", 
    justifyContent: "center",
    fontSize: 20, 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: Colors.$blanco,
  },
});

const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      alignItems: "center",
      justifyContent: "center",
      position: 'relative',
      backgroundColor: '#FFFFFF',
    },
    cajaAnimacion: {
      width: Dimensions.get('window').width,
      height: 250,
    },
    imgFondo: {
      flex: 1,
      width: '100%', 
      justifyContent: 'center',
    },
    gif: {
      width: Dimensions.get('window').width,
      height: 250, 
    },
    cajaCabeza: {
      justifyContent: 'space-between',
      alignItems: 'center', 
      borderRadius: 1,
      width: Dimensions.get('window').width,
      height: 80,
      zIndex: 10000,
      flexDirection: 'row',
      position: 'relative',
      top: 0,
    },
    titulo: {
      fontFamily: Fonts.$poppinsmedium, 
      fontSize: 22, 
      color: Colors.$texto,
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    logoGif: {
      width: 120,
      height: 120,
      zIndex: 100
    },
    textTitle: {
      marginTop: 20, 
      marginBottom: 20, 
      fontSize : 25, 
      fontFamily : Fonts.$poppinsmedium,      
      alignSelf: "center",
      color: 'white',
    },
    btnAtras:{
      position: 'absolute',
      top: 15, 
      left: 10,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      zIndex: 100
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    containerButtons : {
      marginTop: 15, 
      marginBottom: 15, 
      alignSelf: 'center',
    },
    
    button : { 
      width: Dimensions.get('window').width*.5,
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
    },
    
    textButton : {
      fontFamily: Fonts.$poppinsmedium, 
      fontSize: 20, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: 'white',
      color: Colors.$blanco,
      alignSelf: "center",
      width: '80%',
      textAlign: 'center',
    },
});

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
    borderRadius: 20, marginVertical: 200, marginHorizontal: 25, justifyContent: "space-around", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 10, height: 'auto', width: 'auto'
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
    backgroundColor: Colors.$secundario
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


function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    dataParqueo: state.reducerParqueadero
  }
}
export default connect(mapStateToProps)(Home);
