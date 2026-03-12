import React from 'react';
import { Text, View,  TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import Images from '../../Themes/Images';
import { connect } from 'react-redux';
import Colors from '../../Themes/Colors';
import { Content } from 'native-base';

// Dispatch en actions  - Obligatorio
function Reserva(props) {

  const goBack = () => {
    props.navigation.goBack();
}
  const next = () => {
    props.navigationProp.navigate('Mapa');
  }

  return (
      <Content>

        <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
          <View >
            <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
          </View>
        </TouchableOpacity>

      <Image 
        source={Images.reservaRuta} 
        style={{ 
        width: '100%', 
        height: 900,  
        alignSelf: 'center'}} 
      />
        <TouchableOpacity 
            onPress={() => {  next() }}
            style={{flexDirection : 'row', justifyContent : 'center', padding: 20, backgroundColor : Colors.$primario}}
            >
          <Text style={{color : 'black', fontSize : 20}}>SIGUIENTE</Text>
        </TouchableOpacity>

      </Content>
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
)(Reserva);
