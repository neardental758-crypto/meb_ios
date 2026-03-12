import React, { useState, useEffect } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text,
  View, 
  TextInput, 
  Dimensions,
  Pressable,
  ScrollView  } from 'react-native';
import { routing } from '../../actions/actions';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import Overlay from 'react-native-modal-overlay';
import ModalPhotoDocument from '../../Components/ModalPhotoDocument';
import { updateForm } from '../../actions/actions';

function RegisterViewScreen_6 (props) {
  const dispatch = useDispatch();
  const imageSource = props.documentUser.assets && props.documentUser.assets.length > 0 ? { uri: props.documentUser.assets[0].uri } : Images.profilePhoto;
  const [ state , setState ] = useState({})
  const openModal = () => {
    setState({ ...state, modalVisible: true });
  }
  const closeModal = () => {
    setState({ ...state, modalVisible: false });
  };
  const valorInicialNombre = props.formState.formRegister && props.formState.formRegister.name ? props.formState.formRegister.name : '';
  const valorInicialTipoDocumento = props.formState.formRegister && props.formState.formRegister.idType ? props.formState.formRegister.idType : '';
  const valorInicialNumeroDocumento = props.formState.formRegister && props.formState.formRegister.idNumber ? props.formState.formRegister.idNumber : '';
  const valorInicialEmail = props.formState.formRegister && props.formState.formRegister.email ? props.formState.formRegister.email : '';
  const [ nombre , setNombre ] = useState(valorInicialNombre);
  const [ tipoDocumento , setTipoDocumento ] = useState(valorInicialTipoDocumento);
  const [ numeroDocumento , setNumeroDocumento ] = useState(valorInicialNumeroDocumento);
  const [ email , setEmail ] = useState(valorInicialEmail);

  useEffect(() => {
    const actuallyForm = props.formState.formRegister;
     const updatedUser = {
      ...actuallyForm,
      name : nombre,
      idType: tipoDocumento,
      idNumber: numeroDocumento,
     };
     dispatch(updateForm(updatedUser));
   },[ nombre, tipoDocumento, numeroDocumento ])
  
  return (
    <ScrollView style={estilos.contenedor}>
      <View style={estilos.textAndImage}>
        <Text style={{ textAlign: 'center', fontSize : moderateScale(25), width : '60%', marginBottom : 10 }}>Verifica que tus datos estén bien</Text>
        <Image source={imageSource} style={{ width: 150, height: 150, borderRadius : moderateScale(135)  }} />
        <Pressable 
              onPress={()  => openModal()}
            >
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18), color : Colors.$secundario, marginVertical : 10}}>Editar</Text>
        </Pressable>
      </View>
      <View> 
        <View>
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingLeft : '8%', color : Colors.$secundario}}>Nombre y apellido</Text>
          <TextInput
            placeholder='Ingresa tu nombre completo'
            style={[estilos.inputRegister, { fontFamily: Fonts.$poppinsregular }]}
            placeholderTextColor={Colors.$secundario}
            autoComplete={'name'}
            keyboardType={'default'}
            value={nombre}
            onChangeText={(value) => { setNombre(value) }}
            />
        </View>
        <View>
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingLeft : '8%', color : Colors.$secundario}}>Tipo de Documento</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{ label: 'Agregar tipo de documento', value: '' }}
            useNativeAndroidPickerStyle={false}
            value={tipoDocumento}
            onValueChange={(value) => { setTipoDocumento(value)}}
            items={props.idTypes.map(data =>
              ({ label: data.value, value: data.value }))
            }
            Icon={() => {
              return (
                <Image source={Images.iconPickerYellow} style={{ top: 12, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} />
              );
            }}
          />
        </View>
        <View>
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingLeft : '8%', color : Colors.$secundario}}>Número de documento</Text>
          <TextInput
            placeholder='Ingresa tu número de Documento'
            style={[estilos.inputRegister, { fontFamily: Fonts.$poppinsregular }]}
            placeholderTextColor={Colors.$secundario}
            autoCompleteType={'email'}
            keyboardType={'email-address'}
            value={numeroDocumento}
            onChangeText={(value) => { setNumeroDocumento(value)}}
            />
        </View>
        <View>
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingLeft : '8%', color : Colors.$secundario}}>Correo Electrónico</Text>
          <TextInput
            placeholder='Ingresa tu correo electrónico'
            style={[estilos.inputRegister, { fontFamily: Fonts.$poppinsregular }]}
            placeholderTextColor={Colors.$secundario}
            autoCompleteType={'email'}
            keyboardType={'email-address'}
            value={email}
            />
            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(14),  paddingLeft : '8%', color : Colors.$secundario}}>Subir una imagen con un tamaño inferior 250KB </Text>
        </View>
      </View>
      <Overlay
          containerStyle={estilos.overlay}
          visible={state.modalVisible}  
          childrenWrapperStyle={estilos.modalsContainer}
          onClose={closeModal}
          closeOnTouchOutside>
          <ModalPhotoDocument onClosePress={closeModal} />
      </Overlay>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'column',
    width: Dimensions.get("window").width,
    backgroundColor: Colors.$blanco,
    position : 'relative', 
    top : -30
  }, 
  overlay: {
		backgroundColor: "rgba(0,0,0,0.5)",
		zIndex: 5,
	},
  modalsContainer: {
		backgroundColor: Colors.$blanco,
		borderRadius: 10,
		padding: 20,
		paddingTop: moderateScale(45),
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
  textAndImage: {
    justifyContent : 'center',
    alignItems : 'center'
  },
  inputRegister: {
    textAlignVertical : 'bottom',
    fontSize: moderateScale(16),
    paddingLeft: moderateScale(10),
    marginLeft: moderateScale(25),
    marginRight: moderateScale(25),
    paddingVertical:moderateScale(5),
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
  botonItem: {
    backgroundColor: Colors.$primario,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 16,
  },
});

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
    fontSize: moderateScale(18),
  },
  inputAndroid: {
    paddingLeft: moderateScale(10),
    marginLeft: moderateScale(25),
    marginRight: moderateScale(25),
    paddingVertical:moderateScale(5),
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
    fontSize: moderateScale(16),
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
    documentUser: state.userReducer.documentUser,
    idTypes: state.userReducer.idTypes,
    formState: state.userReducer.formRegister,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveDocumentUser: (document) => dispatch(saveDocumentUser(document)),
    routing: (component) => dispatch(routing(component)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterViewScreen_6);