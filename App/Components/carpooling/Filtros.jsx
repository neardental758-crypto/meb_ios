import React, { useState, useEffect, useRef } from 'react';
import {
    Dimensions,
    Text,
    TextInput,
    FlatList,
    Keyboard,
    Pressable,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    ScrollView
} from 'react-native';
import { moderateScale } from '../../Themes/Metrics';
import { connect, useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { Env } from "../../../keys";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const keyMap = Env.key_map_google;

export function FiltrosCarpooling({ date, setDate, checkCash, checkDaviPlata, checkCarro, checkMoto, closeModal, setModalEditPago, modalVehiculoEdit, showTripsChange, dataCarpooling,  setPosition1,  setPosition2, pago }) {
    const [ btnpuntoPC, setbtnpuntoPC ] = useState(false);
    const [ btnpuntoPO, setbtnpuntoPO ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ searchQueryDestiny, setSearchQueryDestiny ] = useState('');
    const [ key1, setKey1 ] = useState(0);
    const [ key2, setKey2 ] = useState(50);

     // Estados para el autocompletado
    const mapRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchTextDestiny, setSearchTextDestiny] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [showPredictions, setShowPredictions] = useState(false);
    // NUEVO ESTADO: Para saber qué input está activo
    const [activeInput, setActiveInput] = useState(null); // 'origin' o 'destination'


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

    // MODIFICADO: Separar useEffect para cada input de búsqueda
    // Efecto para buscar predicciones del input de Salida
    useEffect(() => {
      if (activeInput === 'origin' && searchText.length > 2) {
        fetchPredictions(searchText);
      } else if (activeInput === 'origin') { // Borrar predicciones si el texto es muy corto o se ha borrado
        setPredictions([]);
        setShowPredictions(false);
      }
    }, [searchText, activeInput]); // Solo escucha cambios en searchText si activeInput es 'origin'
  
    // Efecto para buscar predicciones del input de Destino
    useEffect(() => {
      if (activeInput === 'destination' && searchTextDestiny.length > 2) {
        fetchPredictions(searchTextDestiny);
      } else if (activeInput === 'destination') { // Borrar predicciones si el texto es muy corto o se ha borrado
        setPredictions([]);
        setShowPredictions(false);
      }
    }, [searchTextDestiny, activeInput]); // Solo escucha cambios en searchTextDestiny si activeInput es 'destination'
  
  
    const fetchPredictions = async (input) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${keyMap}&components=country:co&language=es`
        );
        const json = await response.json();
  
        if (json.status === 'OK' && json.predictions) {
          setPredictions(json.predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };
  
    // MODIFICADO: fetchPlaceDetails para usar `inputType`
    const fetchPlaceDetails = async (placeId, inputType) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${keyMap}&fields=geometry,name,formatted_address&language=es`
        );
        const json = await response.json();
  
        if (json.status === 'OK' && json.result) {
          const { geometry, name, formatted_address } = json.result;
          const { lat, lng } = geometry.location;
  
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lng);
  
          if (!isNaN(latitude) && !isNaN(longitude)) {
  
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
              }, 1000);
            }
  
            // Usa inputType para decidir qué estado actualizar
            if (inputType === 'origin') {
              setPosition1({
                lat: latitude,
                lng: longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
              });
              setSearchQuery(formatted_address); // Actualiza el placeholder
              setSearchText(formatted_address); // Actualiza el valor del TextInput
            } else if (inputType === 'destination') {
              setPosition2({
                lat: latitude,
                lng: longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
              });
              setSearchQueryDestiny(formatted_address); // Actualiza el placeholder
              setSearchTextDestiny(formatted_address); // Actualiza el valor del TextInput
            }
            setActiveInput(null); // Resetear el input activo después de seleccionar una dirección
          }
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };
  
    // MODIFICADO: handleSelectPrediction para pasar `activeInput`
    const handleSelectPrediction = (prediction) => {
      // setSearchText(prediction.description); // Ya no es necesario aquí, se hará en fetchPlaceDetails
      setShowPredictions(false);
      setPredictions([]);
      Keyboard.dismiss();
      fetchPlaceDetails(prediction.place_id, activeInput); // Pasa el input activo
    };
  
    const renderPrediction = ({ item }) => (
      <Pressable
        style={estilos.predictionItem}
        onPress={() => handleSelectPrediction(item)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={estilos.predictionMain}>
            {item.structured_formatting?.main_text || item.description}
          </Text>
          {item.structured_formatting?.secondary_text && (
            <Text style={estilos.predictionSecondary}>
              {item.structured_formatting.secondary_text}
            </Text>
          )}
        </View>
      </Pressable>
    );


  return(
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
      position: 'absolute', // Asegura que el fondo cubra toda la pantalla
      top: 0,
      left: 0,
    }}
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
        width: '90%',
        height: 'auto', // Ajusta la altura al contenido
        backgroundColor: Colors.$blanco,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{fontSize: 16, fontFamily: Fonts.$poppinsmedium}}>Posiciones</Text>	
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
      
      <View style={{
          flex: 1,
          position: 'absolute',
          top: 100,
          width: Dimensions.get('window').width,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}>
          <View style={estilos.searchContainer}>
            <TextInput
              style={estilos.searchInput}
              placeholder={searchQuery === '' ? 'Salida' : searchQuery}
              placeholderTextColor={Colors.$texto}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setActiveInput('origin'); // AGREGADO: Establecer el input activo
              }}
              onFocus={() => {
                setActiveInput('origin'); // AGREGADO: Establecer el input activo al enfocar
                if (predictions.length > 0) {
                  setShowPredictions(true);
                }
              }}
            />
            {/* AGREGADO: Botón para limpiar el input de Salida */}
            {searchText.length > 0 && (
              <Pressable
                style={[estilos.clearButton, { top: 10 }]} // Ajusta la posición si es necesario
                onPress={() => {
                  setSearchText('');
                  setSearchQuery('');
                  setPosition1(null);
                  setPredictions([]);
                  setShowPredictions(false);
                  setActiveInput(null); // AGREGADO: Resetear activeInput
                }}
              >
                <Text style={estilos.clearButtonText}>✕</Text>
              </Pressable>
            )}

            <TextInput
              style={[estilos.searchInput, { marginTop: 10 }]} // Ajusta el margen superior para el segundo input
              placeholder={searchQueryDestiny === '' ? 'Destino' : searchQueryDestiny}
              placeholderTextColor={Colors.$texto}
              value={searchTextDestiny}
              onChangeText={(text) => {
                setSearchTextDestiny(text);
                setActiveInput('destination'); // AGREGADO: Establecer el input activo
              }}
              onFocus={() => {
                setActiveInput('destination'); // AGREGADO: Establecer el input activo al enfocar
                if (predictions.length > 0) {
                  setShowPredictions(true);
                }
              }}
            />
            {/* AGREGADO: Botón para limpiar el input de Destino */}
            {searchTextDestiny.length > 0 && (
              <Pressable
                style={[estilos.clearButton, { top: 70 }]} // Ajusta la posición según la altura del primer input
                onPress={() => {
                  setSearchTextDestiny('');
                  setSearchQueryDestiny('');
                  setPosition2(null);
                  setPredictions([]);
                  setShowPredictions(false);
                  setActiveInput(null); // AGREGADO: Resetear activeInput
                }}
              >
                <Text style={estilos.clearButtonText}>✕</Text>
              </Pressable>
            )}

          </View>

           {showPredictions && predictions.length > 0 && (
                <View style={estilos.predictionsContainer}>
                  <FlatList
                    data={predictions}
                    renderItem={renderPrediction}
                    keyExtractor={(item, index) => `${item.place_id}-${index}`}
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                  />
                </View>
              )}
        </View>      




    <View style={{marginTop: 150, flexDirection : 'column', alignItems : 'center', justifyContent : 'center', width: Dimensions.get('window').width*.8}}>
      { pago === 'ACTIVO+PAGOS' ?
      <>
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
      </>:null}
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
  )
}

