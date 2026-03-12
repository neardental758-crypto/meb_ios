import React, { useState, useEffect } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connect, useDispatch } from 'react-redux';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import { 
  get_riderList,
} from '../../actions/actionCarpooling';
import CarpoolingTripInProcessPasajero from './CarpoolingTripInProcessPasajero';
import DrawerComponent from './CarpoolingDrawer';
import LottieView from 'lottie-react-native';

function CarpoolingSolicitudesRider (props){
  const dispatch = useDispatch();
  const [ loadedTrips, setLoadedTrips ] = useState(false);
  const [ showDetail, setShowDetail] = useState(false);
  const [ showHistory, setShowHistory ] = useState(null);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ totalPages, setTotalPages ] = useState(1);
  const { dataCarpooling } = props;


  const closeDetailModal = () => {
    setShowDetail(false);
  };
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      dispatch(get_riderList(pageNumber));
      setCurrentPage(pageNumber);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const cargarHistory = async () => {
        setLoadedTrips(true);
        await dispatch(get_riderList(currentPage));
      };
  
      cargarHistory();
  
      return () => {
        isActive = false;
      };
    }, [currentPage])
  );
  
  // Ocultar modal cuando llegan los datos
  useEffect(() => {
    const data = dataCarpooling?.riderList?.data;
    const pagination = dataCarpooling?.riderList?.pagination;
  
    if (Array.isArray(data)) {
      setShowHistory(data);
      if (pagination?.totalPages) {
        setTotalPages(pagination.totalPages);
      }
  
      const delay = setTimeout(() => {
        setLoadedTrips(false);
      }, 500);
  
      return () => clearTimeout(delay);
    }
  }, [dataCarpooling?.riderList?.data]);

  const formatearFecha =  (fecha) => { 
    let fechaF = new Date(fecha); 
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones); 
    return(fechaFormateada);
  }

  if(loadedTrips || showHistory === null){
    return (
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
    )
  }
    return(
    <View style={styles.contenedor}>
      {(showDetail) ? <CarpoolingTripInProcessPasajero onClose={closeDetailModal} data={selectedData}  /> : <></>}
      <View style={{
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '10%',
        bottom: 0,
        alignItems: 'center',
        backgroundColor: Colors.$texto50,
        zIndex: 5
      }}>
          <DrawerComponent navigation={props.navigation} />
      </View>
      <View style={styles.cajaCabeza}>
        <View style={[styles.circle, { backgroundColor: Colors.$primario }]} />
          <Text style={[styles.textTitle, { color: Colors.$primario }]}>Conductor</Text>
          <Text style={[styles.textTitle, { color: Colors.$adicional }]}>Pasajero</Text>
        <View style={[styles.circle, { backgroundColor: Colors.$adicional }]} />
      </View>
      <View style={{ 
        flex: 1,
        width: Dimensions.get('window').width,
        marginTop: 20,
        marginBottom: 20,
      }}>
          {showHistory.length > 0 ?
            <View style={[styles.cajaTrips]}>
            {/* Títulos de las vistas */}
            <ScrollView>
            {showHistory.map((register) => {
                      const containerStyle =
                        register.tipo === 'driver' ? styles.driverContainer : styles.riderContainer;
                      return (
                        <View key={register.data?._id || register._id} style={[styles.tripCard, containerStyle]}>
                          {register.tipo === 'driver' ? (
                            <View style={styles.btnDriver}>
                              {/* Vista para 'driver' */}
                              <View style={styles.cajaRowVA}>
                                <View style={{ width: '75%' }}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      color: Colors.$texto80,
                                      fontFamily: Fonts.$poppinsregular,
                                    }}
                                  >
                                    Destino : {register.data.llegada}
                                  </Text>
                                  <Text style={styles.textFecha}>{formatearFecha(register.data.fecha)}</Text>
                                </View>
                                <View style={styles.cajaPartidaImg}>
                                  {register.data.compartidoVehiculo.tipo == 'Carro' ?  <Image source={Images.carrorojo} style={styles.imgCarro}/> : <Image source={Images.moto} style={styles.imgMoto}/>}
                                </View>
                              </View>
    
                              <View style={styles.LineaHorizontal} />
                              <View style={styles.cajaRowIconos}>
                                <Text
                                  style={styles.textSolicitud}
                                >
                                  Estado: {register.data.estado === 'FINALIZADA' ? 'Viaje finalizado' : register.data.estado}
                                </Text>
                              </View>
                            </View>
                          ) : register.tipo === 'rider' ? (
                            <View key={register.data?._id || register._id} style={styles.btnRider}>
                              <View style={styles.cajaRowVA}>
                                <View style={{ width: '80%' }}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      color: Colors.$texto80,
                                      fontFamily: Fonts.$poppinsregular,
                                    }}
                                  >
                                    Destino : {register.data.viajeSolicitado.llegada}
                                  </Text>
                                  <Text style={styles.textFecha}>{formatearFecha(register.data.viajeSolicitado.fecha)}</Text>
                                </View>
                                <View style={styles.cajaPartidaImg}>
                                  {register.data.viajeSolicitado.compartidoVehiculo.tipo == 'Carro' ?  <Image source={Images.carrorojo} style={styles.imgCarro}/> : <Image source={Images.moto} style={styles.imgMoto}/>}
                                </View>
                              </View>    
          
                            <View style={ styles.LineaHorizontal }></View>         
                      
                            <View style={styles.cajaSolicitud}>
                              <View style={styles.dataValue}>
                              <Text style={styles.textSolicitud}>
                                Estado : {register.data.estadoSolicitud === "PENDIENTE" 
                                  ? "No confirmado" 
                                  : register.data.estadoSolicitud === "APROBADA" 
                                  ? "Confirmado" 
                                  : register.data.estadoSolicitud === "CANCELADA"
                                  ? "Cancelada" 
                                  : register.data.estadoSolicitud === "FINALIZADA"
                                  ? "Viaje finalizado": "Desconocido"}
                              </Text>
                              </View>        
                              <View>
                              </View>                                   
                            </View>
                          </View>    
                          ) : null}
                        </View>
                      );
                    })}
            </ScrollView>
            {/* Botones de paginación */}
            <View style={styles.paginationContainer}>
              <Pressable
                onPress={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
              >
                <Text style={styles.paginationText}>Anterior</Text>
              </Pressable>

              <Text style={styles.pageNumber}>
                Página {currentPage} de {totalPages}
              </Text>

              <Pressable
                onPress={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
              >
                <Text style={styles.paginationText}>Siguiente</Text>
              </Pressable>
            </View>
            </View>
            : 
            <Text style={{ margin : 'auto', textAlign : 'center', fontSize : 22, color : 'gray'}}>No tienes registros 😞</Text>
          }
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
  imgCarro: {
    width: 80,
    height: 80,
  },
  imgMoto: {
    width: 80,
    height: 50,
    marginTop: 15,
    marginBottom : 15
  },
  cajaArriba:{
    width: "90%",
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  scroll: {
    width: Dimensions.get('window').width,
    flex: 1,
    alignItems: 'center',
  },
  textNombre:{
    fontSize:20,
    fontWeight:'bold'
  },
  cajaSolicitud:{
    flexDirection: "row",
    flex:1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  cajaEstado:{
    justifyContent : 'center',
    alignItems : 'center',
    width:100,
    height:30,
    marginLeft:30,
    borderRadius : 50,
    marginTop:30,
    backgroundColor:'#71f3f3'
  },
  buttonTouchableGray: {
    width: Dimensions.get('window').width*.8,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    position: 'absolute',
    bottom: 50,
    zIndex: 100,
    borderRadius: 20
  },
  textButton : {
    fontFamily: Fonts.$poppinsregular, 
    textAlign: "center", 
    fontSize: 18, 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: 'white',
    alignSelf: "center",
  },
  cajaTyC: {
    backgroundColor: Colors.$blanco,
    width: Dimensions.get('window').width*.8,
    height: Dimensions.get('window').height*.6,
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
  margin:{
    marginHorizontal:30,
    // marginRight:35,
    // marginLeft:39,
  },
  marginNumbe:{
    marginHorizontal:20,
    marginRight:35,
    marginLeft:55,
  },
  button:{
    border: 'none',
    marginHorizontal:20,
    marginRight:70,
    marginLeft:71,
  },
  title:{
    fontFamily:Fonts.$montserratMedium,
    color:'#878787',
    fontSize:20,
  },
  subtitle:{
    fontFamily:Fonts.$montserratExtraBold,
    fontSize:18,
    lineHeight: 31,
    color:Colors.$textogray,
  },
  text:{
    fontFamily:Fonts.$poppinsregular,
    fontSize:15,
    lineHeight: 21,
    color:Colors.$blackgray,
    textAlign:'justify',
    marginTop:10,
  },
    cajaCabeza: {
      paddingTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: Dimensions.get('window').width,
      backgroundColor: 'rgba(255, 255, 255, 1)'
    },
    textButtonIcon : {
      textAlign: "center", 
      fontSize: 24,
    },
    rulesTextTitulo : {
      width: Dimensions.get('window').width*.6,
      textAlign: 'center',
      fontSize : 16, 
      fontFamily : Fonts.$poppinsregular,
      marginBottom : 5,
      
      alignSelf: "center",
      color: Colors.$darkgray
    },
    textTitle: { 
      fontSize : 18,
      color: Colors.$texto80,
      fontFamily: Fonts.$poppinsmedium,
    },
    btnAtras:{
      position: 'absolute',
      top: 20, 
      left: 5,
      width: 55,
      height: 55,
      backgroundColor: Colors.$white,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30
    },
    textCampo: {
      width: Dimensions.get('window').width*.8,
      textAlign: 'center',
      
      alignSelf: "center",
      borderRadius: 10,
      fontSize : 16,
    },
    buttons: {
      margin : 10,
      justifyContent : 'center',
      alignItems : 'center',
      width : 250,
      height : 50,
      borderRadius : 50,
    },
    btnViaje:{
      justifyContent : 'center',
      alignItems : 'center',
      width:100,
      height:30,
    marginLeft:30,
      borderRadius : 50,
      marginTop:30
     
    },
    container : {
      width: Dimensions.get('window').width*.8,
      minHeight: 100,
      backgroundColor: Colors.$blanco,
      marginBottom: 25,
      padding: 20,
      borderRadius: 20,
      position: 'relative',
      borderRadius: 20,
      borderColor: Colors.$texto20,
      borderWidth: 1,
    },
    containerButton:{
      justifyContent : 'center',
      alignItems : 'right',
     marginRight:10
    },
    dataValue: {
      flexDirection : 'column',
    },
    textData : {
      textAlign : 'center',
      minWidth : 50,
      padding : 12,
      borderRadius : 20,
      borderWidth : 1,
      borderColor : Colors.$primer
    },
    textSolicitud:{
      fontSize: 14,
      color: Colors.$texto50,
      fontFamily: Fonts.$poppinslight,
    },
    textViaje:{
      color:'white',
    },
    iconEliminar: {
      width: 30,
      height: 30,
      marginLeft:10,
      top:15
    },
    textAsientos: {
      textAlign : 'center',
      minWidth : 50,
      padding : 19,
      fontSize:15
    },
    textasientosIda:{
      marginRight:70
    },
    textViajes:{
     fontSize:14,
    position:'absolute',
    top:30,
      
    },
    cajaViajes:{
      width:40,
      marginLeft:60,
      marginTop:20,
      flexDirection : 'row',
      justifyContent : 'space-between',
    },
    linea:{
      borderWidth : 1,
      borderColor : Colors.$black,
      borderRadius:15,
      backgroundColor:'black',
      height:5

    },
    lineContainer : {
      paddingEnd : 20,
      paddingStart : 20
    },
    line : {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor:Colors.$primer,
    },
    goToMap : {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor : Colors.$black,
      borderRadius : 50,
      width: 100,
      height: 100
    },
    BtnVerRuta: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor : Colors.$tercer,
      borderRadius : 10,
      height: 40,
      marginBottom: 10,
      padding: 5
    },
    textButtonPunto : {
      fontFamily: Fonts.$poppinsregular, 
      textAlign: "center", 
      fontSize: 18, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: 'white',
      width : 120
  },
 
    textButtonPuntoYellow : {
      fontFamily: Fonts.$poppinsregular, 
      textAlign: "center", 
      fontSize: 18, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: Colors.$black,
      width : 120
  },
  way : {
    marginBottom: 5, 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent :'space-around'
  },
  box : {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center', 
    width: Dimensions.get('window').width*.9,
    minHeight: Dimensions.get('window').height*.3,
    position: 'relative',
    borderWidth : 1,
    borderColor : Colors.$primer,
    borderRadius : 1,
    borderStyle : 'dashed',
    marginTop: 10,
    marginBottom: 10,
  },
  box2: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'space-around',
    padding: 10
  },

  cajaDriver: {
    width: Dimensions.get('window').width*.9,
    justifyContent : 'space-between',
    flexDirection: 'row',
  },
  cajaDir: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  mapa: {
    flex: 1,
    width: Dimensions.get("window").width,
    height:  Dimensions.get("window").height*.3,
  },
  cajaConductores: {
    width: Dimensions.get("window").width,
    height:  Dimensions.get("window").height*.3,
    alignItems: 'center',
    padding: 20
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 75,
  },
  input: {
    margin: 12,
    paddingLeft: 20,
    borderRadius: 20,
    fontSize: 16,
    backgroundColor: Colors.$secundario50,
    marginBottom: 10,
    fontFamily: Fonts.$poppinsregular
  },
  contenedor: {
    flex: 1,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    backgroundColor: Colors.$blanco,
    // paddingTop: 200,
    // alignItems: "center",
    // justifyContent: "space-between",
    // position: "relative"
  },
  gif: {
    width: Dimensions.get('window').width*.8,
    height: 250, 
  },
  cajaRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cajaRowVA: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  },
  cajaTrips: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.8,
  },
  textFecha: {
    width: Dimensions.get('window').width*.5,
    textAlign: 'left',
    fontSize: 14,
    color: Colors.$texto80,
    fontFamily: Fonts.$poppinslight
  },
  driverContainer: {  
    marginLeft: 10,
    alignItems: 'flex-start', // Alinea a la derecha para los conductores
  },
  riderContainer: {
    marginRight: 10,
    alignItems: 'flex-end', // Alinea a la izquierda para los pasajeros
  },
  cajaCabeza: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
  },
  cajaTituloCerrar: {
      width: "90%",  
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    marginTop: 20,
  },
  cajaContinuar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  btnAtras:{
      position: 'absolute',
      top: 30, 
      left: 5,
      width: 50,
      height: 50,
      backgroundColor: Colors.$blanco,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25
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
  btnRefresh: {
      position: 'absolute',
      top: 50, 
      right: 5,
      width: 50,
      height: 50,
      backgroundColor: Colors.$blanco,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25
  },
  cards: {
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 20,
    marginBottom: 20,
  },
  iconBici: {
      width: 40,
      height: 40,
  },
  iconBici2: {
    width: 30,
    height: 30,
    marginRight: 20
  },
  iconVerMas: {
    width: 30,
    height: 30,
  },    
  containerButtons : { 
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.$primario,  
  },
  textTitle: {
    fontSize : 18,
    color: Colors.$texto80,
    fontFamily: Fonts.$poppinsmedium,
  },
  textTitleTyC: {
    textAlign: 'center', 
    fontSize : 18, 
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto,
  },
  buttonTouchableGray: {
    width: Dimensions.get('window').width*.8,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    position: 'absolute',
    bottom: 20,
    zIndex: 100,
    borderRadius: 20
  },
  buttonTyC: {
    width: "60%",
    height: 30,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    zIndex: 100,
    borderRadius: 15,
    fontFamily: Fonts.$poppinsregular
  },
  textButton: {
    fontFamily: Fonts.$poppinsregular, 
    textAlign: "center", 
    fontSize: 20, 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: 'white',
    color: Colors.$blanco,
    alignSelf: "center",
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
  cajaTyC: {
    backgroundColor: Colors.$blanco,
    width: Dimensions.get('window').width*.8,
    height: Dimensions.get('window').height*.7,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
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
  cajaScrool:{
    width: "100%",
    height: "40%",
  },
  margin:{
    marginHorizontal:30,
    // marginRight:35,
    // marginLeft:39,
  },
  marginNumbe:{
    marginHorizontal:20,
    marginRight:35,
    marginLeft:55,
  },
  button:{
    border: 'none',
    marginHorizontal:20,
    marginRight:70,
    marginLeft:71,
  },
  title:{
    fontFamily:Fonts.$montserratMedium,
    color:'#878787',
    fontSize:20,
    // fontWeight:Platform.OS == 'ios'? '800:'',
  },
  subtitle:{
    fontFamily:Fonts.$montserratExtraBold,
    fontSize:18,
    lineHeight: 31,
    color:Colors.$texto80,
  },
  text:{
    fontFamily:Fonts.$poppinsregular,
    fontSize:15,
    lineHeight: 21,
    color:Colors.$texto80,
    textAlign:'justify',
    marginTop:10,
  },
  text2:{
    fontFamily:Fonts.$poppinsregular,
    fontSize:12,
    lineHeight: 21,
    color:Colors.$texto80,
    textAlign:'justify',
  },
  btnDriver: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: Dimensions.get('window').width*.8,
    minHeight: 100,
    marginBottom: 25,
    padding: 20,
    borderRadius: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.$texto20,
    backgroundColor: Colors.$primario20,
  },
  btnRider: {
    flexDirection: "column",
    justifyContent: "flex-end",
    width: Dimensions.get('window').width*.8,
    minHeight: 100,
    marginBottom: 25,
    padding: 20,
    borderRadius: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.$texto20,
    backgroundColor: Colors.$adicional20,
  },
  cajaRowIconos: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  cajaIcon: {
    flexDirection: "row",
    justifyContent: 'space-around',
    width: "40%",
  },
  LineaHorizontal: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.$texto,
    marginTop: 10,
    marginBottom: 10
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 75,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,  // Espacio superior e inferior
    padding: 10,
  },
  paginationButton: {
    backgroundColor: Colors.$primario,
    fontFamily: Fonts.$poppinsregular, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,  // Sombra para Android
    shadowColor: '#000',  // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  paginationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.$poppinsregular, 
  },
  disabledButton: {
    backgroundColor: Colors.$secundario,  // Color gris cuando está deshabilitado
    fontFamily: Fonts.$poppinsregular, 
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 10,
  },
  imgCarro: {
    width: 80,
    height: 80,
  },
  imgMoto: {
    width: 80,
    height: 50,
    marginTop: 15,
    marginBottom : 15
  },
});

