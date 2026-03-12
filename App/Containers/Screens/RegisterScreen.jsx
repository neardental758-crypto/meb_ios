import React,{ useState } from 'react';
import { View, ActivityIndicator, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import styles from './Styles/LoginScreen.style';
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import RegisterComponent from '../../Components/Register'

function RegisterScreen (props){
  
  const [ state, setState ] = useState({});

  const openLogin = () => {
    if (!state.inLogin) {
      setState({...state, inLogin: true });
      setState({...state, inRegister: false });
    }
  };
  const openRegister = () => {
    if (!state.inRegister) {
      setState({...state, inLogin: false });
      setState({...state, inRegister: true });
    }
  };
    return (
        <>
          <SafeAreaView style={{ flex: 1 }}>
            {!props.dataUser.isFetching &&
              <ScrollView>
                <View>
                  <RegisterComponent userLogged={() => {
                    props.navigation.navigate('MemberShipScreen')
                  }} pressBack={() => { props.navigation.goBack() }} />
                </View>
              </ScrollView>
            }
            {
              props.dataUser.isFetching &&
              <View style={{ flex: 1, heigth: '100%', justifyContent: 'center' }}>
                <ActivityIndicator style={{ alignSelf: 'center', marginTop: 5, marginBottom: 15 }} size="large" color={Colors.$red} />
              </View>
            }
          </SafeAreaView>
        </>
    );
  }

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer
  }
}

export default connect(
  mapStateToProps,
)(RegisterScreen);
