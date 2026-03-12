import React, { useState, useEffect, useRef } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Animated
} from 'react-native';
import LottieView from 'lottie-react-native';
import { connect, useDispatch } from 'react-redux';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import { 
  driver_carpooling_exit,
  get_trip_user_carpooling_filter,
  get_trip_user_carpooling,
  limpiarPsalida,
  limpiarPllegada,
  ask_roles,
} from '../../actions/actionCarpooling';
import { MetodoPago } from '../../Components/carpooling/MetodoPago';
import { FiltrosCarpooling } from '../../Components/carpooling/Filtros';
import { Vehiculo } from '../../Components/carpooling/Vehiculo';
import Geolocation from 'react-native-geolocation-service';
import * as RootNavigation from '../../RootNavigation';
import { Env } from "../../../keys";
import { Mapa } from '../../Components/carpooling/Mapa';
import ModalSolicitudViaje from '../../Components/carpooling/ModalSolicitudViaje';
import { Estrellas } from '../../Components/carpooling/Estrellas';
import { useFocusEffect } from '@react-navigation/native';
import DrawerComponent from './CarpoolingDrawer';
import CarpooolingTYCRider from './CarpoolingTYCRider';

const keyMap = Env.key_map_google;

function CarpoolingTripRider (props){
  const dispatch = useDispatch();
  const [ date, setDate ] = useState(new Date());
  const [ buscando, setBuscando ] = useState(true);
  const scrollViewRef = useRef(null);
  const [ loadedTrips, setLoadedTrips ] = useState(false);
  const [ openInfoModal, isOpenBackgroundInfoModal] = useState(false);
  const [ position1, setPosition1 ] = useState({lat: '',lng: ''});
  const [ position2, setPosition2 ] = useState({lat: '',lng: ''});
  const [ showTrips, setShowTrips ] = useState([]);
  const [ modalDetailVisible, setModalDetailVisible ] = useState(false);
  const [ selectedData, setSelectedData ] = useState(null);
  const [ sendMapConfirmation, setSendMapConfirmation ] = useState(true);
  const [ checkDaviPlata, setCheckDaviPlata ] = useState(true);
  const [ checkCash, setCheckCash ] = useState(true);
  const [ checkCarro, setCheckCarro ] = useState(true);
  const [ checkMoto, setCheckMoto ] = useState(true);
  const [ modalEditPago, setModalEditPago ] = useState(false);
  const [ modalVehiculo, setModalVehiculo ] = useState(false);
  const [ modalFilters, setModalFilters ] = useState(false);
  const [ activarRuta, setActivarRuta ] = useState(false);
  const [ coorSalidaSolicitud, setCoorSalidaSolicitud ] = useState('');
  const [ coorLlegadaSolicitud, setCoorLlegadaSolicitud ] = useState('');
  const [ activaRutaSolicitud, setActivaRutaSolicitud] = useState(false);
  const [ alturaMapa ] = useState(new Animated.Value(Dimensions.get("window").height * 0.80));
  const [ alturaCambiada, setAlturaCambiada ] = useState(false);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ totalPages, setTotalPages ] = useState(1);
  const [ modalTYCRider, setModalTYCRider ] = useState(props.canRide);
  const { dataCarpooling } = props;

  const closeDetailModal = () => {
    setModalDetailVisible(false);
  };
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      dispatch(get_trip_user_carpooling(pageNumber));
      setCurrentPage(pageNumber);
    }
  };
  const valorDistancia = (valor) => {
    // setCalculoDistance(valor)
  }

  const valorDuracionGoogle = (valor) => {
    // setCalculoDuracionGoogle(valor)
  }
  
  useEffect(() => {
    if (dataCarpooling && dataCarpooling.tripsActiveToRider && dataCarpooling.tripsActiveToRider.pagination) {
      const { data } = dataCarpooling.tripsActiveToRider;
      const { totalPages } = dataCarpooling.tripsActiveToRider.pagination;
  
      if (totalPages) {
        setTotalPages(totalPages);
      }
  
      if (data) {
        setShowTrips(data);
        const delay = setTimeout(() => {
          setLoadedTrips(false);
        }, 500);
        return () => clearTimeout(delay);
      }
    }
  }, [dataCarpooling?.tripsActiveToRider]);
  

  let currentDate = new Date();
  currentDate.setHours(currentDate.getHours());

  const goBack = async () => {
    if(buscando == true){
      await RootNavigation.navigate('Home');
    }else{
      setBuscando(true);
      setShowTrips([]);
    }
  }

  const getPosition = () =>{
    Geolocation.getCurrentPosition(
        geoSuccess,
        geoFailed,
        geoSetup
    );
  }

  const geoSuccess = (positionActual) => {
      let { latitude, longitude } = positionActual.coords
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

  useFocusEffect(
    React.useCallback(() => {
      setLoadedTrips(true);
      dispatch(get_trip_user_carpooling(1));
      dispatch(ask_roles());
      setPosition1({ lat: '', lng: '' });
      setPosition2({ lat: '', lng: '' });
      dispatch(limpiarPsalida());
      dispatch(limpiarPllegada());
      setDate(currentDate);
    }, [])
  );

  useEffect(() => {
    setModalTYCRider(props.canRide);
  }, [props.canRide]);

  const formatearFecha =  (fecha) => { 
    let fechaF = new Date(fecha); 
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones); 
    return(fechaFormateada);
  }

  const refreshStates = () => {
    dispatch(get_trip_user_carpooling(1));
    setPosition1({lat: '',lng: ''});
    setPosition1({lat: '',lng: ''});
    dispatch(limpiarPsalida());
    dispatch(limpiarPllegada());
    setDate(currentDate);
    setBuscando(true);
    setShowTrips([]);
  };

  useEffect(() => {
    dispatch(driver_carpooling_exit('Pasajero', 1));
    dispatch(get_trip_user_carpooling(1));
    getPosition();
  },[]);
   
  const showTripsChange = () => {
    const position1Str = JSON.stringify(position1);
    const position2Str = JSON.stringify(position2);
    dispatch(get_trip_user_carpooling_filter( 1, checkDaviPlata, checkCash, checkCarro, checkMoto, date, position1Str, position2Str ));
  }


  const irSolicitudes = () => {
    RootNavigation.navigate('CarpoolingSolicitudesRider');
  }

  const displayBackgroundInfoModal = (value) => {
    isOpenBackgroundInfoModal(value)
  }

  const applicationToSend = (item) => {
    setSelectedData(item);
    setModalDetailVisible(true);
  }

  const modalActivo = (valor) => {
    setModalEditPago(valor)
  }

  const closeFiltersModal = () => {
    setModalFilters(false)
  }

  const vehiculoModal = (valor) => {
    setModalVehiculo(valor)
  }

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const alternarAltura = () => {
    const nuevaAltura = alturaCambiada
        ? Dimensions.get("window").height * 0.80 : Dimensions.get("window").height * 0.25;
    Animated.timing(alturaMapa, {
        toValue: nuevaAltura,
        duration: 500,
        useNativeDriver: false,
      }).start();
      setAlturaCambiada(!alturaCambiada);
  };

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
                    <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: Colors.$primer, justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                        <Image style={{
                            width: 200,
                            height: 100,
                        }} source={Images.logoHome} />

                        <Text style={{ 
                          textAlign: "center",
                          color: Colors.$cuarto,
                          fontSize: 22, 
                          fontWeight: "700", 
                          marginTop: 20 }}
                        >La solicitud se envió correctamente  💪🏁</Text>

                        <View style={{
                            marginTop: 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{ marginRight: 8 }}>
                                <Button
                                    title="ACEPTAR"
                                    color={Colors.$black}
                                    onPress={() => { 
                                      displayBackgroundInfoModal(false) 
                                      irSolicitudes()
                                  }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
    //Abrir el modal de backgrund info
  }

  const modalVehiculoEdit = () => {
    return (
      <View style={ styles.contenedorModal}>
          <Modal transparent={true} animationType="slide">
            <View style={ styles.cajaModal }>
              <View style={ styles.cajaModal2 }>
                <Vehiculo  
                  modalVehiculoActivo={vehiculoModal}
                  checkCarro={checkCarro}
                  setCheckCarro={setCheckCarro}
                  checkMoto={checkMoto}
                  setCheckMoto={setCheckMoto}
                />                 
              </View> 
            </View>
          </Modal>
      </View>
    )
  }

  const modalPagosEdit = () => {
    return (
      <View style={ styles.contenedorModal}>
          <Modal transparent={true} animationType="slide">
            <View style={ styles.cajaModal }>
              <View style={ styles.cajaModal2 }>
                <MetodoPago  
                  modalActivo={modalActivo}
                  checkCash={checkCash}
                  setCheckCash={setCheckCash}
                  checkDaviPlata={checkDaviPlata}
                  setCheckDaviPlata={setCheckDaviPlata}
                />                 
              </View> 
            </View>
          </Modal>
      </View>
    )
  }

  const modalFiltersEdit = () => {
    return (
      <>
          <Modal transparent={true} animationType="slide">
            <View style={ styles.cajaModal }>
              <View style={ styles.cajaModal2 }>
                <FiltrosCarpooling  
                  date={date}
                  setDate={setDate}
                  modalActivo={modalActivo}
                  checkCash={checkCash}
                  setCheckCash={setCheckCash}
                  checkDaviPlata={checkDaviPlata}
                  setCheckDaviPlata={setCheckDaviPlata}
                  checkCarro={checkCarro}
                  setCheckCarro={setCheckCarro}
                  checkMoto={checkMoto}
                  setCheckMoto={setCheckMoto}
                  setModalEditPago={modalActivo}
                  modalVehiculoEdit={vehiculoModal}
                  showTripsChange={showTripsChange}
                  closeModal={closeFiltersModal}
                  dataCarpooling={props.dataCarpooling}
                  setPosition1={setPosition1}
                  setPosition2={setPosition2}
                  pago={props.perfil.dataempresa[0]._carro_compartido}
                />           
              </View> 
            </View>
          </Modal>
      </>
    )
  }

  const verRuta = (data) => {
    setSendMapConfirmation(false);
    setCoorSalidaSolicitud(data.coorSalida);
    setCoorLlegadaSolicitud(data.coorDestino);
    setActivaRutaSolicitud(true);
    scrollToTop();
    alternarAltura();
  }

  if(loadedTrips){
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
  }else{
    return(
    <View style={styles.contenedor}>
      {(modalFilters) ? modalFiltersEdit() : <></>} 
      {(modalEditPago) ? modalPagosEdit() : <></>} 
      {(modalVehiculo) ? modalVehiculoEdit() : <></>} 
      {(openInfoModal) ? openBackgroundInfoModal() : <></>}
      {(modalDetailVisible) ?   
        <ModalSolicitudViaje 
          onClose={closeDetailModal} 
          refresh={refreshStates} 
          data={selectedData} 
          pago={props.perfil.dataempresa[0]._carro_compartido}
        /> : <></>}
      {(modalTYCRider) ? <View style={{
        position: 'absolute',
        top : 0,
        zIndex: 5
      }}>
        <CarpooolingTYCRider navigation={props.navigation} closeModal={() => setModalTYCRider(false)} />
      </View> : null}
      <View>
            <Pressable  
              onPress={() => { setModalFilters(true) }}
              style={{ position : 'absolute', zIndex : 4, padding : 10, top : 50, left : 5, backgroundColor : Colors.$primario, borderRadius : 15, width: '35%'}}>
            <Text style={[styles.textButton, { fontSize : 16}]}>Buscar ruta</Text>
          </Pressable>
      </View>
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
      
      <ScrollView ref={scrollViewRef}>
        <View style={styles.scroll}>
          <View style={styles.cajaMapa}>
            <Mapa 
              coorSalida={position1} 
              coorLlegada={position2} 
              coorCargadas={true}
              ruta={activarRuta}
              coorSalidaSolicitud={coorSalidaSolicitud}
              coorLlegadaSolicitud={coorLlegadaSolicitud}
              rutaSolicitud={activaRutaSolicitud}
              valorDistancia={valorDistancia}
              valorDuracionGoogle={valorDuracionGoogle}
              sendMapConfirmation={sendMapConfirmation}
              setSendMapConfirmation={setSendMapConfirmation}
              alturaMapa={alturaMapa}
            />
          </View>
        </View>
      
      {/* Salida y llegada */}
      <View style={styles.cajaCabeza}>
        <Text style={styles.textTitle}>Crear solicitud</Text>
        <Pressable  
            onPress={alternarAltura}
            style={ styles.btnArriba }>
            <View>
              <Image source={Images.atras_Icon} style={[styles.iconBici, {tintColor : 'black', transform: [{ rotate: alturaCambiada ? '270deg' : '90deg' }]}]}/> 
            </View>
        </Pressable>
        <Pressable  
            onPress={goBack}
            style={ styles.btnAtras }>
            <View>
              <Image source={Images.home} style={[styles.iconBici, {tintColor : 'black'}]}/> 
            </View>
        </Pressable>
      </View>
      <ScrollView style={{ height: '100%', marginBottom: 50 }}>
        <View style={[styles.box, {borderColor : Colors.$white}]}>
          <View style={[styles.cajaDir]}> 
          <View>
            {
              showTrips.length > 0 ?
              showTrips.map((data, index) =>
                <View style={styles.cajaConductores} key={index}>
                <View style={styles.borderCaja}>
                  <View style={styles.cajaDriver}>
                    <View>
                      <Text style={styles.userTitle}>{data.bc_usuario.usu_nombre}</Text>
                      <View style={styles.alingStars}> 
                        <Estrellas calificacion={data.bc_usuario.usu_calificacion || 5}/>
                        {/*<Text style={[styles.r, {marginLeft : 10, padding: 2, marginTop : 3}]}> {data.bc_usuario.conductor.viajes} viajes</Text>*/}
                      </View>
                    </View>
                    <View style={styles.cajaPartidaImg}>
                      {data.compartidoVehiculo.tipo == 'Carro' ?  <Image source={Images.carrorojo} style={styles.imgCarro}/> : <Image source={Images.moto} style={styles.imgMoto}/>}
                    </View>
                  </View>
                  <View style={[styles.cajaDriver]}>
                  <View style={{width: '60%'}}>
                    <Text style={styles.r}>
                      {formatearFecha(data.fecha)}
                    </Text>
                  </View>
                    <View>
                      <Pressable onPress={() => verRuta(data)}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                          <Text style={{fontSize: 18}}>Ver ruta </Text>
                          <Image 
                              source={Images.flecha_icon} 
                              style={{width: 20, height: 20}}
                            /> 
                        </View>
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.LineaHorizontal }></View>
                  <View style={[styles.cajaDriver]}>
                    <View>
                      <Text style={[styles.r, {maxWidth : '70%'}] }>Destino : {data.llegada} </Text>
                      <Text style={styles.r}>Asientos disponibles {data.asientosIda} </Text>
                    </View>
                    <Pressable 
                      onPress={() => {applicationToSend(data)}} 
                      style={[styles.buttonTouchableGray, styles.lesswidth]}>
                          <Text style={styles.textButton}>Solicitar</Text>
                    </Pressable>
                  </View>
                </View>    
              </View>
              )
            : 
            <>
              <Text style={styles.textVisible}>No se encontraron viajes 😞</Text>
            </>
            }
          </View>
          </View>
        </View>
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
      </ScrollView>
    </View>
    );
  }

}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.$blanco,
    position: "relative",
  },
  cajaModal: { 
    backgroundColor: "rgba(52, 52, 52, 0.9)", 
    flexDirection: "column", 
    flex: 1,
    height: Dimensions.get('window').width*.5
  },
  cajaModal2: { 
    flex: 1, 
    height: "100%",
    borderRadius: 6, 
    marginVertical: 1, 
    justifyContent: "space-around", 
    alignItems: "center", 
  },
  scroll: {
    width: Dimensions.get('window').width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },  
  borderCaja: {
    borderWidth : 1,
    borderColor : Colors.$primer,
    alignItems: 'center',
    paddingTop: '3%',
    paddingBottom : '3%',
    paddingLeft: '5%',
    paddingRight: '5%',
    marginBottom: 10,
    borderRadius: 15,
  },
  iconBici: {
    width: 25,
    height: 25,
  },
  buttonTouchableGray : {
    width: Dimensions.get('window').width*.8,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    borderRadius: 15,
    margin: '15px'
  },
  lesswidth : {
    maxWidth : '30%',
  },
  cajaRow2: {
    width: 120,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  box3: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'center',
    padding: 10,
    position: 'relative',
  },
  imgPago: {
    width: 40,
    height: 40,
    borderRadius: 10
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
  cajaTyC: {
    width: Dimensions.get('window').width,
    paddingTop: 50,
    paddingBottom: 50
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
    color:Colors.$blackgray,
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
      backgroundColor: Colors.$blanco,
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center', 
      borderWidth : 1,
      borderColor : Colors.$blanco,
      borderRadius: 25,
      width: Dimensions.get('window').width,
      position: 'relative',
      marginTop: -30,
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
      marginTop: 20, 
      marginBottom: 20, 
      textAlign: 'center', 
      fontSize : 22, 
      fontFamily : Fonts.$poppinsregular,
      alignSelf: "center",
      color: 'black'
    },
    btnAtras:{
      position: 'absolute',
      top: 15, 
      left: 15,
      width: 50,
      height: 50,
      backgroundColor: Colors.$blanco,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 5,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 8,
    },
    btnArriba:{
      position: 'absolute',
      top: 15, 
      right: 15,
      width: 50,
      height: 50,
      backgroundColor: Colors.$blanco,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 5,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 8,
    },
    drawerStyles : {
      width : '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    textCampo: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      fontSize : 14, 
      backgroundColor: Colors.$secundario50,
      width: Dimensions.get('window').width*.7,
      padding: 5,
      paddingStart: 10,
      borderRadius : 15,
      color: Colors.$texto50
    },
    userTitle : {
      fontWeight : 'bold',
      fontSize : 20
    },
    buttons: {
      margin : 10,
      justifyContent : 'center',
      alignItems : 'center',
      width : 250,
      height : 50,
      borderRadius : 50,
    },
    container : {
      margin : 15,
      padding : 15,
      borderWidth : 1,
      borderColor : Colors.$primer,
      borderRadius : 1,
      borderStyle : 'dashed'
    },
    containerButton:{
      justifyContent : 'center',
      alignItems : 'center',
    },
    dataValue :{
      flexDirection : 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
      padding : 10
    },
    textData : {
      textAlign : 'center',
      minWidth : 50,
      padding : 12,
      borderRadius : 20,
      borderWidth : 1,
      borderColor : Colors.$primer
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
      color: Colors.$white,
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
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center', 
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height*.3,
    position: 'relative',
    borderColor : Colors.$primer
  },
  box2: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'space-around',
    padding: 10
  },

  cajaDriver: {
    width: Dimensions.get('window').width*.8,
    justifyContent : 'space-between',
    alignItems : 'center',
    flexDirection: 'row',
  },
  cajaDir: {
    width: Dimensions.get('window').width
  },
  mapa: {
    flex: 1,
    width: Dimensions.get("window").width,
    height:  Dimensions.get("window").height*.7,
  },
  cajaConductores: {
    width: Dimensions.get("window").width,
    paddingLeft: 15,
    paddingRight : 15,
  },
  btnPrimario : {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : Colors.$primario,
    borderRadius : 15,
    width: 150,
    height: 40
  },
  btnSecundario : {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : Colors.$secundario,
    borderRadius : 15,
    width: 150,
    height: 40
  },
  cajaMapa: {
    width: Dimensions.get("window").width,
  },
  boxRow: {
    flex: 1,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'space-evenly',
    backgroundColor: Colors.$blanco,
    marginBottom: 15
  },
  textRowPartida: { 
    backgroundColor: Colors.$adicional,
    width: 20,
    height: 20,
    borderRadius: 10
  },
  textRowLlegada: { 
    backgroundColor: Colors.$primario80,
    width: 20,
    height: 20,
  },
  centerInputsPoints : {
    display : 'flex',
    justifyContent : 'center'
  },
  alingStars: {
    flexDirection : 'row',
    justifyContent : 'flex-start'
  },
  LineaHorizontal: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.$texto,
    marginTop: 10,
    marginBottom: 10
  },
  textVisible: {
    paddingVertical : 10,
    textAlign : 'center', 
    fontSize : 22, 
    color : 'gray'
  },
  textHidden: {
    display : 'none'
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
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
  

function mapStateToProps(state) {
    return {
      dataMySQL: state.reducer3G,
      dataCarpooling: state.reducerCarpooling,
      canRide : state.reducerCarpooling.carpoolingCanRide,
      perfil: state.reducerPerfil
    }
}
  
export default connect(mapStateToProps)(CarpoolingTripRider);
