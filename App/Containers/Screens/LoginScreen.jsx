import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import styles from './Styles/LoginScreen.style';
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import LoginComponent from '../../Components/Login';

function LoginScreen (props){
  const [ state, setState ] = useState({
      inLogin: false,
      inRegister: false,
      showLoginStatus: false,
    });
  
  const openLogin = () => {
      if (!state.inLogin) {
        setState({ inLogin: true });
        setState({ inRegister: false });
      }
    };
  const openRegister = () => {
    if (!state.inRegister) {
      setState({ inLogin: false });
      setState({ inRegister: true });
    }
  };

  const routingAfterLogin = () => {
    console.log("routingAfterLogin click" );
  }
    return(
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
        <View style={{flex: 1}}>
            <LoginComponent userLogged={()=> routingAfterLogin()} goRegister={()=>{props.navigationProp.navigate('RegisterScreen')}} />
        </View>
      </SafeAreaView>
    );
}
function mapStateToProps (state) {
  return {
    dataUser: state.userReducer
  }
}
export default connect(
  mapStateToProps,
)(LoginScreen);
