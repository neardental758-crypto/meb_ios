import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';;
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Colors from '../../Themes/Colors';

function CarpoolingDetail (props){
    const goBack = () => {
      props.navigation.goBack();
    }
    const goChat = () => {
      props.navigation.navigate('CarpoolingConfirmation');
    }
    const goStarTrip = () => {
      props.navigation.navigate('CarpoolingStartTrip');
    }
    const viewMap = () => {
      props.navigationProp.navigate('CarpoolingMapView');
    }
    const gorute = () => {
      props.navigationProp.navigate('CarpoolingRute');
    }

    return(
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
      <KeyboardAwareScrollView >
      {/* Header -   Obligatorio */}
      <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
      <View >
        <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
      </View>
    </TouchableOpacity>

    <View style={styles.cardContainer}>
      <Text style={{textAlign : 'center', color : 'black', fontSize : 25, marginBottom : 30}}>Detalles del viaje</Text> 
      <View style={styles.dataValue}>
        <Text style={styles.textSubrayed}>Punto de partida</Text>
        <TouchableOpacity><Text style={styles.textValue} onPress={() => viewMap()}>Lugar</Text></TouchableOpacity>
      </View>
      <View style={styles.dataValue}>
        <Text style={styles.textSubrayed}>Punto de llegada</Text>
        <TouchableOpacity><Text style={styles.textValue} onPress={() => viewMap()}>Lugar</Text></TouchableOpacity>
      </View>
      <View style={styles.dataValue}>
        <Text style={styles.textSubrayed}>Hora de salida</Text>
        <Text style={styles.textValue}>Hora</Text>
      </View>
      <View style={styles.dataValue}>
        <Text style={styles.textSubrayed}>Vehículo</Text>
        <Text style={styles.textValue}>Carro1</Text>
      </View>
      <View style={styles.dataValue}>
        <Text style={styles.textSubrayed}>Asientos disponibles</Text>
        <Text style={styles.textValue}>Numero</Text>
      </View>
     </View> 
     <View style={styles.buttons}>
        <TouchableOpacity 
        style={{backgroundColor : Colors.$texto ,padding : 10 ,borderRadius : 50, width : 300 }} 
        onPress={() => goChat()}>
          <Text style={{ fontSize : 18, color : '#fff', textAlign : 'center'}}>Chat grupal</Text>
        </TouchableOpacity>
     </View>
     <View style={styles.buttons}>
        <TouchableOpacity 
        style={{backgroundColor : Colors.$primario ,padding : 10 ,borderRadius : 50, width : 300 }} 
        onPress={() => goStarTrip()}>
          <Text style={{ fontSize : 18, color : 'black', textAlign : 'center'}}>Iniciar viaje</Text>
        </TouchableOpacity>
     </View>
        <View style={styles.riderContainer}>
        <Text style={{fontSize : 20, marginBottom : 20}}>Acompañantes confirmados</Text>
            <Text style={styles.rider}> Acompañante 1 </Text>
            <Text style={styles.rider}> Acompañante 2 </Text>
            <Text style={styles.rider}> Acompañante 3 </Text>
        </View> 
        <View style={styles.addRider}>
            <Text style={{textAlign : 'center', backgroundColor : Colors.$primario, padding : 10, color : 'black', borderRadius : 50, fontSize : 25, marginBottom : 30}}>Solicitud de acompañante</Text>
            <View style={styles.dataValue}>
                <Text style={{color: 'white', fontSize : 18, borderBottomWidth : 1, borderBottomColor : 'white'}}> Nombre </Text>
                <Text style={{color: 'white', fontSize : 18}}>Pasajero 1</Text>
            </View>
            <View style={styles.dataValue}>
                <Text style={{color: 'white', fontSize : 18, borderBottomWidth : 1, borderBottomColor : 'white'}}> Cantidad de viajes </Text>
                <Text style={{color: 'white', fontSize : 18}}>3</Text>
          </View>
          <View style={styles.dataValue}>
                <Text style={{color: 'white', fontSize : 18, borderBottomWidth : 1, borderBottomColor : 'white'}}> Promedio de calificación </Text>
                <Text style={{color: 'white', fontSize : 18}}>3.9</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', margin : 10}}>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => gorute()}>
                <Text style={{backgroundColor : '#DBDBDB' ,padding : 10, color : 'black', borderRadius : 50}}> Crear punto de recogida </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => goChat()}>
                <Text style={{backgroundColor : Colors.$primario ,padding : 10, color : 'black', borderRadius : 50}}>Agregar acompañante</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> 

        <View style={styles.addRider}>
            <Text style={{textAlign : 'center', backgroundColor : Colors.$primario, padding : 10, color : 'black', borderRadius : 50, fontSize : 25, marginBottom : 30}}>Solicitud de acompañante</Text>
            <View style={styles.dataValue}>
                <Text style={{color: 'white', fontSize : 18, borderBottomWidth : 1, borderBottomColor : 'white'}}> Nombre </Text>
                <Text style={{color: 'white', fontSize : 18}}>Pasajero 2</Text>
            </View>
            <View style={styles.dataValue}>
                <Text style={{color: 'white', fontSize : 18, borderBottomWidth : 1, borderBottomColor : 'white'}}> Cantidad de viajes </Text>
                <Text style={{color: 'white', fontSize : 18}}>5</Text>
          </View>
          <View style={styles.dataValue}>
                <Text style={{color: 'white', fontSize : 18, borderBottomWidth : 1, borderBottomColor : 'white'}}> Promedio de calificación </Text>
                <Text style={{color: 'white', fontSize : 18}}>4.3</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', margin : 10}}>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => gorute()}>
                <Text style={{backgroundColor : '#DBDBDB' ,padding : 10, color : 'black', borderRadius : 50}}> Crear punto de recogida </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => goChat()}>
                <Text style={{backgroundColor : Colors.$primario ,padding : 10, color : 'black', borderRadius : 50}}>Agregar acompañante</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> 

    </KeyboardAwareScrollView>
    </View>
    );
  }
  const styles = StyleSheet.create({
    buttons: {
        margin : 10,
        justifyContent : 'center',
        alignItems : 'center',
    },
    container:{
      flex : 1 ,
      flexDirection: 'column', 
      justifyContent : 'space-between'
    },
    dataValue :{
      flexDirection : 'row',
      justifyContent : 'space-between',
      padding : 10,
    },
    rider : {
      textAlign : 'center',
      fontSize : 16,
      borderBottomWidth : 1,
      marginBottom : 5,
      width : 300
    },
    riderContainer : {
      flexDirection : 'column',
      alignItems : 'center',
      marginTop : 10,
      marginBottom : 10,
      paddingLeft : 10,
      paddingRight : 10,
      marginBottom : 50
    },
    addRider : {
      backgroundColor : Colors.$texto,
      margin : 10,
      borderRadius : 20,
      padding : 10,
      paddingTop : 0
    },
    cardContainer : {
      backgroundColor : Colors.$primario,
      margin : 20,
      padding : 20,
      borderRadius : 20
    },
    textSubrayed: {
      color : 'black', 
      fontSize : 18, 
      borderBottomWidth : 1, 
      borderBottomColor : 'white'
    },
    textValue : {
      textAlign : 'center',
      width : 100,
      padding : 12,
      borderRadius : 20,
      borderWidth : 1,
      backgroundColor : 'white'
    }
  });
  function mapStateToProps(state) {
    return {
      navigationProp: state.globalReducer.nav._navigation
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CarpoolingDetail);
