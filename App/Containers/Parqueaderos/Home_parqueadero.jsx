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
  Linking
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LottieView from 'lottie-react-native';
import Fonts from '../../Themes/Fonts';
import {
  get_vehycle_id
} from '../../actions/actions3g';
import { 
  save_token_msn
} from '../../actions/actionCarpooling'
import {
  validate_tyc,
  accept_tyc,
  validate_qr,
  reset_error_parqueo,
  sin_cupo,
  reset_qr,
  reserveActive,
  cancelar_reserva_,
  horas_parqueo,
  savePrestamo,
  buscar_parqueo_activo_parqueadero
} from '../../actions/actionParqueadero';
import { connect, useDispatch } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import estilos from './styles/reservas';
import RNPickerSelect from  '@nejlyg/react-native-picker-select';
import { AuthContext } from '../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import * as RootNavigation from '../../RootNavigation';
import { TYC } from "./TyC";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

function Home_parqueadero(props) {

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
  const [horaSelect, setHoraSelect] = useState(0);
  const [saldoActivo, setSaldoActivo] = useState(false);

 
    const [segundos, setSegundos] = useState(props.dataRent.segundosResta);
    const [minutos, setMinutos] = useState(props.dataRent.minutosResta);
    const [horas, setHoras] = useState(props.dataRent.horasResta);
    const [diaRestante, setDiaRestante] = useState(props.dataRent.diaResta); 
     
    useEffect(()=>{
        setSegundos(props.dataRent.segundosResta);
        setMinutos(props.dataRent.minutosResta);
        setHoras(props.dataRent.horasResta);
        setDiaRestante(props.dataRent.diaResta); 
    },[props.dataRent.segundosResta])
  
    useEffect(()=>{
      const timer = setInterval(() => {
          if (segundos > 0) {
              setSegundos(segundos - 1);
              }else if(segundos == 0 && minutos > 0){
              setMinutos(minutos - 1);
              setSegundos(59);
              }else if(segundos == 0 && minutos == 0 && horas > 0){
              setHoras(horas - 1);
              setMinutos(59);
              setMinutos(59);
              }else if(segundos == 0 && minutos == 0 && horas == 0 && diaRestante > 0){
              setDiaRestante(diaRestante - 1);
              setHoras(23);
              setMinutos(59);
              setMinutos(59);
              }else{
              }
      }, 1000);
      return () => clearInterval(timer);
    },[segundos])

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
    await RootNavigation.navigate('MyVEL_parqueadero');
  }

  const ir_reservar = async() => {
    await RootNavigation.navigate('Reservar_parqueadero');
  }

  /*const ir_rentar = async() => {
    await RootNavigation.navigate('Rentar_parqueo');
    //await RootNavigation.navigate('Horas');
  }*/

  const ir_rentar  = async() => {
    console.log('ffff')
      //await RootNavigation.navigate('Rentar_parqueadero');
      dispatch(horas_parqueo(4, true)); 
  } 

  const ir_rentar_consaldo  = async() => {
      console.log('horas a parquear: ',horaSelect)
      console.log('saldo: ', props.dataParqueo.dataTyC.saldo)
      console.log('horas a parquear: ',horaSelect)
      if (horaSelect === 0 || horaSelect === '') {
        Alert.alert('Seleccionar horas', 'Por favor seleccione las horas a parquear')
        return
      }

      if (props.dataParqueo.dataTyC.saldo < horaSelect) {
        Alert.alert('Saldo insuficiente', 'No tienes saldo suficiente para parquear')
        return
      }

      Alert.alert(
          "Continuar",
          "¿Estás seguro de las horas seleccionadas?",
          [
              {
                  text: "Cancelar",
                  style: "cancel"
              },
              {
                  text: "OK",
                  onPress: () => dispatch(horas_parqueo(horaSelect, true))
              }
          ]
      );
  } 

  useEffect(() => {
      if (props.dataParqueo.horasSeleccionadasParqueo) {
          RootNavigation.navigate('Rentar_parqueadero');
      }

      if (!props.dataParqueo.horasSeleccionadasParqueo) {
          setHoraSelect('');
          //setSaldoActivo(false);
      }

  },[props.dataParqueo.horasSeleccionadasParqueo])
  
  const aceptTyC = async() => {
    if (!props.dataParqueo.conectividad_net) {
       return
    }
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

  useEffect(() => {
  },[])

  useFocusEffect( 
    React.useCallback(() => { 
      console.log('vericacion desde focus de validate hgjhgjghj si entra')
      dispatch(validate_tyc());
    },[])
  );

  useFocusEffect( 
      React.useCallback(() => {
        if (!props.dataParqueo.conectividad_net) {
          return
        }

        if (!props.dataRent.saliendo_mod) {
          //dispatch(rentActive(infoUser.DataUser.idNumber))
          if (props.dataParqueo.conectividad_net) {
            dispatch(reserveActive(infoUser.DataUser.idNumber));
          }
        }
      }, [])
  );

  useEffect(() => {
    if (props.dataParqueo.conectividad_net) {
      dispatch(validate_tyc());
    }
  },[])

  useEffect(() => {
    if (props.perfil.dataempresa[0]._parquadero === 'ACTIVO+SALDO') {
      setSaldoActivo(true);
    }
  },[props.perfil.dataempresa[0]])

  useEffect(() => {
    console.log('verify?tyc desde effect', props.dataParqueo.verify_tyc)
    if (props.dataParqueo.verify_tyc) {
      setTyC(true);  
      if (props.dataParqueo.ultimo_vehiculo === 'sin vehiculo') {
        console.log('no tiene un vehiculo asignado', props.dataParqueo.ultimo_vehiculo)
        RootNavigation.navigate('MyVEL_parqueadero');
      }else {
        console.log('si tenemos id ultimo vehiculo es:',props.dataParqueo.ultimo_vehiculo)
        if (!props.dataParqueo.conectividad_net) {
          Alert.alert('Para aceptar T&C deber estar conectado a internet.');
          return
        }
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

  useFocusEffect( 
    React.useCallback(() => { 
      if (props.dataRent.vel_select_cargado) {
        console.log('VEL por id es : ', props.dataRent.vel_select)
        SetVel__(props.dataRent.vel_select);
      }
    },[])
  );

  useFocusEffect( 
    React.useCallback(() => {
      if (props.dataParqueo.conectividad_net) {
        if (props.dataParqueo.verify_tyc) {
          console.log('entro a esta mierda hdjasdhjasdhk')
          dispatch(get_vehycle_id(props.dataParqueo.ultimo_vehiculo))
        }
      }
    },[])
  );

  const cancelar_reserva = () => {
    if (!props.dataParqueo.conectividad_net) {
       Alert.alert('Para cancelar la reserva deber estar conectado a internet.');
       return
    }
    console.log('cancelando reserva', props.dataParqueo.reservas.data[0].id)
    dispatch(cancelar_reserva_(props.dataParqueo.reservas.data[0].id, props.dataParqueo.reservas.data[0].lugar_parqueo))
  }

  useEffect(() => {
    if (props.dataParqueo.save_tyc) {
      RootNavigation.navigate('MyVEL_parqueadero');
      setTyC(true);
    }
  },[props.dataParqueo.save_tyc])

  useEffect(() => {
    setTimeout(function(){
      setPreload(false);
    }, 3000); 
  },[])

  /*useEffect(() =>{
      if (props.dataParqueo.reservaSave) {
        Alert.alert(
            "Si ya te parqueaste",
            "Puedes validar el qr: " + props.dataParqueo.qrReservado,
            [
                {
                    text: "NO",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => dispatch(validate_qr(props.dataParqueo.qrReservado, 'scaner', 'conreserva'))
                }
            ]
        );
      }
    },[props.dataParqueo.reservaSave])*/

  //validando los errores
  useEffect(() =>{
    if (props.dataParqueo.validate_Qr) {
      console.log('Se validó el qr y vamos a crear el registro de parqueo');
      guardarPrestamo()
    }
  },[props.dataParqueo.validate_Qr])

  const guardarPrestamo = async () => {
    console.log('se va a guardar la renta ')
      let hoy = new Date(); // Fecha local
      let hoy_5 = new Date(hoy.getTime() - 5 * 60 * 60 * 1000);
      const formatoHora = (date) => {
          return date.toLocaleTimeString('es-CO', { hour12: false }); // Hora local HH:mm:ss
      };
  
      let inicio = new Date(); // Hora actual local
      let fin = new Date(inicio.getTime() + 4 * 60 * 60 * 1000); // Sumar n horas
  
      const data = {
          id: uuidv4(),
          usuario: infoUser.DataUser.idNumber,
          parqueadero: props.dataParqueo.lugar_parqueo.parqueadero, 
          lugar_parqueo: props.dataParqueo.lugar_parqueo.id, 
          vehiculo: props.dataRent.vel_select.data.vus_id,
          fecha: hoy_5.toJSON(),   // Si quieres ISO UTC completa, si prefieres local usa hoy.toLocaleString()
          inicio: formatoHora(inicio),
          fin: formatoHora(fin),
          duracion: "duracion",
          dispositivo: Platform.OS,
          estado: "ACTIVA",
      };
  
      console.log('Data para el préstamo parqueadero:', data);
      await dispatch(savePrestamo(data, props.dataRent.vel_select.data.vus_id, dataParqueo, 4, 0)); 

      const pendientes = JSON.parse(await AsyncStorage.getItem('qr_pendientes')) || [];
      
      // Si fue exitoso, elimínalo de la lista
      pendientes.shift();
      await AsyncStorage.setItem('qr_pendientes', JSON.stringify(pendientes));

      await setBtnSeRento(true);
  }

  useEffect(() => {
    if (props.dataParqueo.seParqueo && props.dataParqueo.reservaSave) {
      cancelar_reserva();  
    }
    console.log('se parqueo correctamente, ir a vista parqueo'); 
    if (props.dataParqueo.conectividad_net) {
      dispatch(buscar_parqueo_activo_parqueadero());
    }
  }, [props.dataParqueo.seParqueo])  

  const validarHoras = (value) => {
    if (props.dataParqueo.dataTyC.saldo <= value) {
      Alert.alert("Saldo insuficiente","⚠️ Tu saldo de horas es " + props.dataParqueo.dataTyC.saldo);
      return
    }
    setHoraSelect(value)
  }

  const HourSelector = ({ value = 1, onChange, min = 0, max = 6 }) => {
    const safeValue = typeof value === 'number' ? value : min;

    const increment = () => {
      if (safeValue < max) {
        onChange(safeValue + 1);
      }
    };

    const decrement = () => {
      if (safeValue > min) {
        onChange(safeValue - 1);
      }
    };

    return (
      <View style={stylesSelect.container}>
        
          <Text style={stylesSelect.valueText}>
            {safeValue} {safeValue === 1 ? 'hora' : 'horas'}
          </Text>
          
        
        <View style={{ flexDirection: 'column' }}>
          <Pressable onPress={increment} style={stylesSelect.iconPressable}>
            <Image
              source={Images.iconPickerYellow}
              style={{
                tintColor: Colors.$parqueo_color_fondo,
                width: 20,
                height: 20,
                transform: [{ rotate: '180deg' }],
              }}
            />
          </Pressable>

          <Pressable onPress={decrement} style={stylesSelect.iconPressable}>
            <Image
              source={Images.iconPickerYellow}
              style={{
                tintColor: Colors.$parqueo_color_fondo,
                width: 20,
                height: 20,
              }}
            />
          </Pressable>
        </View>
      </View>
    );
  };


  if (preload) {
    return (
      <View style={styles.contenedor}>
        <LottieView 
          source={require('../../Resources/Lotties/parqueadero_home.json')} autoPlay loop 
          style={{
            width: Dimensions.get('window').width*.7,
            height: Dimensions.get('window').height*.7,  
            backgroundColor: Colors.$parqueo_color_texto          
          }}
        />
      </View>
    );
  }else {
    if (!tyc) {
      return (
        <ImageBackground source={Images.MapaImagen} style={{        
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
        <ImageBackground source={Images.MapaImagen} style={{        
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          justifyContent: 'center',
          alignItems: 'center',
          }}>
        <View style={styles.imgFondo}>
          <KeyboardAwareScrollView>
          <View style={{        
              flex: 1,
              width: '100%', 
              justifyContent: 'center',
              }}>
            <View style={styles.contenedor2}>

              <View style={styles.cajaCabeza}>
                  <Pressable  
                      onPress={() => { goBack() }}
                      style={ styles.btnAtras }>
                      <View>
                      <Image source={Images.parqueo_cerrar} style={[styles.iconMenu]}/> 
                      </View>
                  </Pressable>
                  <View style={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: "60%",
                    paddingLeft: 30
                  }}>
                  <Text style={styles.titulo}>Parqueaderos</Text>
                  <Text style={props.dataParqueo.conectividad_net ? styles.statusOn : styles.statusOff}>
                      { props.dataParqueo.conectividad_net ? 'Conectado' : 'Sin conexión'}
                  </Text>
                  </View>
                  
                  
              </View>

              
              <View style={{
                width: Dimensions.get('window').width,
                height: "70%",
                marginBottom: 20,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}>
                
                
                {
                  props.dataRent.vel_select_cargado ? 
                  <View
                    style={{
                      backgroundColor: Colors.$parqueo_color_fondo,
                      width: "80%",
                      height: 'auto',
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  > 
                    <View style={{
                      width: "100%",
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                      padding: 10,
                    }}>
                        
                        <Image 
                          source={{ uri: props.dataRent.vel_select.data.vus_img }} 
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 50,
                            borderColor: Colors.$parqueo_color_texto,
                            borderWidth: 4
                          }}/>
                        
                        <View style={{ 
                            width: '70%',
                            height: '100%',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'start',
                        }}>
                          <Text style={{fontSize: 20,fontSize: 24,color: Colors.$parqueo_color_primario,textAlign: 'center',fontFamily: Fonts.$poppinsmedium}}>{props.dataRent.vel_select.data.vus_tipo}</Text> 
                          
                          <Text style={{
                            fontSize: 18,
                            width: "100%",
                            color: Colors.$parqueo_color_texto_50,
                            textAlign: 'flex-start',
                            fontFamily: Fonts.$poppinsmedium}}>Vehículo Principal</Text> 

                          <Pressable
                              onPress={() => ir_vel()}
                              style={{
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: Colors.$parqueo_color_texto,
                              borderRadius: 15,
                              width: 150,
                              marginTop:10
                            }}>
                                <Text style={{
                                  fontSize: 16, 
                                  fontFamily: Fonts.$poppinsregular,
                                  color: Colors.$parqueo_color_fondo
                                }}>Mis vehículos</Text>
                          </Pressable> 
                        </View>
                        
                       
                    </View>
                    {
                      saldoActivo ?
                      <View style={{
                        width: Dimensions.get('window').width*.5,
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: Colors.$parqueo_color_adicional_50,
                        padding: 2,
                        borderRadius: 10,
                        marginBottom: 20,
                        marginTop: 20
                      }}>
                        <Text style={{
                          color: Colors.$parqueo_color_texto_50,
                          fontSize: 20,
                          fontFamily: Fonts.$poppinsmedium
                        }}>Saldo horas:  
                        <Text style={{
                          fontSize: 26,
                          color: Colors.$parqueo_color_texto,
                          fontFamily: Fonts.$poppinsmedium
                        }}> {props.dataParqueo.dataTyC.saldo}</Text>
                        </Text>
                      </View>:null
                    }
      
                  </View>
                  :
                  <>
                  <Text style={{
                    width:Dimensions.get('window').width*.8,
                    color: Colors.$parqueo_color_texto_80,
                    fontSize: 20,
                    textAlign: 'center',
                    marginBottom: 20
                  }}>👉 "No tienes un vehículo seleccionado. Ve a Mis vehículos y elige uno para continuar."</Text>
                  <Pressable
                      onPress={() => ir_vel()}
                      style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.$parqueo_color_texto,
                      borderRadius: 15,
                      width: 150,
                      marginTop:10
                    }}>
                        <Text style={{
                          fontSize: 16, 
                          fontFamily: Fonts.$poppinsregular,
                          color: Colors.$parqueo_color_fondo
                        }}>Mis vehículos</Text>
                  </Pressable> 
                  </>
                  
                } 
                {
                  props.dataParqueo.reservaSave ?
                  <View style={{
                    backgroundColor: Colors.$parqueo_color_fondo,
                    alignItems: 'center',
                  }}>
                    
                  <View style={{
                    width: Dimensions.get('window').width*.7,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: Colors.$parqueo_color_secundario_20,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 20,
                    marginTop: 20
                  }}>
                      <View style={{
                        width: '60%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: Colors.$parqueo_color_fondo
                      }}>
                        <Text style={{    
                            textAlign: "center",
                            width: '80%',
                            fontSize: 16,
                            color : Colors.$parqueo_color_texto_50,
                            fontFamily: Fonts.$poppinsregular
                          }}>Parqueadero reservado</Text>
                        <Text style={{    
                          textAlign: "center",
                          width: 'auto',
                          fontSize: 25,
                          color : Colors.$parqueo_color_primario,
                          fontFamily: Fonts.$poppinsregular
                        }}>{props.dataParqueo.lugarReservado}</Text>
                      </View>
                      
                      <Pressable 
                        onPress={() => cancelar_reserva() } 
                        style={ styles.btnCancelar }>
                          
                          <Image source={Images.can_Icon} style={[styles.iconDel, {tintColor: Colors.$parqueo_color_primario}]}/> 
                          <Text style={{
                            width: 80,
                            textAlign: 'center',
                            fontSize: 12,
                            color: Colors.$parqueo_color_texto_50
                          }}>Cancelar reserva</Text>
                      </Pressable>
                  </View>
                  <Text style={{    
                      textAlign: "center",
                      width: Dimensions.get('window').width*.8,
                      fontSize: 20,
                      color : Colors.$parqueo_color_texto_50,
                      fontFamily: Fonts.$poppinsregular
                    }}>Tu reserva se vence en:</Text>

                  <View style={styles.cajaCuentaRegresiva}>  
                      {/*<View style={styles.subcajaCuentaRegresiva}>
                          <Text style={styles.numeroCuentaRegrasiva}>
                              {(diaRestante < 10) ? '0'+diaRestante: diaRestante}
                          </Text>
                          <Text style={styles.subtextoCuentaR}>días</Text>
                      </View>
                      <Text>:</Text>*/}
                      <View style={styles.subcajaCuentaRegresiva}>
                          <Text style={styles.numeroCuentaRegrasiva}>
                              {(horas < 10) ? '0'+horas: horas}
                          </Text>
                          <Text style={styles.subtextoCuentaR}>horas</Text>
                      </View>
                      <Text>:</Text>
                      <View style={styles.subcajaCuentaRegresiva}>
                          <Text style={styles.numeroCuentaRegrasiva}>
                              {(minutos < 10) ? '0'+minutos: minutos}
                          </Text>
                          <Text style={styles.subtextoCuentaR}>minutos</Text>
                      </View>
                      <Text>:</Text>
                      <View style={styles.subcajaCuentaRegresiva}>
                          <Text style={styles.numeroCuentaRegrasiva}>
                              {(segundos < 10) ? '0'+segundos: segundos}
                          </Text>
                          <Text style={styles.subtextoCuentaR}>segundos</Text>
                      </View>
                      
                  </View>  
                  </View>
                  :
                  <>
                  {props.dataRent.vel_select_cargado ?
                    <>
                    { 
                      props.dataParqueo.conectividad_net ?
                      <Pressable 
                      onPress={() => ir_reservar() } 
                      style={{    
                        textAlign: "center",
                        width: Dimensions.get('window').width*.8,
                        padding  : 10,
                        margin : 20,
                        backgroundColor : Colors.$parqueo_color_primario,
                        borderRadius : 50
                      }}> 
                        <Text style={[styles.textButton, {width : 250, color : Colors.$blanco, fontFamily: Fonts.$poppinsregular}]}>Reservar</Text>
                    </Pressable>
                    :
                    <Text style={{
                      color: Colors.$parqueo_color_texto,
                      fontSize: 18,
                      fontFamily: Fonts.$montserratMedium
                    }}>No tienes conexión a internet</Text>
                    }
                    </>
                    : null}
                  </>
                  
                }
                
                {props.dataParqueo.conectividad_net && props.dataRent.vel_select_cargado ?
                <Text style={{
                  color: Colors.$parqueo_color_texto_80,
                  fontSize: 18,
                  fontFamily: Fonts.$poppinsmedium
                }}>Ó</Text>:null}

                {
                  saldoActivo?
                  <>
                  { 
                    props.dataRent.vel_select_cargado ?
                    <View style={{
                      width: Dimensions.get('window').width,
                      alignItems: 'center'
                    }}>
                      
                      <View style={{
                        width: "90%",
                        height: 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                      }}>
                        <HourSelector
                          value={horaSelect}
                          onChange={(value) => {
                            setHoraSelect(value);
                          }}
                        />
                        <Pressable 
                          onPress={() => ir_rentar_consaldo() } 
                          style={{    
                            textAlign: "center",
                            width: Dimensions.get('window').width*.4,
                            padding  : 11,
                            backgroundColor : horaSelect > 0 ? Colors.$parqueo_color_adicional_50 :Colors.$parqueo_color_secundario,
                            borderRadius : 50
                          }}> 
                            <Text style={[styles.textButton, {width : 'auto', color : Colors.$parqueo_color_texto, fontFamily: Fonts.$poppinsmedium}]}>Parquear</Text>
                        </Pressable>
                      </View>
                    </View>
                    :
                    null
                  }
                  </>
                  :
                  <>
                  {
                    props.dataParqueo.conectividad_net && props.dataRent.vel_select_cargado ?
                    <Pressable 
                    onPress={() => ir_rentar() } 
                    style={{    
                      textAlign: "center",
                      width: Dimensions.get('window').width*.8,
                      padding  : 10,
                      margin : 20,
                      backgroundColor: Colors.$parqueo_color_secundario,
                      borderRadius : 50
                    }}> 
                      <Text style={[styles.textButton, {width : 250, color : Colors.$parqueo_color_fondo, fontFamily: Fonts.$poppinsmedium}]}>Parquear</Text>
                  </Pressable>
                  :null
                  }
                  </>
                }
              </View>      
              
            </View>
          </View>
          </KeyboardAwareScrollView>
        </View>
        <View style={{
          width: Dimensions.get('window').width,
          height: 'auto',
          alignItems: 'flex-end'
        }}>
        <Pressable 
            onPress={() => Linking.openURL("https://wa.link/oulc2m")} 
            style={ styles.btnWhatsapp }>
              
              <Image source={Images.iconWhatsapp01} style={[styles.iconWhat, {tintColor: Colors.$parqueo_color_primario}]}/> 
              <Text style={{
                width: 80,
                textAlign: 'center',
                fontSize: 12,
                color: Colors.$parqueo_color_texto_50
              }}>¿Podemos ayudarte?</Text>
        </Pressable>
        </View>
        </ImageBackground>
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
    justifyContent: 'space-between'
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
    backgroundColor: Colors.$parqueo_color_primario,
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
    statusOff: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsmedium,
        marginBottom: 10,
        color: Colors.$parqueo_color_primario,
    },
    statusOn: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsmedium,
        marginBottom: 10,
        color: Colors.$parqueo_color_adicional_50,
    },
    imgFondo: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height, 
      justifyContent: 'center',
      position: 'relative'
    },
    contenedor: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      alignItems: "center",
      justifyContent: "center",
      position: 'relative',
      backgroundColor: Colors.$parqueo_color_texto,
    },
    contenedor2: {
      flex: 1,
      backgroundColor: Colors.$parqueo_color_fondo,
      width: Dimensions.get('window').width,
      height: 'auto',
      alignItems: "center",
      justifyContent: "space-beetwen",
      borderRadius: 50,
    },
    cajaAnimacion: {
      width: Dimensions.get('window').width,
      height: 250,
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
      height: 150,
      zIndex: 10000,
      flexDirection: 'row',
      position: 'relative',
      top: 20,
    },
    titulo: {
      fontFamily: Fonts.$poppinsmedium, 
      fontSize: 24, 
      color: Colors.$parqueo_color_texto,
      alignItems: 'flex-start',
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
      top: 10, 
      right: 20,
      width: 70,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 35,
      zIndex: 1000
    },
    btnCancelar:{
      top: 5, 
      right: 0,
      width: 80,
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    btnWhatsapp:{
      position: 'relative',
      bottom: 20,
      right: 10,
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
    },
    iconMenu: {
        width: 30,
        height: 30,
    },
    iconDel: {
        width: 40,
        height: 40,
    },
    iconWhat: {
        width: 40,
        height: 40,
        marginBottom: 10
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
    cajaCuentaRegresiva: {
      width: Dimensions.get('window').width,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20
    },
    subcajaCuentaRegresiva: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: Colors.$texto,
      margin: 2,
      borderRadius: 10,
      width: 70,
    },
    numeroCuentaRegrasiva: {
      fontSize: 20,
      color: Colors.$blanco,
      fontFamily: Fonts.$poppinsmedium,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 15,
    },
    subtextoCuentaR: {
      fontSize: 10,
      textAlign: 'center',
      fontFamily: Fonts.$poppinslight,
      color: Colors.$blanco,
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

const stylesSelect = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 25,
    borderColor: Colors.$parqueo_color_primario,
    padding: 2,
    alignItems: 'center',
    width: Dimensions.get('window').width*.4,
    backgroundColor: Colors.$parqueo_color_primario,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  valueText: {
    fontSize: 20,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$parqueo_color_texto,
    marginVertical: 5,
    fontWeight: '500',
  },
  iconPressable: {
    padding: 2,

  },
});


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 18,
      paddingVertical: 8,
      borderBottomWidth: 1,
      backgroundColor: "transparent",
      paddingLeft: 15,
      marginLeft: 20,
      marginRight: 20,
      borderColor: '#8ac43f',
      borderWidth: 2,
      borderRadius: 25,
      marginTop: 15,
      color: '#878787',
      height: 40,
      marginBottom: 30,
    },
    inputAndroid: {
      marginLeft: 20,
      marginRight: 20,
      borderWidth: 2,
      borderRadius: 25,
      fontSize: 20,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      paddingBottom: 10,
      color: Colors.$texto,
      backgroundColor: Colors.$parqueo_color_secundario,
      borderColor: Colors.$texto20,
      width: Dimensions.get('window').width*.3,
      paddingLeft: 20,
      fontFamily: Fonts.$poppinsregular,
      textAlign: 'Flex-start',
      position: 'relative'
    },
    placeholder: {
      color: Colors.$texto,
    },
    registerTitleContainer:{
      color: '#f60',
    },
    accountTitle:{
      marginBottom: 1,
    },
});


function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    dataParqueo: state.reducerParqueadero,
    perfil: state.reducerPerfil
  }
}
export default connect(mapStateToProps)(Home_parqueadero);
