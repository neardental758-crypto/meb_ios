import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';

function CarpoolingConfirmation (props){
  const goBack = () => {
    props.navigation.goBack();
  }
  const trip = () => {
    props.navigationProp.navigate('CarpoolingTripInProcess');
  }

    return( 
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
      {/* Header -   Obligatorio */}
      <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
        <View >
          <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
        </View>
      </TouchableOpacity>
      <View style={[styles.container, {borderWidth : 1}]}>
        <View>
          <View style={styles.messageReceived}>
            <View style={styles.dataValue}>
              <Text style={{fontSize : 18}}>Conductor</Text>
              <Text style={{fontSize : 18}}>14:19</Text>
            </View>
            <View style={{padding: 10}}>
              <Text style={{fontSize : 18}}>¿Te parece si nos encontramos en el Centro comercial?</Text>
            </View>
          </View>
          <View style={styles.messageReceived}>
            <View style={styles.dataValue}>
              <Text style={{fontSize : 18}}>Pasajero 1</Text>
              <Text style={{fontSize : 18}}>14:21</Text>
            </View>
            <View style={{padding: 10}}>
              <Text style={{fontSize : 18}}>Claro, me queda perfecto.</Text>
            </View>
          </View>
        </View>


        <View style={[styles.textBox,{ backgroundColor : Colors.$primario}]}>
          <TextInput
            style={styles.input}
            onChangeText={console.log("change")}
            placeholder="Enviar mensaje..."
          />
          <TouchableOpacity>
            <Image style={{ tintColor: 'black', width : 40, height : 30, transform: [{ rotate: '180deg' }]}} source={Images.mailRed} />
          </TouchableOpacity>
        </View>
      </View>
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
      padding : 10
    },
    dataAplication:{
      flexDirection : 'row',
      justifyContent : 'flex-end'
    },
    icons :{
      flexDirection : 'row',
      marginRight : 10
    },
    detail : {
      flexDirection : 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
      padding : 10,
      backgroundColor : Colors.$texto
    },
    messageReceived : {
      borderBottomWidth:  1,
      backgroundColor : '#DBDBDB'
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderColor : Colors.$texto,
      borderRadius : 10,
      padding: 10,
      width : '80%',
      fontSize : 18
    },
    textBox : {
      borderColor : Colors.$primario,
      flexDirection : 'row',
      alignItems : 'center'
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
  )(CarpoolingConfirmation);
