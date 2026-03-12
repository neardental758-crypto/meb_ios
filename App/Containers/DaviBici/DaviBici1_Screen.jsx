import React from 'react';
import { Text, View,  TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Images from '../../Themes/Images';
import { connect } from 'react-redux';
import Colors from '../../Themes/Colors';

// Dispatch en actions  - Obligatorio
function DaviBici1_Screen(props) {
    
    const goBack = () => {
        props.navigation.goBack();
    }
    const next = () => {
        props.navigationProp.navigate('MapafinalizarViaje')
    }
  return (
    <ImageBackground source={Images.vectorRojoTu_scaner} style={{        
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
    {<View style={{flex : 1, justifyContent: 'center', alignItems : 'center'}}>
      <TouchableOpacity 
          onPress={() => {  /*next()*/ console.log('scaner') }}
          style={{backgroundColor : Colors.$primario, padding : 15, margin : 5, borderRadius : 25}}
          >
        <Text style={{color : 'white'}}>SCANER</Text>
      </TouchableOpacity>
    </View>}
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
)(DaviBici1_Screen);
