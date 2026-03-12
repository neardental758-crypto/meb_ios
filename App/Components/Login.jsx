import { Animated, Easing, ActivityIndicator, Image, Modal, Text, TextInput, TouchableWithoutFeedback, View, StyleSheet, Pressable, Dimensions, ImageBackground } from 'react-native';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import Images from '../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalForgotPassword from './ModalForgotPassword';
import Overlay from 'react-native-modal-overlay';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { addUser, setLoadingLogin } from '../actions/actions';
import { connect } from 'react-redux';
import { loginUser } from '../actions/actions';
import styles from './Styles/Login.style';
import { validateLogin } from '../actions/actions';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';
import * as RootNavigation from '../RootNavigation';
import { AuthContext } from '../AuthContext';
import LottieView from 'lottie-react-native';
import Chatbot_Login from '../Containers/Chatbot/Chatbot_Login';

const { height } = Dimensions.get('window');

function LoginComponent(props) {

  const [state, setState] = useState({
    email: '',
    password: '',
    openVisible: false,
    loader: false,
    name: '',
    socialPassword: '',
    username: '',
    origin: 'correo',
    category: 0,
    skills: '',
    achievement: '',
    rol: 'user',
    photo: '',
    //birthday: new Date("2020-08-12T23:55:37.012Z"),
    description: '',
    gender: '',
    activity: '',
    clubId: '',
    locationId: '',
    userId: '',
    token: 'token', //Se define este campo para dar nombre al objeto en el storage
    modalVisibleChat: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isLogin, dataUser } = useContext(AuthContext)

  /*useEffect(() => {
    console.log('en login = props.loaderLogin', props.loaderLogin)
    console.log('que es esto en el login', props.authenticated)
  },[])*/

  const closeModal = () => {
    setState({ ...state, modalVisible: false });
  };

  const openModal = () => {
    setState({ ...state, modalVisible: true });
  }

  const login = async () => {
    await props.validateLogin(state);
    dataUser();
    if (isLogin === true) {
      RootNavigation.navigate('HomeScreen');
    } else {
      dataUser();
    }
  };
  const goRegister = () => {
    RootNavigation.navigate("RegisterScreen");
  }

  // Animación para el icono del bot
  const animBob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animBob, {
          toValue: -10,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(animBob, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animBob]);

  const openChat = () => {
    setState({ ...state, modalVisibleChat: true });
  }

  const closeChat = () => {
    setState({ ...state, modalVisibleChat: false });
  }

  if (props.loaderLogin) {
    return (
      <Modal transparent={true}>
        <View style={{ backgroundColor: Colors.$blanco, flexDirection: "column", flex: 1 }}>
          <View style={{
            justifyContent: "center",
            alignItems: "center",
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            position: "absolute",
            top: 0,
            zIndex: -10
          }}>
            <LottieView source={require('../Resources/Lotties/bicy_inicio.json')} autoPlay loop
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }} />
          </View>
        </View>
      </Modal>
    )
  }
  else {
    return (
      <View style={estilos.container}>
        <ImageBackground source={Images.fondoMeb} style={estilos.backgroundImage}>
          <Pressable onPress={() => openChat()} style={estilos.fabBot}>
            <View style={estilos.tooltipContainer}>
              <Text style={estilos.tooltipText}>¿Necesitas ayuda?</Text>
            </View>
            <Animated.View style={{ transform: [{ translateY: animBob }] }}>
              <Image source={Images.robot_bike} style={estilos.robotIcon} />
            </Animated.View>
          </Pressable>
          <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={estilos.keyboardAwareScrollView}>
            <View style={{ flexDirection: 'column', backgroundColor: 'white', height: height / 2, borderTopLeftRadius: 35, borderTopRightRadius: 35 }}>
              <View style={{ backgroundColor: 'transparent', paddingEnd: horizontalScale(40), paddingStart: horizontalScale(40), marginTop: moderateScale(30) }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Image style={estilos.imageLeft} source={Images.userLogin} />
                  <Text style={estilos.inputsLogin}>Email</Text>
                </View>
                {props.doingLogin || props.authenticated ?
                  <ActivityIndicator style={{ alignSelf: 'center' }} size="large" color={Colors.$yellow} /> :
                  <View>
                    {!props.authenticated ?
                      <View>
                        <View style={estilos.inputWithIcon}>
                          <TextInput
                            placeholder='Ingresa tu email corporativo'
                            autoCompleteType={'email'}
                            style={estilos.loginInput}
                            keyboardType={'email-address'}
                            placeholderTextColor={Colors.$secundario}
                            value={state.email}
                            onChangeText={objectEmail => setState({
                              ...state,
                              email: objectEmail.toLowerCase().trim()
                            })}
                          />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                          <Image style={estilos.imageLeft} source={Images.lockLogin} />
                          <Text style={estilos.inputsLogin}>Contraseña</Text>
                        </View>
                        <View style={estilos.inputWithIcon}>
                          <TextInput
                            maxLength={4}
                            keyboardType="numeric"
                            placeholder='Ingresar contraseña'
                            placeholderTextColor={Colors.$secundario}
                            autoCompleteType={'password'}
                            style={estilos.loginInput}
                            secureTextEntry={!passwordVisible}
                            placeholderTextWeight='700'
                            onChangeText={password => setState({ ...state, password: password })}
                          />
                          <TouchableWithoutFeedback
                            onPressIn={() => setPasswordVisible(true)}
                            onPressOut={() => setPasswordVisible(false)}
                          >
                            <Image
                              style={estilos.imageLeft}
                              source={passwordVisible ? Images.showPass : Images.passHidden}
                            />
                          </TouchableWithoutFeedback>
                        </View>
                        <Pressable
                          onPress={() => openModal()}
                          style={estilos.forgotLink}
                        >
                          <Text style={estilos.passForgot}>¿Olvidaste tu contraseña?</Text>
                        </Pressable>
                      </View> : <View></View>
                    }
                  </View>
                }
                <Overlay
                  containerStyle={styles.overlay}
                  visible={state.modalVisible}
                  childrenWrapperStyle={styles.modalsContainer}
                  onClose={closeModal}
                  closeOnTouchOutside>
                  <ModalForgotPassword onClosePress={closeModal} />
                </Overlay>
              </View>
              <View>
                <View style={estilos.centeredItems}>
                  <View style={[estilos.loginButton, estilos.inputWithIcon2]}>
                    {props.doingLogin ?
                      <ActivityIndicator
                        style={{ alignSelf: 'center' }}
                        size="large"
                        color={Colors.$texto} />
                      :
                      <Pressable
                        onPress={() => login()}
                        style={estilos.botonItem}
                      >
                        <Text style={estilos.textBoton}>Iniciar sesión</Text>
                      </Pressable>
                    }
                  </View>
                </View>
                <View style={estilos.account}>
                  <Text style={[estilos.titleRegister]}>¿No tienes una cuenta?</Text>
                  <View style={[estilos.titleRegister]}>
                    <Pressable
                      onPress={() => goRegister()}
                    ><Text style={[estilos.textBoton1, { color: Colors.$primario }]}> Ingresa aquí</Text></Pressable>
                  </View>
                </View>
                <Modal
                  visible={state.modalVisibleChat}
                  animationType="slide"
                  transparent={false}
                  onRequestClose={closeChat}>
                  <View style={{ flex: 1 }}>
                    <Chatbot_Login onClose={closeChat} />
                  </View>
                </Modal>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  botonItem: {
    backgroundColor: Colors.$primario,
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 16,
  },
  passForgot: {
    fontSize: moderateScale(18),
    color: 'black'
  },
  cajaImg: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.$blanco,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .2,
    marginBottom: 50
  },
  textBoton: {
    fontSize: moderateScale(20),
    color: Colors.$blanco,
    fontFamily: Fonts.$poppinsregular,
  },
  textBoton1: {
    fontSize: moderateScale(16),
    color: Colors.$texto,
    fontFamily: Fonts.$poppinsregular,
  },
  centeredItems: {
    alignItems: 'center',
  },
  loginSubTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .2,
    marginBottom: verticalScale(0),
    marginTop: verticalScale(0),
  },
  titleLogin: {
    alignSelf: 'center',
    color: Colors.$texto,
    color: Colors.$texto,
    marginTop: -20,
    marginBottom: 0,
    fontSize: moderateScale(25),
    fontFamily: Fonts.$poppinsregular,
    fontFamily: Fonts.$poppinsregular,
  },
  titleRegister: {
    alignSelf: 'center',
    color: Colors.$texto,
    color: Colors.$texto,
    marginTop: 20,
    marginBottom: 10,
    fontSize: moderateScale(16),
    fontFamily: Fonts.$poppinsregular,
  },
  loginInput: {
    width: '85%',
    fontFamily: Fonts.$poppinsregular,
    fontSize: moderateScale(16),
    alignSelf: 'center',
    paddingLeft: 15,
    paddingVertical: 8,
  },
  imageLeft: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    marginRight: horizontalScale(12),
    marginLeft: horizontalScale(12),
    height: verticalScale(30),
    width: horizontalScale(23),
    resizeMode: 'contain',
    tintColor: Colors.$secundario
  },
  inputWithIcon: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: .8,
    borderRadius: 12,
  },
  inputWithIcon2: {
    flexDirection: 'row',
  },
  loginButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  forgotLink: {
    width: "100%",
    height: 60,
    padding: 12,
    borderRadius: 30
  },
  borderButton: {
    padding: 12,
    borderRadius: 30
  },
  account: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  borderButtonText: {
    color: Colors.$texto,
    color: Colors.$texto,
    fontSize: moderateScale(18),
    fontFamily: Fonts.$poppinsregular,
    fontFamily: Fonts.$poppinsregular,
    paddingEnd: 30,
    paddingStart: 30,
    paddingTop: 8,
    paddingBottom: 8
  },
  inputsLogin: {
    color: Colors.$secundario,
    fontSize: moderateScale(18),
  },
  container: {
  },
  backgroundImage: {
    height: height * .95,
    width: '100%',
  },
  keyboardAwareScrollView: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  fabBot: {
    position: 'absolute',
    top: moderateScale(40),
    right: horizontalScale(20),
    zIndex: 100,
    width: moderateScale(100),
    height: moderateScale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotIcon: {
    width: moderateScale(75),
    height: moderateScale(75),
    resizeMode: 'contain',
  },
  tooltipContainer: {
    position: 'absolute',
    right: horizontalScale(85),
    backgroundColor: Colors.$primario,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  tooltipText: {
    width: moderateScale(100),
    fontSize: moderateScale(14),
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$blanco,
    fontWeight: '600',
  },
})

function mapStateToProps(state) {
  return {
    doingLogin: state.userReducer.doingLogin,
    error: state.userReducer.error,
    authenticated: state.userReducer.authenticated,
    loaderLogin: state.othersReducer.loaderLogin
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loginUser: (userCredentials) => dispatch(loginUser(userCredentials)),
    validateLogin: (userCredentials) => dispatch(validateLogin(userCredentials)),
    addUser: (newUser) => dispatch(addUser(newUser)),
    setLoadingLogin: (state) => dispatch(setLoadingLogin(state))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);
