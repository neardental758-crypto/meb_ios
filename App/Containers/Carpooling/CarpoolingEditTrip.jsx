import React, { useState, useEffect, useContext } from 'react';
import { 
  Text, 
  View,
  Pressable,
  StyleSheet,
  Image,
  Modal,
  Button,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Animated
} from 'react-native';
import { 
  info_user,
  limpiarPsalida,
  limpiarPllegada,
  getVehicles_carpooling,
  limpiarEstadoViaje,
  sendTrip,
  get_trip_select_carpooling,
  patchTrip,
  limpiarEstadoViajePatch
} from '../../actions/actionCarpooling'
import { useFocusEffect } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import CheckBox from '@react-native-community/checkbox';
import Images from '../../Themes/Images';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Geocoder from 'react-native-geocoding';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';
import { Mapa } from '../../Components/carpooling/Mapa';
import { Asientos } from '../../Components/carpooling/Asientos';
import { Env } from "../../../keys";
import LottieView from 'lottie-react-native';
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español de moment

// Configura moment para que use español como idioma predeterminado
moment.locale('es');

const keyMap = Env.key_map_google
// Dispatch en actions  - Obligatorio
function CarpoolingEditTrip(props) {

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

  const [ lsalida, setLsalida ] = useState('');
  const [ lllegada, setLllegada ] = useState('');
  const [ dirCasa, setDirCasa ] = useState('');
  const [ dirTrabajo, setDirTrabajo ] = useState('');
  const [ asientos, setAsientos ] = useState('');
  const [ vehiculoSelect, setvehiculoSelect ] = useState('');
  const [ placa, setPlaca ] = useState('');
  const [ modalDirSalida, setModalDirSalida] = useState(false);
  const [ punto, setPunto] = useState('');
  const [ btnpuntoPC, setbtnpuntoPC ] = useState(false);
  const [ calculoDistance, setCalculoDistance ] = useState('');
  const [ calculoDuracionGoogle, setCalculoDuracionGoogle ] = useState('');
  const [ alturaMapa ] = useState(new Animated.Value(Dimensions.get("window").height * 0.6));
  const [ alturaCambiada, setAlturaCambiada ] = useState(false);

  const alternarAltura = () => {
    const nuevaAltura = alturaCambiada
      ? Dimensions.get("window").height * 0.6 // Vuelve a la altura original
      : Dimensions.get("window").height * 0.1; // Nueva altura
    Animated.timing(alturaMapa, {
      toValue: nuevaAltura, // La nueva altura
      duration: 500, // Duración de la animación
      useNativeDriver: false, // No es necesario usar el driver nativo para animar altura
    }).start();
    setAlturaCambiada(!alturaCambiada);
  };

  const [activarRuta, setActivarRuta] = useState(false);

  const displayDireccionModal = (value, punto) => {
    setModalDirSalida(value);
    setPunto(punto);
  }

  const direccionModal = () => {
    return (
        <View style={ styles.contenedorModal}>
            <View>
            <Modal transparent={true} animationType="slide">
                <View style={ styles.cajaModal }>
                    <View style={ styles.cajaModal2 }>

                        {
                          punto === 'salida' && punto !== '' ?
                          <View>
                            <Text style={{ textAlign: "center", color: "#818181", fontSize: moderateScale(18), marginTop: 20 }}>Ingresa una dirección de partida </Text>

                            {<GooglePlacesAutocomplete
                                placeholder='Dirección inicial'
                                onPress={(data, details = null) => {
                                    setDirCasa(data.description),
                                    setLsalida(data.description)                              
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
                                      width: Dimensions.get('window').width*.7,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    },
                                    textInputContainer: {
                                      width: Dimensions.get('window').width*.8,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderWidth: 1,
                                      borderColor: Colors.$blanco,
                                      backgroundColor: Colors.$tercer,
                                      borderRadius: 5,
                                    },
                                    textInput: {
                                      fontSize: 18,
                                      backgroundColor: Colors.$tercer,
                                    },
                                    listView: {
                                      backgroundColor: '#fff',
                                    },
                                  }}
                            />}


                          </View>                          
                          :                
                          <></>
                        }

                        {
                          punto === 'llegada' && punto !== '' ?                          
                          <View>
                            <Text style={{ textAlign: "center", color: "#818181", fontSize: moderateScale(18), marginTop: 20 }}>Ingresa una dirección de llegada </Text> 

                            {<GooglePlacesAutocomplete
                            placeholder='Dirección llegada'
                            onPress={(data1, details = null) => {
                                setDirTrabajo(data1.description),
                                setLllegada(data1.description)                              
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
                                  width: Dimensions.get('window').width*.7,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                },
                                textInputContainer: {
                                  width: Dimensions.get('window').width*.8,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderWidth: 1,
                                  borderColor: Colors.$blanco,
                                  backgroundColor: Colors.$tercer,
                                  borderRadius: 5,
                                },
                                textInput: {
                                  fontSize: 18,
                                  backgroundColor: Colors.$tercer,
                                },
                                listView: {
                                  backgroundColor: '#fff',
                                },
                              }}
                        />}
                          </View>
                          :
                          <></>                          
                        }
                        
                        <Pressable  
                            onPress={() => {
                                displayDireccionModal(false, '')
                            }}
                            style={ styles.btnAceptar }>
                                <Text style={{color: '#fff'}}>ACEPTAR</Text>
                        </Pressable>  
                    </View>
                </View>
            </Modal>
            </View>
        </View>
    )
}

  const goBack = () => { RootNavigation.navigate('CarpoolingDriverTrips') }

  const saveTrip = async () => {
    console.log('patch trip carpooling')
    try{
      const trip = {        
        "lSalida": props.dataCarpooling.dirSalida === 'vacio' ? props.dataCarpooling.trip_edit.lSalida : props.dataCarpooling.dirSalida,
        "llegada": props.dataCarpooling.dirLLegada === 'vacio' ? props.dataCarpooling.trip_edit.llegada : props.dataCarpooling.dirLLegada,
        "fecha": props.dataCarpooling.trip_edit.fecha,
        "vehiculo": vehiculoSelect === '' ?  props.dataCarpooling.trip_edit.vehiculos : vehiculoSelect,
        "asientosIda": props.dataCarpooling.asientosIda,
      }
      dispatch(patchTrip(props.dataCarpooling.trip_edit._id, trip))
    }catch(error){
      console.error('Error al obtener la polilínea:', error);
    }
  }

  const cargarDireccionSalida = async (lugar) =>{
    if(props.dataCarpooling.dirSalida === 'vacio') {
      dispatch(info_user('casa', 'psalida'))
      setLsalida(lugar);
      setbtnpuntoPC(true)
    }else {
      dispatch(info_user('casa', 'pllegada'))
      setLllegada(lugar);
      setbtnpuntoPC(true)
    }
  }

  useEffect(() => {
    dispatch(getVehicles_carpooling());
  },[]);

  const irViajesActivos = async () => {
    await dispatch(limpiarPsalida());
    await dispatch(limpiarPllegada());
    await setLllegada('vacio');
    await setLsalida('vacio');
    await dispatch(limpiarEstadoViajePatch());
    await setAsientos('');
    await setvehiculoSelect('');
    await setPlaca('');
    await RootNavigation.navigate('CarpoolingDriverTrips');
  }

  const vehSelect = (id, veh) => {
    setvehiculoSelect(id),
    setPlaca(veh)
  }

  const [isChecked, setIsChecked] = useState('');

  const toggleCheckBox = (idCarro) => {
    setIsChecked(idCarro);
  };

  useFocusEffect( 
    React.useCallback(() => { 
      console.log('Vehículos en focus')
      dispatch(getVehicles_carpooling());
    }, [])
  );

  useEffect(() => {
    if(props.dataCarpooling.trip_edit_cargado){
      console.log('el vehiculo: ', props.dataCarpooling.trip_edit)
      setIsChecked(props.dataCarpooling.trip_edit.vehiculo)
      setActivarRuta(true)
    }
  },[]);

  const formatearFecha =  (fecha) => { 
    let fechaF = new Date(fecha); 
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones); 
    return(fechaFormateada);
  }

  const nPuestoSelect = (valor) => {
    setAsientos(valor)
  }

  const valorDistancia = (valor) => {
    setCalculoDistance(valor)
  }

  const valorDuracionGoogle = (valor) => {
    setCalculoDuracionGoogle(valor)
  }

  return (    
    <SafeAreaView style={styles.contenedorPrincipal}>
      {(modalDirSalida) ? direccionModal() : <></>} 

      {
        
      (!props.dataCarpooling.patchTripCarpooling) ? //es con !
        
      <ScrollView>
        <View style={styles.scroll}>
          <View style={styles.cajaMapa}>

          {
              props.dataCarpooling.trip_edit_cargado ? 
              <Mapa 
                coorSalida={props.dataCarpooling.trip_edit.coorSalida} 
                coorLlegada={props.dataCarpooling.trip_edit.coorDestino} 
                coorCargadas={true}
                ruta={activarRuta}
                valorDistancia={valorDistancia}
                valorDuracionGoogle={valorDuracionGoogle}
                alturaMapa={alturaMapa}
              />
              :
              <>
              <Text>cargando mapa...</Text>
              </>
          }
            
          </View>

          <View style={styles.cajaCabeza}>
            <Text style={styles.textTitle}>Editar viaje</Text>
            <Pressable  
                onPress={alternarAltura}
                style={ styles.btnArriba }>
                <View>
                  <Image source={Images.atras_Icon} style={[styles.iconBici, {tintColor : 'black', transform: [{ rotate: alturaCambiada ? '270deg' : '90deg' }]}]}/> 
                </View>
            </Pressable>
            <Pressable  
                onPress={() => { goBack() }}
                style={ styles.btnAtras }>
                <View>
                <Image source={Images.home} style={[styles.iconBici, {tintColor : 'black'}]}/> 
                </View>
            </Pressable>
          </View>

             
            {
              props.dataCarpooling.trip_edit_cargado ?
              <>
              <View style={styles.boxRow}>
                <Text style={styles.textRowPartida}></Text>
                <Text style={styles.textCampo}>{props.dataCarpooling.trip_edit.lSalida}</Text>
              </View>

              <View style={styles.boxRow}>
                <Text style={styles.textRowLlegada}></Text>
                <Text style={styles.textCampo}>{props.dataCarpooling.trip_edit.llegada}</Text>  
              </View>
              </>
              :
              <></>
            }

          <View style={styles.box}>
            <View style={styles.boxRow90}>
              <Text style={styles.textH2}>Asientos</Text>
              <Asientos asientos={props.dataCarpooling.trip_edit.asientosIda} nPuestoSelect={nPuestoSelect}/>
            </View>
          </View>

          <View style={{ 
            width: '90%',
            textAlign: 'center',
            alignItems: 'center',
            marginBottom: 10,
            marginTop: 10,
          }}> 
              <Text style={{ 
                fontSize: 16,
                width: "80%",
                alignItems: 'center',
                textAlign: 'center',
              }}>
                Fecha: { formatearFecha(props.dataCarpooling.trip_edit.fecha) }
              </Text>                          
          </View>

          <View style={[styles.box, {borderColor : Colors.$blanco}]}>

            

            <View style={styles.box2}>
              <Text style={styles.textFecha}>Fecha</Text>
              <Text style={styles.textHora}>Hora</Text>
            </View>
            
            <DatePicker 
              backgroundColor={Colors.$tercer} 
              textColor={Colors.$texto} 
              mode='datetime' 
              date={state.outHour} 
              onDateChange={(newValue) => setState({...state, outHour : newValue})} />
          </View>
          
          <View style={styles.boxV}>
            <Text style={[styles.textH2, {marginLeft: 30}]}>Vehículo</Text>
            <View style={[styles.cajaVehiculos]}>
                {
                  props.dataCarpooling.myVehiclesCPCargados && props.dataCarpooling.myVehiclesCP? 
                    <>  
                      { props.dataCarpooling.myVehiclesCP.data.length > 0 ?
                      <>
                        {
                          props.dataCarpooling.myVehiclesCP.data.map((data) => 
                            <View
                                key={data._id}
                                style={styles.vehiculeTouch}
                            >   
                              <View style={[styles.cajaRow]}>
                                <View style={styles.cajaPartidaImg}>
                                { data.tipo == 'Carro' ? <Image source={Images.carrorojo} style={styles.imgCarro}/> : <Image source={Images.moto} style={styles.imgMoto}/>} 
                                </View>

                                <View style={{width: '50%', justifyContent: 'center'}}>

                                  <View  style={{flexDirection : 'row',justifyContent : 'space-between'}}>
                                    
                                    <Text style={{textAlign : 'right' , color : 'black'}}>{data.marca} - {data.modelo}</Text>
                                  </View>                                  

                                  <View  style={{flexDirection : 'row',justifyContent : 'space-between'}}>
                                    
                                    <Text style={{textAlign : 'right' , color : 'black'}}>{data.placa} - {data.color}</Text>
                                  </View>

                                </View>

                                <View style={styles.cajaCheck}>
                                    { isChecked === data._id ?
                                        <Pressable
                                            onPress={() => {
                                              toggleCheckBox('')
                                              vehSelect('', '')
                                            }}
                                            style={styles.btnCheckOK}
                                        />:
                                        <Pressable
                                            onPress={() => {
                                              toggleCheckBox(data._id)
                                              vehSelect(data._id, data.placa)
                                            }}
                                            style={styles.btnCheck}
                                        />
                                    }
                                </View>

                              </View>  
                            </View>
                          )
                        }                      
                      </>
                      :
                      <Text style={styles.rulesTextTitulo}>No se encontraron vehículos registrados.</Text>  
                      }
                      
                    </>
                    :
                    <></>
                }
            </View>
          </View>
{/*           
          <View style={[styles.box3, {backgroundColor: Colors.$blanco, justifyContent: 'space-around'}]}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Método de pago</Text>
            <View style={styles.cajaRow2}>
              <Image source={Images.logodaviplata} style={styles.imgPago}/>
              <Image source={Images.iconobillete} style={styles.imgPago}/>
            </View>
            
          </View> */}
          
        </View>

        <View style={[styles.box3, {backgroundColor: Colors.$blanco}]}>
            <Pressable onPress={() => saveTrip() } 
              style={{    
              textAlign: "center",
              padding  : 10,
              margin : 20,
              backgroundColor : Colors.$primario,
              borderRadius : 50}}> 
              <Text style={[styles.textButton, {width : 250, color : 'white'}]}>Guardar</Text>
            </Pressable>
        </View>

      </ScrollView>
      :
      <View style={[styles.contentViajeSave]}>
          
          <Text style={[styles.textViajeSave]}>¡Viaje Actualizado exitosamente!</Text>

          <View style={{
            width: "100%",
            height: 200,
            
          }}>
            <LottieView
              source={require('../../Resources/Lotties/trip_carpooling_ok.json')} autoPlay loop
              style={{
                width: 350,
                height: 350
              }}
            />
          </View> 

          <View style={[styles.cajaBtnsViajeSave]}>
            

            <Pressable
              onPress={ () => irViajesActivos() }
              style={styles.btnPrimarioViajeSave}>
                  <View>
                    <Text style={[styles.textButton, {color: Colors.$blanco}]}>Ir a viajes activos</Text>
                  </View>
            </Pressable>
          </View>
      </View>

      }
      
    </SafeAreaView>

  );
}
const styles = StyleSheet.create({
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
  contenedorPrincipal:{
    backgroundColor: Colors.$blanco,
    padding: 0,
    margin: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
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
    width: "40%",
    flexDirection: "row",
    justifyContent: "space-around"
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
    color: Colors.$texto
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
    color: Colors.$texto50
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
    fontFamily : Fonts.$poppinsregular,
    
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
  cajaRegistrarV:{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.3,
  },
  box : {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
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
  boxRow: {
    flex: 1,
    width: Dimensions.get('window').width*.8,
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent : 'space-around',
    backgroundColor: Colors.$blanco,
    marginBottom: 25
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
    alignSelf: "center", 
    paddingTop: 'auto', 
    paddingBottom: 'auto', 
    color: Colors.$blanco,
    //width : 120,
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
    fontFamily : Fonts.$poppinsregular,
    marginBottom : 18,
    
    alignSelf: "center",
    width: Dimensions.get('window').width*.5,
    color: Colors.$darkgray,
  },
  rulesTextTitulo : {
    width: Dimensions.get('window').width*.6,
    textAlign: 'center',
    fontSize : 16, 
    fontFamily : Fonts.$poppinsregular,
    marginBottom : 20,
    
    alignSelf: "center",
    color: Colors.$darkgray
  },
  textFecha: {
    width: Dimensions.get('window').width*.4,
    textAlign: 'right',
    fontSize: 20,
    
    color: Colors.$texto
  },
  textHora: {
    width: Dimensions.get('window').width*.4,
    fontSize: 20,
    
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
    height: Dimensions.get('window').width*.5,
    borderRadius: 6, 
    marginVertical: 20, 
    marginHorizontal: 20,
    backgroundColor: Colors.$blanco, 
    justifyContent: "space-around", 
    alignItems: "center", 
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
});

function mapStateToProps(state) {
  return {
    dataVehicule : state.reducerCarpooling,
    dataMySQL: state.reducer3G,
    dataCarpooling: state.reducerCarpooling
  }
}

export default connect(mapStateToProps)(CarpoolingEditTrip);