const stylesModalDel = StyleSheet.create({
  contenedorModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    height: 40,
  },
  contenedor: { 
    backgroundColor: "rgba(52, 52, 52, 0.9)", 
    flexDirection: "column", 
    flex: 1 
  },
  cajaA: { 
    flex: 3, 
    borderRadius: 6, 
    marginVertical: 200, 
    marginHorizontal: 50, 
    backgroundColor: Colors.$blanco, 
    justifyContent: "center", 
    alignItems: "center", 
    paddingHorizontal: 25 
  },
  imagen: { 
    width: 200,
    height: 200,
  },
  texto: { 
    textAlign: "center", 
    color: Colors.$cuarto,
    fontSize: 22, 
    fontWeight: "400", 
    marginTop: 20,
    marginBottom: 20
  },
  cajaRow: { 
    width: "100%",
    flexDirection: 'row', 
    justifyContent: 'space-around', 
  },
  boton: { 
    width: 120,
    borderRadius: 15,
    alignItems: 'center',
    padding: 5
  },
  cajaAnimacion: {
    width: "100%",
    height: 250,
    alignItems: 'center',
  },
  
})
  

function mapStateToProps(state) {
    return {
      dataMySQL: state.reducer3G,
      dataCarpooling: state.reducerCarpooling
    }
}
  
export default connect(mapStateToProps)(CarpoolingSolicitudesRider);
