import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Dimensions,
  Image,
  Alert,
  Modal,
  Animated
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { connect, useDispatch } from 'react-redux';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import { 
  get_trip_select_carpooling,
  init_trip_carpooling,
  get_pasajeros,
  accept_solicitud,
  getDataPago
} from '../../actions/actionCarpooling'
import moment from 'moment';
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import { Env } from "../../../keys";
import colores from '../../Themes/Colors';
import { CarpoolingChat } from '../../Containers/Carpooling/CarpoolingChat';
import { Estrellas } from '../../Components/carpooling/Estrellas';
import { Mapa } from '../../Components/carpooling/Mapa';

const mapRef = React.createRef();
const keyMap = Env.key_map_google

function CarpoolingTripInProcessPasajero (props){
  const dispatch = useDispatch();
  
  const [ finalizandoViaje, setFinalizandoViaje ] = useState(false);
  const [ alturaMapa ] = useState(new Animated.Value(Dimensions.get("window").height * 0.6));
  const [ pasajeros, setPasajeros ] = useState('');
  const [ pasajerosOK, setPasajerosOK ] = useState(false);
  const [ latActual, setLatActual] = useState('');
  const [ lngActual, setLngActual] = useState('');
  const [ iniciado, setIniciado ] = useState(false);
  const [ modalChat, setModalChat ] = useState(false);
  const [ idChat, setIdChat ] = useState('');
  const [ distance, setDistance ] = useState(null);
  const [ pos1Cargada, setpos1Cargada ] = useState(false);
  const [ pos2Cargada, setpos2Cargada ] = useState(false);
  const [ miPosicionCargada, setMiPosicionCargada ] = useState(false);

  const [miPosicion, setMiPosicion ] = useState({lat: '', lng: ''});
  const [position1, setPosition1 ] = useState({lat: '', lng: ''});
  const [position2, setPosition2 ] = useState({lat: '', lng: ''});
  const [ calculoDistance, setCalculoDistance ] = useState('');
  const [ calculoDuracionGooogle, setCalculoDuracionGoogle ] = useState('');
  const [ state , setState ] = useState({
    position1: {
        lat: 37.410000,
        lng: -122.084,
    },
    position2: {
        lat: 37.410000,
        lng: -121.084,
    },
    miPosition: {},
});
  
  const goBack = () => {  
    if (props.dataCarpooling.rol === 'Conductor') {
      RootNavigation.navigate('CarpoolingHome');
    }

    if (props.dataCarpooling.rol === 'Pasajero') {
      RootNavigation.navigate('CarpoolingSolicitudesRider');
    }
  }
  const next = () => { props.navigationProp.navigate('CarpoolingIndications');}

  const getPosition = () =>{
    Geolocation.getCurrentPosition(
        geoSuccess,
        geoFailed,
        geoSetup
    );
  }

  const geoSuccess = (positionActual) => {
      let { latitude, longitude } = positionActual.coords
      setLatActual(latitude);
      setLngActual(longitude);
  }

  const geoFailed = (error) => {
      console.log("error de ubicación", error)
  }

  geoSetup = Platform.OS == "android" ?
  {
      enableHighAccuracy: true,
      timeout: 100000
  } : 
  {
      enableHighAccuracy: true,
      timeout: 100000,
      maximumAge: 3600000
  }

  useEffect(() => {
    getPosition();
  },[])

  const formatearFecha =  (fecha) => {
    let fechaF = new Date(fecha);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones);      
    return(fechaFormateada);
  }

  const valorDistancia = (valor) => {
    setCalculoDistance(valor)
  }

  useEffect(() => {
    if (props.dataCarpooling.patchSolicitud) {
      //
    }
  },[props.dataCarpooling.patchSolicitud])

  const pagar = () => {
    setFinalizandoViaje(true)
  }
  const [isChecked, setIsChecked] = useState(false);

  const finalizar = () => {
    if (props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO-PAGOS') {
      RootNavigation.navigate('CarpoolingExperienceRide');
    }

    if (isChecked) {
      RootNavigation.navigate('CarpoolingExperienceRide');
    }else{
      Alert.alert('Falta el pago');
    }

  }

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

  const [ activarRuta, setActivarRuta] = useState(false);
  const [ coorSalidaSolicitud, setCoorSalidaSolicitud ] = useState('');
  const [ coorLlegadaSolicitud, setCoorLlegadaSolicitud ] = useState('');
  const [ activaRutaSolicitud, setActivaRutaSolicitud] = useState(false);

  useEffect(() => {
    if (props.dataCarpooling.dataTripSelectRideCarggada) {
      setActivarRuta(true)
      dispatch(getDataPago(props.dataCarpooling.dataTripSelectRide.viajeSolicitado.bc_usuario.usu_documento))
    }
  },[props.dataCarpooling.dataTripSelectRideCarggada]);

  const valorDuracionGoogle = (valor) => {
    setCalculoDuracionGoogle(valor)
  }

  return(
    <View style={styles.contenedor}>
      {(modalChat) ? cajaModalChat() : <></>} 
      {
        props.dataCarpooling.dataTripSelectRideCarggada ? 
        <View style={styles.cajaACTIVA}>
          {
            finalizandoViaje ?
            <Pressable  
                onPress={() => { setFinalizandoViaje(false) }}
                style={styles.btnAtrasActivo}>
                <View>
                <Image source={Images.iconoatras} style={{width: 50, height: 50}}/> 
                </View>
            </Pressable>:
            <Pressable  
              onPress={() => { goBack() }}
              style={styles.btnAtrasActivo}>
              <View>
              <Image source={Images.menu_icon} style={{width: 50, height: 50}}/> 
              </View>
          </Pressable>
          }
          
          <View style={styles.cajaMapa}>
            <Mapa 
              coorSalida={props.dataCarpooling.dataTripSelectRide.viajeSolicitado.coorSalida} 
              coorLlegada={props.dataCarpooling.dataTripSelectRide.viajeSolicitado.coorDestino} 
              coorCargadas={true}
              ruta={activarRuta}
              coorSalidaSolicitud={coorSalidaSolicitud}
              coorLlegadaSolicitud={coorLlegadaSolicitud}
              rutaSolicitud={activaRutaSolicitud}
              valorDistancia={valorDistancia}
              valorDuracionGoogle={valorDuracionGoogle}
              alturaMapa={alturaMapa}
            />
          </View>

          <View style={[styles.cajaInfo]}>
            

            <View style={styles.cajaInfoInterna}>
              <View style={[styles.cajaArriba]}>
                <View style={styles.cajaPartidaA}>
                  <Text style={styles.textFecha}>{props.dataCarpooling.dataTripSelectRide.viajeSolicitado.bc_usuario.usu_nombre}</Text>
                  <Estrellas calificacion={props.dataCarpooling.dataTripSelectRide.viajeSolicitado.bc_usuario.usu_calificacion}/>
                  <Text style={{fontSize: 18}}>
                    {props.dataCarpooling.dataTripSelectRide.viajeSolicitado.compartidoVehiculo.marca + ' '}
                    {props.dataCarpooling.dataTripSelectRide.viajeSolicitado.compartidoVehiculo.color}
                  </Text>
                </View>

                <View style={styles.cajaImgChat}>
                  <Pressable 
                    onPress={() => irChat(props.dataCarpooling.dataTripSelectRide.idViajeSolicitado)}
                    >
                    <Image source={Images.iconochatActivo} style={styles.imgChat}/>
                  </Pressable>
                </View>
              </View>
              
              <View style={ styles.LineaHorizontal }></View>

              {
                finalizandoViaje ? 
                <View style={styles.cajaAbajo2}>
                  <View style={styles.rowBetween}>
                    <Text style={{fontSize: 20, color: Colors.$texto50}}>Total a pagar</Text>  
                    <Text style={{fontSize: 24,fontWeight: 'bold'}}>${props.dataCarpooling.dataTripSelectRide.viajeSolicitado.precio}</Text>
                  </View>  
                  <View style={styles.rowBetween}>
                    <Text style={{fontSize: 20, color: Colors.$texto50}}>Método de pago</Text>
                    { props.dataCarpooling.dataPago.daviplata ? <Image source={Images.logodaviplata} style={{width: 40, height: 40, borderRadius : 10}}/> : null }
                    { props.dataCarpooling.dataPago.nequi ? <Image source={Images.logonequi} resizeMode='contain' style={{width: 40, height: 40,  borderRadius : 10}}/> : null }
                  </View> 

                  {
                    props.dataCarpooling.dataPagoCargada ? 
                    <>
                    <View style={[styles.rowBetween, {
                      paddingLeft: 25,
                      paddingRight: 25,
                    }]}>                    
                      <Text style={{fontSize: 20, color: Colors.$texto50}}>Número a pagar</Text>  
                      <Text style={{fontSize: 20, color: Colors.$texto50}}>{props.dataCarpooling.dataPago.numero}</Text> 
                    </View>   
                    <View style={[styles.rowBetween, {
                      paddingLeft: 25,
                      paddingRight: 25,
                    }]}>
                      <Text style={{fontSize: 20, color: Colors.$texto50}}>Nombre</Text>  
                      <Text style={{fontSize: 20, color: Colors.$texto50}}>{props.dataCarpooling.dataPago.nombre}</Text> 
                    </View>
                    </>
                    :
                    <Text>Cargando datos para el pago</Text>
                  }
                  
                    

                  <View style={[styles.rowBetween, {
                    paddingLeft: 25,
                    paddingRight: 25,
                  }]}>
                    <Text style={{fontSize: 20, color: Colors.$texto50}}>Asunto</Text>  
                    <Text style={{fontSize: 20, color: Colors.$texto50}}>Pasajero 1</Text> 
                  </View>  

                  <View style={styles.cajaCheck}>
                        { isChecked ?
                            <Pressable
                                onPress={() => setIsChecked(false)}
                                style={styles.btnCheckOK}
                            />:
                            <Pressable
                                onPress={() => setIsChecked(true)}
                                style={styles.btnCheck}
                            />
                        }  
                        <Text>Pago hecho</Text>
                  </View>       
                </View> 
                :
                <View style={styles.cajaAbajo}>
                  <View style={styles.cajaPartidaB}>
                    <Text style={{width: '70%',  color: Colors.$texto50}}>
                      { formatearFecha(props.dataCarpooling.dataTripSelectRide.viajeSolicitado.fecha) }
                    </Text>    
                    <Text style={{width: '70%',  color: Colors.$texto50}}>
                      Partida: { props.dataCarpooling.dataTripSelectRide.viajeSolicitado.lSalida }
                    </Text>                      
                  
                    {props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ?
                      <View style={styles.cajaRow2}>
                      <Text style={styles.subTitle}>${props.dataCarpooling.dataTripSelectRide.viajeSolicitado.precio}</Text>
                      <Image source={Images.logodaviplata} style={styles.imgPago}/>
                      <Image source={Images.iconobillete} style={styles.imgPago}/>
                    </View>:null}     
                  </View>                
                </View> 
              }           
            </View>

            {
              finalizandoViaje ? 
              <View>
                <Pressable 
                  onPress={() => finalizar()}
                  style={styles.buttonTouchableGray}
                >
                  <Text style={styles.textButton}>Finalizar</Text>
                </Pressable>        
              </View>  
              :
              <>
              {
              props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS' ?
              <View>
                <Pressable 
                  onPress={() => pagar()}
                  style={styles.buttonTouchableGray}
                >
                  <Text style={styles.textButton}>Pagar</Text>
                </Pressable>        
              </View>
              :
              <View>
                <Pressable 
                  onPress={() => finalizar()}
                  style={styles.buttonTouchableGray}
                >
                  <Text style={styles.textButton}>Finalizar</Text>
                </Pressable>        
              </View>
              }
              </>
            }

                   
          </View>

        </View>
        :
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height*.8,
          backgroundColor: 'white'
        }}>
            <Image 
              source={require('../../Resources/gif/loadingCar.gif')} 
              style={{width: 250, height: 250}} 
            />
        </View>
        }
    </View>
  );
}

