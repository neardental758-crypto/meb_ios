import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, Pressable } from 'react-native';
import { ButtonComponent } from './ButtonComponent';
import Fonts from '../Themes/Fonts';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './Styles/ModalForgotPassword.style';
import { validateEmailPassword } from '../actions/actions';

function ModalForgotPassword(props) {

  const [emailValue, setEmailValue] = useState('');

  const handleCloseButtonPress = () => {
    const { onClosePress } = props;
    if (onClosePress) {
      onClosePress();
    }
  }
  const sendForgotPassword = () => {
    props.validateEmailPassword(emailValue); //Viene alerta y valida globalSagas
    handleCloseButtonPress();
  }
  const onSearchValueChange = (event) => {
    setEmailValue(event);
  };
  
  const { loading } = props;
  if (loading) {
    return (
    <ActivityIndicator style={{ alignSelf: 'center', marginTop: 100, marginBottom: 100 }} size="large" color={Colors.$red} />
    );
  } else {
  return (
    <View style={estilos.modalForgotContainer}>
      <TouchableOpacity
        style={estilos.closeButtonForgot}
        onPress={() => { handleCloseButtonPress() }}>
        <Image style={[estilos.closeForgotIcon, { height: 50, width: 50 }]} source={Images.x_icon} />
      </TouchableOpacity>
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={-100}>
        <Image style={[estilos.centeredMargins, { height: 30, width: 30, resizeMode: "contain" }]} source={Images.grayPadlock} />
        <Text style={estilos.forgotTitle}>¿OLVIDASTE TU CONTRASEÑA?</Text>
        <Text style={estilos.forgotText}>Introduce el email con el que estas registrado.</Text>
        <Text style={estilos.forgotText2}>En unos minutos recibirás un mail para realizar el cambio.</Text>
        <View style={estilos.inputForgotCont}>
          <Image style={[estilos.imageInput, { width: 25, height: 25, resizeMode: "contain" }]} source={Images.grayMail} />
          <TextInput
            placeholder='Email registrado'
            autoCompleteType={'email'}
            style={estilos.forgotInput}
            value={emailValue}
            keyboardType={'email-address'}
            onChangeText={onSearchValueChange}
          />
        </View>

        <View style={[estilos.forgotButton, {borderColor:'#acd576'}]}>
          <Pressable 
            onPress={()  => sendForgotPassword()}
            style={ estilos.botonItem }
          >
            <Text style={ estilos.textBoton }>Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
  }
}

const estilos = StyleSheet.create({
  modalForgotContainer:{
  	height: 400,
  	position: 'relative',
    width: '100%',
  },
  forgotTitle:{
    textAlign: 'center',
  	fontSize: 28,
  	fontWeight: Platform.OS == 'ios'?'900':'bold',
  	color: Colors.$texto,
  	marginTop: 10,
	  marginBottom: 18,
	  fontFamily: Fonts.$montserratExtraBold
  },
  forgotText:{
  	fontSize: 14,
    textAlign: 'center',
    marginBottom: 10
  },
  forgotText2:{
  	fontSize: 14,
  	textAlign: 'center',
    color: Colors.$texto50,
	  fontFamily: Fonts.$poppinsregular
  },
  inputForgotCont:{
  	marginTop: 30,
  	borderRadius: 20,
  	height: 'auto',
  	borderWidth: 2,
  	borderColor: Colors.$secundario,
  	position: 'relative',
  	flexDirection: 'row',
  },
  forgotInput:{
  	color: Colors.$texto,
    fontSize: 18,
  	paddingLeft: 15,
  	width: '80%'
  },
  imageInput:{
  	marginLeft: 15,
  	marginTop: 11,
  },
  forgotButton:{
  	height: 'auto',
  	width: 120,
    borderRadius: 25,
	  marginTop: 25,
	  marginBottom: 45,
  	marginLeft: 'auto',
  	marginRight: 'auto'
  },
  botonItem: {
    backgroundColor: Colors.$primario,
    width: "100%",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 25
  },
  textBoton: {
    fontSize: 18,
    color: Colors.$blanco
  },
  closeButtonForgot:{
  	position: 'absolute',
  	right: -10,
  	top: -10,
  }
})

function mapStateToProps(state) {
  return {
    dataOthers: state.othersReducer,
    loading: state.othersReducer.isFetching,
    emailSend: state.othersReducer.emailSend,
    error: state.othersReducer.error,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    validateEmailPassword: (emailForgot) => dispatch(validateEmailPassword(emailForgot)),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalForgotPassword);
