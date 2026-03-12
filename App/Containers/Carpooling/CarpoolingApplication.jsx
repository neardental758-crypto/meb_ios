import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';;
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';

function CarpoolingApplication (props){
  const goBack = () => {
    props.navigation.goBack();
  }
  const viewMap = () => {
    props.navigationProp.navigate('CarpoolingMapView');
  }
  const goChat = () => {
    props.navigation.navigate('CarpoolingConfirmation');
  }
    return(
    <KeyboardAwareScrollView style={{ flex: 1,  backgroundColor: '#fff'}}>
      {/* Header -   Obligatorio */}
      <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
      <View >
        <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
      </View>
    </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.dataValue}>
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 16/2023</Text>
          <Text>Conductor 1</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Cantidad de viajes</Text>
          <Text style={styles.textData}>2</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Promedio de calificación</Text>
          <Text style={styles.textData}>5.0</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Numero de asientos</Text>
          <Text style={styles.textData}>3</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Punto de partida aproximado</Text>
          <TouchableOpacity onPress={() => viewMap()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Ver mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataValue}>
          <Text>Punto de llegada aproximado</Text>
          <TouchableOpacity onPress={() => viewMap()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Ver mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataValue}>
          <Text>Chat del viaje</Text>
          <TouchableOpacity onPress={() => goChat()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar solicitud</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dataValue,{backgroundColor : Colors.$texto, padding : 10, borderRadius : 10}]}>
            <Text style={{color : '#DBDBDB'}}>Solicitud : Pendiente</Text>
          </View>
        </View>
     </View>

     <View style={styles.container}>
        <View style={styles.dataValue}>
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 17/2023</Text>
          <Text>Conductor 4</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Cantidad de viajes</Text>
          <Text style={styles.textData}>8</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Promedio de calificación</Text>
          <Text style={styles.textData}>4.9</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Numero de asientos</Text>
          <Text style={styles.textData}>1</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Punto de partida aproximado</Text>
          <TouchableOpacity onPress={() => viewMap()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Ver mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataValue}>
          <Text>Punto de llegada aproximado</Text>
          <TouchableOpacity onPress={() => viewMap()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Ver mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataValue}>
          <Text>Chat del viaje</Text>
          <TouchableOpacity onPress={() => goChat()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar solicitud</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dataValue,{backgroundColor : Colors.$texto, padding : 10, borderRadius : 10}]}>
            <Text style={{color : '#DBDBDB'}}>Solicitud : No aceptado</Text>
          </View>
        </View>
     </View>

     <View style={styles.container}>
        <View style={styles.dataValue}>
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 18/2023</Text>
          <Text>Conductor 7</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Cantidad de viajes</Text>
          <Text style={styles.textData}>27</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Promedio de calificación</Text>
          <Text style={styles.textData}>4.6</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Numero de asientos</Text>
          <Text style={styles.textData}>2</Text>
        </View>
        <View style={styles.dataValue}>
          <Text>Punto de partida aproximado</Text>
          <TouchableOpacity onPress={() => viewMap()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Ver mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataValue}>
          <Text>Punto de llegada aproximado</Text>
          <TouchableOpacity onPress={() => viewMap()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Ver mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataValue}>
          <Text>Chat del viaje</Text>
          <TouchableOpacity onPress={() => goChat()} style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 50, width : 100}}>
            <Text style={{color : 'black', textAlign : 'center'}}>Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar solicitud</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dataValue,{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}]}>
            <Text style={{color : 'black'}}>Solicitud : Aceptado</Text>
          </View>
        </View>
     </View>

    </KeyboardAwareScrollView>
    );
  }
  const styles = StyleSheet.create({
    container:{
      margin : 20,
      padding: 10,
      borderWidth : 1,
      borderStyle: 'dashed',
      borderRadius : 1,
      borderColor : Colors.$primario,
      justifyContent : 'center',
    },
    dataValue :{
      flexDirection : 'row',
      justifyContent : 'space-between',
      marginBottom : 10,
      alignItems : 'center'
    },
    dataAplication:{
      marginTop : 20,
      flexDirection : 'row',
      justifyContent : 'space-around',
      alignItems : 'center'
    },
    textData : {
      textAlign : 'center',
      minWidth : 50,
      padding : 8,
      borderRadius : 20,
      borderWidth : 1,
      borderColor : Colors.$primario
    }
  });
  function mapStateToProps(state) {
    return {
    }
  }
  
  export default connect(mapStateToProps)(CarpoolingApplication);
