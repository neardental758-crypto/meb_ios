import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  Image,
  Alert,
  ImageBackground,
  Modal
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { connect, useDispatch } from 'react-redux';
import { 
  get_trip_select_carpooling,
  init_trip_carpooling,
  get_pasajeros,
  accept_solicitud,
} from '../../actions/actionCarpooling'
import moment from 'moment';
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import colores from '../../Themes/Colors';
import { CarpoolingChat } from '../../Containers/Carpooling/CarpoolingChat';
import { Estrellas } from '../../Components/carpooling/Estrellas';

function CarpoolingDetallesTrip (props){
  const dispatch = useDispatch();

  const [ modalChat, setModalChat ] = useState(false);
  const [ idChat, setIdChat ] = useState('');
  
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
      break;
      default:
        break;
    }
  }

  const formatearFecha =  (fecha) => {
    let fechaF = new Date(fecha);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones);      
    return(fechaFormateada);
  }

  const iniciar = async () => {
    RootNavigation.navigate('CarpoolingTripInProcessPasajero');
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

  return(
    <View style={styles.contenedor}>
      {(modalChat) ? cajaModalChat() : <></>} 
      {
        props.dataCarpooling.dataTripSelectRideCarggada !== '' ? 
        <View style={styles.cajaACTIVA}>
        <ImageBackground source={Images.fondoMapa} style={{        
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
          }}>
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
                  <Text style={styles.textFecha}>{props.dataCarpooling.dataTripSelectRide.viajeSolicitado.bc_usuario.usu_nombre}</Text>
                  <Estrellas calificacion={props.dataCarpooling.dataTripSelectRide.viajeSolicitado.bc_usuario.usu_calificacion}/>
                  <Text style={{
                    fontSize: 18,
                    width: '70%',
                  }}>
                    {props.dataCarpooling.dataTripSelectRide.viajeSolicitado.compartidoVehiculo.marca + ' '}
                    {props.dataCarpooling.dataTripSelectRide.viajeSolicitado.compartidoVehiculo.color}
                  </Text>
                </View>

                <View style={styles.cajaPartidaImg}>
                  <Image source={Images.carroblanco} style={styles.imgCarro}/>
                </View> 
              </View>
              
              <View style={ styles.LineaHorizontal }></View>

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
                <View style={styles.cajaImgChat}>
                <Pressable
                  onPress={() => irChat(props.dataCarpooling.dataTripSelectRide.idViajeSolicitado)}
                  >
                  <Image source={Images.iconochatActivo} style={styles.imgChat}/>
                </Pressable>
                </View> 
              </View> 
            </View>

            <View>
              {
                props.dataCarpooling.dataTripSelectRide.viajeSolicitado.estado === 'PROCESO' ?
                <Pressable 
                  onPress={() => iniciar()}
                  style={styles.buttonTouchableGray}
                >
                  <Text style={styles.textButton}>Iniciar</Text>
                </Pressable>
                :
                <Text style={{ marginVertical: 15 }}>Este viaje no ha iniciado</Text>
              }   
            </View>         
          </View>
        </ImageBackground>
        </View>
        :
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height*.8,
          backgroundColor: 'red'
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
    cajaCenter: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
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
    textTitleACTIVA:{
      marginBottom: 20, 
      marginTop: 20, 
      fontSize : 25, 
      fontFamily : Fonts.$poppinsregular,
      color: Colors.$texto,
      
    },
    cajaInfoInterna: {
      width: '90%',
      borderRadius: 20,
      borderColor: Colors.$secundario,
      borderWidth: 1,
      borderRadius: 25,
      padding: 10
    },
    cajaArriba:{
      width: "100%",
      flexDirection: 'row',
    },
    cajaAbajo:{
      width: "100%",
      flexDirection: 'row',
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
    alignItems: 'center',
    justifyContent: 'center',
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
    width: Dimensions.get('window').width*.4,
    textAlign: 'left',
    fontFamily: Fonts.$poppinsregular, 
    fontSize: 22,
    color: Colors.$texto80,
    
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
    height: Dimensions.get("window").height*.8,
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
  
export default connect(mapStateToProps)(CarpoolingDetallesTrip);