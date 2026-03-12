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
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import { useFocusEffect } from '@react-navigation/native';
import { 
  get_trip_select_carpooling,
  init_trip_carpooling,
  get_pasajeros,
  accept_solicitud,
  crear_pago,
  reset_state_pago,
  resetDataPasajeros,
  sendNotification,
  trip_select_reset,
  trip_select_solicitud_reset,
} from '../../actions/actionCarpooling';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../AuthContext';
import moment from 'moment';
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';
import { Env } from "../../../keys";
import colores from '../../Themes/Colors';
import { Estrellas } from '../../Components/carpooling/Estrellas';
import { api } from '../../api/apiCarpooling';
const keyMap = Env.key_map_google

function CarpoolingSolicitudesViaje (props){
  const dispatch = useDispatch();
  const { infoUser } = useContext( AuthContext );

  const goBack = async () => {  
      await dispatch(trip_select_solicitud_reset());
      await dispatch(resetDataPasajeros());
      await RootNavigation.navigate('CarpoolingDriverTrips');
  }

  const data_viaje = async (id) => {
    await dispatch(get_pasajeros(id));
  }

  useEffect(() => {
    if (props.dataCarpooling.tripSelectSolicitudCargada ) {
      data_viaje(props.dataCarpooling.tripSelectSolicitud._id);
    }
  },[props.dataCarpooling.tripSelectSolicitudCargada]);

  useEffect(() => {
    if (props.dataCarpooling.patchSolicitud) {
      dispatch(get_pasajeros(props.dataCarpooling.tripSelectSolicitud._id))
    }
  },[props.dataCarpooling.patchSolicitud])

  const formatearFecha =  (fecha) => { 
    let fechaF = new Date(fecha); 
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones); 
    return(fechaFormateada);
  }

  const aceptar = async (idSolicitud, idSolicitante, precio, metodo) => {
    let tabla = 'compartidoViajeActivo/id/'; 
    let tripSelect = await api.get_id(tabla, props.dataCarpooling.tripSelectSolicitud._id);
    if (tripSelect.data.asientosIda > 0) {
      let mensaje = 'Tu solicitud para el viaje con fecha ' + formatearFecha(tripSelect.data.fecha) + ' fue aceptada.';
      let estado = {"estadoSolicitud": "APROBADA"}
      let asientos = {"asientosIda": Number(tripSelect.data.asientosIda - 1)}
      let pago = {
        "_id": uuidv4(),
        "idViaje": props.dataCarpooling.tripSelectSolicitud._id,
        "idConductor": infoUser.DataUser.idNumber,        
        "idPasajero": idSolicitante,        
        "idSolicitud" : idSolicitud,
        "valor": precio,
        "metodo": metodo,
        "estado": 'PENDIENTE',
      }
      await dispatch(accept_solicitud(idSolicitud, estado, props.dataCarpooling.tripSelectSolicitud._id, asientos));
      //if (props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS') {
        await dispatch(crear_pago(pago));
      //}
      await dispatch(sendNotification(idSolicitante, mensaje));
      await dispatch(get_pasajeros(props.dataCarpooling.tripSelectSolicitud._id));
    }else{
      console.log('Sin asientos',tripSelect.data.asientosIda)
      Alert.alert('No tienes asientos disponibles.');
    }
  }

  const declinar = async (idSolicitud, idSolicitante, precio, metodo) => {
    let tabla = 'compartidoViajeActivo/id/'; 
    let tripSelect = await api.get_id(tabla, props.dataCarpooling.tripSelectSolicitud._id);
    if (tripSelect.data.asientosIda > 0) {
      //let mensaje = 'Tu solicitud para el viaje con fecha ' + formatearFecha(tripSelect.data.fecha) + ' fue rechazada.';
      let mensaje  = 'Tu solicitud para el viaje del ' + formatearFecha(tripSelect.data.fecha) + ' fue rechazada. 😔 ¡No te preocupes! Puedes intentar con otro viaje disponible.'
      let estado = {"estadoSolicitud": "DECLINADA"}
      let asientos = {"asientosIda": Number(tripSelect.data.asientosIda)}
    
      await dispatch(accept_solicitud(idSolicitud, estado, props.dataCarpooling.tripSelectSolicitud._id, asientos));
      
      await dispatch(sendNotification(idSolicitante, mensaje));
      await dispatch(get_pasajeros(props.dataCarpooling.tripSelectSolicitud._id));
    }else{
      console.log('Sin asientos',tripSelect.data.asientosIda)
      Alert.alert('No tienes asientos disponibles.');
    }
  }

  useEffect(() => {
    if (props.dataCarpooling.pagoCreado) {
      dispatch(reset_state_pago());
    }
  },[props.dataCarpooling.pagoCreado])


  const refreshSolicitudes = async () => {
    await dispatch(get_pasajeros(props.dataCarpooling.tripSelectSolicitud._id))
  }
 
  return(
    <View style={styles.contenedor}>
      <ScrollView>
        <View style={styles.cajaACTIVA}>

            <Pressable  
                onPress={() => { goBack() }}
                style={[ styles.btnAtras]}>
                <View>
                <Image source={Images.atras_Icon} style={[styles.iconBici, {tintColor : Colors.$texto}]}/> 
                </View>
            </Pressable>   

            <Pressable  
              onPress={() => { refreshSolicitudes() }}
              style={{
                position: 'absolute',
                top: 40,
                right: 10,
                width: 50,
                height: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}>
                <View>
                  <Image source={Images.refresh_Icon} style={{width: 40, height: 40}}/> 
                </View>
            </Pressable>        

            <View style={{
              width: "100%",
              padding: 10,
              marginTop: 40
            }}>
            <Text style={styles.subTitle}>Pasajeros</Text>
            
            {
                props.dataCarpooling.dataPasajerosCargada ?
                <>
                {
                props.dataCarpooling.dataPasajeros.map((data) =>                      
                    <View style={styles.cajaPasajeros} key={data._id}>
                    <View style={styles.cajaDatosPasajero}>
                        <View style={styles.cajaColumn}>
                          <Image
                          style={ styles.logo }
                          source={{ uri: data.bc_usuario.usu_img }}
                          />
                        </View>
                        {/*<Image source={Images.userCar} style={{width: 80, height: 80}}/> */}
                        <View style={styles.cajaDatosPasajeroV}>
                        <Text style={styles.textSolicitud}>
                          { data.bc_usuario.usu_nombre }
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Estrellas calificacion={data.bc_usuario.usu_calificacion}/>
                          <Text style={{ fontSize: 15, paddingBottom: 10, paddingLeft: 10 }}>{data.bc_usuario.pasajero.viajes} viajes</Text>
                        </View>
                        {props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO+PAGOS'?
                        <View style={ styles.cajaRow }>
                          <Text>Valor del pago</Text>
                          <Text>${data.viajeSolicitado.precio}</Text>
                        </View>:null}
                        <View style={ styles.LineaHorizontal }></View> 
                        <View style={[styles.cajaRow, {marginBottom: 20} ]}>
                          <Text>{data.estadoSolicitud}</Text>
                        </View>
                        <View style={ styles.cajaRow }>
                          { 
                            data.estadoSolicitud === 'PENDIENTE' && props.dataCarpooling.rol !== 'Pasajero' ?   
                            <>
                            <Pressable 
                              onPress={() => declinar(data._id, data.idSolicitante, data.viajeSolicitado.precio, data.viajeSolicitado.pagoAceptado)}
                              key={data._id}
                              style={[styles.btnAceptar, {backgroundColor: Colors.$secundario}]}
                              >
                              <Text style={{color: Colors.$blanco}}>DECLINAR</Text>
                            </Pressable>
                            <Pressable 
                              onPress={() => aceptar(data._id, data.idSolicitante, data.viajeSolicitado.precio, data.viajeSolicitado.pagoAceptado)}
                              key={data.idSolicitante}
                              style={[styles.btnAceptar, {backgroundColor: Colors.$primario}]}
                              >
                              <Text style={{color: Colors.$blanco}}>ACEPTAR</Text>
                            </Pressable>
                            </>
                            :
                            <></>
                          }
                        </View>
                        </View>
                    </View>
                    </View>
                )
                }
                {
                  props.dataCarpooling.dataPasajeros.length == 0 ?
                  <View style={{
                    width: Dimensions.get('window').width*.9,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{
                    color: Colors.$texto50,
                    fontSize: 24,
                    width: '70%',
                    textAlign: 'center',
                  }}>No se encontraron solicitudes.</Text>
                  </View>
                  :
                  <></>
                }
                </>
                :
                null                 
            }
            </View> 
            
        </View>
      </ScrollView>      
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.$texto,
    alignItems: "center",
    position: "relative"
  },
  
  textTitleACTIVA:{
    marginBottom: 20, 
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
    width: '90%',
    borderRadius: 20,
    borderColor: Colors.$secundario,
    borderWidth: 1,
    borderRadius: 25,
    padding: 10
  },
  btnAtras:{
    position: 'absolute',
    top: 40, 
    left: 5,
    width: 50,
    height: 50,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    zIndex: 10
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
    minHeight: Dimensions.get('window').height,
    alignItems: "center",
    backgroundColor: Colors.$blanco,
    margin: 0,
    paddingTop: 50,
    paddingBottom: 50
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
    fontSize: 24,
    color: Colors.$texto80,
    marginBottom: 15,
    marginTop: 10,
    paddingLeft: 20
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
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    alignItems: 'center',
    width: "100%",
  },
  cajaColumn:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  cajaDatosPasajero: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
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
    height: 4,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: Colors.$texto,
  },
  imgCarro: {
    width: 100,
    height: 100,
  },
  imgChat: {
    width: 60,
    height: 60,
  }
});

function mapStateToProps(state) {
  return {
    dataRent: state.reducer3G,
    dataCarpooling: state.reducerCarpooling,
    perfil: state.reducerPerfil
  }
}
  
export default connect(mapStateToProps)(CarpoolingSolicitudesViaje);