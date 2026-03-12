import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';;
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';

function CarpoolingRute (props){
  const goBack = () => {
    props.navigation.goBack();
  }
  const next = () => {
    props.navigationProp.navigate('CarpoolingIndications');
  }

    return(
        <ImageBackground source={Images.rutaGenerada} style={{        
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
          </ImageBackground>
    );
  }

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
  )(CarpoolingRute);