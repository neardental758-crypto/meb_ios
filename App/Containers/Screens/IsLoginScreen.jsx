import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, SafeAreaView, ImageBackground, Text, Button, Modal, Dimensions, Image } from 'react-native';
//import LottieView from 'lottie-react-native';
import styles from './Styles/LoginScreen.style';
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { AuthContext } from '../../AuthContext';

function IsLoginScreen (props){
    const { isLogin, token, dataUser } = useContext( AuthContext )

    useEffect(() => {
      console.log('ingresando...');
      dataUser();
    },[])

    return(
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
        {/*<ScrollView>
            <Text>Login exitoso</Text>
            <Button
              onPress={ () => dataUser() }
              title="OK"
              color="#841584"
            />
        </ScrollView>*/}
        <Modal transparent={true}>
            <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
               
                </View>
            </View>
        </Modal>
      </SafeAreaView>
    );
}
function mapStateToProps (state) {
  return {
    dataUser: state.userReducer,
    //navigationProp: state.globalReducer.nav._navigation
  }
}
export default connect(
  mapStateToProps,
)(IsLoginScreen);
