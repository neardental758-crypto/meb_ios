import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import { appActions, fetchData, routing, saveDocumentUser, saveLoader, saveRegisterSelectors, validateForm, guardarForm } from '../actions/actions';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import Images from '../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';
import * as RootNavigation from '../RootNavigation';
import { validateLogin } from '../actions/actions';
import { get_empresas } from '../actions/actions3g';
import { Alert } from 'react-native';
import ciudadesColombia from './cities.json';

function RegisterComponent(props) {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [terms, setTerms] = useState(false);
  const [state, setState] = useState({
    //Antes
    firstLastName: '',
    phone: '',
    loader: false,
    origin: 'correo',
    birthday: new Date().toJSON(),
    datepickerShow: false,
    datepickerFromShow: false,
    datepickerToShow: false,
    isSelected: false,
    setSelection: false,
    residentType: "",
    gender: "",
    civilState: "",
    workStatus: "",
    companysType: "",
    transportationMode: "",
    profession: "",
    confirmEmail: "",
    secondLastname: "",
    nameImage: "",
    stateDocumentUser: "",
    compilationType: "corporativo",
    //Ahora
    name: '',
    idType: '',
    idNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    usu_ciudad: ciudadesColombia[7]?.value || 'BOGOTA',
    empresa: '',
  });

  const palabraDefinida = 'Pasaporte';
  const isAlfanumerico = state.idType.includes(palabraDefinida);

  const askToEmail = () => {
    if (state.password.length < 4 || state.confirmPassword.length < 4) {
      Alert.alert('Problemas con la contraseña :(', 'La contraseña debe ser de 4 caracteres.');
      return;
    }

    if (state.empresa === '') {
      Alert.alert('Problemas con la organización :(', 'Debes seleccionar una organización.');
      return;
    }

    if (!!terms) {
      props.guardarForm(state);
    } else {
      Alert.alert('Debes aceptar términos y condiciones', 'Debes aceptar términos y condiciones');
    }
    if (!!canContinue && !!terms) {
      RootNavigation.navigate("PhoneScreen");
    }
  }

  const loginNavigate = () => {
    props.routing("LoginScreen");
  }

  const goBack = () => {
    RootNavigation.navigate("LoginScreen");
  }

  useEffect(() => {
    props.saveDocumentUser({});
    props.saveRegisterSelectors();
    props.onSelectPhoto('');
  }, []);

  useEffect(() => {
    if (!!canContinue) {
      setCanContinue(false);
      dispatch({ type: 'GUARDAR_FORM_REGISTER_FAILED' });
      RootNavigation.navigate("PhoneScreen");
    }
  }, [canContinue])

  useEffect(() => {
    setCanContinue(props.dataUser.formRegisterGuardarOK);
  }, [props.dataUser.formRegisterGuardarOK])

  useEffect(() => {
    setCanContinue(false);
    dispatch({ type: 'GUARDAR_FORM_REGISTER_FAILED' });
  }, [state.email])

  useEffect(() => {
    if (!props.dataRent.empresas_mysql_cargadas) {
      dispatch(get_empresas());
    }
  }, [!props.dataRent.empresas_mysql_cargadas]);

  if (props.dataUser.authenticated) {
    props.userLogged();
  }
  return (
    <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={10}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 20, paddingBottom: 5, backgroundColor: 'white' }}>
        <Pressable onPress={() => { goBack() }}
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            width: horizontalScale(40),
            height: verticalScale(40),
            borderRadius: moderateScale(40),
            borderColor: 'black',
            overflow: 'hidden',
            shadowColor: 'black',
            shadowOffset: { width: horizontalScale(40), height: verticalScale(40), },
            shadowOpacity: 1,
            shadowRadius: moderateScale(60),
            elevation: 5,
          }}>
          <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30), }} source={Images.atras_Icon} />
        </Pressable>
      </View>
      <View style={{ backgroundColor: 'white' }}>
        <View>
          <View >
            <Text style={{ fontFamily: Fonts.$montserratExtraBold, fontSize: moderateScale(26), color: 'black', marginTop: moderateScale(20), paddingLeft: '10%', marginBottom: verticalScale(10) }}>Hola, bienvenid@! 👋</Text>
            <Text style={{ width: '80%', fontSize: moderateScale(16), paddingLeft: '10%', marginBottom: verticalScale(20) }}>Por favor completa tu información para crear la cuenta.</Text>
          </View>

          {/** Add select org */}
          {
            props.dataRent.empresas_mysql_cargadas ?
              <View>
                <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Organización</Text>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  placeholder={{
                    label: 'Selecciona tú organización...',
                    value: ''
                  }}
                  useNativeAndroidPickerStyle={false}
                  value={state.empresa}
                  onValueChange={(value) => { setState({ ...state, empresa: value }) }}
                  items={
                    (props.dataRent.empresas_mysql?.data || [])
                      .filter(emp => emp.emp_estado === 'ACTIVA')
                      .map(dataEMP => ({
                        label: dataEMP.emp_nombre,
                        value: dataEMP.emp_id
                      }))
                  }
                  Icon={() => {
                    return (
                      <Image source={Images.iconPickerYellow} style={{ top: 12, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} />
                    );
                  }}
                />

              </View> : null
          }

          <View>
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Nombre y apellido</Text>
            <TextInput
              style={[estilos.inputRegister, { fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18) }]}
              placeholder={'Ingresa tu nombre completo'}
              placeholderTextColor={Colors.$secundario}
              onChangeText={(objectName) => setState({ ...state, name: objectName })}
            />
          </View>
          <View>
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Tipo de documento</Text>
            <RNPickerSelect
              style={pickerSelectStyles}
              placeholder={{
                label: 'Selecciona un tipo de documento...',
                value: ''
              }}
              useNativeAndroidPickerStyle={false}
              value={state.idType}
              onValueChange={(value) => { setState({ ...state, idType: value }) }}
              items={[
                { label: 'Cédula', value: 'Cédula' },
                { label: 'Cédula de extranjería', value: 'Cédula de extranjería' },
                { label: 'Pasaporte', value: 'Pasaporte' },
                { label: 'Documento de identidad', value: 'Documento de identidad' },
              ]}
              Icon={() => {
                return (
                  <Image source={Images.iconPickerYellow} style={{ top: 12, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} />
                );
              }}
            />
          </View>



          <View>
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Número de documento</Text>
            <TextInput
              style={[estilos.inputRegister, { fontFamily: Fonts.$poppinsregular }]}
              keyboardType={isAlfanumerico ? 'default' : 'numeric'}
              placeholder={'Ingresa número de Documento'}
              placeholderTextColor={Colors.$secundario}
              onChangeText={objectIdNumber => setState({ ...state, idNumber: objectIdNumber })}
            />
          </View>
          <View>
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Ciudad</Text>
            <RNPickerSelect
              style={pickerSelectStyles}
              placeholder={state.usu_ciudad === '' ? { label: 'Agregar ciudad', value: 'BOGOTA' } : {}}
              useNativeAndroidPickerStyle={false}
              value={state.usu_ciudad}
              onValueChange={(value) => { setState({ ...state, usu_ciudad: value }) }}
              items={ciudadesColombia.map(ciudad =>
                ({ label: ciudad.label, value: ciudad.value }))
              }
              Icon={() => {
                return (
                  <Image source={Images.iconPickerYellow} style={{ top: 12, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} />
                );
              }}
            />
          </View>
          <View>
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Correo electrónico</Text>
            <TextInput
              placeholder='Ingresa correo electrónico'
              style={[estilos.inputRegister, { fontFamily: Fonts.$poppinsregular }]}
              placeholderTextColor={Colors.$secundario}
              autoCompleteType={'email'}
              keyboardType={'email-address'}
              value={state.email}
              onChangeText={objectEmail => setState({
                ...state,
                email: objectEmail.toLowerCase()
              })}
            />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Crear contraseña (4 carácteres)</Text>
            <View style={estilos.inputWithIcon}>
              <TextInput
                maxLength={4}
                keyboardType="numeric"
                autoCompleteType={'password'}
                style={{ width: '80%', fontSize: moderateScale(20), padding: 0 }}
                secureTextEntry={!passwordVisible}
                value={state.password}
                placeholder="Ingresar contraseña"
                placeholderTextColor={Colors.$secundario}
                onChangeText={objectPassword => setState({ ...state, password: objectPassword })}
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
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(18), paddingLeft: '8%', color: Colors.$secundario }}>Confirmar contraseña</Text>
            <View style={estilos.inputWithIcon}>
              <TextInput
                maxLength={4}
                keyboardType="numeric"
                autoCompleteType={'password'}
                style={{ width: '80%', fontSize: moderateScale(20), padding: 0 }}
                secureTextEntry={!confirmPasswordVisible}
                value={state.confirmPassword}
                placeholder="Confirmar contraseña"
                placeholderTextColor={Colors.$secundario}
                onChangeText={objectConfirmPassword => setState({ ...state, confirmPassword: objectConfirmPassword })}
              />
              <TouchableWithoutFeedback
                onPressIn={() => setConfirmPasswordVisible(true)}
                onPressOut={() => setConfirmPasswordVisible(false)}
              >
                <Image
                  style={estilos.imageLeft}
                  source={confirmPasswordVisible ? Images.showPass : Images.passHidden}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: '4%' }}>
            <CheckBox
              value={terms}
              tintColors={{ true: 'black', false: 'black' }}
              onValueChange={() => setTerms(!terms)}
            />
            <TouchableOpacity onPress={() => RootNavigation.navigate('TermsScreen')}>
              <Text style={[{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(15), color: 'black', textAlign: 'justify', textAlignVertical: 'center', textDecorationLine: 'underline' }]}>
                Aceptar términos y condiciones
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ display: 'flex', alignItems: 'center', marginTop: moderateScale(20), marginBottom: moderateScale(20) }}>
          <Pressable
            onPress={() => {
              askToEmail();
            }}
            style={estilos.botonItem}
          >
            <Text style={estilos.textBoton}>Continuar</Text>
          </Pressable>
        </View>
        <View style={estilos.account}>
          <Text style={[estilos.titleRegister]}>¿Ya tienes una cuenta?</Text>
          <View style={[estilos.titleRegister]}>
            <Pressable
              onPress={() => loginNavigate()}
              style={estilos.borderButton}
            ><Text style={[estilos.textBoton1, { color: Colors.$primario }]}> Ingresa aquí</Text></Pressable>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView >
  )
};