const styles = StyleSheet.create({
    cajaCheck: {
      width: "80%",
      padding: 10,
      marginBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
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
    cajaCenter: {
        alignItems: '',
        marginTop: 20,
        marginBottom: 20,
    },
    cajaInfo: {
      backgroundColor: Colors.$blanco,
      width: Dimensions.get('window').width,
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
      borderRadius: 30,
      marginTop: -30
    },
    btnAtrasActivo:{
      position: 'absolute',
      top: 20, 
      left: 5,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      zIndex: 1000
    },
    textTitleACTIVA:{
      marginBottom: 20, 
      marginTop: 20, 
      fontSize : 25, 
      fontFamily : Fonts.$poppinsregular,
      color: Colors.$texto,
      
    },
    cajaInfoInterna: {
      width: '100%',
      borderRadius: 20,
      borderRadius: 25,
      padding: 10
    },
    cajaArriba:{
      width: "100%",
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cajaAbajo:{
      width: "100%",
      flexDirection: 'row',
      marginTop: 5
    },
    cajaAbajo2:{
      width: "100%",
      flexDirection: 'column',
      marginTop: 5
    },
    cajaPartidaA: {
      width: "60%",
      alignItems: 'left'
    },
    cajaPartidaB: {
      width: "80%",
      alignItems: 'left'
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
    LineaHorizontal: {
      width: "100%",
      height: 4,
      marginTop: 5,
      backgroundColor: Colors.$texto,
    },
    imgChat: {
      width: 50,
      height: 50,
    },
    imgCarro: {
      width: 80,
      height: 80,
    },
    cajaRow2: {
      width: 170,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    imgPago: {
      width: 25,
      height: 25,
    },
    rowBetween: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    },

  cajaDatosResumen: {
    width: Dimensions.get('window').width,
    backgroundColor: Colors.$blanco,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 30
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
    justifyContent: "center",
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
    backgroundColor: Colors.$blanco,
    justifyContent: 'space-around',
    alignItems: 'center', 
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    position: 'absolute',
    top: 0
  },
  btnAtras:{
    position: 'absolute',
    top: 5, 
    left: 5,
    width: 50,
    height: 50,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  textTitle: {
    marginTop: 20, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontSize : 22, 
    fontFamily : Fonts.$poppinsregular,
    
    alignSelf: "center",
    color: Colors.$blanco
  },
  iconBici: {
    width: 30,
    height: 30,
  },
  cajaACTIVA: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonTouchableGray: { 
    width: Dimensions.get('window').width*.6,
    textAlignVertical : 'bottom',
    padding  : 5,
    margin : 15,
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
    fontSize: 18,
    color: Colors.$texto,
    
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 10,
  },
  textFecha: {
    width: Dimensions.get('window').width*.6,
    textAlign: 'left',
    fontFamily: Fonts.$poppinsregular, 
    fontSize: 24,
    color: Colors.$texto80,
    
    marginTop: 20
  },
  cajaPasajeros: {
    width: Dimensions.get('window').width*.8,
    padding: 10,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth : 1,
    borderColor : Colors.$primario,
    borderRadius : 1,
    borderStyle : 'dashed',
  },
  textSolicitud: {
    fontFamily: Fonts.$poppinsregular, 
    fontSize: 20,
    color: Colors.$texto,
    
  },
  btnAceptar: {
    height: 40,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  mapa: {
    flex: 1, 
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height*.6,
  },
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
  },
  cajaMapa: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
})

function mapStateToProps(state) {
  return {
    dataRent: state.reducer3G,
    dataCarpooling: state.reducerCarpooling,
    perfil: state.reducerPerfil
  }
}
  
export default connect(mapStateToProps)(CarpoolingTripInProcessPasajero);
