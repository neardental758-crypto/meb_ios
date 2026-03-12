import React, { useState, useEffect, useContext } from 'react';
import { 
  Text, 
  View,
  Pressable,
  StyleSheet,
  Image,
  Modal,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ImageBackground,
  Animated
} from 'react-native';
import { 
  info_user,
  limpiarPsalida,
  limpiarPllegada,
  getVehicles_carpooling,
  limpiarEstadoViaje,
  sendTrip,
} from '../../actions/actionCarpooling';
import { useFocusEffect } from '@react-navigation/native';
import Images from '../../Themes/Images';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect, useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';
import { Mapa } from '../../Components/carpooling/Mapa';
import { MetodoPago } from '../../Components/carpooling/MetodoPago';
import { Asientos } from '../../Components/carpooling/Asientos';
import { CarpoolingRegisterVeh } from '../../Containers/Carpooling/CarpoolingRegisterVeh';
import { MsnCreadoVehiculo } from '../../Components/carpooling/MsnCreadoVehiculo';
import { Env } from "../../../keys";
import { calculatePolylineToSave } from '../../Services/calculateRoute';
import { Estrellas } from '../../Components/carpooling/Estrellas';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import LottieView from 'lottie-react-native';

const keyMap = Env.key_map_google
// Dispatch en actions  - Obligatorio
function DetallesMisViajes(props) {
  const dispatch = useDispatch();
  const { infoUser } = useContext( AuthContext );
  const [state, setState] = useState({
    _id : 1,
    dirCasa: '',
    conductor : "Un conductor",
    lSalida : "Alguno",
    llegada : "Alguna",
    frecuencia : "dias",
    vehiculo : "Vehiculo1",
    asientosIda : "3",
    checkMonday : false,
    checkTuesday : false,
    checkWednesday : false,
    checkThursday : false,
    checkFriday : false,
    checkSaturday : false,
    checkSunday : false,
    sameHour:true,
    changeHour: false,
    lastWeek : false,
    thisMonth : false,
    toCancel : false,
    outHour : new Date(),
    changeHourValue : new Date(),
    showFrecuency : false,
    isOpenBackgroundInfoModal : false,
  });

  const [ lsalida, setLsalida ] = useState('vacio');  
    const [ alturaMapa ] = useState(new Animated.Value(Dimensions.get("window").height * 0.6));
  const [ lllegada, setLllegada ] = useState('vacio');
  const [position1, setPosition1 ] = useState({lat: '',lng: ''});
  const [position2, setPosition2 ] = useState({lat: '',lng: ''});
  const [ asientos, setAsientos ] = useState('');
  const [ vehiculoSelect, setvehiculoSelect ] = useState('');
  const [ placa, setPlaca ] = useState('');
  const [ btnpuntoPC, setbtnpuntoPC ] = useState(false);
  const [ btnpuntoPO, setbtnpuntoPO ] = useState(false);
  const [ modalEditPago, setModalEditPago ] = useState(false);
  const [searchQuery, setSearchQuery] = useState(true);
  const [searchQueryDestiny, setSearchQueryDestiny] = useState(true);
  const [activarRuta, setActivarRuta] = useState(false);
  const [ coorSalidaSolicitud, setCoorSalidaSolicitud ] = useState('');
  const [ coorLlegadaSolicitud, setCoorLlegadaSolicitud ] = useState('');
  const [ activaRutaSolicitud, setActivaRutaSolicitud] = useState(false);
  const [ loadedTrips, setLoadedTrips ] = useState(true);
  const [ checkDaviPlata, setCheckDaviPlata ] = useState(true);
  const [ checkCash, setCheckCash ] = useState(true);
  const [ calculoDistance, setCalculoDistance ] = useState('');
  const [ calculoDuracionGoogle, setCalculoDuracionGoogle ] = useState('');
  const [ isCheckedCarro, setIsCheckedCarro ] = useState(true);
  const [ isCheckedMoto, setIsCheckedMoto ] = useState(false);
  const [ travelIn, setTravelIn ] = useState('Carro');
 

  let currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 5 );
  const formatearFecha =  (fecha) => { 
    let fechaF = new Date(fecha); 
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones); 
    return(fechaFormateada);
}

  const handlePlaceSelectOutPoint = (point, data, details) => {
    if(point == 1){
      setLsalida(data.description);
      if (details) {
        const { lat, lng } = details.geometry.location; // Obtiene las coordenadas (latitud y longitud) del lugar
        setPosition1({ lat: lat, lng: lng })
        setActivarRuta(true);
      }
      setSearchQuery(true);
    }else{
      setLllegada(data.description);
      if (details) {
        const { lat, lng } = details.geometry.location; // Obtiene las coordenadas (latitud nggitud) del lugar
        setPosition2({ lat: lat, lng: lng })
      }
      setSearchQueryDestiny(true);
      setActivarRuta(true);
    }
  };

  const nPuestoSelect = (valor) => {
    setAsientos(valor)
  }

  const modalActivo = (valor) => {
    setModalEditPago(valor)
  }


  const goBack = async () => { 
      RootNavigation.navigate('PerfilHome')
  }
  
  const restarCincoHoras = (hora) => {
    const nuevaFecha = new Date(hora);
    nuevaFecha.setHours( nuevaFecha.getHours() - 5 );
    return nuevaFecha;
  };


  const toggleCheckBoxVehicle = () => {
    setIsCheckedMoto(!isCheckedMoto);
    setIsCheckedCarro(!isCheckedCarro);
  };

  const resetDatos = async () => {
    await dispatch(limpiarPsalida());
    await dispatch(limpiarPllegada());
    await setLllegada('vacio');
    await setLsalida('vacio');
    await dispatch(limpiarEstadoViaje());
    await setAsientos('');
    await setvehiculoSelect('');
    await setPlaca('');
    await setIsChecked('');
    await setbtnpuntoPC(false);
    await setbtnpuntoPO(false);
  }

  useFocusEffect( 
    React.useCallback(() => { 
      dispatch(getVehicles_carpooling());
    }, [])
  );

  useEffect(() => {
    setLoadedTrips(true);
    setTimeout(function(){
      setLoadedTrips(false);
    }, 1000); 
  },[])

  const valorDistancia = (valor) => {
    setCalculoDistance(valor)
  }

  const valorDuracionGoogle = (valor) => {
    setCalculoDuracionGoogle(valor)
  }
  
  if(loadedTrips){
    return (
    <Modal transparent={true}>
        <View style={{ backgroundColor: Colors.$blanco, flexDirection: "column", flex: 1 }}>
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
      <SafeAreaView style={styles.contenedorPrincipal}>
        {(modalEditPago) ? modalPagosEdit() : <></>} 
        {(!searchQuery) ? 
        <View style={{
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          alignItems: 'center',
          backgroundColor: Colors.$texto50,
          zIndex: 5
        }}>
          <View style={{
            height: 150,
            width: "100%",  
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.$primario
          }}>
            <Image source={Images.iconoalerta} style={{width: 50, height: 50, tintColor: 'white'}}/>
            <Text style={{
              width: "70%",
              fontSize: 16,
              textAlign: 'center',
              color: Colors.$blanco,   
              fontFamily: Fonts.$poppinsregular         
            }}>Por favor, ingresa la dirección de origen en el campo de texto.</Text>
            
          </View>
          
        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields: 'geometry' }}
          fetchDetails={true}
          placeholder='Tocar acá y escribe una dirección.'
          textInputProps={{
            placeholderTextColor: '#2f3031'
          }}
          onPress={(data, details = null) => {
            handlePlaceSelectOutPoint(1,data, details)
          }}
          query={{
            key: keyMap,
            language: 'es',
            components: 'country:co'  // Limitar resultados a Colombia
          }}
          predefinedPlaces={[]}
          styles={{
            container: {
              flex: 1,
              position: 'absolute',
              top: 150,
              zIndex : 5,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: Fonts.$poppinsregular
            },
              textInputContainer: {
              width: Dimensions.get('window').width,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: Colors.$blanco,
              backgroundColor: Colors.$tercer,
              borderRadius: 5,
              backgroundColor: 'white',
              fontFamily: Fonts.$poppinsregular
            },
            textInput: {
              fontSize: 18,
              backgroundColor: Colors.$tercer,
              width: "100%",
              fontFamily: Fonts.$poppinsregular
            },
            listView: {
              backgroundColor: 'white',
              fontFamily: Fonts.$poppinsregular
            },
        }}
        /> 
        </View>
        : 
        <></>}
        {(!searchQueryDestiny) ? 
        <View style={{
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          alignItems: 'center',
          backgroundColor: Colors.$texto50,
          zIndex: 5
        }}>
          <View style={{
            height: 150,
            width: "100%",  
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.$primario
          }}>
            <Image source={Images.iconoalerta} style={{width: 50, height: 50, tintColor: 'white'}}/>
            <Text style={{
              width: "70%",
              fontSize: 16,
              textAlign: 'center',
              color: Colors.$blanco,   
              fontFamily: Fonts.$poppinsregular         
            }}>Por favor, ingresa la dirección de destino en el campo de texto.</Text>
            
          </View>
        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields: 'geometry' }}
          fetchDetails={true}
          placeholder='Tocar acá y escribe una dirección.'
          onPress={(data, details = null) => handlePlaceSelectOutPoint(2,data, details)}
          query={{
            key: keyMap,
            language: 'es',
            components: 'country:co'  // Limitar resultados a Colombia
          }}
          predefinedPlaces={[]}
          styles={{
            container: {
              flex: 1,
              position: 'absolute',
              top: 150,
              zIndex : 5,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: Fonts.$poppinsregular
          },
            textInputContainer: {
            width: Dimensions.get('window').width,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: Colors.$blanco,
            backgroundColor: Colors.$tercer,
            borderRadius: 5,
            backgroundColor: 'white',
            fontFamily: Fonts.$poppinsregular
          },
          textInput: {
            fontSize: 18,
            backgroundColor: Colors.$tercer,
            fontFamily: Fonts.$poppinsregular
          },
          listView: {
            backgroundColor: 'white',
            fontFamily: Fonts.$poppinsregular
          },
        }}
        /> 
         
        </View>
        : 
        <></>}
        { (!props.dataCarpooling.saveTripCarpooling) ?
        <ScrollView>
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
                alturaMapa={alturaMapa}
              />
            </View>

            <View style={styles.cajaCabeza}>
              <Text style={styles.textTitle}>5.000$</Text>
              <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(16), marginBottom: 10, color: 'black' }}>Pasajero</Text>
              <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(16), marginBottom: 10, color: 'black' }}>  {formatearFecha(props.dataCarpooling.dataTripSelectRide.compartidoViajeActivo.fecha)}</Text>
              <Text style ={styles.lineaDetallesViaje}>...</Text>
             
              <Text style={{ fontSize: 14, color: Colors.$texto50, fontFamily: Fonts.$poppinsregular, marginLeft:10}}>Destino : {props.dataCarpooling.dataTripSelectRide.compartidoViajeActivo.llegada}</Text>
              <Estrellas style={{width:500}} calificacion={4}/>
              <Pressable  
                  onPress={() => { goBack() }}
                  style={ styles.btnAtras }>
                  <View>
                  <Image source={Images.atras_Icon} style={[styles.iconBici, {tintColor : 'black'}]}/> 
                  </View>
              </Pressable>
            </View>
           
            <View style={[styles.box, {marginTop: 50}]}>
            
              <View style={styles.centerInputsPoints}> 
              <View style={[styles.boxRow, {marginBottom : 0}] }>
                <Text style={styles.textRowPartida}></Text>
                <TextInput
                  style={styles.textCampo}
                  onFocus={() =>{
                    setSearchQuery(false)
                    setLsalida(lsalida)
                  }}
                  value={lsalida}
                  placeholder="Escribe un lugar"
                />
              </View>

              <View style={styles.boxRow}>
                <Text style={styles.textRowLlegada}></Text>
                <TextInput
                  style={styles.textCampo}
                  onFocus={() =>{
                    setSearchQueryDestiny(false)
                    setLllegada(lllegada)
                  }}
                  value={lllegada}
                  placeholder="Escribe un lugar"
                />
              </View>
              </View>
              <View style={styles.cajaPasajeros} >
                    <View style={styles.cajaDatosPasajero}>
                    
                        <View style={styles.cajaDatosPasajeroV}>
                        <Text style={styles.textSolicitud}>
                         {props.dataCarpooling.dataTripSelectRide.compartidoViajeActivo.bc_usuario.usu_nombre}
                        </Text>
                        <View style={styles.cajaRow}>
                        <Estrellas style={{width:Dimensions.get('window').width*.5}} calificacion={4}/>
                        <Image source={Images.iconochatActivo} style={styles.imgChat}/>

                        </View>
                      
                        <View style={ styles.cajaRow }>
                        <Text>
                        {props.dataCarpooling.dataTripSelectRide.compartidoViajeActivo.compartidoVehiculo.marca}
                          </Text>
                        </View>
                        </View>
                    </View>
        </View>
            </View>


            <View style={[styles.box, {borderColor : Colors.$blanco}]}>
            </View>
            <View style={styles.boxV}>
            </View>  
            </View>
        </ScrollView>
        :
        <ImageBackground source={Images.fondoMapa} style={{        
          flex: 1,
          width: '100%', 
          alignItems: 'center',
          justifyContent: 'center'
          }}>
      
        </ImageBackground>
        }
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  cajaCheck: {
    width: "10%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: Dimensions.get('window').width*.8,
    height: 250, 
  },
  btnCheck: {
      width: 20,
      height: 20,
      borderWidth : 3,
      borderColor : Colors.$texto,
      borderRadius : 10,
      marginRight: 5
  },
  cajaPasajeros: {
    width: Dimensions.get('window').width*.9,
    padding: 10,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth : 1,
    borderColor : Colors.$texto20,
    borderRadius : 15,
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
  imgChat: {
    width: 20,
    height: 20,
    marginLeft:120
  },
  contenedorPrincipal:{
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.$blanco,
    position: "relative",
  },
  cajaVehiculos: {
    alignItems: "center",
  },
  cajaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  cajaRow2: {
    width: 120,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cajaPartidaImg: {
    width: "40%",
    alignItems: 'center',
    justifyContent: 'center',
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
  imgPago: {
    width: 40,
    height: 40,
    borderRadius: 10
  },
  contentViajeSave: {
    width: Dimensions.get('window').width*.8,
    height: Dimensions.get('window').height*.5,
    backgroundColor: Colors.$blanco,
    alignItems : 'center',
    justifyContent: 'space-around',
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
  logoViajeSave: {
    width: 200,
    height: 100,
  },
  textViajeSave: {
    width: Dimensions.get('window').width*.5,
    textAlign: 'center',
    alignSelf: "center",
    borderRadius: 10,
    fontSize : 20,
    color: Colors.$texto80,
    marginTop: 10,
    fontFamily: Fonts.$poppinsmedium
  },
  cajaBtnsViajeSave: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnPrimarioViajeSave: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : Colors.$primario,
    borderRadius : 50,
    width: 200,
    height: 30,
    marginBottom: 10
  },
  scroll: {
    width: Dimensions.get('window').width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  iconBici: {
    width: 25,
    height: 25,
  },
  textH2: {
    fontSize: 22,
    fontFamily: Fonts.$poppinsregular
  },
  textMsn: {
    width: Dimensions.get('window').width*.5,
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: Colors.$texto
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
    color: Colors.$texto50,
    fontFamily: Fonts.$poppinsregular
  },
  textSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    fontSize : 20, 
    fontFamily : Fonts.$poppinsregular,
    
    alignSelf: "center",
    color: Colors.$darkgray
  },
  changeHourTask : {
    alignItems: 'center',
  },
  boxDateIn: { 
    flex: 1, 
    marginBottom: 20, 
    alignItems: 'center'
  },
  textTitle: {
    marginTop: 30, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontSize : 22,
    fontWeight:'bold', 
    fontFamily : Fonts.$poppinsmedium,
    alignSelf: "center",
    color: Colors.$texto80
  },
  frequency: {
    width: 150, 
    height: 80,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20
  },
  container: {
    flex: 1,
    alignItems: "baseline",
    justifyContent: "center",
    width: 180
  },  
  btnPrimario : {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : Colors.$primario,
    borderRadius : 20,
    width: 150,
    height: 40
  },
  btnClear: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : Colors.$primario,
    borderRadius : 20,
  },
  btnAsientos: {
    width: 40,
    height: 40,
    borderRadius : 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  btnSecundario : {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : Colors.$secundario,
    borderRadius : 20,
    width: 150,
    height: 40
  },
  cajaDatosPasajero: {
    flexDirection: "row"
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
  goToAddV : {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor : Colors.$primario,
    borderRadius : 50,
    width: 60,
    height: 60,
    marginRight: 5
  },
  cajaCabeza: {
    backgroundColor: 'white',
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
  cajaRegistrarV:{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.3,
  },
  box : {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width*.9,
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
  },
  boxV : {
    flex: 1,
    width: Dimensions.get('window').width,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
  },
  numeros: {
    position: 'absolute',
    left: 10,
    top: 10,
    fontSize: 30,
    
    alignSelf: "center", 
  },
  centerInputsPoints : {
    display : 'flex',
    justifyContent : 'center',
   
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
  lineaDetallesViaje:{
    borderWidth : 1,
    borderColor : Colors.$black,
    borderRadius:15,
    backgroundColor:'black',
    height:5,
    marginTop:20,
    width:250
  },
  boxRow90: {
    flex: 1,
    width: Dimensions.get('window').width*.9,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'space-around',
    backgroundColor: Colors.$blanco,
    marginBottom: 25
  },
  boxCenter: {
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'center',
  },
  box2: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'space-around',
    padding: 10
  },
  box3: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'center',
    padding: 10,
    position: 'relative',
  },
  box4: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: Dimensions.get('window').width*.9,
    minHeight: Dimensions.get('window').height*.6,
    position: 'relative',
    borderWidth : 1,
    borderColor : Colors.$primario,
    borderRadius : 1,
    borderStyle : 'dashed',
    marginTop: 10,
    marginBottom: 10,
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
  textButtonIcon : {
    textAlign: "center", 
    fontSize: 20,
  },
  textButtonYellow : {
    fontFamily: Fonts.$poppinsregular, 
    textAlign: "center", 
    fontSize: 18, 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: Colors.$blanco,
    width : 120,
    
    alignSelf: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  } ,
  btn: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 2,
    paddingRight : 2,
    paddingTop : 10,
    paddingBottom: 10
  },
  btnActive: {
    alignItems: 'center',
    backgroundColor: Colors.$primario,
    borderColor: Colors.$texto,
    color : '#DBDBDB', 
    fontSize : 17,
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 2,
    paddingRight : 2,
    paddingTop : 10,
    paddingBottom: 10
  },
  weekContainer : { 
    flex: 1, 
    flexDirection : 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom : 15
  },
  weekDay : {
    flex: 1, 
    flexDirection : 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  rulesText : {
    fontSize : 18, 
    fontFamily: Fonts.$poppinsregular,
    marginBottom : 18,
    
    alignSelf: "center",
    width: Dimensions.get('window').width*.5,
    color: Colors.$darkgray,
  },
  rulesTextTitulo : {
    width: Dimensions.get('window').width*.6,
    textAlign: 'center',
    fontSize : 16, 
    fontFamily: Fonts.$poppinsregular,
    marginBottom : 20,
    
    alignSelf: "center",
    color: Colors.$texto50
  },
  textFecha: {
    width: Dimensions.get('window').width*.4,
    textAlign: 'right',
    fontSize: 20,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto
  },
  textHora: {
    width: Dimensions.get('window').width*.4,
    fontSize: 20,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto
  },
  lineContainer : {
    paddingEnd : 20,
    paddingStart : 20,
    marginBottom : 20
  },
  line : {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor:Colors.$primario,
  },
  vehiculeList : {
    textAlign : 'left',
    paddingStart : 30,
    fontSize : 16
  },
  vehiculeTouch : {
    width: Dimensions.get('window').width*.7,
    borderBottomColor : Colors.$primario, 
    borderWidth : 1,
    borderColor : Colors.$secundario,
    borderRadius : 20,
    margin: 15
  },
  numAsientoText: {
    width:60,
    textAlign: 'center',
    fontSize : 50, 
    fontFamily : Fonts.$poppinsregular,
    
    alignSelf: "center",
    borderWidth : 1,
    borderColor : Colors.$primario,
    borderRadius : 1,
    borderStyle : 'dashed',
  },
  precioText: {
    width:160,
    textAlign: 'center',
    fontSize : 30, 
    fontFamily : Fonts.$poppinsregular,
    
    alignSelf: "center",
    borderWidth : 1,
    borderColor : Colors.$primario,
    borderRadius : 1,
    borderStyle : 'dashed',
  },
  boxPrincipalItems: {
    width: Dimensions.get("window").width*.8,
    height: Dimensions.get("window").height*.1,
    backgroundColor: 'red',
    flexDirection: 'row',
    flexWrap: "wrap",
    paddingTop: 20,
    paddingBottom: 20,
  },
  btnVehiculos: {
    width: 120,
    height: 120,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    shadowColor: Colors.$texto,
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 4.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  textVehiculo: {
    fontSize: 16,
    color: Colors.$texto,
    textAlign: 'center',
  },
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
    height: "100%",
    borderRadius: 6, 
    marginVertical: 1, 
    justifyContent: "space-around", 
    alignItems: "center", 
  },
  containerchecks : {
    flexDirection : 'row',
    justifyContent : 'center',
    margin : 20,
    marginBottom : 0
  },
  checkvehicle : {
    flexDirection : 'row',
    justifyContent : 'center',
    width: '50%'
  },
  btnAceptar: {
    width: Dimensions.get("window").width*.9,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.$primario,
    height: 50,
    marginTop: 20
  },
  cajaMapa: {
    width: Dimensions.get("window").width,
  },
  btnCheckOK: {
    width: 20,
    height: 20,
    borderWidth : 3,
    borderColor : Colors.$texto,
    borderRadius : 100,
    backgroundColor: Colors.$adicional,
    marginRight: 5,
  },
  btnCheck: {
    width: 20,
    height: 20,
    borderWidth : 3,
    borderColor : Colors.$texto,
    borderRadius : 100,
    marginRight: 5,
  },
});

function mapStateToProps(state) {
  return {
    dataVehicule : state.reducerCarpooling,
    dataMySQL: state.reducer3G,
    dataCarpooling: state.reducerCarpooling
  }
}

export default connect(mapStateToProps)(DetallesMisViajes);
