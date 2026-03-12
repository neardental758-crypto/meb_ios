import React, { useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import Images from '../../Themes/Images';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import Overlay from 'react-native-modal-overlay';
import { register_veh_cp, crear_mas_veh_car } from '../../actions/actionCarpooling';
import { crear_mas_veh } from '../../actions/actions3g';
import { useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Fonts from '../../Themes/Fonts';
import ModalPhotoDocument from '../../Components/ModalPhotoDocument';
import Colors from '../../Themes/Colors';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';

export function CarpoolingRegisterVeh({ imagenVehicle }) {

    const { infoUser } = useContext( AuthContext );
    const dispatch = useDispatch();
    
    const [state, setState] = useState({
        marca: '',
        modelo:'',
        color: '',
        idpropietario: 1,
        vehiculoSelect: 'Carro',
        cilindraje: '',
        serial: '',
        color: '',
        registerOk: false,
        isOpenBackgroundInfoModal: false
    });
    const [valor, setValor] = useState(true)

    const registerVP = async() => {
      console.log('empezando con el registro del vehiculo');
      if (state.marca !== '' && state.modelo !== '' && state.color !== '' && state.serial !== '') {
        const data = {
            "_id": uuidv4(),
            "tipo": imagenVehicle,
            "marca": state.marca,
            "modelo": state.modelo,
            "color": state.color,
            "placa": state.serial,
            "idpropietario": infoUser.DataUser.idNumber
        }
        await dispatch(register_veh_cp(data));
      }else {
        Alert.alert('Agrega todos los campos del vehículo para crearlo.')
      }
      
    }

    const crearmas = async () => {
      await setState({
        marca: '',
        modelo:'',
        color: '',
        idpropietario: 1,
        vehiculoSelect: 'Carro',
        cilindraje: '',
        serial: '',
        color: '',
        registerOk: false,
        isOpenBackgroundInfoModal: false
      });
      await dispatch(crear_mas_veh_car());
    }

    const volver = async () => {
      await setState({
        marca: '',
        modelo:'',
        color: '',
        idpropietario: 1,
        vehiculoSelect: 'Carro',
        cilindraje: '',
        serial: '',
        color: '',
        registerOk: false,
        isOpenBackgroundInfoModal: false
      });
      await dispatch(crear_mas_veh());
      await RootNavigation.navigate('CarpoolingAddTrip')
    }
  
  return (
    <View style={styles.contenedor}>
  
      { valor ?

        <View style={styles.containerForm}>        
          <View style={styles.headerForm}>  
              <View style={styles.cajaInput}>          
              <TextInput
                    style={styles.input}
                    onChangeText={(newValue) => setState({...state, marca : newValue})}
                    placeholder="Marca:"
                    placeholderTextColor={Colors.$texto50}
                />
              <TextInput
                    style={styles.input}
                    onChangeText={(newValue) => setState({...state, modelo : newValue})}
                    placeholder="Modelo:"
                    placeholderTextColor={Colors.$texto50}
                />
              <TextInput
                    style={styles.input}
                    onChangeText={(newValue) => setState({...state, color : newValue})}
                    placeholder="Color:"
                    placeholderTextColor={Colors.$texto50}
                />
              <TextInput
                    style={styles.input}
                    onChangeText={(newValue) => setState({...state, serial : newValue})}
                    placeholder="Placa:"
                    placeholderTextColor={Colors.$texto50}
                />
              </View>
              <View style={styles.cajaImg}>
                <View style={styles.cajaPartidaImg}>
                  { imagenVehicle == 'Carro' ? <Image source={Images.carrorojo2} style={styles.imgCarro}/> : <Image source={Images.moto} style={styles.imgMoto}/>} 
                </View> 
                <Pressable 
                  onPress={() => registerVP()}
                  style={styles.BtnCrear}
                >
                  <Text style={[styles.textButton, { color : Colors.$blanco}]}>Crear</Text>
                </Pressable>
              </View>
          </View>
        </View>
        :
        <View style={[styles.contentViajeSave]}>
          <Image style={styles.logoViajeSave} source={Images.rideimg} />
          <Text style={[styles.textViajeSave]}>Vehículo Creado exitosamente</Text>

          <View style={[styles.cajaBtnsViajeSave]}>
            <Pressable
              onPress={ () => crearmas() }
              style={styles.goToMapViajeSave}>
                  <View>
                    <Text style={[styles.textButton, {color: Colors.$blanco,}]}>Crear</Text>
                  </View>
            </Pressable>
          </View>
        </View>
              
      }

      

    </View>
  );
}

const styles = StyleSheet.create({
    contentViajeSave: {
      width: Dimensions.get('window').width,
      padding: 15,
      backgroundColor: Colors.$blanco,
      alignItems : 'center',
      justifyContent: 'space-around'
    },
    cajaPartidaImg: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    imgCarro: {
      width: 100,
      height: 100,
    },
    imgMoto: {
      width: 120,
      height: 78,
      margin : 11
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
      color: Colors.$texto,
      marginTop: 15,
      marginBottom: 15,
      fontFamily: Fonts.$poppinsregular
    },
    cajaBtnsViajeSave: {
      flexDirection: 'row',
      width: Dimensions.get('window').width,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    goToMapViajeSave: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor : Colors.$primario,
      borderRadius : 15,
      width: 100,
      height: 30
    },

    contenedor: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: 250,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.$blanco,
    },
    input: {
      backgroundColor: Colors.$secundario50,
      color: Colors.$texto,
      height: 30,
      width: "100%",
      marginBottom: 10,
      borderBottomColor : 'white',
      fontSize : 14,
      textDecorationLine : 'none',
      borderRadius: 15,
      padding: 1,
      paddingLeft: 10,
      fontFamily: Fonts.$poppinsregular
    },
    buttons: {
        margin : 10,
        justifyContent : 'center',
        alignItems : 'center',
    },
    containerForm : {
      flex : 1,
      width: Dimensions.get('window').width,
      justifyContent : 'center',
      alignItems: 'center',
    },
    headerForm : {
      width : Dimensions.get('window').width*.8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cajaInput: {
      width : Dimensions.get('window').width*.4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cajaImg: {
      width : Dimensions.get('window').width*.3,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    way : {
      backgroundColor : Colors.$primario,
      padding : 10,
      margin : 10,
      borderRadius : 50
    },
    carroImg: {
      width: 80,
      height: 80,
      backgroundColor: Colors.$adicional,
      marginBottom: 10
    },
    BtnCrear: {
      width: 120,
      height: 30,
      backgroundColor : Colors.$primario,
      borderRadius: 15
    },
    textButton : {
      textAlign: "center", 
      fontSize: 20, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: 'black',
      fontFamily: Fonts.$poppinsregular
    },
    textTitle: { 
      textAlign: 'center',
      fontFamily : Fonts.$poppinsregular,
      
      alignSelf: "center",
      fontSize : 20, 
      color : Colors.$texto,
      backgroundColor : Colors.$blanco,
      borderRadius : 50,
      padding  : 10,
      width: Dimensions.get('window').width*.8,
    },
    btnAtras:{
      position: 'absolute',
      top: 5, 
      left: 5,
      width: 60,
      height: 60,
      backgroundColor: Colors.$blanco,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      zIndex: 10
    },
    iconBici: {
      width: 30,
      height: 30,
    },
  });

function mapStateToProps(state) {
  return {
    documentUser: state.userReducer.documentUser,
    dataMySQL: state.reducer3G,
    dataCarpooling: state.reducerCarpooling
  }
}

export default connect(mapStateToProps)(CarpoolingRegisterVeh);
