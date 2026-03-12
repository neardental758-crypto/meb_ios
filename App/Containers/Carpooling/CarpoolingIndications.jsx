import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';;
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';

function CarpoolingIndications (props){
  const goBack = () => {
    props.navigation.goBack();
  }
  const next = () => {
    RootNavigation.navigate('Home');
  }

    return(
        <ImageBackground source={Images.indicadoresCarpooling} style={{        
            flex: 1,
            width: '100%', 
            justifyContent: 'center'
            }}>
          
        <View style={{flex : 1, justifyContent: 'flex-end', alignItems : 'flex-end'}}>
            <TouchableOpacity 
                onPress={() => {  next() }}
                style={{backgroundColor : Colors.$primario, padding : 15, margin : 5, borderRadius : 15}}
                >
            <Text style={{color : 'white'}}>HOME</Text>
            </TouchableOpacity>
        </View>
          </ImageBackground>
    );
  }
 
function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(CarpoolingIndications);