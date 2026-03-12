import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Dimensions,
  ScrollView,
  Image,
  Alert,
  Modal,
  ImageBackground,
  Animated
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { connect, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { 
  get_trip_select_carpooling,
  init_trip_carpooling,
  get_pasajeros,
  reset_state_pago,
  get_pagos_trip,
  patch_estado_pago,
  reset_patch_pago_ok,
  trip_select_solicitud_reset,
  trip_select_solicitudes,
  save_km_to_points
} from '../../actions/actionCarpooling';
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import { Estrellas } from '../../Components/carpooling/Estrellas';
import { CarpoolingChat } from '../../Containers/Carpooling/CarpoolingChat';
import { Mapa } from '../../Components/carpooling/Mapa';
import { Cronometro } from '../../Components/carpooling/Cronometro';
import LottieView from 'lottie-react-native';

function CarpoolingTripInProcess (props){
  const dispatch = useDispatch();
  
  const [ alturaMapa ] = useState(new Animated.Value(Dimensions.get("window").height * 0.6));
  const [ dataTrip, setDataTrip ] = useState('');
  const [ modalChat, setModalChat ] = useState(false);
  const [ idChat, setIdChat ] = useState('');
  const cronometroRef = useRef();
  
  const goBack = () => {  
    switch (props.stateDrawer) {
      case 'Unirme':
        props.navigation.navigate('CarpoolingTripRider');
      break;
      case 'Compartir':
        props.navigation.navigate('CarpoolingAddTrip');
      break;
      case 'Itinerario':
        props.navigation.navigate('CarpoolingDriverTrips');
      break;
      case 'Historial':
        props.navigation.navigate('CarpoolingSolicitudesRider');
      break;
      case 'Soporte':
        props.navigation.navigate('CarpoolingSupport');
      default:
        break;
    }
  }

  const data_viaje = async (id, donde) => {
    await dispatch(get_pasajeros(id));
    await dispatch(get_trip_select_carpooling(id));
  }
  useEffect(() => {
    if (props.dataCarpooling.tripSelectCargada ) {
      data_viaje(props.dataCarpooling.tripSelect, 'efectoA');
    }
  },[props.dataCarpooling.tripSelectCargada]);

  useEffect(() => {
    if (props.dataCarpooling.dataTripSelectCargada ) {
      setDataTrip(props.dataCarpooling.dataTripSelect);
      if(props.dataCarpooling.tripEstado === 'PROCESO'){
        data_viaje(props.dataCarpooling.dataTripSelect._id);
        dispatch(get_pagos_trip(props.dataCarpooling.dataTripSelect._id));
      }
    }
  },[props.dataCarpooling.dataTripSelectCargada]);


  useEffect(() => {
    if (props.dataCarpooling.dataTripPatch ) {
      setDataTrip(props.dataCarpooling.dataTripSelect);
    }
  },[props.dataCarpooling.dataTripPatch]);

  useEffect(() => {
    if (props.dataCarpooling.patchSolicitud) {
      dispatch(get_pasajeros(props.dataCarpooling.tripSelect))
    }
  },[props.dataCarpooling.patchSolicitud])

  useEffect(() => {
    if (props.dataCarpooling.tripEstado === 'PROCESO') {
      cronometroRef.current?.iniciar();
    }
  }, [props.dataCarpooling.tripEstado]);

  const iniciar = async (id) => {
    await dispatch(init_trip_carpooling(id, { estado: "PROCESO" }));
    await dispatch(get_pagos_trip(id));
  };
  
  const finalizar = async (id) => {
    cronometroRef.current?.finalizar();
    setTimeout(() => {
      RootNavigation.navigate('CarpoolingExperience');
    }, 1000);
  };

  useEffect(() => {
    if (props.dataCarpooling.pagoCreado) {
      setDataTrip(props.dataCarpooling.dataTripSelect);
      dispatch(reset_state_pago());
    }
  },[props.dataCarpooling.pagoCreado])


  const irChat = async (id) => {
    await setIdChat(id)
    await setModalChat(true)
  }

  const cajaModalChat = () => {
    return (
      <View style={ stylesModal.contenedorModal}>
          <Modal transparent={true} animationType="slide">
            <View style={ stylesModal.cajaModal }>
              <View style={ stylesModal.cajaModal2 }>
                <CarpoolingChat idChat={idChat}/>  
                <View style={ stylesModal.cabezaModal}>
                  <Pressable  
                    onPress={() => setModalChat(false)}
                    style={{ position: 'absolute', top: 10, left: 10}}>
                        <Image style={{width:50, height: 50}} resizeMode='contain' source={Images.iconoatras}/>
                  </Pressable> 
                  <Text style={stylesModal.titulo}>Chat Grupal carpooling</Text>
                </View>     
              </View> 
            </View>
          </Modal>
      </View>
    )
  }

  const formatearFecha =  (fecha) => {
    let fechaF = new Date(fecha);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones);      
    return(fechaFormateada);
  }

  useFocusEffect( 
    React.useCallback(() => {
      if (props.dataCarpooling.dataTripSelectCargada ) {
        if(props.dataCarpooling.tripEstado === 'PROCESO'){
          dispatch(get_pagos_trip(props.dataCarpooling.dataTripSelect._id));
        }
      }      
    }, [])
  );

  const irNotificaciones = async (data) => {
    await dispatch(trip_select_solicitud_reset());
    setTimeout(function(){
        dispatch(trip_select_solicitudes(data))
        RootNavigation.navigate('CarpoolingSolicitudesViaje');
    }, 1000);
  }

  const [ coorSalidaSolicitud, setCoorSalidaSolicitud ] = useState('');
  const [ coorLlegadaSolicitud, setCoorLlegadaSolicitud ] = useState('');
  const [ activaRutaSolicitud, setActivaRutaSolicitud ] = useState(false);
  const [ calculoDistance, setCalculoDistance ] = useState('');
  const [ calculoDuracionGoogle, setCalculoDuracionGoogle ] = useState('');

  const verificarPago = async (id) => {
    let data = { 
      "estado": "APROBADO"
    }
    await dispatch(patch_estado_pago(id, data));
  }

  const resetPago = async () => {
    await dispatch(reset_patch_pago_ok());
    await dispatch(get_pagos_trip(props.dataCarpooling.dataTripSelect._id));    
  }

  const refreshPagos = async () => {
    await dispatch(get_pagos_trip(props.dataCarpooling.dataTripSelect._id)); 
  }

  useEffect(() => {
    if (props.dataCarpooling.patch_pago_ok) {
      resetPago()
    }
  },[props.dataCarpooling.patch_pago_ok])

  const valorDistancia = (valor) => {
    setCalculoDistance(valor);
    const km = Math.ceil(valor);
    dispatch(save_km_to_points(km));
  }

  const valorDuracionGoogle = (valor) => {
    setCalculoDuracionGoogle(valor)
  }
  
  return(
    <View style={styles.contenedor}>
      {(modalChat) ? cajaModalChat() : <></>} 
      {
        props.dataCarpooling.dataTripSelectCargada && props.dataCarpooling.dataTripSelect !== null ? 
        <>
          {
            props.dataCarpooling.tripEstado === 'ACTIVA' ? 
            <ImageBackground source={Images.fondoMapa} style={{        
              flex: 1,
              width: '100%', 
              justifyContent: 'center'
              }}>
            <View style={styles.cajaACTIVA}>

              <View style={[styles.cajaInfo]}>
                <Pressable  
                    onPress={() => { goBack() }}
                    style={styles.btnAtrasActivo}>
                    <View>
                    <Image source={Images.x_icon} style={{width: 40, height: 40}}/> 
                    </View>
                </Pressable>
                <Text style={[styles.textTitleACTIVA]}>Detalles del viaje</Text>

                <View style={styles.cajaInfoInterna}>
                  <View style={[styles.cajaArriba]}>
                    <View style={styles.cajaPartidaA}>
                      <Text style={styles.textFecha}>Partida: { props.dataCarpooling.dataTripSelect.lSalida }</Text>
                      <Text style={{ fontSize: 18, color: Colors.$texto50 }}>
                        { props.dataCarpooling.dataTripSelect.compartidoVehiculo.marca}
                        { props.dataCarpooling.dataTripSelect.compartidoVehiculo.color}
                      </Text>
                    </View>

                    <View style={styles.cajaPartidaImg}>
                      <Image source={Images.carroblanco} style={styles.imgCarro}/>
                    </View> 
                  </View>
                  
                  <View style={ styles.LineaHorizontal }></View>

                  <View style={styles.cajaAbajo}>
                    <View style={styles.cajaPartidaB}>
                      <Text style={{width: '100%', color: Colors.$texto50, fontSize: 16}}>
                        { formatearFecha(props.dataCarpooling.dataTripSelect.fecha) }</Text>
                      <Text style={{width: '50%',  color: Colors.$texto50 , fontSize: 16}}>Cupos: { Number(props.dataCarpooling.dataTripSelect.asientosIda) }</Text>   
                      <Pressable style={styles.buttonTouchableRiders} onPress={() => irNotificaciones(props.dataCarpooling.dataTripSelect)}>
                          <Text style={{ fontSize: 18 }}>Pasajeros </Text>
                          <Image 
                              source={Images.flecha_icon} 
                              style={{width: 25, height: 25}}
                            /> 
                      </Pressable>     
                      {
                        props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ?
                        <Text style={styles.subTitle}>${props.dataCarpooling.dataTripSelect.precio}</Text> 
                        :null
                      }
                             
                    </View>
                    <View style={styles.cajaImgChat}>
                    <Pressable 
                      onPress={() => irChat(props.dataCarpooling.dataTripSelect._id)}
                      >
                      <Image source={Images.iconochatActivo} style={styles.imgChat}/>
                    </Pressable>
                    </View> 
                  </View> 
                </View>

                <View>
                  <Pressable 
                    onPress={() => iniciar(props.dataCarpooling.dataTripSelect._id)}
                    style={styles.buttonTouchableGray}
                  >
                    <Text style={styles.textButton}>Iniciar</Text>
                  </Pressable>        
                </View>         
              </View>
              
            </View>
            </ImageBackground>
            :
            <></>
          }

          {
            props.dataCarpooling.tripEstado === 'PROCESO' ? 
            
            <View style={styles.cajaPROCESO}>
              <ScrollView style={{height: "100%"}}>
              <View style={styles.cajaCabeza}>
                  <Text style={styles.textTitle}>Viaje en Proceso</Text>
                  <Pressable  
                      onPress={() => { goBack() }}
                      style={ styles.btnAtras }>
                      <View>
                      <Image source={Images.atras_Icon} style={[styles.iconBici, {tintColor : 'black'}]}/> 
                      </View>
                  </Pressable>
              </View>
              
              <Mapa 
                coorSalida={props.dataCarpooling.dataTripSelect.coorSalida} 
                coorLlegada={props.dataCarpooling.dataTripSelect.coorDestino} 
                coorCargadas={true}
                ruta={true}
                coorSalidaSolicitud={coorSalidaSolicitud}
                coorLlegadaSolicitud={coorLlegadaSolicitud}
                rutaSolicitud={activaRutaSolicitud}
                valorDistancia={valorDistancia}
                valorDuracionGoogle={valorDuracionGoogle}
                alturaMapa={alturaMapa}
              />
              
              <>
              {
                props.dataCarpooling.rol === 'Conductor' ? 
                <>
                <View style={{
                  width: Dimensions.get('window').width,
                  padding: 20,
                  borderRadius: 40,
                  marginTop: -30,
                  backgroundColor: Colors.$blanco,
                  alignItems: 'center'
                }}>
                  <View style={styles.cajaAbajo}>
                    <View style={styles.cajaPartidaB}>
                      <Text style={{fontFamily: Fonts.$poppinsregular, fontSize: 16, color: Colors.$texto50, marginLeft: 5}}>Salida</Text>
                      <Text style={{fontFamily: Fonts.$poppinsregular, textAlign: 'left', fontSize: 20, marginBottom: 20}}> {props.dataCarpooling.dataTripSelect.lSalida}</Text>
                      <Text style={{fontFamily: Fonts.$poppinsregular, fontSize: 16, color: Colors.$texto50, marginLeft: 5}}>Llegada</Text>
                      <Text style={{fontFamily: Fonts.$poppinsregular, textAlign: 'left', fontSize: 20, marginBottom: 20}}> {props.dataCarpooling.dataTripSelect.llegada}</Text>

                      <Text style={{fontFamily: Fonts.$poppinsregular, fontSize: 16, color: Colors.$texto50, marginLeft: 5}}>Vehículo</Text>
                      <Text style={{fontFamily: Fonts.$poppinsregular, textAlign: 'left', fontSize: 20, marginBottom: 20, marginLeft: 5}}> 
                        { props.dataCarpooling.dataTripSelect.compartidoVehiculo.marca } {' '} 
                        { props.dataCarpooling.dataTripSelect.compartidoVehiculo.color } {' '} 
                        { props.dataCarpooling.dataTripSelect.compartidoVehiculo.placa }
                      </Text>
                      <Text style={{fontFamily: Fonts.$poppinsregular, fontSize: 16, color: Colors.$texto50, marginLeft: 5}}>Fecha</Text>
                      <Text style={{fontFamily: Fonts.$poppinsregular, textAlign: 'left', fontSize: 20, marginBottom: 20, marginLeft: 5}}> 
                        {formatearFecha(props.dataCarpooling.dataTripSelect.fecha)}
                      </Text>      
                    </View>
                  </View>  

                  <View style={{
                    flexDirection: 'row',
                    width: "100%",
                    backgroundColor: Colors.$secundario20,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Text style={{fontFamily: Fonts.$poppinsregular, fontSize: 20, color: Colors.$texto80, marginLeft: 5}}>Chat Grupal</Text>
                    <Pressable 
                      onPress={() => irChat(dataTrip._id)}
                      >
                      <Image source={Images.iconochatActivo} style={styles.imgChat}/>
                    </Pressable>
                  </View> 
                </View>
                {
                props.dataCarpooling.pagosViajeCargada ?
                <View style={{
                  width: Dimensions.get('window').width,
                  padding: 30,
                  borderRadius: 50,
                  marginTop: 10,
                  backgroundColor: Colors.$blanco,
                  alignItems: 'center'
                }}>
              {
                props.dataCarpooling.pagosViaje.map((data) => {
                  const imagenUrl = data.bc_usuario.usu_img;
                  const imagenDefault = Images.userCar;

                  // Validar si la URL de la imagen es válida o si es 'sin imagen'
                  const urlFinal = (imagenUrl && imagenUrl !== 'sin imagen' && imagenUrl !== null) ? imagenUrl : imagenDefault;

                  return (
                    <View style={styles.cajaPasajeros} key={data._id}>
                      <Image
                        style={styles.logo}
                        source={{ uri: urlFinal }} // Usar la URL validada
                      />
                      <View style={styles.cajaDatosPasajero}>
                        <View style={styles.cajaDatosPasajeroV}>
                          <Text style={styles.textSolicitud}>{data.bc_usuario.usu_nombre}</Text>
                          <View style={styles.cajaRow}>
                            <Estrellas calificacion={data.bc_usuario.usu_calificacion || 5} />
                            { 
                            props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ?
                              <Text style={{ fontSize: 18, color: Colors.$texto, fontWeight: 'bold' }}>$ {data.valor}</Text>:null
                            }
                          </View>

                          {
                          props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ?
                          <View style={[styles.cajaRow, { marginTop: 10 }]}>
                            {
                              data.estado === 'PENDIENTE' ?
                                <View>
                                  <Pressable
                                    onPress={() => verificarPago(data._id)}
                                    style={{
                                      width: 140,
                                      backgroundColor: Colors.$primario,
                                      borderRadius: 10,
                                      padding: 10,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Text style={{ color: Colors.$blanco }}>Confirmar pago</Text>
                                  </Pressable>
                                </View>
                                :
                                <Text style={{
                                  width: 100,
                                  backgroundColor: Colors.$adicional50,
                                  padding: 5,
                                  borderRadius: 10,
                                  textAlign: 'center',
                                  alignSelf: 'center',
                                }}>
                                  {data.estado === 'APROBADO + COMENTARIO' ? 'APROBADO' : data.estado}
                                </Text>
                            }
                            { data.metodo.includes("Daviplata") ? <Image source={Images.logodaviplata} style={{width : 30, height : 30, borderRadius: 10}}/> : <></> }
                            { data.metodo.includes("Efectivo") ? <Image source={Images.iconobillete} style={{width : 30, height : 30, borderRadius: 10}}/> : <></> }
                            { data.metodo.includes("Nequi") ? <Image source={Images.logonequi} resizeMode='contain' style={{width : 30, height : 30, borderRadius: 10}}/> : <></> }
                          </View>:null
                          }
                        </View>
                      </View>
                    </View>
                  );
                })
              }
                </View>
                :
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height*.8,
                    backgroundColor: 'white'
                }}>   
                               
                  <Image source={require('../../Resources/gif/loadingCar.gif')} style={{width: 250, height: 250}} />
                  <Pressable
                    onPress={() => refreshPagos()}
                  >
                    <Text>Refrescar</Text>
                  </Pressable>
                </View>                
              }
                </>
                :
                <></>
              }
              </>
              
              

              {
                props.dataCarpooling.rol === 'Conductor' ? 
                <>
                <Text style={{
                  textAlign: 'center',
                  fontSize: 24,
                  fontFamily: Fonts.$poppinsregular
                }}>Indicadores</Text>
              
                <View style={{
                    width: Dimensions.get('window').width,
                    backgroundColor: Colors.$blanco,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'space-around',
                    padding: 20,
                    marginBottom: 30,
                    marginTop: 30
                }}>
                    <View style={{
                        backgroundColor: Colors.$texto,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Cronometro ref={cronometroRef} />
                    </View> 
                    <View style={{
                        backgroundColor: Colors.$texto,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{color: Colors.$blanco}}>Kms</Text>
                        <Text style={{color: Colors.$blanco}}>{calculoDistance}</Text>
                    </View>    
                    <View style={{
                        backgroundColor: Colors.$texto,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{color: Colors.$blanco}}>Puntos</Text>
                        <Text style={{color: Colors.$blanco}}>{Math.ceil(calculoDistance)}</Text>
                    </View> 
                </View>  


                <View style={{ alignItems: "center", marginBottom: 50}}>
                
                <Pressable 
                  onPress={() => finalizar('1')}
                  style={styles.buttonTouchableGray}
                >
                  <Text style={styles.textButton}>Finalizar</Text>
                </Pressable>
                
                </View>
                </>
                
                :
                <></>
              }
              </ScrollView>
            </View>            
            :
            <></>
          }
          
        </>
        :
        <>
        <Modal transparent={true}>
            <View style={{ backgroundColor: Colors.$secundario80, flexDirection: "column", flex: 1 }}>
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
        </>
        }
    </View>
  );
}

const styles = StyleSheet.create({
  cajaDatosResumen: {
    width: Dimensions.get('window').width,
    backgroundColor: Colors.$blanco,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 30
  },
  gif: {
    width: Dimensions.get('window').width*.8,
    height: 250, 
  },
  cajaDatosItem: {
    width: 80,
    height: 80,
    backgroundColor: Colors.$blanco,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  cajaDatosItemHome: {
      width: 50,
      height: 50,
      backgroundColor: Colors.$blanco,
      borderRadius: 25,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 10,
      left: 10,
      margin: 10,
      zIndex: 1000
  },
  vpkm: {
    width: 40,
    height: 40,
    color: Colors.$texto
  },
  contenedor: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.$blanco,
    alignItems: "center",
    position: "relative"
  },
  cajaCabeza: {
    backgroundColor: Colors.$primario,
    justifyContent: 'space-around',
    alignItems: 'center', 
    borderWidth : 1,
    borderColor : Colors.$primario,
    borderRadius: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    position: 'relative'
  },
  cajaCabeza1: {
    width: Dimensions.get('window').width,
    height: 100,
    justifyContent: 'space-around',
    alignItems: 'center', 
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
  },
  textTitleACTIVA:{
    marginBottom: 20, 
    marginTop: 20, 
    fontSize : 25, 
    fontFamily : Fonts.$poppinsregular,
    color: Colors.$texto,
  },
  textTitle: {
    position : 'absolute',
    bottom: 0,
    left: 40,
    marginBottom: 20, 
    fontSize : 25, 
    fontFamily : Fonts.$poppinsregular,
    
    color: Colors.$texto,
  },  
  cajaInfo: {
    backgroundColor: Colors.$blanco,
    width: Dimensions.get('window').width*.9,
    alignItems: 'center',
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 15
  },
  cajaInfoInterna: {
    width: '95%',
    borderRadius: 20,
    borderColor: Colors.$secundario,
    borderWidth: 1,
    borderRadius: 25,
    padding: 15
  },
  btnAtras:{
    position: 'absolute',
    top: 20, 
    left: 5,
    width: 50,
    height: 50,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  btnAtrasActivo:{
    position: 'absolute',
    top: 5, 
    left: 5,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  cajaArriba:{
    width: "100%",
    flexDirection: 'row',
  },
  cajaAbajo:{
    width: "100%",
    flexDirection: 'row',
    marginTop: 15
  },
  cajaPartidaA: {
    width: "60%",
    alignItems: 'left'
  },
  cajaPartidaB: {
    width: "80%",
    alignItems: 'left',
  },
  cajaPartidaImg: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  cajaImgChat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBici: {
    width: 30,
    height: 30,
  },
  iconNequi: {
    width: 25,
    height: 35,
  },
  spinner: {
    width: 50,
    height: 50,
    borderColor: '#333',
    borderWidth: 3,
    borderRadius: 25,
    borderTopWidth: 0,
    textAlign: 'center',
  },
  cajaACTIVA: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },
  cajaPROCESO: {
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.$blanco,
    margin: 0,
    borderRadius: 20
  },
  buttonTouchableGray: { 
    width: Dimensions.get('window').width*.5,
    textAlignVertical : 'bottom',
    padding  : 5,
    margin : 10,
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
  buttonTouchableRiders: { 
    width: Dimensions.get('window').width*.5,
    padding  : 10,
    margin : 10,
    backgroundColor : Colors.$secundario,
    borderRadius : 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontFamily: Fonts.$poppinsregular, 
    textAlign: "center", 
    fontSize: 20, 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: Colors.$blanco,
    
    alignSelf: "center",
  },
  subTitle: {
    fontFamily: Fonts.$poppinsregular, 
    fontSize: 20,
    color: Colors.$texto,
    
    marginBottom: 15,
    marginTop: 15,
  },
  textFecha: {
    width: "100%",
    fontFamily: Fonts.$poppinsregular, 
    fontSize: 16,
    color: Colors.$overlayTranslucid,
  },
  cajaPasajeros: {
    width: Dimensions.get('window').width*.9,
    padding: 10,
    backgroundColor: Colors.$blanco,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth : 1,
    borderColor : Colors.$texto20,
    borderRadius : 15,
  },
  cajaDatosPasajeroV: {
    width: Dimensions.get('window').width*.6,
    padding: 10,
    alignItems: 'left',
    justifyContent: 'center',
  },
  cajaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  cajaDatosPasajero: {
    flexDirection: "row"
  },
  textSolicitud: {
    fontFamily: Fonts.$poppinsregular, 
    fontSize: 20,
    color: Colors.$texto,
    
  },
  btnAceptar: {
    height: 30,
    width: 100,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  mapa: {
    flex: 1, 
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height*.8,
  },
  LineaHorizontal: {
    width: "100%",
    height: 3,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: Colors.$texto,
  },
  imgCarro: {
    width: 100,
    height: 100,
  },
  imgChat: {
    width: 50,
    height: 50,
    tintColor: Colors.$texto
  }
});

const stylesModal = StyleSheet.create({
  contenedorModal: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  cajaModal: { 
    backgroundColor: "rgba(52, 52, 52, 0.9)", 
    flexDirection: "column", 
    flex: 1,
    height: Dimensions.get('window').width*.5
  },
  cajaModal2: { 
    flex: 1, 
    borderRadius: 20, 
    marginVertical: 1, 
    marginHorizontal: 1,
    backgroundColor: Colors.$blanco,
    position: 'relative'
  },
  cabezaModal: {
    position: 'absolute',
    top: 0,
    width: "100%",
    height: 100,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,

  }
})

function mapStateToProps(state) {
  return {
    dataRent: state.reducer3G,
    dataCarpooling: state.reducerCarpooling,
    stateDrawer : state.reducerCarpooling.carpoolingDrawer,
    perfil: state.reducerPerfil
  }
}
  
export default connect(mapStateToProps)(CarpoolingTripInProcess);