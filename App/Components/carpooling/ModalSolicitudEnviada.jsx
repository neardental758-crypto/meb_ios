import React from 'react';
import {
    Image,
    Text,
    Pressable,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { change_carpooling_drawer } from '../../actions/actionCarpooling';
import { useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';

export default function ModalSolicitudEnviada({ onClose, closeDetailModal }){
  const dispatch = useDispatch();
  const goTripRider = async () => { 
    closeDetailModal();
    onClose();
    dispatch(dispatch(change_carpooling_drawer('Itinerario')));
    RootNavigation.navigate('CarpoolingDriverTrips');
  }
  const createMoreTrips = () => { 
    closeDetailModal();
    onClose();
  }
    return(
        <View style={{ flex : 1, borderRadius: 20, marginVertical: Dimensions.get('window').height*.2 , marginHorizontal: 20, backgroundColor: 'white', justifyContent: "center", alignItems: "center",  width:360, height: 390 }}>
          <View style={{width : '70%', display : 'flex', justifyContent : 'center', marginTop : 25}}>
          <Text style={{position : 'absolute', textAlign: "center", color: Colors.$cuarto, fontSize: 24, top : 100, left : 30 }}>¡Solicitud enviada exitosamente!</Text>
          </View>            
          <View>
            <Image 
              source={require('../../Resources/gif/Acepted.gif')}
              style={{width: 360, height: 360, marginTop : 80}} 
             />
          </View>     
            <View style={{
                marginTop: 40,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>

      <View style={{ display : 'flex', justifyContent : 'center', position : 'relative', top : -120}}>
        <Pressable 
          onPress={createMoreTrips}
          style={estilos.btnConfirmar}>
            <View>
              <Text style={estilos.textSolicitar}>Crear más solicitudes</Text>
            </View>
        </Pressable>
        <Pressable 
          onPress={goTripRider}
        style={[estilos.btnConfirmar, {backgroundColor : 'gray'}]}>
            <View>
              <Text style={estilos.textSolicitar}>Solicitudes activas</Text>
            </View>
        </Pressable>
                </View>
            </View>
        </View>
    )
}
const estilos = StyleSheet.create({
  cajaStartsSolicitud: {
    width: 20,
    flexDirection: "row",
    alignItems: 'left',
    justifyContent: 'center',
    marginLeft: 170, 
  },
  textPrecio:{
    fontSize:20,
    marginLeft:20,
    fontWeight:'400'
  },
  cajaViajes:{
    width:50,
    flexDirection : 'row',
    justifyContent : 'space-between',
    marginLeft:-50
  },
  lineaSolicitudViaje:{
    borderWidth : 1,
    borderColor : Colors.$black,
    borderRadius:15,
    backgroundColor:'black',
    height:5,
    marginTop:20,
    marginLeft:10,
    width:250
  },
  textViajes:{
    fontSize:14,
   fontWeight:'400',
   right:10
     
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
    fontSize:20,
    fontWeight:'400',
    marginTop:20,
    marginLeft:10
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
    width:250
  },
  textSolicitar:{
    fontFamily: Fonts.$poppinsregular, 
    textAlign: "center", 
    fontSize: 16, 
    color: 'white',
    
    alignSelf: "center",
  },
})