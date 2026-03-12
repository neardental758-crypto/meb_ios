import React, { useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  Modal,
  Alert
} from 'react-native';
import LottieView from 'lottie-react-native';
import Fonts from '../../Themes/Fonts';
import { 
  reset_tyc,
  save_token_msn
} from '../../actions/actionCarpooling'
import { 
  rentActive,
  getFallas,
  validateUser3g,
  validateHorarios,
  reserveActive,
  viewPenalizaciones,
  calcularDistancia,
  changeVehiculo,
  changeVehicleReserva,
  savePrestamo,
  cambiarEstadoReserva,
  viewVehiculo,
  viewEstacion,
  savePenalization,
  cambiarEstadoPrestamo,
  reseteoCambioVehiculo,
  saveStateBicicletero,
} from '../../actions/actions3g';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import estilos from './styles/reservas.style';
import { Env } from "../../Utils/enviroments";

function Home3G(props) {
  
  const dispatch = useDispatch();
  const { infoUser } = useContext( AuthContext );
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

  const goBack = () => { RootNavigation.navigate('Home') }
  const rentar = async () => {
    if (props.dataRent.prestamoError) {
      Alert.alert('Tienes un error en el último viaje, comunícate con soporte.');
      return ;
    }
    await RootNavigation.navigate('Rentar');
  }

  const reservar = async () => {
    if (props.dataRent.prestamoError) {
      Alert.alert('Tienes un error en el último viaje, comunícate con soporte.');
      return ;
    }
    if (!props.dataRent.reservaSave) {
      await RootNavigation.navigate('Reservar')
    }
  }

  const userActivo = async (cc) => {
    await dispatch(validateUser3g(cc));
  }

  const verPenalizaciones = async (cc) => {
    await dispatch(viewPenalizaciones(cc));
  }

  /*useEffect(() => {
    setLoadedTrips(true);
    setTimeout(function(){
      setLoadedTrips(false);
    }, 2000); 
  },[])*/

  useEffect(() => {
    console.log('data user en home 3g', infoUser.DataUser.organizationId)
    userActivo(infoUser.DataUser.idNumber);
    verPenalizaciones(infoUser.DataUser.idNumber);
    console.log('la datade la empresa es en HOME3G', props.perfil.dataempresa[0]._3G)
  },[])

  useEffect(()=>{
    if(props.dataRent.prestamoActivo && !props.dataRent.saliendo_mod){
      if (Env.modo === 'tablet') {
        RootNavigation.navigate('FinalizarViaje')
        return
      }
      if (Env.modo === 'movil') {
        RootNavigation.navigate('ViajeActivo')
        return
      }
    }
  },[props.dataRent.prestamoActivo])

  

  useEffect(()=>{
    if (!props.dataRent.saliendo_mod) {
      dispatch(rentActive(infoUser.DataUser.idNumber))
      dispatch(reserveActive(infoUser.DataUser.idNumber));
    }
  },[!props.dataRent.saliendo_mod])

  useEffect(()=>{
    if (props.dataRent.resevaCancelada) {
      dispatch(rentActive(infoUser.DataUser.idNumber))
      dispatch(reserveActive(infoUser.DataUser.idNumber));
    }
  },[props.dataRent.resevaCancelada])

  useFocusEffect( 
    React.useCallback(() => {
      if (!props.dataRent.saliendo_mod) {
        dispatch(rentActive(infoUser.DataUser.idNumber))
        dispatch(reserveActive(infoUser.DataUser.idNumber));
      }
    }, [])
  );

  return (
  <ImageBackground source={Images.fondoMapa} style={styles.imgFondo}>
    <View style={styles.contenedor}>

      <View style={styles.cajaCabeza}>
          <Pressable  
              onPress={() => { goBack() }}
              style={ styles.btnAtras }>
              <View>
              <Image source={Images.menu_icon} style={[styles.iconMenu]}/> 
              </View>
          </Pressable>
      </View> 

      {
        (props.dataRent.usuarioValido) &&
        (props.dataRent.penalizaciones === 0) ?
        <>
          <Text style={[styles.textButton, {color: '#fff', fontSize: 24, marginBottom: 30}]}>
            Movilidad 3G
          </Text>    

          <View style={{
            justifyContent: "center", 
            alignItems: "center", 
            width: Dimensions.get('window').width,
            height: 'auto', 
          }}>
            {
              Env.modo === 'tablet' ?
              ''
              :
              <LottieView source={require('../../Resources/Lotties/bicy_03.json')} autoPlay loop 
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width           
              }}/>
            }
          </View> 


          {
            props.dataRent.reservaSave && !props.dataRent.resevaCancelada ?
            <>
            {   
              (props.dataRent.reservaVencida === false) ?
              <>
              <Text style={styles.titleSelect}>Reserva Activa</Text>
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
              
              </>
              :
              <>
              <Text>La reserva se venció</Text>
              </>
            }
            </>
            :
            <>
            {
              Env.modo === 'tablet' || 
              props.perfil.dataempresa[0]._3G === 'ACTIVO-RESERVAS' ?
              <></>
              :
              <View style={styles.containerButtons}>
                <Pressable 
                  onPress={() => { reservar() }} 
                  style={styles.button}>
                  <Text style={styles.textButton}>Reservar</Text>
                </Pressable>
              </View>
            }
            </>
           
          }
          {
            props.dataRent.prestamoSave ? 
            <></>
            :
            <View style={styles.containerButtons}>
              {
                props.dataRent.dataRentaVerificada ?
                <Pressable 
                  onPress={() => { rentar() }} 
                  style={styles.button}>
                  <Text style={styles.textButton}>Rentar</Text>
                </Pressable>:null
              }
            </View>         
          }
          
        </>
        :
        <>
          { 
            (props.dataRent.usuarioValido === true) ? 
            <></> : 
            <Text style={{
              color: Colors.$blanco,
              fontSize: 24,
              fontFamily: Fonts.$poppinsmedium
            }}>
                Usuario NO habilitado
            </Text>}
          {
            (props.dataRent.penalizaciones === 0) ? 
            <></> 
            : 
            <Text style={{
              color: Colors.$blanco,
              fontSize: 24,
              fontFamily: Fonts.$poppinsmedium
            }}>Tiene penalizaciones 
            </Text>}
        </>
      }

    </View>
  </ImageBackground>
  );
}
const styles = StyleSheet.create({
    gif: {
      width: Dimensions.get('window').width*.8,
      height: 250, 
    },
    imgFondo: {
      flex: 1,
      width: '100%', 
      justifyContent: 'center',
    },
    contenedor: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
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
      justifyContent: 'space-around',
      alignItems: 'center', 
      borderRadius: 1,
      width: Dimensions.get('window').width,
      position: 'absolute',
      top: 0
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
        top: 30, 
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
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
    },
    titleSelect: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 20,
      fontFamily: Fonts.$poppinsregular,
      color: Colors.$blanco,
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

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    perfil: state.reducerPerfil,
  }
}
export default connect(mapStateToProps)(Home3G);