const estilos = StyleSheet.create({
  inputRegister: {
    textAlignVertical: 'bottom',
    fontSize: moderateScale(18),
    paddingLeft: moderateScale(10),
    marginLeft: moderateScale(25),
    marginRight: moderateScale(25),
    paddingVertical: moderateScale(5),
    borderColor: 'black',
    borderWidth: .8,
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(2),
    paddingBottom: moderateScale(5),
    paddingTop: moderateScale(5),
    width: 'auto',
    color: 'black',
  },
  contModal: {
    backgroundColor: "rgba(52, 52, 52, 0.9)",
    flexDirection: "column",
    flex: 1
  },
  cajaModal: {
    flex: 3,
    borderRadius: 6,
    marginVertical: 230,
    marginHorizontal: 50,
    backgroundColor: Colors.$blanco,
    backgroundColor: Colors.$blanco,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25
  },
  botonItem: {
    backgroundColor: Colors.$primario,
    width: "80%",
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
  botonItemOff: {
    backgroundColor: Colors.$secundario,
    width: "80%",
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
  textBoton: {
    fontSize: moderateScale(20),
    color: Colors.$blanco,
    fontFamily: Fonts.$poppinsregular,
  },
  account: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleRegister: {
    alignSelf: 'center',
    color: Colors.$texto,
    marginTop: 20,
    marginBottom: 10,
    fontSize: moderateScale(16),
    fontFamily: Fonts.$poppinsregular,
  },
  textBoton1: {
    fontSize: moderateScale(16),
    color: Colors.$texto,
    fontFamily: Fonts.$poppinsregular,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: .8,
    borderRadius: 12,
    textAlignVertical: 'bottom',
    fontSize: moderateScale(18),
    paddingLeft: moderateScale(10),
    marginLeft: moderateScale(25),
    marginRight: moderateScale(25),
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(2),
    width: 'auto',
    color: 'black',
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: moderateScale(18),
    borderBottomWidth: 2,
    backgroundColor: "transparent",
    paddingLeft: 15,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderColor: Colors.$secundario,
    borderRadius: 5,
    marginTop: 15,
    color: Colors.$secundario,
    height: 40,
  },
  placeholder: {
    color: Colors.$secundario,
    fontSize: moderateScale(20),
  },
  inputAndroid: {
    fontSize: moderateScale(18),
    paddingLeft: moderateScale(10),
    marginLeft: moderateScale(25),
    marginRight: moderateScale(25),
    paddingVertical: moderateScale(5),
    borderColor: 'black',
    borderWidth: .8,
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(2),
    paddingBottom: moderateScale(5),
    paddingTop: moderateScale(5),
    width: 'auto',
    color: 'black',
    paddingHorizontal: moderateScale(10),
  },
  textBoton1: {
    fontSize: moderateScale(16),
    color: Colors.$texto,
    fontFamily: Fonts.$poppinsregular,
  },
  shadowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: horizontalScale(80), // Tamaño del contenedor de la sombra
    height: verticalScale(80), // Tamaño del contenedor de la sombra
    borderRadius: horizontalScale(40), // La mitad del tamaño para un círculo
    backgroundColor: 'transparent',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, // Ajusta la opacidad según sea necesario
    shadowRadius: 10, // Ajusta el tamaño del difuminado de la sombra
  },
});

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    membershipTermsAccepted: state.othersReducer.membershipTermsAccepted,
    selectedPhoto: state.othersReducer.selectedPhoto,
    idTypes: state.userReducer.idTypes,
    residentTypes: state.userReducer.residentTypes,
    genders: state.userReducer.genders,
    civilStates: state.userReducer.civilStates,
    worksStatus: state.userReducer.worksStatus,
    documentUser: state.userReducer.documentUser,
    loader: state.userReducer.loader,
    companyType: state.userReducer.companyType,
    transportationMode: state.userReducer.transportationMode,
    dataRent: state.reducer3G,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSelectPhoto: (state) => dispatch(appActions.onSelectPhoto(state)),
    fetchData: () => dispatch(fetchData()),
    validateForm: (formRegister) => dispatch(validateForm(formRegister)),
    guardarForm: (formRegister) => dispatch(guardarForm(formRegister)),
    routing: (component) => dispatch(routing(component)),
    //uploadEventImage: (Image) => dispatch(uploadEventImage(Image)),
    saveDocumentUser: (document) => dispatch(saveDocumentUser(document)),
    saveRegisterSelectors: () => dispatch(saveRegisterSelectors()),
    saveLoader: (loader) => dispatch(saveLoader(loader)),
    validateLogin: (userCredentials) => dispatch(validateLogin(userCredentials)),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterComponent);
