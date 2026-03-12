import React from 'react';
import { Text, View,  TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Images from '../../Themes/Images';
import { connect } from 'react-redux';
import Colors from '../../Themes/Colors';
// Dispatch en actions  - Obligatorio
function MapaFinalizarViaje(props) {
  const goBack = () => {
    props.navigation.goBack();
}
const next = () => {
    props.navigationProp.navigate('Indicadores')
}
  return (
    <ImageBackground source={Images.calificar} style={{        
      flex: 1,
      width: '100%', 
      justifyContent: 'center'
      }}>
    <View style={{flex : 1 , alignItems : 'flex-start'}}>
      <TouchableOpacity 
            onPress={() => {  goBack() }}
            style={{backgroundColor : Colors.$primario, padding : 15, margin : 5, borderRadius : 15}}
            >
        <Text style={{color : 'white'}}>ATRÁS</Text>
      </TouchableOpacity>
    </View>
    <View style={{flex : 1, justifyContent: 'flex-end', alignItems : 'flex-end'}}>
      <TouchableOpacity 
          onPress={() => {  next() }}
          style={{backgroundColor : Colors.$primario, padding : 15, margin : 5, borderRadius : 15}}
          >
        <Text style={{color : 'white'}}>SIGUIENTE</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
    containerButtons : {
      marginTop: 20, 
      marginBottom: 20, 
      alignSelf: 'center',
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
)(MapaFinalizarViaje);
