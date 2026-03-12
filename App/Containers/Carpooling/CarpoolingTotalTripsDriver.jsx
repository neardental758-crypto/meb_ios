import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';;
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';

function CarpoolingTotalTripsDriver (props){
  const goBack = () => {
    props.navigation.goBack();
  }
  const goDetail = () => {
    props.navigationProp.navigate('CarpoolingDetail');
  }
  const viewMap = async () => {
    props.navigationProp.navigate('CarpoolingMapView');
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
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 17/2023</Text>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar viaje</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => goDetail()} style={[styles.dataValue,{backgroundColor : Colors.$texto, padding : 10, borderRadius : 10}]}>
            <Text style={{color : '#DBDBDB'}}>Ver detalles</Text>
          </TouchableOpacity>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Iniciar viaje</Text>
            </TouchableOpacity>
          </View>
        </View>
     </View>

     <View style={styles.container}>
        <View style={styles.dataValue}>
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 18/2023</Text>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar viaje</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => goDetail()} style={[styles.dataValue,{backgroundColor : Colors.$texto, padding : 10, borderRadius : 10}]}>
            <Text style={{color : '#DBDBDB'}}>Ver detalles</Text>
          </TouchableOpacity>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Iniciar viaje</Text>
            </TouchableOpacity>
          </View>
        </View>
     </View>

     <View style={styles.container}>
        <View style={styles.dataValue}>
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 19/2023</Text>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar viaje</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => goDetail()} style={[styles.dataValue,{backgroundColor : Colors.$texto, padding : 10, borderRadius : 10}]}>
            <Text style={{color : '#DBDBDB'}}>Ver detalles</Text>
          </TouchableOpacity>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Iniciar viaje</Text>
            </TouchableOpacity>
          </View>
        </View>
     </View>

     <View style={styles.container}>
        <View style={styles.dataValue}>
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 20/2023</Text>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar viaje</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => goDetail()} style={[styles.dataValue,{backgroundColor : Colors.$texto, padding : 10, borderRadius : 10}]}>
            <Text style={{color : '#DBDBDB'}}>Ver detalles</Text>
          </TouchableOpacity>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Iniciar viaje</Text>
            </TouchableOpacity>
          </View>
        </View>
     </View>

     <View style={styles.container}>
        <View style={styles.dataValue}>
          <Text style={{fontFamily : Fonts.$montserratExtraBold, fontSize : 20, marginBottom : 10}}>Enero 21/2023</Text>
        </View>
        <View style={styles.dataAplication}>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Eliminar viaje</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => goDetail()} style={[styles.dataValue,{backgroundColor : Colors.$texto, padding : 10, borderRadius : 10}]}>
            <Text style={{color : '#DBDBDB'}}>Ver detalles</Text>
          </TouchableOpacity>
          <View style={styles.dataValue}>
            <TouchableOpacity style={{backgroundColor : Colors.$primario, padding : 10, borderRadius : 10}}>
              <Text style={{color : 'black'}}>Iniciar viaje</Text>
            </TouchableOpacity>
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
      flexDirection : 'row',
      justifyContent : 'space-around',
      alignItems : 'center'
    },
    textData : {
      textAlign : 'right',
      minWidth : 50,
      padding : 8,
      borderRadius : 20,
      borderWidth : 1,
      borderColor : Colors.$primario
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
  )(CarpoolingTotalTripsDriver);
