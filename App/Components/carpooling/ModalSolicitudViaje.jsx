import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    Text,
    Pressable,
    View,
    StyleSheet,
    Dimensions,
    Alert
} from 'react-native';
import { 
  sendApplication,
  sendNotification
} from '../../actions/actionCarpooling';
import { useDispatch } from 'react-redux';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';
import { Estrellas } from '../../Components/carpooling/Estrellas';
import ModalSolicitudEnviada from './ModalSolicitudEnviada';

export default function ModalSolicitudViaje({ onClose ,refresh ,data }){
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [confirmTrip, setConfirmTrip] = useState(false);

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const closeConfirmModal = () => {
    setConfirmTrip(false);
  };

  const closeDetailModal = () => {
    onClose();
  };

  const formatearFecha =  (fecha) => {
    let fechaF = new Date(fecha);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones);      
    return(fechaFormateada);
  }


  const handleConfirm = (data) => {
    let mensaje = 'Se creo una solicitud para el viaje con fecha ' + (data.fecha);
    if (isChecked) {
      dispatch(sendApplication(data._id));
      dispatch(sendNotification(data.conductor, mensaje));
      setConfirmTrip(!confirmTrip);
      refresh();
    }
    if (!isChecked) {
      Alert.alert('Aceptar términos y condiciones')
    }
  };

  return(
    <View style={{ 
      backgroundColor: "white", 
      flexDirection: "column", 
      flex: 1, 
      position : 'absolute', 
      zIndex : 5 
    }}>
        <ImageBackground 
          source={Images.fondoMapa} 
          style={{
            flex:1, 
            width: Dimensions.get('window').width, 
            height: Dimensions.get('window').height,
            justifyContent:'center'
          }}>   
        {(confirmTrip) ? <ModalSolicitudEnviada onClose={closeConfirmModal} closeDetailModal={closeDetailModal} /> :    
        <View 
          style={{ 
            flex: 1, 
            borderRadius: 20, 
            marginVertical: Dimensions.get('window').height*.2, 
            marginHorizontal: 20, 
            backgroundColor: 'white', 
            justifyContent: "center", 
            alignItems: "center",  
        }}>     
          <View style={{
            width : '100%', 
            height: '90%',
            display : 'flex', 
            justifyContent : 'center', 
            alignItems: "center", 
            backgroundColor : Colors.$blanco,
            borderRadius: 20
          }}>
            <Pressable  
              onPress={() => { onClose() }} 
              style={{
                position: 'absolute',
                top: 10,
                left: 10 
              }}
            >
              <Image 
                style={{width:50, height:50 }} 
                source={Images.x_icon}
              />
            </Pressable>

            <Text style={{
              textAlign: "center", 
              color: Colors.$texto80, 
              fontSize: 24, 
              margin : 30,
              fontWeight: "bold",
            }}>Solicitud Viaje</Text>

              <View style={{
                flexDirection:'column', 
                borderWidth:1, 
                borderColor: Colors.$secundario50,
                marginTop:0, 
                height: "85%", 
                width: "90%",
                borderRadius:20,
              }}>
                <View style={{
                  width: "100%",
                  flexDirection : 'row', 
                  justifyContent : 'center', 
                  alignItems : 'center', 
                  marginTop : 30,
                }}>
                  <View style={{
                    width: "70%",
                    padding: 5
                  }}>
                    <Text style={estilos.textNombreSolicitud}>{data.bc_usuario.usu_nombre}</Text>
                    <View style={{ flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                      <Estrellas calificacion={data.bc_usuario.usu_calificacion}/>
                      <Text style={{ fontSize:12, marginLeft : 10, marginRight : 10}}>{data.bc_usuario.usu_viajes} Viajes</Text>
                    </View>
                    <Text style={{ fontSize:18, marginStart : 10 }}>{data.compartidoVehiculo.tipo} - {data.compartidoVehiculo.placa}</Text>
                  </View>
                  <View style={{
                    width: "30%"
                  }}>
                      <Image style={{width:80, height:65}} source={Images.carroblanco}/>
                  </View>
                </View>

                <View style={estilos.lineaSolicitudViaje}></View>

                <View style={{display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                  <View style={{width : '50%'}}>
                    <Text style={{marginLeft:20, marginTop:5}} >
                      {new Intl.DateTimeFormat('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(new Date(data.fecha))}
                    </Text>
                    <Text style={{marginLeft:20, marginTop:5}}>{data.llegada}</Text>
                    <Text style={estilos.textPrecio}>${data.precio} (Opcional)</Text>
                  </View>
                  <View style={{width : '50%', flexDirection : 'column', alignItems : 'center'}}>
                    <Text style={{fontSize:14, marginBottom : 10}}>Método aceptado</Text>
                    <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                      { data.pagoAceptado && data.pagoAceptado.includes("Daviplata") ? <Image source={Images.logodaviplata} style={{width : 40, height : 40, borderRadius: 10}}/> : <></> }
                      { data.pagoAceptado && data.pagoAceptado.includes("Efectivo") ? <Image source={Images.iconobillete} style={{width : 40, height : 40, borderRadius: 10}}/> : <></> }
                      { data.pagoAceptado && data.pagoAceptado.includes("Nequi") ? <Image source={Images.logonequi} resizeMode='contain' style={{width : 40, height : 40, borderRadius: 10}}/> : <></> }
                    </View>
                  </View> 
                </View>
                
                <View style={estilos.CajaHorCenter}>
                { isChecked ?
                    <Pressable
                      onPress={() => toggleCheckBox()}
                      style={estilos.btnCheckOK}
                    />:
                    <Pressable
                      onPress={() => toggleCheckBox()}
                      style={estilos.btnCheck}
                    />
                  }
                  <Text style={{marginLeft : 10}}>Aceptar téminos y condiciones</Text>
                </View>
          </View>                      
        </View>
            <View style={{
                marginTop: 15,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
            <View style={{ marginBottom : 15 }}>
                <Pressable 
                  onPress={() => {
                    handleConfirm(data)
                }}
          style={estilos.btnConfirmar}>
            <View>
              <Text style={estilos.textSolicitar}>Confirmar</Text>
            </View>
        </Pressable>
                </View>
            </View>
        </View>
        }
          </ImageBackground>
    </View>
  )
}
const estilos = StyleSheet.create({
    cajaStartsSolicitud: {
        width: 20,
        flexDirection: "row",
        alignItems: 'left',
        justifyContent: 'center',
        marginLeft: 120, 
      },
      CajaHorCenter:{
        flexDirection: 'row',
        justifyContent : 'flex-start',
        marginTop:20,
        marginLeft: 20
      },
      btnCheckOK: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$texto,
        backgroundColor: Colors.$adicional,
      },
      btnCheck: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$texto,
      },
      textPrecio:{
        fontSize:14,
        marginLeft:20,
        fontWeight:'400'
      },
      cajaViajes:{
        width:50,
        flexDirection : 'row',
        justifyContent : 'space-between',
      },
      lineaSolicitudViaje:{
        borderWidth : 1,
        borderColor : Colors.$black,
        borderRadius:15,
        backgroundColor:'black',
        height:5,
        marginTop:10,
        width:'85%',
        marginLeft:20
      },
      textViajes:{
        fontSize:14,
       fontWeight:'400',
       },
      cajaStart:{
        width: 50,
        flexDirection: "row",
        alignItems: 'left',
        justifyContent: 'center',
        marginTop: 20,
        marginLeft: 90,
      },
      btnStart:{
        width:7,
        padding:20,
      },
      textNombreSolicitud:{
        marginStart: 10,
        fontSize:20,
        fontWeight:'500'
      },
      cajaViajes:{
        width:50,
        marginLeft:60,
        marginTop:20,
        flexDirection : 'row',
        justifyContent : 'space-between',
      },
      textViajes:{
       fontSize:14,
       fontWeight:'400',
       position:'absolute',
       top:30,
       right:10
         
       },
       btnConfirmar:{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor : '#da3833',
        borderRadius : 20,
        height: 40,
        marginBottom: 10,
        marginLeft:70,
        marginRight:50,
        padding: 5,
        width:200
      },
      textSolicitar:{
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        fontSize: 16, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'white',
        alignSelf: "center",
      },

})