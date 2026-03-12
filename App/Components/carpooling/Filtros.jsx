import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    Text,
    Pressable,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    ScrollView
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { Env } from "../../../keys";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const keyMap = Env.key_map_google;

export function FiltrosCarpooling({ date, setDate, checkCash, checkDaviPlata, checkCarro, checkMoto, closeModal, setModalEditPago, modalVehiculoEdit, showTripsChange, dataCarpooling,  setPosition1,  setPosition2 }) {
    const [ btnpuntoPC, setbtnpuntoPC ] = useState(false);
    const [ btnpuntoPO, setbtnpuntoPO ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ searchQueryDestiny, setSearchQueryDestiny ] = useState('');
    const [ key1, setKey1 ] = useState(0);
    const [ key2, setKey2 ] = useState(50);
    const sendNewTrips = () => {
      showTripsChange();
      closeModal();
    }
      useEffect(() => {
        setKey1(prev => prev + 1);
        const directionUser = dataCarpooling.directionUser;
        const directionNameUser = dataCarpooling.directionNameUser;
        if (btnpuntoPC === true) {
          setSearchQuery(directionNameUser);
          setPosition1({ lat: directionUser.lat, lng: directionUser.lng });
        } else {
          setSearchQuery('');
          setPosition1({lat: '',lng: ''});
        }
      }, [btnpuntoPC]);
    
      useEffect(() => {
        setKey2(prev => prev + 1);
        const directionUser = dataCarpooling.directionUser;
        const directionNameUser = dataCarpooling.directionNameUser;
        if (btnpuntoPO === true) {
          setSearchQueryDestiny(directionNameUser);
          setPosition2({ lat: directionUser.lat, lng: directionUser.lng });
        } else {
          setSearchQueryDestiny('');
          setPosition2({lat: '',lng: ''});
        }
      }, [btnpuntoPO]);
  return(
  <ScrollView style={styles.container2}>
  <View
    
  >
  <Pressable  
    onPress={closeModal}
    style={styles.btnAtrasActivo}>
    <View>
      <Image source={Images.x_icon} style={{width: 40, height: 40}}/> 
    </View>
  </Pressable>
    <View
      style={{
        width: '100%',
        height: 'auto', // Ajusta la altura al contenido
        backgroundColor: Colors.$blanco,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
      }}
    >
      <Text style={{fontSize: 16, fontFamily: Fonts.$poppinsregular, marginBottom:20}}>Posiciones</Text>	
      <View style={[styles.box2, {marginBottom: 15}]}>
          <Pressable 
              onPress={() => {
                setbtnpuntoPC(!btnpuntoPC);
              }}
            style={btnpuntoPC ? [styles.btnPrimario, { marginRight: 10 }] : [styles.btnSecundario, { marginRight: 10 }]}
            >             
          <Text style={styles.textButton}>Desde Oficina</Text>              
          </Pressable>
          <Pressable 
            onPress={() => {
              setbtnpuntoPO(!btnpuntoPO);
            }} 
              style={ btnpuntoPO ? styles.btnPrimario : styles.btnSecundario}
              >
                <View>
                  <Text style={styles.textButton}>Hacia Oficina</Text>
                </View>  
            </Pressable>         
      </View>
              <GooglePlacesAutocomplete
                key={key1}
                styles={{
                  container: { flex: 0, position: "relative", width: Dimensions.get("window").width*.8 , zIndex: 5, top : 10, left: 15 },
                  listView: { backgroundColor: "white", zIndex: 5, width: "100%" },
                  textInput: { color: "black" }
                }}
                placeholder={dataCarpooling.directionNameUser && btnpuntoPC ? dataCarpooling.directionNameUser : "Punto de salida"}
                fetchDetails={true}
                textInputProps={{
                  value: searchQuery,
                  onChangeText: setSearchQuery,
                  placeholderTextColor: "gray",
                }}
                onPress={(data, details = null) => {
                  if (details) {
                    setPosition1({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }
                }}
                query={{ key: keyMap, language: 'es', components: 'country:co'}}
                redefinedPlaces={[]}
              />
              <GooglePlacesAutocomplete
                key={key2}
                styles={{
                  container: { flex: 0, position: "relative", top : 10, width: Dimensions.get("window").width*.8, zIndex: 4, left: 15  },
                  listView: { backgroundColor: "white", zIndex: 4, width: "100%" },
                  textInput: { color: "black" }
                }}
                placeholder={dataCarpooling.directionNameUser && btnpuntoPO ? dataCarpooling.directionNameUser : "Destino"}
                fetchDetails={true}
                textInputProps={{
                  value: searchQueryDestiny,
                  onChangeText: setSearchQueryDestiny,
                  placeholderTextColor: "gray",
                }}
                onPress={(data, details = null) => {
                  if (details) {
                    setPosition2({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }
                }}
                query={{ key: keyMap, language: 'es', components: 'country:co'}}
                redefinedPlaces={[]}
              />
    <View style={{marginTop: 85, flexDirection : 'column', alignItems : 'center', justifyContent : 'center', width: Dimensions.get('window').width*.8}}>
    <Text style={{fontSize: 16, fontFamily: Fonts.$poppinsmedium}}>Método de pago</Text>
    <View style={[styles.box3, {backgroundColor: Colors.$blanco, justifyContent: 'space-around'}]}>
            <View style={styles.cajaRow2}>
                { checkDaviPlata ? <Image source={Images.logodaviplata} style={styles.imgPago}/> : <></>} 
                { checkCash ? <Image source={Images.iconobillete} style={styles.imgPago}/> : <></>}
            </View>
            <Pressable
                onPress={() => {setModalEditPago(true)}}
            >
            <Image source={Images.e_icon} style={{width: 40, height: 40}}/>
        </Pressable>
    </View>
    <Text style={{fontSize: 16, fontFamily: Fonts.$poppinsmedium}}>Medio de transporte</Text>
    <View style={[styles.box3, {backgroundColor: Colors.$blanco, justifyContent: 'space-around'}]}>
            <View style={{ width: '60%', flexDirection: 'row'}}>
                { checkCarro ? <Image source={Images.carrorojo} style={styles.imgCarro}/> : <></>} 
                { checkMoto ? <Image source={Images.moto} style={styles.imgMoto}/> : <></>}
            </View>
            <Pressable
                onPress={() => {modalVehiculoEdit(true)}}
            >
            <Image source={Images.e_icon} style={{width: 40, height: 40}}/>
        </Pressable>
    </View>
    <Text style={{fontSize: 16, fontFamily: Fonts.$poppinsmedium}}>A partir de la fecha</Text>

            <View style={{
              flexDirection : 'column', 
              alignItems : 'center', 
              marginBottom : 10}}>
              <View style={{marginBottom : 20}}>
                <View style={{flexDirection : 'row', justifyContent : 'space-evenly'}}>
                  <Text style={{textAlign : 'center', fontSize : 17, margin : 10, fontFamily: Fonts.$poppinsregular}}>Fecha</Text>
                  <Text style={{textAlign : 'center', fontSize : 17, margin : 10, fontFamily: Fonts.$poppinsregular}}>Hora</Text>
                </View>
                <DatePicker theme='light' backgroundColor={Colors.$tercer} locale={'es-CO'} textColor={Colors.$texto} fontFamily={Fonts.$poppinsregular} date={date} onDateChange={setDate} />
              </View>
              <Pressable 
                style={styles.buttonTouchableGray}
                onPress={sendNewTrips} >
                    <Text style={styles.textButton}>
                      Buscar viajes
                    </Text>
              </Pressable>
            </View>
          </View>
    </View>
  </View>
  </ScrollView>
  )
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    width: '100%',
    marginTop: 0,
    paddingTop:20,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
    contenedor: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: Colors.$blanco,
      position: "relative",
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
      paddingTop: '5%',
      paddingBottom : '2%',
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
      borderRadius: 20,
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
      fontSize: 16, 
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
        color: Colors.$white
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
      width: Dimensions.get('window').width*.9,
      flexDirection: 'row',
      alignItems : 'center',
      justifyContent : 'space-around',
      padding: 5
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
      borderRadius : 20,
      width: 150,
      height: 40
    },
    btnSecundario : {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor : Colors.$secundario,
      borderRadius : 20,
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
      textAlign : 'center', 
      height : 150, 
      fontSize : 22, 
      color : 'gray'
    },
    textHidden: {
      display : 'none'
    },
    paginationButton: {
      backgroundColor: '#007BFF',  // Color azul para el botón
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 5,
      borderRadius: 5,
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
    },
    disabledButton: {
      backgroundColor: '#B0B0B0',  // Color gris cuando está deshabilitado
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
    btnAtrasActivo:{
      position: 'absolute',
      zIndex: 6,
      top: 1, 
      right: 2,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25
    },
  });