const estilos = StyleSheet.create({
    searchContainer: {
      marginHorizontal: moderateScale(25),
      marginTop: moderateScale(10),
      marginBottom: 0,
      position: 'relative',
    },
    searchInput: {
      backgroundColor: Colors.$blanco,
      borderWidth: 0.8,
      borderColor: Colors.$secundario,
      borderRadius: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(12),
      fontSize: 18,
      color: 'black',
      width: Dimensions.get('window').width*.9
    },
    clearButton: {
      position: 'absolute',
      right: 10,
      padding: 5,
      zIndex: 2, // Asegura que el botón esté por encima del TextInput
    },
    clearButtonText: {
      fontSize: 20,
      color: '#999',
    },
    predictionsContainer: {
      marginHorizontal: moderateScale(25),
      marginTop: 5,
      marginBottom: 10,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: moderateScale(5),
      maxHeight: 200,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 4
    },
    predictionItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      backgroundColor: 'white',
    },
    predictionMain: {
      fontSize: 16,
      color: '#333',
      fontWeight: '600',
      marginBottom: 4,
    },
    predictionSecondary: {
      fontSize: 13,
      color: '#666',
    },
    inputDirCasa: {
        width: Dimensions.get("window").width,
        backgroundColor: Colors.$blanco,
        fontSize: 20,
        paddingLeft: 20,
        color: Colors.$texto,
    },
    btnCenter: {
        width: Dimensions.get("window").width*.5,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$primario,
        height: 50,
        marginTop: 20
    },
    btnSaveColor: {
        color: '#fff',
        fontSize: 20,
    },
    contenedor: {
        flex: 1,
        minHeight: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cajaBtnVerRuta: {
        flex: 1,
        minHeight: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignContent: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    cajaCargando: {
        color: Colors.$blanco,
        width: Dimensions.get("window").width,
        textAlign: 'center',
    },
    containerMap: {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical : 15
    },
    map: {
        flex: 1,
        width: '90%',
        height: '100%',
    },
})

const styles = StyleSheet.create({
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
      height: 30
    },
    btnSecundario : {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor : Colors.$secundario,
      borderRadius : 20,
      width: 150,
      height: 30
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
      top: 15, 
      right: 25,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25
    },
  });
